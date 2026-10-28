# Growth Practice v1.0.10 — Upgrade / Acceptance Checks

## Before deploying

- [ ] Create and securely store a current PIN-encrypted backup from the working app.
- [ ] Confirm the existing home-screen app URL and hosting repository/path.
- [ ] Preserve the exact origin and path when uploading **contents** of the new folder.
- [ ] Do not uninstall/clear site data as a way to force the upgrade.

## After deployment on device

- [ ] Header says **v1.0.10**. Same PIN unlocks the existing vault.
- [ ] An old real-life event, rehearsal note, weekly review and completed learning item remain intact.
- [ ] LU1 reflects the October 27 completion decision; required Fruzzetti Chapter 2/3 material is not shown.
- [ ] Learn shows **Import learning-unit update** and retains Unit 1 and unassigned placeholders.
- [ ] A valid approved JSON update previews unit and lesson counts; wrong format, duplicate IDs and malformed JSON are rejected.
- [ ] Applying after confirmation updates only specified unit definitions. Omitted `activeUnit` does not switch the active unit; an included valid `activeUnit` does.
- [ ] A reload shows imported units and lesson details. Previously entered daily records remain unchanged.
- [ ] Lesson checks save without claiming any real-life mastery; quick recall, rehearsal and deep-dive prompts still copy and use the governing Library records.
- [ ] A second import revising one unit preserves its prior completed lesson checkbox by the same ID, while other units remain unchanged.
- [ ] Existing encrypted backup/export and restore options, PDF weekly export, daily logging, offline navigation and five-minute auto-lock still work.

**Testing limitation:** The authored package is code-checked but has not been tested on the user's iPhone or deployed to GitHub Pages. Do not assume device tests passed.
