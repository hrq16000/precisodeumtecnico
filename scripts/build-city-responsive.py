#!/usr/bin/env python3
"""Generate responsive WebP variants of city hero/OG images.

Reads the JPGs created by build-city-images.py and produces:
  - public/hero/cidade/<slug>-{800,1200,1600}.webp
  - public/hero/cidade/<slug>-800.jpg   (small JPG fallback)
  - public/og/cidade/<slug>.webp        (1200x630)

The 1200w hero is used as the preload target on each city page.
"""
import os, glob
from PIL import Image

HERO_DIR = "public/hero/cidade"
OG_DIR = "public/og/cidade"

HERO_WIDTHS = [800, 1200, 1600]


def resize(img, w):
    h = round(img.height * (w / img.width))
    return img.resize((w, h), Image.LANCZOS)


def process_hero(path):
    slug = os.path.splitext(os.path.basename(path))[0]
    with Image.open(path) as im:
        im = im.convert("RGB")
        for w in HERO_WIDTHS:
            r = resize(im, w) if w < im.width else im.copy()
            r.save(f"{HERO_DIR}/{slug}-{w}.webp", "WEBP", quality=78, method=6)
        # small jpg fallback
        resize(im, 800).save(f"{HERO_DIR}/{slug}-800.jpg",
                             "JPEG", quality=80, optimize=True, progressive=True)


def process_og(path):
    slug = os.path.splitext(os.path.basename(path))[0]
    with Image.open(path) as im:
        im = im.convert("RGB")
        im.save(f"{OG_DIR}/{slug}.webp", "WEBP", quality=82, method=6)


def main():
    heros = sorted(glob.glob(f"{HERO_DIR}/*.jpg"))
    # filter out any previously-generated -<w>.jpg fallbacks
    heros = [p for p in heros if "-800.jpg" not in p]
    for p in heros:
        process_hero(p)
        print(f"  hero ✓ {os.path.basename(p)}")
    ogs = sorted(glob.glob(f"{OG_DIR}/*.jpg"))
    for p in ogs:
        process_og(p)
        print(f"  og   ✓ {os.path.basename(p)}")
    print(f"\nDone: {len(heros)} heroes × {len(HERO_WIDTHS)} widths + jpg800; {len(ogs)} OG webp.")


if __name__ == "__main__":
    main()
