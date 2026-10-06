# Handoff: Heritage Cookbook (Ruffolo-Vitale family cookbook)

Branch: `claude/keen-dirac-6pii53` (all work is pushed). React + Vite app in `src/`, recipe data in
`src/data/recipes.json` (1,184 recipes), photos in `public/images/`.

## What is done

- **Photos.** Every recipe has a photo. The 49 recipes from the family book keep their original photos
  (`cook_*.jpg`, shown whole). The other 1,135 each have their own distinct Pixabay photo (`stock_*.jpg`, 640 px,
  shown edge to edge). No Pixabay image is used twice. Credits are in `src/data/photoCredits.json`, shown in
  small type at the bottom of the recipe page and on the Photo Credits tab.
- **Dietary tags.** `tools/dietary/classify.py` writes a `diet` list on every recipe: gluten-free, vegan,
  vegetarian, spicy, poultry, seafood, red-meat. The quick filters (Gluten-Free, Vegan, Spicy Kick, Poultry,
  Seafood, Red Meat) and the recipe-page tags use it. Rules and limits are in `tools/dietary/README.md`.
  Re-run it after editing recipes: `python3 tools/dietary/classify.py`.
- **Home screen.** The family photo (`cook_family.jpg`) replaces the "Family Heirloom Collection" heading.
- **Section buttons** show names only, without page ranges. (The A-Z Index screen still shows page ranges.)
- **Preview artifact:** https://claude.ai/artifact/WFAUZ8LWeKrLpoaExDp31p. It is a snapshot and only changes
  when republished. See `tools/artifact/README.md`.

## Sharing (added last)

Sign-in with Google (Firebase Auth), shared recipes, one shared photo per recipe (Cloudinary, URL saved in
Firestore), and favorites synced to the account. Switched on by the `VITE_FIREBASE_*` and `VITE_CLOUDINARY_*`
values in `.env.local`; the app works without them. Setup, data model and limits: `docs/SHARING_SETUP.md`.
Rules: `firestore.rules`. Tests against the emulators: `tools/firebase/`. The claude.ai artifact preview cannot
use any of it (no network, no sign-in popup), so the artifact shows the buttons switched off.

## Tools

| Path | What it does |
|---|---|
| `tools/stock-photos/README.md` | The photo project, step by step |
| `tools/stock-photos/pixabay.py`, `pixabay_extra.py` | Search Pixabay (needs `PIXABAY_KEY`) |
| `tools/stock-photos/apply_unique.py` | Gives each recipe its own photo from the saved picks |
| `tools/stock-photos/picks/` | The saved candidates and choices (see its README) |
| `tools/stock-photos/fetch_thumbs.py` | Re-downloads candidate thumbnails |
| `tools/dietary/classify.py` | Dietary flags |
| `tools/artifact/build_artifact.py` | Builds the artifact page and photo bundles |
| `tools/firebase/` | Security-rules tests and an end-to-end test against the Firebase emulators |

## Gotchas

- Never commit `node_modules/` or `dist/` (both are in `.gitignore`).
- Run `npm install --no-save --no-package-lock` for dependencies; `npm ci` fails on a lockfile mismatch that
  was already there.
- The `PIXABAY_KEY` environment variable is only needed to search for new photos, not to run or build the app.
- Seven photos (`stock_cantucci_328_5..8`, `stock_buttermilk_biscuits_465_2..4`) were swapped by hand after
  `apply_unique.py`; rerunning it would undo that (details in `tools/stock-photos/picks/README.md`).
- Dietary flags come from the written ingredients only. They are not safe for allergy or celiac decisions.
- Published artifacts cannot hold more than 511 files, which is why the stock photos are bundled.

## Ideas not done

- Remove page ranges from the A-Z Index screen if wanted.
- Some stock photos are loose matches (for example dialect-name pastries); swap individual ones on request.
- The user has not asked for a pull request.
