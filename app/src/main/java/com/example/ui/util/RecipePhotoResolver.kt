package com.example.ui.util

import com.example.R
import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory

object RecipePhotoResolver {

  /**
   * Returns the authentic heritage drawable resource for the recipe.
   * Checks for specific family image assets if uploaded, and falls back to heritage dish photos.
   */
  fun getHeritageDrawableRes(context: android.content.Context, recipe: Recipe): Int {
    val specificName = when (recipe.id) {
      "franks_wine_making" -> "frank_wine"
      "aidens_first_communion_bread" -> "communion_bread"
      "tomato_canning_tradition" -> "tomato_canning"
      "pizzelle_della_nonna" -> "justin_pizzelle"
      "cuddruriaddri_calabresi" -> "cudorelli"
      "samanthas_s_cookies" -> "s_cookies"
      "scalille_calabresi" -> "scalilli"
      "nonna_turdilli" -> "turdilli"
      "baccala_balls_portuguese" -> "bacalhau_rosa"
      else -> null
    }
    if (specificName != null) {
      val resId = context.resources.getIdentifier(specificName, "drawable", context.packageName)
      if (resId != 0) return resId
    }
    return getHeritageDrawableRes(recipe)
  }

  fun getHeritageDrawableRes(recipe: Recipe): Int {
    val id = recipe.id.lowercase()
    val title = recipe.title.lowercase()
    val itTitle = recipe.italianTitle.lowercase()

    return when {
      // Taralli / Taralle
      id.contains("taralle") || id.contains("taralli") || title.contains("tarall") -> R.drawable.heritage_taralli
      
      // Gnocchi
      id.contains("gnocchi") || title.contains("gnocchi") -> R.drawable.heritage_gnocchi
      
      // Pizza & Calzone
      id.contains("pizza") || title.contains("pizza") || id.contains("calzone") -> R.drawable.heritage_pizza
      
      // Lasagna
      id.contains("lasagna") || title.contains("lasagna") -> R.drawable.heritage_lasagna
      
      // Bruschetta / Crostini
      id.contains("bruschetta") || title.contains("bruschetta") || id.contains("crostini") -> R.drawable.heritage_bruschetta
      
      // Eggplant / Parmigiana
      id.contains("eggplant") || id.contains("melanzane") || title.contains("eggplant") || title.contains("parmigiana") -> R.drawable.heritage_eggplant
      
      // Cannoli
      id.contains("cannoli") || title.contains("cannoli") -> R.drawable.heritage_cannoli
      
      // Tiramisu
      id.contains("tiramisu") || title.contains("tiramisu") -> R.drawable.heritage_tiramisu
      
      // Polenta
      id.contains("polenta") || title.contains("polenta") -> R.drawable.heritage_polenta
      
      // Wine / Cantina
      id.contains("wine") || title.contains("wine") -> R.drawable.heritage_wine
      
      // Peppers / Chilis / Preserved Olives / Cantina
      id.contains("pepper") || id.contains("olive") || id.contains("peperoncino") || id.contains("cantina") -> R.drawable.heritage_calabrese_peppers
      
      // Sausages / Salami / Salumi / Prosciutto / Capicollo
      id.contains("sausage") || id.contains("salami") || id.contains("salumi") || id.contains("soppressata") ||
        id.contains("capicollo") || id.contains("prosciutto") || id.contains("pancetta") -> R.drawable.heritage_cured_meats
      
      // Cookies / Scalilli / Turdilli / Pizzelle / Biscotti
      id.contains("scalille") || id.contains("turdilli") || id.contains("pizzelle") || id.contains("biscotti") ||
        id.contains("cookie") || id.contains("cuddruriaddri") || id.contains("cullurielli") || id.contains("anise") -> R.drawable.heritage_cookies
      
      // Bread / Focaccia / Buns
      id.contains("bread") || id.contains("focaccia") || id.contains("brioche") || id.contains("pane") || id.contains("cucullo") -> R.drawable.heritage_bread
      
      // Meatballs / Polpette
      id.contains("meatball") || id.contains("polpette") -> R.drawable.heritage_meatballs
      
      // Soups / Stews / Cuccia / Minestrone
      id.contains("cuccia") || id.contains("soup") || id.contains("minestrone") || id.contains("broth") ||
        id.contains("lentil") || id.contains("stracciatella") -> R.drawable.heritage_soup
      
      // Seafood / Baccala
      id.contains("baccal") || id.contains("fish") || id.contains("salmon") || id.contains("shrimp") || id.contains("calamari") -> R.drawable.heritage_seafood
      
      // Salads
      id.contains("salad") || id.contains("cucumber") || id.contains("insalata") -> R.drawable.heritage_salad
      
      // Roasts / Cutlets / Chicken / Lamb
      id.contains("lamb") || id.contains("roast") || id.contains("cotoletta") || id.contains("chicken") ||
        id.contains("pork") || id.contains("beef") || id.contains("steak") || id.contains("brasato") -> R.drawable.heritage_roast
      
      // Desserts & Pastries
      id.contains("pastiera") || id.contains("fiadone") || id.contains("ricotta_pie") || id.contains("puff") ||
        id.contains("crostata") || id.contains("cake") || id.contains("dolce") -> R.drawable.heritage_dessert
      
      // Pasta
      id.contains("pasta") || id.contains("spaghetti") || id.contains("fettuccine") || id.contains("cannelloni") ||
        id.contains("tagliatelle") || id.contains("carbonara") || id.contains("penne") || id.contains("rigatoni") -> R.drawable.heritage_pasta
      
      // Fallback by Category
      recipe.category == RecipeCategory.APPETIZERS -> R.drawable.heritage_bruschetta
      recipe.category == RecipeCategory.PASTA_AND_SAUCES || recipe.category == RecipeCategory.BAKED_PASTA -> R.drawable.heritage_pasta
      recipe.category == RecipeCategory.SOUPS -> R.drawable.heritage_soup
      recipe.category == RecipeCategory.MEATS -> R.drawable.heritage_roast
      recipe.category == RecipeCategory.SEAFOOD -> R.drawable.heritage_seafood
      recipe.category == RecipeCategory.VEGETABLES -> R.drawable.heritage_eggplant
      recipe.category == RecipeCategory.SALADS -> R.drawable.heritage_salad
      recipe.category == RecipeCategory.BREADS_AND_PIZZA -> R.drawable.heritage_pizza
      recipe.category == RecipeCategory.COOKIES_AND_BISCOTTI -> R.drawable.heritage_cookies
      recipe.category == RecipeCategory.CAKES_AND_DESSERTS || recipe.category == RecipeCategory.TARTS_AND_PIES -> R.drawable.heritage_dessert
      recipe.category == RecipeCategory.HOLIDAY_TRADITIONS -> R.drawable.heritage_cookies
      recipe.category == RecipeCategory.EGGS -> R.drawable.heritage_calabrese_peppers
      recipe.category == RecipeCategory.PICKLING -> R.drawable.heritage_calabrese_peppers
      else -> R.drawable.heritage_pasta
    }
  }

  fun hasOriginalPdfPhoto(recipe: Recipe): Boolean {
    return recipe.originalPhotoCaption.isNotBlank()
  }
}
