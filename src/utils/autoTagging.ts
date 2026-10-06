import { Recipe } from '../types';

export function generateAutoTags(recipe: Recipe): string[] {
  const tags: string[] = [];
  const ingText = recipe.ingredients.map(i => i.rawText.toLowerCase()).join(' ');
  const titleLower = recipe.title.toLowerCase();
  const fullText = `${ingText} ${titleLower}`;

  // 1. Dietary Tags (judged per recipe by tools/dietary/classify.py and stored in recipes.json)
  const diet = recipe.diet ?? [];
  if (diet.includes('gluten-free')) tags.push('Gluten-Free');
  if (diet.includes('vegetarian')) tags.push('Vegetarian');
  if (diet.includes('vegan')) tags.push('Vegan');
  if (diet.includes('spicy')) tags.push('Spicy');
  if (diet.includes('poultry')) tags.push('Poultry');
  if (diet.includes('seafood')) tags.push('Seafood');
  if (diet.includes('red-meat')) tags.push('Red Meat');

  const hasDairy =
    fullText.includes('cheese') ||
    fullText.includes('milk') ||
    fullText.includes('butter') ||
    fullText.includes('ricotta') ||
    fullText.includes('parmesan') ||
    fullText.includes('mozzarella') ||
    fullText.includes('cream') ||
    fullText.includes('pecorino') ||
    fullText.includes('mascarpone');

  if (!hasDairy) {
    tags.push('Dairy-Free');
  }

  const hasNuts =
    fullText.includes('nut') ||
    fullText.includes('almond') ||
    fullText.includes('walnut') ||
    fullText.includes('pine nut') ||
    fullText.includes('pistachio');

  if (!hasNuts) {
    tags.push('Nut-Free');
  }

  // 2. Prep & Cook Time Tags
  const cookTime = recipe.cookTime.toLowerCase();
  const prepTime = recipe.prepTime.toLowerCase();
  if (prepTime.includes('10 min') || prepTime.includes('15 min') || prepTime.includes('5 min')) {
    tags.push('Quick Prep (<15m)');
  }
  if (
    cookTime.includes('10 min') ||
    cookTime.includes('15 min') ||
    cookTime.includes('12 min') ||
    cookTime.includes('none') ||
    cookTime.includes('0 min') ||
    cookTime.includes('20 min')
  ) {
    tags.push('Under 30 Min');
  }
  if (
    cookTime.includes('hr') ||
    cookTime.includes('hour') ||
    cookTime.includes('60 min') ||
    cookTime.includes('90 min') ||
    cookTime.includes('2 hours')
  ) {
    tags.push('Slow Simmered');
  }

  // 3. Main Ingredients Tags
  if (fullText.includes('tomato') || fullText.includes('marinara') || fullText.includes('pomodoro')) {
    tags.push('San Marzano Tomato');
  }
  if (fullText.includes('basil')) {
    tags.push('Fresh Basil');
  }
  if (fullText.includes('garlic') && (fullText.includes('olive oil') || fullText.includes('evoo'))) {
    tags.push('Garlic & EVOO');
  }
  if (fullText.includes('chili') || fullText.includes('pepper flakes') || fullText.includes('peperoncino')) {
    tags.push('Calabrian Chili');
  }
  if (fullText.includes('ricotta') || fullText.includes('mozzarella') || fullText.includes('parmesan')) {
    tags.push('Artisan Cheese');
  }
  if (fullText.includes('pasta') || fullText.includes('gnocchi') || fullText.includes('spaghetti') || fullText.includes('penne')) {
    tags.push('Pasta Specialty');
  }

  return Array.from(new Set(tags));
}
