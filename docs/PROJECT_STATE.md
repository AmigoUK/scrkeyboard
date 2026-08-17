# ScrKeyboard Project State

Last updated: 2026-08-17

Branch: `main`

Remote: `https://github.com/AmigoUK/scrkeyboard.git`

Current extension version: `0.8.2`

Baseline code commit before this handover note: `49c6b4b fix: update visible branding`

## Current Product State

- ScrKeyboard is a Chrome Manifest V3 extension for operator-friendly on-screen input in approved business application domains.
- The default UI language is English. Polish is supported through Chrome extension locale files and user settings.
- The extension runs only on approved domains using whitelist and blacklist rules, with wildcard URL fragments supported in user-managed rules.
- Site access is granted through optional host permissions, keeping install-time permissions minimal.
- The content script displays a Shadow DOM keyboard when an approved editable field is focused and hides it after Enter, Close, or focus loss.
- WebForms-style forms are supported through direct editable detection, frame-aware content script registration, and immediate injection after site approval.
- The keyboard supports persisted CapsLock state, a right-hand numeric keypad, larger keys, Enter/Ctrl+Enter mode, phrase buttons, and viewport-aware scrolling.
- Global and per-site phrase buttons support user-defined colours with automatic black or white text for readable contrast.
- CSV export includes configured site rules, phrases, and phrase button colours.
- Visible user-facing branding is `ScrKeyboard`. Lowercase `scrkeyboard` remains only in technical identifiers, where renaming would require a migration.

## Latest Verification

- `npm run check` passed after the latest code changes before this handover note.
- The automated check covers TypeScript, Vitest unit tests, production build, and extension package validation.
- Browser verification was performed for the recent keyboard and phrase colour changes using Chrome extension pages and rendered content inspection.

## Files And Areas To Know

- `manifest.json`: Manifest V3 metadata, permissions, optional host permissions, and current extension version.
- `src/shared/settingsTypes.ts`: persisted settings schema and phrase model.
- `src/shared/settingsValidation.ts`: settings migration and normalisation.
- `src/shared/phraseColours.ts`: phrase button colour validation and contrast selection.
- `src/options/options.ts`: setup page behaviour for language, rules, phrases, colours, and CSV export.
- `src/options/options.css`: setup page layout and colour controls.
- `src/content/keyboardView.ts`: Shadow DOM keyboard rendering, key layout, phrase buttons, and runtime UI state.
- `src/content/keyboardController.ts`: editable field handling and key event dispatch.
- `_locales/en/messages.json` and `_locales/pl/messages.json`: extension-facing copy.
- `docs/PRODUCT_PLAN.md`: agreed product scope and phased delivery plan.
- `README.md`: public project documentation and manual setup/testing guidance.

## Next Suggested Work

- Re-test the current keyboard layout on the real business WebForms page and capture any remaining layout adjustments.
- Add CSV import if users will maintain larger keyword sets outside the setup page.
- Add a reset-to-default action for phrase colours if operators need a quick recovery path.
- Expand E2E coverage around options persistence, rendered phrase button styles, and WebForms interaction.
- Prepare Chrome Web Store assets, privacy notes, and release checklist before moving towards `1.0.0`.

## Operational Notes

- Keep user-facing product naming as `ScrKeyboard`.
- Do not rename these lowercase technical identifiers without a storage and compatibility migration:
  - `scrkeyboard.settings.v1`
  - `scrkeyboard.keyboardRuntimeState.v1`
  - `scrkeyboard-panel`
  - `scrkeyboard.syncContentScripts`
  - package name `scrkeyboard`
- Continue to justify every new Chrome permission before adding it to `manifest.json`.
- Keep code and documentation in British English.
- Continue speaking with the project owner in Polish.
