# ScrKeyboard Privacy Policy

**Last updated: 18 August 2026**

ScrKeyboard is a Chrome extension that shows an on-screen keyboard for operators
of business web applications on touch screens. This policy explains what the
extension stores, where, and what it does not do.

## What is stored

ScrKeyboard stores only the configuration you enter yourself:

- **Extension settings** — the global enabled/disabled state, UI language,
  Enter/Ctrl+Enter mode, approved and blocked site rules, and any quick
  phrases and button colours you configure. These are stored under
  `chrome.storage.sync`.
- **Remembered CapsLock state** — whether CapsLock was on the last time the
  keyboard was used, stored under `chrome.storage.local` so the keyboard
  opens in the same state next time.

That is the complete list. Nothing else is written to storage by the
extension.

## Where it is stored

All of the above lives in the browser's own extension storage areas,
provided by the Chrome `storage` API. `chrome.storage.sync` data is
synchronised between your devices by Chrome itself, using your Google
account sync, if you are signed in to Chrome and have sync enabled — the
same mechanism Chrome uses to sync bookmarks or other extension settings.
ScrKeyboard does not operate, and has no access to, any server of its own.

## What is never stored or transmitted

ScrKeyboard does not record, log, or transmit anything you type into a
web page. The keyboard sends key input directly to the focused field on
the page, exactly as a physical keyboard would, and keeps no history of it.

The extension has **no backend**. It does not make network requests, does
not use analytics or crash-reporting services, and does not send any data
anywhere. You can verify this yourself: the source is available at
<https://github.com/AmigoUK/scrkeyboard>, and it contains no `fetch`, no
`XMLHttpRequest`, and no analytics or telemetry code of any kind.

Password fields are ignored by the keyboard unless a site's rule
explicitly allows them, and even then no password input is stored — the
keyboard only relays keystrokes to the page.

## Site access

ScrKeyboard does nothing on any site until you approve it. Access to a
site is requested as an optional Chrome host permission at the moment you
approve that site from the ScrKeyboard popup — not granted broadly at
install time. You can review or revoke this access at any time from
`chrome://extensions`, under ScrKeyboard's site access settings, or by
removing the site from the approved list in ScrKeyboard's options page.

## How to remove your data

- **Remove a single site or phrase**: use the ScrKeyboard options page to
  delete the rule or phrase you no longer want.
- **Remove all ScrKeyboard data**: uninstalling the extension from
  `chrome://extensions` removes its stored settings and CapsLock state.
  You can also clear all settings from within the options page before
  uninstalling if you want to reset without removing the extension.

## Changes to this policy

If this policy changes, the "Last updated" date above will change and the
updated text will be published at the same address.

## Contact

Questions about this policy or ScrKeyboard's data handling can be sent to
[dev@attv.uk](mailto:dev@attv.uk).
