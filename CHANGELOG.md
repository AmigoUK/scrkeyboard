# Changelog

All notable changes to this project will be documented in this file.

The project follows semantic versioning during pre-production:

- `0.0.x` for fixes.
- `0.x.0` for new features.
- `x.0.0` for production releases, with `1.0.0` as the first production version.

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
