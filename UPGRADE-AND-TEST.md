# Version 1.0.3 — Upgrade & acceptance checklist

## Preserve data

- [ ] In v1.0.2, create an encrypted backup in Settings and retain it privately.
- [ ] Update the same GitHub Pages repository at the same URL. Do not uninstall or clear Safari website data.
- [ ] Launch v1.0.3 and unlock using the **same four-digit PIN**.
- [ ] Confirm a previous day's entry, Week 1 reading marks, and any existing events remain present.

## Daily flow on iPhone

- [ ] The default unlocked screen is **Today**, with **Mindfulness, Skill rehearsal, Events, Finish** on one screen.
- [ ] Bottom tabs are **Today · Learn · Toolkit · Review**; Settings is the gear.
- [ ] Go back one day with the left arrow, then use **Back to today**.
- [ ] Navigate to a different calendar week; it opens read-only until you choose **Edit past week**.
- [ ] Mark mindfulness Done, adjust minutes, mark rehearsal Not planned, and verify they persist after leaving and returning.
- [ ] On a new day with no events, choose **No events to note** and confirm it can be cleared.
- [ ] Add two events, enter separate notes, expand optional details, close/reopen the event, flag one for review, and verify both remain.
- [ ] Mark the day complete, edit a field, and confirm it is no longer falsely marked complete.

## Learning, reports & privacy

- [ ] Tap **Week 1 lesson** from Today; Learn opens on the matching week.
- [ ] Change weeks in the dropdown; Weeks 5–8 remain unassigned.
- [ ] Open/close optional details; check one resource and confirm the completion count updates.
- [ ] Copy lesson starter or a fictional practice scenario, then paste into an intentionally chosen ChatGPT conversation. No record is sent automatically.
- [ ] Open Toolkit then return to Today and verify no observations were lost.
- [ ] In Review, verify the **Events** column, multiple event details, copied weekly report, and a readable PDF.
- [ ] In Settings, create an encrypted backup and test restoring **only where it is safe to replace data**; restoring overwrites current Growth Practice records.
- [ ] Lock/reopen app; verify the four-digit PIN remains the only unlock credential.
- [ ] Check the Home Screen app after briefly going offline once it has loaded successfully online.

If an upgrade fails, do **not** clear data or reinstall impulsively. Preserve the old backup, retain the existing GitHub Pages URL, and report the precise failure and app version.

## Design audit and research basis

Three public self-help app patterns informed the redesign (not their therapy content or data models):

- **Daylio** emphasizes fast daily records with optional notes, followed by calendar/history and reports: https://daylio.net/
- **Finch** brings a small set of daily goals and reflection actions to its main view: https://help.finchcare.com/hc/en-us/articles/37780000231309-Exploring-the-Finch-Home-Page
- **Stoic** keeps guided content alongside but apart from daily reflections: https://www.getstoic.com/features

These are design references only. Version 1.0.3 retains the agreed one-person RO-DBT / standard DBT / ACT source distinctions and the unique multi-event daily record, not generic mood scores or gamification.

## Automated checks

v1.0.3 was checked with Node-based test cases for render output, day navigation, event creation, earlier records, encrypted AES-GCM round trip with leading-zero PIN, bad-PIN rejection, learning selections, weekly reports, and PDF bytes. Code syntax and ZIP integrity were checked. This does **not** replace a real on-device usability test.
