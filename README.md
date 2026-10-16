# Growth Practice v1.0.5 — Adaptive Deep Dive Prompt Update

An update to the existing Growth Practice iPhone-first PWA. This **does not replace or modify** the separate RO Diary or Conflict Training apps.

## Daily workflow

1. Open **Today** with your same four-digit PIN. Today is the day’s actual diary, not a link screen.
2. Record optional **mindfulness** (daily ten-minute breath/noting exercise) and **skill rehearsal**.
3. Add one or more **events** if something worth remembering occurred. Events can be difficult, positive, everyday, or mixed. One brief note is enough. Open **More detail** only when useful.
4. Mark the day complete when you are ready. Everything autosaves; unanswered is not the same as “No.” The completion state reopens if you edit.
5. Move between dates using arrows; **Back to today** restores the current day.

## Rehearsal, now explicit

- **Weekly aim:** After learning that week’s skill, try **three brief 2–5 minute rehearsals**. Wednesday, Friday, and Sunday are suggestions, not mandatory slots. The schedule can be revised with observations.
- **The three Week 1 scenarios are a library, not a three-item homework checklist.** Repeat the same scenario, rotate among them, or create a similarly manageable fictional cue. There is no requirement to complete every scenario once.
- **Solo practice counts:** imagine/read a cue, practice a different response aloud or mentally, and run it again. **ChatGPT-guided rehearsal is optional:** in Learn, copy a scenario into a Skills Training conversation and work through one turn at a time, after first studying the skill.
- On Today, record whether you **Practiced**, **Planned but missed**, or **Did not plan** a rehearsal. When you practiced, specify **On my own**, **With ChatGPT**, or **Other**, with an optional short description.
- A real-world use or missed opportunity belongs in **Events**, not automatically in the rehearsal box. Learning activities are completed only when you actually did them. Practicing in chat does not auto-update the app.

## General-purpose events

New events begin with **Title (optional)** and **What happened?**. Opening **More detail** offers all-optional fields: **Type (difficult/positive/everyday/mixed)**, feelings, body sensations, thoughts/interpretations, urges, actions/social signals, what followed, skills used, and flag for Monday review. This structure is a **custom lightweight event log** inspired by observational distinctions used in standard DBT, Lynch's RO-DBT diary cards, and ACT, **not** a verbatim official worksheet or behavior-chain analysis.

Earlier event records (including older recognition/defensiveness action tags) remain present and appear in a small **Earlier event tags** section. The new form no longer forces those options onto new events. Weekly Markdown and PDF reports include the new fields and retain old tags where they exist.

## Skills reference

The former anger-centered Toolkit is now **Skills** in the same bottom tab position. It offers short reminders for **Strong emotion**, **Avoidance/resistance**, **Lost in thought**, **Connection/listening**, and **Something positive**. The screen marks official approaches and custom adaptations. It is a quick reference, **not** the full training lesson or a crisis/safety plan.

## Learn and Review

Week 1 is assigned. Weeks 2–4 are proposals; Weeks 5–8 remain open/unassigned. Learn contains primary reading, optional video and Tuesday ChatGPT education starter, plus the solo and optional guided rehearsal instructions. Review provides a seven-day log, separate events, editable weekly notes, a copied Markdown report, and a local PDF. Generated PDF and copied reports are **unencrypted** and must be shared intentionally.

## Adaptive weekly deep dive

**Learn → Copy Deep Dive Prompt** is now visible for every selectable week, including weeks with no preassigned resources. After Week 8, the week chooser automatically offers additional weeks based on the calendar, without assigning topics. Paste the copied text into a **new ChatGPT Skills Training chat inside the DBT/RO-DBT/ACT Project**. The prompt directs ChatGPT to read the latest relevant Monday "Next Week Training Brief" and relevant preceding training/rehearsal records in the Library's `Personal Growth Continuity Log.md`. It does **not** send data or read the Library from within the app. If the Monday brief is missing or undecided, ChatGPT should ask for the intended focus rather than use the app's old proposed outline. Week 1 retains the previously agreed STOP / Missing-Links / Fruzzetti material as a fallback.

The original in-app Week 2–4 resources and rehearsal examples remain **provisional previews**; they are not automatically rewritten from the Monday review, and you should not treat them as assigned when a newer focus has been selected. Curriculum copy requires no new permissions, database changes, or automatic synchronization. **Close Session** records the training outcome in the Library without closing the deep-dive chat. **Copy Monday starter** now asks for a formal Next Week Training Brief.

## Updating an existing installation

1. **First, export an encrypted backup** from your working v1.0.4 (or your currently installed version) app (Settings gear). Keep it somewhere private; remember your four-digit PIN.
2. Unzip v1.0.5. Upload the **contents** of the `growth-practice-v1.0.5` folder to the **same GitHub Pages repository, branch, and directory** that host your app. Replace all existing files; keep the `icons` folder and `.nojekyll` file.
3. Wait for GitHub Pages to deploy. Close/reopen the home-screen app and confirm it shows **v1.0.5**. Do **not** uninstall, delete the repository, change the web address, or clear Safari data.
4. Unlock with the **same four-digit PIN**. Inspect one earlier event and one completed learning activity before adding new data.
5. Try one positive event, one avoidance-related event, a solo rehearsal, and a weekly PDF. Use the included `UPGRADE-AND-TEST.md` checklist.

The encrypted vault keeps the same database name (`growth-practice-v1`), data schema and PIN encryption settings. Existing compatible backups remain restorable; restoring any backup **replaces**, rather than merges with, current app records.

## Privacy and limitations

- Local storage uses AES-GCM with a PBKDF2-derived key. A four-digit PIN has only 10,000 combinations, so stolen encrypted backups remain vulnerable to offline guessing. Keep backups protected by your device and private storage.
- No cloud account, analytics, tracking, third-party fonts, external script libraries, or ChatGPT API access. External YouTube links only open when selected. The app must be deployed via HTTPS; GitHub Pages hosts *code only*, not your private diary.
- Automatic lock after five minutes idle, local encrypted export/restore, and offline service worker support remain. Existing data is tied to website origin / installed-app storage; the four-digit PIN cannot be recovered.
- Automated tests covered screen logic, general events, older data, PIN cryptography, copied reports, PDF output, code syntax, and ZIP integrity. **iPhone/Safari browser acceptance and offline behavior still require your real-device check.**
