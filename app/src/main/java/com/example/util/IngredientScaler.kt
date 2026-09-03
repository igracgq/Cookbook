package com.example.util

import java.text.DecimalFormat

enum class UnitSystem(val label: String, val badge: String) {
  IMPERIAL("Imperial (US)", "cups / oz / lbs"),
  METRIC("Metric (EU/Global)", "g / ml / kg")
}

data class ScaledIngredient(
  val displayText: String,
  val quantityHighlight: String,
  val originalText: String
)

object IngredientScaler {

  private val decimalFormat = DecimalFormat("#.##")

  fun scaleAndConvert(
    rawText: String,
    multiplier: Float,
    unitSystem: UnitSystem
  ): ScaledIngredient {
    val trimmed = rawText.trim()
    val match = Regex("""^(\d+\s+\d+/\d+|\d+/\d+|\d+(?:\.\d+)?)\s*(.*)""").find(trimmed)

    if (match == null) {
      // No leading number found (e.g., "Salt and black pepper to taste", "Fresh basil leaves")
      return ScaledIngredient(
        displayText = trimmed,
        quantityHighlight = "",
        originalText = trimmed
      )
    }

    val numStr = match.groupValues[1]
    val remainder = match.groupValues[2]

    val baseValue = parseFractionOrNumber(numStr) ?: 1.0f
    val scaledValue = baseValue * multiplier

    // Check if remainder starts with a recognizable unit
    val unitMatch = Regex("""^(cups?|c\.|lbs?|pounds?|oz|ounces?|tbsp|tablespoons?|tsp|teaspoons?|cloves?|slices?|cans?|stalks?|bunches?|pinch|pinches|quarts?|pts?|pints?)\b\s*(.*)""", RegexOption.IGNORE_CASE)
      .find(remainder)

    if (unitMatch == null) {
      // Plain count like "3 eggs", "2 eggplants", "4 tomatoes"
      val formattedQty = formatQuantity(scaledValue)
      val display = "$formattedQty $remainder"
      return ScaledIngredient(
        displayText = display,
        quantityHighlight = formattedQty,
        originalText = trimmed
      )
    }

    val unit = unitMatch.groupValues[1].lowercase()
    val itemName = unitMatch.groupValues[2]

    if (unitSystem == UnitSystem.METRIC) {
      val (metricQty, metricUnit) = convertToMetric(scaledValue, unit)
      val metricHighlight = "$metricQty $metricUnit"
      val display = "$metricHighlight ${if (itemName.isNotEmpty()) itemName else ""}".trim()
      return ScaledIngredient(
        displayText = display,
        quantityHighlight = metricHighlight,
        originalText = trimmed
      )
    } else {
      // Scaled Imperial
      val formattedQty = formatQuantity(scaledValue)
      val displayUnit = pluralizeUnit(scaledValue, unit)
      val imperialHighlight = "$formattedQty $displayUnit"
      val display = "$imperialHighlight ${if (itemName.isNotEmpty()) itemName else ""}".trim()
      return ScaledIngredient(
        displayText = display,
        quantityHighlight = imperialHighlight,
        originalText = trimmed
      )
    }
  }

  private fun parseFractionOrNumber(str: String): Float? {
    val clean = str.trim()
    return try {
      if (clean.contains(" ")) {
        // e.g. "1 1/2"
        val parts = clean.split(" ")
        val whole = parts[0].toFloatOrNull() ?: 0f
        val fracParts = parts[1].split("/")
        val num = fracParts[0].toFloatOrNull() ?: 0f
        val den = fracParts[1].toFloatOrNull() ?: 1f
        whole + (num / den)
      } else if (clean.contains("/")) {
        val fracParts = clean.split("/")
        val num = fracParts[0].toFloatOrNull() ?: 0f
        val den = fracParts[1].toFloatOrNull() ?: 1f
        num / den
      } else {
        clean.toFloatOrNull()
      }
    } catch (e: Exception) {
      null
    }
  }

  private fun convertToMetric(scaledValue: Float, unit: String): Pair<String, String> {
    return when {
      unit.startsWith("cup") || unit == "c." -> {
        val ml = (scaledValue * 240).toInt()
        "$ml" to "ml"
      }
      unit.startsWith("lb") || unit.startsWith("pound") -> {
        val grams = (scaledValue * 450).toInt()
        if (grams >= 1000) {
          val kg = decimalFormat.format(grams / 1000.0)
          "$kg" to "kg"
        } else {
          "$grams" to "g"
        }
      }
      unit.startsWith("oz") || unit.startsWith("ounce") -> {
        val grams = (scaledValue * 28.35).toInt().coerceAtLeast(1)
        "$grams" to "g"
      }
      unit.startsWith("tbsp") || unit.startsWith("tablespoon") -> {
        val ml = (scaledValue * 15).toInt().coerceAtLeast(1)
        "$ml" to "ml (${formatQuantity(scaledValue)} tbsp)"
      }
      unit.startsWith("tsp") || unit.startsWith("teaspoon") -> {
        val ml = (scaledValue * 5).toInt().coerceAtLeast(1)
        "$ml" to "ml (${formatQuantity(scaledValue)} tsp)"
      }
      unit.startsWith("quart") -> {
        val liters = decimalFormat.format(scaledValue * 0.95)
        "$liters" to "L"
      }
      unit.startsWith("pint") || unit == "pt" -> {
        val ml = (scaledValue * 475).toInt()
        "$ml" to "ml"
      }
      else -> {
        formatQuantity(scaledValue) to unit
      }
    }
  }

  private fun pluralizeUnit(value: Float, unit: String): String {
    val isPlural = value > 1.05f
    return when {
      unit.startsWith("cup") -> if (isPlural) "cups" else "cup"
      unit.startsWith("lb") || unit.startsWith("pound") -> if (isPlural) "lbs" else "lb"
      unit.startsWith("oz") || unit.startsWith("ounce") -> if (isPlural) "oz" else "oz"
      unit.startsWith("tbsp") || unit.startsWith("tablespoon") -> if (isPlural) "tbsp" else "tbsp"
      unit.startsWith("tsp") || unit.startsWith("teaspoon") -> if (isPlural) "tsp" else "tsp"
      unit.startsWith("clove") -> if (isPlural) "cloves" else "clove"
      unit.startsWith("slice") -> if (isPlural) "slices" else "slice"
      unit.startsWith("can") -> if (isPlural) "cans" else "can"
      else -> unit
    }
  }

  fun formatQuantity(value: Float): String {
    // Check close fractions
    val whole = value.toInt()
    val frac = value - whole

    val fracStr = when {
      frac in 0.20f..0.29f -> "1/4"
      frac in 0.30f..0.38f -> "1/3"
      frac in 0.45f..0.55f -> "1/2"
      frac in 0.62f..0.70f -> "2/3"
      frac in 0.71f..0.80f -> "3/4"
      else -> null
    }

    return when {
      fracStr != null && whole == 0 -> fracStr
      fracStr != null && whole > 0 -> "$whole $fracStr"
      frac < 0.05f -> "$whole"
      else -> decimalFormat.format(value)
    }
  }
}
