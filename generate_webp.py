#!/usr/bin/env python3
"""Generate WebP versions of files in `medium/` alongside existing files.

Creates `medium/*.webp` with reasonable quality. Does not modify originals.

Usage:
  python3 generate_webp.py
"""
import os
from PIL import Image

SRC_DIR = 'medium'
QUALITY = 85

if not os.path.isdir(SRC_DIR):
    print(f"Directory '{SRC_DIR}' not found. Run generate_medium.py first.")
    raise SystemExit(1)

files = [f for f in sorted(os.listdir(SRC_DIR)) if f.lower().endswith(('.png','.jpg','.jpeg','.webp'))]
count = 0
for fn in files:
    src = os.path.join(SRC_DIR, fn)
    base, _ = os.path.splitext(fn)
    dst = os.path.join(SRC_DIR, base + '.webp')
    try:
        with Image.open(src) as im:
            im_conv = im.convert('RGB')
            im_conv.save(dst, 'WEBP', quality=QUALITY, method=6)
        count += 1
    except Exception as e:
        print('warning:', fn, e)

print(f'Generated {count} WebP files in "{SRC_DIR}/"')
