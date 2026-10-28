# Growth Practice v1.0.10 — Importable Learning Units and Small Lessons

## What changed

This is a focused update from the authored v1.0.9 package, **not a complete redesign**.

- **Learn** now accepts an optional reviewed **JSON curriculum import** after user-confirmed Monday learning decisions. You can revise or add a unit and its short lessons without another code release.
- The import is **manual, local-only, and previewed before confirmation**. Units not listed in an update are preserved. An optional `activeUnit` sets the current selection only when it matches an included unit.
- The default LU1 reference and copied prompt now reflect **October 27 v2.6**: introductory instruction completed; Fruzzetti Chs. 2–3 removed as mandatory. Earlier checked resources stay in encrypted history, even when they are no longer visible in the current LU1 list.
- The Learn page can show imported short lessons, sources, objectives and a first exercise. A lesson checkbox means the user reports finishing instruction and introductory exercise, **not** mastery or real-life application.
- This update **does not sync with ChatGPT/Library, RO Diary, RO Journal or therapist systems**; your latest verified Library decision remains authoritative.

## Curriculum import — quick use

1. Finish a Monday review or another explicit learning decision, and ask ChatGPT to generate a `growth-practice-curriculum` version 1 JSON update based on that **approved** decision and source-grounded lesson content. Avoid importing guesses or provisional therapy homework.
2. On the unlocked app, go to **Learn > Import learning-unit update**; paste JSON, tap **Preview update**, confirm the reported unit/lesson count and unit selection, then tap **Apply reviewed update**.
3. Review the updated Learn dropdown. The app stores the changes in its **existing encrypted local vault** and they persist across reloads. Import text itself is not sent anywhere.

### JSON format

```json
{
  "format": "growth-practice-curriculum",
  "version": 1,
  "units": [
    {
      "number": 2,
      "title": "EXAMPLE ONLY — replace after approval",
      "subtitle": "Not an assigned unit",
      "status": "Example, not approved",
      "goal": "One focused capability, defined during the approved review",
      "lessons": [
        {
          "id": "example-l1",
          "title": "EXAMPLE lesson — replace",
          "objective": "A specific learnable objective",
          "source": "Actual verified author/manual and location",
          "practice": "One guided exercise to attempt"
        }
      ],
      "resources": [],
      "rehearsals": []
    }
  ]
}
```

**DO NOT import this example as your active curriculum.** The user has not yet approved LU2 or an ACT syllabus. When a unit is confirmed, preserve its **number** and each lesson's stable **id** across revisions. Do not renumber a past unit or reuse an old lesson ID for a different objective. The JSON format accepts optional `status`, `subtitle`, `goal`, `rehearsalTitle`, `rehearsalHow`, `resources` (`id`, `title`, `type`, `detail`, `explanation`) and `rehearsals` (`title`, `skill`, `text`) fields. `activeUnit` is optional; omit it to keep current selection unchanged. The import allows 1–20 unit updates, numbers 1–50, up to 30 short lessons per unit, and up to 60 KB of JSON.

**Important limit:** Imports replace the current definition of each included unit (not its historical entry references), so include the *complete current lesson list* for any unit you are replacing. Lesson checkmarks are preserved by stable ID. Preview only summarizes counts; inspect the JSON content before applying. There is not yet a one-click rollback of imported definitions. Keep the last known-good JSON and a fresh encrypted backup so you can re-import the prior definition if necessary.

## Updating the installed app safely

1. On the **currently installed** Growth Practice app, confirm that the same URL you plan to update hosts your data. Make a **PIN-encrypted backup** and store it securely before deployment. Existing PIN-based encryption offers limited offline brute-force resistance; protect backup files and device access.
2. Unzip v1.0.10 and upload the **contents** of `growth-practice-v1.0.10/` to the **same GitHub Pages repository, branch, directory and URL** as the current installed app. Do **not** change the origin, uninstall the PWA, clear Safari website data or delete the old hosting files without confirming the replacement.
3. After Pages deployment, close/reopen the home-screen app; verify **v1.0.10** in header, unlock with your existing PIN, and inspect an existing dated event and reading checkbox before importing anything.
4. Test a small, approved unit update with the preview/apply workflow. Reload and confirm it persists. Restore the prior exported curriculum definition by re-import if needed. Never restore a vault backup without understanding that the existing restore action **replaces** local records.

## Data and compatibility

Preserves IndexedDB name `growth-practice-v1`, encrypted vault `schema:1`, PIN key derivation, backup formats, existing event and rehearsal fields and service-worker caching structure. New catalog data resides under `state.settings.curriculumCatalog` **inside the existing encrypted vault**. No database migration or remote account is added.

One source ZIP has been inspected and local code checks can verify syntax/data transformations, but installation, existing iPhone data, GitHub Pages deployment, secure backups and end-to-end mobile behavior require device testing. **This package is not already deployed just because it was generated or placed in the Library.**
