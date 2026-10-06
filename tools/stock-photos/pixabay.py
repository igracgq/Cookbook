"""Search Pixabay for each dish query from groups.py and cache candidate photos.

Usage: PIXABAY_KEY=... python3 pixabay.py [cache.json]
Pixabay allows 100 requests / 60 s; we stay under that. Results are cached (Pixabay asks for >=24h caching).
"""
import json, os, re, sys, time, urllib.parse, urllib.request, collections
from groups import no, group_for

UA = 'HeritageCookbookImageLookup/1.0 (https://github.com/igracgq/Cookbook)'
KEY = os.environ['PIXABAY_KEY']
CACHE = sys.argv[1] if len(sys.argv) > 1 else 'pixabay_cands.json'
cands = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
cnt = collections.Counter(group_for(x) for x in no); cnt.pop(None, None)
queries = [q for q, _ in cnt.most_common()]

def search(q):
    p = {'key': KEY, 'q': q[:100], 'image_type': 'photo', 'category': 'food', 'safesearch': 'true',
         'min_width': 640, 'per_page': 8, 'order': 'popular'}
    for i in range(4):
        try:
            req = urllib.request.Request('https://pixabay.com/api/?' + urllib.parse.urlencode(p), headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                d = json.load(r)
            return [{'id': h['id'], 'tags': h['tags'], 'page': h['pageURL'], 'user': h['user'], 'thumb': h['webformatURL'],
                     'w': h['imageWidth'], 'h': h['imageHeight']} for h in d['hits']]
        except Exception as e:
            time.sleep(20 if getattr(e, 'code', 0) == 429 else 3)
    return None

if __name__ == '__main__':
    for q in queries:
        if q in cands: continue
        res = search(q)
        if res is None: print('FAILED', q); continue
        cands[q] = res
        json.dump(cands, open(CACHE, 'w'), ensure_ascii=False)
        print(len(cands), '/', len(queries), q, len(res), flush=True)
        time.sleep(0.8)
