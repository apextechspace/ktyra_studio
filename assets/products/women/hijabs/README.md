# Full Khimars — transparent garment assets

KTYRA STUDIO features **long, full-coverage khimars**, not short veils. Each color should be an isolated, alpha-enabled WebP with consistent framing.

The five required filenames are:
- `full-khimar-onyx.webp`
- `full-khimar-plum.webp`
- `full-khimar-taupe.webp`
- `full-khimar-emerald.webp`
- `full-khimar-sand.webp`

All five current files must be **replaced**, not duplicated or renamed. Upload the five replacement `.webp` files on the `fix/transparent-khimars` branch (rather than `main`). The website's hero/gallery reference these exact paths.

The transparent WebP requirement can be tested using:
```
node scripts/validate-product-assets.mjs
```
A pull-request check also runs the same validation. Do not merge until the five replacement files are uploaded and QA passes.
