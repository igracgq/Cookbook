import json, re, collections
R = json.load(open(__import__('os').environ.get('RECIPES_JSON', '/home/user/Cookbook/src/data/recipes.json')))
no = [x for x in R if not x['photos']]

NAMES = set('nordica rita rosina delfina concetta assunta julie emma lina teresa mary mikes michael chiarello franca filice natasa dimitra margaret gina ida aunt lena uncle jimmy lundy adrienne antoniette bruna gabriella consiglio sally zia maria nonna vito lulu monica mara georgina sandy puntillo kraft lipton cheez whiz becel crisco camouflage hunter tony tiger toll house tootoo imma raffalini gianna sasamielle kielbasa'.split()) - {'kielbasa'}
FILL = set('recipe recipes easy simple quick fast best classic delicious homemade traditional fantastic unbelievable special supreme ii iii low lite perfect basic miracle wonderful outrageous scrumptious luscious decadence super old fashioned rich fancy hearty tangy funky pull part rolled'.split())
SKIP = re.compile(r"""^(optional ingredients|active dry yeast.*|sweet and sour sauce|cheese sauce|beef gravy|egg wash|cinnamon sugar|icing sugar|royal icing.*|easy cookie icing|.*frosting.*|.*icing$|.*glaze$|.*marinades?.*|.*marinade$|steak marinade|salt for salami|suzo|pork skins.*|cooked rice|short grain arborio|first risotto.*|all about cakes|.*diet$|keto.*|low carb.*|serbian garlic sauce|lamb barbecue sauce|c\.n\.|jarana|pool baby|big bamboo|american beauty|brown cow|coconut case|stinger|egg salad sandwich|cooking perogies|using pre cooked polenta|leftover polenta|pre cooked.*polenta.*|how to cook chicken breasts|vanilla sauce|.*cream$|cream cheese filling|pumpkin filling|apple butter|lemon curd|devonshire mock cream|icing|sex in a pan monica|prostitute pie|candy hash|torroncini|tootoo|sasamielle|air frying|suzo|quinoa.*|misto sugo|garlic, mushroom, parsley roast|balkan corn meal mush|dumplings|balsamella.*|pancetta or turkey white sauce|fried minute rice|spiced whipped cream|roasted garlic|optional.*|serbian port and beef|jambalaya|crock pot tuscan soup|bacon chessburger casserole|overnight french toast casserole|lemon chiptotle bbq salmon|mug bread 90 second|chicken and jasmine rice|focaccia mug bread|loaded cauliflower bake|creamy cauliflower & bacon soup|cauliflower perogie casserole|baked trout in foil)$""", re.I)

def clean(t):
    t = t.replace('’', "'").replace('‘', "'")
    t = re.sub(r'\(.*?\)', ' ', t)
    t = re.sub(r'[\d#\.\*\)\(]+', ' ', t)
    toks = []
    for w in re.split(r'[\s/,&\-]+', t.lower()):
        w = w.strip("'")
        if not w or w.endswith("'s") or w in NAMES or w in FILL: continue
        toks.append(w)
    q = ' '.join(toks)
    return re.sub(r'\s+', ' ', q).strip()

OVR = json.load(open('overrides.json')) if __import__('os').path.exists('overrides.json') else {}
def query_for(x):
    t = x['title'].strip()
    if t.lower() in OVR: return OVR[t.lower()]
    if SKIP.match(t.lower()): return None
    q = clean(t)
    return q if len(q) >= 3 else None

if __name__ == '__main__':
    qm = collections.defaultdict(list)
    skipped = []
    for x in no:
        q = query_for(x)
        (qm[q] if q else skipped).append(x['title'] if not q else x['id'])
    print(len(no), 'recipes;', len(qm) - (1 if None in qm else 0), 'queries; skipped', len(skipped))
    print('SKIPPED:', ' | '.join(skipped))
    print('QUERIES:', ' | '.join(sorted(k for k in qm if k)))
