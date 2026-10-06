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
