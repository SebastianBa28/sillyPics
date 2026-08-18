#!/usr/bin/env python3
"""Process new pictures from newPics: resize to medium, convert to WebP, save to pics/.

Usage:
  pip install pillow
  python3 process_new_pics.py
"""
import os
import json
import re
import shutil
from PIL import Image

SRC = 'newPics'
DST = 'pics'
SIZE = 1600
QUALITY = 85

def numeric_key(name):
    m = re.search(r"(\d+)", name)
    return int(m.group(1)) if m else name.lower()

# Clear pics directory
if os.path.exists(DST):
    shutil.rmtree(DST)
os.makedirs(DST, exist_ok=True)

# Get files sorted numerically
files = [f for f in os.listdir(SRC) if f.lower().endswith(('.png','.jpg','.jpeg','.webp'))]
files.sort(key=numeric_key, reverse=True)

entries = []
for fn in files:
    srcp = os.path.join(SRC, fn)
    # Convert to WebP with base name
    base, _ = os.path.splitext(fn)
    dstp = os.path.join(DST, base + '.webp')
    try:
        with Image.open(srcp) as im:
            # Resize to medium
            im_copy = im.copy()
            im_copy.thumbnail((SIZE, SIZE), Image.LANCZOS)
            
            # Convert to RGB for WebP (required for JPEG sources)
            im_rgb = im_copy.convert('RGB')
            
            # Save as WebP
            im_rgb.save(dstp, 'WEBP', quality=QUALITY, method=6)
            
        entries.append({ 'medium': f"{DST}/{base}.webp", 'full': f"{DST}/{base}.webp" })
        print(f'Processed: {fn} -> {base}.webp')
    except Exception as e:
        print(f'warning: failed to process {fn}: {e}')

# Write images.json
with open('images.json', 'w') as f:
    json.dump(entries, f, indent=2)

print(f'\n✓ Processed {len(entries)} images')
print(f'✓ Saved to "{DST}/" as WebP')
print(f'✓ Updated images.json')
