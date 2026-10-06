export enum RecipeCategory {
  APPETIZERS = "APPETIZERS",
  BEVERAGES = "BEVERAGES",
  SOUPS = "SOUPS",
  SALADS = "SALADS",
  VEGETABLES = "VEGETABLES",
  PICKLING = "PICKLING",
  RICE_AND_RISOTTO = "RICE_AND_RISOTTO",
  PASTA_AND_SAUCES = "PASTA_AND_SAUCES",
  BAKED_PASTA = "BAKED_PASTA",
  MEATS = "MEATS",
  SEAFOOD = "SEAFOOD",
  EGGS = "EGGS",
  BREADS_AND_PIZZA = "BREADS_AND_PIZZA",
  COOKIES_AND_BISCOTTI = "COOKIES_AND_BISCOTTI",
  CAKES_AND_DESSERTS = "CAKES_AND_DESSERTS",
  HOLIDAY_TRADITIONS = "HOLIDAY_TRADITIONS",
  TARTS_AND_PIES = "TARTS_AND_PIES",
  DIETS = "DIETS"
}

export interface CategoryMetadata {
  displayName: string;
  pageRange: string;
  icon: string;
}

export const CATEGORY_INFO: Record<RecipeCategory, CategoryMetadata> = {
  [RecipeCategory.APPETIZERS]: { displayName: "Appetizers & Dips", pageRange: "p. 19–25", icon: "Utensils" },
  [RecipeCategory.BEVERAGES]: { displayName: "Beverages & Cocktails", pageRange: "p. 26–28", icon: "GlassWater" },
  [RecipeCategory.SOUPS]: { displayName: "Soups & Broths", pageRange: "p. 29–41", icon: "Soup" },
  [RecipeCategory.SALADS]: { displayName: "Salads", pageRange: "p. 42–50", icon: "Salad" },
  [RecipeCategory.VEGETABLES]: { displayName: "Vegetables & Sides", pageRange: "p. 51–69", icon: "Carrot" },
  [RecipeCategory.PICKLING]: { displayName: "Pickling & Preserving", pageRange: "p. 70–77", icon: "Package" },
  [RecipeCategory.RICE_AND_RISOTTO]: { displayName: "Rice & Risotto", pageRange: "p. 78–85", icon: "Wheat" },
  [RecipeCategory.PASTA_AND_SAUCES]: { displayName: "Pasta & Sauces", pageRange: "p. 87–104", icon: "CookingPot" },
  [RecipeCategory.BAKED_PASTA]: { displayName: "Cannelloni & Lasagna", pageRange: "p. 105–117", icon: "Layers" },
  [RecipeCategory.MEATS]: { displayName: "Meats & Poultry", pageRange: "p. 118–173", icon: "Beef" },
  [RecipeCategory.SEAFOOD]: { displayName: "Fish & Seafood", pageRange: "p. 174–184", icon: "Fish" },
  [RecipeCategory.EGGS]: { displayName: "Eggs & Frittatas", pageRange: "p. 185–193", icon: "Egg" },
  [RecipeCategory.BREADS_AND_PIZZA]: { displayName: "Breads & Pizza", pageRange: "p. 193–211", icon: "Pizza" },
  [RecipeCategory.COOKIES_AND_BISCOTTI]: { displayName: "Cookies & Biscotti", pageRange: "p. 212–249", icon: "Cookie" },
  [RecipeCategory.CAKES_AND_DESSERTS]: { displayName: "Cakes & Puddings", pageRange: "p. 250–269", icon: "Cake" },
  [RecipeCategory.HOLIDAY_TRADITIONS]: { displayName: "Holiday Heritage", pageRange: "p. 270–294", icon: "Sparkles" },
  [RecipeCategory.TARTS_AND_PIES]: { displayName: "Pies, Tarts & Cheesecakes", pageRange: "p. 295–320", icon: "PieChart" },
  [RecipeCategory.DIETS]: { displayName: "Keto & Diets", pageRange: "p. 321–329", icon: "Activity" }
};

export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  ADVANCED = "ADVANCED"
}

export const DIFFICULTY_INFO = {
  [DifficultyLevel.EASY]: { label: "Easy", dots: 1, description: "Beginner friendly, simple prep & pantry items" },
  [DifficultyLevel.MEDIUM]: { label: "Medium", dots: 2, description: "Moderate technique, timing or rolling" },
  [DifficultyLevel.ADVANCED]: { label: "Chef Heritage", dots: 3, description: "Artisan dough, slow simmering or delicate folding" }
};

export enum SpiceLevel {
  MILD = "MILD",
  WARM = "WARM",
  SPICY = "SPICY",
  EXTRA_SPICY = "EXTRA_SPICY"
}

export const SPICE_INFO = {
  [SpiceLevel.MILD]: { label: "Mild", icon: "🌿", tip: "Classic gentle herbs, no spicy heat" },
  [SpiceLevel.WARM]: { label: "Warm Kick", icon: "🌶️", tip: "Pinch of cracked black pepper & mild chili flakes" },
  [SpiceLevel.SPICY]: { label: "Spicy", icon: "🌶️🌶️", tip: "1 tsp crushed Calabrian chili flakes in warm olive oil" },
  [SpiceLevel.EXTRA_SPICY]: { label: "Calabrian Fire", icon: "🌶️🌶️🌶️", tip: "Fresh sliced Italian peperoncino & fiery chili oil" }
};

export interface NutritionInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sodiumMg: number;
}

export interface RecipeIngredient {
  rawText: string;
  normalizedName: string;
}

export interface Recipe {
  id: string;
  title: string;
  italianTitle: string;
  cookbookPage: number;
  category: RecipeCategory;
  contributor: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  difficulty?: DifficultyLevel;
  baseSpiceLevel?: SpiceLevel;
  /** Dietary flags judged from the ingredients: gluten-free, vegan, vegetarian, spicy, poultry, seafood, red-meat. */
  diet?: string[];
  nutrition?: NutritionInfo;
  ingredients: RecipeIngredient[];
  instructions: string[];
  notes: string;
  tags: string[];
  defaultRating: number;
  ratingCount: number;
  originalPhotoCaption?: string;
  originalPhotoPage?: number | null;
  /** Photo file names (without extension) from the original cookbook, in display order. */
  photos?: string[];
  /** A shared photo (https URL, hosted on Cloudinary). At most one per recipe. */
  imageUrl?: string;
  /** Display name of the person who shared the photo. */
  imageBy?: string;
  /** True for recipes added by signed-in family members (not in the printed cookbook). */
  community?: boolean;
  /** When a shared recipe was added (milliseconds), used by Latest Additions. */
  addedAt?: number;
  /** When the shared photo on a cookbook recipe was shared (milliseconds). */
  imageAt?: number;
  /** Firebase uid of the member who added a community recipe. */
  authorUid?: string;
}

export interface ShoppingItem {
  /** Lower-case ingredient name; one entry per ingredient however many recipes need it. */
  key: string;
  name: string;
  /** Which recipes need it and how each recipe words it. */
  needs: Array<{ recipe: string; text: string }>;
  bought: boolean;
  /** Missing recipe ingredients and added ingredients are 'ingredient'; utensils and other things are 'other'. */
  kind?: 'ingredient' | 'other';
}

export interface MatchResult {
  recipe: Recipe;
  matchedCount: number;
  totalKeyIngredients: number;
  matchPercentage: number;
  missingIngredients: string[];
}

export enum RecipeQuickFilter {
  ALL = "All Dishes",
  LATEST = "Latest Additions",
  FAVORITES = "Favorites",
  GLUTEN_FREE = "Gluten-Free 🌾",
  VEGAN = "Vegan 🌱",
  SPICY = "Spicy Kick 🌶️",
  POULTRY = "Poultry 🍗",
  SEAFOOD = "Seafood 🦐",
  RED_MEAT = "Red Meat 🥩",
  EASY = "Easy Prep",
  FAMILY_HERITAGE = "Family Classics",
  VEGETARIAN = "Vegetarian",
  QUICK = "Quick (<30m)"
}

export enum MatcherFilter {
  ALL_MATCHES = "All Matches",
  CAN_COOK_NOW = "Ready to Cook (100%)",
  MISSING_1_2 = "Missing 1–2 items"
}

export enum IndexViewMode {
  ALPHABETICAL_A_TO_Z = "ALPHABETICAL_A_TO_Z",
  BY_CATEGORY = "BY_CATEGORY",
  BY_CONTRIBUTOR = "BY_CONTRIBUTOR"
}

export enum UnitSystem {
  IMPERIAL = "IMPERIAL",
  METRIC = "METRIC"
}

export type ScreenDestination =
  | { type: "explore" }
  | { type: "pantry" }
  | { type: "index" }
  | { type: "heritage" }
  | { type: "detail"; recipeId: string }
  | { type: "addRecipe" }
  | { type: "shopping" }
  | { type: "photos" }
  | { type: "print"; recipeId?: string };

export interface MeatRoastingGuide {
  meatType: string;
  weight: string;
  hours: string;
  internalTemp: string;
}

export interface KitchenConversion {
  imperial: string;
  metric: string;
}

export interface HelpfulHint {
  title: string;
  content: string;
  cookbookPage: number;
}
