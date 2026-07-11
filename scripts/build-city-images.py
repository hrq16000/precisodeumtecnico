#!/usr/bin/env python3
"""Generate branded OG (1200x630) and hero (1600x900) images per national city.

Outputs:
  - public/og/cidade/<slug>.jpg
  - public/hero/cidade/<slug>.jpg

Pure-PIL, deterministic, no network. Brand palette:
  primary  #0B1F3A (deep navy)
  accent   #FFC93C (gold)
  green    #16A34A (CTA)

Each region gets a distinct accent overlay so cities feel distinct
while staying on-brand.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os, re, unicodedata, json

OUT_OG = "public/og/cidade"
OUT_HERO = "public/hero/cidade"
os.makedirs(OUT_OG, exist_ok=True)
os.makedirs(OUT_HERO, exist_ok=True)

PRIMARY = "#0B1F3A"
PRIMARY_DEEP = "#020617"
ACCENT_GOLD = "#FFC93C"
GREEN = "#16A34A"
WHITE = (255, 255, 255)

# Region tint for the radial blob
REGION_TINT = {
    "Sudeste":      "#38BDF8",   # sky
    "Sul":          "#22C55E",   # green
    "Nordeste":     "#F59E0B",   # amber
    "Centro-Oeste": "#A855F7",   # purple
    "Norte":        "#06B6D4",   # cyan
}

# Mirror src/data/nationalCities.ts
CITIES = [
    ("São Paulo", "sao-paulo", "SP", "São Paulo", "Sudeste"),
    ("Rio de Janeiro", "rio-de-janeiro", "RJ", "Rio de Janeiro", "Sudeste"),
    ("Belo Horizonte", "belo-horizonte", "MG", "Minas Gerais", "Sudeste"),
    ("Campinas", "campinas", "SP", "São Paulo", "Sudeste"),
    ("Guarulhos", "guarulhos", "SP", "São Paulo", "Sudeste"),
    ("São Bernardo do Campo", "sao-bernardo-do-campo", "SP", "São Paulo", "Sudeste"),
    ("Santos", "santos", "SP", "São Paulo", "Sudeste"),
    ("Niterói", "niteroi", "RJ", "Rio de Janeiro", "Sudeste"),
    ("Vitória", "vitoria", "ES", "Espírito Santo", "Sudeste"),
    ("Porto Alegre", "porto-alegre", "RS", "Rio Grande do Sul", "Sul"),
    ("Florianópolis", "florianopolis", "SC", "Santa Catarina", "Sul"),
    ("Joinville", "joinville", "SC", "Santa Catarina", "Sul"),
    ("Londrina", "londrina", "PR", "Paraná", "Sul"),
    ("Maringá", "maringa", "PR", "Paraná", "Sul"),
    ("Caxias do Sul", "caxias-do-sul", "RS", "Rio Grande do Sul", "Sul"),
    ("Salvador", "salvador", "BA", "Bahia", "Nordeste"),
    ("Fortaleza", "fortaleza", "CE", "Ceará", "Nordeste"),
    ("Recife", "recife", "PE", "Pernambuco", "Nordeste"),
    ("Natal", "natal", "RN", "Rio Grande do Norte", "Nordeste"),
    ("João Pessoa", "joao-pessoa", "PB", "Paraíba", "Nordeste"),
    ("Maceió", "maceio", "AL", "Alagoas", "Nordeste"),
    ("Aracaju", "aracaju", "SE", "Sergipe", "Nordeste"),
    ("São Luís", "sao-luis", "MA", "Maranhão", "Nordeste"),
    ("Teresina", "teresina", "PI", "Piauí", "Nordeste"),
    ("Brasília", "brasilia", "DF", "Distrito Federal", "Centro-Oeste"),
    ("Goiânia", "goiania", "GO", "Goiás", "Centro-Oeste"),
    ("Campo Grande", "campo-grande", "MS", "Mato Grosso do Sul", "Centro-Oeste"),
    ("Cuiabá", "cuiaba", "MT", "Mato Grosso", "Centro-Oeste"),
    ("Manaus", "manaus", "AM", "Amazonas", "Norte"),
    ("Belém", "belem", "PA", "Pará", "Norte"),
    ("Porto Velho", "porto-velho", "RO", "Rondônia", "Norte"),
    ("Palmas", "palmas", "TO", "Tocantins", "Norte"),
    ("Rio Branco", "rio-branco", "AC", "Acre", "Norte"),
    ("Boa Vista", "boa-vista", "RR", "Roraima", "Norte"),
    ("Macapá", "macapa", "AP", "Amapá", "Norte"),
]


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


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


def gradient(W, H, c1, c2):
    img = Image.new("RGB", (W, H), c1)
    top = hex_rgb(c1)
    bot = hex_rgb(c2)
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        t = 1 - (1 - t) ** 2
        r = int(top[0] + (bot[0] - top[0]) * t)
        g = int(top[1] + (bot[1] - top[1]) * t)
        b = int(top[2] + (bot[2] - top[2]) * t)
        for x in range(W):
            px[x, y] = (r, g, b)
    return img


def skyline_silhouette(W, H, slug, color=(255, 255, 255, 28)):
    """Deterministic abstract skyline driven by slug hash for variety."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    seed = sum(ord(c) for c in slug)
    x = 0
    base_y = int(H * 0.78)
    i = 0
    while x < W:
        w = 40 + ((seed + i * 7) % 70)
        h = 80 + ((seed * 3 + i * 13) % 220)
        top = base_y - h
        d.rectangle([x, top, x + w, H], fill=color)
        # window dots
        for wy in range(top + 14, H - 20, 22):
            for wx in range(x + 8, x + w - 8, 14):
                if ((seed + wx + wy) % 5) < 2:
                    d.rectangle([wx, wy, wx + 4, wy + 6], fill=(255, 201, 60, 110))
        x += w + 4
        i += 1
    return layer


def make_image(W, H, city_name, uf, state_name, region, slug, kind="og"):
    # Base gradient: navy → deep slate
    img = gradient(W, H, PRIMARY, PRIMARY_DEEP).convert("RGBA")

    # Region tint blobs
    tint = hex_rgb(REGION_TINT.get(region, "#38BDF8"))
    blob = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blob)
    bd.ellipse([W - int(W * 0.55), -int(H * 0.3), W + int(W * 0.2), int(H * 0.6)],
               fill=(*tint, 95))
    bd.ellipse([-int(W * 0.2), H - int(H * 0.55), int(W * 0.45), H + int(H * 0.2)],
               fill=(*hex_rgb(ACCENT_GOLD), 55))
    blob = blob.filter(ImageFilter.GaussianBlur(40))
    img = Image.alpha_composite(img, blob)

    # Skyline silhouette (subtle, brand-colored)
    img = Image.alpha_composite(img, skyline_silhouette(W, H, slug))

    img = img.convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")

    # Top accent bar
    d.rectangle([0, 0, W, max(6, H // 100)], fill=ACCENT_GOLD)

    # Scale fonts to canvas
    scale = H / 630.0
    pad = int(60 * scale)

    # Brand line
    brand_f = font(int(26 * scale), bold=True)
    d.text((pad, int(45 * scale)), "PRECISO DE UM TÉCNICO",
           font=brand_f, fill=ACCENT_GOLD)

    # Region chip (top-right)
    chip_f = font(int(22 * scale), bold=True)
    chip_text = f"{region.upper()}  •  REDE DE PARCEIROS"
    cw = d.textlength(chip_text, font=chip_f)
    ch = int(36 * scale)
    cx2 = W - pad
    cx1 = cx2 - cw - int(28 * scale)
    cy1 = int(40 * scale)
    cy2 = cy1 + ch
    d.rounded_rectangle([cx1, cy1, cx2, cy2], radius=int(18 * scale),
                        fill=(255, 255, 255, 22), outline=(255, 255, 255, 60), width=1)
    d.text((cx1 + int(14 * scale), cy1 + int(6 * scale)), chip_text,
           font=chip_f, fill=WHITE)

    # Pin + city name (BIG)
    pin_y = int(H * 0.32)
    # pin marker (drawn)
    pin_x = pad
    pin_r = int(22 * scale)
    d.ellipse([pin_x, pin_y, pin_x + pin_r * 2, pin_y + pin_r * 2], fill=ACCENT_GOLD)
    d.ellipse([pin_x + pin_r // 2, pin_y + pin_r // 2,
               pin_x + pin_r + pin_r // 2, pin_y + pin_r + pin_r // 2],
              fill=PRIMARY)

    label_f = font(int(28 * scale), bold=True)
    d.text((pin_x + pin_r * 2 + int(14 * scale), pin_y + int(4 * scale)),
           f"TÉCNICO EM", font=label_f, fill=(255, 255, 255, 220))

    # City title – auto-fit
    title_text = f"{city_name} – {uf}"
    target_w = W - pad * 2
    size = int(118 * scale)
    while size > 50:
        f = font(size, bold=True)
        if d.textlength(title_text, font=f) <= target_w:
            break
        size -= 4
    title_f = font(size, bold=True)
    title_y = pin_y + int(58 * scale)
    d.text((pad, title_y), title_text, font=title_f, fill=WHITE)

    # State subtitle
    sub_f = font(int(30 * scale), bold=False)
    d.text((pad, title_y + size + int(8 * scale)),
           state_name, font=sub_f, fill=(255, 255, 255, 220))

    # Bottom strip
    strip_h = int(96 * scale)
    overlay = Image.new("RGBA", (W, strip_h), (0, 0, 0, 170))
    img.paste(overlay, (0, H - strip_h), overlay)
    bf = font(int(26 * scale), bold=True)
    d.text((pad, H - strip_h + int(20 * scale)),
           "precisodeumtecnico.com", font=bf, fill=ACCENT_GOLD)
    pf = font(int(24 * scale))
    msg = "Visita a partir de R$ 99,99  •  WhatsApp 24h  •  Garantia"
    mw = d.textlength(msg, font=pf)
    d.text((W - pad - mw, H - strip_h + int(22 * scale)),
           msg, font=pf, fill=WHITE)

    # Green CTA pill (hero only)
    if kind == "hero":
        pill_f = font(int(28 * scale), bold=True)
        pill_text = "Solicitar técnico agora"
        pw = d.textlength(pill_text, font=pill_f)
        px1 = pad
        py1 = H - strip_h - int(96 * scale)
        px2 = px1 + pw + int(48 * scale)
        py2 = py1 + int(64 * scale)
        d.rounded_rectangle([px1, py1, px2, py2], radius=int(32 * scale),
                            fill=GREEN)
        d.text((px1 + int(24 * scale), py1 + int(15 * scale)),
               pill_text, font=pill_f, fill=WHITE)

    return img


def main():
    for name, slug, uf, state_name, region in CITIES:
        og = make_image(1200, 630, name, uf, state_name, region, slug, kind="og")
        og.save(f"{OUT_OG}/{slug}.jpg", "JPEG", quality=86, optimize=True)
        hero = make_image(1600, 900, name, uf, state_name, region, slug, kind="hero")
        hero.save(f"{OUT_HERO}/{slug}.jpg", "JPEG", quality=84, optimize=True)
        print(f"  ✓ {slug}")
    print(f"\nGenerated {len(CITIES)} city OG + hero images.")


if __name__ == "__main__":
    main()
