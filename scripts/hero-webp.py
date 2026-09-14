"""Converte public/logo-hero-v1.png (prodotto da build-icons.ps1) in WebP.

Il PNG con alpha a 800px pesa ~790 kB: troppo per un'immagine sopra la
piega della landing. In WebP con alpha scende sotto i 100 kB senza perdita
visibile. Uso:  python scripts/hero-webp.py   (richiede Pillow)
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
src = root / 'public' / 'logo-hero-v1.png'
dst = src.with_suffix('.webp')

img = Image.open(src).convert('RGBA')
img.save(dst, 'WEBP', quality=84, method=6)
src.unlink()
print(f'{dst.name}: {img.width}x{img.height}  {dst.stat().st_size // 1024} kB')
