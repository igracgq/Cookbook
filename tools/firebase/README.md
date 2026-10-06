# Firebase tests

Run `npm install` here first. Java is needed for the emulators.

- `npm test`: checks `firestore.rules` (`rules.test.mjs`).
- `npm run e2e`: runs `e2e.cjs`, which drives the app in Chromium against the Auth and Firestore emulators.
  Cloudinary is mocked. It needs:
  1. An emulator build of the app: copy `.env.example` to `.env.local`, set the `VITE_FIREBASE_*` values to anything,
     `VITE_FIREBASE_PROJECT_ID=demo-cookbook`, `VITE_FIREBASE_EMULATOR=true` and any Cloudinary names, then
     `npx vite build --outDir /tmp/e2e_dist` from the repo root. Delete `.env.local` afterwards.
  2. Playwright (`PLAYWRIGHT_PATH` points at its folder) with a Chromium.
  3. Test files in `/tmp/e2e`: `big.jpg` (any 4000 x 3000 photo) and `notes.txt` (any text file).
     Override with `E2E_DIST` and `E2E_FILES`.

The emulator build adds a `window.__cookbookTestSignIn` helper, because Google's sign-in popup cannot be driven
offline. It is only compiled in when `VITE_FIREBASE_EMULATOR=true`.
