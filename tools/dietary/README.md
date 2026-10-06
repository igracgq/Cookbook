# Dietary flags

`classify.py` reads every recipe's title, ingredient list and method and writes a `diet` list into
`src/data/recipes.json` (re-run it after editing recipes: `python3 tools/dietary/classify.py`).

Flags: `gluten-free`, `vegetarian`, `vegan`, `spicy`, `poultry`, `seafood`, `red-meat`.

- **gluten-free / vegetarian / vegan** are only given when the ingredients support it. A recipe with no
  usable ingredient list (a technique note, a blurb) gets none of them. Wheat flour, pasta, bread, crumbs,
  soy sauce, beer, pastry and the like rule out gluten-free; baked goods whose list is incomplete are
  assumed to contain gluten unless they use almond/rice/corn flour. Stock, broth and bouillon count as
  animal products unless they say vegetable or mushroom. Honey, gelatin and marshmallows are not vegan.
- **poultry / seafood / red-meat / spicy** are set when the title, ingredients or method name them
  (chicken broth counts as poultry, anchovy as seafood, chili flakes or cayenne as spicy). An "X or Y"
  ingredient counts if either could be used.
