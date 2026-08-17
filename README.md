# scrkeyboard

scrkeyboard is a Chrome extension concept for a comfortable on-screen keyboard that appears when a user focuses an editable field and hides after pressing Enter.

Default language: English. Planned UI languages: English and Polish.

## Repository Language

- Conversations and planning with the project owner may happen in Polish.
- Code, comments, documentation, README content, and English UI copy use British English.
- The default product language is English (`en`), with Polish (`pl`) provided as an additional locale.

## Planned Core Features

- Domain controls: whitelist and blacklist.
- Automatic keyboard visibility for editable fields.
- Enter-to-submit flow that hides the keyboard after input.
- One-tap keyword and phrase buttons.
- Setup/options page for domains, language, layout, and keyword presets.
- Chrome Manifest V3 extension structure.

## Settings Model

scrkeyboard stores configuration in `chrome.storage.sync` under the `scrkeyboard.settings.v1` key.
The whitelist is empty by default, so the keyboard stays inactive until the operator adds an approved site.

URL rules are matched against the full page URL and support `*` wildcards. For operator-friendly setup,
rules without a scheme are treated as URL fragments, so `crm.example.com/orders/*` can match
`https://crm.example.com/orders/123`.

## Popup Workflow

The popup is the operator-friendly entry point:

- enable or disable scrkeyboard without deleting settings;
- inspect the current site host;
- approve the current site with one button;
- open the full options page.

When the operator approves a site, scrkeyboard requests runtime access for that origin and stores a whitelist
rule such as `https://crm.example.com/*`.

## Keyboard Behaviour

On approved pages, scrkeyboard injects a Shadow DOM keyboard panel docked to the bottom of the viewport.
The panel appears when the operator focuses a supported editable field and hides when the operator presses
Enter, selects Close, or clicks outside an editable field.

The keyboard includes QWERTY letters, CapsLock, Shift, Backspace, Space, Enter, Close, configured phrase
buttons, and a right-hand numeric keypad. CapsLock state is remembered locally with `chrome.storage.local`,
so the operator gets the same CapsLock state after reopening the keyboard or reloading the page.

Keyboard keys are sized for comfortable pointer and touch input. Password fields are ignored unless the
matching whitelist rule explicitly allows them.

## Manual WebForms Fixture

For a local smoke test, run a static server from the repository root and open the fixture:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/manual/webforms.html`, approve the site through the scrkeyboard popup,
and focus the Customer reference field. The keyboard should appear at the bottom of the page.

## Planning

See [docs/PRODUCT_PLAN.md](docs/PRODUCT_PLAN.md).

## Development

The project is a Chrome Manifest V3 extension built with TypeScript, Vite, and vanilla browser APIs.

### Requirements

- Node.js 22 or newer.
- Google Chrome or another Chromium browser for local unpacked-extension testing.

### Install

```sh
npm install
```

### Build

```sh
npm run build
```

The build output is written to `dist/`.

### Load The Extension In Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Select Load unpacked.
4. Choose the `dist/` directory from this repository.
5. Confirm that `scrkeyboard` appears without manifest or service-worker errors.

## Permissions

The MVP uses the smallest permission set needed for the agreed workflow:

- `storage`: stores extension settings in `chrome.storage.sync` and local runtime state, such as the remembered CapsLock setting, in `chrome.storage.local`.
- `activeTab`: lets the popup read the currently active page after the user clicks the extension action.
- `scripting`: injects or registers the keyboard content script only for approved pages.
- `optional_host_permissions`: requests access to user-approved HTTP/HTTPS sites at runtime instead of requesting broad access during installation.

The extension does not use analytics, does not send data to a backend, and does not store text typed by the operator.
