# Photo Collage

This folder contains a small static photo collage site.

Serve locally for testing:

```bash
python3 -m http.server 8000
```

This project now supports medium-sized images stored in `medium/` to improve load performance without altering originals.

To generate medium images locally (Pillow required):

```bash
pip install pillow
python3 generate_medium.py
```

The script writes `medium/` and updates `images.json` to map `medium/*` to `pics/*`.

