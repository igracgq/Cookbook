# Working on the cookbook on your own computer (VS Code)

Everything lives in the GitHub repository `igracgq/Cookbook`. This guide copies it to your computer, runs it there, and
sends changes back. No passwords are stored in the repository; you create one small private file (`.env.local`) on your
own computer.

## 1. Install three free things (once)

1. **Git**: https://git-scm.com/downloads (accept the default options).
2. **Node.js 22 (LTS)**: https://nodejs.org (download the LTS installer; accept the defaults).
3. **VS Code**: https://code.visualstudio.com

Restart VS Code after installing Git and Node.

## 2. Copy the project into a new folder

1. In VS Code press **Ctrl+Shift+P**, type **Git: Clone**, press Enter.
2. Paste `https://github.com/igracgq/Cookbook.git` and press Enter.
3. Pick a folder to put it in (for example Documents). VS Code creates a new folder called `Cookbook` inside it.
4. Click **Open** when it asks. If a window asks you to sign in to GitHub, sign in (you need this later to send changes back).

This brings in all the code, recipes, photos, rules, tests and the documents in `docs/` and `HANDOFF.md`.

## 3. Install what the app needs

In VS Code open the terminal (**Ctrl+`**, the key above Tab) and run:

```
npm install --no-save --no-package-lock
```

It takes a minute or two. (The `--no-...` parts stop it from changing project files.)

## 4. Create your private `.env.local` file

The app works without it (you can browse the recipes), but sign-in, sharing, photos, comments and notifications switch on only
when these values are present.

1. In VS Code's file list (Explorer, left side), right-click an empty space in the top-level `Cookbook` folder (next to
   `package.json`) and choose **New File**.
2. Name it exactly `.env.local` (with the dot at the start).
3. Paste this in, then replace each `...` with the value from the table below:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
VITE_VAPID_PUBLIC_KEY=...
```

No spaces around `=`, no quotes. Save the file (Ctrl+S).

| Line | Where to find the value |
|---|---|
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` | Firebase console (project `heritage-cookbook`) > the gear icon > **Project settings** > **General** > scroll to **Your apps** > the web app > **SDK setup and configuration** > **Config**. The four values are `apiKey`, `authDomain`, `projectId`, `appId`. |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard: **Cloud name**, near the top. |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary > **Settings** (gear) > **Upload** > **Upload presets**: the name of the **Unsigned** preset the cookbook uses. |
| `VITE_VAPID_PUBLIC_KEY` | Optional (only for testing phone alerts). The public push key. It is also saved as a GitHub secret with the same name. If you lost it, leave the line out. |

**Where the values live today:** the same six or seven values are saved as **GitHub secrets** (repository > Settings > Secrets
and variables > Actions) so the website can be built. GitHub never shows a secret again after it is saved, which is why you copy
the values from Firebase and Cloudinary instead. The Firebase and Cloudinary values above are not really secret: they end up in the
published website's code. The security comes from the Firestore rules.

**Not needed on your computer, and never to be put in `.env.local`, chat or the code:**
- `FIREBASE_SERVICE_ACCOUNT` (the downloaded service-account `.json` file) and `VAPID_PRIVATE_KEY`. They live only as GitHub secrets
  and are used by the scheduled phone-alert job. See `docs/PHONE_ALERTS_SETUP.md`.

`.env.local` is listed in `.gitignore`, so Git never uploads it.

## 5. Run it

In the terminal:

```
npm run dev
```

Open http://localhost:3000. To try it on your phone (same Wi-Fi), open `http://<your-computer's-address>:3000` on the phone;
the terminal shows the "Network" address. Google sign-in works on `localhost`; on another address, add it under Firebase >
Authentication > Settings > Authorised domains first.

**Careful:** this uses your real Firebase and Cloudinary, so anything you post while testing (recipes, photos, comments) goes
into the real cookbook. Delete test items afterwards.

Other commands: `npm run build` (the full production build and type check).

## 6. Send changes back

1. Make your changes (or let Claude make them).
2. Left side: **Source Control** (branch icon). Click **+** next to the changed files, type a message, click **Commit**.
3. Work on a branch, not `main`: **Ctrl+Shift+P > Git: Create Branch**, before committing. Then click **Publish Branch**.
4. On github.com open a **Pull Request** from that branch into `main`. Merging it publishes the website (the green tick in the
   **Actions** tab, then a hard refresh: Ctrl+Shift+R).
5. Anything that changes `firestore.rules` must also be pasted into Firebase console > Firestore Database > Rules > Publish.

## Using Claude in VS Code

Install the **Claude Code** extension, open the `Cookbook` folder, and start with the prompt in `HANDOFF.md`'s first lines ("Read
HANDOFF.md first..."). `HANDOFF.md` is the project's memory: what exists, how the owner likes to work, and the gotchas.

## Google AI Studio

The project started in AI Studio, so it is still a normal React + Vite app, but it has grown past what AI Studio is built for
(GitHub Actions deploys, Firebase rules, tests, scheduled jobs). If you open it there:
- Make sure AI Studio works on a **branch**, never directly on `main`, and read the changes in the pull request before merging. A
  tool that rewrites `vite.config.ts` (the `/Cookbook/` base path), `package.json` or the `.github/workflows` files can break the
  live site.
- Add the same `VITE_...` values wherever AI Studio keeps its environment variables or secrets.
- `app/`, `build.gradle.kts` and similar files are an old Android project from the start of the project. The website does not use
  them.

## Optional: the automated tests

`tools/firebase` (security rules and the browser test) and `tools/push` need Java and the Firebase emulators. Their `README.md`
files explain them. You normally do not need these.
