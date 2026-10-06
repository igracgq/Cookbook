"""Give every photo-less recipe its own Pixabay photo (no photo is used twice).

Usage: python3 apply_unique.py plan.json pools.json alt.json alt2.json picks.txt alt_picks.txt thumbs_dir
 plan.json   groups of recipe ids that share a dish search, with the first photo already chosen ("base")
 pools.json  group index -> extra candidates;  alt.json / alt2.json -> alternate-search candidates
 picks.txt / alt_picks.txt  "<group index>:<candidate>,<candidate>" lines (candidate = position in that list)
Existing stock_* images and credits are replaced.
"""
import json, os, re, glob, sys

plan, pools, alt, alt2, picks_f, alt_f, thumbs = sys.argv[1:8]
G = json.load(open(plan)); P = json.load(open(pools)); A = json.load(open(alt)); A2 = json.load(open(alt2))
def read(f):
    out = {}
    for l in open(f):
        if ':' in l:
            g, c = l.strip().split(':'); out.setdefault(int(g), []).extend(int(x) for x in c.split(','))
    return out
picks, altp = read(picks_f), read(alt_f)
RP, CP, IMG = '../../src/data/recipes.json', '../../src/data/photoCredits.json', '../../public/images/'
recipes = json.load(open(RP)); by_id = {r['id']: r for r in recipes}
for f in glob.glob(IMG + 'stock_*.jpg'): os.remove(f)
credits = {}
def add(h, gi, n, rid):
    name = f'stock_{re.sub(r"[^a-z0-9]+", "_", G[gi]["search"].lower()).strip("_")}_{gi}_{n}'
    with open(f'{thumbs}/{h["id"]}.jpg', 'rb') as s, open(f'{IMG}{name}.jpg', 'wb') as d: d.write(s.read())
    credits[name] = {'title': G[gi]['search'].capitalize() + ' (Pixabay)', 'artist': h['user'], 'license': 'Pixabay Content License', 'url': h['page']}
    by_id[rid]['photos'] = [p for p in by_id[rid]['photos'] if not p.startswith('stock_')] + [name]
missing = 0
for gi, g in enumerate(G):
    photos = ([g['base']] if g['base'] else [])
    photos += [P[str(gi)][c] for c in dict.fromkeys(picks.get(gi, []))]
    photos += [A[str(gi)][c] for c in dict.fromkeys(altp.get(gi, []))] if str(gi) in A else []
    if gi == 328: photos += [A2['328'][c] for c in (9, 10)]
    seen = set(); uniq = []
    for h in photos:
        if h['id'] not in seen: seen.add(h['id']); uniq.append(h)
    for n, rid in enumerate(g['ids']):
        if n < len(uniq): add(uniq[n], gi, n + 1, rid)
        else: missing += 1; print('no photo for', rid, g['search'])
json.dump(recipes, open(RP, 'w'), ensure_ascii=False, indent=1)
json.dump(credits, open(CP, 'w'), ensure_ascii=False, indent=2, sort_keys=True); open(CP, 'a').write('\n')
ids = [c['url'] for c in credits.values()]
print(len(credits), 'photos,', len(set(ids)), 'distinct;', missing, 'recipes unfilled;', sum(1 for r in recipes if not r['photos']), 'recipes without photo')
