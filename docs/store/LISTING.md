# ScrKeyboard — Chrome Web Store Listing

Everything below is written from the shipped `v0.10.0` source (`README.md`, `manifest.json`,
`CHANGELOG.md`, `src/`) — nothing here describes a feature that is not actually in the code.
Work through it top to bottom and paste each fenced block straight into the matching field in
the Developer Dashboard.

---

## 1. Extension name

Limit: 75 characters.

```
ScrKeyboard
```

Length: **11 / 75**.

---

## 2. Summary / short description

Limit: **132 characters — hard limit.**

```
On-screen keyboard for warehouse, CRM and order-entry terminals on touch screens. Approve a site once; nothing typed is stored.
```

Length: **127 / 132** (counted with `wc -c` on the exact string, no trailing newline).

---

## 3. Detailed description

Limit: 16,000 characters. Written to be read, not keyword-stuffed.

```
ScrKeyboard is an on-screen keyboard built for operators of business web applications on touch screens: warehouse terminals, production floors, reception desks, CRM and order-entry systems. It is not a general-purpose accessibility keyboard — it is purpose-built for touch-screen workstations where a physical keyboard is awkward or missing, and where every extra panel takes space away from the operator's actual work.

Features:
- Three keyboard modes: letters, symbols (reached from the ?# key) for full punctuation, and a one-shot Polish diacritics mode (ĄĘ) that composes with Shift.
- A punctuation column (full stop, comma, hyphen, at sign) on the numeric keypad, available in every mode, so dates, references and email addresses are always reachable.
- A Tab key that moves focus to the next editable field without closing the keyboard, so a whole form can be completed without a physical keyboard.
- One-tap quick phrases, global and per-site, with operator-chosen button colours and automatic black-or-white text for contrast.
- CapsLock state remembered between sessions.
- Enter or Ctrl+Enter confirmation mode, with the focused field automatically scrolled clear of the keyboard panel.
- English and Polish interface.
- Approved and blocked site rules with wildcard support, managed from a full options page; blocked rules always take precedence over approved ones.

How it works: ScrKeyboard does nothing until you approve a site. Open the ScrKeyboard icon on the page you want to use it on and add the site — that is the whole setup. From then on, a keyboard panel docks to the bottom of the page whenever the operator focuses an editable field, and hides again on Enter, Close, or a click outside the field.

Site access is requested as an optional Chrome permission at the moment you approve a site, never granted broadly at install, and you can review or revoke it at any time from Chrome's extension settings. Password fields are ignored unless a site's rule explicitly allows them.

Privacy: ScrKeyboard has no backend and no analytics. It does not record or transmit anything typed into a page; it only relays keystrokes to the focused field, exactly as a physical keyboard would. The only things stored are your own configuration — site rules, phrases, language, colours — and the last CapsLock state, kept in Chrome's own extension storage and synced by Chrome itself if you are signed in. Nothing leaves the browser.
```

Length: **2,451 characters / 393 words** — comfortably under 16,000, and long enough to read as
a real listing rather than a keyword list.

---

## 4. Category

**Recommended: Tools.** Second choice if unavailable: **Functionality & UI**.

ScrKeyboard is an input tool. Google's own description of *Workflow & Planning* is "time
trackers, tools to stay focused, to-do list managers, email organizers, document editors, and
calendar utilities" — that category is about organising work, not about entering text, and
ScrKeyboard belongs in none of those groups. *Functionality & UI* covers extensions that change
how you interact with the browser, including keyboard shortcuts, so it is the closer fallback.

Do **not** pick *Accessibility*. It is tempting by name, but that category serves users with
disabilities, whereas ScrKeyboard targets operators working at touch terminals. Listing it there
would misrepresent the audience and attract reviews from people expecting assistive technology.

## 5. Language

**English** — this is the default listing language, matching `manifest.json`'s
`default_locale: "en"`. Polish (`pl`) is shipped as an additional in-product UI locale but the
store listing itself should be submitted in English first; a Polish listing translation can be
added later from the same dashboard if useful for the Polish pilot company.

---

## 6. Single purpose description

```
ScrKeyboard's single purpose is to display an on-screen keyboard so operators can enter text into editable fields on business web applications, on touch-screen devices that lack a physical keyboard. It activates only on individual sites the operator has explicitly approved.
```

---

## 7. Permission justifications

One paragraph per permission, matching exactly what `manifest.json` declares
(`permissions: ["storage", "activeTab", "scripting"]`, `optional_host_permissions: ["http://*/*", "https://*/*"]`).

### `storage`

```
This permission is used to store the operator's own ScrKeyboard configuration — approved and blocked site rules, quick phrases, button colours, UI language and Enter/Ctrl+Enter mode — in chrome.storage.sync, and to remember the on-screen keyboard's CapsLock state in chrome.storage.local between sessions. No data other than this configuration is stored, and none of it is text the operator has typed into a page.
```

### `activeTab`

```
This permission is used to let the extension's popup read the URL of the page the operator is currently viewing, so it can display the current site's host and offer a one-click "Add current site" action. It is only invoked when the operator opens the popup and grants no persistent or background access to the page beyond that single interaction.
```

### `scripting`

```
This permission is used to inject and register the on-screen keyboard content script only on the specific pages the operator has approved through the popup or options page. No content script is ever injected into a page that has not been approved, and the registration is kept in sync whenever the operator's site rules change.
```

### `optional_host_permissions` (`http://*/*`, `https://*/*`)

```
These are optional host permissions, not requested at install time — Chrome grants no host access when ScrKeyboard is installed. ScrKeyboard requests access to exactly one origin, only when the operator explicitly approves that site from the popup, via chrome.permissions.request scoped to that origin's own pattern (for example https://crm.example.com/*). Until an operator approves at least one site, the extension's whitelist is empty by default and the extension has no host access at all — it is completely inert on every page. The broad http://*/* and https://*/* entries exist only because ScrKeyboard is designed to work on whatever internal business system a customer already runs — warehouse software, CRM, order-entry systems — each living on its own domain that cannot be known in advance, so the optional permission set has to be able to name any of them. Access to any individual site remains strictly opt-in, one origin at a time, and can be reviewed or revoked at any time from chrome://extensions or from ScrKeyboard's own options page.
```

---

## 8. Data usage disclosures

State the answer for each Chrome Web Store data category, then the three certifications.

| Category | Collected? | Reason |
| --- | --- | --- |
| Personally identifiable information | No | ScrKeyboard relays keystrokes to the page's own field; it never reads, copies or stores field values or any identifying information. |
| Health information | No | Not accessed, not stored. |
| Financial and payment information | No | Not accessed, not stored. |
| Authentication information | No | Password fields are ignored by default and only relayed (never read or stored) even on sites whose rule explicitly allows them. |
| Personal communications | No | ScrKeyboard has no messaging, email or chat surface and reads no page content. |
| Location | No | Not accessed; no geolocation API is used. |
| Web history | No | `activeTab` is read only to display the current site in the popup and match it against the operator's own site rules; no browsing history is recorded, stored or transmitted anywhere. |
| User activity | No | Keystrokes, clicks and scroll behaviour on the page are not logged; the keyboard only forwards the key the operator pressed to the focused field, exactly as a physical keyboard would. |
| Website content | No | The extension does not read, copy or store the content of any web page. |

Certifications (all confirmed true for ScrKeyboard):

- **I do not sell or transfer user data to third parties** — confirmed. ScrKeyboard collects no
  user data in the first place; there is no backend to sell data from.
- **I do not use or transfer user data for purposes unrelated to the item's single purpose** —
  confirmed. The only data ScrKeyboard stores is the operator's own configuration, used solely to
  run the on-screen keyboard.
- **I do not use or transfer user data to determine creditworthiness or for lending purposes** —
  confirmed. Not applicable; no such data is collected or could be derived from what ScrKeyboard
  stores.

---

## 9. Support and homepage URLs

```
Homepage URL:  https://github.com/AmigoUK/scrkeyboard
Support URL:   https://github.com/AmigoUK/scrkeyboard/issues
```

The owner's own site, `https://www.attv.uk`, can additionally be set as the developer/publisher
website in the account-level "Store listing" settings if the dashboard offers that separate
field — it is not a per-item URL.

---

## 10. Privacy policy URL

```
https://github.com/AmigoUK/scrkeyboard/blob/main/docs/store/PRIVACY.md
```

This is the GitHub-rendered `blob` view of `docs/store/PRIVACY.md` on `main` (confirmed publicly
reachable — the repository is public, both the repo page and raw file returned HTTP 200 at the
time of writing). It is a legitimate, permanent URL and fine to submit as-is. If the owner later
wants a branded, non-GitHub page, the same Markdown content can be moved to a page under
`www.attv.uk` and the dashboard field updated — the store only requires the URL to resolve to the
current policy text, not any particular hosting.

---

## Assets — ready to upload

Everything the dashboard asks for is committed in `docs/store/assets/`, already at the exact
sizes the store requires. Upload them as-is.

| Dashboard field | File | Size |
| --- | --- | --- |
| Store icon | `store-icon-128x128.png` | 128 × 128, 96 × 96 artwork on transparent padding |
| Screenshot 1 | `screenshot-1-letters-1280x800.png` | 1280 × 800 |
| Screenshot 2 | `screenshot-2-symbols-1280x800.png` | 1280 × 800 |
| Screenshot 3 | `screenshot-3-diacritics-1280x800.png` | 1280 × 800 |
| Screenshot 4 | `screenshot-4-setup-1280x800.png` | 1280 × 800 |
| Small promo tile | `promo-small-440x280.png` | 440 × 280 |
| Marquee promo tile (optional) | `promo-marquee-1400x560.png` | 1400 × 560 |

The screenshots were captured from the extension's own rendering code — the real
`createKeyboardView` with its unmodified shadow-DOM styles, and the real built options page —
over a sample warehouse form. They are not mock-ups, and they are not captures of a live
customer system.

There is no YouTube video. That field is optional; leave it blank.

## Pre-submission checklist

Concrete things to check or do before hitting Publish — not text to paste, work to do:

1. ~~**Screenshots are the wrong size for the store.**~~ **DONE** — re-rendered at 1280 × 800 and committed to `docs/store/assets/`. Original note kept for context: `docs/screenshots/*.png` are
   `1280 × 860`. The Chrome Web Store requires listing screenshots at exactly `1280 × 800` or
   `640 × 400` (24-bit PNG or JPEG, no alpha channel). Crop or re-render the three existing
   screenshots to `1280 × 800` before upload — as captured they will be rejected by the upload
   dialog. Regenerate from the same fixture rather than stretching the existing PNGs, to avoid
   distortion.
2. ~~**No promotional tile exists in the repo.**~~ **DONE** — both the 440 × 280 small tile and the optional 1400 × 560 marquee are committed. Original note: A small promo tile (`440 × 280`) is optional in
   the current dashboard but improves discoverability in category browsing; decide whether to
   commission/create one before or shortly after the first submission — it is not a hard blocker.
3. ~~**Icon files are 16-bit-per-channel PNGs**~~ **DONE** — all four re-encoded as 8-bit RGBA (also roughly halving their size). Original note: (`file icons/*.png` reports
   `16-bit/color RGBA` for all four sizes). Standard PNG decoders handle this fine, but it is
   unusual output from the ImageMagick conversion step in `README.md`'s icon-regeneration
   command; open `icons/icon-128.png` in the dashboard's icon preview once uploaded and confirm
   it renders cleanly (no colour banding, no forced downsampling artefacts) before relying on it.
4. **Verify the ZIP contents, not just the `dist/` folder.** Run `npm run build` fresh, then zip
   the *contents* of `dist/` (manifest.json at the zip root), not the `dist` directory itself —
   a nested-folder zip is a common cause of "manifest not found" upload failures. `npm run check`
   already runs `validate:extension`, which confirms icons, locales and the popup/options/service
   worker files exist in `dist/` — run it one more time immediately before packaging.
5. **Load the freshly built `dist/` as an unpacked extension once more** right before
   submission (`chrome://extensions` → Developer mode → Load unpacked) and click through: popup
   → approve a test site → focus a field → confirm the keyboard docks and all three modes work.
   This catches anything a stale local build might hide.
6. **Expect reviewer scrutiny of the broad optional host permission.** `http://*/*` and
   `https://*/*` in `optional_host_permissions` are the single most likely thing to trigger a
   manual review or a clarification request, even though they are optional and per-site in
   practice. The justification in section 7 above anticipates this; be ready to answer a
   reviewer follow-up in the same terms (inert by default, one origin requested at a time, no
   data collection) rather than being surprised by it.
7. **Confirm the repository stays public.** Both the privacy policy URL and the homepage/support
   URLs point at `github.com/AmigoUK/scrkeyboard`. If that repository is ever made private, all
   three listing fields break silently until updated.
8. **Decide on a Polish listing translation later, not now.** The product ships an `_locales/pl`
   UI, but the store *listing* text in this document is English-only by design (see section 5).
   A Polish listing can be added as a translation in the dashboard once the English listing is
   live, without touching the extension itself.
9. **Double-check `manifest.json` has no leftover unused permission** before packaging — as of
   this document it declares exactly `storage`, `activeTab`, `scripting` plus the two optional
   host patterns, and every one of those is justified in section 7. If a future change adds or
   removes a permission, section 7 needs updating in the same commit, not after submission.
