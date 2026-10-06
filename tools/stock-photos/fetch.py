import json, os, re, sys, time, urllib.parse, urllib.request, collections
from groups import no, group_for
UA = "HeritageCookbookImageLookup/1.0 (https://github.com/igracgq/Cookbook)"
API = "https://commons.wikimedia.org/w/api.php"
CACHE = 'cands.json'
cands = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
cnt = collections.Counter(group_for(x) for x in no); cnt.pop(None, None)
queries = [q for q, _ in cnt.most_common()]
BAD = re.compile(r'menu|logo|diagram|\bmap\b|sign\b|poster|cover|\.pdf|stamp|painting|drawing|vector|illustration|icon|flag|label|advert|packag|machine|factory|market|stall|restaurant|shop|store|tomb|statue|museum', re.I)
OKLIC = re.compile(r'^(cc0|public domain|pd|cc[- ]by|cc[- ]by[- ]sa|attribution)', re.I)
def get(url, tries=8):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r: return r.read()
        except Exception as e:
            code = getattr(e, 'code', 0)
            ra = 0
            try: ra = int(e.headers.get('retry-after', 0))
            except Exception: pass
            time.sleep((ra + 2) if code in (429, 503) else 5)
    return None
def search(q):
    p = {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': f'{q} filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': 14,
         'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': 360, 'iiextmetadatafilter': 'LicenseShortName|Artist|ImageDescription|Credit|Categories'}
    raw = get(API + '?' + urllib.parse.urlencode(p))
    if not raw: return None
    d = json.loads(raw)
    out = []
    for pg in (d.get('query', {}).get('pages', {}) or {}).values():
        ii = (pg.get('imageinfo') or [None])[0]
        if not ii or ii.get('mime') not in ('image/jpeg', 'image/png'): continue
        if ii['width'] < 600 or ii['height'] < 450: continue
        md = ii.get('extmetadata', {})
        lic = md.get('LicenseShortName', {}).get('value', '')
        if not OKLIC.match(lic): continue
        title = pg['title']
        if BAD.search(title): continue
        strip = lambda s: re.sub(r'<[^>]+>', '', s or '').strip()
        toks = [t for t in re.split(r'\W+', q.lower()) if len(t) > 2]
        text = (title + ' ' + strip(md.get('ImageDescription', {}).get('value'))).lower()
        score = sum(t in text for t in toks) * 2 + sum(t in title.lower() for t in toks) * 2 + (1 if 'food' in strip(md.get('Categories', {}).get('value')).lower() else 0) - pg.get('index', 0) * 0.05
        out.append({'title': title, 'thumb': ii['thumburl'], 'w': ii['width'], 'h': ii['height'], 'license': lic, 'artist': strip(md.get('Artist', {}).get('value'))[:120],
                    'page': ii.get('descriptionurl'), 'score': score})
    out.sort(key=lambda c: -c['score'])
    return out[:4]
n = 0
for q in queries:
    if q in cands: continue
    res = search(q)
    if res is None: print('FAILED', q); continue
    cands[q] = res; n += 1
    json.dump(cands, open(CACHE, 'w'), ensure_ascii=False); print(len(cands), '/', len(queries), q, len(res), flush=True)
    time.sleep(8)
json.dump(cands, open(CACHE, 'w'), ensure_ascii=False)
print('DONE', len(cands))
