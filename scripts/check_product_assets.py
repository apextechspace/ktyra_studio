"""Validate KTYRA STUDIO product assets, including real transparent pixels.

Run from the repository root:
    python -m pip install Pillow
    python scripts/check_product_assets.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
GROUPS = {
    "men/thobes": [
        "classic-thobe-pearl-white", "classic-thobe-desert-sand",
        "classic-thobe-midnight-navy", "classic-thobe-graphite",
        "classic-thobe-onyx-black",
    ],
    "women/abayas": [
        "embroidered-abaya-onyx", "embroidered-abaya-plum",
        "embroidered-abaya-taupe", "embroidered-abaya-emerald",
        "embroidered-abaya-sand",
    ],
    "women/hijabs": [
        "full-khimar-onyx", "full-khimar-plum", "full-khimar-taupe",
        "full-khimar-emerald", "full-khimar-sand",
    ],
}

errors = []
passed = 0
for folder, names in GROUPS.items():
    for name in names:
        relative = Path("assets/products") / folder / f"{name}.webp"
        file_path = ROOT / relative
        try:
            with Image.open(file_path) as image:
                image.load()
                if image.format != "WEBP":
                    raise ValueError("not a valid WebP")
                if image.width < 200 or image.height < 200:
                    raise ValueError(f"image too small: {image.size}")
                if "A" not in image.getbands():
                    raise ValueError("no alpha channel")
                alpha = image.getchannel("A")
                minimum, maximum = alpha.getextrema()
                if minimum >= 255:
                    raise ValueError("alpha exists, but all pixels are opaque")
                if maximum < 230:
                    raise ValueError("garment pixels unexpectedly translucent")
                transparent_fraction = sum(
                    count for level, count in enumerate(alpha.histogram()) if level < 32
                ) / (image.width * image.height)
                if transparent_fraction < 0.02:
                    raise ValueError("background may be baked in (fewer than 2% transparent pixels)")
                print(f"PASS {relative} — {image.width}×{image.height}")
                passed += 1
        except (FileNotFoundError, OSError, ValueError) as error:
            errors.append(f"{relative}: {error}")
            print(f"FAIL {relative}: {error}")

print(f"\n{passed} product files passed; {len(errors)} failed.")
if errors:
    raise SystemExit(1)
