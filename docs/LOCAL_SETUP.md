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
npm ci
```

It takes a minute or two. (`npm ci` installs exactly the tested versions listed in `package-lock.json` and never changes project
files.)

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

## Switching between VS Code and Claude Code

The GitHub repository is the single source of truth. Each Claude Code cloud session starts by copying the latest code from
GitHub, and VS Code works on a copy on your computer. To move between them without losing anything:

1. **Push before you switch.** Changes that exist only on your computer (unsaved, uncommitted or unpushed) are invisible to Claude.
   In VS Code: **Source Control**, write a message, **Commit**, then **Sync Changes** (or **Publish Branch**).
2. **Merge it, or give Claude the branch name.** If your work is on a branch that is not merged, start the next Claude session with
   "continue from branch `<name>`". Otherwise Claude starts from `main` and will not see it.
3. **Pull before you start in VS Code.** On `main`: **Ctrl+Shift+P > Git: Pull**. That brings in what Claude merged. (If you are on
   a branch, first **Git: Checkout to...** `main`.) Run `npm ci` again if `package.json` changed.
4. **One at a time.** Do not edit the same files in both places at once; that causes merge conflicts. Finish and merge in one
   place, then switch.
5. **Keep `HANDOFF.md` current.** It is the shared memory between sessions. At the end of a session ask: "Update HANDOFF.md with
   everything we did and anything I still need to set up."
6. **Things outside the code stay as they are** whichever tool you use: GitHub secrets, Firebase settings, and `firestore.rules`
   (pasted into Firebase console by hand whenever it changes).

## Testing a change on your computer before it goes live

Claude puts every change on a branch with a pull request, and nothing is live until it is merged. To try one yourself first:

1. Tell Claude to **hold** the pull request ("hold this one, I will test it"). Claude then leaves it open and does not merge it.
2. In VS Code open the `Cookbook` folder. **Ctrl+Shift+P > Git: Fetch**, then **Git: Checkout to...** and choose the branch named in the
   pull request (it starts with `claude/`; pick the `origin/...` entry).
3. In the terminal: `npm ci`, then `npm run dev`, and open http://localhost:3000.
4. If the change touched `firestore.rules`, paste the new file into Firebase console > Firestore Database > Rules > Publish **before**
   you test, or the new feature will say it "could not be saved". Publishing early is harmless: the live site keeps working.
5. Try it. When you are happy, tell Claude to merge. To go back to the old version afterwards: **Git: Checkout to... `main`**, then
   **Git: Pull**.

Good to know:
- It uses your real Firebase and Cloudinary, so anything you post while testing is real. Delete test items afterwards.
- **Phone-size look:** in Chrome press F12 then Ctrl+Shift+M (the phone icon) to see the phone layout on your computer.
- **On a real phone** over your Wi-Fi: open `http://<your-computer's-address>:3000` (the terminal prints it). Google sign-in works only on
  `localhost`, so on the phone use email and password, or add that address under Firebase > Authentication > Settings > Authorised domains.
- **Phone alerts and the installed app** only work on the live site, not on `localhost`.
- To check the real production build (the `/Cookbook/` address and the offline cache): `npm run build`, then `npm run preview`.

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
