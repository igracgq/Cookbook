package com.example.data.repository

import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory
import com.example.data.model.RecipeIngredient

object CookbookDataSourceSoups {
  val recipes = listOf(
    Recipe(
      id = "brodo_di_carne",
      title = "Meat Broth",
      italianTitle = "Brodo di Carne",
      cookbookPage = 29,
      category = RecipeCategory.SOUPS,
      contributor = "Traditional Family Heritage",
      servings = "8 servings",
      prepTime = "15 mins",
      cookTime = "2 hrs",
      ingredients = listOf(
        RecipeIngredient("2 lbs (1 kg) meat for broth, cut in large chunks (beef bones, turkey, chicken)", "beef bones"),
        RecipeIngredient("1 whole large onion", "onion"),
        RecipeIngredient("2-3 cloves garlic", "garlic"),
        RecipeIngredient("1 whole large carrot", "carrots"),
        RecipeIngredient("2 celery stalks", "celery"),
        RecipeIngredient("1 bunch Italian parsley", "parsley"),
        RecipeIngredient("1 whole tomato", "tomatoes"),
        RecipeIngredient("4-5 black peppercorns", "black pepper"),
        RecipeIngredient("1 bay leaf", "bay leaf"),
        RecipeIngredient("Pinch of nutmeg", "nutmeg"),
        RecipeIngredient("1 tablespoon salt", "salt")
      ),
      instructions = listOf(
        "Place the meats in a large stockpot and fill the pot with cold water.",
        "Stick the cloves on the surface of the onion.",
        "Add into the pot the onion, carrot, celery, parsley, tomato, peppercorns, and bay leaf. Season with nutmeg and salt.",
        "Bring water to a boil. When boiling, skim away the foam that forms on surface with a slotted spoon. Cook until meat is tender.",
        "Remove meat and set aside for another dish.",
        "Filter broth through a fine strainer to clarify it. Let cool at room temperature.",
        "When cold, skim off the solidified surface fat. Use as base for soups, risotto, tortellini, or pasta."
      ),
      notes = "The golden foundation of traditional Italian holiday soups and risotto.",
      tags = listOf("Soups", "Broth", "Foundation", "Comfort Food")
    ),
    Recipe(
      id = "italian_wedding_soup",
      title = "Italian Wedding Soup",
      italianTitle = "Minestra Maritata",
      cookbookPage = 31,
      category = RecipeCategory.SOUPS,
      contributor = "Traditional Family Heritage",
      servings = "8 servings",
      prepTime = "30 mins",
      cookTime = "2 hrs",
      ingredients = listOf(
        RecipeIngredient("2 lb beef and 1/2 chicken", "beef"),
        RecipeIngredient("1 lb pork meat or 3-4 pork ribs", "pork ribs"),
        RecipeIngredient("1/2 lb Italian pancetta (or unsmoked bacon)", "pancetta"),
        RecipeIngredient("1 head green cabbage, cut in large shreds", "cabbage"),
        RecipeIngredient("1 head escarole, chopped in large pieces", "escarole"),
        RecipeIngredient("1 lb (400 g) Swiss chard", "swiss chard"),
        RecipeIngredient("1 small bunch of herbs (basil and thyme)", "thyme"),
        RecipeIngredient("1 small red chili pepper", "chili pepper"),
        RecipeIngredient("4 oz grated Parmigiano cheese", "parmesan"),
        RecipeIngredient("Carrot, onion, parsley, celery, bay leaves, salt", "mirepoix")
      ),
      instructions = listOf(
        "Place all the meats in a large empty pot with carrot, onion, parsley, celery, bay leaves, and halved tomatoes.",
        "Fill pot with water, cover, and bring to boil. Skim off foam, add salt, and simmer until meat is tender.",
        "Remove meat, filter broth through fine strainer and cool to remove surface fat. Dice meat into small pieces.",
        "Bring a second pot half full of water to boil. Drop cabbage, escarole, Swiss chard, and herbs in to blanch. Drain and chop.",
        "Bring clarified broth to a boil, add blanched vegetables and red pepper. Cook 20 minutes until tender.",
        "Add meat back into the soup and serve piping hot, topped with grated Parmigiano cheese."
      ),
      notes = "The marriage ('maritata') of rich meats and leafy greens makes this a treasured feast day classic.",
      tags = listOf("Soups", "Holiday", "Pork", "Chicken", "Beef", "Greens")
    ),
    Recipe(
      id = "chicken_stracciatella",
      title = "Chicken Stracciatella Soup",
      italianTitle = "Stracciatella alla Romana",
      cookbookPage = 31,
      category = RecipeCategory.SOUPS,
      contributor = "Rita V.",
      servings = "4 servings",
      prepTime = "5 mins",
      cookTime = "10 mins",
      ingredients = listOf(
        RecipeIngredient("4 cups chicken broth (or bouillon)", "chicken broth"),
        RecipeIngredient("1/2 package of any kind of small pasta (pastina, ditalini)", "pasta"),
        RecipeIngredient("2 eggs, beaten", "eggs"),
        RecipeIngredient("1 tbsp Parmesan cheese, grated", "parmesan"),
        RecipeIngredient("Juice of 1 lemon", "lemon juice"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Bring chicken broth to a boil in a pot, put in pasta, and cook until tender.",
        "In a small bowl, whisk together beaten eggs, grated Parmesan cheese, and fresh lemon juice.",
        "Slowly pour egg mixture into boiling pasta broth, stirring gently. Cook another 2 minutes until soft egg ribbons form.",
        "Ladle into soup bowls and serve warm with extra grated Parmesan."
      ),
      notes = "Ready in 10 minutes. A classic Roman comforting starter that soothes colds.",
      tags = listOf("Soups", "Quick", "Eggs", "Chicken", "Comfort Food")
    ),
    Recipe(
      id = "pasta_e_fagioli",
      title = "Pasta e Fagioli (Pasta Fasul)",
      italianTitle = "Pasta e Fagioli Tradizionale",
      cookbookPage = 34,
      category = RecipeCategory.SOUPS,
      contributor = "Traditional Family Heritage",
      servings = "6 servings",
      prepTime = "15 mins",
      cookTime = "45 mins",
      ingredients = listOf(
        RecipeIngredient("11 oz (315 g) dry borlotti beans (or 2 cans romano beans)", "borlotti beans"),
        RecipeIngredient("2 oz (60 g) pancetta or un-smoked bacon, finely chopped", "pancetta"),
        RecipeIngredient("5 oz (140 g) short ditali or broken spaghetti", "pasta"),
        RecipeIngredient("1 medium onion, finely diced", "onion"),
        RecipeIngredient("1 carrot, finely chopped", "carrots"),
        RecipeIngredient("1 stick celery, finely diced", "celery"),
        RecipeIngredient("2 tbsp fresh ripe tomato, finely diced", "tomatoes"),
        RecipeIngredient("2 cups broth plus bean cooking water", "broth"),
        RecipeIngredient("3 + 4 tablespoons extra-virgin olive oil", "olive oil"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Soak dry borlotti beans overnight. Boil in fresh water for 20 minutes until tender (or use drained canned beans).",
        "In a stockpot, heat 3 tbsp olive oil over medium heat. Sauté pancetta, onion, celery, and carrot for 2-3 minutes until soft. Stir in diced tomato.",
        "Transfer 1/3 of the cooked beans to a plate and mash to a paste with a potato masher.",
        "Add whole beans, bean purée, broth, and cooking water to the pot. Bring to a boil, season with salt and pepper, and simmer 15 minutes.",
        "Add ditali pasta and cook until al dente.",
        "Ladle into bowls, drizzle generously with extra-virgin olive oil and cracked black pepper."
      ),
      notes = "The quintessence of Italian home cooking. The mashed beans create the signature rich, creamy texture.",
      tags = listOf("Soups", "Pasta", "Beans", "Traditional", "Pancetta")
    ),
    Recipe(
      id = "simple_pasta_fagioli",
      title = "Simple Pasta and Fagioli Soup",
      italianTitle = "Pasta e Fagioli Veloce",
      cookbookPage = 35,
      category = RecipeCategory.SOUPS,
      contributor = "Family Heritage",
      servings = "8 servings",
      prepTime = "15 mins",
      cookTime = "30 mins",
      ingredients = listOf(
        RecipeIngredient("5 slices bacon or pancetta, diced", "bacon"),
        RecipeIngredient("2 cans (19 oz each) romano beans, drained and rinsed", "beans"),
        RecipeIngredient("1 1/2 cups tubetti or other small pasta", "pasta"),
        RecipeIngredient("2 1/2 cups chicken stock", "chicken stock"),
        RecipeIngredient("3 plum tomatoes, diced", "tomatoes"),
        RecipeIngredient("1 small potato, peeled and diced", "potatoes"),
        RecipeIngredient("1/2 cup onion, diced", "onion"),
        RecipeIngredient("1 carrot, diced", "carrots"),
        RecipeIngredient("1/2 cup celery, diced", "celery"),
        RecipeIngredient("2 cloves garlic, minced", "garlic"),
        RecipeIngredient("1/4 cup white wine", "white wine"),
        RecipeIngredient("1/2 cup Parmesan cheese, grated", "parmesan"),
        RecipeIngredient("1 tbsp olive oil, salt and pepper", "olive oil")
      ),
      instructions = listOf(
        "In a Dutch oven, fry bacon over medium heat until golden and crisp (about 8 mins); remove with slotted spoon.",
        "Drain fat. Heat 1 tbsp oil in same pan; fry onion, celery, carrot, potato, and garlic for 10 minutes until softened.",
        "Stir in white wine, tomatoes, salt, and pepper; simmer 10 minutes until tomatoes break down.",
        "Stir in chicken stock, water, beans, and cooked bacon.",
        "Bring to a boil, add small pasta, and simmer until pasta is al dente (about 8 minutes).",
        "Serve sprinkled with grated Parmesan and chopped parsley."
      ),
      notes = "Tip: Toss 1 cup chopped spinach or Swiss chard into pot during the final 2 minutes of pasta cooking.",
      tags = listOf("Soups", "Pasta", "Beans", "Quick", "Weeknight")
    ),
    Recipe(
      id = "pasta_e_ceci",
      title = "Pasta e Ceci (Chickpea) Roman Soup",
      italianTitle = "Pasta e Ceci alla Romana",
      cookbookPage = 35,
      category = RecipeCategory.SOUPS,
      contributor = "Traditional Family Heritage",
      servings = "4-6 servings",
      prepTime = "15 mins",
      cookTime = "30 mins",
      ingredients = listOf(
        RecipeIngredient("11 oz (300 g) dry chickpeas soaked overnight (or 2 cans chickpeas)", "chickpeas"),
        RecipeIngredient("6 oz (180 g) short ditali or broken spaghetti", "pasta"),
        RecipeIngredient("2 anchovy fillets, chopped", "anchovies"),
        RecipeIngredient("1 sprig fresh rosemary", "rosemary"),
        RecipeIngredient("1 garlic clove, finely chopped", "garlic"),
        RecipeIngredient("2 oz (60 g) fresh tomato, peeled and diced", "tomatoes"),
        RecipeIngredient("3 + 2 tbsp extra-virgin olive oil", "olive oil"),
        RecipeIngredient("4 cups water or light broth", "water"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Drain and rinse chickpeas. Place 1/3 of chickpeas in food processor and blend to a fine paste.",
        "In a saucepan, heat 3 tbsp olive oil, garlic, and the rosemary sprig over medium heat. Add anchovies and stir until melted into oil (do not burn garlic).",
        "Immediately add diced tomato, whole chickpeas, chickpea paste, and 4 cups water/broth. Bring to a boil.",
        "Simmer for 20 minutes until flavors combine. Discard rosemary sprig.",
        "Add pasta and cook until al dente.",
        "Transfer to serving bowls and finish with a drizzle of extra-virgin olive oil and freshly ground black pepper."
      ),
      notes = "One of the oldest recipes in Roman cooking. Rosemary and anchovy give an incredible savory depth.",
      tags = listOf("Soups", "Pasta", "Chickpeas", "Roman", "Healthy")
    ),
    Recipe(
      id = "cuccia_st_lucia",
      title = "Cuccia (St. Lucia Heritage Soup)",
      italianTitle = "Cuccia Tradizionale di Santa Lucia",
      cookbookPage = 37,
      category = RecipeCategory.SOUPS,
      contributor = "Rosina Ruffolo & Lena Orrico",
      servings = "Large Family Gathering (15-30 servings)",
      prepTime = "Overnight soak",
      cookTime = "2 hrs",
      ingredients = listOf(
        RecipeIngredient("1 bag chickpeas, soaked overnight", "chickpeas"),
        RecipeIngredient("1 bag white kidney beans, soaked", "white kidney beans"),
        RecipeIngredient("1 bag navy beans, soaked", "navy beans"),
        RecipeIngredient("1/2 bag black turtle beans, soaked", "black beans"),
        RecipeIngredient("1 bag Farro wheat grains from Italy", "farro"),
        RecipeIngredient("4 cups hard red wheat berries", "wheat berries"),
        RecipeIngredient("1 bag pearl barley", "barley"),
        RecipeIngredient("4 large onions, chopped", "onion"),
        RecipeIngredient("1/2 bunch celery, chopped", "celery"),
        RecipeIngredient("1 cup olive oil", "olive oil"),
        RecipeIngredient("3 cubes vegetable broth", "vegetable broth"),
        RecipeIngredient("Salt to taste", "salt")
      ),
      instructions = listOf(
        "Day before: Rinse and soak chickpeas and wheat berries in cold water overnight. Soak kidney beans for 6 hours, navy and black beans for 3 hours.",
        "Cook chickpeas and white kidney beans in a large pot with 4x water, simmering for 1.5 hours.",
        "Cook navy and black turtle beans in a second pot with 4x water. Drain and rinse black water completely.",
        "Boil wheat berries and farro until tender.",
        "In fourth pot, heat olive oil and sauté chopped onions and celery. Add pearl barley, water, and cook 30 minutes.",
        "Combine all cooked beans, farro, wheat berries, and barley together in largest family stockpot.",
        "Add hot water to achieve hearty consistency, stir in vegetable broth cubes and salt.",
        "Simmer all together, stirring well. Serve warm."
      ),
      notes = "Rosina Ruffolo, our matriarch, soaked beans each December 12 and ladled cuccia into containers for all her children on Santa Lucia Day. The tradition continues with Lena Orrico.",
      tags = listOf("Soups", "Heritage Special", "Beans", "Grains", "Vegetarian"),
      originalPhotoCaption = "Cuccia made by Lena December 13, 2024",
      originalPhotoPage = 36
    ),
    Recipe(
      id = "minestrone_alla_milanese",
      title = "Minestrone alla Milanese",
      italianTitle = "Minestrone Tradizionale con Riso",
      cookbookPage = 39,
      category = RecipeCategory.SOUPS,
      contributor = "Traditional Family Heritage",
      servings = "8 servings",
      prepTime = "20 mins",
      cookTime = "2 hrs",
      ingredients = listOf(
        RecipeIngredient("2 potatoes, chopped", "potatoes"),
        RecipeIngredient("2 carrots, chopped", "carrots"),
        RecipeIngredient("1 zucchini, chopped", "zucchini"),
        RecipeIngredient("1 cup 1/2 inch green beans, chopped", "green beans"),
        RecipeIngredient("3 tomatoes, peeled and diced", "tomatoes"),
        RecipeIngredient("1 cup savoy cabbage, coarsely grated", "cabbage"),
        RecipeIngredient("1 cup rice (Arborio or short grain)", "rice"),
        RecipeIngredient("1 onion, chopped", "onion"),
        RecipeIngredient("1 clove garlic, chopped", "garlic"),
        RecipeIngredient("1 bunch parsley, chopped", "parsley"),
        RecipeIngredient("2 tbsp olive oil", "olive oil"),
        RecipeIngredient("Parmesan cheese to serve", "parmesan"),
        RecipeIngredient("Salt to taste", "salt")
      ),
      instructions = listOf(
        "Heat oil in a large stockpot; add garlic, celery, onion, and parsley. Sauté 5 minutes.",
        "Add potatoes, carrots, zucchini, green beans, and tomatoes.",
        "Cover generously with water and season with salt.",
        "Bring to a boil over high heat, then lower heat and simmer covered for 2 hours, adding water as needed.",
        "After the first hour, add grated savoy cabbage.",
        "Fifteen minutes before serving, add rice and simmer, keeping rice al dente.",
        "Serve warm with a generous sprinkling of grated Parmesan cheese."
      ),
      notes = "A hearty vegetable feast where slow simmering develops rich sweet vegetal depth.",
      tags = listOf("Soups", "Vegetarian", "Rice", "Comfort Food")
    ),
    Recipe(
      id = "french_onion_soup",
      title = "French Onion Soup",
      italianTitle = "Zuppa di Cipolle Gratinata",
      cookbookPage = 40,
      category = RecipeCategory.SOUPS,
      contributor = "Family Heritage",
      servings = "4 servings",
      prepTime = "15 mins",
      cookTime = "40 mins",
      ingredients = listOf(
        RecipeIngredient("1 large Spanish onion, thinly sliced", "onion"),
        RecipeIngredient("1 oz butter", "butter"),
        RecipeIngredient("2 tsp plain flour", "flour"),
        RecipeIngredient("3/4 cup beef stock (or bouillon)", "beef stock"),
        RecipeIngredient("1 tsp sugar", "sugar"),
        RecipeIngredient("French bread slices", "bread"),
        RecipeIngredient("Grated Emmental or Gruyere cheese", "cheese"),
        RecipeIngredient("Salt and freshly ground black pepper", "salt")
      ),
      instructions = listOf(
        "Melt butter in a heavy-based pan; add thinly sliced onion and cook slowly, stirring continuously until soft and deep golden.",
        "Stir in flour for 1 minute, then slowly stir in the beef stock.",
        "Add sugar, season with salt and pepper. Cover and simmer gently for 20 minutes.",
        "Toast slices of French bread and top generously with grated cheese.",
        "Ladle soup into oven-safe bowls, top each with cheese toast, and grill/broil until cheese melts and bubbles brown."
      ),
      notes = "Caramelizing the onions slowly with butter without rushing produces rich sweetness.",
      tags = listOf("Soups", "Cheese", "Bread", "Comfort Food")
    ),
    Recipe(
      id = "butternut_squash_garlic_soup",
      title = "Butternut Squash & Roasted Garlic Soup",
      italianTitle = "Vellutata di Zucca e Aglio Arrosto",
      cookbookPage = 41,
      category = RecipeCategory.SOUPS,
      contributor = "Family Heritage",
      servings = "6 servings",
      prepTime = "15 mins",
      cookTime = "45 mins",
      ingredients = listOf(
        RecipeIngredient("1 large butternut squash, halved and seeded", "butternut squash"),
        RecipeIngredient("4 large cloves of roasted garlic", "garlic"),
        RecipeIngredient("4 sprigs fresh thyme", "thyme"),
        RecipeIngredient("1 cup warm chicken stock", "chicken stock"),
        RecipeIngredient("Kosher salt and freshly ground black pepper", "salt")
      ),
      instructions = listOf(
        "Preheat oven to 425°F. Line baking sheet with parchment paper.",
        "Season squash halves with salt and pepper, tuck 2 sprigs thyme in each cavity. Roast cut side down for 40 minutes until fork-tender.",
        "Squeeze roasted garlic paste from roasted bulbs.",
        "Discard thyme; scoop out squash pulp into a food processor with roasted garlic and 1/2 cup chicken stock. Puree until smooth.",
        "Add remaining stock gradually until loose, velvety puree forms. Season with salt and pepper."
      ),
      notes = "Roasting brings out caramelized sweetness in both the squash and garlic.",
      tags = listOf("Soups", "Vegetarian", "Squash", "Roasted Garlic", "Creamy")
    )
  )
}
