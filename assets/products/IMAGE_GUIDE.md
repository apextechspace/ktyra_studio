# KTYRA STUDIO featured garment assets

The website currently references 15 featured images grouped into:
- `assets/products/men/thobes/` — five thobe colorways
- `assets/products/women/abayas/` — five embroidered abayas
- `assets/products/women/hijabs/` — five **full khimars**, not short veils

Use matched proportions and consistent visual angles. Each image should be a transparent WebP cutout. Do not include editorial studio walls or a checkerboard pattern as flattened pixels.

The updated transparent full-khimar images are already on `main`; **do not upload them again**.

## Before merging an asset change

Run `python -m pip install Pillow` and `python scripts/check_product_assets.py` from the repo root. The GitHub Actions workflow also checks for actual transparent pixels in all 15 files whenever images or the validator change.

Image assets are concept photography for a portfolio design and do not represent live physical inventory. Gallery and hero styling are handled by `index.html`, `styles.css`, and `script.js`.
