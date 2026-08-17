# ScrKeyboard Project State

Last updated: 2026-08-17

Branch: `main`

Remote: `https://github.com/AmigoUK/scrkeyboard.git`

Current extension version: `0.9.0`

Baseline code commit before this handover note: `2280721 feat: add extension icons and validate them during the build`

## Current Product State

- ScrKeyboard is a Chrome Manifest V3 extension for operator-friendly on-screen input in approved business application domains.
- The default UI language is English. Polish is supported through Chrome extension locale files and user settings.
- The extension runs only on approved domains using whitelist and blacklist rules, with wildcard URL fragments supported in user-managed rules.
- Site access is granted through optional host permissions, keeping install-time permissions minimal.
- The content script displays a Shadow DOM keyboard when an approved editable field is focused and hides it after Enter, Close, or focus loss.
- WebForms-style forms are supported through direct editable detection, frame-aware content script registration, and immediate injection after site approval.
- The keyboard supports persisted CapsLock state, a right-hand numeric keypad, larger keys, Enter/Ctrl+Enter mode, phrase buttons, and viewport-aware scrolling.
- The main keyboard has three modes: letters (QWERTY with Shift/CapsLock), symbols (full punctuation across
  three rows, reached from the `?#` key), and a one-shot Polish diacritics mode (reached from the `ĄĘ` key,
  composing with Shift and CapsLock; `ź` sits on the `x` key because `x` does not occur in Polish).
- The numeric keypad carries a punctuation column (full stop, comma, hyphen, at sign) present in every mode,
  so an operator can type an email address such as `a.smith@example.com` without switching modes.
- A Tab key (`⇥`) moves focus to the next editable field on the page without closing the keyboard panel.
- Global and per-site phrase buttons support user-defined colours with automatic black or white text for readable contrast.
- CSV export includes configured site rules, phrases, and phrase button colours.
- The extension ships icons in 16, 32, 48 and 128 pixel sizes, generated from `icons/source.svg` and checked
  by the build's validation step.
- Visible user-facing branding is `ScrKeyboard`. Lowercase `scrkeyboard` remains only in technical identifiers, where renaming would require a migration.

## Latest Verification

- `npm run check` passed after the latest code changes before this handover note (TypeScript, Vitest unit
  tests — 76 at time of writing — production build, and extension package validation).
- Manual browser verification against `manual/webforms.html` as an unpacked extension was **not** performed
  for this v0.9.0 release; it requires a real Chrome session and could not be driven from this environment.
  The five acceptance criteria in `.superpowers/sdd/2026-08-17-v0.9-input-coverage/task-10-brief.md` (Step 1)
  — Customer reference punctuation, an email address, Polish diacritics composing with Shift, Tab moving
  focus through the WebForms fixture, and the toolbar showing the real ScrKeyboard icon — remain outstanding
  for the project owner to confirm in a real browser before wider rollout.

## Files And Areas To Know

- `manifest.json`: Manifest V3 metadata, permissions, optional host permissions, and current extension version.
- `src/shared/settingsTypes.ts`: persisted settings schema and phrase model.
- `src/shared/settingsValidation.ts`: settings migration and normalisation.
- `src/shared/phraseColours.ts`: phrase button colour validation and contrast selection.
- `src/options/options.ts`: setup page behaviour for language, rules, phrases, colours, and CSV export.
- `src/options/options.css`: setup page layout and colour controls.
- `src/content/keyboardView.ts`: Shadow DOM keyboard rendering, key layout, mode/diacritics state, and phrase buttons.
- `src/content/content.ts`: editable field handling and key event dispatch (`handleKeyboardAction`).
- `src/content/keyboardLayout.ts`: key row definitions for the letters, symbols and numeric-keypad layouts.
- `src/content/diacritics.ts`: the Polish diacritics character mapping.
- `src/content/fieldNavigation.ts`: Tab-key focus movement to the next editable field.
- `_locales/en/messages.json` and `_locales/pl/messages.json`: extension-facing copy.
- `docs/PRODUCT_PLAN.md`: agreed product scope and phased delivery plan.
- `README.md`: public project documentation and manual setup/testing guidance.

## Next Suggested Work

v0.9.0 (iteration 1 of the store roadmap) is complete; the next iteration is `v0.10.0` — "a company can
deploy it" — per `docs/superpowers/specs/2026-08-17-roadmap-to-store-design.md`:

- Confirm the five v0.9.0 manual acceptance criteria in a real Chrome session against `manual/webforms.html`
  before wider rollout (see Latest Verification above).
- Add CSV import as the inverse of the existing export, so an administrator can configure once and distribute
  site rules and phrases to many operators.
- Add a welcome page on `chrome.runtime.onInstalled` and a popup flow that leads a new user to their first
  site approval, removing the "installed but nothing happens" failure.
- Add a reset-to-default action for phrase colours if operators need a quick recovery path.
- Expand E2E coverage around options persistence, rendered phrase button styles, and WebForms interaction
  (planned for iteration 3, `v0.11.0`).
- Prepare Chrome Web Store assets, privacy notes, and release checklist before moving towards `1.0.0`
  (iteration 4).

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
