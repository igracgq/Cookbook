"""Reduce the number of distinct stock photos (artifacts hold at most 511 files per version).

1. Photos that are the same Pixabay image are collapsed into one file.
2. MERGE maps near-identical dishes onto one photo (old name -> kept name, without "stock_").
Recipes are re-pointed, then unused files and credits are removed. Safe to re-run.
"""
import json, os
MERGE = {
 'carrot_cake_x':'carrot_cake','pierogi_x':'pierogi','polenta_x':'polenta','cooked_chicken_breast':'chicken_breast',
 'cheesecake_slice':'cheesecake','no_bake_cheesecake':'cheesecake','cannelloni_baked':'stuffed_pasta_baked_cheese',
 'lasagna_white_sauce':'lasagna','eggplant_lasagna':'eggplant_dish','beetroot_carrot_salad':'beet_salad',
 'beetroot_sandwich':'beet_salad','chicken_marsala_mushrooms':'chicken_breast','chicken_parmigiana':'chicken_breast',
 'chicken_rice_mushrooms':'chicken_dish','chicken_stew_tomato':'chicken_dish','chicken_spinach':'chicken_breast',
 'chicken_broccoli_casserole':'broccoli_casserole','icing_cake':'coconut_frosting_cake',
 'mint_frosting_cupcake':'buttercream_frosting_cupcake','cookies_chocolate':'chocolate_cookies',
 'chocolate_cream_dessert':'chocolate_pudding_dessert_layers','chocolate_pudding':'chocolate_pudding_dessert_layers',
 'whipped_cream_dessert':'whipped_cream','lemon_cream_dessert':'lemon_curd','lemon_mousse':'lemon_curd',
 'honey_cookies':'honey_balls_struffoli','honey_cookies_cinnamon':'honey_balls_struffoli',
 'snowball_cookies_powdered_sugar':'wedding_cookies_powdered_sugar','meringue_cookies':'coconut_macaroons',
 'lemon_icing_cookie':'royal_icing_cookies','glazed_cookies':'royal_icing_cookies','cinnamon_cookies':'anise_cookies',
 'nut_cookies':'almond_cookies','marshmallow_squares':'marshmallow_cereal_bars','chocolate_layered_bars':'caramel_bars',
 'fried_pastry':'fried_dough_sweet','fried_dough_zeppole':'zeppole','bread_dough_rising':'dry_yeast',
 'focaccia_bread':'focaccia','brushing_egg_pastry':'poached_egg','penne_tomato_sauce':'penne_all_arrabbiata',
 'tomato_sauce':'tomato_sauce_spaghetti','spaghetti_black_pepper_cheese':'spaghetti_aglio_e_olio',
 'spaghetti_olives_capers':'bucatini_all_amatriciana','pasta_bacon':'spaghetti_carbonara',
 'cream_sauce_pasta_bacon':'fettuccine_alfredo','roast_beef_mushrooms':'roast_beef','steak_arugula':'grilled_steak',
 'veal_cutlet_lemon':'veal_cutlet','lamb_stew':'braised_lamb','raw_lamb_herbs':'lamb_chops','lamb_barbecue':'lamb_chops',
 'pork_broccoli_stir_fry':'chicken_stir_fry','beef_snow_peas_stir_fry':'chicken_stir_fry','pork_tenderloin_sliced':'roast_pork',
 'pork_beef_stew':'beef_stew','turkey_meat':'roast_turkey','crab_salad':'seafood_salad','shrimp_salad':'seafood_salad',
 'cauliflower_soup_cream':'cauliflower_soup','bean_pasta_soup':'bean_soup','chickpea_soup':'lentil_soup',
 'seafood_platter_lemon':'lobster_shrimp_seafood_platter','salt_cod':'cod_fish_tomato','green_beans_garlic':'green_beans',
 'green_beans_tomatoes':'green_beans','braided_bread_eggs':'easter_bread','stuffed_bell_peppers':'stuffed_peppers',
 'apple_dessert_baked':'apple_pie','pear_pudding':'panna_cotta','hot_apple_tea':'tea_water_drinks','brandy_snifter':'brandy_cocktail',
}
os.chdir(os.path.dirname(os.path.abspath(__file__)))
RP, CP, IMG = '../../src/data/recipes.json', '../../src/data/photoCredits.json', '../../public/images/'
recipes = json.load(open(RP)); credits = json.load(open(CP))
canon = {}
for name in sorted(credits):
    canon.setdefault(credits[name]['url'], name)
remap = {n: canon[c['url']] for n, c in credits.items()}
for old, new in MERGE.items():
    remap['stock_' + old] = remap['stock_' + new]
for r in recipes:
    seen = []
    for p in r['photos']:
        p = remap.get(p, p)
        if p not in seen: seen.append(p)
    r['photos'] = seen
used = {p for r in recipes for p in r['photos']}
for n in list(credits):
    if n not in used:
        del credits[n]
        if os.path.exists(f'{IMG}{n}.jpg'): os.remove(f'{IMG}{n}.jpg')
json.dump(recipes, open(RP, 'w'), ensure_ascii=False, indent=1)
json.dump(credits, open(CP, 'w'), ensure_ascii=False, indent=2, sort_keys=True); open(CP, 'a').write('\n')
print(len(credits), 'stock photos kept;', sum(1 for r in recipes if not r['photos']), 'recipes without a photo;', len(os.listdir(IMG)), 'image files')
