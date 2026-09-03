package com.example.data.repository

import com.example.data.model.MatchResult
import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory

data class KitchenConversion(
  val imperial: String,
  val metric: String
)

data class HelpfulHint(
  val title: String,
  val content: String,
  val cookbookPage: Int
)

data class MeatRoastingGuide(
  val meatType: String,
  val weight: String,
  val hours: String,
  val internalTemp: String
)

object CookbookDataSource {

  val allRecipes: List<Recipe> by lazy {
    (CookbookDataSourceAppetizers.recipes +
      CookbookDataSourceSoups.recipes +
      CookbookDataSourcePasta.recipes +
      CookbookDataSourceMains.recipes +
      CookbookDataSourceVegBreads.recipes +
      CookbookDataSourceDesserts.recipes)
      .sortedBy { it.title }
  }

  // Common pantry ingredients for quick tap addition
  val commonPantryIngredients = listOf(
    "Garlic", "Olive Oil", "Eggs", "Tomatoes", "Onion",
    "Parmesan", "Ricotta", "Mozzarella", "Pasta", "Flour",
    "Butter", "Chicken", "Pork", "Ground Beef", "Bacon",
    "Spinach", "Potatoes", "Mushrooms", "Zucchini", "Eggplant",
    "Basil", "Oregano", "Parsley", "Lemon", "White Wine",
    "Rice", "Breadcrumbs", "Milk", "Heavy Cream", "Sugar",
    "Yeast", "Almonds", "Chickpeas", "Beans", "Peppers"
  )

  fun searchRecipes(query: String, category: RecipeCategory? = null): List<Recipe> {
    val cleanQuery = query.trim().lowercase()
    return allRecipes.filter { recipe ->
      val matchesCategory = category == null || recipe.category == category
      val matchesQuery = cleanQuery.isEmpty() || recipe.searchableKeywords.contains(cleanQuery)
      matchesCategory && matchesQuery
    }
  }

  fun getRecipesByLetter(): Map<Char, List<Recipe>> {
    return allRecipes
      .sortedWith(compareBy(String.CASE_INSENSITIVE_ORDER) { it.title.trim() })
      .groupBy { it.title.trim().first().uppercaseChar() }
      .toSortedMap()
  }

  fun getRecipesByCategory(): Map<RecipeCategory, List<Recipe>> {
    return allRecipes.groupBy { it.category }
  }

  fun findRecipeById(id: String): Recipe? {
    return allRecipes.find { it.id == id }
  }

  /**
   * Matches recipes based on available user pantry ingredients.
   * Calculates what can be cooked now (100%), what is missing 1-2 items, and match percentage.
   */
  fun matchByIngredients(pantryItems: Set<String>): List<MatchResult> {
    if (pantryItems.isEmpty()) return emptyList()

    val normalizedPantry = pantryItems.map { it.trim().lowercase() }.toSet()

    return allRecipes.mapNotNull { recipe ->
      val keyIngredients = recipe.ingredients.map { it.normalizedName.lowercase() }.distinct()
      if (keyIngredients.isEmpty()) return@mapNotNull null

      val matched = mutableListOf<String>()
      val missing = mutableListOf<String>()

      for (ing in keyIngredients) {
        val hasMatch = normalizedPantry.any { pantryItem ->
          ing.contains(pantryItem) || pantryItem.contains(ing) ||
            (pantryItem.endsWith("s") && ing.contains(pantryItem.dropLast(1))) ||
            (ing.endsWith("s") && pantryItem.contains(ing.dropLast(1)))
        }

        if (hasMatch) {
          matched.add(ing)
        } else {
          missing.add(ing)
        }
      }

      val matchedCount = matched.size
      val total = keyIngredients.size
      val percentage = if (total > 0) ((matchedCount.toFloat() / total.toFloat()) * 100).toInt() else 0

      if (matchedCount > 0) {
        MatchResult(
          recipe = recipe,
          matchedCount = matchedCount,
          totalKeyIngredients = total,
          matchPercentage = percentage,
          missingIngredients = missing
        )
      } else {
        null
      }
    }.sortedWith(
      compareByDescending<MatchResult> { it.matchPercentage }
        .thenBy { it.missingIngredients.size }
        .thenBy { it.recipe.title }
    )
  }

  // Heritage cookbook reference tables from Pages 14-18
  val roastingGuides = listOf(
    MeatRoastingGuide("Beef Roasts", "4–6 lbs", "2 to 2½ hrs (rare), 2½–3½ (med), 2¾–4 (well)", "140°F / 150°F / 170°F"),
    MeatRoastingGuide("Veal Roasts", "3–5 lbs", "2 to 3½ hrs (well done)", "180°F"),
    MeatRoastingGuide("Lamb Roast", "3–5 lbs", "2 to 3 hrs (medium), 2¼–4 (well done)", "145°F / 170°F"),
    MeatRoastingGuide("Ham (cook before eating)", "5–7 lbs", "2½ to 3½ hrs", "170°F"),
    MeatRoastingGuide("Chicken broilers/fryers", "2½–4½ lbs", "2 to 3½ hrs", "185°F"),
    MeatRoastingGuide("Turkey Roasts", "12–16 lbs", "4½ to 5½ hrs", "185°F"),
    MeatRoastingGuide("Turkey Roasts", "16–20 lbs", "5½ to 6½ hrs", "185°F")
  )

  val volumeConversions = listOf(
    KitchenConversion("1/8 tsp", "0.5 ml"),
    KitchenConversion("1/4 tsp", "1 ml"),
    KitchenConversion("1/2 tsp", "2.5 ml"),
    KitchenConversion("1 tsp", "5 ml"),
    KitchenConversion("1 tbsp", "15 ml"),
    KitchenConversion("1 fl oz", "30 ml"),
    KitchenConversion("1/4 cup", "60 ml"),
    KitchenConversion("1/3 cup", "80 ml"),
    KitchenConversion("1/2 cup", "125 ml"),
    KitchenConversion("1 cup", "250 ml")
  )

  val temperatureConversions = listOf(
    KitchenConversion("450°F", "232°C"),
    KitchenConversion("425°F", "218°C"),
    KitchenConversion("400°F", "204°C"),
    KitchenConversion("375°F", "191°C"),
    KitchenConversion("350°F", "177°C"),
    KitchenConversion("325°F", "163°C"),
    KitchenConversion("300°F", "149°C")
  )

  val helpfulHints = listOf(
    HelpfulHint(
      "Oversalted Dish Fix",
      "Add cut raw potatoes into salty soup or sauce and discard once cooked; or add a teaspoon each of cider vinegar and sugar.",
      15
    ),
    HelpfulHint(
      "Prevent Sauce Sticking & Boiling Over",
      "When boiling pasta products, add a tablespoon of oil or butter to prevent sticking or foaming over.",
      16
    ),
    HelpfulHint(
      "Excess Grease Removal",
      "Drop a fresh lettuce leaf into hot homemade soup to absorb floating grease, or drop ice cubes in briefly—fat clings to cubes immediately!",
      15
    ),
    HelpfulHint(
      "Tempering Eggs for Hot Sauces",
      "Always stir a little bit of the hot broth or sauce into the beaten eggs first, then slowly whisk back into the pot so the eggs don't scramble.",
      17
    ),
    HelpfulHint(
      "Garlic in Italian Cooking",
      "Never burn or over-brown garlic. Browned garlic gives a sharp bitter taste. Light golden or aromatic translucence is the Italian standard.",
      96
    ),
    HelpfulHint(
      "Al Dente Pasta & Pasta Water",
      "Always salt the pasta cooking water generously, test for al dente firmness, and reserve 1/2 cup of starchy water to emulsify your sauce.",
      87
    )
  )
}
