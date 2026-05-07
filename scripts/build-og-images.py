#!/usr/bin/env python3
"""Generate 1200x630 OG images for each blog category and a default.

Outputs to public/og/<slug>.jpg and public/og-image.jpg (default).
Uses Pillow only — no external assets required.
"""
from PIL import Image, ImageDraw, ImageFont
import os, math, textwrap

OUT_DIR = "public/og"
os.makedirs(OUT_DIR, exist_ok=True)

W, H = 1200, 630

# Category slug -> (display name, primary hex, accent hex, tagline)
CATEGORIES = {
    "default":        ("Preciso de Um Técnico", "#0B1F3A", "#FFC93C", "Assistência técnica em Curitiba e região • 24h"),
    "informatica":    ("Informática",            "#0B1F3A", "#22C55E", "Manutenção, formatação e suporte de PC"),
    "redes-wifi":     ("Redes & Wi-Fi",          "#0B1F3A", "#38BDF8", "Roteadores, sinal forte e mesh"),
    "cftv-seguranca": ("CFTV & Segurança",       "#0B1F3A", "#EF4444", "Câmeras, DVR e acesso remoto"),
    "eletrica":       ("Elétrica Residencial",   "#0B1F3A", "#F59E0B", "Instalações seguras e NR-10"),
    "ar-condicionado":("Ar-Condicionado",        "#0B1F3A", "#06B6D4", "Instalação, limpeza e manutenção"),
    "celulares":      ("Celulares & Tablets",    "#0B1F3A", "#A855F7", "Tela, bateria e software"),
    "guias-precos":   ("Guias de Preço",         "#0B1F3A", "#FFC93C", "Quanto custa cada serviço técnico"),
    "precos":         ("Tabela de Preços",       "#0B1F3A", "#FFC93C", "Transparência total: visita a partir de R$ 99,99"),
    "blog":           ("Blog Técnico",           "#0B1F3A", "#FFC93C", "Tutoriais, guias e tabelas de preço"),
}

def font(size, bold=False):
    candidates_bold = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    candidates_reg = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in (candidates_bold if bold else candidates_reg):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def gradient(c1, c2):
    img = Image.new("RGB", (W, H), c1)
    top = hex_to_rgb(c1)
    bot = hex_to_rgb(c2)
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        # ease-out
        t = 1 - (1 - t) ** 2
        r = int(top[0] + (bot[0] - top[0]) * t)
        g = int(top[1] + (bot[1] - top[1]) * t)
        b = int(top[2] + (bot[2] - top[2]) * t)
        for x in range(W):
            px[x, y] = (r, g, b)
    return img

def draw_card(slug, title, primary, accent, tagline):
    # Background gradient: primary -> darker
    img = gradient(primary, "#020617")
    d = ImageDraw.Draw(img, "RGBA")

    # Decorative accent radial blobs
    blob = Image.new("RGBA", (W, H), (0,0,0,0))
    bd = ImageDraw.Draw(blob)
    ar, ag, ab = hex_to_rgb(accent)
    bd.ellipse([W-520, -200, W+200, 380], fill=(ar, ag, ab, 90))
    bd.ellipse([-200, H-300, 420, H+200], fill=(ar, ag, ab, 55))
    blob = blob.filter_blur if False else blob
    img = Image.alpha_composite(img.convert("RGBA"), blob).convert("RGB")
    d = ImageDraw.Draw(img)

    # Top brand bar
    d.rectangle([0, 0, W, 8], fill=accent)

    # Brand
    brand = "PRECISO DE UM TÉCNICO"
    bf = font(28, bold=True)
    d.text((60, 50), brand, font=bf, fill=accent)

    # Tagline small
    tf = font(26)
    d.text((60, 95), tagline, font=tf, fill=(255, 255, 255))

    # Title (wrap)
    title_font = font(78, bold=True)
    # auto-wrap
    max_w = W - 120
    words = title.split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        bbox = d.textbbox((0, 0), test, font=title_font)
        if bbox[2] - bbox[0] > max_w and cur:
            lines.append(cur)
            cur = w
        else:
            cur = test
    if cur:
        lines.append(cur)
    if len(lines) > 4:
        lines = lines[:4]
        lines[-1] = lines[-1].rstrip(".") + "…"

    line_h = 92
    total_h = line_h * len(lines)
    y = (H - total_h) // 2 + 20
    for ln in lines:
        d.text((60, y), ln, font=title_font, fill=(255, 255, 255))
        y += line_h

    # Bottom strip with URL + price
    d.rectangle([0, H-90, W, H], fill=(0, 0, 0, 180))
    sf = font(28, bold=True)
    d.text((60, H-66), "precisodeumtecnico.com", font=sf, fill=accent)
    pf = font(26)
    d.text((W-460, H-64), "Visita a partir de R$ 99,99 • 24h", font=pf, fill=(255, 255, 255))

    return img

def main():
    for slug, (name, primary, accent, tagline) in CATEGORIES.items():
        title = f"{name}" if slug in ("default",) else f"{name} — {tagline.split('•')[0].strip()}"
        if slug == "default":
            title = "Assistência técnica de confiança em Curitiba e região"
        img = draw_card(slug, title, primary, accent, tagline)
        if slug == "default":
            path = "public/og-image.jpg"
        else:
            path = f"{OUT_DIR}/{slug}.jpg"
        img.save(path, "JPEG", quality=88, optimize=True)
        print("✓", path)

if __name__ == "__main__":
    main()
