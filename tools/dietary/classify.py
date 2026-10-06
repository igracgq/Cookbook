"""Tag every recipe with dietary flags, judged from its title and ingredient list.

Writes a `diet` list into src/data/recipes.json using these flags:
  gluten-free, vegan, vegetarian, spicy, poultry, seafood, red-meat

A flag is only given when the ingredients support it. Recipes whose ingredient list is
missing or too short to judge (techniques, glazes, notes) get no positive flags
(gluten-free / vegan / vegetarian); the "contains" flags (spicy, poultry, seafood, red-meat)
are still set from whatever text is there.

Usage: python3 classify.py [--report]
"""
import json, re, sys, collections, os

HERE = os.path.dirname(os.path.abspath(__file__))
RP = os.path.join(HERE, '../../src/data/recipes.json')

def rx(words):
    return re.compile(r'\b(?:' + '|'.join(words) + r')\b', re.I)

# ---------- gluten ----------
GF_FLOURS = r'(?:almond|coconut|rice|chickpea|garbanzo|corn|potato|tapioca|cassava|buckwheat|sorghum|millet|arrowroot|soy|bean|lentil|quinoa|amaranth|teff|cashew|peanut|hazelnut|oat)\s+(?:flour|meal)'
GLUTEN_WORDS = rx([
    'flour', 'pasta', 'spaghetti', 'spaghettini', 'penne', 'rigatoni', 'ziti', 'linguine', 'linguini', 'fettuccine', 'fettuccini',
    'tagliatelle', 'pappardelle', 'lasagna', 'lasagne', 'cannelloni', 'canneloni', 'manicotti', 'macaroni', 'ditalini', 'ditaloni', 'orzo',
    'fusilli', 'rotini', 'farfalle', 'bucatini', 'vermicelli', 'capellini', 'angel hair', 'noodles?', 'tortellini', 'ravioli', 'gnocchi',
    'cavatelli', 'orecchiette', 'rotelle', 'tubetti', 'stelline', 'pastina', 'conchiglie', 'shells', 'couscous', 'farro', 'barley', 'bulgur',
    'semolina', 'wheat', 'rye', 'spelt', 'kamut', 'seitan', 'malt', 'beer', 'ale', 'stout',
    'bread', 'breads', 'breadcrumbs?', 'bread crumbs?', 'crumbs?', 'panko', 'croutons?', 'crackers?', 'pretzels?', 'baguette', 'ciabatta', 'focaccia',
    'rolls?', 'buns?', 'bagels?', 'pita', 'tortillas?', 'wraps?', 'pizza dough', 'dough', 'pie crust', 'pie shell', 'crust', 'puff pastry', 'phyllo', 'filo', 'pastry',
    'biscuits?', 'cookies?', 'biscotti', 'graham', 'wafers?', 'ladyfingers?', 'savoiardi', 'lady ?fingers?', 'panettone', 'pandoro', 'cake mix', 'cake', 'muffin', 'matzo', 'matzah',
    'cereal', 'rice krispies', 'granola', 'oats?', 'oatmeal', 'rolled oats', 'soy sauce', 'soya sauce', 'teriyaki', 'hoisin', 'worcestershire',
    'cream of mushroom', 'cream of chicken', 'condensed .{0,12}soup', 'bouillon', 'pierogi', 'perogies', 'dumplings?', 'noodle',
    'crescent rolls?', 'pillsbury', 'stuffing', 'batter', 'egg roll wrappers?', 'wonton', 'gyoza', 'tempura',
])
# worcestershire is gluten-free in most US brands; do not count it
GLUTEN_WORDS_SKIP = {'worcestershire'}

# ---------- animal products (for vegan) ----------
RED_MEAT = rx([
    'beef', 'steaks?', 'sirloin', 'brisket', 'chuck', 'tri tip', 'tenderloin', 'filet mignon', 'ribeye', 'rib eye', 'oxtail', 'short ribs?', 'spare ribs?', 'ribs',
    'veal', 'vitello', 'osso buco', 'pork', 'ham', 'hams', 'ham hocks?', 'hocks?', 'trotters?', 'pigs? feet', 'pigs? ears?', 'pig', 'bacon', 'pancetta', 'guanciale',
    'prosciutto', 'speck', 'capicollo', 'capocollo', 'coppa', 'soppressata', 'sopressata', 'salami', 'pepperoni', 'mortadella', 'bologna', 'sausages?', 'kielbasa', 'kolbasa',
    'chorizo', 'hot dogs?', 'frankfurters?', 'wieners?', 'bratwurst', 'cotechino', 'lard', 'pork rinds?', 'cracklings?', 'hamburger', 'burger', 'meatballs?', 'meatloaf', 'meat loaf',
    'lamb', 'mutton', 'goat', 'kid', 'venison', 'deer', 'bison', 'buffalo', 'liver', 'tripe', 'trippa', 'kidneys?', 'tongue', 'sweetbreads?', 'suet', 'tallow', 'bone marrow',
    'prime rib', 'rib roast', 'roast beef', 'corned beef', 'pastrami', 'jerky', 'spam', 'salt pork', 'fatback', 'mettwurst', 'blood sausage', 'sanguinaccio', 'nduja', "'nduja", 'ground meat', 'minced meat', 'mixed meat',
])
OTHER_FLESH = rx(['rabbit', 'snails?', 'escargots?', 'frogs?', 'frog legs', 'pigeon', 'game', 'gelatin', 'gelatine', 'suet', 'rennet'])
POULTRY = rx([
    'chicken', 'chickens', 'hens?', 'cornish hens?', 'turkey', 'turkeys', 'duck', 'ducks', 'goose', 'geese', 'capon', 'quail', 'pheasant', 'squab', 'poultry', 'gizzards?', 'drumsticks?', 'giblets?', 'foie gras',
])
SEAFOOD = rx([
    'shrimps?', 'prawns?', 'scampi', 'crab', 'crabs', 'crabmeat', 'crab meat', 'lobster', 'lobsters', 'crayfish', 'crawfish', 'clams?', 'mussels?', 'oysters?', 'scallops?', 'calamari', 'squid', 'octopus',
    'cuttlefish', 'seppia', 'anchov(?:y|ies)', 'tuna', 'salmon', 'cod', 'baccal[aà]', 'stoccafisso', 'salt cod', 'trout', 'sole', 'haddock', 'halibut', 'tilapia', 'swordfish', 'sardines?', 'mackerel', 'herring',
    'smelts?', 'snapper', 'sea bass', 'bass', 'flounder', 'perch', 'eel', 'eels', 'caviar', 'roe', 'fish', 'seafood', 'lox', 'whitefish', 'pike', 'carp', 'monkfish', 'orata', 'branzino', 'sea urchin', 'whitebait', 'surimi',
    'imitation crab', 'fish sauce', 'dried cod',
])
# animal products that are neither meat nor seafood
OTHER_ANIMAL = rx([
    'eggs?', 'egg whites?', 'egg yolks?', 'mayonnaise', 'mayo', 'milk', 'buttermilk', 'butter', 'ghee', 'cream', 'half and half', 'half & half', 'whipping cream', 'sour cream', 'cream cheese', 'yogurt', 'yoghurt', 'yogourt',
    'cheese', 'cheeses', 'ricotta', 'mozzarella', 'bocconcini', 'burrata', 'parmesan', 'parmigiano', 'parmigiano reggiano', 'pecorino', 'romano', 'asiago', 'provolone', 'fontina', 'gorgonzola', 'feta', 'mascarpone',
    'cheddar', 'swiss', 'gruyere', 'gruyère', 'brie', 'camembert', 'goat cheese', 'cottage cheese', 'scamorza', 'caciocavallo', 'cacio', 'manchego', 'havarti', 'colby', 'monterey jack', 'pepper jack', 'jack',
    'whey', 'casein', 'custard', 'gelatin', 'gelatine', 'honey', 'marshmallows?', 'cool whip', 'condensed milk', 'evaporated milk', 'eagle brand', 'ice cream', 'meringue', 'meringue powder', 'bouillon', 'broth', 'stock',
    'lard', 'dulce de leche', 'pudding', 'alfredo', 'hollandaise', 'bechamel', 'balsamella', 'caesar', 'worcestershire', 'sambuca cream', 'baileys', 'milk chocolate', 'white chocolate', 'butterscotch', 'caramel',
    'eggnog', 'creme fraiche', 'crème fraîche', 'tzatziki', 'kefir', 'paneer', 'queso', 'oleo',
])
VEGAN_OK_PHRASES = re.compile(r'\b(?:vegetable|veggie|mushroom|vegan|plant|soy|almond|oat|rice|coconut|cashew|hemp|nut)\s+(?:broth|stock|bouillon|milk|cream|butter|cheese|yogurt|yoghurt|mayonnaise|mayo|whipped)|\b(?:peanut|almond|cashew|nut|apple|cocoa|shea|sunflower seed|seed)\s+butter|cream of tartar|butter\s*(?:beans?|lettuce|nut squash|squash|nuts?)|butternut|cocoa butter|coconut cream|eggplants?|egg plants?|cream sherry|bristol cream|salad cream|brown sugar|honey crisp|honeycrisp|pepper(?:s)? jack|jackfruit|swiss chard|chard|rice milk|egg[- ]free', re.I)
# if the ingredient only names a neutral stock like "chicken broth" it is caught by POULTRY already
SPICE = rx([
    'chil[ie]s?', 'chilli', 'chillies', 'chile', 'chili peppers?', 'chili flakes', 'chili powder', 'chili paste', 'chili oil', 'hot sauce', 'hot pepper sauce', 'tabasco', 'sriracha', 'cayenne', 'cayenne pepper',
    'jalape[nñ]os?', 'serranos?', 'habaneros?', 'scotch bonnets?', 'thai chil[ie]s?', 'bird.?s eye', 'peperoncino', 'peperoncini', 'calabrian chil[ie]s?', 'diavolo', 'diavola', 'arrabbiata', 'arrabiata',
    'red pepper flakes', 'crushed red pepper', 'crushed pepper', 'pepper flakes', 'hot peppers?', 'hot red peppers?', 'hot green peppers?', 'hot cherry peppers?', 'hot italian', 'hot sausage', 'hot capicollo',
    'hot soppressata', 'spicy', 'hot paprika', 'harissa', 'sambal', 'chipotles?', 'wasabi', 'curry paste', 'red curry', 'green curry', 'taco seasoning', 'cajun', 'creole seasoning', 'jerk',
    'gochujang', 'hot mustard', 'mild or hot', 'hot or mild', 'pickled hot', 'ground chilies', 'dried chil[ie]s?', 'fresno', 'cajun seasoning', 'paprika hot', 'peppercorns? hot',
])
SPICE_NEG = re.compile(r'\b(?:not spicy|no chil[ie]|chili sauce\s*\(mild\)|bell|sweet)\b', re.I)

BAKED_CATS = {'BREADS_AND_PIZZA', 'COOKIES_AND_BISCOTTI', 'CAKES_AND_DESSERTS', 'TARTS_AND_PIES', 'HOLIDAY_TRADITIONS'}
SAFE_TITLE = r'icing|frosting|glaze|cream|filling|curd|custard|pudding|mousse|meringue|macaroon|truffle|candy|clusters?|bark|fudge|souffle|panna cotta|brittle|sauce|syrup|whipped|sugar|wash|rocky road|balls?|torrone|zabaglione|ice cream|compote|jam|jelly|spread|marshmallow|dip|butter\b|topping|marinad|tea|coffee|punch|puree|pumpkin filling'

def is_prose(t):
    # a blurb pasted into the ingredient list, not an ingredient: long and not starting with a quantity
    return len(t.split()) >= 14 and not re.match(r'^\s*[\d½¼¾⅓⅔⅛]', t)

def ing_texts(r):
    out = []
    for i in r['ingredients']:
        raw = i['rawText'] or ''
        if is_prose(raw) or re.search(r'\b(?:is|are)\s+(?:traditionally\s+|usually\s+|typically\s+)?made\s+(?:with|from)\b', raw, re.I): continue
        out.append(re.sub(r'\s+', ' ', raw + ' ' + (i.get('normalizedName') or '')))
    return out

# notes and techniques that are not really recipes: never given positive (gluten-free/vegan/vegetarian) flags
NOT_A_RECIPE = {'all about cakes', 'optional ingredients', 'air frying', 'refrigerator cookies', 'air fryer donut pictures',
                'active dry yeast proofing', 'active dry yeast proof', 'artichoke hearts dip', 'lentil soup', 'artichokes roman style',
                'fried zucchini with eggs', 'tomato quick cook sauce', 'roasted chestnuts', 'baked dried black (moroccan) olives',
                'egg drop stracciatella soup', 'baked trout in foil', 'meatloaf and mashed potatoe cake'}

def strip_ok(t):
    return VEGAN_OK_PHRASES.sub(' ', t)

# Words that are safe to trust in the method text (no look-alike meanings).
S_RED = rx(['beef', 'veal', 'pork', 'bacon', 'pancetta', 'prosciutto', 'sausages?', 'salami', 'pepperoni', 'lamb', 'meatballs?', 'ground meat', 'ribs', 'steaks?', 'ham', 'hamburger', 'capicollo', 'lard'])
S_POULTRY = rx(['chicken', 'turkey', 'duck', 'hens?'])
S_SEAFOOD = rx(['shrimps?', 'prawns?', 'crab', 'lobster', 'clams?', 'mussels?', 'oysters?', 'scallops?', 'calamari', 'squid', 'tuna', 'salmon', 'anchov(?:y|ies)', 'baccal[aà]', 'fish', 'seafood'])
S_GLUTEN = rx(['flour', 'dough', 'yeast', 'breadcrumbs?', 'bread crumbs?', 'noodles?', 'pasta', 'spaghetti', 'penne', 'macaroni', 'lasagna', 'pastry', 'crust', 'batter', 'croutons?', 'soy sauce', 'perogies', 'pierogi', 'pyrohy', 'pelmeni', 'vareniki', 'dumplings?'])
S_ANIMAL = rx(['eggs?', 'egg whites?', 'egg yolks?', 'butter', 'milk', 'cheese', 'parmesan', 'ricotta', 'mozzarella', 'pecorino', 'cream', 'yogurt', 'yoghurt', 'honey', 'mayonnaise', 'gelatin'])
S_SPICE = rx(['chil[ie]s?', 'chilli', 'pepper flakes', 'crushed red pepper', 'cayenne', 'jalape[nñ]os?', 'hot peppers?', 'peperoncino', 'hot sauce', 'tabasco', 'sriracha'])

def clean_instr(t):
    t = re.sub(r'veal scallop(?:s|ini|ine)?|scallopini|scallopine|tuna can', ' ', t)
    t = re.sub(r'cream of tartar|butter(?:nut)?\s*(?:squash|beans?)|eggplants?|egg plants?|coconut milk|almond milk|peanut butter|cocoa butter', ' ', t)
    t = re.sub(r'\b(?:no|without|omit|skip)\s+(?:the\s+)?(?:meat|eggs?|cheese|butter|milk|flour|chil[ie]s?)\b', ' ', t)
    return t

def classify(r):
    title = r['title']
    ings = ing_texts(r)
    n_real = len([t for t in ings if len(t.strip()) > 2])
    judge = n_real >= 2 and title.strip().lower() not in NOT_A_RECIPE
    low = (title + ' | ' + ' | '.join(ings)).lower()
    instr = clean_instr(re.sub(r'\s+', ' ', ' | '.join(r.get('instructions') or []).lower()))
    flags = set()

    # --- contains flags (ingredient list + title, plus unambiguous words in the method) ---
    poultry_hit = bool(POULTRY.search(low) or S_POULTRY.search(instr))
    sea_txt = re.sub(r'veal scallop(?:s|ini|ine)?|scallopini|scallopine|scalloped|tuna can|chicken of the sea|sole mio|bass guitar|cod liver|fishing|goldfish|swedish fish|fish shaped|jelly fish|seafood allergy', ' ', low)
    seafood_hit = bool(SEAFOOD.search(sea_txt) or S_SEAFOOD.search(instr))
    meat_text = re.sub(r'\b(?:turkey|chicken)\s+(?:sausages?|bacon|ham|hot dogs?|burgers?|meatballs?|meatloaf|pepperoni|salami)\b', ' ', low)
    meat_text = re.sub(r'\b(?:hot dog|hamburger|burger|sausage|ham|meatball|bacon)\s*(?:buns?|rolls?|bread)\b', ' ', meat_text)
    meat_text = re.sub(r'\b(?:kid|deer|buffalo|tongue|bologna|jack)\b', ' ', meat_text)
    meat_text = re.sub(r'\bgoat\s+(?:feta|cheese|milk|yogurt|yoghurt|cheddar|curd|ricotta|butter)\b', ' ', meat_text)
    meat_text = re.sub(r'(?:\d+\s*)?ribs?\s+(?:of\s+)?celery|celery\s+ribs?|ribs?\s+removed|ribs?\s+and\s+seeds|(?:\(\d+\)\s*)?ribs?\s+celery', ' ', meat_text)
    instr_m = re.sub(r'celery\s+ribs?|ribs?\s+of\s+celery|ribs?\s+removed', ' ', instr)
    if seafood_hit:   # "salmon steaks", "fish steaks"
        meat_text = re.sub(r'\bsteaks?\b', ' ', meat_text); instr_m = re.sub(r'\bsteaks?\b', ' ', instr_m)
    meat_hit = bool(RED_MEAT.search(meat_text) or S_RED.search(instr_m))
    for m in re.finditer(r'(\w+)?\s*\bmeats?\b', meat_text):
        prev = (m.group(1) or '').lower()
        if prev in ('crab', 'lobster', 'clam', 'chicken', 'turkey', 'coconut', 'nut', 'shrimp', 'fish', 'tuna', 'salmon', 'squash', 'fruit', 'plant', 'duck', 'rabbit', 'no', 'non', 'lump'):
            continue
        meat_hit = True
    if poultry_hit: flags.add('poultry')
    if seafood_hit: flags.add('seafood')
    if meat_hit: flags.add('red-meat')
    spice_txt = re.sub(r'chil[ie]\s+sauce|chili\s*\(mild\)', ' ', low)
    if SPICE.search(spice_txt) or S_SPICE.search(re.sub(r'chil[ie]\s+sauce', ' ', instr)):
        flags.add('spicy')

    if judge:
        # --- gluten ---
        g = re.sub(GF_FLOURS, ' ', low[len(title):])   # ingredient lines only; the title is judged separately below
        g = re.sub(r'\bgluten[- ]free\b', ' ', g)
        g = re.sub(r'\b(?:rice|corn|cellophane|glass|bean thread|soba|shirataki|konjac)\s+(?:noodles?|pasta|vermicelli|wraps?|tortillas?)\b', ' ', g)
        g = re.sub(r'\bcorn\s*(?:tortillas?|chips?)\b|\bpolenta\b|\bcornmeal\b|\bcorn meal\b', ' ', g)
        g = re.sub(r'\b(?:pasta|spaghetti|rice|bread|noodle)\s*(?:sauce)\b|\bpepper\s+flakes?\b|\bpie\s+filling\b|\bcake\s+(?:stand|pan|tin)\b', ' ', g)
        gf_flour_early = re.search(r'almond (?:flour|meal)|ground almonds|flourless|rice flour|corn ?(?:meal|flour)|coconut flour|gluten[- ]free|potato (?:flour|starch)|chickpea flour', low)
        if gf_flour_early:
            # almond-flour "bread", "bagels", "dough" etc: the generic words don't mean wheat here
            g = re.sub(r'\b(?:dough|breads?|bagels?|rolls?|buns?|cake|muffins?|crust|pastry|tortillas?|wraps?|pizza|toast)\b', ' ', g)
        has_gluten = any(m.group(0).lower() not in GLUTEN_WORDS_SKIP for m in GLUTEN_WORDS.finditer(g))
        gi = re.sub(GF_FLOURS, ' ', instr)
        if gf_flour_early and not re.search(r'\bflour\b', g) and not re.search(r'\d[^|.]{0,14}\bflour\b', gi):
            gi = re.sub(r'\bflour\b|\bdough\b|\bbatter\b|\bcrust\b', ' ', gi)
        gi = re.sub(r'\b(?:rice|corn)\s+(?:noodles?|pasta)\b|\bcornmeal\b|\bcorn meal\b', ' ', gi)
        if not has_gluten and S_GLUTEN.search(gi):
            has_gluten = True
        gf_flour_early = re.search(r'almond (?:flour|meal)|ground almonds|flourless|rice flour|corn ?(?:meal|flour)|coconut flour|gluten[- ]free|potato (?:flour|starch)|chickpea flour', low)
        if not has_gluten and not gf_flour_early and re.search(r'\b(?:pasta|spaghetti|lasagna|cookies?|biscotti|cake|bread|pizza|pizzelle|panettone|crostata|gnocchi|ravioli|tortellini|manicotti|cannelloni|crepes?|pierogi|dumplings?|scones?|muffins?|tart|tarts|brownies|focaccia|calzone|doughnuts?|donuts?|struffoli|zeppole|cannoli|biscuits?|pastiera|povotica|brioche|briosche|torte|strudel|rolls?|buns?|pie)\b', title.lower()) \
           and not re.search(r'gluten[- ]free|flourless|cheesecake|pie filling|icing|frosting|glaze|sauce\b|pudding|meringue|soup|pot pie', title.lower()):
            has_gluten = True
        if not has_gluten and r['category'] in BAKED_CATS:
            safe_title = re.search(SAFE_TITLE, title.lower())
            gf_flour = re.search(r'almond (?:flour|meal)|ground almonds|flourless|rice flour|corn ?(?:meal|flour)|coconut flour|gluten[- ]free|potato (?:flour|starch)', low)
            if not (safe_title or gf_flour):
                has_gluten = True   # a dough, cake or pastry whose ingredient list is incomplete: assume gluten
        if not has_gluten:
            flags.add('gluten-free')

        # --- animal products ---
        other_flesh = bool(OTHER_FLESH.search(low)) or bool(re.search(r'\b(?:rabbit|snails?|escargot)\b', instr))
        if not (poultry_hit or seafood_hit or meat_hit or other_flesh):
            flags.add('vegetarian')
            v = strip_ok(low)
            v = re.sub(r'\bcoconut milk\b|\bcoconut cream\b|\balmond milk\b|\boat milk\b|\bsoy milk\b|\bsoya milk\b|\brice milk\b|\bcocoa butter\b|\bnut butter\b|\bpeanut butter\b|\bapple butter\b|\bcream of tartar\b|\bvegan\s+\w+', ' ', v)
            animal = bool(S_ANIMAL.search(strip_ok(instr)))
            for m in OTHER_ANIMAL.finditer(v):
                if animal: break
                w = m.group(0).lower()
                ctx = v[max(0, m.start() - 20): m.end() + 12]
                if w in ('stock', 'broth', 'bouillon'):
                    if re.search(r'vegetable|veggie|mushroom|vegan', ctx): continue
                    animal = True
                elif w in ('swiss', 'jack'):
                    if re.search(r'cheese', ctx): animal = True
                elif w in ('caramel', 'butterscotch'):
                    if re.search(r'chips?|sauce|candy|candies|topping|syrup', ctx): animal = True
                elif w == 'pudding':
                    if re.search(r'instant|mix|vanilla|chocolate|cook', ctx): animal = True
                else:
                    animal = True
            if not animal: flags.add('vegan')
    return flags

def main():
    R = json.load(open(RP))
    stats = collections.Counter()
    for r in R:
        f = classify(r)
        r['diet'] = sorted(f)
        for x in f: stats[x] += 1
    json.dump(R, open(RP, 'w'), ensure_ascii=False, indent=1)
    print(len(R), 'recipes', dict(stats))
    judged = sum(1 for r in R if len([i for i in r['ingredients'] if len(i['rawText'].strip()) > 2]) >= 2)
    print('with enough ingredients to judge:', judged)

if __name__ == '__main__':
    main()
