package com.example.data.repository

import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory
import com.example.data.model.RecipeIngredient

object CookbookDataSourceVegBreads {
  val recipes = listOf(
    Recipe(
      id = "milanese_saffron_risotto",
      title = "Milanese Saffron Risotto",
      italianTitle = "Risotto alla Milanese con Zafferano",
      cookbookPage = 81,
      category = RecipeCategory.RICE_AND_RISOTTO,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "10 mins",
      cookTime = "25 mins",
      ingredients = listOf(
        RecipeIngredient("1 1/2 cups (300 g) Arborio or Carnaroli rice", "arborio rice"),
        RecipeIngredient("5 cups (1 litre) chicken or beef broth, simmering", "broth"),
        RecipeIngredient("1/2 cup (120 cc) dry white wine", "white wine"),
        RecipeIngredient("1/4 teaspoon saffron powder or threads", "saffron"),
        RecipeIngredient("1 medium onion, very finely chopped", "onion"),
        RecipeIngredient("3 + 2 tablespoons butter", "butter"),
        RecipeIngredient("4 oz Parmigiano Reggiano cheese, freshly grated", "parmesan"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Warm broth to a simmer. Dissolve saffron in 1/2 cup warm broth and set aside.",
        "In a saucepan, melt 3 tbsp butter over medium heat. Add finely chopped onion and sauté until soft and translucent.",
        "Add Arborio rice; toast and stir 2 minutes until translucent with a chalky core.",
        "Add white wine and stir until completely evaporated.",
        "Add simmering broth one ladle at a time, stirring constantly and allowing rice to absorb liquid before adding more.",
        "After about 10 minutes, stir in the saffron-infused broth.",
        "Continue adding broth until rice is tender and creamy yet al dente (about 18-20 minutes total).",
        "Mantecatura: Turn off heat, stir in remaining 2 tbsp butter and grated Parmigiano Reggiano. Cover 2 minutes and serve."
      ),
      notes = "Saffron gives the signature golden yellow color and floral aroma. Never rinse Arborio rice!",
      tags = listOf("Risotto", "Saffron", "Rice", "Milanese", "Gluten Free")
    ),
    Recipe(
      id = "asparagus_risotto",
      title = "Asparagus Risotto",
      italianTitle = "Risotto con gli Asparagi",
      cookbookPage = 81,
      category = RecipeCategory.RICE_AND_RISOTTO,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "15 mins",
      cookTime = "25 mins",
      ingredients = listOf(
        RecipeIngredient("1 1/2 cups (300 g) Arborio rice", "arborio rice"),
        RecipeIngredient("1 lb (450 g) fresh asparagus, woody ends trimmed", "asparagus"),
        RecipeIngredient("5 cups vegetable broth, hot", "vegetable broth"),
        RecipeIngredient("1/2 cup white wine", "white wine"),
        RecipeIngredient("4 oz (100 g) onion, finely chopped", "onion"),
        RecipeIngredient("2 tbsp olive oil and 4 tbsp butter", "butter"),
        RecipeIngredient("4-5 tbsp Parmigiano Reggiano, grated", "parmesan"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Slice asparagus stems into rounds, keeping the tender tips whole for later.",
        "Heat olive oil and 2 tbsp butter in a heavy saucepan; sauté onion until soft.",
        "Add Arborio rice and toast for 2 minutes. Pour in white wine and stir until absorbed.",
        "Add sliced asparagus stems and first ladle of hot broth.",
        "Continue adding hot broth gradually, stirring constantly as rice absorbs liquid.",
        "After 12 minutes, add the tender asparagus tips to the pot.",
        "When rice reaches al dente (approx 18 minutes), turn off heat and stir in remaining butter and Parmigiano.",
        "Rest covered for 2 minutes, then serve warm."
      ),
      notes = "Springtime family favorite. Adding the tips late keeps them bright green and tender-crisp.",
      tags = listOf("Risotto", "Asparagus", "Vegetarian", "Spring")
    ),
    Recipe(
      id = "eggplant_caponata",
      title = "Eggplant Caponata",
      italianTitle = "Caponata Siciliana di Melanzane",
      cookbookPage = 57,
      category = RecipeCategory.VEGETABLES,
      contributor = "Traditional Family Heritage",
      servings = "6 servings",
      prepTime = "20 mins",
      cookTime = "30 mins",
      ingredients = listOf(
        RecipeIngredient("2 lbs (900 g) eggplant, cut into 3/4-inch dice", "eggplant"),
        RecipeIngredient("1 lb (450 g) celery, boiled and diced", "celery"),
        RecipeIngredient("1/2 lb (225 g) onion, diced", "onion"),
        RecipeIngredient("2 garlic cloves, diced", "garlic"),
        RecipeIngredient("1 cup (230 g) tomatoes, pureed", "tomatoes"),
        RecipeIngredient("6 oz (180 g) Sicilian green olives, pitted", "olives"),
        RecipeIngredient("4 tbsp capers in salt, rinsed and drained", "capers"),
        RecipeIngredient("2 tablespoons sugar", "sugar"),
        RecipeIngredient("3-4 tablespoons red wine vinegar", "vinegar"),
        RecipeIngredient("4-5 fresh basil leaves", "basil"),
        RecipeIngredient("Olive oil for frying and sautéing", "olive oil")
      ),
      instructions = listOf(
        "Boil celery sticks for 6-7 minutes until tender; dice finely.",
        "In a saucepan, heat 4 tbsp olive oil, sauté garlic, onion, and red pepper flakes until soft.",
        "Add pureed tomatoes, basil, olives, and capers. Simmer for 10 minutes and set aside.",
        "In a separate large frying pan, fry diced eggplant in hot oil until golden brown (8-10 mins). Add a pinch of salt.",
        "Transfer fried eggplant and cooked celery into the tomato mixture.",
        "Whisk sugar and vinegar in a small bowl until dissolved, then stir into the pan.",
        "Cover and cook 5 minutes until thick and glossy.",
        "Transfer to a dish and let cool. Caponata tastes best the next day served lukewarm as an antipasto or side."
      ),
      notes = "The sweet and sour (agrodolce) glaze creates an extraordinary balance with the creamy fried eggplant.",
      tags = listOf("Vegetables", "Antipasto", "Eggplant", "Sicilian", "Vegetarian")
    ),
    Recipe(
      id = "eggplant_rollatini",
      title = "Eggplant Rollatini",
      italianTitle = "Involtini di Melanzane con Ricotta e Prosciutto",
      cookbookPage = 58,
      category = RecipeCategory.VEGETABLES,
      contributor = "Family Heritage",
      servings = "6 servings",
      prepTime = "25 mins",
      cookTime = "25 mins",
      ingredients = listOf(
        RecipeIngredient("1 large eggplant, sliced lengthwise into 1/4 inch slices", "eggplant"),
        RecipeIngredient("1 egg, beaten", "eggs"),
        RecipeIngredient("1 cup Italian seasoned breadcrumbs", "breadcrumbs"),
        RecipeIngredient("1 cup ricotta cheese", "ricotta"),
        RecipeIngredient("10 slices prosciutto", "prosciutto"),
        RecipeIngredient("2 cups shredded mozzarella cheese", "mozzarella"),
        RecipeIngredient("1 jar (14 oz) spaghetti sauce", "tomato sauce"),
        RecipeIngredient("Olive oil for frying", "olive oil")
      ),
      instructions = listOf(
        "Dip eggplant slices in beaten egg, then coat thoroughly with breadcrumbs.",
        "Fry eggplant slices in olive oil over medium-high heat until golden brown on both sides. Drain on paper towels.",
        "Preheat oven to 350°F.",
        "Spread a thin layer of ricotta cheese onto each fried eggplant slice, then top with a slice of prosciutto.",
        "Roll up tightly and arrange seam side down in a 9x13 inch baking dish.",
        "Pour tomato sauce over rolls and cover generously with shredded mozzarella.",
        "Bake for 15 minutes until cheese is melted, bubbling, and golden brown.",
        "Serve rolls hot as a main course or side dish."
      ),
      notes = "Can be served alongside tender angel hair pasta for a complete Sunday meal.",
      tags = listOf("Vegetables", "Eggplant", "Ricotta", "Prosciutto", "Mozzarella")
    ),
    Recipe(
      id = "rosina_stuffed_peppers",
      title = "Rosina’s Stuffed Peppers",
      italianTitle = "Peperoni Ripieni di Nonna Rosina",
      cookbookPage = 61,
      category = RecipeCategory.VEGETABLES,
      contributor = "Nonna Rosina Ruffolo",
      servings = "8 servings",
      prepTime = "30 mins",
      cookTime = "45 mins",
      ingredients = listOf(
        RecipeIngredient("9 medium-sized green peppers", "green peppers"),
        RecipeIngredient("11 oz rice, parboiled for 10 minutes", "rice"),
        RecipeIngredient("1/2 cup cooked lean ground beef", "ground beef"),
        RecipeIngredient("1/2 cup grated Parmesan cheese", "parmesan"),
        RecipeIngredient("2 1/2 cups diced ripe tomatoes", "tomatoes"),
        RecipeIngredient("1 anchovy in oil, chopped", "anchovies"),
        RecipeIngredient("2 tbsp chopped parsley and 2 tbsp fresh basil", "basil"),
        RecipeIngredient("1/4 tsp nutmeg", "nutmeg"),
        RecipeIngredient("1/4 cup olive oil", "olive oil"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Wash peppers and set one aside. Cut around stems of 8 peppers and remove seeds and membranes.",
        "Cut out 8 little circles from the reserved pepper to plug the stem holes so filling won't spill.",
        "Parboil rice in salted water for 10 minutes, drain and cool.",
        "In a bowl, combine cooked ground beef, rice, olive oil, Parmesan, parsley, basil, chopped anchovy, nutmeg, and half the tomatoes.",
        "Stuff peppers upside down with rice mixture and cover holes with pepper circles.",
        "Arrange stuffed peppers side by side in a baking dish. Spoon remaining diced tomatoes over top.",
        "Drizzle with olive oil, season with salt, and bake at 350°F for 45 minutes.",
        "Delicious hot or cold the next day."
      ),
      notes = "Nonna Rosina's signature technique of cutting small pepper plugs keeps the savory filling sealed inside.",
      tags = listOf("Vegetables", "Nonna Rosina", "Peppers", "Rice", "Family Classic")
    ),
    Recipe(
      id = "sauteed_rapini",
      title = "Sautéed Rapini (Broccoletti Ripassati)",
      italianTitle = "Broccoletti Ripassati in Padella",
      cookbookPage = 65,
      category = RecipeCategory.VEGETABLES,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "10 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("2 bunches fresh rapini (broccoli rabe)", "rapini"),
        RecipeIngredient("2 garlic cloves, coarsely diced", "garlic"),
        RecipeIngredient("3-4 tbsp extra-virgin olive oil", "olive oil"),
        RecipeIngredient("Crushed red pepper flakes to taste", "red pepper flakes"),
        RecipeIngredient("Salt to taste", "salt")
      ),
      instructions = listOf(
        "Pull and discard tough outer leaves. Cut hard stem base; slice remaining stems in half into 4-inch lengths.",
        "Wash rapini thoroughly in fresh water and drain.",
        "To eliminate part of the natural bitterness, drop briefly in boiling salted water for 2 minutes, then drain.",
        "In a large sauté pan, heat olive oil, garlic, and crushed red pepper over medium heat (do not let garlic brown).",
        "Add rapini to the pan, cover with lid, and sauté for 10 minutes, stirring occasionally.",
        "Season with salt to taste and serve hot or lukewarm."
      ),
      notes = "The quintessential Calabrese green side dish. A staple for sausage dinners and holiday menus.",
      tags = listOf("Vegetables", "Rapini", "Garlic", "Spicy", "Vegetarian", "Keto")
    ),
    Recipe(
      id = "rapini_and_sausages",
      title = "Rapini and Italian Sausages",
      italianTitle = "Salsicce e Friarielli (Broccoletti)",
      cookbookPage = 66,
      category = RecipeCategory.MEATS,
      contributor = "Family Heritage",
      servings = "4 servings",
      prepTime = "15 mins",
      cookTime = "25 mins",
      ingredients = listOf(
        RecipeIngredient("10 ounces sweet Italian sausage links", "italian sausage"),
        RecipeIngredient("1 pound bunch fresh rapini", "rapini"),
        RecipeIngredient("6 whole garlic cloves, smashed", "garlic"),
        RecipeIngredient("3 tablespoons olive oil", "olive oil"),
        RecipeIngredient("1/4 teaspoon hot pepper flakes", "red pepper flakes"),
        RecipeIngredient("1 tablespoon water, salt and black pepper", "salt")
      ),
      instructions = listOf(
        "Preheat oven to 500°F. Prick sausages with a fork and bake in skillet for 15 minutes, turning occasionally. Cool and slice.",
        "Clean rapini, removing tough outer stems. Split stems in half.",
        "In a 4-5 quart pot, sauté smashed garlic gently in olive oil until golden.",
        "Add trimmed rapini, salt, pepper flakes, black pepper, and 1 tbsp water.",
        "Cover tightly and cook 5 to 7 minutes until tender.",
        "Add sliced cooked sausages to the rapini, toss together over heat for 2 minutes, and serve immediately."
      ),
      notes = "The bitter-almond notes of rapini perfectly offset the sweet fennel and pork in the sausage.",
      tags = listOf("Meats", "Sausage", "Rapini", "Comfort Food", "Keto")
    ),
    Recipe(
      id = "uova_in_purgatorio",
      title = "Eggs in Purgatory",
      italianTitle = "Uova in Purgatorio",
      cookbookPage = 187,
      category = RecipeCategory.EGGS,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "10 mins",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("4 large eggs", "eggs"),
        RecipeIngredient("28 ounce can chopped tomatoes", "tomatoes"),
        RecipeIngredient("1 red bell pepper, coarsely chopped", "bell pepper"),
        RecipeIngredient("1 small yellow onion, thinly sliced", "onion"),
        RecipeIngredient("1 garlic clove, crushed", "garlic"),
        RecipeIngredient("3 tbsp olive oil", "olive oil"),
        RecipeIngredient("Generous pinch red pepper flakes", "red pepper flakes"),
        RecipeIngredient("5-8 fresh basil leaves, torn", "basil"),
        RecipeIngredient("3-4 tbsp grated Parmigiano or Romano cheese", "parmesan"),
        RecipeIngredient("Crusty bread for dipping", "bread")
      ),
      instructions = listOf(
        "In a wide skillet with lid, heat olive oil over medium-low; sauté onion, garlic, red pepper, and chili flakes for 10 minutes until soft.",
        "Stir in chopped tomatoes, bring to a simmer, and cook uncovered 15 minutes until rich and thickened.",
        "Use the back of a spoon to carve 4 deep wells in the simmering sauce.",
        "Crack an egg into each well; season each with a pinch of salt.",
        "Cover pan and gently cook for 2 to 3 minutes until egg whites are set and yolks remain golden and runny.",
        "Remove from heat, shower with torn fresh basil and grated Parmigiano cheese.",
        "Serve immediately right out of the skillet with thick slices of country bread."
      ),
      notes = "An absolute family comfort food classic. Dipping crusty warm bread into the runny yolk and spicy sugo is heaven.",
      tags = listOf("Eggs", "Breakfast", "Tomatoes", "Quick", "Vegetarian")
    ),
    Recipe(
      id = "asparagus_frittata",
      title = "Asparagus Frittata",
      italianTitle = "Frittata con Asparagi",
      cookbookPage = 189,
      category = RecipeCategory.EGGS,
      contributor = "Traditional Family Heritage",
      servings = "4-6 servings",
      prepTime = "10 mins",
      cookTime = "12 mins",
      ingredients = listOf(
        RecipeIngredient("6 large eggs", "eggs"),
        RecipeIngredient("1/2 pound fresh asparagus, cut in 1/2-inch pieces", "asparagus"),
        RecipeIngredient("4 oz grated Parmigiano Reggiano", "parmesan"),
        RecipeIngredient("2 tbsp extra virgin olive oil", "olive oil"),
        RecipeIngredient("1/4 cup dry breadcrumbs (for firmer frittata)", "breadcrumbs"),
        RecipeIngredient("1/4 tsp sea salt and 1/8 tsp black pepper", "salt")
      ),
      instructions = listOf(
        "Boil cut asparagus in salted water for 3 minutes; drain thoroughly.",
        "In a bowl, beat eggs with salt, pepper, grated Parmigiano, and breadcrumbs.",
        "In a 9-inch skillet, heat olive oil over medium heat. Sauté asparagus for 2 minutes.",
        "Pour egg mixture over asparagus, stirring gently for 2 minutes to distribute.",
        "Cook until bottom is golden brown (about 6 minutes).",
        "Place a flat plate over the skillet, flip pan and plate together, and slide frittata back into the skillet to finish cooking the other side.",
        "Slide onto a platter, cut into wedges, and serve warm or at room temperature."
      ),
      notes = "The plate-flip technique ensures an evenly golden, tender frittata without tearing.",
      tags = listOf("Eggs", "Frittata", "Asparagus", "Vegetarian", "Quick")
    ),
    Recipe(
      id = "rosina_pizza_dough",
      title = "Rosina’s Authentic Pizza Dough",
      italianTitle = "Pasta per la Pizza di Nonna Rosina",
      cookbookPage = 204,
      category = RecipeCategory.BREADS_AND_PIZZA,
      contributor = "Nonna Rosina Ruffolo",
      servings = "3 large pizzas",
      prepTime = "20 mins (+ 1 hr rise)",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("3 cups lukewarm water", "water"),
        RecipeIngredient("3 tbsp instant yeast", "yeast"),
        RecipeIngredient("1/2 cup olive oil (or rendered pork fat)", "olive oil"),
        RecipeIngredient("9 cups flour", "flour"),
        RecipeIngredient("2 1/2 tbsp salt", "salt"),
        RecipeIngredient("Pinch of white pepper", "white pepper")
      ),
      instructions = listOf(
        "Mix olive oil and lukewarm water in a large bowl.",
        "Combine flour, salt, white pepper, and yeast; blend into oil and water.",
        "Knead until smooth and elastic. Place in large greased bowl, turn to coat, cover with tea towel until doubled.",
        "Punch down dough and knead four or five times.",
        "Divide and stretch dough onto baking sheets.",
        "Add toppings of choice (tomato sauce, mozzarella, mushrooms, pepperoni, fresh basil).",
        "Bake in a preheated hot oven at 425°F for 20 minutes until crust is crispy and golden."
      ),
      notes = "Nonna Rosina's secret touch of rendered pork fat or pure olive oil produces an airy, golden crust with unmatched flavor.",
      tags = listOf("Pizza", "Breads", "Nonna Rosina", "Baking", "Family Classic")
    ),
    Recipe(
      id = "focaccia_rosemary",
      title = "Focaccia with Rosemary",
      italianTitle = "Focaccia Tradizionale al Rosmarino",
      cookbookPage = 210,
      category = RecipeCategory.BREADS_AND_PIZZA,
      contributor = "Traditional Family Heritage",
      servings = "8-10 servings",
      prepTime = "25 mins (+ 2 hrs rise)",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("4 cups all-purpose flour", "flour"),
        RecipeIngredient("1 packet (7 g) dry active yeast", "yeast"),
        RecipeIngredient("Warm water (105°F)", "water"),
        RecipeIngredient("6 tbsp + extra extra-virgin olive oil", "olive oil"),
        RecipeIngredient("Fresh rosemary leaves", "rosemary"),
        RecipeIngredient("Coarse sea salt", "salt"),
        RecipeIngredient("1/2 tsp salt", "salt")
      ),
      instructions = listOf(
        "In a bowl combine flour, salt, yeast, and 6 tbsp olive oil. Slowly add warm water mixing with a fork until pliable dough forms.",
        "Knead on work surface for 10 minutes, shape into a ball, and let rise in a warm place covered for 1 hour.",
        "Work dough briefly, then press out onto a round 14-inch baking pan greased with olive oil.",
        "Poke deep dimples all over the dough with fingers. Let rise again for 1 hour.",
        "Brush generously with extra-virgin olive oil and sprinkle coarse sea salt.",
        "Bake in preheated oven at 450°F for 15-20 minutes.",
        "Halfway through baking, brush with olive oil and scatter fresh rosemary leaves on top.",
        "Bake until golden brown. Serve warm with sliced prosciutto and provolone."
      ),
      notes = "Dimpling the dough allows olive oil and salt to pool in pockets, creating iconic flavor bursts.",
      tags = listOf("Breads", "Focaccia", "Rosemary", "Olive Oil", "Baking")
    ),
    Recipe(
      id = "spinach_calzone",
      title = "Unbelievable Spinach Calzones",
      italianTitle = "Calzoni Ripieni di Spinaci e Ricotta",
      cookbookPage = 208,
      category = RecipeCategory.BREADS_AND_PIZZA,
      contributor = "Family Heritage",
      servings = "8 calzones",
      prepTime = "25 mins",
      cookTime = "30 mins",
      ingredients = listOf(
        RecipeIngredient("1 package (32 oz) pizza dough or bread dough, thawed", "pizza dough"),
        RecipeIngredient("1 container (15 oz) ricotta cheese", "ricotta"),
        RecipeIngredient("3 cups mozzarella cheese, shredded", "mozzarella"),
        RecipeIngredient("1 cup Parmesan cheese, freshly grated", "parmesan"),
        RecipeIngredient("1 package (10 oz) frozen chopped spinach, thawed and squeezed dry", "spinach"),
        RecipeIngredient("2 eggs", "eggs"),
        RecipeIngredient("2 tbsp dried Italian seasoning", "italian seasoning"),
        RecipeIngredient("Salt and pepper to taste", "salt"),
        RecipeIngredient("Marinara sauce for dipping", "marinara sauce")
      ),
      instructions = listOf(
        "Preheat oven to 400°F (200°C).",
        "In a large bowl, mix together ricotta, eggs, Italian seasoning, mozzarella, Parmesan, and well-squeezed spinach.",
        "Divide bread/pizza dough into 8 equal pieces.",
        "Roll each piece out to an 8-inch circle.",
        "Spoon about 1/2 cup of ricotta-spinach filling onto one half of each circle.",
        "Fold over into half-moons and crimp edges firmly with fork tines to seal.",
        "Place onto greased cookie sheets and bake for 30 minutes until golden brown.",
        "Serve hot with warm marinara dipping sauce."
      ),
      notes = "Calzones are classic Italian 'finger food' turnovers. Perfect for casual family gatherings.",
      tags = listOf("Breads", "Calzone", "Spinach", "Ricotta", "Mozzarella")
    )
  )
}
