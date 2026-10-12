# Handoff: Heritage Cookbook (Ruffolo-Vitale family cookbook)

Everything through PR 13 is merged into `main`; start each new piece of work on a new `claude/` branch from the latest `main`. React + Vite app in `src/`, recipe data in
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

## Community features (all in the live site; details in `docs/SHARING_SETUP.md`)

- **Photos section** (top navigation): a feed of every member photo, newest first, then the original cookbook photos.
  Each photo has reactions (like, love, yum, haha, 🙌, 👏), comments with an emoji tray, and (for its owner) a Remove button.
  Code: `src/screens/PhotosScreen.tsx`, `src/components/PhotoPostCard.tsx`, `src/data/photoFeed.ts`.
- **Member photos:** any signed-in member can add any number of photos to any recipe (recipe page: Upload Photo / Take
  Photo). They go to Cloudinary, the URL is saved in Firestore `sharedPhotos`, and they appear on the recipe and at the
  top of Photos. Older single shares (`recipePhotos`) still show. Tapping a recipe photo opens it in Photos, with Back to recipe.
- **Sign-in:** the Sign in buttons open one window (`src/components/SignInDialog.tsx`, state in `src/context/AuthContext.tsx`)
  with Continue with Google, or email and password. Creating an email account asks for a name and needs the emailed link
  clicked before the person can contribute (the rules check `email_verified`). Email/Password must be switched on in
  Firebase > Authentication > Sign-in method (done).
- **Notifications (bell, signed-in members only):** a bell in the header with a red number. It lists who commented on your
  photo, who commented on a photo you also commented on, and who reacted to your photo; tapping one opens that photo.
  Code: `src/components/NotificationBell.tsx`, `src/services/notifications.ts`; Firestore `notifications`. No email.
- **Phone alerts (optional, free):** a pop-up on the member's phone/computer for the same notices. The member turns it on in the bell
  (`PhoneAlerts.tsx`, `src/services/push.ts`, `public/sw.js` push handlers; Web Push with VAPID keys, subscriptions in Firestore
  `pushSubscriptions`). A GitHub Action every 10 minutes (`.github/workflows/send-push-notifications.yml`, `tools/push/send.mjs`)
  sends them, so they arrive 10 to 20 minutes late, not instantly. Needs three GitHub secrets (`FIREBASE_SERVICE_ACCOUNT`,
  `VITE_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`); until they exist it does nothing. Setup: `docs/PHONE_ALERTS_SETUP.md`. iPhones need
  the cookbook on the Home Screen. Instant pop-ups would need Firebase Cloud Functions (paid Blaze plan).
- **Editing a recipe:** the person who added a recipe sees **Edit my recipe** on its page; it opens the Add recipe form filled in
  (`AddRecipeScreen.tsx` with `editRecipeId`, `updateRecipe` in `CommunityContext.tsx`). Only the author can save changes (rules already enforce it).
- **Star ratings:** one per member per recipe; averages show on cards and recipe pages (`recipeRatings`).
- **Owner moderation:** an `admins/{uid}` document (made in the Firebase console) adds Delete (owner) buttons on comments,
  tips, shared recipes and member photos.
- **Share button** on the recipe page (WhatsApp, SMS and so on).
- **After any change to `firestore.rules`,** the owner must paste the file into Firebase Console > Firestore Database > Rules
  and Publish, or the new feature shows "could not be saved".

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
- Changes reach the live site through a pull request into `main`, which GitHub Pages deploys (the owner asks for it).

## Photo storage: what was decided, and what to do later

**Decision (for now): keep member photos on Cloudinary.** Firebase holds the data (people, comments, reactions,
recipes, links to photos); GitHub Pages holds the app and the original cookbook photos. The owner expects no more
than about 1,000 uploaded photos. At roughly 0.5 MB each that is about 0.5 GB, well inside Cloudinary's free plan
(no credit card). The thing to watch is the monthly download allowance, not storage: check usage in the Cloudinary
dashboard now and then. A free Cloudinary account that goes over its allowance is not billed, it is eventually
disabled, so member photos would stop showing.

Why not Firebase Storage for now: since February 2026 it needs the pay-as-you-go (Blaze) plan with a credit card on
file, even when usage stays inside the free quota, and it has no built-in image resizing. It is stronger on security
and tidiness, which is why it is the next step if the family grows.

Do later, in this order of effort:

1. **Tighten the Cloudinary upload preset.** Limit it to image types and a smaller maximum file size, and keep
   `c_limit,w_1600,h_1600,q_auto` as its incoming transformation (never `c_fill`, which crops people out). The preset
   is "unsigned", and its name and the cloud name are visible in the site's code, so anyone who finds them could upload
   to the account.
2. **Serve lighter photos.** Have the app ask Cloudinary for smaller, auto-format versions of each photo (add
   transformations such as `f_auto,q_auto,w_900` to the delivery address). This stretches the free download allowance.
3. **Clean up leftovers.** Deleting a recipe or photo in the app (or in Firebase) does not delete the file in
   Cloudinary; remove those in the Cloudinary Media Library by hand.
4. **Move to Firebase Storage** if the family grows or uploads should be limited to signed-in members. It means putting
   a card on file (set a budget alert), writing a `storage.rules` file, and changing `src/services/cloudinary.ts` to
   upload there and `CommunityContext.tsx` to save the returned address. The Firestore rules already accept only
   Cloudinary addresses for photos (`isCloudinaryUrl`), so they would need updating too.
