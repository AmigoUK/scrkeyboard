# Changelog

All notable changes to this project will be documented in this file.

The project follows semantic versioning during pre-production:

- `0.0.x` for fixes.
- `0.x.0` for new features.
- `x.0.0` for production releases, with `1.0.0` as the first production version.

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
