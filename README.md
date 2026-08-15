# Photo Collage

This folder contains a small static photo collage site.

Thumbnail workflow (recommended for GitHub Pages):

1. Install Pillow: `pip install pillow`
2. Generate thumbnails and update `images.json`:

```bash
python3 generate_thumbs.py
```

3. Serve locally for testing:

```bash
python3 -m http.server 8000
```

The site uses `images.json` which maps `thumbs/*` to `pics/*`. The grid displays thumbnails and only loads full images when you click a thumbnail.

If you prefer not to commit thumbnails to the repo, run `generate_thumbs.py` during your build process or host thumbnails on a CDN.

