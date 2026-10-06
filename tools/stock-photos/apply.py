"""Apply reviewed picks: copy chosen Pixabay photos to public/images, update photoCredits.json and recipes.json.

Usage: python3 apply.py cache.json thumbs_dir picks.txt
picks.txt holds space-separated "<group index>:<candidate index>" pairs (index = position in cache.json).
"""
import json, re, shutil, sys, collections
from groups import no, group_for

cache, thumbs, picks_file = sys.argv[1:4]
C = json.load(open(cache)); keys = list(C)
picks = dict(tuple(map(int, p.split(':'))) for p in open(picks_file).read().split())
RP, CP, IMG = '../../src/data/recipes.json', '../../src/data/photoCredits.json', '../../public/images/'
recipes = json.load(open(RP)); credits = json.load(open(CP))
by_id = {r['id']: r for r in recipes}
groups = collections.defaultdict(list)
for r in no: groups[group_for(r)].append(r['id'])
covered = 0
for gi, ci in sorted(picks.items()):
    q = keys[gi]; h = C[q][ci]
    name = 'stock_' + re.sub(r'[^a-z0-9]+', '_', q.lower()).strip('_')
    shutil.copyfile(f'{thumbs}/{h["id"]}.jpg', f'{IMG}{name}.jpg')
    credits[name] = {'title': q.capitalize() + ' (Pixabay)', 'artist': h['user'], 'license': 'Pixabay Content License', 'url': h['page']}
    for rid in groups.get(q, []):
        if name not in by_id[rid]['photos']: by_id[rid]['photos'].append(name); covered += 1
json.dump(recipes, open(RP, 'w'), ensure_ascii=False, indent=1)
json.dump(credits, open(CP, 'w'), ensure_ascii=False, indent=2, sort_keys=True); open(CP, 'a').write('\n')
print(len(picks), 'photos;', covered, 'recipes covered of', len(no))
