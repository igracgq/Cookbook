package com.example.data.repository

import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory
import com.example.data.model.RecipeIngredient

object CookbookDataSourceAppetizers {
  val recipes = listOf(
    Recipe(
      id = "bruschetta_classica",
      title = "Bruschetta Classica",
      italianTitle = "Toasted Garlic Bread",
      cookbookPage = 19,
      category = RecipeCategory.APPETIZERS,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "5 mins",
      cookTime = "5 mins",
      ingredients = listOf(
        RecipeIngredient("4 slices thick-crusted Italian country bread (about 1 cm thick)", "bread"),
        RecipeIngredient("1 clove of garlic, peeled", "garlic"),
        RecipeIngredient("Extra-virgin olive oil", "olive oil"),
        RecipeIngredient("Whole small dry red peppers, spicy (optional)", "red pepper flakes"),
        RecipeIngredient("Salt to taste", "salt")
      ),
      instructions = listOf(
        "Preheat oven, broiler, toaster, or light up a charcoal fire.",
        "Grill the bread on both sides until golden brown.",
        "Lightly rub the garlic on the surface of the bread.",
        "If you like, you may also lightly rub the red pepper over the bread.",
        "Pour a thin stream of olive oil on the bread, and sprinkle with salt. Serve while still warm."
      ),
      notes = "A classic Italian antipasto staple. Always rub the garlic immediately after grilling while the bread is still hot.",
      tags = listOf("Appetizers", "Bread", "Vegetarian", "Quick")
    ),
    Recipe(
      id = "bruschetta_al_pomodoro",
      title = "Bruschetta al Pomodoro",
      italianTitle = "Toasted Bread with Tomatoes",
      cookbookPage = 19,
      category = RecipeCategory.APPETIZERS,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "10 mins",
      cookTime = "5 mins",
      ingredients = listOf(
        RecipeIngredient("4 slices thick-crusted Italian country bread (about 1 cm thick)", "bread"),
        RecipeIngredient("4 medium tomatoes, finely diced", "tomatoes"),
        RecipeIngredient("Fresh basil leaves, torn", "basil"),
        RecipeIngredient("Extra-virgin olive oil", "olive oil"),
        RecipeIngredient("1 clove of garlic, peeled", "garlic"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "In a bowl mix tomato, basil, extra-virgin olive oil, salt, and pepper.",
        "Preheat oven, broiler, toaster, or light up a charcoal fire.",
        "Grill the bread on both sides until golden brown.",
        "Lightly rub the garlic on the surface of the bread.",
        "Distribute tomato uniformly on bread slices and serve warm."
      ),
      notes = "Ripe, sweet garden tomatoes yield the most flavourful topping.",
      tags = listOf("Appetizers", "Bread", "Vegetarian", "Tomatoes")
    ),
    Recipe(
      id = "italian_garlic_bread",
      title = "Italian Garlic Bread",
      italianTitle = "Pane all'Aglio",
      cookbookPage = 19,
      category = RecipeCategory.APPETIZERS,
      contributor = "Sandy Vitale",
      servings = "6-8 servings",
      prepTime = "5 mins",
      cookTime = "8 mins",
      ingredients = listOf(
        RecipeIngredient("1 loaf French bread or sourdough, cut in half lengthwise in 6-inch sections", "bread"),
        RecipeIngredient("Garlic juice or crushed garlic", "garlic"),
        RecipeIngredient("Butter", "butter")
      ),
      instructions = listOf(
        "Melt butter and mix in equal amount of garlic juice with melted butter.",
        "Lightly toast bread.",
        "Spread melted butter-garlic juice mix on bread.",
        "Again, lightly toast until butter & garlic juice combination are slightly bubbly. Serve warm.",
        "P.S. Don't forget to add garlic juice to your pasta sauce, too!"
      ),
      notes = "Alternate method: Spray bread with garlic juice, toast lightly, then spread butter and toast until melted into bread.",
      tags = listOf("Appetizers", "Bread", "Garlic")
    ),
    Recipe(
      id = "muffaletta_sandwiches",
      title = "Muffaletta Sandwiches",
      italianTitle = "Classic Sicilian Sandwich",
      cookbookPage = 19,
      category = RecipeCategory.APPETIZERS,
      contributor = "Family Heritage",
      servings = "6-8 servings",
      prepTime = "20 mins",
      cookTime = "None",
      ingredients = listOf(
        RecipeIngredient("1 15-inch loaf French bread or Sicilian round crusty loaf", "bread"),
        RecipeIngredient("1 cup olive salad", "olive salad"),
        RecipeIngredient("1/4 lb Genoa salami, sliced", "salami"),
        RecipeIngredient("3/4 lb provolone cheese, sliced", "provolone"),
        RecipeIngredient("1/4 lb sliced prosciutto cotto", "prosciutto"),
        RecipeIngredient("1/4 lb mortadella, sliced", "mortadella")
      ),
      instructions = listOf(
        "Cut bread in half horizontally.",
        "Spread generous layers of olive salad on both halves.",
        "Layer salami, mortadella, prosciutto cotto, and provolone cheese.",
        "Press halves firmly together, wrap tightly and chill before slicing into hearty wedges."
      ),
      notes = "Muffaletta is a type of Sicilian bread with a hollow center. Olive salad can be prepared several days ahead.",
      tags = listOf("Appetizers", "Sandwiches", "Meats", "Sicilian")
    ),
    Recipe(
      id = "mini_muffalata",
      title = "Mini Muffalata",
      italianTitle = "Bocconcini di Muffalata",
      cookbookPage = 19,
      category = RecipeCategory.APPETIZERS,
      contributor = "Vera F.",
      servings = "30-35 pieces",
      prepTime = "15 mins",
      cookTime = "None",
      ingredients = listOf(
        RecipeIngredient("1 package soft goat cheese (4.5 oz / 140 g)", "goat cheese"),
        RecipeIngredient("1 tablespoon olive oil", "olive oil"),
        RecipeIngredient("1/4 cup black olive paste", "olives"),
        RecipeIngredient("2 roasted red peppers", "bell pepper"),
        RecipeIngredient("8 large basil leaves", "basil"),
        RecipeIngredient("1 baguette", "bread"),
        RecipeIngredient("Freshly ground black pepper and salt to taste", "salt")
      ),
      instructions = listOf(
        "Mix goat cheese, olive oil, and garlic together. Season and set aside.",
        "Cut baguette in 1/2 lengthwise. Pull out centre, leaving a thin crust border.",
        "Spread both halves with olive paste, top with pieces of red pepper.",
        "Place basil on top half and spread goat cheese on bottom half.",
        "Sandwich together, wrap tightly in plastic wrap. Chill before serving.",
        "Cut off ends and slice into 1/2 inch rounds to serve."
      ),
      notes = "Perfect finger food for parties and family gatherings.",
      tags = listOf("Appetizers", "Finger Food", "Vegetarian", "Entertaining")
    ),
    Recipe(
      id = "hot_mushroom_turnovers",
      title = "Hot Mushroom Turnovers",
      italianTitle = "Panzerotti ai Funghi",
      cookbookPage = 19,
      category = RecipeCategory.APPETIZERS,
      contributor = "Family Heritage",
      servings = "20 turnovers",
      prepTime = "30 mins",
      cookTime = "12 mins",
      ingredients = listOf(
        RecipeIngredient("3 packages (3 oz each) cream cheese, softened", "cream cheese"),
        RecipeIngredient("1 1/2 cups plus 2 tbsp all-purpose flour", "flour"),
        RecipeIngredient("1/2 cup plus 3 tbsp butter, softened", "butter"),
        RecipeIngredient("1/2 lb mushrooms, minced", "mushrooms"),
        RecipeIngredient("1 large onion, minced", "onion"),
        RecipeIngredient("1/4 cup sour cream", "sour cream"),
        RecipeIngredient("1/4 tsp thyme", "thyme"),
        RecipeIngredient("1 tsp salt", "salt"),
        RecipeIngredient("1 egg, beaten", "eggs")
      ),
      instructions = listOf(
        "In medium bowl, mix cream cheese, 1 1/2 cups flour, and 1/2 cup butter. Wrap dough; chill for 1 hour.",
        "In a 10-inch skillet over medium heat, combine 3 tbsp butter, mushrooms, and onion until tender.",
        "Add salt, thyme, and 2 tbsp flour until blended. Stir in sour cream.",
        "On floured surface, roll out 1/2 dough; with cookie cutter cut out 20 (2 3/4 inch) circles.",
        "On half of each circle put a tsp of mushroom mixture. Brush edges with beaten egg.",
        "Fold dough over filling; with fork press edges together. Prick tops. Place on ungreased cookie sheets. Brush with egg.",
        "Cover and chill for 25 minutes.",
        "Preheat oven to 450°F. Bake for 12 minutes until golden."
      ),
      notes = "Rich and savory pastry with a velvety mushroom filling.",
      tags = listOf("Appetizers", "Baking", "Mushrooms")
    ),
    Recipe(
      id = "fig_and_goat_cheese_crostini",
      title = "Fig and Goat Cheese Crostini",
      italianTitle = "Crostini con Fichi e Caprino",
      cookbookPage = 21,
      category = RecipeCategory.APPETIZERS,
      contributor = "Christiana Rizzuto",
      servings = "24 pieces",
      prepTime = "20 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("1/4 lb dried Black Mission figs, finely chopped (3/4 cup)", "figs"),
        RecipeIngredient("6 oz soft mild goat cheese (room temperature)", "goat cheese"),
        RecipeIngredient("2 fresh ripe figs, cut into 1/2-inch pieces", "figs"),
        RecipeIngredient("12 baguette slices (1/2-inch thick)", "bread"),
        RecipeIngredient("3 tbsp minced shallot", "shallots"),
        RecipeIngredient("1 1/2 tbsp unsalted butter", "butter"),
        RecipeIngredient("3/4 cup Port wine", "port wine"),
        RecipeIngredient("Fresh thyme sprigs & minced thyme", "thyme"),
        RecipeIngredient("1 tbsp olive oil", "olive oil"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Cook shallot, thyme sprigs, and bay leaf in butter in a saucepan over medium-low heat until softened, about 2 minutes.",
        "Add dried figs, Port, salt, and pepper and bring to a boil. Simmer covered until figs are soft, about 10 minutes.",
        "Remove lid and simmer until most liquid evaporates (3-4 mins). Discard bay leaf and thyme; stir in minced thyme.",
        "Preheat oven to 350°F. Arrange baguette slices on baking sheet, brush lightly with olive oil, and bake 7 minutes.",
        "Spread each toast with 1 tsp fig jam and top with 1 1/2 tsp goat cheese and 2 pieces of fresh fig."
      ),
      notes = "Fig jam can be made 1 day ahead and chilled covered.",
      tags = listOf("Appetizers", "Crostini", "Figs", "Entertaining")
    ),
    Recipe(
      id = "fried_spicy_parmesan_balls",
      title = "Fried Spicy Parmesan Balls",
      italianTitle = "Palline di Parmigiano Piccanti",
      cookbookPage = 22,
      category = RecipeCategory.APPETIZERS,
      contributor = "Traditional Family Heritage",
      servings = "4-6 servings",
      prepTime = "10 mins",
      cookTime = "10 mins",
      ingredients = listOf(
        RecipeIngredient("2 egg whites", "eggs"),
        RecipeIngredient("4 tbsp fresh Parmigiano Reggiano, freshly grated", "parmesan"),
        RecipeIngredient("1/2 tsp paprika", "paprika"),
        RecipeIngredient("Pinch of salt", "salt"),
        RecipeIngredient("Oil for frying", "oil")
      ),
      instructions = listOf(
        "Beat egg whites until stiff but not dry.",
        "Gradually add the Parmigiano Reggiano, pinch of salt, and half the paprika while continuing to beat.",
        "In a heavy Dutch oven or deep fryer, heat oil to 360°F.",
        "With a teaspoon, drop little mounds of the batter into the hot oil.",
        "Fry until light golden brown.",
        "Remove with a slotted spoon onto absorbent paper towels.",
        "Sprinkle with remaining paprika and toss well before serving."
      ),
      notes = "Airy, crispy, cheesy bites with a gentle kick of paprika.",
      tags = listOf("Appetizers", "Cheese", "Vegetarian", "Quick")
    ),
    Recipe(
      id = "spinach_and_artichoke_dip",
      title = "Spinach and Artichoke Dip",
      italianTitle = "Salsa Calda di Spinaci e Carciofi",
      cookbookPage = 25,
      category = RecipeCategory.APPETIZERS,
      contributor = "Yvonne Giedroyc",
      servings = "12 servings",
      prepTime = "15 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("2 packages (10 oz each) chopped frozen spinach, thawed and drained", "spinach"),
        RecipeIngredient("2 cans (8 oz each) quartered artichoke hearts, drained", "artichokes"),
        RecipeIngredient("1/2 cup fresh shallots, minced", "shallots"),
        RecipeIngredient("4 cloves fresh garlic, minced", "garlic"),
        RecipeIngredient("4 oz garlic herb cheese", "cream cheese"),
        RecipeIngredient("1/4 cup Parmesan, freshly grated", "parmesan"),
        RecipeIngredient("2 cups heavy cream", "heavy cream"),
        RecipeIngredient("4 tbsp unsalted butter", "butter"),
        RecipeIngredient("1 tsp salt and 1/2 tsp white pepper", "salt")
      ),
      instructions = listOf(
        "In large frying pan, sauté shallots and garlic in butter at medium heat.",
        "Add well-drained spinach and artichokes and cook at low heat briefly.",
        "Add cream, garlic herb cheese, salt, and pepper.",
        "Simmer until cheese is melted and mixture is blended.",
        "Remove from heat, and fold in the grated Parmesan cheese.",
        "Place on serving platter. Serve warm with tortilla chips, pita chips, or crackers."
      ),
      notes = "Extremely popular for family celebrations and holiday buffets.",
      tags = listOf("Appetizers", "Dips", "Spinach", "Artichokes")
    ),
    Recipe(
      id = "hummus_homemade",
      title = "Homemade Traditional Hummus",
      italianTitle = "Crema di Ceci",
      cookbookPage = 25,
      category = RecipeCategory.APPETIZERS,
      contributor = "Family Heritage",
      servings = "6 servings",
      prepTime = "10 mins",
      cookTime = "None",
      ingredients = listOf(
        RecipeIngredient("1 can (15 oz) garbanzo beans (chickpeas), drained and rinsed", "chickpeas"),
        RecipeIngredient("2 to 4 tbsp water", "water"),
        RecipeIngredient("2 tbsp extra virgin olive oil", "olive oil"),
        RecipeIngredient("1 tbsp lemon juice", "lemon juice"),
        RecipeIngredient("1 garlic clove, minced", "garlic"),
        RecipeIngredient("3/4 tsp ground cumin", "cumin"),
        RecipeIngredient("1/4 to 1/2 tsp salt", "salt")
      ),
      instructions = listOf(
        "Add garbanzo beans, 2 tbsp water, olive oil, lemon juice, garlic, cumin, and 1/4 tsp salt to a food processor.",
        "Process until smooth and creamy.",
        "If needed, add additional water to thin out hummus and salt to taste.",
        "Store covered in the refrigerator and drizzle with olive oil before serving."
      ),
      notes = "Silky smooth chickpea spread that pairs wonderfully with crusty bread.",
      tags = listOf("Appetizers", "Dips", "Vegetarian", "Healthy")
    )
  )
}
