package com.example.data.repository

import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory
import com.example.data.model.RecipeIngredient

object CookbookDataSourcePasta {
  val recipes = listOf(
    Recipe(
      id = "pasta_fresca",
      title = "Homemade Fresh Pasta",
      italianTitle = "Pasta Fresca all'Uovo",
      cookbookPage = 87,
      category = RecipeCategory.PASTA_AND_SAUCES,
      contributor = "Traditional Family Heritage",
      servings = "4-6 servings",
      prepTime = "30 mins",
      cookTime = "3-5 mins",
      ingredients = listOf(
        RecipeIngredient("3 cups (15 oz / 400 g) unbleached all-purpose flour", "flour"),
        RecipeIngredient("4 large eggs (golden farm yolk preferred)", "eggs"),
        RecipeIngredient("1 tablespoon extra-virgin olive oil", "olive oil"),
        RecipeIngredient("Pinch of salt (optional)", "salt")
      ),
      instructions = listOf(
        "Sift flour onto wooden board. Shape into a mound and hollow the center to form a deep well.",
        "Break eggs into hollow, add olive oil and pinch of salt.",
        "Using a fork, beat eggs together and gently draw flour in from the inner rim a little at a time until absorbed.",
        "Knead the dough pushing with palms, folding and turning for 8 to 10 minutes until smooth and elastic.",
        "Shape into a round ball, cover with a moistened cloth or plastic wrap, and rest for 30 to 60 minutes.",
        "Flatten by hand or pass through pasta machine from widest notch down to desired thinness.",
        "Fold and cut into Fettuccine (1/4 inch), Pappardelle (1 inch), Farfalle (pinched squares), or Lasagna sheets.",
        "Boil in abundant salted water for 3 to 5 minutes until perfectly al dente."
      ),
      notes = "The soul of Italian family Sundays. Golden egg yolks give authentic vibrancy and silky bite.",
      tags = listOf("Pasta", "Handmade", "Traditional", "Basics"),
      originalPhotoCaption = "Cutting board, rolling pin, and flattening pasta sheets by hand and machine",
      originalPhotoPage = 87
    ),
    Recipe(
      id = "spaghetti_carbonara",
      title = "Spaghetti alla Carbonara",
      italianTitle = "Spaghetti alla Carbonara Tradizionale",
      cookbookPage = 92,
      category = RecipeCategory.PASTA_AND_SAUCES,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "10 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("1 lb dry fettuccine noodles or spaghetti", "spaghetti"),
        RecipeIngredient("8 slices pancetta or bacon, diced", "pancetta"),
        RecipeIngredient("4 eggs", "eggs"),
        RecipeIngredient("1/4 cup Parmesan cheese, grated", "parmesan"),
        RecipeIngredient("1/4 cup Pecorino Romano cheese, grated", "pecorino"),
        RecipeIngredient("Freshly ground black pepper in abundance", "black pepper"),
        RecipeIngredient("2 tablespoons cream (optional)", "cream")
      ),
      instructions = listOf(
        "Bring a large pot of salted water to a boil. Add pasta and cook 8 to 10 minutes until al dente; reserve 1/2 cup pasta water, then drain.",
        "Fry pancetta/bacon in skillet over medium heat until crispy. Remove and drain on paper towel.",
        "Beat eggs, grated Parmesan, Pecorino, and black pepper in a warm bowl.",
        "Immediately toss hot drained pasta into the egg-cheese bowl. The heat of the pasta cooks the eggs into a luxurious cream.",
        "Add crisp pancetta with a spoonful of hot fat, and toss vigorously with tongs.",
        "Finish with abundant freshly cracked black pepper. Serve immediately."
      ),
      notes = "Carbonara means 'in the coal miner way' because Italians grind black pepper on top until it looks like coal.",
      tags = listOf("Pasta", "Classic", "Eggs", "Pancetta", "Pecorino")
    ),
    Recipe(
      id = "spaghetti_amatriciana",
      title = "Spaghetti all'Amatriciana",
      italianTitle = "Spaghetti all'Amatriciana con Guanciale",
      cookbookPage = 92,
      category = RecipeCategory.PASTA_AND_SAUCES,
      contributor = "Ornella Fusco",
      servings = "4 servings",
      prepTime = "10 mins",
      cookTime = "25 mins",
      ingredients = listOf(
        RecipeIngredient("12 oz spaghetti (or bucatini)", "spaghetti"),
        RecipeIngredient("1/2 cup pancetta or guanciale, diced", "pancetta"),
        RecipeIngredient("1 lb tomatoes, seeded and diced (or canned plum tomatoes)", "tomatoes"),
        RecipeIngredient("1 onion, thinly sliced", "onion"),
        RecipeIngredient("1 fresh chili pepper, chopped (or crushed red pepper)", "chili pepper"),
        RecipeIngredient("1 tbsp olive oil", "olive oil"),
        RecipeIngredient("1/4 cup Pecorino Romano cheese, freshly grated", "pecorino"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Add olive oil and diced pancetta to pan and cook over low heat until golden.",
        "Add sliced onion and cook 10 minutes until lightly browned.",
        "Add diced tomatoes and chili pepper; season with salt and pepper.",
        "Cover and simmer gently for 20 minutes until sauce thickens.",
        "Cook spaghetti in salted boiling water until al dente. Drain and toss in sauce.",
        "Top generously with grated Pecorino Romano and serve at once."
      ),
      notes = "Originated in the mountain town of Amatrice near Rome. Famous for combining cured pork with rich tomato tang.",
      tags = listOf("Pasta", "Pancetta", "Spicy", "Pecorino", "Roman")
    ),
    Recipe(
      id = "pasta_alla_gricia",
      title = "Pasta alla Gricia",
      italianTitle = "Pasta alla Gricia (White Amatriciana)",
      cookbookPage = 93,
      category = RecipeCategory.PASTA_AND_SAUCES,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "5 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("1 lb (450 g) pasta (bucatini, ziti, or spaghetti)", "pasta"),
        RecipeIngredient("4 oz (115 g) guanciale or pancetta, diced", "pancetta"),
        RecipeIngredient("1/4 cup (50 g) Pecorino Romano cheese, freshly grated", "pecorino"),
        RecipeIngredient("5 tablespoons extra-virgin olive oil", "olive oil"),
        RecipeIngredient("Crushed red pepper flakes", "red pepper flakes"),
        RecipeIngredient("Salt to taste", "salt")
      ),
      instructions = listOf(
        "Put olive oil in a skillet, add diced guanciale/pancetta and red pepper flakes.",
        "Fry over medium heat until bacon is golden brown and crispy.",
        "Cook pasta in abundant boiling salted water until al dente.",
        "Drain pasta, reserving 1/4 cup starchy pasta cooking water.",
        "Transfer pasta to skillet with bacon and fat, add cooking water and grated Pecorino Romano.",
        "Toss vigorously over low heat to form a glossy emulsified cheese coating. Serve hot."
      ),
      notes = "The historic Roman ancestor of Amatriciana and Carbonara. Simple, pure pork cheek and pecorino perfection.",
      tags = listOf("Pasta", "Roman", "Pancetta", "Pecorino", "Quick")
    ),
    Recipe(
      id = "penne_alla_vodka",
      title = "Penne alla Vodka",
      italianTitle = "Penne alla Vodka Cremosa",
      cookbookPage = 94,
      category = RecipeCategory.PASTA_AND_SAUCES,
      contributor = "Ornella Fusco",
      servings = "4 servings",
      prepTime = "10 mins",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("250 grams penne pasta", "penne"),
        RecipeIngredient("1 cup pancetta or bacon, cubed", "pancetta"),
        RecipeIngredient("1 oz vodka", "vodka"),
        RecipeIngredient("1/2 cup cream", "heavy cream"),
        RecipeIngredient("1 cup tomato sauce", "tomato sauce"),
        RecipeIngredient("1 onion, chopped", "onion"),
        RecipeIngredient("1 tbsp butter", "butter"),
        RecipeIngredient("2 tbsp grated Parmesan cheese", "parmesan"),
        RecipeIngredient("Salt, pepper & chili peppers", "salt")
      ),
      instructions = listOf(
        "In a skillet, sauté pancetta in olive oil and butter until lightly crisp.",
        "Add chopped onion and sauté until translucent.",
        "Add vodka and let it simmer until alcohol evaporates.",
        "Add tomato sauce and salt; simmer gently for 15 minutes.",
        "Stir in cream, chili, and black pepper. Set aside.",
        "Cook penne in boiling salted water for 8 minutes until al dente.",
        "Drain pasta, add to sauce, and toss over heat for 1 minute. Top with grated Parmesan."
      ),
      notes = "Silky and luscious with a delicate pink blush from the tomato and cream reduction.",
      tags = listOf("Pasta", "Creamy", "Pancetta", "Vodka", "Entertaining")
    ),
    Recipe(
      id = "pesto_sauce_fresh",
      title = "Classic Genovese Pesto Sauce",
      italianTitle = "Pesto alla Genovese",
      cookbookPage = 94,
      category = RecipeCategory.PASTA_AND_SAUCES,
      contributor = "Family Heritage",
      servings = "4-6 servings",
      prepTime = "10 mins",
      cookTime = "None",
      ingredients = listOf(
        RecipeIngredient("2 cups fresh basil leaves, washed & dried", "basil"),
        RecipeIngredient("3 large cloves garlic", "garlic"),
        RecipeIngredient("3/4 cup pine nuts, lightly toasted", "pine nuts"),
        RecipeIngredient("3/4 cup extra-virgin olive oil", "olive oil"),
        RecipeIngredient("3/4 cup Parmesan cheese, freshly grated", "parmesan"),
        RecipeIngredient("1/2 tsp salt and 1/4 tsp pepper", "salt")
      ),
      instructions = listOf(
        "Spread pine nuts in a dry skillet over moderate heat; toast lightly until fragrant and golden.",
        "Place basil, garlic, toasted pine nuts, and olive oil in food processor fitted with metal blade.",
        "Process until fairly smooth, scraping down sides.",
        "Add grated cheese, salt, and pepper; pulse briefly to combine.",
        "Toss with hot pasta (linguine or trofie) along with 2 tbsp hot pasta water. Freeze remainder in ice cube trays!"
      ),
      notes = "S. Vitale's tip: Freeze pesto cubes in ice trays and store in freezer bags for year-round fresh garden flavor.",
      tags = listOf("Sauces", "Basil", "Pesto", "Vegetarian", "Pantry")
    ),
    Recipe(
      id = "pasta_cacio_e_pepe",
      title = "Romano Cheese & Black Pepper Pasta",
      italianTitle = "Pasta Cacio e Pepe",
      cookbookPage = 100,
      category = RecipeCategory.PASTA_AND_SAUCES,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "5 mins",
      cookTime = "10 mins",
      ingredients = listOf(
        RecipeIngredient("1 lb (450 g) spaghetti", "spaghetti"),
        RecipeIngredient("1/2 cup Pecorino Romano cheese, freshly grated", "pecorino"),
        RecipeIngredient("Generous freshly ground black pepper from the mill", "black pepper"),
        RecipeIngredient("Salt to taste", "salt")
      ),
      instructions = listOf(
        "In a serving bowl, mix grated Pecorino Romano cheese and very generous freshly cracked black pepper.",
        "Cook spaghetti in abundant salted water until al dente.",
        "Before draining, reserve 1/2 cup of starchy boiling water.",
        "Drain pasta without shaking too much so it stays moist. Dump immediately over the cheese and pepper in bowl.",
        "Add 2 to 3 tablespoons of hot cooking water and toss vigorously. The heat creates a velvety sauce.",
        "Serve immediately while piping hot."
      ),
      notes = "Essential Roman classic. The pasta must be very hot to melt the pecorino into a smooth fondue.",
      tags = listOf("Pasta", "Quick", "Roman", "Pecorino", "Vegetarian")
    ),
    Recipe(
      id = "pasta_puttanesca",
      title = "Pasta alla Puttanesca",
      italianTitle = "Pasta alla Puttanesca (Anchovy, Olives & Tomato)",
      cookbookPage = 102,
      category = RecipeCategory.PASTA_AND_SAUCES,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "10 mins",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("1 lb (450 g) spaghetti or bucatini", "spaghetti"),
        RecipeIngredient("1 1/2 cups red ripe tomatoes, diced (or plum tomatoes)", "tomatoes"),
        RecipeIngredient("4 anchovy fillets, chopped", "anchovies"),
        RecipeIngredient("2 oz (60 g) Gaeta or black olives, pitted", "olives"),
        RecipeIngredient("1 tbsp capers in salt, rinsed & drained", "capers"),
        RecipeIngredient("2 garlic cloves, sliced", "garlic"),
        RecipeIngredient("4 tbsp extra-virgin olive oil", "olive oil"),
        RecipeIngredient("2 tbsp fresh parsley, chopped", "parsley"),
        RecipeIngredient("Red pepper flakes and sea salt to taste", "red pepper flakes")
      ),
      instructions = listOf(
        "In a saucepan over medium heat, heat olive oil with garlic and red pepper flakes.",
        "Add anchovy fillets and stir until dissolved (do not burn garlic or anchovies).",
        "Add diced tomatoes, capers, olives, and 3/4 of the chopped parsley.",
        "Simmer on low heat for 15 to 20 minutes until thick and aromatic.",
        "Cook pasta al dente in salted boiling water; drain.",
        "Dress pasta with the sauce, toss well, and garnish with remaining parsley. Serve hot."
      ),
      notes = "Bold Neapolitan sauce brimming with briny olives, salty capers, and sweet tomatoes.",
      tags = listOf("Pasta", "Seafood", "Olives", "Tomatoes", "Spicy")
    ),
    Recipe(
      id = "gnocchi_alla_rosina",
      title = "Gnocchi alla Rosina",
      italianTitle = "Gnocchi di Patate Tradizionali",
      cookbookPage = 106,
      category = RecipeCategory.BAKED_PASTA,
      contributor = "Nonna Rosina Ruffolo",
      servings = "6 servings",
      prepTime = "40 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("2 lbs potatoes (old Russet potatoes)", "potatoes"),
        RecipeIngredient("2 3/4 cups all-purpose flour", "flour"),
        RecipeIngredient("1 egg", "eggs"),
        RecipeIngredient("1 tsp salt", "salt"),
        RecipeIngredient("Pinch of nutmeg (optional)", "nutmeg")
      ),
      instructions = listOf(
        "Cook unpeeled potatoes in boiling salted water until tender. Drain, peel, and mash hot through a food mill or potato masher.",
        "Place mashed potatoes in a bowl, let cool slightly, then stir in flour, salt, and egg.",
        "Knead dough on a floured surface until smooth, elastic, and non-sticky. (Add flour sparingly as needed).",
        "Shape dough into long ropes (3/8-inch diameter). Cut ropes into 1 1/4-inch lengths.",
        "Press each gnocchi against fork tines or a 'crivo' with two fingers to form ridged ruffles with a hollow back.",
        "Drop gnocchi into rapidly boiling salted water in batches. When they float to the surface (1-2 mins), lift out with a slotted spoon.",
        "Serve hot with homemade tomato meat sauce or browned butter and sage."
      ),
      notes = "Nonna Rosina's tip: Drop one test gnocchi into boiling water first. If it holds shape and floats, dough is ready; if it falls apart, knead in a tiny bit more flour.",
      tags = listOf("Pasta", "Gnocchi", "Nonna Rosina", "Potatoes", "Family Classic"),
      originalPhotoCaption = "Work dough until smooth and elastic. Shape dough into long ropes and roll on gnocchi board",
      originalPhotoPage = 106
    ),
    Recipe(
      id = "cannelloni_balsamella",
      title = "Cannelloni with Balsamella White Sauce",
      italianTitle = "Cannelloni con la Balsamella",
      cookbookPage = 105,
      category = RecipeCategory.BAKED_PASTA,
      contributor = "Traditional Family Heritage",
      servings = "8 servings",
      prepTime = "30 mins",
      cookTime = "40 mins",
      ingredients = listOf(
        RecipeIngredient("20 dry no-boil cannelloni (manicotti shells)", "cannelloni"),
        RecipeIngredient("2 1/2 lb ground beef (or mix of beef and pork)", "ground beef"),
        RecipeIngredient("3 oz (90 g) plus 2 1/2 oz Parmigiano Reggiano, grated", "parmesan"),
        RecipeIngredient("4 1/2 oz butter", "butter"),
        RecipeIngredient("5 1/2 oz flour", "flour"),
        RecipeIngredient("5 1/3 cups milk", "milk"),
        RecipeIngredient("Pinch of ground nutmeg", "nutmeg"),
        RecipeIngredient("2 tbsp olive oil, salt and pepper", "olive oil")
      ),
      instructions = listOf(
        "Prepare Balsamella: Melt butter in saucepan, whisk in flour, gradually stream in milk stirring constantly until boiling and thickened. Stir in nutmeg, salt, and Parmesan.",
        "In skillet, brown ground meat with olive oil, salt, and pepper. Process meat finely in food processor.",
        "Blend 4 tbsp white sauce, nutmeg, and Parmigiano into meat until soft compound forms.",
        "Preheat oven to 350°F. Spread 1/2 cup white sauce in bottom of baking pan (11x14 inch).",
        "Stuff cannelloni tubes with meat filling and arrange in pan side by side.",
        "Pour remaining white sauce evenly over cannelloni and sprinkle with grated Parmigiano.",
        "Cover with foil and bake 30 minutes. Uncover and bake 5-10 minutes until golden."
      ),
      notes = "A holiday and Sunday classic. Creamy white balsamella pairs gloriously with tender seasoned meat.",
      tags = listOf("Baked Pasta", "Cannelloni", "Ground Beef", "Balsamella", "Feast")
    ),
    Recipe(
      id = "meat_lasagna",
      title = "Traditional Meat Lasagna",
      italianTitle = "Lasagne al Forno con Sugo di Carne",
      cookbookPage = 108,
      category = RecipeCategory.BAKED_PASTA,
      contributor = "Traditional Family Heritage",
      servings = "10 servings",
      prepTime = "45 mins",
      cookTime = "1 hr",
      ingredients = listOf(
        RecipeIngredient("1 box lasagna noodles, cooked al dente", "lasagna noodles"),
        RecipeIngredient("1 1/2 lb lean ground beef", "ground beef"),
        RecipeIngredient("Italian sausage, cooked and sliced", "italian sausage"),
        RecipeIngredient("1 can (7 oz) tomato paste", "tomato paste"),
        RecipeIngredient("56 oz jar/cans peeled Italian tomatoes", "tomatoes"),
        RecipeIngredient("1 medium onion and 2 cloves garlic, minced", "onion"),
        RecipeIngredient("Ricotta cheese", "ricotta"),
        RecipeIngredient("Mozzarella cheese, grated", "mozzarella"),
        RecipeIngredient("Parmesan cheese, grated", "parmesan"),
        RecipeIngredient("Cooked eggs, sliced or grated (traditional)", "eggs"),
        RecipeIngredient("Basil, oregano, thyme, parsley, nutmeg, salt, pepper", "herbs")
      ),
      instructions = listOf(
        "Brown ground beef in skillet and drain. Sauté onion and garlic in oil, add tomato paste and crushed tomatoes with herbs. Simmer meat sauce 1.5 to 2 hours.",
        "Preheat oven to 350°F. Boil lasagna noodles until al dente.",
        "Spread a thin layer of sauce in bottom of 10x14 inch lasagna pan.",
        "Cover with flat layer of noodles, then layer ricotta, sliced sausage, sliced hard-boiled eggs, mozzarella, and meat sauce.",
        "Repeat layers ending with noodles, sauce, and generous Parmesan cheese on top.",
        "Bake for 45 minutes until bubbly and golden. Cool 10 minutes before slicing."
      ),
      notes = "The quintessential Ruffolo-Vitale holiday centerpiece. Prepare a day ahead for maximum flavor development.",
      tags = listOf("Baked Pasta", "Lasagna", "Beef", "Sausage", "Ricotta", "Family Classic")
    ),
    Recipe(
      id = "ravioli_spinach_ricotta",
      title = "Ravioli Stuffed with Spinach & Ricotta",
      italianTitle = "Ravioli di Magro con Burro e Salvia",
      cookbookPage = 115,
      category = RecipeCategory.BAKED_PASTA,
      contributor = "Traditional Family Heritage",
      servings = "6 servings",
      prepTime = "45 mins",
      cookTime = "5 mins",
      ingredients = listOf(
        RecipeIngredient("1 recipe fresh pasta dough (3 cups flour, 4 eggs, 1 tbsp olive oil)", "pasta dough"),
        RecipeIngredient("1 lb (450 g) fresh spinach, boiled and squeezed dry", "spinach"),
        RecipeIngredient("1 lb (450 g) ricotta cheese, thoroughly drained", "ricotta"),
        RecipeIngredient("4 oz (115 g) Parmigiano Reggiano, grated", "parmesan"),
        RecipeIngredient("1 egg", "eggs"),
        RecipeIngredient("Pinch of grated nutmeg, salt and pepper", "nutmeg"),
        RecipeIngredient("4 oz unsalted butter and 10 fresh sage leaves", "butter")
      ),
      instructions = listOf(
        "Boil spinach in salted water. Squeeze in cheesecloth until completely dry, then chop finely.",
        "Combine chopped spinach, drained ricotta, egg, Parmigiano, salt, pepper, and generous pinch of nutmeg.",
        "Roll out fresh pasta dough into two thin matching sheets.",
        "Place 1 teaspoon portions of filling spaced 2 inches apart on first dough sheet.",
        "Cover with second sheet, press air out around fillings, and cut with pastry wheel into squares.",
        "Drop ravioli into boiling salted water; cook 3-4 minutes until al dente. Lift with slotted spoon.",
        "Toss in skillet with melted foaming butter and fresh sage leaves. Top with grated cheese."
      ),
      notes = "Draining spinach and ricotta thoroughly is essential to prevent ravioli from opening during boiling.",
      tags = listOf("Pasta", "Handmade", "Spinach", "Ricotta", "Vegetarian")
    ),
    Recipe(
      id = "ukrainian_perogies",
      title = "Ukrainian Perogies (Pyrohy)",
      italianTitle = "Perogies Tradizionali",
      cookbookPage = 117,
      category = RecipeCategory.BAKED_PASTA,
      contributor = "Georgina V.",
      servings = "8 servings (about 50 perogies)",
      prepTime = "45 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("2 cups flour, 1 tsp salt, 1 egg, 1 tbsp oil, 1/2 cup water", "flour"),
        RecipeIngredient("2 cups mashed potatoes", "potatoes"),
        RecipeIngredient("1 cup cottage cheese or cream cheese", "cheese"),
        RecipeIngredient("1 large onion, chopped & sautéed in 1/2 cup butter", "onion"),
        RecipeIngredient("Pork rinds or bacon, crumbled", "bacon"),
        RecipeIngredient("Sour cream to serve", "sour cream"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Mix flour, salt, egg, oil, and water into a medium soft dough. Knead lightly; rest covered 10 minutes.",
        "Mix mashed potatoes with sautéed buttered onions, cheese, salt, and pepper until thick.",
        "Roll dough out thin, cut 2.5-inch rounds with a glass. Spoon filling in center, fold into half moon, and pinch edges firmly.",
        "Drop perogies into rapidly boiling water; cook 3-4 minutes until they float to the surface.",
        "Remove gently, drain, and coat in melted butter, sautéed onions, and fried bacon. Serve with sour cream."
      ),
      notes = "A beloved heritage recipe passed on through Georgina V. Cherished for holiday and family dinners.",
      tags = listOf("Dumplings", "Potatoes", "Cheese", "Heritage", "Comfort Food")
    )
  )
}
