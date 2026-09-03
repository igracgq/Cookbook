package com.example.data.model

object AutoTaggingEngine {

  fun generateTags(recipe: Recipe): List<String> {
    val tags = mutableListOf<String>()
    val ingText = recipe.ingredients.joinToString(" ") { it.rawText.lowercase() }
    val titleLower = recipe.title.lowercase()
    val fullText = "$ingText $titleLower"

    // 1. Dietary Tags
    val hasGluten = fullText.contains("flour") || fullText.contains("pasta") ||
        fullText.contains("spaghetti") || fullText.contains("penne") || fullText.contains("bread") ||
        fullText.contains("dough") || fullText.contains("crust") || fullText.contains("semolina") ||
        fullText.contains("cookie") || fullText.contains("biscotti")
    if (!hasGluten) {
      tags.add("Gluten-Free")
    }

    val hasMeat = fullText.contains("beef") || fullText.contains("pork") || fullText.contains("chicken") ||
        fullText.contains("sausage") || fullText.contains("veal") || fullText.contains("meat") ||
        fullText.contains("pancetta") || fullText.contains("prosciutto") || fullText.contains("bacon") ||
        fullText.contains("shrimp") || fullText.contains("clam") || fullText.contains("fish") ||
        fullText.contains("salmon") || fullText.contains("calamari") || fullText.contains("tuna")
    if (!hasMeat) {
      tags.add("Vegetarian")

      val hasDairyOrEgg = fullText.contains("egg") || fullText.contains("cheese") ||
          fullText.contains("milk") || fullText.contains("butter") || fullText.contains("ricotta") ||
          fullText.contains("parmesan") || fullText.contains("mozzarella") || fullText.contains("cream") ||
          fullText.contains("pecorino")
      if (!hasDairyOrEgg) {
        tags.add("Vegan")
      }
    }

    val hasDairy = fullText.contains("cheese") || fullText.contains("milk") || fullText.contains("butter") ||
        fullText.contains("ricotta") || fullText.contains("parmesan") || fullText.contains("mozzarella") ||
        fullText.contains("cream") || fullText.contains("pecorino") || fullText.contains("mascarpone")
    if (!hasDairy) {
      tags.add("Dairy-Free")
    }

    val hasNuts = fullText.contains("nut") || fullText.contains("almond") || fullText.contains("walnut") ||
        fullText.contains("pine nut") || fullText.contains("pistachio")
    if (!hasNuts) {
      tags.add("Nut-Free")
    }

    // 2. Prep & Cook Time Tags
    val cookTime = recipe.cookTime.lowercase()
    val prepTime = recipe.prepTime.lowercase()
    if (prepTime.contains("10 min") || prepTime.contains("15 min") || prepTime.contains("5 min")) {
      tags.add("Quick Prep (<15m)")
    }
    if (cookTime.contains("10 min") || cookTime.contains("15 min") || cookTime.contains("12 min") ||
        cookTime.contains("None") || cookTime.contains("0 min") || cookTime.contains("20 min")) {
      tags.add("Under 30 Min")
    }
    if (cookTime.contains("hr") || cookTime.contains("hour") || cookTime.contains("60 min") ||
        cookTime.contains("90 min") || cookTime.contains("2 hours")) {
      tags.add("Slow Simmered")
    }

    // 3. Main Ingredients Tags
    if (fullText.contains("tomato") || fullText.contains("marinara") || fullText.contains("pomodoro")) {
      tags.add("San Marzano Tomato")
    }
    if (fullText.contains("basil")) {
      tags.add("Fresh Basil")
    }
    if (fullText.contains("garlic") && (fullText.contains("olive oil") || fullText.contains("evoo"))) {
      tags.add("Garlic & EVOO")
    }
    if (fullText.contains("chili") || fullText.contains("pepper flakes") || fullText.contains("peperoncino")) {
      tags.add("Calabrian Chili")
    }
    if (fullText.contains("ricotta") || fullText.contains("mozzarella") || fullText.contains("parmesan")) {
      tags.add("Artisan Cheese")
    }
    if (fullText.contains("pasta") || fullText.contains("gnocchi") || fullText.contains("spaghetti") || fullText.contains("penne")) {
      tags.add("Pasta Specialty")
    }
    if (fullText.contains("shrimp") || fullText.contains("clam") || fullText.contains("fish") || fullText.contains("calamari")) {
      tags.add("Seafood")
    }

    return tags.distinct()
  }
}
