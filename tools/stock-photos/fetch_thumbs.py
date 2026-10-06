"""Download the candidate thumbnails listed in picks/*.json into a folder (named <pixabay id>.jpg).

Usage: python3 fetch_thumbs.py picks/ thumbs/
"""
import glob, json, os, sys, urllib.request, concurrent.futures as cf

src, dst = sys.argv[1:3]
os.makedirs(dst, exist_ok=True)
jobs = {}
def walk(o):
    if isinstance(o, dict):
        if 'thumb' in o and 'id' in o: jobs[o['id']] = o['thumb']
        else:
            for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
for f in glob.glob(os.path.join(src, '*.json')):
    d = json.load(open(f))
    for g in (d if isinstance(d, list) else [d]):
        walk(g)
def get(item):
    i, u = item; p = f'{dst}/{i}.jpg'
    if os.path.exists(p): return 1
    for _ in range(3):
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'HeritageCookbookImageLookup/1.0'})
            open(p, 'wb').write(urllib.request.urlopen(req, timeout=30).read()); return 1
        except Exception: pass
    return 0
with cf.ThreadPoolExecutor(2) as ex: r = list(ex.map(get, jobs.items()))
print(sum(r), 'of', len(r), 'thumbnails')
