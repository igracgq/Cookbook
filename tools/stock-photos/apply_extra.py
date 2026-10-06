"""Apply reviewed picks for the hand-written queries in extra_queries.json (recipe id -> query).

Usage: python3 apply_extra.py cache.json thumbs_dir picks.txt
Like apply.py, but recipes are matched by id instead of by title group, and a file name that
already exists gets an "_x" suffix so earlier photos are never overwritten.
"""
import json, os, re, shutil, sys

cache, thumbs, picks_file = sys.argv[1:4]
C = json.load(open(cache)); keys = list(C)
picks = dict(tuple(map(int, p.split(':'))) for p in open(picks_file).read().split())
RP, CP, IMG = '../../src/data/recipes.json', '../../src/data/photoCredits.json', '../../public/images/'
recipes = json.load(open(RP)); credits = json.load(open(CP))
by_id = {r['id']: r for r in recipes}
EXTRA = json.load(open('extra_queries.json'))
names = {}
for gi, ci in sorted(picks.items()):
    q = keys[gi]; h = C[q][ci]
    name = 'stock_' + re.sub(r'[^a-z0-9]+', '_', q.lower()).strip('_')
    while os.path.exists(f'{IMG}{name}.jpg') and name not in credits or (name in credits and credits[name]['url'] != h['page']):
        name += '_x'
    shutil.copyfile(f'{thumbs}/{h["id"]}.jpg', f'{IMG}{name}.jpg')
    credits[name] = {'title': q.capitalize() + ' (Pixabay)', 'artist': h['user'], 'license': 'Pixabay Content License', 'url': h['page']}
    names[q] = name
covered = 0
for rid, q in EXTRA.items():
    r = by_id[rid]
    if q in names and not r['photos']:
        r['photos'].append(names[q]); covered += 1
json.dump(recipes, open(RP, 'w'), ensure_ascii=False, indent=1)
json.dump(credits, open(CP, 'w'), ensure_ascii=False, indent=2, sort_keys=True); open(CP, 'a').write('\n')
print(len(picks), 'photos;', covered, 'recipes covered;', sum(1 for r in recipes if not r['photos']), 'still without a photo')
