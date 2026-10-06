"""Search Pixabay for the hand-written queries in extra_queries.json (recipe id -> query).

Usage: PIXABAY_KEY=... python3 pixabay_extra.py [cache.json]
Same caching/rate limiting as pixabay.py.
"""
import json, os, sys, time
from pixabay import search

CACHE = sys.argv[1] if len(sys.argv) > 1 else 'pixabay_extra_cands.json'
cands = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
queries = list(dict.fromkeys(json.load(open('extra_queries.json')).values()))
for q in queries:
    if q in cands: continue
    res = search(q)
    if res is None: print('FAILED', q); continue
    cands[q] = res
    json.dump(cands, open(CACHE, 'w'), ensure_ascii=False)
    print(len(cands), '/', len(queries), q, len(res), flush=True)
    time.sleep(0.8)
