# Growth Practice — v1.0.3 (daily-first beta)

**This is an update to Growth Practice v1.0.2, not a replacement for the separate RO Diary or Conflict Training apps.**

## Daily flow

Open the app, enter the existing four-digit PIN, and land directly on **Today**. Record mindfulness and rehearsal, then add any number of real-life events. An event can be a short note; optional fields for recognition, actions, feelings, and interpretations stay collapsed until needed. Tap **Mark complete** if you want to mark the day finished. Entries autosave before and after completion.

Use **Today** arrows for earlier days and **Back to today** to return. Earlier calendar weeks open read-only and require a deliberate unlock to edit. The bottom bar shows only **Today · Learn · Toolkit · Review**. The gear opens **Settings** and encrypted backups. A short link on the Today header opens that day's lesson.

In Learn, choose Week 1–8. Week 1 is the current assigned training; Weeks 2–4 are provisional and Weeks 5–8 are unassigned placeholders. Read, watch, and manually mark activities after doing them. **Copy lesson starter** copies text for a **new Tuesday ChatGPT Skills Training chat**. **Copy for ChatGPT** copies a fictional guided rehearsal prompt for that chat. The app does not communicate with ChatGPT; nothing is completed automatically.

## What changed since v1.0.2

- Removed separate Home and link-only Today pages, merging the actionable Daily Diary into the landing screen.
- Reduced navigation from six entries to four, with Settings behind the gear.
- Kept day navigation and direct return to today in the daily entry.
- Collapsed optional event details. Multiple events per day remain supported.
- Removed the separate real-world opportunity question for new entries: event count or a deliberate **No events to note** now indicates what was noticed. Earlier opportunity-only values remain in the encrypted vault and still appear in historical reports.
- Shortened repetitive UI descriptions, using optional **Details** disclosures in Learn.
- Replaced the weekly Opportunity table column with Events; weekly PDF and copied reports retain individual observations.
- Preserved Week 1 assignments, proposed Weeks 2–4, open Weeks 5–8, four-digit PIN, backups, encryption, and auto-lock behavior.

## Updating an existing GitHub Pages installation

1. **Before uploading**, open the currently installed v1.0.2 app and download a fresh encrypted backup from Settings. Securely store the file and remember your PIN. The four-digit PIN offers **weak protection if someone steals the file**, even though the backup is encrypted.
2. Download and extract the new v1.0.3 ZIP. Open the folder `growth-practice-v1.0.3`.
3. Upload **the files inside that folder** to the **same GitHub repository, same branch, and same root location** as before. Replace existing files, including `app.js`, `styles.css`, `content.js`, `pdf-export.js`, `sw.js`, `index.html`, the manifest, and docs. Keep the `icons` directory.
4. Wait for GitHub Pages deployment. Close and reopen the home-screen app. Confirm the header displays **v1.0.3**. If the old layout appears, let the site finish deploying, reopen or refresh the same installed app. Do **not** clear Safari website data or delete the Home Screen app to force the update.
5. Enter the same four-digit PIN and verify older entries, Week 1 learning marks, and one weekly PDF. Only then start using the new flow.

**Do not create a new repository, change the GitHub Pages URL, delete old vault data, or uninstall the app.** Local IndexedDB storage is tied to the origin (website address) and Safari installation context. Backups are essential; this app has no remote sync or PIN recovery.

## New installation

Upload all files to the root of a new GitHub Pages repository, enable Pages, open the site using HTTPS in Safari, and choose Add to Home Screen. Set a four-digit PIN when first opening the app. This app uses its **own** local database `growth-practice-v1` rather than either predecessor app's storage.

## Security and limitations

- Personal entries are encrypted locally with AES-GCM. The PIN-derived key uses PBKDF2 with 600,000 iterations and a random salt. A four-digit PIN offers only 10,000 combinations; this **does not provide strong offline resistance** if an attacker obtains the encrypted vault or backup.
- The PIN cannot be recovered. A new install or a separate Safari installation context may not see an existing vault; restore from an encrypted backup when appropriate.
- The app has no analytics, remote database, external fonts/scripts, or automatic AI access. A linked YouTube lesson only loads when opened manually.
- Weekly PDFs, copied Markdown reports, and prompts pasted into ChatGPT are **unencrypted**. Review and share them intentionally.
- Older v1.0.0 backups protected by a long passphrase remain supported, subject to entering that original passphrase.
- This is a self-directed training tool, not a clinical assessment, therapist access portal, or emergency service. The skills source labels are maintained (Linehan = standard DBT, Fruzzetti = DBT-informed relationship work, custom applications are identified).
- Actual on-device iPhone/Safari acceptance testing, offline PWA operation, and Github Pages deployment cannot be certified by this container's headless Chromium, which timed out on local navigation. See `UPGRADE-AND-TEST.md`.

## Contents

`index.html`, `styles.css`, `app.js`, `content.js`, `pdf-export.js`, `manifest.webmanifest`, `sw.js`, `icons/`, `WEEK-1-GUIDE.md`, `UPGRADE-AND-TEST.md`, `.nojekyll`.
