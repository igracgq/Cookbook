const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const http = require('http'), fs = require('fs'), path = require('path');
// Serves the emulator build (see README) at /Cookbook/ like GitHub Pages would.
const DIST = process.env.E2E_DIST || '/tmp/e2e_dist';
const FILES = process.env.E2E_FILES || '/tmp/e2e';   // big.jpg (a 4000x3000 photo) and notes.txt (not an image)
const srv = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/Cookbook\/?/, '/');
  let p = path.join(DIST, rel);
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { res.statusCode = 404; return res.end(); }
  const ext = path.extname(p); res.setHeader('content-type', {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.svg':'image/svg+xml'}[ext]||'application/octet-stream');
  fs.createReadStream(p).pipe(res);
}).listen(5173);
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.route('**/fonts.g*/**', r => r.abort());
  let uploads = [];
  await page.route('https://api.cloudinary.com/**', async route => {
    const buf = route.request().postDataBuffer();
    uploads.push({ size: buf ? buf.length : 0, hasPreset: buf && buf.toString('latin1').includes('demo_preset') });
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ secure_url: 'https://res.cloudinary.com/democloud/image/upload/v1/heritage-cookbook/test' + uploads.length + '.png', public_id: 'x' }) });
  });
  const tiny = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await page.route('https://res.cloudinary.com/**', r => r.fulfill({ status: 200, contentType: 'image/png', body: tiny }));

  await page.goto('http://localhost:5173/Cookbook/'); await page.waitForTimeout(2500);
  ok(await page.locator('#auth_btn').isEnabled(), 'sign-in button is enabled when configured');

  await page.evaluate(() => window.__cookbookTestSignIn('ann-uid', 'ann@example.com'));
  await page.waitForSelector('#account_btn', { timeout: 15000 });
  ok(true, 'signed in (emulator Google credential)');
  ok(await page.locator('#account_btn').innerText().then(t => t.trim().length <= 1) && await page.locator('#account_btn svg').count() === 0, 'with no photo the account button shows an initial letter, not an icon');
  ok(await page.locator('#sign_out_btn').count() === 0, 'sign out is tucked away until the account button is tapped');

  // The Google photo shows on the account button, and tapping it offers Sign out
  const ctxP = await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true });
  const pp = await ctxP.newPage();
  await pp.route('**/fonts.g*/**', r => r.abort());
  await pp.route('https://lh3.googleusercontent.com/**', r => r.fulfill({ status: 200, contentType: 'image/png', body: tiny }));
  await pp.goto('http://localhost:5173/Cookbook/'); await pp.waitForTimeout(2500);
  await pp.evaluate(() => window.__cookbookTestSignIn('photo-uid', 'photo@example.com', 'Pia Photo', 'https://lh3.googleusercontent.com/a/test.png'));
  await pp.waitForSelector('#account_btn', { timeout: 15000 });
  ok(await pp.locator('#account_btn img[src^="https://lh3.googleusercontent.com"]').count() === 1, 'the Google account photo is shown on the account button');
  ok(await pp.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'phone header still fits with the photo');
  await pp.click('#account_btn');
  ok((await pp.locator('[role=menu]').innerText()).includes('Pia Photo') && (await pp.locator('[role=menu]').innerText()).includes('photo@example.com'), 'tapping the photo shows the name and email');
  await pp.keyboard.press('Escape'); await pp.waitForTimeout(200);
  ok(await pp.locator('[role=menu]').count() === 0, 'Escape closes the menu');
  await pp.click('#account_btn'); await pp.click('#sign_out_btn'); await pp.waitForSelector('#auth_btn');
  ok(true, 'Sign out in the menu signs the member out');
  await ctxP.close();

  // Favorites sync
  await page.click('[id^=fav_btn_]'); await page.waitForTimeout(800);
  await page.click('[id^=quick_filter_favorites]'); await page.waitForTimeout(600);
  const status = await page.locator('#favorites_sync_status').innerText();
  ok(/saved to your account/.test(status), 'favorites status says saved to account: ' + status);
  const favCount = await page.locator('text=/Showing/').first().innerText();
  console.log('   ', favCount);

  // Add a recipe with a photo; wrong file type first
  await page.click('#nav_add_recipe'); await page.waitForSelector('#add_recipe_screen');
  const fileInput = page.locator('input[type=file]').first();
  await fileInput.setInputFiles(FILES + '/notes.txt'); await page.waitForTimeout(300);
  ok(/Please choose a photo/.test(await page.locator('[role=alert]').innerText()), 'text file is rejected');
  await fileInput.setInputFiles(FILES + '/big.jpg'); await page.waitForTimeout(500);
  ok(await page.locator('img[alt="Chosen photo"]').count() === 1, 'photo preview shown');
  await page.fill('#new_title', 'Zia Ann Test Lasagna');
  await page.fill('#new_servings', '8'); await page.fill('#new_prep', '30 mins'); await page.fill('#new_cook', '1 hr');
  await page.fill('#new_ingredients', '1 lb pasta sheets\n2 cups ricotta\n1 jar sauce');
  await page.fill('#new_steps', 'Layer everything.\nBake until bubbly.');
  await page.click('#save_recipe_btn');
  await page.waitForSelector('text=is now in the cookbook', { timeout: 20000 });
  ok(uploads.length === 1 && uploads[0].hasPreset, 'one upload sent to Cloudinary with the preset');
  ok(uploads[0].size < 1_500_000 && uploads[0].size > 1000, `photo was shrunk before upload (original 4.5+ MB, sent ${(uploads[0].size/1e6).toFixed(2)} MB)`);

  // The recipe appears on cards with the Cloudinary image
  await page.click('text=Back to the cookbook'); await page.waitForTimeout(800);
  await page.click('[id^=quick_filter_all_dishes]');
  await page.fill('#recipe_search_input', 'Zia Ann Test Lasagna'); await page.waitForTimeout(800);
  const card = page.locator('img[src^="https://res.cloudinary.com/democloud"]');
  ok(await card.count() >= 1, 'recipe card shows the Cloudinary image URL');
  ok(await page.locator('text=Shared by').count() >= 1, 'card shows who shared it');
  await page.locator('h3:has-text("Zia Ann Test Lasagna")').first().click(); await page.waitForTimeout(800);
  ok(await page.locator('#shared_photo_panel').count() === 1, 'recipe page opens with the sharing panel');
  ok(await page.locator('img[src^="https://res.cloudinary.com/democloud"]').count() >= 1, 'recipe page shows the image');
  ok(await page.locator('text=Delete my recipe').count() === 1, 'author can delete their recipe');

  // Latest Additions: sits between All Dishes and Favorites, lists added recipes
  await page.click('#back_to_cookbook_btn'); await page.fill('#recipe_search_input', ''); await page.waitForTimeout(500);
  const chips = await page.locator('[id^=quick_filter_]').allInnerTexts();
  ok(chips[0] === 'All Dishes' && chips[1] === 'Latest Additions' && chips[2] === 'Favorites', 'Latest Additions chip sits between All Dishes and Favorites: ' + chips.slice(0, 3).join(' | '));
  await page.click('[id^=quick_filter_latest_additions]'); await page.waitForTimeout(600);
  ok((await page.locator('text=/Showing/').first().innerText()).includes('Showing 1 ') && await page.locator('h3:has-text("Zia Ann Test Lasagna")').count() >= 1, 'Latest Additions lists the recipe that was added');
  await page.click('[id^=quick_filter_all_dishes]');

  // Share a photo on a cookbook recipe
  await page.fill('#recipe_search_input', 'Tiramisu'); await page.waitForTimeout(700);
  await page.locator('h3').first().click(); await page.waitForTimeout(800);
  await page.locator('#shared_photo_panel input[type=file]').setInputFiles(FILES + '/big.jpg');
  await page.waitForSelector('text=Photo shared', { timeout: 20000 });
  await page.waitForTimeout(800);
  ok(await page.locator('img[src^="https://res.cloudinary.com/democloud"]').count() >= 1, 'shared photo shows on a cookbook recipe');
  ok(await page.locator('text=Replace shared photo').count() === 1, 'owner can replace their photo');

  // Private cooking note and shared tip
  ok(/visible to you only/.test(await page.getAttribute('#recipe_note_textarea', 'placeholder')), 'notes box says the notes are visible to you only');
  ok(/Help others by including your own tips on this recipe preparation/.test(await page.getAttribute('#recipe_tip_textarea', 'placeholder')), 'tips box has its hint text');
  await page.fill('#recipe_note_textarea', 'Ann private basil note'); await page.click('#save_recipe_note_btn');
  await page.waitForSelector('text=Saved to your cookbook', { timeout: 10000 });
  await page.fill('#recipe_tip_textarea', 'Rest the dough an extra hour'); await page.click('#share_tip_btn');
  await page.waitForSelector('text=Your tip is shared', { timeout: 10000 });
  ok(true, 'note saved and tip shared');

  // Reload: still there, still signed in
  await page.reload(); await page.waitForSelector('#account_btn', { timeout: 15000 });
  ok(true, 'still signed in after reload');
  await page.fill('#recipe_search_input', 'Tiramisu'); await page.waitForTimeout(700);
  await page.locator('h3').first().click(); await page.waitForTimeout(1500);
  ok(await page.inputValue('#recipe_note_textarea') === 'Ann private basil note', 'private note is still there after reload');
  ok(await page.inputValue('#recipe_tip_textarea') === 'Rest the dough an extra hour', 'own tip is still in the tips box after reload');

  // Second person cannot overwrite that photo
  const ctx2 = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const p2 = await ctx2.newPage();
  await p2.route('**/fonts.g*/**', r => r.abort()); await p2.route('https://res.cloudinary.com/**', r => r.fulfill({ status: 200, contentType: 'image/png', body: tiny }));
  await p2.goto('http://localhost:5173/Cookbook/'); await p2.waitForTimeout(2500);
  await p2.fill('#recipe_search_input', 'Zia Ann Test Lasagna'); await p2.waitForTimeout(1200);
  ok(await p2.locator('img[src^="https://res.cloudinary.com/democloud"]').count() >= 1, 'a signed-out visitor sees the shared recipe and photo');
  await p2.locator('h3:has-text("Zia Ann Test Lasagna")').first().click(); await p2.waitForTimeout(600);
  ok(await p2.locator('text=Sign in to share a photo').count() === 1, 'signed-out visitor is asked to sign in to share');
  ok(await p2.locator('text=Delete my recipe').count() === 0, 'signed-out visitor cannot see delete');

  // A signed-out visitor reads the tip but not the note; another member sees the tip and has no note
  await p2.click('#back_to_cookbook_btn'); await p2.fill('#recipe_search_input', 'Tiramisu'); await p2.waitForTimeout(700);
  await p2.locator('h3').first().click(); await p2.waitForTimeout(1500);
  ok((await p2.locator('#recipe_tips_box').innerText()).includes('Rest the dough an extra hour'), 'a signed-out visitor can read the shared tip');
  ok(await p2.inputValue('#recipe_note_textarea') === '', 'a signed-out visitor does not see the private note');
  ok(await p2.locator('#share_tip_btn').count() === 0 && await p2.locator('text=Sign in to share a tip').count() === 1, 'signed-out visitor is asked to sign in to share a tip');
  const ctx3 = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const p3 = await ctx3.newPage();
  await p3.route('**/fonts.g*/**', r => r.abort()); await p3.route('https://res.cloudinary.com/**', r => r.fulfill({ status: 200, contentType: 'image/png', body: tiny }));
  await p3.goto('http://localhost:5173/Cookbook/'); await p3.waitForTimeout(2500);
  await p3.evaluate(() => window.__cookbookTestSignIn('bob-uid', 'bob@example.com'));
  await p3.waitForSelector('#account_btn', { timeout: 15000 });
  await p3.fill('#recipe_search_input', 'Tiramisu'); await p3.waitForTimeout(700);
  await p3.locator('h3').first().click(); await p3.waitForTimeout(1500);
  ok(await p3.inputValue('#recipe_note_textarea') === '', 'another member does not see Ann\'s private note');
  ok(/tips from others/i.test(await p3.locator('#recipe_tips_box').innerText()) && (await p3.locator('#recipe_tips_box').innerText()).includes('Rest the dough an extra hour'), 'another member sees Ann\'s tip under Tips from others');
  ok(await p3.inputValue('#recipe_tip_textarea') === '', 'another member\'s own tip box starts empty');
  await p3.fill('#recipe_note_textarea', 'Bob note'); await p3.click('#save_recipe_note_btn'); await p3.waitForSelector('text=Saved to your cookbook');
  const allNotes = (await (await fetch('http://127.0.0.1:8080/v1/projects/demo-cookbook/databases/(default)/documents:runQuery', {
    method: 'POST', headers: { Authorization: 'Bearer owner', 'content-type': 'application/json' },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'notes', allDescendants: true }] } }) })).json()).filter(x => x.document).map(x => x.document);
  const ownerOf = text => { const d = allNotes.find(n => n.fields.text.stringValue === text); return d && d.name.split('/users/')[1].split('/')[0]; };
  ok(allNotes.length === 2 && ownerOf('Ann private basil note') && ownerOf('Bob note') && ownerOf('Ann private basil note') !== ownerOf('Bob note'), 'each member\'s note is stored under their own account only');

  // Same account on a second device: favorites follow it; the recipe document holds a URL, not image data
  await p2.evaluate(() => window.__cookbookTestSignIn('ann-uid', 'ann@example.com'));
  await p2.waitForSelector('#account_btn', { timeout: 15000 });
  await p2.click('#back_to_cookbook_btn'); await p2.waitForTimeout(500); await p2.fill('#recipe_search_input', ''); await p2.click('[id^=quick_filter_favorites]'); await p2.waitForTimeout(1500);
  const t2 = await p2.locator('text=/Showing/').first().innerText();
  ok(t2.includes('Showing 1 '), 'favorites follow the account to another device');
  const r = await (await fetch('http://127.0.0.1:8080/v1/projects/demo-cookbook/databases/(default)/documents/recipes', { headers: { Authorization: 'Bearer owner' } })).json();
  const d = r.documents[0].fields;
  ok(/^https:\/\/res\.cloudinary\.com\//.test(d.imageUrl.stringValue) && JSON.stringify(r).length < 5000, 'Firestore recipe holds the Cloudinary URL, no image data');

  // Shopping list: saved to the account, follows it live to the other device, utensils are kept apart
  await page.click('#nav_pantry_desktop'); await page.waitForTimeout(800);
  const choose = page.locator('[id^=choose_recipe_]');
  for (let i = 0; i < 30; i++) { const c = choose.nth(i).locator('xpath=ancestor::div[starts-with(@id,"match_card_")]'); if ((await c.innerText()).includes('Missing:')) { await choose.nth(i).click(); break; } }
  await page.waitForSelector('#missing_panel');
  await page.fill('#extra_item_input', 'wooden spoon'); await page.click('text=Utensil or other'); await page.click('#extra_item_add_btn');
  ok(await page.locator('#extras_list').innerText().then(t => t.includes('wooden spoon') && t.includes('utensil/other')), 'an extra utensil can be added next to the recipe\'s own missing items');
  await page.click('#add_missing_to_list_btn'); await page.waitForTimeout(1500);
  const badge = await page.locator('#shopping_badge').innerText();
  await p2.waitForTimeout(2500);
  ok((await p2.locator('#shopping_badge').innerText()) === badge, 'shopping list follows the account to the other device live (badge ' + badge + ')');
  await page.click('#nav_shopping_list'); await page.waitForSelector('#shopping_list_screen');
  ok(/Saved to your account/.test(await page.locator('#shopping_sync_status').innerText()), 'shopping list says it is saved to the account');
  ok(/Utensils & other/i.test(await page.locator('#shopping_list_screen').innerText()) && /wooden spoon/.test(await page.locator('#shopping_list_screen').innerText()), 'utensils are listed under their own heading');
  const listDocs = (await (await fetch('http://127.0.0.1:8080/v1/projects/demo-cookbook/databases/(default)/documents:runQuery', {
    method: 'POST', headers: { Authorization: 'Bearer owner', 'content-type': 'application/json' },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'lists', allDescendants: true }] } }) })).json()).filter(x => x.document);
  ok(listDocs.length === 1 && JSON.stringify(listDocs).includes('wooden spoon'), 'the list is stored under the member\'s own account');

  // Ann's note follows her account to the second device
  await p2.click('[id^=quick_filter_all_dishes]'); await p2.fill('#recipe_search_input', 'Tiramisu'); await p2.waitForTimeout(700);
  await p2.locator('h3').first().click(); await p2.waitForTimeout(2000);
  ok(await p2.inputValue('#recipe_note_textarea') === 'Ann private basil note', 'private note follows the account to another device');

  // Photos section: shared photos appear at the top, comments are shared live and always shown
  await page.click('#nav_photos_desktop'); await page.waitForSelector('#photos_screen'); await page.waitForTimeout(1500);
  const ids = await page.evaluate(() => [...document.querySelectorAll('article[data-photo-id]')].map(a => a.dataset.photoId));
  ok(ids[0].startsWith('shared_') || ids[0].startsWith('recipe_'), 'a photo members shared is at the top of Photos: ' + ids.slice(0, 3).join(', '));
  ok(ids.includes('shared_tiramisu_classic') && ids.includes('cook_family'), 'the shared Tiramisu photo and the original cookbook photos are all there');
  const post = page.locator('article[data-photo-id="shared_tiramisu_classic"]');
  await post.locator('.comment-input').fill('What a beautiful tiramisu!'); await post.locator('.comment-input').press('Enter');
  await post.locator('[data-comment]').first().waitFor({ timeout: 10000 });
  ok(/What a beautiful tiramisu!/.test(await post.innerText()) && /1 comment/.test(await post.locator('[data-comment-count]').innerText()), 'a signed-in member can comment and the count updates');

  await p3.click('#back_to_cookbook_btn'); await p3.click('#nav_photos_desktop'); await p3.waitForSelector('#photos_screen'); await p3.waitForTimeout(2000);
  const post3 = p3.locator('article[data-photo-id="shared_tiramisu_classic"]');
  ok(/What a beautiful tiramisu!/.test(await post3.innerText()), 'another member sees that comment under the photo');
  ok(await post3.locator('[data-comment] button:has-text("Delete")').count() === 0, 'and cannot delete someone else\'s comment');
  await post3.locator('.comment-input').fill('Agreed, Nonna would love it'); await post3.locator('.comment-input').press('Enter');
  await post3.locator('[data-comment]').nth(1).waitFor({ timeout: 10000 });
  await page.waitForTimeout(1500);
  ok(/Agreed, Nonna would love it/.test(await post.innerText()), 'the second comment shows up live for the first member');

  // Reactions: one per member, shown live to everyone
  const cnt = (loc, type) => loc.locator(`[data-reaction=${type}] [data-reaction-count]`).innerText().catch(() => '0');
  await post.locator('[data-reaction=love]').click(); await page.waitForTimeout(800);
  ok(await post.locator('[data-reaction=love]').getAttribute('aria-pressed') === 'true' && await cnt(post, 'love') === '1', 'a member can react with a heart');
  await post3.locator('[data-reaction=yum]').click(); await page.waitForTimeout(1500);
  ok(await cnt(post, 'yum') === '1' && await cnt(post3, 'love') === '1', 'another member\'s reaction shows up live for the first (and theirs for them)');
  ok(/You/.test(await post.locator('[data-reaction-who]').innerText()) && (await post.locator('[data-reaction-who]').innerText()).includes(' and '), 'the line under the buttons says who reacted: ' + (await post.locator('[data-reaction-who]').innerText()));
  const ctxS = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const ps = await ctxS.newPage();
  await ps.route('**/fonts.g*/**', r => r.abort()); await ps.route('https://res.cloudinary.com/**', r => r.fulfill({ status: 200, contentType: 'image/png', body: tiny }));
  await ps.goto('http://localhost:5173/Cookbook/'); await ps.waitForTimeout(2500);
  await ps.click('#nav_photos_desktop'); await ps.waitForSelector('#photos_screen'); await ps.waitForTimeout(2000);
  const postS = ps.locator('article[data-photo-id="shared_tiramisu_classic"]');
  ok(/What a beautiful tiramisu!/.test(await postS.innerText()) && /Agreed, Nonna/.test(await postS.innerText()), 'a signed-out visitor reads the whole conversation');
  ok(await cnt(postS, 'love') === '1' && await cnt(postS, 'yum') === '1', 'a signed-out visitor sees the reaction counts');
  ok(await postS.locator('.comment-input').count() === 0 && await postS.locator('text=Sign in to comment').count() === 1, 'but is asked to sign in to comment');
  await ctxS.close();

  await post3.locator('[data-reaction=like]').click(); await page.waitForTimeout(1500);   // Bob switches from yum to like
  ok(await cnt(post, 'yum') === '0' && await cnt(post, 'like') === '1', 'switching a reaction moves it (one reaction per member)');
  await post.locator('[data-reaction=love]').click(); await page.waitForTimeout(1500);       // Ann takes hers back
  ok(await cnt(post3, 'love') === '0' && await post.locator('[data-reaction=love]').getAttribute('aria-pressed') === 'false', 'tapping the same reaction again takes it back');
  await post.locator('[data-comment]').first().locator('button:has-text("Delete")').click(); await page.waitForTimeout(1500);
  ok(!/What a beautiful tiramisu!/.test(await post.innerText()), 'a member can delete their own comment');
  await page.reload(); await page.waitForSelector('#account_btn', { timeout: 15000 });
  await page.click('#nav_photos_desktop'); await page.waitForSelector('#photos_screen'); await page.waitForTimeout(2000);
  ok(/Agreed, Nonna would love it/.test(await page.locator('article[data-photo-id="shared_tiramisu_classic"]').innerText()), 'the remaining comment is still there after a reload');

  // Owner moderation: an admins/{uid} document (made in the console) lets the owner delete anyone's post
  const ctxA = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const pa = await ctxA.newPage();
  await pa.route('**/fonts.g*/**', r => r.abort()); await pa.route('https://res.cloudinary.com/**', r => r.fulfill({ status: 200, contentType: 'image/png', body: tiny }));
  await pa.goto('http://localhost:5173/Cookbook/'); await pa.waitForTimeout(2500);
  await pa.evaluate(() => window.__cookbookTestSignIn('root-uid', 'root@example.com'));
  await pa.waitForSelector('#account_btn', { timeout: 15000 });
  const rootUid = await pa.evaluate(() => window.__cookbookTestUid());
  await pa.click('#nav_photos_desktop'); await pa.waitForSelector('#photos_screen'); await pa.waitForTimeout(1500);
  ok(await pa.locator('text=Delete (owner)').count() === 0, 'before being made owner there are no owner delete buttons');
  const mk = await fetch(`http://127.0.0.1:8080/v1/projects/demo-cookbook/databases/(default)/documents/admins/${rootUid}`, {
    method: 'PATCH', headers: { Authorization: 'Bearer owner', 'content-type': 'application/json' }, body: JSON.stringify({ fields: { note: { stringValue: 'owner' } } }) });
  ok(mk.ok, 'owner record created the way you will do it in the console');
  await pa.reload(); await pa.waitForSelector('#account_btn', { timeout: 15000 });
  await pa.click('#nav_photos_desktop'); await pa.waitForSelector('#photos_screen'); await pa.waitForTimeout(2000);
  const postA = pa.locator('article[data-photo-id="shared_tiramisu_classic"]');
  ok(await postA.locator('button:has-text("Delete (owner)")').count() === 1, 'the owner sees a delete button on another member\'s comment');
  ok(await post3.locator('button:has-text("Delete (owner)")').count() === 0, 'an ordinary member does not');
  await postA.locator('button:has-text("Delete (owner)")').click(); await pa.waitForTimeout(1500);
  ok(!/Agreed, Nonna/.test(await postA.innerText()), 'the owner deleted a member\'s comment');
  await page.waitForTimeout(500);
  ok(!/Agreed, Nonna/.test(await page.locator('article[data-photo-id="shared_tiramisu_classic"]').innerText()), 'and it disappeared for everyone else too');
  await pa.click('#nav_explore_desktop'); await pa.fill('#recipe_search_input', 'Tiramisu'); await pa.waitForTimeout(600);
  await pa.locator('h3').first().click(); await pa.waitForSelector('#recipe_tips_box'); await pa.waitForTimeout(1500);
  await pa.locator('#recipe_tips_box button:has-text("Delete (owner)")').click(); await pa.waitForTimeout(1500);
  ok(!/Rest the dough/.test(await pa.locator('#recipe_tips_box').innerText()), 'the owner deleted a member\'s tip');
  await pa.click('#back_to_cookbook_btn'); await pa.fill('#recipe_search_input', 'Zia Ann Test Lasagna'); await pa.waitForTimeout(800);
  await pa.locator('h3:has-text("Zia Ann Test Lasagna")').first().click(); await pa.waitForSelector('#owner_controls');
  await pa.click('#owner_controls >> text=Delete this shared recipe'); await pa.click('#owner_controls >> text=Yes, delete'); await pa.waitForTimeout(1500);
  await pa.fill('#recipe_search_input', 'Zia Ann Test Lasagna'); await pa.waitForTimeout(800);
  ok(await pa.locator('h3:has-text("Zia Ann Test Lasagna")').count() === 0, 'the owner deleted a member\'s shared recipe');
  await ctxA.close();

  // A list made while signed out moves into the account on sign-in, and is not left on the device
  const ctx4 = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const p4 = await ctx4.newPage();
  await p4.route('**/fonts.g*/**', r => r.abort());
  await p4.goto('http://localhost:5173/Cookbook/'); await p4.waitForTimeout(2500);
  await p4.click('#nav_shopping_list'); await p4.waitForSelector('#shopping_list_screen');
  ok(/Sign in to keep your list/.test(await p4.locator('#shopping_sync_status').innerText()), 'signed-out list says it is only on this device');
  await p4.fill('#shopping_add_input', 'cheese grater'); await p4.click('text=Utensil or other'); await p4.press('#shopping_add_input', 'Enter');
  await p4.evaluate(() => window.__cookbookTestSignIn('cara-uid', 'cara@example.com'));
  await p4.waitForSelector('#account_btn', { timeout: 15000 }); await p4.waitForTimeout(2000);
  ok((await p4.locator('#shopping_list_screen').innerText()).includes('cheese grater'), 'item written while signed out is still there after signing in');
  ok(await p4.evaluate(() => localStorage.getItem('heritage_cookbook_shopping')) === null, 'and it is no longer kept on the device');
  const caraLists = JSON.stringify((await (await fetch('http://127.0.0.1:8080/v1/projects/demo-cookbook/databases/(default)/documents:runQuery', {
    method: 'POST', headers: { Authorization: 'Bearer owner', 'content-type': 'application/json' },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'lists', allDescendants: true }] } }) })).json()));
  ok(caraLists.includes('cheese grater') && caraLists.includes('wooden spoon'), 'both members\' lists are saved, each in their own account');

  // After signing out the shared device no longer shows Ann's list
  await page.click('#account_btn'); await page.click('#sign_out_btn'); await page.waitForTimeout(1200);
  ok(await page.locator('#shopping_badge').count() === 0, 'signed-out device does not show the account\'s shopping list');

  ok(await page.locator('#auth_btn').count() === 1, 'signed out');
  console.log('page errors:', errs.slice(0, 3));
  await b.close(); srv.close();
})().catch(e => { console.error('E2E ERROR', e); process.exit(2); });
