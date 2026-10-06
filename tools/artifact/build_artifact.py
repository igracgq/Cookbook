"""Package the app as a single artifact page plus photo bundles.

Usage (from the repo root):  python3 tools/artifact/build_artifact.py OUT_DIR [PREVIOUS_OUT_DIR]

Artifacts hold at most 511 files and one page, so the ~1,135 stock photos are packed into a few JSON
bundles of data: URIs (OUT_DIR/images/sNN.json) that a small loader script fetches on demand. The 99
cookbook photos stay as normal files. The result:

  OUT_DIR/index.html          the whole app (JS and CSS inlined) plus the loader
  OUT_DIR/images/cook_*.jpg   cookbook photos
  OUT_DIR/images/sNN.json     stock photo bundles

With PREVIOUS_OUT_DIR it also prints which files changed, so you only publish those.
Needs Node (npx vite), Pillow.
"""
import base64, glob, io, json, os, re, shutil, subprocess, sys
from PIL import Image

out = os.path.abspath(sys.argv[1])
prev = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else None
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.abspath(os.path.join(here, '../..'))
os.chdir(root)

subprocess.run(['npx', 'vite', 'build'], check=True, env={**os.environ, 'BASE_PATH': './'})
D = 'dist/'
os.makedirs(out + '/images', exist_ok=True)
for f in glob.glob(out + '/images/*'): os.remove(f)
for f in glob.glob(D + 'images/cook_*.jpg'): shutil.copy(f, out + '/images/')

names = sorted(os.path.basename(f)[:-4] for f in glob.glob(D + 'images/stock_*.jpg'))
manifest, bundle, n, size = {}, {}, 0, 0
def flush():
    global bundle, n, size
    if bundle:
        json.dump(bundle, open(f'{out}/images/s{n:02d}.json', 'w')); n += 1; bundle = {}; size = 0
for nm in names:
    im = Image.open(D + f'images/{nm}.jpg').convert('RGB'); im.thumbnail((480, 480))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=68, optimize=True)
    bundle[nm] = 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
    manifest[nm] = n; size += len(bundle[nm])
    if size > 1_400_000: flush()
flush()

html = open(D + 'index.html').read()
js = open(D + re.search(r'(assets/index-[^"]+\.js)', html).group(1)).read().replace('</script', '<\\/script')
css = open(D + re.search(r'(assets/index-[^"]+\.css)', html).group(1)).read()
fonts = re.search(r'<link href="https://fonts.googleapis.com[^>]*>', html).group(0)
loader = open(os.path.join(here, 'loader.template.js')).read().replace('@@MANIFEST@@', json.dumps(manifest))
page = ('<meta charset="utf-8">\n<title>Heritage Cookbook</title>\n'
        '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        + fonts + '\n<style>:root{color-scheme:light}body{background:#F4EEE5;color:#261D16;font-size:16px;min-height:100vh;-webkit-font-smoothing:antialiased}</style>\n'
        '<style>' + css + '</style>\n<div id="root"></div>\n' + loader + '\n<script type="module">' + js + '</script>\n')
open(out + '/index.html', 'w').write(page)
shutil.rmtree('dist')
print(f'{len(names)} stock photos in {n} bundles; page {len(page)/1e6:.1f} MB')

if prev:
    changed = []
    for dp, _, fs in os.walk(out):
        for f in fs:
            p = os.path.join(dp, f); q = p.replace(out, prev, 1)
            if not os.path.exists(q) or open(p, 'rb').read() != open(q, 'rb').read(): changed.append(os.path.relpath(p, out))
    gone = [os.path.relpath(os.path.join(dp, f), prev) for dp, _, fs in os.walk(prev) for f in fs if not os.path.exists(os.path.join(dp, f).replace(prev, out, 1))]
    print('publish (changed or new):', sorted(changed)); print('remove (no longer present):', sorted(gone))
