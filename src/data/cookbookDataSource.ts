import { HelpfulHint, KitchenConversion, MatchResult, MeatRoastingGuide, Recipe, RecipeCategory } from '../types';
import { getSearchableKeywords } from '../utils/recipeCalculator';
import rawRecipes from './recipes.json';

const cookbookRecipes: Recipe[] = (rawRecipes as unknown as Recipe[]).sort((a, b) => a.title.localeCompare(b.title));

/**
 * Every recipe the app shows: the family cookbook plus recipes and photos that signed-in family members
 * have shared. The array is updated in place by setSharedContent(), so the lookup helpers below always see
 * the current list; the app re-renders through CookbookContext's contentVersion.
 */
export const allRecipes: Recipe[] = [...cookbookRecipes];

export function setSharedContent(shared: Recipe[], sharedPhotos: Record<string, { url: string; by: string }>) {
  const merged = cookbookRecipes.map(r => {
    const p = sharedPhotos[r.id];
    return p ? { ...r, imageUrl: p.url, imageBy: p.by } : r;
  });
  merged.push(...shared);
  merged.sort((a, b) => a.title.localeCompare(b.title));
  allRecipes.length = 0;
  allRecipes.push(...merged);
}

export const commonPantryIngredients: string[] = [
  "Garlic", "Olive Oil", "Eggs", "Tomatoes", "Onion",
  "Parmesan", "Ricotta", "Mozzarella", "Pasta", "Flour",
  "Butter", "Chicken", "Pork", "Ground Beef", "Bacon",
  "Spinach", "Potatoes", "Mushrooms", "Zucchini", "Eggplant",
  "Basil", "Oregano", "Parsley", "Lemon", "White Wine",
  "Rice", "Breadcrumbs", "Milk", "Heavy Cream", "Sugar",
  "Yeast", "Almonds", "Chickpeas", "Beans", "Peppers"
];

export const roastingGuides: MeatRoastingGuide[] = [
  { meatType: "Beef Roasts", weight: "4–6 lbs", hours: "2 to 2½ hrs (rare), 2½–3½ (med), 2¾–4 (well)", internalTemp: "140°F / 150°F / 170°F" },
  { meatType: "Veal Roasts", weight: "3–5 lbs", hours: "2 to 3½ hrs (well done)", internalTemp: "180°F" },
  { meatType: "Lamb Roast", weight: "3–5 lbs", hours: "2 to 3 hrs (medium), 2¼–4 (well done)", internalTemp: "145°F / 170°F" },
  { meatType: "Ham (cook before eating)", weight: "5–7 lbs", hours: "2½ to 3½ hrs", internalTemp: "170°F" },
  { meatType: "Chicken broilers/fryers", weight: "2½–4½ lbs", hours: "2 to 3½ hrs", internalTemp: "185°F" },
  { meatType: "Turkey Roasts", weight: "12–16 lbs", hours: "4½ to 5½ hrs", internalTemp: "185°F" },
  { meatType: "Turkey Roasts", weight: "16–20 lbs", hours: "5½ to 6½ hrs", internalTemp: "185°F" }
];

export const volumeConversions: KitchenConversion[] = [
  { imperial: "1/8 tsp", metric: "0.5 ml" },
  { imperial: "1/4 tsp", metric: "1 ml" },
  { imperial: "1/2 tsp", metric: "2.5 ml" },
  { imperial: "1 tsp", metric: "5 ml" },
  { imperial: "1 tbsp", metric: "15 ml" },
  { imperial: "1 fl oz", metric: "30 ml" },
  { imperial: "1/4 cup", metric: "60 ml" },
  { imperial: "1/3 cup", metric: "80 ml" },
  { imperial: "1/2 cup", metric: "125 ml" },
  { imperial: "1 cup", metric: "250 ml" }
];

export const temperatureConversions: KitchenConversion[] = [
  { imperial: "450°F", metric: "232°C" },
  { imperial: "425°F", metric: "218°C" },
  { imperial: "400°F", metric: "204°C" },
  { imperial: "375°F", metric: "191°C" },
  { imperial: "350°F", metric: "177°C" },
  { imperial: "325°F", metric: "163°C" },
  { imperial: "300°F", metric: "149°C" }
];

export const helpfulHints: HelpfulHint[] = [
  {
    title: "Oversalted Dish Fix",
    content: "Add cut raw potatoes into salty soup or sauce and discard once cooked; or add a teaspoon each of cider vinegar and sugar.",
    cookbookPage: 15
  },
  {
    title: "Prevent Sauce Sticking & Boiling Over",
    content: "When boiling pasta products, add a tablespoon of oil or butter to prevent sticking or foaming over.",
    cookbookPage: 16
  },
  {
    title: "Excess Grease Removal",
    content: "Drop a fresh lettuce leaf into hot homemade soup to absorb floating grease, or drop ice cubes in briefly—fat clings to cubes immediately!",
    cookbookPage: 15
  },
  {
    title: "Tempering Eggs for Hot Sauces",
    content: "Always stir a little bit of the hot broth or sauce into the beaten eggs first, then slowly whisk back into the pot so the eggs don't scramble.",
    cookbookPage: 17
  },
  {
    title: "Garlic in Italian Cooking",
    content: "Never burn or over-brown garlic. Browned garlic gives a sharp bitter taste. Light golden or aromatic translucence is the Italian standard.",
    cookbookPage: 96
  },
  {
    title: "Al Dente Pasta & Pasta Water",
    content: "Always salt the pasta cooking water generously, test for al dente firmness, and reserve 1/2 cup of starchy water to emulsify your sauce.",
    cookbookPage: 87
  }
];

export function findRecipeById(id: string): Recipe | undefined {
  return allRecipes.find(r => r.id === id);
}

export function searchRecipes(query: string, category?: RecipeCategory | null): Recipe[] {
  const cleanQuery = query.trim().toLowerCase();
  return allRecipes.filter(recipe => {
    const matchesCategory = !category || recipe.category === category;
    const matchesQuery = !cleanQuery || getSearchableKeywords(recipe).includes(cleanQuery);
    return matchesCategory && matchesQuery;
  });
}

export function getRecipesByLetter(): Record<string, Recipe[]> {
  const sorted = [...allRecipes].sort((a, b) => a.title.trim().localeCompare(b.title.trim(), undefined, { sensitivity: 'base' }));
  const map: Record<string, Recipe[]> = {};
  for (const r of sorted) {
    const letter = r.title.trim()[0].toUpperCase();
    if (!map[letter]) {
      map[letter] = [];
    }
    map[letter].push(r);
  }
  return map;
}

export function getRecipesByCategory(): Record<RecipeCategory, Recipe[]> {
  const map = {} as Record<RecipeCategory, Recipe[]>;
  for (const r of allRecipes) {
    if (!map[r.category]) {
      map[r.category] = [];
    }
    map[r.category].push(r);
  }
  return map;
}

export function getRecipesByContributor(): Record<string, Recipe[]> {
  const map: Record<string, Recipe[]> = {};
  for (const r of allRecipes) {
    const c = r.contributor || "Traditional Family Heritage";
    if (!map[c]) {
      map[c] = [];
    }
    map[c].push(r);
  }
  return map;
}

/** The pantry entries that cover an ingredient (e.g. "garlic" covers "garlic cloves"). */
export function pantryItemsCovering(ingredientName: string, pantryItems: string[]): string[] {
  const ing = ingredientName.trim().toLowerCase();
  if (!ing) return [];
  return pantryItems
    .map(i => i.trim().toLowerCase())
    .filter(p => p && (
      ing.includes(p) || p.includes(ing) ||
      (p.endsWith('s') && ing.includes(p.slice(0, -1))) ||
      (ing.endsWith('s') && p.includes(ing.slice(0, -1)))
    ));
}

const inPantry = (ing: string, normalizedPantry: string[]) => pantryItemsCovering(ing, normalizedPantry).length > 0;

/** What a recipe needs that the pantry does not cover: the ingredient name, and the line as written in the recipe. */
export function missingIngredientsFor(recipe: Recipe, pantryItems: string[]): Array<{ name: string; text: string }> {
  const normalizedPantry = pantryItems.map(i => i.trim().toLowerCase()).filter(Boolean);
  const seen = new Set<string>();
  const out: Array<{ name: string; text: string }> = [];
  for (const ing of recipe.ingredients) {
    const name = ing.normalizedName.toLowerCase();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    if (!inPantry(name, normalizedPantry)) out.push({ name, text: ing.rawText.trim() || name });
  }
  return out;
}

export function matchByIngredients(pantryItems: Set<string>): MatchResult[] {
  if (pantryItems.size === 0) return [];

  const normalizedPantry = Array.from(pantryItems).map(i => i.trim().toLowerCase());

  const results: MatchResult[] = [];

  for (const recipe of allRecipes) {
    const keyIngredients = Array.from(new Set(recipe.ingredients.map(i => i.normalizedName.toLowerCase())));
    if (keyIngredients.length === 0) continue;

    const matched: string[] = [];
    const missing: string[] = [];

    for (const ing of keyIngredients) {
      if (inPantry(ing, normalizedPantry)) {
        matched.push(ing);
      } else {
        missing.push(ing);
      }
    }

    const matchedCount = matched.length;
    const total = keyIngredients.length;
    const percentage = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

    if (matchedCount > 0) {
      results.push({
        recipe,
        matchedCount,
        totalKeyIngredients: total,
        matchPercentage: percentage,
        missingIngredients: missing
      });
    }
  }

  return results.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    if (a.missingIngredients.length !== b.missingIngredients.length) {
      return a.missingIngredients.length - b.missingIngredients.length;
    }
    return a.recipe.title.localeCompare(b.recipe.title);
  });
}
