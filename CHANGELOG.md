# Changelog

All notable changes to this project will be documented in this file.

The project follows semantic versioning during pre-production:

- `0.0.x` for fixes.
- `0.x.0` for new features.
- `x.0.0` for production releases, with `1.0.0` as the first production version.

## 0.10.5 - 2026-08-20

### Fixed

- Fixed the "Duplicate script ID 'scrkeyboard-keyboard'" service worker error when saving settings.
  Saving writes to `chrome.storage.sync` and sends an explicit sync request, so two content script
  syncs ran at once; each unregistered the script before the other registered it, and the second
  registration was rejected by Chrome. Syncs are now queued so the unregister/register pair never
  overlaps. Until now a failed sync could leave the keyboard registered for stale match patterns
  until the next successful sync.

## 0.10.4 - 2026-08-18

### Changed

- Removed Vite's modulepreload polyfill from the build. The extension requires Chrome 116, which
  supports modulepreload natively, so the polyfill never ran — and it was the only fetch() call
  in the packaged extension, which made the Chrome Web Store's remote-code question harder to
  answer than it needed to be.

## 0.10.3 - 2026-08-18

### Fixed

- Fixed the options page review link pointing at a listing that does not exist. It now uses the
  published Chrome Web Store id, so it also works in an unpacked build, where the runtime id is
  generated locally.

## 0.10.2 - 2026-08-18

### Fixed

- Fixed the popup showing leftover development text ("Extension shell loaded. Setup controls will be
  added in the next milestone.") on every ordinary site instead of guidance for the operator. The popup
  now tells the operator to approve the current site, or confirms it is already approved, in both English
  and Polish. Also removed the unused, similarly stale `optionsStatus` message, which was never shown
  anywhere.
- Re-encoded the extension icons as 8-bit RGBA, roughly halving their file size with no visual change.

## 0.10.1 - 2026-08-18

### Fixed

- Fixed the setup page showing "Enable ScrKeyboard" as the label for every approved-site rule,
  blocked-site rule and quick-phrase checkbox, making each row look as though it switched the whole
  extension on or off. Those per-row checkboxes now read "Enabled" ("Włączone" in Polish); the
  extension-wide switch in the setup section still reads "Enable ScrKeyboard".

## 0.10.0 - 2026-08-18

### Added

- Added a small credit footer to the options page, showing the extension version (read from the
  manifest at runtime), a link to leave a Chrome Web Store review, and project attribution links.

## 0.9.1 - 2026-08-17

### Fixed

- Fixed the numeric keypad's punctuation column (full stop, comma, hyphen, at sign) and the outermost
  main-keyboard keys being pushed off-screen and unreachable on windows roughly 861 to 963 pixels wide, by
  widening the point at which the keypad stacks below the main keyboard instead of sitting beside it.
- Fixed Tab being able to move focus onto a password field on a site whose rule forbids password fields,
  when that field also carried `contenteditable="true"`.
- Fixed the Polish diacritics mode staying armed after the keyboard panel is closed, so the next letter typed
  in a different field could silently come out as a diacritic instead of a plain letter.

## 0.9.0 - 2026-08-17

### Added

- Added a symbols mode with full punctuation, reachable from the `?#` key, including the forward slash
  and underscore needed for slashed dates and hyphenated references.
- Added a punctuation column to the numeric keypad for full stop, comma, hyphen and at sign.
- Added a Polish diacritics mode reachable from the `ĄĘ` key, combining with Shift and CapsLock.
- Added a Tab key that moves focus to the next editable field without closing the keyboard.
- Added extension icons in 16, 32, 48 and 128 pixel sizes, validated during the build.

### Changed

- Changed `createKeyboardRows` to take a single layout state object instead of positional flags.

## 0.8.2 - 2026-08-17

### Changed

- Added a project state handover note for the current ScrKeyboard development checkpoint.

## 0.8.1 - 2026-08-17

### Fixed

- Updated visible product branding from `scrkeyboard` to `ScrKeyboard`.

## 0.8.0 - 2026-08-17

### Added

- Added user-configurable colours for global and site-specific phrase buttons.
- Added compact colour presets to the setup page.
- Added automatic black or white phrase-button text selection for stronger colour contrast.
- Added CSV export support for phrase button colours.

## 0.7.1 - 2026-08-17

### Fixed

- Removed the duplicate Backspace key from the main keyboard.
- Simplified Enter back to a large regular key for a cleaner main keyboard layout.

## 0.7.0 - 2026-08-17

### Changed

- Changed the main keyboard Backspace key to the same compact symbolic style as the numeric keypad.
- Changed CapsLock to a symbolic key while preserving its persisted active state.
- Changed Enter to a larger return-shaped key.

## 0.6.1 - 2026-08-17

### Fixed

- Changed the numeric keypad Backspace key to a compact symbolic key.

## 0.6.0 - 2026-08-17

### Added

- Added viewport-aware scrolling so the focused field is kept above the on-screen keyboard.
- Added temporary page bottom inset while the keyboard is visible, allowing footer fields to scroll clear of the panel.
- Added a long-form footer field to the WebForms manual fixture for keyboard overlap testing.
- Added unit coverage for active-field visibility calculations.

## 0.5.0 - 2026-08-17

### Added

- Added a full setup/options page for managing extension status, language, Enter mode, quick phrases, approved sites, blocked sites, and site-specific phrases.
- Added CSV export for configured rules and phrases.
- Added site-access grant controls for approved URL rules that can be mapped to Chrome host permissions.
- Added shared host-permission pattern helpers with unit coverage.
- Added visible key-event logging to the WebForms manual fixture.

### Changed

- Applied the configured Enter mode when dispatching keyboard Enter events, including Ctrl+Enter.
- Applied the configured language to keyboard special-key labels.

## 0.4.0 - 2026-08-17

### Added

- Added a CapsLock key to the on-screen keyboard.
- Persisted the CapsLock runtime state in local Chrome storage.
- Added a right-hand numeric keypad.

### Changed

- Increased keyboard key sizing for easier operator input.

## 0.3.2 - 2026-08-17

### Fixed

- Persisted the current-site whitelist rule before Chrome shows the optional permission prompt, so popup closure after approval no longer loses activation.
- Reactivated dynamic content scripts when Chrome grants a new site permission.
- Injected the keyboard into already-open matching tabs after a new permission is granted.
- Showed the keyboard when the content script is injected while an editable field is already focused.

### Added

- Local WebForms-style manual test fixture.

## 0.3.1 - 2026-08-17

### Fixed

- Kept the optional host permission request directly inside the popup click gesture so Chrome can show the site access prompt reliably.
- Registered and injected the keyboard content script into all permitted frames so WebForms hosted inside frames can activate the keyboard.

## 0.3.0 - 2026-08-17

### Added

- Dynamic content script registration for approved whitelist origins.
- Immediate content script injection after approving the current site from the popup.
- Shadow DOM keyboard panel docked to the bottom of approved pages.
- Editable target detection for common input types, textareas, and `contenteditable` elements.
- QWERTY MVP keyboard with digits, Shift, Backspace, Space, Enter, Close, and phrase buttons.
- Unit tests for keyboard layout and content script registration helpers.

## 0.2.0 - 2026-08-17

### Added

- Operator popup with global enable/disable control.
- Current-site detection for regular HTTP and HTTPS pages.
- One-click current site approval through runtime optional host permissions.
- Whitelist upsert behaviour that avoids duplicate site rules.
- Unit tests for site access helpers and whitelist mutations.

## 0.1.0 - 2026-08-17

### Added

- Settings schema for extension enablement, language, confirm key mode, global phrases, whitelist, and blacklist.
- URL wildcard matching for full URLs and operator-friendly URL fragments.
- Whitelist/blacklist evaluation with blacklist precedence and inactive-by-default whitelist behaviour.
- `chrome.storage.sync` load, save, and initialisation helpers.
- Unit tests for settings normalisation, URL rule evaluation, and storage behaviour.

## 0.0.0 - 2026-08-17

### Added

- Initial Chrome Manifest V3 extension shell.
- TypeScript and Vite project structure.
- Popup, options page, background service worker, and content script entrypoints.
- English and Polish Chrome i18n locale files.
- README development, local loading, and permission notes.
