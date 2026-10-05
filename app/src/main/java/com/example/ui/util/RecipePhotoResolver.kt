package com.example.ui.util

import com.example.R
import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory

/**
 * Photos come from the original cookbook PDF (named cook_p<page>_<n>).
 * A recipe uses its own photo when the book has one on its page; otherwise it
 * falls back to a representative photo for its chapter.
 */
object RecipePhotoResolver {

  private val recipePhotos: Map<String, Int> = mapOf(
    "franks_wine_making" to R.drawable.cook_p26_1,
    "tomato_canning_tradition" to R.drawable.cook_p75_7,
    "gnocchi_alla_rosina" to R.drawable.cook_p107_1,
    "calabrese_homemade_sausage_salami" to R.drawable.cook_p146_1,
    "homemade_capicollo_pancetta" to R.drawable.cook_p149_1,
    "bacalhau_a_rosa" to R.drawable.cook_p176_1,
    "aidens_first_communion_bread" to R.drawable.cook_p195_1,
    "rosina_taralle_2008" to R.drawable.cook_p202_1,
    "glazed_egg_taralli" to R.drawable.cook_p203_1,
    "rosina_pizza_dough" to R.drawable.cook_p204_1,
    "samanthas_s_cookies" to R.drawable.cook_p234_1,
    "pizzelle_della_nonna" to R.drawable.cook_p242_2,
    "cuddruriaddri_calabresi" to R.drawable.cook_p278_1,
    "scalille_calabresi" to R.drawable.cook_p282_7,
    "turdilli_calabresi" to R.drawable.cook_p285_1,
    "easter_pie_pasqualina" to R.drawable.cook_p293_1,
    "fiadone_easter" to R.drawable.cook_p292_1,
  )

  private fun categoryPhoto(category: RecipeCategory): Int = when (category) {
    RecipeCategory.APPETIZERS -> R.drawable.cook_p74_1
    RecipeCategory.SOUPS -> R.drawable.cook_p50_1
    RecipeCategory.SALADS -> R.drawable.cook_p49_1
    RecipeCategory.VEGETABLES -> R.drawable.cook_p72_1
    RecipeCategory.PICKLING -> R.drawable.cook_p71_1
    RecipeCategory.RICE_AND_RISOTTO -> R.drawable.cook_p49_1
    RecipeCategory.PASTA_AND_SAUCES -> R.drawable.cook_p76_1
    RecipeCategory.BAKED_PASTA -> R.drawable.cook_p107_2
    RecipeCategory.MEATS -> R.drawable.cook_p148_1
    RecipeCategory.SEAFOOD -> R.drawable.cook_p176_1
    RecipeCategory.EGGS -> R.drawable.cook_p289_1
    RecipeCategory.BREADS_AND_PIZZA -> R.drawable.cook_p206_1
    RecipeCategory.COOKIES_AND_BISCOTTI -> R.drawable.cook_p236_1
    RecipeCategory.CAKES_AND_DESSERTS -> R.drawable.cook_p301_1
    RecipeCategory.HOLIDAY_TRADITIONS -> R.drawable.cook_p288_1
    RecipeCategory.TARTS_AND_PIES -> R.drawable.cook_p293_1
    RecipeCategory.DIETS -> R.drawable.cook_p49_1
  }

  @Suppress("UNUSED_PARAMETER")
  fun getHeritageDrawableRes(context: android.content.Context, recipe: Recipe): Int =
    getHeritageDrawableRes(recipe)

  fun getHeritageDrawableRes(recipe: Recipe): Int =
    recipePhotos[recipe.id] ?: categoryPhoto(recipe.category)

  fun hasOriginalPdfPhoto(recipe: Recipe): Boolean {
    return recipe.originalPhotoCaption.isNotBlank()
  }
}
