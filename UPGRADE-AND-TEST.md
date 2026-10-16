# Growth Practice 1.0.2 — Update an existing iPhone installation

This is an **in-place update** for the 1.0.1 four-digit-PIN beta, not a new app or data reset.

## Before updating (important)

1. Open the working v1.0.1 app on your iPhone and enter your existing four-digit PIN.
2. Open Settings and download a PIN-encrypted backup. Save the `.igpbackup` file in a private place outside Safari/app storage. This backup is weak against offline brute-force attack because the PIN has only 10,000 possible combinations.
3. Keep the current GitHub repository and the existing home-screen icon. **Do not delete the site, uninstall the PWA, or clear Safari website data.**

## Update the website

1. Download and extract `Growth_Practice_v1.0.2_Usability_Update.zip`.
2. Open its `growth-practice-v1.0.2` folder and upload/replace **the files inside it** into the **same existing GitHub repository root** that currently hosts v1.0.1.
3. Commit the changed files. Allow GitHub Pages to finish deploying.
4. Close the installed Home Screen app completely, then reopen it. Refresh/reopen if you still see v1.0.1. The new Home screen header should show **v1.0.2**.
5. Unlock using **the same four-digit PIN**. You do not need to create a new PIN or restore data merely because the code was updated.

## Suggested 5-minute acceptance check

- Home has six cards and bottom navigation shows **Home, Today, Diary, Learn, Toolkit, Review**.
- In Today, tap left arrow to browse yesterday and then **Back to Today**. No historical diary entry should be changed by browsing.
- Check an existing v1.0.1 diary entry. Old single notes are presented as a separate event with observations, interpretations, actions and review flag preserved.
- In Diary, add two fictional test events on today's date; confirm they are separately editable. Delete them after the test. A real opportunity is not inferred simply by creating an event.
- Open Learn and select Week 2, then Week 4, then Week 1. Week 1 activity checks should still be present if previously marked. Weeks 5–8 should say **not assigned**.
- Open Review and verify two events appear separately in the report/PDF after adding your own test observations. Exported PDF and clipboard text are NOT encrypted.
- Make another PIN-encrypted backup after confirming the update.

## Behavior changes

- The new Home screen is a hub, while Today is a browseable daily plan.
- Diary removes `Unclear` as a new mindfulness answer. Older `Unclear` entries remain visible instead of being silently rewritten.
- Diary displays the specific week's rehearsal and a **suggested** three-session schedule (Wednesday/Friday/Sunday). The user can choose other days. `Not planned` is a deliberate answer, not a failure.
- A real-world opportunity means a relevant situation where the week's skill *could* be used, even if it was not recognized or used. It is separate from rehearsal.
- Unlimited separate events replace the one shared observations area; older observations are preserved and migrated automatically on unlock.
- Learn combines reading materials with the matching explanations and provides a week selector for Weeks 1–8. Weeks 2–4 are **proposals**; Weeks 5–8 are deliberately open planning slots.
- `Copy Week N learning instructions` and `Copy this scenario for ChatGPT` just place text on the clipboard. Open your DBT/RO-DBT/ACT Project in ChatGPT, paste and send. These buttons **do not** start a chat, send private records, perform a rehearsal, or check off work.

## What is unchanged

- PIN-only unlocking and locally AES-GCM encrypted IndexedDB vault under `growth-practice-v1`.
- Same encrypted PIN-backup format; backups from 1.0.1 are restorable.
- No remote syncing, telemetry, cloud database, or change to your separate RO Diary or Conflict Training applications.
- Archived weeks normally open read-only and require an explicit action to edit.

## Testing and limits

Automated checks covered JavaScript parsing, rendering every section, week selection, two-event diaries and exports, old-format event migration, encryption/decryption with the same PIN (including `0123`), wrong-PIN rejection, and a valid generated PDF containing multiple events. This environment could not complete a real Safari device/UI test. Validate the upgrade on your phone, especially navigation, backup/restore and offline access, before relying on this beta as your sole record.
