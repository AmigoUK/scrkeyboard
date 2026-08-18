# ScrKeyboard Project State

Last updated: 2026-08-18

Branch: `main`

Remote: `https://github.com/AmigoUK/scrkeyboard.git`

Current extension version: `0.10.4`

Baseline code commit before this handover note: `15f82ea chore(release): v0.10.4 — remove the modulepreload polyfill`

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
  by the build's validation step. Only the packed PNGs are copied into the built extension; `icons/source.svg`
  stays out of the artefact sent to the Chrome Web Store.
- Visible user-facing branding is `ScrKeyboard`. Lowercase `scrkeyboard` remains only in technical identifiers, where renaming would require a migration.
- The options page carries a small, muted credit footer below the settings UI, outside the re-rendered
  `#options-root`: a Chrome Web Store review link (built from `chrome.runtime.id`, dead until the store
  listing exists) and a project attribution line with the extension version read live from
  `chrome.runtime.getManifest().version`. Both language-dependent strings follow the page's `en`/`pl`
  settings language.

## Latest Verification

- `npm run check` passed after the latest code changes before this handover note (TypeScript, Vitest unit
  tests — 79 at time of writing — production build, and extension package validation).
- v0.9.1 is a patch release fixing three defects found in a final whole-branch review of v0.9.0: the
  keypad's punctuation column and the outermost main-keyboard keys being unreachable on windows roughly
  861 to 963 pixels wide, Tab being able to reach a password field on a site whose rule forbids password
  fields when that field also carried `contenteditable="true"`, and the Polish diacritics mode staying
  armed after the keyboard panel was closed. The mid-width layout fix was checked with headless Chromium
  screenshots of a standalone demo page at 900px and 1024px window widths, confirming every key is on
  screen and none is clipped — this is a headless rendering check, not manual verification in a real
  Chrome browser, which still has not been performed for this branch.
- **Manual verification in a real Chrome session was performed by the project owner on 2026-08-18** and
  reported working. This closes the five acceptance criteria in
  `docs/superpowers/specs/2026-08-17-v0.9-input-coverage-design.md` that had been outstanding through the
  v0.9.x work, when no agent could drive `chrome://extensions` to load an unpacked build.
- The options page and popup were additionally rendered headlessly with a mocked `chrome` API to check
  the credit footer in both languages, the corrected per-row checkbox labels, the review link's target,
  and that both pages still load after the modulepreload polyfill was removed in v0.10.4.

## Known Minor Issues, Deferred

None of these blocks anything; they are recorded so they are not rediscovered from scratch. All were
raised by task reviews during the v0.9.x work and judged non-blocking at the time.

- `keyboardLayout.ts` has three near-identical key constructors (`createSymbolRow`, `createDigitRow`,
  `createKeypadSymbolKey`) differing only in an id prefix. Three separate reviewers flagged this
  independently; it is the strongest consolidation candidate in that file.
- `fieldNavigation.ts`'s `isExplicitlyContentEditable` matches only the literal string `'true'`, so it
  does not recognise `contenteditable=""` or `"True"`. Harmless in Chrome, where `isEditableTarget`'s
  own `isContentEditable` check handles those, but the helper is not reusable as-is.
- `fieldNavigation.test.ts`'s "bare contenteditable" case asserts that such a field is skipped. That
  documents the jsdom shim's behaviour, not Chrome's — per the HTML spec a bare `contenteditable`
  means "true", so a real browser treats it as editable. Misleading to a future reader.
- The diacritics one-shot clears after a `character` action but not after Space or a phrase button, so
  an operator who arms `ĄĘ`, presses Space and then types still gets an accented letter. Matches the
  spec as written; worth revisiting if it confuses anyone.
- `keyboardView.ts`'s click handler is five sequential `if`s mixing early-return and fall-through. It
  is correct — verified by hand-tracing — but nothing in the code protects the ordering invariant.

## Chrome Web Store Submission

**Submitted for review on 2026-08-18.** Awaiting Google's verdict; nothing further to do until
they respond.

- Listing ID: `mkpgkageonmefklmndjjhancahmkdgnj`
- Package submitted: `v0.10.4` (`scrkeyboard-0.10.4.zip`, 38 KB, source maps excluded)
- Listing page (live once approved):
  `https://chromewebstore.google.com/detail/mkpgkageonmefklmndjjhancahmkdgnj`

Everything pasted into the dashboard is committed in `docs/store/`:

- `LISTING.md` — every field with its character count: name, summary (127/132), description,
  category, single purpose, per-permission justifications, the nine data-usage declarations, and
  the URLs. Also carries the pre-submission checklist.
- `PRIVACY.md` — the privacy policy the listing's Privacy policy URL points at.
- `assets/` — store icon, four 1280x800 screenshots, and both promo tiles, all at the exact sizes
  the dashboard requires. Do NOT use `docs/screenshots/` for this; those are 1280x860 and exist
  only for the README. Each directory has a README saying so.

Answers given that must stay true, or the listing has to be updated:

- **Remote code: No.** Verified — the packaged JavaScript contains no `fetch`, `eval` or
  `new Function`. v0.10.4 removed Vite's modulepreload polyfill, which was the last `fetch` in
  the bundle. If a CDN dependency, analytics or `eval` is ever added, this answer must change.
- **Category: Tools.** Not "Workflow & Planning" (Google defines that as time trackers, to-do
  lists and calendars) and deliberately not "Accessibility", which would misrepresent the
  audience.
- **Homepage:** `https://attv.uk/projects/scrkeyboard.html`; **Support:** GitHub issues. Both
  break silently if the repository is made private.

Expect a reviewer question about the broad `http://*/*` and `https://*/*` optional host
permissions. The prepared answer is in `LISTING.md` section 7: they are optional, requested one
origin at a time when an operator approves a site, and the extension is inert until then.

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

Iteration 1 (v0.9.x) is complete and was confirmed working in a real Chrome session by the project
owner on 2026-08-18. Iteration 4 (store submission) was pulled forward and is done — the extension
is with Google for review. Iteration 2, "a company can deploy it", is partly started (the options
page credit footer and review link shipped in v0.10.0) and is the natural place to resume:

- **First: whatever the store review comes back with.** If Google requests changes, that outranks
  everything below.
- Add CSV import as the inverse of the existing export, so an administrator can configure once and distribute
  site rules and phrases to many operators.
- Add a welcome page on `chrome.runtime.onInstalled` and a popup flow that leads a new user to their first
  site approval, removing the "installed but nothing happens" failure.
- Add a reset-to-default action for phrase colours if operators need a quick recovery path.
- Expand E2E coverage around options persistence, rendered phrase button styles, and WebForms interaction
  (planned for iteration 3, `v0.11.0`).

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
