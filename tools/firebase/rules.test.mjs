// Tests for ../../firestore.rules. Run with `npm test` in this folder (needs Java for the Firestore emulator).
import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';

let env;
const google = { firebase: { sign_in_provider: 'google.com' } };
const as = (uid, token = google) => env.authenticatedContext(uid, token).firestore();
const IMG = 'https://res.cloudinary.com/democloud/image/upload/v1/heritage-cookbook/a.jpg';

const recipe = (uid, over = {}) => ({
  title: 'Sunday Gravy', category: 'PASTA_AND_SAUCES', servings: '6', prepTime: '20 mins', cookTime: '3 hrs',
  ingredients: ['2 cans tomatoes'], instructions: ['Simmer.'], notes: '', imageUrl: IMG,
  authorUid: uid, authorName: 'Ann', createdAt: serverTimestamp(), ...over
});
const photo = (uid, over = {}) => ({ imageUrl: IMG, uploadedBy: uid, uploadedByName: 'Ann', updatedAt: serverTimestamp(), ...over });

before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-cookbook', firestore: { rules: readFileSync('../../firestore.rules', 'utf8') } });
});
after(async () => { await env.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });

test('anyone can read recipes and photos, signed out too', async () => {
  await env.withSecurityRulesDisabled(async c => { await setDoc(doc(c.firestore(), 'recipes/r1'), { title: 'x' }); });
  const anon = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(anon, 'recipes/r1')));
  await assertSucceeds(getDoc(doc(anon, 'recipePhotos/some_recipe')));
});

test('signed-out visitors cannot add anything', async () => {
  const anon = env.unauthenticatedContext().firestore();
  await assertFails(setDoc(doc(anon, 'recipes/r1'), recipe('x')));
  await assertFails(setDoc(doc(anon, 'recipePhotos/r1'), photo('x')));
});

test('only Google sign-in counts', async () => {
  const guest = as('g1', { firebase: { sign_in_provider: 'anonymous' } });
  await assertFails(setDoc(doc(guest, 'recipes/r1'), recipe('g1')));
});

test('a signed-in member can add a recipe with a Cloudinary photo URL', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'recipes/r1'), recipe('u1')));
  await assertSucceeds(setDoc(doc(as('u1'), 'recipes/r2'), recipe('u1', { imageUrl: '' })));
});

test('recipes are validated', async () => {
  const db = as('u1');
  await assertFails(setDoc(doc(db, 'recipes/a'), recipe('someone-else')));               // not your name
  await assertFails(setDoc(doc(db, 'recipes/b'), recipe('u1', { imageUrl: 'https://example.com/a.jpg' })));
  await assertFails(setDoc(doc(db, 'recipes/c'), recipe('u1', { imageUrl: 'data:image/png;base64,AAAA' }))); // no image data
  await assertFails(setDoc(doc(db, 'recipes/d'), recipe('u1', { category: 'NOPE' })));
  await assertFails(setDoc(doc(db, 'recipes/e'), recipe('u1', { title: '' })));
  await assertFails(setDoc(doc(db, 'recipes/f'), recipe('u1', { ingredients: [] })));
  await assertFails(setDoc(doc(db, 'recipes/g'), recipe('u1', { extra: 'field' })));
  await assertFails(setDoc(doc(db, 'recipes/h'), recipe('u1', { createdAt: new Date('2001-01-01') })));
});

test('only the author can change or delete a recipe', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'recipes/r1'), recipe('u1', { imageUrl: '' })));
  await assertFails(updateDoc(doc(as('u2'), 'recipes/r1'), { imageUrl: IMG }));
  await assertFails(deleteDoc(doc(as('u2'), 'recipes/r1')));
  await assertSucceeds(updateDoc(doc(as('u1'), 'recipes/r1'), { imageUrl: IMG }));
  await assertFails(updateDoc(doc(as('u1'), 'recipes/r1'), { authorUid: 'u2' }));
  await assertSucceeds(deleteDoc(doc(as('u1'), 'recipes/r1')));
});

test('one shared photo per recipe, owned by whoever shared it', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'recipePhotos/pasta_fresca'), photo('u1')));
  await assertFails(setDoc(doc(as('u2'), 'recipePhotos/pasta_fresca'), photo('u2')));     // cannot take over
  await assertFails(deleteDoc(doc(as('u2'), 'recipePhotos/pasta_fresca')));
  await assertSucceeds(setDoc(doc(as('u1'), 'recipePhotos/pasta_fresca'), photo('u1')));  // owner replaces
  await assertSucceeds(deleteDoc(doc(as('u1'), 'recipePhotos/pasta_fresca')));
});

test('shared photos must be Cloudinary URLs and carry your own uid', async () => {
  const db = as('u1');
  await assertFails(setDoc(doc(db, 'recipePhotos/x'), photo('u1', { imageUrl: 'https://evil.example/a.jpg' })));
  await assertFails(setDoc(doc(db, 'recipePhotos/x'), photo('u2')));
  await assertFails(setDoc(doc(db, 'recipePhotos/x'), photo('u1', { extra: 1 })));
  await assertFails(setDoc(doc(db, 'recipePhotos/bad id with spaces'), photo('u1')));
});

test('favorites and profile are private to each member', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'users/u1'), { displayName: 'Ann', photoURL: '', lastSignIn: serverTimestamp() }, { merge: true }));
  await assertSucceeds(setDoc(doc(as('u1'), 'users/u1'), { favorites: arrayUnion('pasta_fresca') }, { merge: true }));
  await assertSucceeds(getDoc(doc(as('u1'), 'users/u1')));
  await assertFails(getDoc(doc(as('u2'), 'users/u1')));
  await assertFails(setDoc(doc(as('u2'), 'users/u1'), { favorites: ['x'] }, { merge: true }));
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'users/u1')));
  await assertFails(setDoc(doc(as('u1'), 'users/u1'), { isAdmin: true }, { merge: true }));
});

test('unknown collections are closed', async () => {
  await assertFails(setDoc(doc(as('u1'), 'whatever/x'), { a: 1 }));
  await assertFails(getDoc(doc(as('u1'), 'whatever/x')));
});

const note = (over = {}) => ({ text: 'Added extra basil', updatedAt: serverTimestamp(), ...over });
const tip = (over = {}) => ({ text: 'Rest the dough an extra hour', authorName: 'Ann', updatedAt: serverTimestamp(), ...over });

test('cooking notes are private to their owner', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'users/u1/notes/pasta_fresca'), note()));
  await assertSucceeds(getDoc(doc(as('u1'), 'users/u1/notes/pasta_fresca')));
  await assertFails(getDoc(doc(as('u2'), 'users/u1/notes/pasta_fresca')));                 // another member
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'users/u1/notes/pasta_fresca')));
  await assertFails(setDoc(doc(as('u2'), 'users/u1/notes/pasta_fresca'), note()));         // cannot write to someone else
  await assertFails(deleteDoc(doc(as('u2'), 'users/u1/notes/pasta_fresca')));
  await assertSucceeds(deleteDoc(doc(as('u1'), 'users/u1/notes/pasta_fresca')));
});

test('cooking notes are validated', async () => {
  const db = as('u1');
  await assertFails(setDoc(doc(db, 'users/u1/notes/a'), note({ text: 'x'.repeat(5001) })));
  await assertFails(setDoc(doc(db, 'users/u1/notes/b'), note({ extra: 1 })));
  await assertFails(setDoc(doc(db, 'users/u1/notes/c'), note({ updatedAt: new Date('2001-01-01') })));
  await assertFails(setDoc(doc(db, 'users/u1/notes/bad id!'), note()));
});

test('everyone can read tips, only the author writes theirs', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'recipeTips/pasta_fresca/tips/u1'), tip()));
  await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), 'recipeTips/pasta_fresca/tips/u1'))); // signed out reads
  await assertSucceeds(getDoc(doc(as('u2'), 'recipeTips/pasta_fresca/tips/u1')));
  await assertFails(setDoc(doc(as('u2'), 'recipeTips/pasta_fresca/tips/u1'), tip()));      // not your tip
  await assertFails(deleteDoc(doc(as('u2'), 'recipeTips/pasta_fresca/tips/u1')));
  await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), 'recipeTips/pasta_fresca/tips/u3'), tip()));
  await assertSucceeds(setDoc(doc(as('u1'), 'recipeTips/pasta_fresca/tips/u1'), tip({ text: 'Updated' })));
  await assertSucceeds(deleteDoc(doc(as('u1'), 'recipeTips/pasta_fresca/tips/u1')));
});

test('tips are validated', async () => {
  const db = as('u1');
  await assertFails(setDoc(doc(db, 'recipeTips/r/tips/u1'), tip({ text: '' })));
  await assertFails(setDoc(doc(db, 'recipeTips/r/tips/u1'), tip({ text: 'x'.repeat(1001) })));
  await assertFails(setDoc(doc(db, 'recipeTips/r/tips/u1'), tip({ extra: 'field' })));
  await assertFails(setDoc(doc(db, 'recipeTips/r/tips/u1'), tip({ updatedAt: new Date('2001-01-01') })));
  const guest = as('g1', { firebase: { sign_in_provider: 'anonymous' } });
  await assertFails(setDoc(doc(guest, 'recipeTips/r/tips/g1'), tip()));                     // Google sign-in only
});

const list = (over = {}) => ({ items: [{ key: 'basil', name: 'basil', needs: [], bought: false }], updatedAt: serverTimestamp(), ...over });

test('the shopping list is private to its owner', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'users/u1/lists/shopping'), list()));
  await assertSucceeds(getDoc(doc(as('u1'), 'users/u1/lists/shopping')));
  await assertFails(getDoc(doc(as('u2'), 'users/u1/lists/shopping')));
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'users/u1/lists/shopping')));
  await assertFails(setDoc(doc(as('u2'), 'users/u1/lists/shopping'), list()));
  await assertFails(deleteDoc(doc(as('u2'), 'users/u1/lists/shopping')));
  await assertSucceeds(deleteDoc(doc(as('u1'), 'users/u1/lists/shopping')));
});

test('the shopping list is validated', async () => {
  const db = as('u1');
  await assertFails(setDoc(doc(db, 'users/u1/lists/other'), list()));                         // only the "shopping" list
  await assertFails(setDoc(doc(db, 'users/u1/lists/shopping'), list({ items: 'basil' })));
  await assertFails(setDoc(doc(db, 'users/u1/lists/shopping'), list({ items: Array(301).fill({ key: 'a' }) })));
  await assertFails(setDoc(doc(db, 'users/u1/lists/shopping'), list({ extra: 1 })));
  await assertFails(setDoc(doc(db, 'users/u1/lists/shopping'), list({ updatedAt: new Date('2001-01-01') })));
  const guest = as('g1', { firebase: { sign_in_provider: 'anonymous' } });
  await assertFails(setDoc(doc(guest, 'users/g1/lists/shopping'), list()));
});

const comment = (uid, over = {}) => ({ text: 'Looks delicious!', authorUid: uid, authorName: 'Ann', authorPhoto: 'https://lh3.googleusercontent.com/a/x', createdAt: serverTimestamp(), ...over });

test('everyone reads photo comments; signed-in members add their own', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'photoComments/cook_p195_1/comments/c1'), comment('u1')));
  await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), 'photoComments/cook_p195_1/comments/c1')));
  await assertSucceeds(getDoc(doc(as('u2'), 'photoComments/cook_p195_1/comments/c1')));
  await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), 'photoComments/cook_p195_1/comments/c2'), comment('x')));
  await assertFails(setDoc(doc(as('u2'), 'photoComments/cook_p195_1/comments/c3'), comment('u1')));   // not under someone else's name
  const guest = as('g1', { firebase: { sign_in_provider: 'anonymous' } });
  await assertFails(setDoc(doc(guest, 'photoComments/cook_p195_1/comments/c4'), comment('g1')));
});

test('only the author deletes a comment, and comments cannot be edited', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'photoComments/shared_r1/comments/c1'), comment('u1')));
  await assertFails(deleteDoc(doc(as('u2'), 'photoComments/shared_r1/comments/c1')));
  await assertFails(updateDoc(doc(as('u1'), 'photoComments/shared_r1/comments/c1'), { text: 'changed' }));
  await assertSucceeds(deleteDoc(doc(as('u1'), 'photoComments/shared_r1/comments/c1')));
});

test('photo comments are validated', async () => {
  const db = as('u1');
  await assertFails(setDoc(doc(db, 'photoComments/p/comments/a'), comment('u1', { text: '' })));
  await assertFails(setDoc(doc(db, 'photoComments/p/comments/b'), comment('u1', { text: 'x'.repeat(1001) })));
  await assertFails(setDoc(doc(db, 'photoComments/p/comments/c'), comment('u1', { extra: 1 })));
  await assertFails(setDoc(doc(db, 'photoComments/p/comments/d'), comment('u1', { createdAt: new Date('2001-01-01') })));
  await assertFails(setDoc(doc(db, 'photoComments/bad id!/comments/e'), comment('u1')));
  const noPhoto = comment('u1'); delete noPhoto.authorPhoto;                                    // the Google photo is optional
  await assertSucceeds(setDoc(doc(db, 'photoComments/p/comments/f'), noPhoto));
});

const reaction = (over = {}) => ({ type: 'love', authorName: 'Ann', updatedAt: serverTimestamp(), ...over });

test('everyone sees reactions; members set, change and remove only their own', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'photoReactions/cook_p195_1/reactions/u1'), reaction()));
  await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), 'photoReactions/cook_p195_1/reactions/u1')));
  await assertSucceeds(setDoc(doc(as('u1'), 'photoReactions/cook_p195_1/reactions/u1'), reaction({ type: 'yum' })));   // change it
  await assertFails(setDoc(doc(as('u2'), 'photoReactions/cook_p195_1/reactions/u1'), reaction()));                     // not someone else's
  await assertFails(deleteDoc(doc(as('u2'), 'photoReactions/cook_p195_1/reactions/u1')));
  await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), 'photoReactions/cook_p195_1/reactions/x'), reaction()));
  await assertSucceeds(deleteDoc(doc(as('u1'), 'photoReactions/cook_p195_1/reactions/u1')));
});

test('reactions are validated', async () => {
  const db = as('u1');
  for (const t of ['like', 'love', 'yum', 'haha']) await assertSucceeds(setDoc(doc(db, 'photoReactions/p/reactions/u1'), reaction({ type: t })));
  await assertFails(setDoc(doc(db, 'photoReactions/p/reactions/u1'), reaction({ type: 'angry' })));
  await assertFails(setDoc(doc(db, 'photoReactions/p/reactions/u1'), reaction({ extra: 1 })));
  await assertFails(setDoc(doc(db, 'photoReactions/p/reactions/u1'), reaction({ updatedAt: new Date('2001-01-01') })));
  await assertFails(setDoc(doc(db, 'photoReactions/bad id!/reactions/u1'), reaction()));
  const guest = as('g1', { firebase: { sign_in_provider: 'anonymous' } });
  await assertFails(setDoc(doc(guest, 'photoReactions/p/reactions/g1'), reaction()));
});

const makeAdmin = uid => env.withSecurityRulesDisabled(async c => { await setDoc(doc(c.firestore(), `admins/${uid}`), { note: 'owner' }); });

test('an admin can delete anything members posted, an ordinary member cannot', async () => {
  await makeAdmin('boss');
  await env.withSecurityRulesDisabled(async c => {
    const f = c.firestore();
    await setDoc(doc(f, 'photoComments/p/comments/c1'), { text: 'hi', authorUid: 'u1', authorName: 'Ann', createdAt: new Date() });
    await setDoc(doc(f, 'recipeTips/r/tips/u1'), { text: 'tip', authorName: 'Ann', updatedAt: new Date() });
    await setDoc(doc(f, 'recipes/r1'), { title: 'x', authorUid: 'u1' });
    await setDoc(doc(f, 'recipePhotos/r2'), { imageUrl: IMG, uploadedBy: 'u1' });
  });
  const paths = ['photoComments/p/comments/c1', 'recipeTips/r/tips/u1', 'recipes/r1', 'recipePhotos/r2'];
  for (const p of paths) await assertFails(deleteDoc(doc(as('u2'), p)));          // another member: no
  for (const p of paths) await assertSucceeds(deleteDoc(doc(as('boss'), p)));     // the owner: yes
});

test('admin rights cannot be granted from the app', async () => {
  await assertFails(setDoc(doc(as('u1'), 'admins/u1'), { note: 'me' }));           // nobody can make themselves admin
  await makeAdmin('boss');
  await assertSucceeds(getDoc(doc(as('boss'), 'admins/boss')));                    // you can check your own status
  await assertFails(getDoc(doc(as('u1'), 'admins/boss')));                         // but not anyone else's
  await assertFails(setDoc(doc(as('boss'), 'admins/boss'), { note: 'x' }));        // and not even an admin writes it
  await assertFails(deleteDoc(doc(as('boss'), 'admins/boss')));
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'admins/boss')));
});

test('an admin still cannot post as someone else or edit', async () => {
  await makeAdmin('boss');
  await assertFails(setDoc(doc(as('boss'), 'photoComments/p/comments/z'), { text: 'hi', authorUid: 'u1', authorName: 'Ann', createdAt: serverTimestamp() }));
  await assertFails(setDoc(doc(as('boss'), 'recipeTips/r/tips/u1'), { text: 'tip', authorName: 'Ann', updatedAt: serverTimestamp() }));
});

const rating = (uid, recipeId, stars, over = {}) => ({ recipeId, uid, stars, updatedAt: serverTimestamp(), ...over });

test('everyone reads ratings; a member sets, changes and removes only their own', async () => {
  await assertSucceeds(setDoc(doc(as('u1'), 'recipeRatings/pasta_fresca__u1'), rating('u1', 'pasta_fresca', 5)));
  await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), 'recipeRatings/pasta_fresca__u1')));
  await assertSucceeds(setDoc(doc(as('u1'), 'recipeRatings/pasta_fresca__u1'), rating('u1', 'pasta_fresca', 3)));     // change it
  await assertFails(setDoc(doc(as('u2'), 'recipeRatings/pasta_fresca__u1'), rating('u1', 'pasta_fresca', 1)));        // not under someone else's name
  await assertFails(setDoc(doc(as('u2'), 'recipeRatings/pasta_fresca__u2'), rating('u1', 'pasta_fresca', 1)));        // uid must match
  await assertFails(deleteDoc(doc(as('u2'), 'recipeRatings/pasta_fresca__u1')));
  await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), 'recipeRatings/pasta_fresca__x'), rating('x', 'pasta_fresca', 4)));
  await assertSucceeds(deleteDoc(doc(as('u1'), 'recipeRatings/pasta_fresca__u1')));
});

test('ratings are validated: 1 to 5 whole stars, one per member per recipe', async () => {
  const db = as('u1');
  for (const n of [1, 2, 3, 4, 5]) await assertSucceeds(setDoc(doc(db, 'recipeRatings/r__u1'), rating('u1', 'r', n)));
  await assertFails(setDoc(doc(db, 'recipeRatings/r__u1'), rating('u1', 'r', 0)));
  await assertFails(setDoc(doc(db, 'recipeRatings/r__u1'), rating('u1', 'r', 6)));
  await assertFails(setDoc(doc(db, 'recipeRatings/r__u1'), rating('u1', 'r', 4.5)));
  await assertFails(setDoc(doc(db, 'recipeRatings/r__u1'), rating('u1', 'r', '5')));
  await assertFails(setDoc(doc(db, 'recipeRatings/r2__u1'), rating('u1', 'r', 5)));                                     // id must match the recipe
  await assertFails(setDoc(doc(db, 'recipeRatings/anything'), rating('u1', 'r', 5)));                                   // so one rating per recipe
  await assertFails(setDoc(doc(db, 'recipeRatings/r__u1'), rating('u1', 'r', 5, { extra: 1 })));
  await assertFails(setDoc(doc(db, 'recipeRatings/r__u1'), rating('u1', 'r', 5, { updatedAt: new Date('2001-01-01') })));
  const guest = as('g1', { firebase: { sign_in_provider: 'anonymous' } });
  await assertFails(setDoc(doc(guest, 'recipeRatings/r__g1'), rating('g1', 'r', 5)));
});
