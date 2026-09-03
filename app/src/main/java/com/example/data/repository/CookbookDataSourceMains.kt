package com.example.data.repository

import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory
import com.example.data.model.RecipeIngredient

object CookbookDataSourceMains {
  val recipes = listOf(
    Recipe(
      id = "osso_buco_milanese",
      title = "Osso Buco with Gremolata",
      italianTitle = "Ossobuco alla Milanese con Gremolada",
      cookbookPage = 120,
      category = RecipeCategory.MEATS,
      contributor = "Traditional Family Heritage",
      servings = "4-6 servings",
      prepTime = "25 mins",
      cookTime = "2 hrs",
      ingredients = listOf(
        RecipeIngredient("3-4 whole veal shanks (or beef shanks, about 1 lb each)", "veal"),
        RecipeIngredient("All-purpose flour for dredging", "flour"),
        RecipeIngredient("1 small onion, diced", "onion"),
        RecipeIngredient("1 small carrot, diced", "carrots"),
        RecipeIngredient("1 stalk celery, diced", "celery"),
        RecipeIngredient("1 tablespoon tomato paste", "tomato paste"),
        RecipeIngredient("1 cup dry white wine", "white wine"),
        RecipeIngredient("3 cups chicken or beef stock", "stock"),
        RecipeIngredient("1 bouquet garni (rosemary, thyme, bay leaf, cloves)", "herbs"),
        RecipeIngredient("3 tbsp fresh parsley, 1 garlic clove minced, zest of 1 lemon (Gremolata)", "lemon zest"),
        RecipeIngredient("Olive oil, butter, salt, black pepper", "olive oil")
      ),
      instructions = listOf(
        "Pat veal shanks dry, tie with twine, season with salt and pepper, and dredge lightly in flour.",
        "Heat oil in large Dutch oven until hot; brown shanks on all sides (3 mins per side). Transfer to plate.",
        "In same pot, sauté onion, carrot, and celery until soft (about 8 minutes). Stir in tomato paste.",
        "Return shanks to pan, pour in white wine and reduce liquid to half (5 mins).",
        "Add bouquet garni and chicken stock. Bring to a boil, reduce heat to low, cover, and simmer 1.5 to 2 hours until fork tender.",
        "Prepare Gremolata: finely chop parsley, lemon zest, and minced garlic together.",
        "During last 15 minutes of simmering, stir in 1-2 tsp gremolata.",
        "Serve shanks topped with rich braising pan sauce and remaining fresh gremolata."
      ),
      notes = "'Buco' means hole, referring to the marrow in the center bone. Make sure to offer small spoons for scooping out the marrow.",
      tags = listOf("Meats", "Veal", "Braised", "Milanese", "Gremolata")
    ),
    Recipe(
      id = "italian_meatballs",
      title = "Italian Simple Meatballs",
      italianTitle = "Polpette della Nonna",
      cookbookPage = 122,
      category = RecipeCategory.MEATS,
      contributor = "Teresa R.",
      servings = "6 servings",
      prepTime = "20 mins",
      cookTime = "25 mins",
      ingredients = listOf(
        RecipeIngredient("1 lb ground veal (or beef, pork, or a combination)", "ground beef"),
        RecipeIngredient("1/4 cup grated Parmesan or Romano cheese", "parmesan"),
        RecipeIngredient("1 large egg, slightly beaten", "eggs"),
        RecipeIngredient("1/4 cup breadcrumbs", "breadcrumbs"),
        RecipeIngredient("1 garlic clove, minced", "garlic"),
        RecipeIngredient("1 garlic clove, whole", "garlic"),
        RecipeIngredient("Fresh parsley, chopped", "parsley"),
        RecipeIngredient("2 tbsp olive oil", "olive oil"),
        RecipeIngredient("Simmering tomato sauce (sugo)", "tomato sauce"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "In a bowl, mix ground meat, cheese, beaten egg, breadcrumbs, minced garlic, parsley, salt, and pepper.",
        "Blend thoroughly with hands. If too moist, add more breadcrumbs; if too dry, add another egg.",
        "Form into uniform-sized meatballs, then coat with a light layer of breadcrumbs.",
        "Heat olive oil with the whole garlic clove in a skillet over medium heat.",
        "Lightly brown meatballs on all sides (they don't need to cook through inside).",
        "Transfer browned meatballs directly into a pot of simmering tomato sauce and cook for 20-30 minutes until tender."
      ),
      notes = "Teresa R.'s recipe: Finishing the browned meatballs inside homemade sugo infuses the sauce with meat richness and keeps meatballs incredibly juicy.",
      tags = listOf("Meats", "Meatballs", "Ground Beef", "Family Classic")
    ),
    Recipe(
      id = "serbian_cevapcici",
      title = "Serbian Cevapcici",
      italianTitle = "Cevapcici alla Griglia",
      cookbookPage = 124,
      category = RecipeCategory.MEATS,
      contributor = "Traditional Family Heritage",
      servings = "6 servings",
      prepTime = "30 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("2 pounds ground beef", "ground beef"),
        RecipeIngredient("1 pound ground pork", "ground pork"),
        RecipeIngredient("3 tablespoons fresh parsley, chopped", "parsley"),
        RecipeIngredient("1 tablespoon garlic, minced", "garlic"),
        RecipeIngredient("1 tablespoon hot Hungarian paprika", "paprika"),
        RecipeIngredient("1 teaspoon seasoned salt", "seasoned salt"),
        RecipeIngredient("2 teaspoons black pepper", "black pepper"),
        RecipeIngredient("1 egg white", "eggs"),
        RecipeIngredient("1/3 cup red wine", "red wine"),
        RecipeIngredient("Pinch of nutmeg (optional)", "nutmeg"),
        RecipeIngredient("Olive oil for brushing", "olive oil")
      ),
      instructions = listOf(
        "Place beef, pork, parsley, and minced garlic in a large mixing bowl.",
        "Season with salt, pepper, paprika, and nutmeg. Add egg white and red wine.",
        "Knead mixture thoroughly by hand until well blended. Chill for 30-60 minutes.",
        "Roll meat mixture into finger-length sticks (about 1 inch thick by 3 inches long).",
        "Preheat outdoor grill or grill pan to medium-high; brush grates and cevapcici with olive oil.",
        "Grill until browned on the outside and cooked through, turning frequently, about 10-12 minutes.",
        "Serve in warm flatbread or pita with diced raw onions and creamy yogurt-cucumber sauce."
      ),
      notes = "A celebrated dish from the family's heritage, incorporating subtle Italian spices for a unique family signature.",
      tags = listOf("Meats", "Grilled", "Serbian", "Pork", "Beef", "BBQ")
    ),
    Recipe(
      id = "veal_milanese_cutlets",
      title = "Milanese Veal Cutlets",
      italianTitle = "Cotolette alla Milanese",
      cookbookPage = 134,
      category = RecipeCategory.MEATS,
      contributor = "Traditional Family Heritage",
      servings = "6-8 servings",
      prepTime = "20 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("2 lbs veal cutlets (14-16 thin slices)", "veal"),
        RecipeIngredient("2 cups Italian semolina or breadcrumbs", "breadcrumbs"),
        RecipeIngredient("3 eggs", "eggs"),
        RecipeIngredient("1/4 cup milk", "milk"),
        RecipeIngredient("1 cup grated Pecorino Romano cheese", "pecorino"),
        RecipeIngredient("1 tsp garlic powder", "garlic powder"),
        RecipeIngredient("1 handful fresh parsley, chopped", "parsley"),
        RecipeIngredient("Oil and butter for frying", "olive oil"),
        RecipeIngredient("Lemon wedges to serve", "lemon")
      ),
      instructions = listOf(
        "In one bowl, whisk together eggs and milk.",
        "In a second shallow bowl, combine breadcrumbs, Pecorino cheese, garlic powder, and chopped parsley.",
        "Dip each veal cutlet into egg mixture, then press into breadcrumb mixture on both sides to coat evenly.",
        "Heat oil and butter in a heavy frying pan over medium-high heat until hot.",
        "Fry cutlets in batches for 1 to 2 minutes per side until golden brown and crispy (do not overcrowd pan).",
        "Drain on paper towels and season with sea salt.",
        "Serve immediately with fresh lemon wedges and a crisp tomato-arugula salad."
      ),
      notes = "Thin cutlets cook very quickly! The semolina breadcrumb crust creates an unforgettable crunch.",
      tags = listOf("Meats", "Veal", "Milanese", "Crispy", "Classic")
    ),
    Recipe(
      id = "saltimbocca_alla_romana",
      title = "Saltimbocca alla Romana",
      italianTitle = "Saltimbocca alla Romana (Veal, Prosciutto & Sage)",
      cookbookPage = 135,
      category = RecipeCategory.MEATS,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "15 mins",
      cookTime = "10 mins",
      ingredients = listOf(
        RecipeIngredient("4 veal scallopini slices (about 1 lb / 450 g)", "veal"),
        RecipeIngredient("4 prosciutto slices (about 3 oz / 80 g)", "prosciutto"),
        RecipeIngredient("4 fresh sage leaves", "sage"),
        RecipeIngredient("2 oz (60 g) flour for dredging", "flour"),
        RecipeIngredient("3 tablespoons butter", "butter"),
        RecipeIngredient("2-3 tbsp extra-virgin olive oil", "olive oil"),
        RecipeIngredient("1/2 cup (120 cc) dry white wine", "white wine"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Dredge veal slices in flour with a pinch of salt; shake away excess.",
        "Place a slice of prosciutto and a fresh sage leaf on top of each veal slice. Secure with a toothpick.",
        "In a large frying pan, melt butter with olive oil over medium heat.",
        "Place veal in pan and fry gently on both sides until lightly browned (about 2 minutes per side).",
        "Pour in white wine, turn heat to medium-high, and let wine evaporate and reduce into a glossy pan glaze.",
        "Remove toothpicks, arrange cutlets on warm plates, spoon buttery pan juices over top, and serve warm."
      ),
      notes = "Saltimbocca literally translates to 'jump in the mouth' because it is so mouthwatering.",
      tags = listOf("Meats", "Veal", "Prosciutto", "Sage", "Roman", "Quick")
    ),
    Recipe(
      id = "slow_cooked_porchetta",
      title = "Slow Cooked Porchetta Roast",
      italianTitle = "Arrosto di Maiale alla Porchetta",
      cookbookPage = 140,
      category = RecipeCategory.MEATS,
      contributor = "Family Heritage",
      servings = "8-10 servings",
      prepTime = "25 mins",
      cookTime = "6 hrs",
      ingredients = listOf(
        RecipeIngredient("6-8 lb pork picnic shoulder (bone-in, skin-on)", "pork roast"),
        RecipeIngredient("3 large garlic cloves, halved", "garlic"),
        RecipeIngredient("Coarse salt and freshly cracked black pepper", "salt"),
        RecipeIngredient("Fennel seeds, rosemary, oregano", "herbs"),
        RecipeIngredient("1 cup chicken broth", "chicken broth")
      ),
      instructions = listOf(
        "Preheat oven to 450°F. Line a large rimmed baking sheet with foil.",
        "Pat pork dry. Score crosshatch pattern (1/2 inch apart) through skin and fat, but not into meat.",
        "Rub generous salt, pepper, and herbs into the slits and all over pork.",
        "Make deep slits into meaty bottom of roast and push garlic pieces into each slit.",
        "Roast uncovered at 450°F for 30 minutes to start the crust.",
        "Remove, cover tightly with heavy-duty foil, reduce heat to 300°F, and roast for 5.5 to 6 hours until fork tender.",
        "To crisp skin, remove foil and raise heat to 450°F for 10-15 minutes until skin is puffy, crispy, and crackling.",
        "Rest 15 minutes, then carve or pull into succulent chunks."
      ),
      notes = "The pride of central Italian festivities. Crispy crackling on the outside, meltingly tender within.",
      tags = listOf("Meats", "Pork", "Porchetta", "Slow Cook", "Heritage Special")
    ),
    Recipe(
      id = "chicken_marsala",
      title = "Chicken Marsala",
      italianTitle = "Petti di Pollo al Marsala",
      cookbookPage = 162,
      category = RecipeCategory.MEATS,
      contributor = "Mary V.",
      servings = "4 servings",
      prepTime = "15 mins",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("4 skinless, boneless chicken breasts (about 1 1/2 lbs)", "chicken breast"),
        RecipeIngredient("8 oz crimini or porcini mushrooms, sliced", "mushrooms"),
        RecipeIngredient("4 oz prosciutto, thinly sliced", "prosciutto"),
        RecipeIngredient("1/2 cup sweet Marsala wine", "marsala wine"),
        RecipeIngredient("1/2 cup chicken stock", "chicken stock"),
        RecipeIngredient("1/4 cup extra-virgin olive oil", "olive oil"),
        RecipeIngredient("2 tbsp unsalted butter", "butter"),
        RecipeIngredient("1/4 cup flat-leaf parsley, chopped", "parsley"),
        RecipeIngredient("All-purpose flour for dredging, salt and pepper", "flour")
      ),
      instructions = listOf(
        "Pound chicken breasts between plastic wrap to 1/4-inch thickness. Season flour with salt and pepper; dredge cutlets.",
        "Heat olive oil in skillet over medium-high heat. Fry chicken cutlets 5 minutes per side until golden; transfer to plate.",
        "In same pan, sauté prosciutto for 1 minute to render fat. Add mushrooms and sauté 5 minutes until browned.",
        "Pour in Marsala wine and boil down for 30 seconds to cook out alcohol.",
        "Add chicken stock, simmer 1 minute to reduce slightly, then stir in butter.",
        "Return chicken to pan, simmer gently 1 minute to reheat through. Garnish with parsley and serve."
      ),
      notes = "Mary V.'s beloved recipe: Sweet Marsala pairs with earthy mushrooms and salty prosciutto.",
      tags = listOf("Poultry", "Chicken", "Mushrooms", "Marsala", "Classic")
    ),
    Recipe(
      id = "baked_chicken_parmesan",
      title = "Baked Chicken Parmesan",
      italianTitle = "Pollo alla Parmigiana al Forno",
      cookbookPage = 162,
      category = RecipeCategory.MEATS,
      contributor = "Family Heritage",
      servings = "4 servings",
      prepTime = "15 mins",
      cookTime = "30 mins",
      ingredients = listOf(
        RecipeIngredient("4 chicken breasts, sliced in half lengthwise (8 cutlets)", "chicken breast"),
        RecipeIngredient("3/4 cup seasoned breadcrumbs", "breadcrumbs"),
        RecipeIngredient("1/4 cup Parmesan cheese, grated", "parmesan"),
        RecipeIngredient("3/4 cup mozzarella cheese, shredded", "mozzarella"),
        RecipeIngredient("1 cup tomato sauce", "tomato sauce"),
        RecipeIngredient("2 tbsp butter, melted (or olive oil)", "butter")
      ),
      instructions = listOf(
        "Preheat oven to 450°F. Spray a large baking sheet lightly with oil.",
        "Combine seasoned breadcrumbs and grated Parmesan cheese in a shallow bowl.",
        "Brush melted butter onto chicken cutlets, then dip into breadcrumb mixture to coat both sides.",
        "Place cutlets on baking sheet, mist lightly with cooking spray, and bake 25 minutes.",
        "Spoon 1 tbsp tomato sauce over each piece of chicken and top each with mozzarella cheese.",
        "Bake 5 more minutes until cheese is bubbly and melted. Serve immediately."
      ),
      notes = "A lighter, cleaner, oven-baked family favorite with ultra crispy crust.",
      tags = listOf("Poultry", "Chicken", "Parmesan", "Mozzarella", "Quick")
    ),
    Recipe(
      id = "chicken_cacciatore",
      title = "Chicken Cacciatore",
      italianTitle = "Pollo alla Cacciatora",
      cookbookPage = 169,
      category = RecipeCategory.MEATS,
      contributor = "Sandy V.",
      servings = "6 servings",
      prepTime = "15 mins",
      cookTime = "45 mins",
      ingredients = listOf(
        RecipeIngredient("2 lbs chicken parts (thighs, drumsticks, breasts)", "chicken"),
        RecipeIngredient("1 clove garlic, minced", "garlic"),
        RecipeIngredient("1/2 cup red or white wine", "white wine"),
        RecipeIngredient("1 can (14 oz) tomatoes", "tomatoes"),
        RecipeIngredient("1 medium green pepper, sliced", "bell pepper"),
        RecipeIngredient("1 can (10 oz) mushrooms", "mushrooms"),
        RecipeIngredient("1/2 cup onion, chopped", "onion"),
        RecipeIngredient("1/3 cup olive oil", "olive oil"),
        RecipeIngredient("1 tsp oregano, 1 tsp black pepper, 1 tsp salt", "oregano")
      ),
      instructions = listOf(
        "Heat oil in large deep skillet and sauté chicken pieces with garlic for 10 minutes until golden.",
        "Pour off excess fat and add wine, letting it simmer and reduce.",
        "Add chopped onion, sliced peppers, mushrooms, canned tomatoes, oregano, salt, and pepper.",
        "Cover tightly and simmer over medium-low heat for 45 minutes, stirring occasionally.",
        "Serve hot over polenta, pasta, or with crusty bread for dipping."
      ),
      notes = "Calabrese style 'Pollo in Umido' can also be baked in the oven with zucchini and eggplant (Dina M. variation).",
      tags = listOf("Poultry", "Chicken", "Stew", "Peppers", "Mushrooms")
    ),
    Recipe(
      id = "pesce_acqua_pazza",
      title = "Fish Stew with Tomato, Parsley & Lemon",
      italianTitle = "Pesce all'Acqua Pazza",
      cookbookPage = 178,
      category = RecipeCategory.SEAFOOD,
      contributor = "Traditional Family Heritage",
      servings = "4 servings",
      prepTime = "15 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("2 lb (900 g) white fish fillets (cod, haddock, bass, or orange roughy)", "fish fillets"),
        RecipeIngredient("1 lb (500 g) cherry tomatoes, chopped", "tomatoes"),
        RecipeIngredient("4 tbsp extra-virgin olive oil", "olive oil"),
        RecipeIngredient("2 garlic cloves, diced", "garlic"),
        RecipeIngredient("1 lemon, sliced", "lemon"),
        RecipeIngredient("4 tbsp Italian parsley, finely chopped", "parsley"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "Place olive oil and garlic in a wide skillet over medium heat. When fragrant, remove garlic and let oil cool slightly.",
        "Add water to pan about 1/2 inch (1 cm) deep.",
        "Add half the parsley, lemon slices, and cherry tomatoes.",
        "Place fish fillets in pan, top with remaining parsley, and season lightly with salt.",
        "Bring water to a boil over medium heat. Cook 10-15 minutes, turning fish gently so both sides cook in the 'crazy water' broth.",
        "Serve warm with crusty Italian bread to sop up the delicate poaching juices."
      ),
      notes = "'Acqua Pazza' (crazy water) is an ancient Neapolitan fisherman's poaching method that keeps white fish extraordinarily moist.",
      tags = listOf("Seafood", "Fish", "Tomatoes", "Healthy", "Quick")
    ),
    Recipe(
      id = "mussels_marinara",
      title = "Mussels Marinara",
      italianTitle = "Cozze alla Marinara",
      cookbookPage = 181,
      category = RecipeCategory.SEAFOOD,
      contributor = "Family Heritage",
      servings = "4 servings",
      prepTime = "15 mins",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("24 fresh mussels, scrubbed and debearded", "mussels"),
        RecipeIngredient("1 tbsp olive oil", "olive oil"),
        RecipeIngredient("2 tbsp diced onion", "onion"),
        RecipeIngredient("1 tbsp garlic, minced", "garlic"),
        RecipeIngredient("1 tbsp tomato paste", "tomato paste"),
        RecipeIngredient("2 tbsp red wine", "red wine"),
        RecipeIngredient("1 3/4 cups plum tomatoes, cut", "tomatoes"),
        RecipeIngredient("1 tsp basil, 1 tsp oregano, 1 bay leaf", "basil"),
        RecipeIngredient("Salt and pepper to taste", "salt")
      ),
      instructions = listOf(
        "In a deep pot, sauté onions and garlic in olive oil until soft.",
        "Add tomato paste, red wine, chopped plum tomatoes, basil, oregano, bay leaf, salt, and pepper.",
        "Simmer sauce for 15 to 20 minutes on medium heat until rich.",
        "Add cleaned mussels to the boiling sauce. Cover with lid and cook for 5-7 minutes until shells open.",
        "Discard any unopened mussels. Serve immediately with warm crusty bread."
      ),
      notes = "A Christmas Eve Feast of the Seven Fishes essential.",
      tags = listOf("Seafood", "Mussels", "Tomatoes", "Christmas Eve")
    ),
    Recipe(
      id = "calabrese_homemade_sausage_salami",
      title = "Calabrese Sausage & Salami",
      italianTitle = "Salsicce e Soppressata di Casa",
      cookbookPage = 145,
      category = RecipeCategory.MEATS,
      contributor = "Nonna Rosina, Fiore, Vito, Sam & Hunter",
      servings = "12-16 servings",
      prepTime = "2 hrs",
      cookTime = "Curing",
      ingredients = listOf(
        RecipeIngredient("Pork shoulder and belly, coarsely ground", "pork"),
        RecipeIngredient("Coarse sea salt (calculated strictly by meat weight)", "sea salt"),
        RecipeIngredient("Sweet and hot ground Calabrian red pepper", "chili pepper"),
        RecipeIngredient("Fennel seeds (semi di finocchio selvatico)", "fennel seed"),
        RecipeIngredient("Natural pork casings, cleaned and soaked in vinegar/wine", "casings")
      ),
      instructions = listOf(
        "Mix coarsely ground pork with salt, hot and sweet Calabrian pepper, and wild fennel seeds.",
        "Turn the meat mixer vigorously until seasoning is completely incorporated.",
        "Stuff prepared casings tightly using sausage horn, piercing air pockets with needle.",
        "Tie links with natural twine.",
        "Hang high on wooden rafters in the cold cantina to cure for several weeks to months."
      ),
      notes = "Sausage or Salami making is an all-hands family group effort. Generations gather in the cold winter cellar.",
      tags = listOf("Meats", "Sausage", "Salami", "Cantina", "Family Tradition"),
      originalPhotoCaption = "Nonna Rosina, Fiore, Vito, Sam & Hunter making sausages; Liver sausages hanging",
      originalPhotoPage = 148
    ),
    Recipe(
      id = "homemade_capicollo_pancetta",
      title = "Homemade Capicollo & Pancetta",
      italianTitle = "Capicollo e Pancetta Tesa",
      cookbookPage = 149,
      category = RecipeCategory.MEATS,
      contributor = "Antonio & Frank Ruffolo",
      servings = "10 servings",
      prepTime = "1 hr",
      cookTime = "Curing",
      ingredients = listOf(
        RecipeIngredient("Whole pork neck / collar (capicollo) or pork belly", "pork collar"),
        RecipeIngredient("Coarse salt, crushed black peppercorns", "sea salt"),
        RecipeIngredient("Ground hot Calabrian red pepper", "chili powder"),
        RecipeIngredient("Red wine for washing", "red wine")
      ),
      instructions = listOf(
        "Rub pork collar thoroughly with salt and let cure in cold cellar for designated days.",
        "Wash with red wine, rub generously with fiery Calabrian pepper.",
        "Wrap tightly in beef bung casing or parchment, bind tightly with butcher's twine in crisscross pattern.",
        "Hang high from cantina ceiling until firm and dried to weight."
      ),
      notes = "Tenderloins and capicolli hung high to dry in the traditional cold cellar.",
      tags = listOf("Meats", "Cured", "Capicollo", "Heritage Special"),
      originalPhotoCaption = "Capicolli hung high for drying; tenderloins tied and hung to dry",
      originalPhotoPage = 149
    ),
    Recipe(
      id = "bacalhau_a_rosa",
      title = "Bacalhau à Rosa (Salt Cod)",
      italianTitle = "Baccalà con Patate e Olive",
      cookbookPage = 176,
      category = RecipeCategory.SEAFOOD,
      contributor = "Rosa Ruffolo",
      servings = "6 servings",
      prepTime = "30 mins",
      cookTime = "45 mins",
      ingredients = listOf(
        RecipeIngredient("1.5 lbs salt cod, soaked in cold water 48 hrs with frequent changes", "salt cod"),
        RecipeIngredient("4 medium potatoes, peeled and sliced", "potatoes"),
        RecipeIngredient("2 onions, sliced", "onion"),
        RecipeIngredient("1/2 cup black and green olives", "olives"),
        RecipeIngredient("1/2 cup extra virgin olive oil", "olive oil"),
        RecipeIngredient("Fresh parsley and freshly ground black pepper", "parsley")
      ),
      instructions = listOf(
        "Drain thoroughly desalted cod and cut into portioned pieces.",
        "Parboil sliced potatoes for 6 minutes; drain.",
        "In a large baking dish, layer sliced onions, potatoes, and cod pieces.",
        "Scatter black and green olives, drizzle generously with extra virgin olive oil and season with pepper.",
        "Bake at 375°F (190°C) for 40-45 minutes until potatoes are golden and tender.",
        "Garnish with chopped fresh flat-leaf parsley and serve hot."
      ),
      notes = "Rosa's festive salt cod specialty, savory and rich with olive oil.",
      tags = listOf("Seafood", "Baccalà", "Holiday", "Family Classic"),
      originalPhotoCaption = "Bacalhau à Rosa baked with golden potatoes, onions, and black olives",
      originalPhotoPage = 176
    )
  )
}
