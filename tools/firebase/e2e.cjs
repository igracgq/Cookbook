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
  await page.waitForSelector('#sign_out_btn', { timeout: 15000 });
  ok(true, 'signed in (emulator Google credential)');

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
  await page.reload(); await page.waitForSelector('#sign_out_btn', { timeout: 15000 });
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
  await p3.waitForSelector('#sign_out_btn', { timeout: 15000 });
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
  await p2.waitForSelector('#sign_out_btn', { timeout: 15000 });
  await p2.click('#back_to_cookbook_btn'); await p2.waitForTimeout(500); await p2.fill('#recipe_search_input', ''); await p2.click('[id^=quick_filter_favorites]'); await p2.waitForTimeout(1500);
  const t2 = await p2.locator('text=/Showing/').first().innerText();
  ok(t2.includes('Showing 1 '), 'favorites follow the account to another device');
  const r = await (await fetch('http://127.0.0.1:8080/v1/projects/demo-cookbook/databases/(default)/documents/recipes', { headers: { Authorization: 'Bearer owner' } })).json();
  const d = r.documents[0].fields;
  ok(/^https:\/\/res\.cloudinary\.com\//.test(d.imageUrl.stringValue) && JSON.stringify(r).length < 5000, 'Firestore recipe holds the Cloudinary URL, no image data');

  // Ann's note follows her account to the second device
  await p2.click('[id^=quick_filter_all_dishes]'); await p2.fill('#recipe_search_input', 'Tiramisu'); await p2.waitForTimeout(700);
  await p2.locator('h3').first().click(); await p2.waitForTimeout(2000);
  ok(await p2.inputValue('#recipe_note_textarea') === 'Ann private basil note', 'private note follows the account to another device');

  // Sign out clears favorites back to defaults
  await page.click('#sign_out_btn'); await page.waitForTimeout(800);
  ok(await page.locator('#auth_btn').count() === 1, 'signed out');
  console.log('page errors:', errs.slice(0, 3));
  await b.close(); srv.close();
})().catch(e => { console.error('E2E ERROR', e); process.exit(2); });
