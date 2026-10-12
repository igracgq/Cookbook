// Tests for send.mjs against the Firestore emulator. Run with `npm test` in this folder (needs Java).
import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { run, describe, buildMessage } from './send.mjs';

let db;
before(() => { initializeApp({ projectId: 'demo-cookbook' }); db = getFirestore(); });
beforeEach(async () => {
  for (const c of ['pushSubscriptions', 'notifications']) {
    for (const d of (await db.collection(c).get()).docs) await d.ref.delete();
  }
  for (const uid of ['dan', 'eve']) {
    for (const d of (await db.collection('notifications').doc(uid).collection('items').get()).docs) await d.ref.delete();
  }
});

const NOW = Date.UTC(2026, 9, 12, 12, 0, 0);
const sub = async (uid, id, endpoint = `https://push.example/${uid}/${id}`) =>
  db.collection('pushSubscriptions').doc(`${uid}_${id}`).set({ uid, endpoint, p256dh: 'p', auth: 'a', createdAt: new Date(NOW) });
const notice = (uid, id, over = {}) => {
  const d = { type: 'comment', photoId: 'photo_x', label: 'Tiramisu', fromUid: 'eve', fromName: 'Eve', text: 'Lovely!', createdAt: new Date(NOW - 60_000), read: false, ...over };
  for (const k of Object.keys(d)) if (d[k] === undefined) delete d[k];   // "text: undefined" means leave it out
  return db.collection('notifications').doc(uid).collection('items').doc(id).set(d);
};
const fakeSender = (failWith = {}) => {
  const calls = [];
  const send = async (subscription, payload) => {
    calls.push({ endpoint: subscription.endpoint, payload: JSON.parse(payload) });
    const err = failWith[subscription.endpoint];
    if (err) throw Object.assign(new Error('push failed'), { statusCode: err });
  };
  return { calls, send };
};
const pushedAt = async (uid, id) => (await db.collection('notifications').doc(uid).collection('items').doc(id).get()).data().pushedAt;

test('the wording of the pop-ups', () => {
  assert.equal(describe({ type: 'comment', fromName: 'Eve', label: 'Tiramisu', text: 'Lovely!' }), 'Eve commented on your photo of Tiramisu: “Lovely!”');
  assert.equal(describe({ type: 'reply', fromName: 'Fay', label: 'Tiramisu' }), 'Fay also commented on the photo of Tiramisu');
  assert.equal(describe({ type: 'reaction', fromName: 'Eve', label: 'Tiramisu', reaction: 'clap' }), 'Eve reacted 👏 to your photo of Tiramisu');
  const two = buildMessage([{ type: 'comment', fromName: 'Eve', label: 'T' }, { type: 'reaction', fromName: 'Ann', label: 'T', reaction: 'love' }]);
  assert.match(two.body, /^2 new comments and reactions\. Latest: Eve commented/);
});

test('sends one pop-up per person with something new, then marks the notices as sent', async () => {
  await sub('dan', 'phone'); await sub('dan', 'tablet');
  await notice('dan', 'n1');
  const { calls, send } = fakeSender();
  const stats = await run({ db, send, now: NOW });
  assert.equal(calls.length, 2);                                                  // both of Dan's devices
  assert.match(calls[0].payload.body, /Eve commented on your photo of Tiramisu/);
  assert.deepEqual([stats.popups, stats.notices], [1, 1]);
  assert.ok(await pushedAt('dan', 'n1'));
  const again = fakeSender();
  await run({ db, send: again.send, now: NOW + 600_000 });
  assert.equal(again.calls.length, 0);                                            // nothing is sent twice
});

test('several new notices become one pop-up', async () => {
  await sub('dan', 'phone');
  await notice('dan', 'n1'); await notice('dan', 'n2', { type: 'reaction', reaction: 'love', text: undefined, createdAt: new Date(NOW - 30_000) });
  const { calls, send } = fakeSender();
  await run({ db, send, now: NOW });
  assert.equal(calls.length, 1);
  assert.match(calls[0].payload.body, /^2 new comments and reactions\. Latest: Eve reacted ❤️/);
  assert.ok(await pushedAt('dan', 'n1') && await pushedAt('dan', 'n2'));
});

test('skips notices that are already read, too old, or belong to people without phone alerts', async () => {
  await sub('dan', 'phone');
  await notice('dan', 'read', { read: true });
  await notice('dan', 'old', { createdAt: new Date(NOW - 2 * 24 * 3600_000) });
  await notice('eve', 'n1');                                                      // Eve has no subscription
  const { calls, send } = fakeSender();
  await run({ db, send, now: NOW });
  assert.equal(calls.length, 0);
  assert.equal(await pushedAt('eve', 'n1'), undefined);
});

test('a device the phone no longer knows is forgotten, and its notices are not retried forever', async () => {
  await sub('dan', 'gone', 'https://push.example/dan/gone');
  await notice('dan', 'n1');
  const { send } = fakeSender({ 'https://push.example/dan/gone': 410 });
  const stats = await run({ db, send, now: NOW });
  assert.equal(stats.devicesRemoved, 1);
  assert.equal((await db.collection('pushSubscriptions').get()).size, 0);
  assert.ok(await pushedAt('dan', 'n1'));
});

test('a temporary failure is retried on the next run', async () => {
  await sub('dan', 'phone', 'https://push.example/dan/phone');
  await notice('dan', 'n1');
  const flaky = fakeSender({ 'https://push.example/dan/phone': 503 });
  const stats = await run({ db, send: flaky.send, now: NOW });
  assert.equal(stats.failures, 1);
  assert.equal(await pushedAt('dan', 'n1'), undefined);                           // still waiting
  assert.equal((await db.collection('pushSubscriptions').get()).size, 1);         // device kept
  const ok = fakeSender();
  await run({ db, send: ok.send, now: NOW + 600_000 });
  assert.equal(ok.calls.length, 1);
  assert.ok(await pushedAt('dan', 'n1'));
});

test('one working device is enough to mark the notices as sent', async () => {
  await sub('dan', 'good', 'https://push.example/dan/good'); await sub('dan', 'bad', 'https://push.example/dan/bad');
  await notice('dan', 'n1');
  const { send } = fakeSender({ 'https://push.example/dan/bad': 503 });
  await run({ db, send, now: NOW });
  assert.ok(await pushedAt('dan', 'n1'));
});
