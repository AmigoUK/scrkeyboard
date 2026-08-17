# ScrKeyboard Roadmap To Chrome Web Store

Date: 2026-08-17

Status: agreed

Baseline version: `0.8.2`

## Context

ScrKeyboard is a Manifest V3 on-screen keyboard aimed at operators of business web
applications on touch screens. The agreed destination is a public Chrome Web Store
listing for that B2B niche, and a named pilot company with a real WebForms
application is available for day-to-day use before publication.

That combination sets the sequencing: the pilot is the cheapest source of truth,
and store reviews are effectively permanent. Learning from ten operators costs
less than learning from a one-star review.

## Findings That Shaped The Plan

Three gaps are more serious than `docs/PROJECT_STATE.md` suggests.

1. **The keyboard has no punctuation at all.** `src/content/keyboardLayout.ts`
   defines only `a-z` letter rows plus a `0-9` numeric keypad. There is no full
   stop, comma, hyphen, slash, at sign or underscore. An operator cannot type an
   email address, a date such as `12/03`, or a reference such as `ORD-2024/15`.
   The project's own manual fixture contains a *Customer reference* field.
2. **`manifest.json` declares no icons.** There is no `icons` object, no
   `action.default_icon`, and no icon files in the repository. This blocks a store
   submission outright and currently leaves the toolbar showing a generated
   placeholder.
3. **There is no onboarding.** `chrome.runtime.onInstalled` only initialises
   settings. The whitelist is empty by default, so a user who installs from the
   store sees nothing happen and gets no explanation.

## Value Ranking

| Tier | Work | Rationale |
| --- | --- | --- |
| 1 | Symbols and punctuation | Without it the product does not do what it promises |
| 1 | Extension icons | Hard store blocker |
| 1 | Post-install onboarding | Protects store rating; reviews are not reversible |
| 1 | Privacy policy and data declarations | Store requirement |
| 2 | CSV import / configuration profile | The B2B differentiator: an administrator configures once and distributes |
| 2 | Polish diacritics | Directly serves the pilot company |
| 2 | Tab navigation | Completes a whole form without a physical keyboard |
| 3 | End-to-end coverage of the content script | The most fragile layer has none |
| 3 | Hardening for arbitrary pages | "Any site" is not the local fixture |
| 3 | Splitting `src/options/options.ts` | 759 lines; it taxes every later feature |

Deliberately deferred: phrase colour reset, wider options persistence coverage,
keyboard resizing and docking, further locales. These are cosmetic next to the
table above.

## Iterations

Each iteration is a separate sub-project with its own design document and
implementation plan. Only iteration 1 is specified in detail today.

### Iteration 1 — `v0.9.0` — An operator can fill in a form

Symbols and punctuation, Polish diacritics, Tab navigation, extension icons.
Ships to the pilot company. See
`2026-08-17-v0.9-input-coverage-design.md`.

### Iteration 2 — `v0.10.0` — A company can deploy it

CSV import as the inverse of the existing export, a welcome page on
`onInstalled`, and a popup flow that leads a new user to their first site
approval. Removes the "installed but nothing happens" failure and lets one
administrator configure many operators.

### Iteration 3 — `v0.11.0` — It will not break for strangers

End-to-end tests driving an unpacked extension, hardening against hostile page
CSS, nested frames and single-page-application re-rendering, and splitting
`src/options/options.ts` along its existing seams.

### Iteration 4 — `v1.0.0` — Store

Privacy policy, data-usage declarations, per-permission justifications,
screenshots and listing copy, and a repeatable release checklist.

## Sequencing Rules

- Iteration 1 ships to the pilot before iteration 2 starts, so pilot feedback can
  reorder later work.
- Store-facing work stays last. It is mechanical and can be done at any time; the
  product decisions it documents cannot.
- Any iteration may grow from pilot feedback. Feedback that contradicts this
  ranking wins.
