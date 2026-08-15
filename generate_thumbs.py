#!/usr/bin/env python3
"""Generate thumbnails for images in `pics/` and write a new `images.json`.

Usage:
  pip install pillow
  python3 generate_thumbs.py

This creates a `thumbs/` directory with smaller images (max 320px)
and writes `images.json` as an array of {"thumb":..., "full":...}.
"""
import os
import json
import re
from PIL import Image

SRC = 'pics'
DST = 'thumbs'
SIZE = 320

os.makedirs(DST, exist_ok=True)

def numeric_key(name):
    m = re.search(r"(\d+)", name)
    return int(m.group(1)) if m else name.lower()

files = [f for f in sorted(os.listdir(SRC)) if f.lower().endswith(('.png','.jpg','.jpeg','.webp'))]
files.sort(key=numeric_key, reverse=True)

entries = []
for fn in files:
    srcp = os.path.join(SRC, fn)
    dstp = os.path.join(DST, fn)
    try:
        with Image.open(srcp) as im:
            im.thumbnail((SIZE, SIZE), Image.LANCZOS)
            # Preserve format (PNG/JPEG). Pillow will handle transparency.
            im.save(dstp, optimize=True)
        entries.append({"thumb": f"{DST}/{fn}", "full": f"{SRC}/{fn}"})
    except Exception as e:
        print('warning: failed to process', fn, e)

with open('images.json', 'w') as f:
    json.dump(entries, f, indent=2)

print(f'Generated {len(entries)} thumbnails in "{DST}/" and updated images.json')
