# Growth Practice — Integrated Personal Growth App

**Version 1.0.0 — Initial working beta**  
**Built:** October 15, 2026  
**Initial content:** Week 1 — standard DBT STOP, Linehan Missing-Links Analysis, and Alan Fruzzetti's *The High-Conflict Couple* Chapter 3.

## What this release does

This is a standalone, local-first iPhone-oriented Progressive Web App. It does **not** replace, overwrite, synchronize, or migrate the existing `ro-diary` or `conflict-training` installations. It uses its own IndexedDB storage (`growth-practice-v1`).

The five primary screens follow the daily / weekly workflow:

1. **Today**: daily 10-minute breath-anchored noting practice, real-life awareness cue, evening diary, Week 1 shortcut; on Monday it emphasizes the weekly review, on Tuesday the learning session.
2. **Diary**: practice *versus* real-world opportunity and behavior; meaningful answers stay distinct from unanswered; optional observation/interpretation notes, review flag, and deliberate completion status.
3. **Learn**: Week 1 verified reading references, source summaries, video link, practice examples, and one-click copyable ChatGPT prompts. Reading, video, and deep-dive marks are **user-controlled**, not automatically completed.
4. **Toolkit**: quick standard-DBT STOP steps; a separate custom application for remaining engaged without retaliation, while preserving the right to set boundaries or take a break when needed. A quick path back to diary.
5. **Review**: Monday–Sunday weekly overview, archived weeks, optional review notes, locally generated PDF, copyable Markdown for a new ChatGPT Monday review, and a copyable Monday review prompt.

Settings (gear): lock, encrypted backup, encrypted restore, limitations and privacy reminders.

### Original sources and labels

- STOP and Missing-Links Analysis are **standard DBT** skills from Linehan, not RO-DBT lessons.
- Chapter 3 material from Fruzzetti is **DBT-informed relationship work**.
- The sequence `catch → interrupt → choose`, diary categories, and high-activation examples are **custom integration**, not author-attributed protocols.
- RO Journal / formal Lynch self-enquiry is **not** integrated or automatically assessed in this version.
- Brené Brown emotion vocabulary is an optional reading reference, not a copyrighted full glossary reproduced in the app.

## Installation via GitHub's website — no computer administration access needed

**Use a NEW repository**, e.g. `growth-practice`. Do not upload this ZIP's files into `ro-diary` or `conflict-training`.

1. Download the ZIP, extract it, and open the `integrated-growth-v1` folder.
2. On GitHub's website, create a new repository such as `growth-practice`. For the easiest deployment, make it public. **Public means the app's generic HTML/JS/CSS is visible to anyone; it does not publish encrypted personal entries.** Never commit personal diary data or backup files.
3. Use **Add file → Upload files** to upload the files **inside** the extracted folder (`index.html`, `.nojekyll`, `styles.css`, `app.js`, `content.js`, `pdf-export.js`, `sw.js`, `manifest.webmanifest`, `icons/`, etc.) to the repository root. GitHub's web uploader may not upload the hidden `.nojekyll`; you can use Create new file to make one later if needed.
4. Commit the files. Go to **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save**. Allow deployment to complete. If your GitHub account is `barnettcb` and the repository is `growth-practice`, the expected URL would be `https://barnettcb.github.io/growth-practice/` *once deployed*. This URL is an example and is **not claimed live**.
5. Open the GitHub Pages URL in **Safari on iPhone**. When ready, use **Share → Add to Home Screen**. Creating a Home Screen icon is optional; the app also works in supported HTTPS browsers.
6. First launch: create a **strong passphrase of at least 12 characters**. Save it in a password manager. Data is encrypted with this passphrase on that device. Do not rely on a four-digit PIN; that would not be a suitable encryption root.
7. Go to **Learn** for Week 1, **Diary** for daily tracking, **Toolkit** for quick reference, and **Review** on Monday. Create a test entry first, then make an encrypted backup through Settings.

## Daily behavior

- **Meditation:** ten minutes of breath-anchored noting is the planned routine. Select `Practiced` and adjust minutes if different from ten. `Did not` and `Unclear` are explicit answers. Unanswered remains blank.
- **Rehearsal:** distinguishes `Rehearsed`, `Not done`, and `Not scheduled`.
- **Real-life opportunity:** distinguishes `Yes`, `No`, and `Not sure`. If yes, record when you noticed the response and what you actually did.
- **Notes:** keep observations and interpretations separate. A Monday-review flag is optional. An entry is complete **only** when you press Mark daily entry complete, not when you start entering it.
- **Editing older weeks:** the prior calendar week's diary opens read-only. Use Unlock past week to edit deliberately. Review-note edits of older weeks are also explicitly unlocked.

## Privacy, backup, and data-loss warnings

- **Local encryption:** IndexedDB stores an AES-256-GCM encrypted state. A passphrase-derived key uses PBKDF2-SHA-256 with 600,000 iterations and a per-vault random salt. No plaintext diary or personal practice data is included in code, manifest, URLs, localStorage, analytics, or remote storage.
- **Local-only:** There is no server, API, AI integration, automatic backup, multi-device sync, or remote therapist access. Changing browser/app context may result in a distinct local vault. Installing on another device starts a distinct empty vault until you restore a backup.
- **Passphrase:** No recovery/reset is implemented. Use a password manager. The app locks after five minutes of inactivity or after at least five minutes in background. iPhone-specific background/biometric behavior is not certified yet.
- **Backup:** Settings exports an AES-GCM encrypted `.igpbackup` file protected by a *separate* passphrase (12+ characters, PBKDF2 600,000 rounds). Keep the file and the passphrase. Test restoring into an empty/test vault before relying on it. Restore replaces existing V1 data after confirmation.
- **PDF / ChatGPT clipboard:** Review PDF and copied Markdown are **unencrypted** by design, for intentional sharing. Avoid accidentally storing or pasting them publicly. The PDF has the original RO Diary standalone report painter lineage and is tested as a valid PDF; its built-in font supports basic Latin text. Unusual Unicode may transliterate or render as `?`; use Markdown export for exact wording if necessary.
- **Backups are essential:** iOS/Safari website data may be deleted by device/software cleanup, browser changes, or app removal. Encrypted on-device data is not equivalent to an independent backup.
- **Keep one active tab:** Simultaneous use in multiple browser tabs is not supported and could overwrite later edits. Use a single instance at a time.
- **Video link:** The instructional video opens on YouTube, which requires internet and has its own privacy practices. The offline app never loads YouTube unless you choose to open the link.
- **Not a clinical app:** No therapist notifications, crisis service, safety monitoring, treatment outcome measurement, or diagnostic interpretation. Use judgment and professional supports appropriate to the situation.

## Updating later

Replace app code files at the same `growth-practice` GitHub Pages path, preserving the storage origin. Make an encrypted backup **before every update**. Do not rename the database or delete website data until a migration has been tested. The service worker is versioned (`growth-practice-v1.0.0`) for cache updates. Week 2+ curricula will be added in a later release. Do not mark Week 1 mastered automatically when the calendar changes.

## Verification performed for this ZIP

- JavaScript syntax check for all JS sources.
- Scripted rendering tests: Today, Diary, Learn, Toolkit, Review, Settings, and locked/read-only archive.
- AES-GCM local state encrypted/decrypted in a simulated storage environment; wrong-passphrase rejection, and no plaintext visible in simulated stored ciphertext.
- Encrypted backup creation and decryption round-trip in the same test environment.
- PDF generator created a valid US Letter PDF; verified with `pdfinfo`, extracted using `pdftotext`, and rendered for visual inspection. Long unbroken notes were exercised.
- Existing `ro-diary-beta-0.5.14.zip` and `conflict-training-beta-0.2.0(1).zip` were inspected; this release is intentionally independent.

**Not yet verified:** full interaction test in a real browser, iPhone 16 Pro on iOS, GitHub Pages deployment, PWA installation, offline use on device, iOS download/share flows, independent backup/restore on an actual device, and actual future week rollover. Container-managed Chromium blocked navigation during automated end-to-end testing. Treat this as a *working initial beta*, not a certified production deployment.

## Files

- `index.html` — entry screen and strict resource policy
- `styles.css` — responsive phone-first layout and safe-area sizing
- `app.js` — encrypted state, screens, daily records, actions, backups, exports, locks
- `content.js` — Week 1 lesson and copyable ChatGPT prompts
- `pdf-export.js` — local PDF generator adapted from RO Diary's PDF layout engine
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA install/offline assets
- `WEEK-1-GUIDE.md` — standalone Week 1 reference for optional use outside app
- `.nojekyll` — GitHub Pages static-asset compatibility
