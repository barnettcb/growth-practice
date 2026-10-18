# Growth Practice v1.0.9 — Incident Review and Focused Deep Dive Update

An update to the existing Growth Practice iPhone-first PWA. This **does not replace or modify** the separate RO Diary or Conflict Training apps.

## Daily workflow

1. Open **Today** with your same four-digit PIN. Today is the day’s actual diary, not a link screen.
2. Record optional **mindfulness** (daily ten-minute breath/noting exercise) and **skill rehearsal**.
3. Add one or more **events** if something worth remembering occurred. Events can be difficult, positive, everyday, or mixed. One brief note is enough. Open **More detail** only when useful.
4. Mark the day complete when you are ready. Everything autosaves; unanswered is not the same as “No.” The completion state reopens if you edit.
5. Move between dates using arrows; **Back to today** restores the current day.

## Rehearsal, now explicit

- **Weekly aim:** After learning the relevant unit component, an initial option is **three brief 2–5 minute rehearsals** if feasible; this is not a mastery threshold. Wednesday, Friday, and Sunday are suggestions, not mandatory slots. The schedule can be revised with observations.
- **The seven Learning Unit 1 scenario/analysis choices are a library, not a seven-item homework checklist.** Repeat a useful scenario, choose a different skill area, or create a similarly manageable ordinary cue. There is no requirement to complete every scenario once.
- **Solo practice counts:** imagine/read a cue, practice a different response aloud or mentally, and run it again. **ChatGPT-guided rehearsal is optional:** in Learn, copy a scenario into a Skills Training conversation and work through one turn at a time, after first studying the skill.
- On Today, record whether you **Practiced**, **Planned but missed**, or **Did not plan** a rehearsal. When you practiced, specify **On my own**, **With ChatGPT**, or **Other**, with an optional short description.
- A real-world use or missed opportunity belongs in **Events**, not automatically in the rehearsal box. Learning activities are completed only when you actually did them. Practicing in chat does not auto-update the app.

## General-purpose events

New events begin with **Title (optional)** and **What happened?**. Opening **More detail** offers all-optional fields: **Type (difficult/positive/everyday/mixed)**, feelings, body sensations, thoughts/interpretations, urges, actions/social signals, what followed, skills used, and flag for Monday review. This structure is a **custom lightweight event log** inspired by observational distinctions used in standard DBT, Lynch's RO-DBT diary cards, and ACT, **not** a verbatim official worksheet or behavior-chain analysis.

Earlier event records (including older recognition/defensiveness action tags) remain present and appear in a small **Earlier event tags** section. The new form no longer forces those options onto new events. Weekly Markdown and PDF reports include the new fields and retain old tags where they exist.

## Skills reference

The former anger-centered Toolkit is now **Skills** in the same bottom tab position. It offers short reminders for **Strong emotion**, **Avoidance/resistance**, **Lost in thought**, **Connection/listening**, and **Something positive**. The screen marks official approaches and custom adaptations. It is a quick reference, **not** the full training lesson or a crisis/safety plan.

## Learn and Review — Learning units rather than automatic calendar weeks

**Learning Unit 1 is rebuilt** in `LEARNING-UNIT-01.md`: Wise Mind; Observe/Describe/Effectively; Fruzzetti Chapter 2 prerequisite and Chapter 3 alternative-response rehearsal; STOP and its Proceed Mindfully component; Missing-Links versus Chain Analysis; a limited ACT comparison. See `PROGRAM-MAP.md` for the broader provisional capability/method rationale. **The old fixed Week 2–4 topic previews have been retired**. Units 2 onward remain unassigned in the app, and the user may remain in one learning unit for many calendar weeks. The selected **Learning unit** stays put until changed manually; dates no longer advance it.

The Learn screen offers **Copy Deep Dive Prompt** for every unit and a diverse set of seven Unit 1 practice/analysis scenarios rather than three mostly STOP-focused stories. For unassigned units, **Copy adaptive guided rehearsal** asks ChatGPT to retrieve the latest *actually taught* skill. The app doesn't directly know which unit the Library assigned; a user must change the unit selector after deciding to advance. Past lesson completion values are retained in the encrypted vault; retired preview resources are simply no longer displayed as active assignments.

Weekly Review still tracks seven-day **calendar** periods. Its copied starter requests a **Next Learning Unit Brief** that explicitly says whether to continue, deepen or advance; it does not automatically increment the unit. The review report labels the active unit *at export*, which must not be interpreted as the unit of historical dates without contemporaneous tags. PDF and Markdown copied reports are unencrypted.

## Deep dive, session records, and external sources

The Deep Dive Prompt tells ChatGPT to consult the **latest Personal Growth Operating Protocol (v1.7 at packaging)**, the **Capability and Methods Map**, the **Learning Unit 01 guide** (for Unit 1), and relevant session continuity records in Space/Library. It requests cross-source review, essential prerequisites, actual editions/page checks, method comparison and a lesson-to-rehearsal coverage table. App buttons copy text only and **do not** retrieve Library documents, submit chats, or save `Close Session` records.

## Updating an existing installation

1. **First, export an encrypted backup** from your working v1.0.8 (or your currently installed version) app (Settings gear). Keep it somewhere private; remember your four-digit PIN.
2. Unzip v1.0.9. Upload the **contents** of the `growth-practice-v1.0.9` folder to the **same GitHub Pages repository, branch, and directory** that host your app. Replace all existing files; keep the `icons` folder and `.nojekyll` file.
3. Wait for GitHub Pages to deploy. Close/reopen the home-screen app and confirm it shows **v1.0.9**. Do **not** uninstall, delete the repository, change the web address, or clear Safari data.
4. Unlock with the **same four-digit PIN**. Inspect one earlier event and one completed learning activity before adding new data.
5. Try one positive event, one avoidance-related event, a solo rehearsal, and a weekly PDF. Use the included `UPGRADE-AND-TEST.md` checklist.

The encrypted vault keeps the same database name (`growth-practice-v1`), data schema and PIN encryption settings. Existing compatible backups remain restorable; restoring any backup **replaces**, rather than merges with, current app records.

## Privacy and limitations

- Local storage uses AES-GCM with a PBKDF2-derived key. A four-digit PIN has only 10,000 combinations, so stolen encrypted backups remain vulnerable to offline guessing. Keep backups protected by your device and private storage.
- No cloud account, analytics, tracking, third-party fonts, external script libraries, or ChatGPT API access. External YouTube links only open when selected. The app must be deployed via HTTPS; GitHub Pages hosts *code only*, not your private diary.
- Automatic lock after five minutes idle, local encrypted export/restore, and offline service worker support remain. Existing data is tied to website origin / installed-app storage; the four-digit PIN cannot be recovered.
- Automated tests covered screen logic, general events, older data, PIN cryptography, copied reports, PDF output, code syntax, and ZIP integrity. **iPhone/Safari browser acceptance and offline behavior still require your real-device check.**

## v1.0.8 spiral-practice addition (preserved)

Learn and Skills now have **Copy Quick Recall Prompt** and **Copy Cumulative Rehearsal**. Neither button retrieves Space data by itself, changes completion flags, or logs a rehearsal. The pasted ChatGPT prompt asks to confirm *which skills were actually introduced*, uses brief retrieval before hints, and combines no more than two previously taught components in an everyday scenario. If only one skill has been taught, the prompt varies that single skill rather than inventing a prior curriculum. Monday's prompt chooses a small earlier-skill revisit in the Next Learning Unit Brief, rather than an app-imposed due date. Record any actual practice in Today (note the skill, actual attempt, and source of evidence). These are custom educational supports, not official therapy skills or proof of transfer to real life.

## v1.0.8 topic-linked teaching videos (preserved)

The Learn screen shows optional, externally hosted videos **directly under each relevant reading** rather than on a disconnected videos page. Dr. Jennifer May videos are listed under Wise Mind, DBT What/How skills, STOP, and urge management (which complements Fruzzetti Chapter 3 but is not its official video). Missing-Links and Fruzzetti Chapter 2 retain their primary printed assignments and no falsely attributed video.

The URLs were checked against the curated video listings at https://jamesfitzgeraldtherapy.com/dbt-media-library/ (October 17, 2026). Current playback and full contents could not be independently confirmed. Selecting a video opens YouTube externally: it never changes a reading checkbox or sends data to ChatGPT. Video watching is supplementary, not automatically a completion requirement.

## v1.0.9: source-matched Incident Review and resume-first training prompts

- **Skills → Copy Incident Review Prompt** opens a new Project ChatGPT conversation after you paste it. It does not send your private entries; share only the context you choose. It routes between a brief context review, a complete Linehan Chain Analysis for a relevant ineffective action that occurred, Missing-Links for an intended effective action not performed, or a source-grounded alternative. Ordinary review is intentionally bounded; a full source worksheet is not reduced to a four-question generic hybrid. No new mandatory diary field or data type was added.
- **Learn → Copy Deep Dive Prompt** now resumes the current unit's next unfinished component rather than requesting a full audit and rebuilt curriculum each session. The present Library Operating Protocol and unit guide control. All existing v1.0.8 video links and cumulative practice remain.
- **Compatibility:** unchanged IndexedDB `growth-practice-v1`, state `schema:1`, and PIN/backup formats. Upload the files from `growth-practice-v1.0.9/` to the exact same GitHub Pages path after saving an encrypted backup. Do not uninstall, change the site origin, or clear website data. Static checks cannot verify an iPhone's existing vault; check it there before using for real entries.
