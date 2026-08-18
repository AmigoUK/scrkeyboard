# Chrome Web Store assets

Every file here is already at the exact size the Developer Dashboard requires.
Upload them as they are — no cropping or resizing.

| Dashboard field | File | Size |
| --- | --- | --- |
| Store icon | `store-icon-128x128.png` | 128 × 128 (96 × 96 artwork, transparent padding) |
| Screenshot 1 | `screenshot-1-letters-1280x800.png` | 1280 × 800 |
| Screenshot 2 | `screenshot-2-symbols-1280x800.png` | 1280 × 800 |
| Screenshot 3 | `screenshot-3-diacritics-1280x800.png` | 1280 × 800 |
| Screenshot 4 | `screenshot-4-setup-1280x800.png` | 1280 × 800 |
| Small promo tile | `promo-small-440x280.png` | 440 × 280 |
| Marquee promo tile (optional) | `promo-marquee-1400x560.png` | 1400 × 560 |

Do not upload anything from [`../../screenshots/`](../../screenshots/) — those
are 1280 × 860, sized for the README, and the store rejects them.

The screenshots are rendered from the extension's own code: the real
`createKeyboardView` with its unmodified shadow-DOM styles, and the real built
options page, over a sample warehouse form.
