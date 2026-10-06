# Recipe sharing, shared photos and favorites sync: setup

Signed-in family members can add recipes, share one photo per recipe, and keep their favorites across devices.
Everything here is optional. Until the values below are filled in, the cookbook works exactly as before and the
Sign in and Add recipe buttons explain that sharing is not switched on.

| Part | Service | What it stores |
|---|---|---|
| Who is signed in | Firebase Authentication (Google sign-in) | The Google account |
| Members, recipes, shared-photo links, favorites | Cloud Firestore | Text, plus the **URL** of each photo |
| The photos themselves | Cloudinary | Resized JPEGs |

Firebase Cloud Storage is not used, and no image data is ever put in Firestore.

## 1. Firebase

1. Create a project at https://console.firebase.google.com.
2. **Authentication > Sign-in method:** turn on **Google**.
3. **Authentication > Settings > Authorised domains:** add the address the cookbook is served from
   (for GitHub Pages that is `igracgq.github.io`). `localhost` is there already for local testing.
4. **Firestore Database:** create a database in production mode.
5. **Project settings > Your apps:** add a **Web app** and copy its config values.
6. Publish the security rules in this repo (`firestore.rules`):
   `npm install -g firebase-tools`, then `firebase login`, then
   `firebase deploy --only firestore:rules --project <your-project-id>`.
   You can also paste the file into **Firestore > Rules** in the console.

## 2. Cloudinary

1. Create a free account at https://cloudinary.com and note the **cloud name** on the dashboard.
2. **Settings > Upload > Upload presets > Add upload preset.** Set **Signing mode: Unsigned**, give it a name,
   and in the preset restrict it: allowed formats `jpg, png, webp`, a small maximum file size (a few MB),
   and an incoming transformation that limits images to 1600 x 1600. The app already resizes photos before
   uploading; these limits make sure nobody can bypass that.

## 3. Give the app the values

Copy `.env.example` to `.env.local` and fill it in (the file is ignored by git):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

Then `npm install`, `npm run dev` to try it, or `npm run build` for the real site. The values are baked into
the built files when you build, so build with them present. Firebase web config values are not secrets; the
security rules are what protect the data.

### Putting the site online without a computer (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes the site from the `main` branch. One-time setup on GitHub:

1. **Settings > Pages > Build and deployment > Source:** choose **GitHub Actions**.
2. **Settings > Secrets and variables > Actions > New repository secret.** Add six secrets with exactly these
   names, each with the value from the matching `.env.local` line: `VITE_FIREBASE_API_KEY`,
   `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`,
   `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`.
3. Merge the work into `main` (or run the workflow by hand from the **Actions** tab). The site appears at
   `https://<your-user>.github.io/Cookbook/` after a minute or two.
4. In Firebase, make sure `<your-user>.github.io` is under **Authentication > Settings > Authorised domains**.

### If the repository is private: Netlify instead of GitHub Pages

GitHub Pages needs a public repository on the free plan. Netlify's free plan can publish from a private one.
`netlify.toml` already holds the build settings.

1. Sign up at https://netlify.com with your GitHub account.
2. **Add new site > Import an existing project > GitHub**, allow it to see the repository, and pick `Cookbook`.
3. Choose the branch to publish (`main`, or the working branch to try it before merging). Netlify reads the
   build settings from `netlify.toml`.
4. Before deploying, open **Environment variables** and add the six `VITE_*` values (same names as above).
5. Deploy. Add the address Netlify gives you (for example `something.netlify.app`) to Firebase **Authentication >
   Settings > Authorised domains**.

Either way the published site is public: anyone with the link can read the cookbook.

## What members can do

- **Anyone** (signed in or not) can read all recipes and photos.
- **Signed in with Google** can add a recipe (name, section, times, ingredients, steps, notes, one optional photo),
  share one photo for any cookbook recipe, favorite recipes (saved to the account), and delete their own recipe.
- A photo shared on a cookbook recipe replaces the illustrative stock photo for everyone. Only the person who
  shared it can replace or remove it. The photo on a shared recipe belongs to whoever added the recipe.
- Photos: image files only (JPEG, PNG, WebP, HEIC), at most 15 MB chosen, shrunk to 1600 px on the long side and
  re-encoded as JPEG before upload.

## Data in Firestore

- `users/{uid}`: `displayName`, `photoURL`, `lastSignIn`, `favorites` (list of recipe ids). Only that member can read or write it.
- `recipes/{id}`: a shared recipe, with `imageUrl` (a `https://res.cloudinary.com/...` URL, or empty), `authorUid`, `authorName`, `createdAt` and the recipe text.
- `users/{uid}/notes/{recipeId}`: a member's private cooking note (`text`, `updatedAt`). Only that member can read or write it. Signed out, notes stay in the browser on that device instead.
- `users/{uid}/lists/shopping`: the member's shopping list (`items`, `updatedAt`). Only that member can read or write it. Signed out, the list stays in the browser on that device instead.
- `recipeTips/{recipeId}/tips/{uid}`: the tip a member shares with everyone for a recipe (`text`, `authorName`, `updatedAt`). Anyone can read; only that member can write or remove theirs.
- `recipePhotos/{recipeId}`: the one shared photo for a cookbook recipe: `imageUrl`, `uploadedBy`, `uploadedByName`, `updatedAt`.

## Limits worth knowing

- **Any Google account can sign in and contribute.** That is what "signed-in users can contribute" means in the
  rules. To limit it to family, add an allowed-emails check to `signedIn()` in `firestore.rules`.
- The Cloudinary preset is unsigned, so anyone who finds the cloud name and preset name in the built site could
  upload to your Cloudinary account. The preset limits (formats, size, folder) and Cloudinary's usage quota
  bound the damage. Signed uploads would need a small server (for example a Firebase Cloud Function).
- Replacing or deleting a photo or recipe removes the link in Firestore; the old file stays in Cloudinary
  (the browser cannot delete it with an unsigned preset). Clear them out from the Cloudinary media library.
- Firestore rules cannot check the length of each ingredient or step line, only how many lines there are. The
  form enforces the per-line limits.
- Shared recipes do not get the dietary tags (gluten-free, vegan and so on), so they do not appear in those filters.
- Sign-in uses a Google popup. It does not work inside the claude.ai artifact preview, which blocks it. Use the
  deployed site or `npm run dev`.

## Tests

`tools/firebase/` has tests that run against the Firebase emulators (Java is needed):

- `npm test` checks the security rules (who can read, create, change and delete what).
- `npm run e2e` drives the real app in a browser against the Auth and Firestore emulators: sign in, favorites sync,
  adding a recipe with a photo, sharing a photo, and signed-out behaviour. Cloudinary is replaced by a stand-in.
  See `tools/firebase/README.md` for how to build the app for it.

## After updating the app

Whenever `firestore.rules` changes (most recently for the shopping list), paste the whole file into
Firebase console > Firestore Database > Rules and click **Publish**. Until then the new features show "could not be saved".
