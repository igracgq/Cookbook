import { DifficultyLevel, NutritionInfo, Recipe, RecipeCategory, SpiceLevel } from '../types';

export function calculateDifficulty(recipe: Recipe): DifficultyLevel {
  if (recipe.difficulty && recipe.difficulty !== DifficultyLevel.MEDIUM) {
    return recipe.difficulty;
  }
  const instCount = recipe.instructions.length;
  const cookTime = recipe.cookTime.toLowerCase();
  const title = recipe.title.toLowerCase();

  if (instCount <= 4 && (cookTime.includes('5 min') || cookTime.includes('10 min') || cookTime.includes('none'))) {
    return DifficultyLevel.EASY;
  }
  if (
    instCount >= 8 ||
    title.includes('pasta fresca') ||
    title.includes('biscotti') ||
    title.includes('cannelloni')
  ) {
    return DifficultyLevel.ADVANCED;
  }
  if (
    recipe.category === RecipeCategory.APPETIZERS ||
    recipe.category === RecipeCategory.SALADS ||
    recipe.category === RecipeCategory.EGGS
  ) {
    return DifficultyLevel.EASY;
  }
  if (
    recipe.category === RecipeCategory.BAKED_PASTA ||
    recipe.category === RecipeCategory.BREADS_AND_PIZZA ||
    recipe.category === RecipeCategory.COOKIES_AND_BISCOTTI
  ) {
    return DifficultyLevel.ADVANCED;
  }
  return DifficultyLevel.MEDIUM;
}

export function calculateSpiceLevel(recipe: Recipe): SpiceLevel {
  if (recipe.baseSpiceLevel && recipe.baseSpiceLevel !== SpiceLevel.MILD) {
    return recipe.baseSpiceLevel;
  }
  if (recipe.diet?.includes('spicy')) return SpiceLevel.SPICY;
  const hasChili = recipe.ingredients.some(i => {
    const t = i.rawText.toLowerCase();
    return t.includes('chili') || t.includes('pepper flakes') || t.includes('peperoncino') || t.includes('hot pepper');
  });
  const hasPepper = recipe.ingredients.some(i => {
    const t = i.rawText.toLowerCase();
    return t.includes('black pepper') || t.includes('cracked pepper');
  });
  const title = recipe.title.toLowerCase();

  if (hasChili || title.includes('arrabbiata') || title.includes('diavola')) {
    return SpiceLevel.SPICY;
  }
  if (hasPepper || title.includes('carbonara') || title.includes('meatballs')) {
    return SpiceLevel.WARM;
  }
  return SpiceLevel.MILD;
}

export function calculateNutrition(recipe: Recipe): NutritionInfo {
  if (recipe.nutrition && (recipe.nutrition.calories !== 380 || recipe.nutrition.proteinGrams !== 16)) {
    return recipe.nutrition;
  }
  switch (recipe.category) {
    case RecipeCategory.PASTA_AND_SAUCES:
    case RecipeCategory.BAKED_PASTA:
    case RecipeCategory.RICE_AND_RISOTTO:
      return { calories: 490, proteinGrams: 21, carbsGrams: 68, fatGrams: 14, fiberGrams: 4, sodiumMg: 580 };
    case RecipeCategory.MEATS:
      return { calories: 520, proteinGrams: 42, carbsGrams: 8, fatGrams: 28, fiberGrams: 1, sodiumMg: 640 };
    case RecipeCategory.SEAFOOD:
      return { calories: 340, proteinGrams: 36, carbsGrams: 6, fatGrams: 12, fiberGrams: 1, sodiumMg: 490 };
    case RecipeCategory.SOUPS:
      return { calories: 240, proteinGrams: 12, carbsGrams: 28, fatGrams: 7, fiberGrams: 5, sodiumMg: 680 };
    case RecipeCategory.SALADS:
    case RecipeCategory.VEGETABLES:
    case RecipeCategory.PICKLING:
      return { calories: 180, proteinGrams: 6, carbsGrams: 14, fatGrams: 11, fiberGrams: 4, sodiumMg: 320 };
    case RecipeCategory.APPETIZERS:
      return { calories: 260, proteinGrams: 9, carbsGrams: 22, fatGrams: 15, fiberGrams: 2, sodiumMg: 410 };
    case RecipeCategory.EGGS:
      return { calories: 290, proteinGrams: 19, carbsGrams: 5, fatGrams: 18, fiberGrams: 1, sodiumMg: 390 };
    case RecipeCategory.BREADS_AND_PIZZA:
      return { calories: 410, proteinGrams: 14, carbsGrams: 62, fatGrams: 12, fiberGrams: 3, sodiumMg: 560 };
    case RecipeCategory.COOKIES_AND_BISCOTTI:
      return { calories: 210, proteinGrams: 4, carbsGrams: 32, fatGrams: 8, fiberGrams: 1, sodiumMg: 110 };
    case RecipeCategory.CAKES_AND_DESSERTS:
    case RecipeCategory.TARTS_AND_PIES:
    case RecipeCategory.HOLIDAY_TRADITIONS:
      return { calories: 360, proteinGrams: 6, carbsGrams: 46, fatGrams: 16, fiberGrams: 2, sodiumMg: 180 };
    case RecipeCategory.DIETS:
      return { calories: 310, proteinGrams: 28, carbsGrams: 6, fatGrams: 19, fiberGrams: 3, sodiumMg: 440 };
    default:
      return { calories: 380, proteinGrams: 16, carbsGrams: 45, fatGrams: 14, fiberGrams: 3, sodiumMg: 460 };
  }
}

export function scaleNutrition(nutrition: NutritionInfo, multiplier: number): NutritionInfo {
  return {
    calories: Math.max(0, Math.round(nutrition.calories * multiplier)),
    proteinGrams: Math.max(0, Math.round(nutrition.proteinGrams * multiplier)),
    carbsGrams: Math.max(0, Math.round(nutrition.carbsGrams * multiplier)),
    fatGrams: Math.max(0, Math.round(nutrition.fatGrams * multiplier)),
    fiberGrams: Math.max(0, Math.round(nutrition.fiberGrams * multiplier)),
    sodiumMg: Math.max(0, Math.round(nutrition.sodiumMg * multiplier))
  };
}

export function getSearchableKeywords(recipe: Recipe): string {
  const parts: string[] = [
    recipe.title.toLowerCase(),
    recipe.italianTitle.toLowerCase(),
    recipe.category.toLowerCase(),
    recipe.contributor.toLowerCase(),
    recipe.cookTime.toLowerCase(),
    recipe.prepTime.toLowerCase(),
    ...recipe.ingredients.map(i => `${i.normalizedName.toLowerCase()} ${i.rawText.toLowerCase()}`),
    ...recipe.tags.map(t => t.toLowerCase())
  ];
  return parts.join(' ');
}
