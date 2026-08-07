#!/usr/bin/env python3
"""
Regenera as variantes responsivas das fotos reais (Wikimedia Commons) em
public/photos: AVIF + WebP + JPG nos larguras 400/800/1200/1600.

Fonte: maior variante já presente no repositório para cada slug (as fotos
originais não são versionadas). Nunca faz upscale — larguras acima do
original são ignoradas, e o consumidor usa o srcset disponível.

Uso: python3 scripts/build-photos.py
Saída extra: public/photos/index.json com as dimensões reais por slug/largura,
consumido pelo gate scripts/check-photo-credits.ts.
"""
import glob
import json
import os
from collections import defaultdict

from PIL import Image

OUT = "public/photos"
WIDTHS = [400, 800, 1200, 1600]


def collect_sources():
    best = {}
    for path in glob.glob(f"{OUT}/*"):
        name = os.path.basename(path)
        stem, _ = os.path.splitext(name)
        if "-" not in stem:
            continue
        slug, width = stem.rsplit("-", 1)
        if not width.isdigit():
            continue
        w = int(width)
        if slug not in best or w > best[slug][0]:
            best[slug] = (w, path)
    return {slug: path for slug, (_, path) in best.items()}


def main():
    sources = collect_sources()
    manifest = defaultdict(dict)

    for slug, src_path in sorted(sources.items()):
        src = Image.open(src_path).convert("RGB")
        sw, sh = src.size
        for w in WIDTHS:
            if w > sw:
                continue
            h = round(sh * w / sw)
            img = src if w == sw else src.resize((w, h), Image.LANCZOS)
            img.save(f"{OUT}/{slug}-{w}.webp", "WEBP", quality=80, method=6)
            img.save(f"{OUT}/{slug}-{w}.avif", "AVIF", quality=55)
            img.save(f"{OUT}/{slug}-{w}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
            manifest[slug][str(w)] = [w, h]
        manifest[slug]["intrinsic"] = [sw, sh]
        print(f"✓ {slug}: {sorted(k for k in manifest[slug] if k != 'intrinsic')} ({sw}x{sh})")

    with open(f"{OUT}/index.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2, sort_keys=True)
    print(f"\n✓ {len(manifest)} fotos · manifesto em {OUT}/index.json")


if __name__ == "__main__":
    main()
