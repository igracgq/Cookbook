# Illustrative photos for recipes without a photo

Work in progress. The family cookbook only has photos for ~50 recipes; the rest show a "No photo yet" tile.

- `queries.py` / `groups.py`: turn the 1,135 photo-less recipe titles into ~375 shared dish searches
  (e.g. every lasagna variant -> "lasagna"). Non-dishes (icings, marinades, diet plans, cocktails with
  invented names) are skipped on purpose.
- `fetch.py`: first attempt, searching Wikimedia Commons. The shared sandbox IP is rate limited to roughly
  one search a minute, which is too slow for ~375 searches.

Plan: search a stock-photo API with a personal key (e.g. Pixabay), review matches by eye, save chosen photos
as `public/images/stock_<name>.jpg`, list each in `src/data/photoCredits.json`, and append the file name
(without extension) to the recipe's `photos` in `src/data/recipes.json`. The app already shows an
"Illustrative photo" note under any photo whose file name starts with `stock_`, and a Photo Credits tab.

## Status

- `pixabay.py` searched all ~375 dish groups (8 candidates each, cached to a JSON file outside the repo).
- Candidates were reviewed by eye on contact sheets; one photo was chosen for each of 250 groups, covering
  774 of the 1,135 photo-less recipes. `apply.py cache.json thumbs_dir picks.txt` copies the chosen 640px
  Pixabay images to `public/images/stock_<group>.jpg` and updates `photoCredits.json` and `recipes.json`.
- Left without a photo on purpose: groups with no good match (mostly dialect names like turdilli/chinulille,
  empty searches like manicotti/cannelloni), non-dishes, and invented cocktail names.

### Second pass: the rest

The remaining 361 recipes (dialect names, icings/creams/sauces, diets, cocktails, etc.) were each given a
hand-written, best-guess search in `extra_queries.json` (recipe id -> query), based on the title or, when the
title says nothing, the main ingredients (e.g. "Prostitute Pie" -> chocolate pudding dessert, "Turdilli" -> honey
balls). `pixabay_extra.py` searches them and `apply_extra.py` applies the reviewed picks. Every recipe now has a
photo; the ones from this pass are looser matches than the first pass, so treat them as mood images.

### Trimming for the artifact

Artifacts hold at most 511 files per version, so `merge_photos.py` collapses photos that are the same Pixabay
image and maps near-identical dishes (e.g. all the amaretti variants) onto one file: 494 -> 392 stock photos.
Every recipe still has a photo. Run it after `apply.py` / `apply_extra.py` if you add more.
