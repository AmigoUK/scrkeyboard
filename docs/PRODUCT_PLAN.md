# scrkeyboard Product Plan

## Goal

Build a Google Chrome extension that adds a comfortable on-screen keyboard for web applications. The keyboard appears when the user can enter data and hides after the user confirms input with Enter.

## Language

- Default UI language: `en`.
- Additional UI language: `pl`.
- Repository documentation, comments, code identifiers, and English UI copy use British English.
- Technical implementation: Chrome i18n through `_locales/en/messages.json` and `_locales/pl/messages.json`.
- The setup page provides language selection, with the default matching `default_locale: "en"`.

## MVP Scope

- Manifest V3.
- Content script for detecting editable targets:
  - `input[type=text]`, `input[type=search]`, `input[type=email]`, `input[type=url]`, `input[type=tel]`, `input[type=password]`, `textarea`.
  - `contenteditable` elements.
  - Fields in dynamic SPA applications.
- Floating keyboard overlay:
  - basic QWERTY layout,
  - Backspace,
  - Space,
  - Enter,
  - Shift,
  - manual close.
- Enter:
  - inserts or dispatches Enter to the active field,
  - hides the keyboard after Enter.
- Domain rules:
  - whitelist: the extension is active only on listed domains when the whitelist is not empty,
  - blacklist: the extension never runs on listed domains,
  - blacklist takes precedence over whitelist.
- Keyword buttons:
  - configurable words and phrases,
  - one tap inserts a phrase into the active field,
  - managed through setup.
- Setup/options page:
  - enable/disable extension,
  - whitelist,
  - blacklist,
  - UI language,
  - keywords and phrases,
  - settings preview.

## Technical Decisions To Confirm

1. Should the extension request broad host permissions (`<all_urls>`) and ignore domains outside the configured rules, or should it use optional permissions per domain?
2. Should the whitelist be empty by default, meaning the extension is inactive until the user adds domains, or should it run everywhere except blacklisted domains?
3. Should keyword phrases be global, or scoped per domain?
4. Should the first keyboard layout be QWERTY only, or should it include a Polish layout with diacritics from the start?
5. Should Enter only hide the keyboard, or should it also trigger the native form/search submission behaviour?

## Proposed Architecture

```text
scrkeyboard/
  manifest.json
  src/
    content/
      content.ts
      keyboard.ts
      domainRules.ts
      editableTarget.ts
      styles.css
    options/
      options.html
      options.ts
      options.css
    shared/
      settings.ts
      i18n.ts
      defaults.ts
  _locales/
    en/messages.json
    pl/messages.json
  docs/
    PRODUCT_PLAN.md
```

## Settings

Proposed settings model:

```json
{
  "enabled": true,
  "language": "en",
  "whitelist": [],
  "blacklist": [],
  "keywords": [
    { "label": "OK", "value": "OK" },
    { "label": "Done", "value": "Done" }
  ],
  "keyboard": {
    "layout": "qwerty",
    "hideOnEnter": true,
    "showOnFocus": true
  }
}
```

## Roadmap

### Milestone 1: Repository And Product Plan

- Initialise Git.
- Document the product plan.
- Agree MVP decisions.

### Milestone 2: Minimal Chrome Extension

- `manifest.json`.
- Content script.
- Simple keyboard overlay.
- Character insertion into the active field.
- Hide after Enter.

### Milestone 3: Setup

- Options page.
- Save settings in `chrome.storage.sync`.
- Whitelist/blacklist.
- Phrases.
- EN/PL through Chrome i18n.

### Milestone 4: Comfort And Testing

- SPA and dynamic focus support.
- `contenteditable` support.
- Overlay positioning that avoids covering the active field where possible.
- Manual testing on typical websites and web applications.
