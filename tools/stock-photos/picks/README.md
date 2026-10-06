# Saved photo picks

The reviewed choices behind the one-photo-per-recipe set.

- `plan.json`: groups of recipes that share a dish search, each with its first ("base") photo.
- `pools.json`, `alt_cands.json`, `alt2_cands.json`: extra Pixabay candidates per group.
- `picks.txt`, `alt_picks.txt`: the chosen candidates, as `<group index>:<candidate>,<candidate>`.
- `fix_cands.json`: candidates used to replace the coffee-cup biscotti photos and the butter biscuit photos.
  Those seven images (`stock_cantucci_328_5..8`, `stock_buttermilk_biscuits_465_2..4`) were swapped by hand
  afterwards, so rerunning `apply_unique.py` would bring the old ones back. Swap them again from this file.

The finished images and credits are already in `public/images/` and `src/data/photoCredits.json`; you only
need these files to change individual picks. `apply_unique.py` also needs the candidate thumbnails:
`python3 fetch_thumbs.py picks/ <thumbs_dir>` downloads them (Pixabay's thumbnail links can expire; if a
download fails, rerun the search with `pixabay.py`/`pixabay_extra.py`).
