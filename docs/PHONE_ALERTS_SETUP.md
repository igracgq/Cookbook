# Phone alerts (pop-ups on phones): setup

Members can turn on pop-ups on their phone (or computer). When someone comments on or reacts to their photo, or comments
on a photo they also commented on, a pop-up appears, like in other apps. Tapping it opens the cookbook, where the bell
shows what happened.

The cookbook has no server of its own, so a free scheduled job on GitHub sends the pop-ups. **Every 10 minutes it
checks for new notifications and sends them.** GitHub sometimes starts it a few minutes late, so a pop-up usually arrives
within 10 to 20 minutes, not instantly. The bell inside the cookbook is always instant.

No credit card is needed. Everything here is free.

## How it works

1. A member taps **Turn on phone alerts** in the bell. Their phone gives the cookbook a private "address" for pop-ups,
   saved in Firestore (`pushSubscriptions`), where only that member can see it.
2. `.github/workflows/send-push-notifications.yml` runs every 10 minutes. It runs `tools/push/send.mjs`, which looks at the
   newest notifications of each member who has alerts on, sends one pop-up for the ones that are unread and not yet sent,
   and marks them as sent.
3. If several things are new, the member gets one pop-up ("3 new comments and reactions. Latest: ...").

## One-time setup (about 10 minutes)

Do this **before** merging the pull request that adds phone alerts, so the first build of the site already has the key.

### 1. Get a service-account key from Firebase

This lets the GitHub job read the notifications. It is like a password for your database, so keep it private.

1. Firebase console > the gear icon next to **Project Overview** > **Project settings** > **Service accounts**.
2. Click **Generate new private key** > **Generate key**. A small file ending in `.json` downloads.
3. Open that file with Notepad (or any text editor), select everything (Ctrl+A) and copy it (Ctrl+C).

### 2. Save three secrets in GitHub

GitHub repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**. Add these three,
with exactly these names:

| Name | Value |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Everything you copied from the downloaded `.json` file |
| `VITE_VAPID_PUBLIC_KEY` | The **public** push key (given to you in the chat) |
| `VAPID_PRIVATE_KEY` | The **private** push key (given to you in the chat). Treat it like a password |

(The two push keys are a matched pair made for this cookbook. You can make a new pair at any time with
`npx web-push generate-vapid-keys`; then everyone has to turn their alerts on again.)

### 3. Merge, wait for the green tick, and test

1. Merge the pull request. Wait for the green tick in the **Actions** tab (the site rebuilds with the key).
2. In the **Actions** tab, click **Send phone alerts** on the left, then **Run workflow** > **Run workflow**. After
   about a minute it should show a green tick. (Open it and read the last step: it says `Done: {...}`.)
3. After that it runs by itself every 10 minutes.

## For each person

1. Sign in, hard refresh once (Ctrl+Shift+R), tap the **bell**, then **Turn on phone alerts** and tap **Allow** when the
   phone asks.
2. **Android (Chrome):** works in the browser. It works best if the cookbook is added to the home screen
   (menu > Add to Home screen / Install app).
3. **iPhone/iPad:** the cookbook must first be on the Home Screen (Safari > **•••** > **Share** > **Add to Home Screen**; the bell's
   **Show me how** link and Share Cookbook > **Add to Home Screen** show the steps), and
   iOS must be 16.4 or newer. Open the cookbook **from that icon**, then turn alerts on from the bell. It does not work in a
   normal Safari tab.
4. Alerts are per device. Turn them on on each phone or computer that should show pop-ups. Signing out stops that person's
   pop-ups on that device (so a shared phone does not show someone else's); signing back in switches them on again.

## Good to know

- **Delays:** pop-ups are not instant (see above). If someone has the cookbook open and reads the notice in the bell first,
  they may still get the pop-up later unless the notice was already marked read before the next run.
- **Reads:** each run reads a few Firestore documents per member with alerts on. For a family this stays far inside the free
  daily allowance (50,000 reads a day).
- **Paused schedules:** GitHub switches off scheduled jobs in a public repository after 60 days with no activity in it. If
  pop-ups stop, open the **Actions** tab > **Send phone alerts** and click **Enable workflow** (any push to the repository
  also re-arms it).
- **Failure emails:** until the three secrets exist the job does nothing and succeeds. If it ever fails (for example the
  service-account key was deleted), GitHub emails you; read the failing step in the Actions tab.
- **Keep the key safe:** never paste the service-account file or the private push key in chat, in the code, or in an issue.
  If it leaks, delete the key in Firebase console > Project settings > Service accounts (and make a new one).
- **Old devices** that no longer exist (the app was removed) are forgotten automatically the next time a pop-up fails.
- **Tests:** `cd tools/push && npm install && npm test` (needs Java for the Firestore emulator).
