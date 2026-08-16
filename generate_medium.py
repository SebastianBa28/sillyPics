#!/usr/bin/env python3
"""Generate medium-sized images in `medium/` and write `images.json` as
an array of { "medium": ..., "full": ... } objects.

Usage:
  pip install pillow
  python3 generate_medium.py
"""
import os
import json
import re
from PIL import Image

SRC = 'pics'
DST = 'medium'
SIZE = 1600

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
            im_copy = im.copy()
            im_copy.thumbnail((SIZE, SIZE), Image.LANCZOS)
            fmt = im.format or 'PNG'
            save_kwargs = {}
            if fmt.upper() in ('JPEG', 'JPG'):
                save_kwargs.update({'quality': 85, 'optimize': True})
                im_copy = im_copy.convert('RGB')
            else:
                save_kwargs.update({'optimize': True})
            im_copy.save(dstp, format=fmt, **save_kwargs)
        entries.append({ 'medium': f"{DST}/{fn}", 'full': f"{SRC}/{fn}" })
    except Exception as e:
        print('warning: failed to process', fn, e)

with open('images.json', 'w') as f:
    json.dump(entries, f, indent=2)

print(f'Generated {len(entries)} medium images in "{DST}/" and updated images.json')
