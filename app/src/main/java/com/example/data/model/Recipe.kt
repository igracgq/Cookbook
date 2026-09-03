package com.example.data.model

enum class RecipeCategory(val displayName: String, val pageRange: String, val iconName: String) {
  APPETIZERS("Appetizers & Dips", "p. 19–25", "Tapas"),
  SOUPS("Soups & Broths", "p. 29–41", "SoupKitchen"),
  SALADS("Salads", "p. 42–50", "Grass"),
  VEGETABLES("Vegetables & Sides", "p. 51–69", "Yard"),
  PICKLING("Pickling & Preserving", "p. 70–76", "Inventory"),
  RICE_AND_RISOTTO("Rice & Risotto", "p. 78–85", "Grain"),
  PASTA_AND_SAUCES("Pasta & Sauces", "p. 87–104", "DinnerDining"),
  BAKED_PASTA("Cannelloni & Lasagna", "p. 105–117", "BakeryDining"),
  MEATS("Meats & Poultry", "p. 118–173", "KebabDining"),
  SEAFOOD("Fish & Seafood", "p. 174–184", "SetMeal"),
  EGGS("Eggs & Frittatas", "p. 185–193", "Egg"),
  BREADS_AND_PIZZA("Breads & Pizza", "p. 193–211", "LocalPizza"),
  COOKIES_AND_BISCOTTI("Cookies & Biscotti", "p. 212–249", "Cookie"),
  CAKES_AND_DESSERTS("Cakes & Puddings", "p. 250–269", "Cake"),
  HOLIDAY_TRADITIONS("Holiday Heritage", "p. 270–294", "Celebration"),
  TARTS_AND_PIES("Pies, Tarts & Crepes", "p. 295–320", "Pie"),
  DIETS("Keto & Diets", "p. 321–329", "FitnessCenter")
}

data class NutritionInfo(
  val calories: Int = 380,
  val proteinGrams: Int = 16,
  val carbsGrams: Int = 45,
  val fatGrams: Int = 14,
  val fiberGrams: Int = 3,
  val sodiumMg: Int = 460
) {
  fun scaled(multiplier: Float): NutritionInfo {
    return NutritionInfo(
      calories = (calories * multiplier).toInt().coerceAtLeast(0),
      proteinGrams = (proteinGrams * multiplier).toInt().coerceAtLeast(0),
      carbsGrams = (carbsGrams * multiplier).toInt().coerceAtLeast(0),
      fatGrams = (fatGrams * multiplier).toInt().coerceAtLeast(0),
      fiberGrams = (fiberGrams * multiplier).toInt().coerceAtLeast(0),
      sodiumMg = (sodiumMg * multiplier).toInt().coerceAtLeast(0)
    )
  }
}

enum class DifficultyLevel(
  val label: String,
  val levelDots: Int,
  val badgeLabel: String,
  val description: String
) {
  EASY("Easy", 1, "Easy", "Beginner friendly, simple prep & pantry items"),
  MEDIUM("Medium", 2, "Medium", "Moderate technique, timing or rolling"),
  ADVANCED("Advanced", 3, "Chef Heritage", "Artisan dough, slow simmering or delicate folding");

  val dots: Int get() = levelDots
}

enum class SpiceLevel(
  val label: String,
  val heatValue: Int,
  val peppersCount: Int,
  val iconEmoji: String,
  val spiceTip: String
) {
  MILD("Mild", 0, 0, "🌿", "Classic gentle herbs, no spicy heat"),
  WARM("Warm Kick", 1, 1, "🌶️", "Pinch of cracked black pepper & mild chili flakes"),
  SPICY("Spicy", 2, 2, "🌶️🌶️", "1 tsp crushed Calabrian chili flakes in warm olive oil"),
  EXTRA_SPICY("Calabrian Fire", 3, 3, "🌶️🌶️🌶️", "Fresh sliced Italian peperoncino & fiery chili oil");

  val chiliIcon: String get() = iconEmoji
  val tip: String get() = spiceTip
}

data class RecipeIngredient(
  val rawText: String,
  val normalizedName: String
)

data class Recipe(
  val id: String,
  val title: String,
  val italianTitle: String = "",
  val cookbookPage: Int,
  val category: RecipeCategory,
  val contributor: String = "Traditional Heritage",
  val servings: String = "4-6 servings",
  val prepTime: String = "20 mins",
  val cookTime: String = "30 mins",
  val difficulty: DifficultyLevel = DifficultyLevel.MEDIUM,
  val baseSpiceLevel: SpiceLevel = SpiceLevel.MILD,
  val nutrition: NutritionInfo = NutritionInfo(),
  val ingredients: List<RecipeIngredient>,
  val instructions: List<String>,
  val notes: String = "",
  val tags: List<String> = emptyList(),
  val defaultRating: Float = 4.8f,
  val ratingCount: Int = 32
) {
  val autoTags: List<String>
    get() = AutoTaggingEngine.generateTags(this)

  val calculatedDifficulty: DifficultyLevel
    get() {
      if (difficulty != DifficultyLevel.MEDIUM) return difficulty
      return when {
        instructions.size <= 4 && (cookTime.contains("5 min") || cookTime.contains("10 min") || cookTime.contains("None")) -> DifficultyLevel.EASY
        instructions.size >= 8 || title.contains("Pasta Fresca", ignoreCase = true) || title.contains("Biscotti", ignoreCase = true) || title.contains("Cannelloni", ignoreCase = true) -> DifficultyLevel.ADVANCED
        category in listOf(RecipeCategory.APPETIZERS, RecipeCategory.SALADS, RecipeCategory.EGGS) -> DifficultyLevel.EASY
        category in listOf(RecipeCategory.BAKED_PASTA, RecipeCategory.BREADS_AND_PIZZA, RecipeCategory.COOKIES_AND_BISCOTTI) -> DifficultyLevel.ADVANCED
        else -> DifficultyLevel.MEDIUM
      }
    }

  val calculatedSpiceLevel: SpiceLevel
    get() {
      if (baseSpiceLevel != SpiceLevel.MILD) return baseSpiceLevel
      val hasChili = ingredients.any {
        it.rawText.contains("chili", ignoreCase = true) ||
          it.rawText.contains("pepper flakes", ignoreCase = true) ||
          it.rawText.contains("peperoncino", ignoreCase = true) ||
          it.rawText.contains("hot pepper", ignoreCase = true)
      }
      val hasPepper = ingredients.any {
        it.rawText.contains("black pepper", ignoreCase = true) ||
          it.rawText.contains("cracked pepper", ignoreCase = true)
      }
      return when {
        hasChili || title.contains("Arrabbiata", ignoreCase = true) || title.contains("Diavola", ignoreCase = true) -> SpiceLevel.SPICY
        hasPepper || title.contains("Carbonara", ignoreCase = true) || title.contains("Meatballs", ignoreCase = true) -> SpiceLevel.WARM
        else -> SpiceLevel.MILD
      }
    }

  val calculatedNutrition: NutritionInfo
    get() {
      if (nutrition.calories != 380 || nutrition.proteinGrams != 16) return nutrition
      return when (category) {
        RecipeCategory.PASTA_AND_SAUCES, RecipeCategory.BAKED_PASTA, RecipeCategory.RICE_AND_RISOTTO ->
          NutritionInfo(calories = 490, proteinGrams = 21, carbsGrams = 68, fatGrams = 14, fiberGrams = 4, sodiumMg = 580)
        RecipeCategory.MEATS ->
          NutritionInfo(calories = 520, proteinGrams = 42, carbsGrams = 8, fatGrams = 28, fiberGrams = 1, sodiumMg = 640)
        RecipeCategory.SEAFOOD ->
          NutritionInfo(calories = 340, proteinGrams = 36, carbsGrams = 6, fatGrams = 12, fiberGrams = 1, sodiumMg = 490)
        RecipeCategory.SOUPS ->
          NutritionInfo(calories = 240, proteinGrams = 12, carbsGrams = 28, fatGrams = 7, fiberGrams = 5, sodiumMg = 680)
        RecipeCategory.SALADS, RecipeCategory.VEGETABLES, RecipeCategory.PICKLING ->
          NutritionInfo(calories = 180, proteinGrams = 6, carbsGrams = 14, fatGrams = 11, fiberGrams = 4, sodiumMg = 320)
        RecipeCategory.APPETIZERS ->
          NutritionInfo(calories = 260, proteinGrams = 9, carbsGrams = 22, fatGrams = 15, fiberGrams = 2, sodiumMg = 410)
        RecipeCategory.EGGS ->
          NutritionInfo(calories = 290, proteinGrams = 19, carbsGrams = 5, fatGrams = 18, fiberGrams = 1, sodiumMg = 390)
        RecipeCategory.BREADS_AND_PIZZA ->
          NutritionInfo(calories = 410, proteinGrams = 14, carbsGrams = 62, fatGrams = 12, fiberGrams = 3, sodiumMg = 560)
        RecipeCategory.COOKIES_AND_BISCOTTI ->
          NutritionInfo(calories = 210, proteinGrams = 4, carbsGrams = 32, fatGrams = 8, fiberGrams = 1, sodiumMg = 110)
        RecipeCategory.CAKES_AND_DESSERTS, RecipeCategory.TARTS_AND_PIES, RecipeCategory.HOLIDAY_TRADITIONS ->
          NutritionInfo(calories = 360, proteinGrams = 6, carbsGrams = 46, fatGrams = 16, fiberGrams = 2, sodiumMg = 180)
        RecipeCategory.DIETS ->
          NutritionInfo(calories = 310, proteinGrams = 28, carbsGrams = 6, fatGrams = 19, fiberGrams = 3, sodiumMg = 440)
      }
    }

  val searchableKeywords: String by lazy {
    buildString {
      append(title.lowercase())
      append(" ")
      append(italianTitle.lowercase())
      append(" ")
      append(category.displayName.lowercase())
      append(" ")
      append(contributor.lowercase())
      append(" ")
      append(difficulty.label.lowercase())
      append(" ")
      append(baseSpiceLevel.label.lowercase())
      append(" ")
      ingredients.forEach {
        append(it.normalizedName.lowercase())
        append(" ")
        append(it.rawText.lowercase())
        append(" ")
      }
      tags.forEach {
        append(it.lowercase())
        append(" ")
      }
    }
  }
}

data class MatchResult(
  val recipe: Recipe,
  val matchedCount: Int,
  val totalKeyIngredients: Int,
  val matchPercentage: Int,
  val missingIngredients: List<String>
)
