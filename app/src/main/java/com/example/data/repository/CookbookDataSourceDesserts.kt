package com.example.data.repository

import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory
import com.example.data.model.RecipeIngredient

object CookbookDataSourceDesserts {
  val recipes = listOf(
    Recipe(
      id = "tiramisu_classic",
      title = "Classic Italian Tiramisu",
      italianTitle = "Tiramisù Tradizionale al Mascarpone",
      cookbookPage = 309,
      category = RecipeCategory.CAKES_AND_DESSERTS,
      contributor = "Traditional Family Heritage",
      servings = "8-10 servings",
      prepTime = "25 mins",
      cookTime = "No bake (6 hrs chill)",
      ingredients = listOf(
        RecipeIngredient("500 g mascarpone cheese", "mascarpone"),
        RecipeIngredient("4 eggs, separated", "eggs"),
        RecipeIngredient("3/4 cup sugar", "sugar"),
        RecipeIngredient("250 g Savoiardi (ladyfinger) biscuits", "savoiardi"),
        RecipeIngredient("1/3 cup strong espresso coffee, cooled", "coffee"),
        RecipeIngredient("1/4 cup dark rum or Marsala wine", "rum"),
        RecipeIngredient("50 g dark chocolate, grated", "chocolate"),
        RecipeIngredient("Unsweetened cocoa powder for dusting", "cocoa powder")
      ),
      instructions = listOf(
        "Beat egg yolks with sugar until creamy and pale yellow.",
        "Add mascarpone cheese and whisk gently until smooth and velvety.",
        "In a clean dry bowl, beat egg whites with a pinch of salt until stiff peaks form.",
        "Gently fold beaten egg whites into mascarpone cream with a spatula using top-to-bottom strokes.",
        "Combine espresso coffee and rum in a shallow bowl.",
        "Quickly dunk Savoiardi biscuits one by one in the espresso mix and arrange a layer in the bottom of a rectangular glass dish.",
        "Spread half of the mascarpone cream over the biscuits and sprinkle with grated dark chocolate.",
        "Add a second layer of dipped ladyfingers, top with remaining cream, and smooth the surface.",
        "Cover and refrigerate for at least 6 hours (preferably overnight).",
        "Generously dust with unsweetened cocoa powder just before serving cold."
      ),
      notes = "Four family variations in the cookbook (Rita, Lina, Teresa, and Classic) celebrate this beloved dessert.",
      tags = listOf("Desserts", "Tiramisu", "Mascarpone", "Coffee", "No Bake")
    ),
    Recipe(
      id = "rosina_taralle_2008",
      title = "Rosina’s Traditional Taralle (2008)",
      italianTitle = "Taralli Tradizionali Calabresi",
      cookbookPage = 201,
      category = RecipeCategory.HOLIDAY_TRADITIONS,
      contributor = "Nonna Rosina Ruffolo",
      servings = "Large Family Batch (50-60 taralli)",
      prepTime = "45 mins",
      cookTime = "30 mins",
      ingredients = listOf(
        RecipeIngredient("18 cups all-purpose flour", "flour"),
        RecipeIngredient("4 cups warm water", "water"),
        RecipeIngredient("1 cup vegetable oil", "oil"),
        RecipeIngredient("3 tbsp quick rise yeast", "yeast"),
        RecipeIngredient("1 tbsp anise (fennel) seeds", "anise"),
        RecipeIngredient("1 tbsp salt", "salt")
      ),
      instructions = listOf(
        "Pour warm water into a large bowl. Add yeast, stir, and let bubble for 5 minutes.",
        "Add oil, salt, and anise seeds.",
        "Slowly add flour, mixing by hand. Turn dough onto floured board and knead until a fingerprint springs back.",
        "Oil dough, place in bowl, cover, and let rise until doubled.",
        "Divide dough into loaves, then cut into even slices. Roll each slice into an 8-inch rope (1/2 inch thick).",
        "Form into circles and squeeze ends together firmly.",
        "Bring a large pot of water to a boil. Drop 5 taralle at a time into boiling water. When they float to top, remove with slotted spoon onto dry cloth to dry.",
        "Preheat convection oven to 350°F. Place boiled and dried taralle directly on oven racks.",
        "Bake for about 30 minutes until golden brown on top and bottom.",
        "Slide hot taralle onto clean tablecloth to cool. Can be frozen and reheated in oven before serving."
      ),
      notes = "Nonna Rosina's secret: Boiling the taralle before baking gives them their signature crisp, tender crumb and golden sheen.",
      tags = listOf("Holiday", "Taralle", "Nonna Rosina", "Baking", "Calabrese"),
      originalPhotoCaption = "Nonna Rosina rolling, boiling, drying on clean tablecloths, and baking golden taralle",
      originalPhotoPage = 201
    ),
    Recipe(
      id = "glazed_egg_taralli",
      title = "Glazed Egg Taralli",
      italianTitle = "Taralli all'Uovo Glassati",
      cookbookPage = 202,
      category = RecipeCategory.COOKIES_AND_BISCOTTI,
      contributor = "Maria Vanelli",
      servings = "30-40 taralli",
      prepTime = "40 mins",
      cookTime = "35 mins",
      ingredients = listOf(
        RecipeIngredient("3 1/2 cups (500 g) all-purpose flour", "flour"),
        RecipeIngredient("6 eggs at room temperature", "eggs"),
        RecipeIngredient("2 tablespoons sugar", "sugar"),
        RecipeIngredient("2 tablespoons vegetable or olive oil", "olive oil"),
        RecipeIngredient("2 tsp Sambuca, grappa, or Marsala", "liqueur"),
        RecipeIngredient("Zest of 1 lemon", "lemon zest"),
        RecipeIngredient("1/2 teaspoon baking powder and pinch of salt", "baking powder"),
        RecipeIngredient("3 cups icing sugar, 4 tbsp water, 2 tsp lemon juice (Glaze)", "icing sugar")
      ),
      instructions = listOf(
        "In a stand mixer with whisk, beat eggs on medium-high for 4-5 minutes until doubled in volume.",
        "Add sugar, oil, vanilla, lemon zest, and Sambuca. Whisk together.",
        "Switch to dough hook and knead in flour and baking powder for 7-10 minutes until soft and smooth.",
        "Wrap dough in plastic and rest for 30 minutes at room temperature.",
        "Divide into 8 pieces, then shape into small balls. Poke hole in center and stretch into donut rings.",
        "Bring water to 200°F (just before boiling). Drop taralli in water; when they float (2-3 mins), remove to tea towel and air dry 15 minutes.",
        "Preheat oven to 400°F. Score a shallow line around circumference with razor blade.",
        "Bake at 375°F for 10 minutes, then lower to 325°F for 20-25 minutes until cracked and golden brown.",
        "Warm icing sugar, water, and lemon juice in small pot. Dip cooled taralli in glaze and let dry on wire rack."
      ),
      notes = "Maria Vanelli's heirloom recipe: The crisp outer crust with sweet lemon glaze makes these irresistible.",
      tags = listOf("Cookies", "Taralli", "Glazed", "Easter", "Italian"),
      originalPhotoCaption = "Glazed Egg Taralli after baking with scored circumference and lemon glaze on wire rack",
      originalPhotoPage = 202
    ),
    Recipe(
      id = "pizzelle_della_nonna",
      title = "Pizzelle della Nonna",
      italianTitle = "Pizzelle Tradizionali all'Anice",
      cookbookPage = 240,
      category = RecipeCategory.COOKIES_AND_BISCOTTI,
      contributor = "Maria Vanelli",
      servings = "30 pizzelle",
      prepTime = "15 mins",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("1 1/4 cups all-purpose flour (177 g)", "flour"),
        RecipeIngredient("3 eggs at room temperature", "eggs"),
        RecipeIngredient("1/2 cup sugar (100 g)", "sugar"),
        RecipeIngredient("1/4 cup vegetable oil", "oil"),
        RecipeIngredient("1 teaspoon vanilla extract", "vanilla"),
        RecipeIngredient("1 teaspoon anise extract (optional)", "anise"),
        RecipeIngredient("3/4 teaspoon baking powder and pinch of salt", "baking powder")
      ),
      instructions = listOf(
        "Preheat pizzelle iron.",
        "In a medium bowl, sift together flour, baking powder, and salt.",
        "In mixer bowl, beat eggs until frothy and thickening (2-3 minutes). Add sugar and continue beating 3 minutes until thick.",
        "Add oil, vanilla, and anise extract; mix well.",
        "Slowly add flour mixture on low speed until soft sticky dough forms.",
        "Drop 1 tablespoon of batter onto the hot pizzelle press.",
        "Close lid firmly and cook for 30 to 45 seconds until light golden.",
        "Carefully remove with a fork or spatula and let cool flat on a rack.",
        "Chocolate option: Replace 1/4 cup flour with 1/4 cup unsweetened cocoa powder."
      ),
      notes = "Crisp, wafer-thin snowflake cookies that evoke Italian Christmas and Easter celebrations.",
      tags = listOf("Cookies", "Pizzelle", "Anise", "Holiday", "Traditional"),
      originalPhotoCaption = "Justin sifts flour and drops batter on pizzelle iron; Pizzelle removed when golden",
      originalPhotoPage = 242
    ),
    Recipe(
      id = "cuddruriaddri_calabresi",
      title = "Cuddruriaddri (Calabrese Potato Donuts)",
      italianTitle = "Cullurielli / Grispuli di Patate",
      cookbookPage = 278,
      category = RecipeCategory.HOLIDAY_TRADITIONS,
      contributor = "Nonna Rosina Ruffolo",
      servings = "15 large donuts",
      prepTime = "30 mins (+ 2 hrs rise)",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("500 g (2 cups) flour", "flour"),
        RecipeIngredient("250 g (1 cup) potatoes, boiled and mashed", "potatoes"),
        RecipeIngredient("1 tsp dry yeast", "yeast"),
        RecipeIngredient("500 ml (about 2 cups) lukewarm water", "water"),
        RecipeIngredient("13 g (3 tsp) salt", "salt"),
        RecipeIngredient("Oil for frying (peanut or sunflower oil)", "oil"),
        RecipeIngredient("Granulated sugar for sweet version, or anchovies for savory", "sugar")
      ),
      instructions = listOf(
        "Boil potatoes in skins until tender; peel and press through potato masher into large bowl.",
        "Dissolve yeast in warm water. Alternately mix flour, mashed potatoes, and yeast water with a fork to make soft dough.",
        "Add salt halfway through. Knead lightly on floured board until soft and slightly sticky.",
        "Divide dough into 15 balls, folding edges underneath to maintain fluffiness.",
        "Place balls on floured cloth, cover, and let rise in a warm spot for 2-3 hours until doubled.",
        "Heat oil in deep pan. Lightly oil hands, take one ball, poke a hole in center and twirl around wooden spoon handle to form donut ring.",
        "Gently lower into hot oil. Fry until puffed and golden brown on both sides.",
        "Drain on paper towels. Immediately toss in granulated sugar for dessert, or insert anchovy inside before frying for dinner!"
      ),
      notes = "Traditionally eaten on the Eve of the Immaculate Conception (Dec 8) and throughout the Christmas season.",
      tags = listOf("Holiday", "Donuts", "Calabrese", "Potatoes", "Nonna Rosina", "Christmas Eve"),
      originalPhotoCaption = "Anna fries and places Cudorelli on paper towels; Risen dough balls and donuts",
      originalPhotoPage = 278
    ),
    Recipe(
      id = "scalille_calabresi",
      title = "Scalille (Calabrese Honey Ladders)",
      italianTitle = "Scalille Tradizionali al Miele",
      cookbookPage = 282,
      category = RecipeCategory.HOLIDAY_TRADITIONS,
      contributor = "Traditional Family Heritage",
      servings = "40-50 cookies",
      prepTime = "40 mins",
      cookTime = "25 mins",
      ingredients = listOf(
        RecipeIngredient("3 1/2 cups flour", "flour"),
        RecipeIngredient("6 eggs", "eggs"),
        RecipeIngredient("6 tbsp oil (1/4 cup)", "oil"),
        RecipeIngredient("1 tsp baking powder", "baking powder"),
        RecipeIngredient("Pure honey for coating (2 cups)", "honey"),
        RecipeIngredient("Oil for frying", "oil")
      ),
      instructions = listOf(
        "Beat eggs and oil together.",
        "Add flour and baking powder; knead until smooth and a fingerprint holds in the dough.",
        "Roll dough into 1/2-inch ropes, 6 inches long. With a rolling pin flatten slightly.",
        "Traditional shaping: Wind dough around a floured dowel or wooden spoon handle to form little ladders ('scalille'), or braid 3 strips.",
        "Fry in hot oil until they puff up to the surface and turn golden brown. Drain on parchment.",
        "Heat honey with a splash of water in a skillet until foaming.",
        "Drop fried scalille into hot honey, turn to coat thoroughly, and transfer to a colander to drain excess.",
        "Store in tins with parchment paper between layers."
      ),
      notes = "'Scalille' means little ladders, representing climbing to heaven at Christmas time.",
      tags = listOf("Holiday", "Honey", "Christmas", "Calabrese", "Tradition"),
      originalPhotoCaption = "Maya, Rita, Chiara and Sandy forming scalilli; Braided ladders and honey glaze",
      originalPhotoPage = 284
    ),
    Recipe(
      id = "turdilli_calabresi",
      title = "Nonna’s Turdilli",
      italianTitle = "Turdilli / Turdiddri al Miele",
      cookbookPage = 285,
      category = RecipeCategory.HOLIDAY_TRADITIONS,
      contributor = "Nonna Rosina Ruffolo",
      servings = "60 cookies",
      prepTime = "30 mins",
      cookTime = "20 mins",
      ingredients = listOf(
        RecipeIngredient("1 pound flour", "flour"),
        RecipeIngredient("4.5 ounces extra virgin olive oil", "olive oil"),
        RecipeIngredient("8.5 ounces sweet Moscato wine (or sweet white/vermouth)", "white wine"),
        RecipeIngredient("Zest of 1 orange, finely grated", "orange"),
        RecipeIngredient("1/2 tsp cinnamon powder", "cinnamon"),
        RecipeIngredient("5 ounces pure honey", "honey"),
        RecipeIngredient("Juice of 1 orange", "orange"),
        RecipeIngredient("Oil for deep frying", "oil")
      ),
      instructions = listOf(
        "In a mixing bowl, combine flour, extra-virgin olive oil, sweet wine, cinnamon, and grated orange zest.",
        "Work dough gently until smooth and cohesive.",
        "Roll dough into 1-inch flat strips, then cut into 1-inch pieces.",
        "Roll each piece on the back of a fork or gnocchi board to impress ridges and curl into small hollow cylinders.",
        "Deep fry in hot oil (350°F) until golden brown and cooked in the middle. Drain on paper towels.",
        "In a pan over low heat, melt honey with fresh orange juice.",
        "Pour warm honey glaze over Turdilli and toss to coat completely.",
        "Allow to cool before serving. They keep well for over a week!"
      ),
      notes = "Calabrese deep-fried and honeyed Christmas cookies made with fragrant wine and citrus.",
      tags = listOf("Holiday", "Turdilli", "Honey", "Christmas", "Nonna Rosina"),
      originalPhotoCaption = "Nonna Rosina: Golden honey-glazed Calabrese Christmas Turdilli with ridges",
      originalPhotoPage = 285
    ),
    Recipe(
      id = "almond_biscotti",
      title = "Traditional Almond Biscotti (Cantucci)",
      italianTitle = "Biscotti alle Mandorle di Prato",
      cookbookPage = 214,
      category = RecipeCategory.COOKIES_AND_BISCOTTI,
      contributor = "Laura Tabul",
      servings = "40 biscotti",
      prepTime = "20 mins",
      cookTime = "45 mins",
      ingredients = listOf(
        RecipeIngredient("4 1/2 cups all-purpose flour", "flour"),
        RecipeIngredient("2 cups white sugar", "sugar"),
        RecipeIngredient("1 cup butter, softened", "butter"),
        RecipeIngredient("4 eggs", "eggs"),
        RecipeIngredient("1 cup whole almonds, toasted", "almonds"),
        RecipeIngredient("2 tablespoons anise seeds", "anise"),
        RecipeIngredient("1 1/2 teaspoons anise extract", "anise"),
        RecipeIngredient("1/3 cup brandy", "brandy"),
        RecipeIngredient("1 teaspoon vanilla extract", "vanilla"),
        RecipeIngredient("4 teaspoons baking powder and 3/4 tsp salt", "baking powder")
      ),
      instructions = listOf(
        "Preheat oven to 350°F. Line two cookie sheets with parchment paper.",
        "Beat sugar and butter until light and fluffy. Add eggs one at a time, beating well.",
        "Mix brandy, anise extract, and vanilla together. Whisk flour, baking powder, and salt.",
        "Alternately add dry ingredients and brandy mixture to butter cream. Stir in whole almonds and anise seeds.",
        "Drop dough onto sheets to form two 2x13 inch logs. Smooth tops with moistened fingers.",
        "Bake 30-35 minutes until golden and firm. Cool completely on racks (15 mins). Reduce oven to 300°F.",
        "Cut logs on diagonal into 3/4-inch slices with a serrated knife. Lay slices flat on sheets.",
        "Bake 20 minutes (turn after 10 mins) until crisp, dry, and lightly toasted."
      ),
      notes = "'Biscotti' means twice-baked ('bis-cotto'). Perfect for dipping in espresso, Vin Santo, or sweet dessert wine.",
      tags = listOf("Biscotti", "Almonds", "Anise", "Cookies", "Traditional")
    ),
    Recipe(
      id = "amaretti_cookies",
      title = "Chewy Almond Amaretti Cookies",
      italianTitle = "Amaretti Morbidi alle Mandorle",
      cookbookPage = 214,
      category = RecipeCategory.COOKIES_AND_BISCOTTI,
      contributor = "Traditional Family Heritage",
      servings = "30 cookies",
      prepTime = "15 mins",
      cookTime = "25 mins",
      ingredients = listOf(
        RecipeIngredient("2 1/2 cups almond flour (or 3 cups blanched almonds, finely ground)", "almond flour"),
        RecipeIngredient("1 1/4 cups baker's sugar", "sugar"),
        RecipeIngredient("3 egg whites", "eggs"),
        RecipeIngredient("1 teaspoon almond extract", "almond extract"),
        RecipeIngredient("1/2 teaspoon vanilla extract", "vanilla"),
        RecipeIngredient("Extra powdered sugar for dusting", "icing sugar")
      ),
      instructions = listOf(
        "Preheat oven to 300°F. Line baking sheets with parchment paper.",
        "In a food processor, pulse almond flour and sugar together.",
        "Add vanilla and almond extract. Pulse briefly.",
        "Add egg whites one at a time and process until a smooth, stiff paste forms.",
        "Roll teaspoons of dough into balls, roll in powdered sugar, and place on parchment.",
        "Bake for 24-30 minutes until golden on the outside with delicate crackles.",
        "Cool completely. Crisp outside, tender and chewy almond marzipan center."
      ),
      notes = "Naturally gluten-free and dairy-free! Stored in an airtight container, they stay chewy and delicious for weeks.",
      tags = listOf("Cookies", "Amaretti", "Almonds", "Gluten Free", "Chewy")
    ),
    Recipe(
      id = "easter_pie_pasqualina",
      title = "Easter Pie Pasqualina",
      italianTitle = "Torta Pasqualina Ligure",
      cookbookPage = 290,
      category = RecipeCategory.HOLIDAY_TRADITIONS,
      contributor = "Laura Vitale",
      servings = "8 servings",
      prepTime = "30 mins",
      cookTime = "1 hr",
      ingredients = listOf(
        RecipeIngredient("2 1/2 cups all-purpose flour", "flour"),
        RecipeIngredient("1/4 cup + 2 tbsp olive oil", "olive oil"),
        RecipeIngredient("1/2 cup ice water", "water"),
        RecipeIngredient("2 boxes (10 oz each) frozen spinach, thawed and squeezed dry", "spinach"),
        RecipeIngredient("1/2 yellow onion, finely chopped", "onion"),
        RecipeIngredient("1 lb whole milk ricotta cheese", "ricotta"),
        RecipeIngredient("1/2 cup Parmigiano Reggiano, freshly grated", "parmesan"),
        RecipeIngredient("6 large eggs (2 for filling, 4 cracked whole inside)", "eggs"),
        RecipeIngredient("Pinch of dried oregano, salt, and black pepper", "salt")
      ),
      instructions = listOf(
        "Make crust: Pulse flour, salt, and 1/4 cup olive oil in food processor; add ice water until dough forms a ball. Chill 1 hour.",
        "Make filling: Sauté onion and spinach in 2 tbsp olive oil with salt for 2 minutes; cool. Stir in ricotta, 2 beaten eggs, Parmigiano, oregano, and pepper.",
        "Roll out 2/3 of dough to line bottom and sides of a 9-inch springform pan.",
        "Fill with spinach-ricotta mixture. Make 4 deep wells in filling and crack 1 whole raw egg into each well.",
        "Roll out remaining dough, place on top, crimp edges tightly, cut a small vent slit, and brush with olive oil.",
        "Bake at 400°F for about 1 hour until deeply golden brown.",
        "Cool completely before un-molding and slicing to reveal the whole baked egg cross-section."
      ),
      notes = "The classic Italian Easter masterpiece symbolising rebirth, with beautiful baked whole eggs revealed inside each slice.",
      tags = listOf("Holiday", "Easter", "Ricotta", "Spinach", "Eggs", "Pie")
    ),
    Recipe(
      id = "fiadone_easter",
      title = "Fiadone Easter Mini Ricotta Pies",
      italianTitle = "Fiadoni Dolci di Pasqua",
      cookbookPage = 291,
      category = RecipeCategory.HOLIDAY_TRADITIONS,
      contributor = "Bruna Sabusco",
      servings = "36 mini pies",
      prepTime = "40 mins",
      cookTime = "45 mins",
      ingredients = listOf(
        RecipeIngredient("4 cups all-purpose flour (568 g)", "flour"),
        RecipeIngredient("6 eggs (for dough)", "eggs"),
        RecipeIngredient("6 tbsp sugar + 6 tbsp vegetable oil", "sugar"),
        RecipeIngredient("900 grams (2 lb) whole milk ricotta, strained overnight", "ricotta"),
        RecipeIngredient("6 tbsp sugar (for filling)", "sugar"),
        RecipeIngredient("2 eggs, lightly beaten (for filling)", "eggs"),
        RecipeIngredient("2 egg yolks with 1 tsp milk (egg wash)", "eggs")
      ),
      instructions = listOf(
        "Make dough: Whisk 6 eggs with 6 tbsp sugar and oil; knead in flour until soft, smooth dough forms. Rest covered 1 hour.",
        "Make filling: Mix strained dry ricotta with 6 tbsp sugar and 2 beaten eggs until creamy.",
        "Roll dough thinly to 1/16-inch thick. Cut out 6-inch circles.",
        "Place 1 tablespoon ricotta filling on each circle, fold over into half-moons, and seal edges tightly with fork tines.",
        "Brush tops with egg yolk wash. With scissors, make three small steam vents in each pie.",
        "Bake at 350°F for 20 minutes, then lower heat to 325°F and bake 25-30 minutes until golden brown.",
        "Cool on wire racks. Can be frozen and enjoyed throughout Easter."
      ),
      notes = "Bruna Sabusco's cherished recipe. Savory cheese variation uses grated Pecorino, Caciotta, and parsley.",
      tags = listOf("Holiday", "Easter", "Ricotta", "Pies", "Calabrese"),
      originalPhotoCaption = "Fiadone egg washed and cut, ready for baking; Baked Fiadone ready for serving",
      originalPhotoPage = 292
    ),
    Recipe(
      id = "samanthas_s_cookies",
      title = "Samantha's S Cookies",
      italianTitle = "Biscotti a 'S' delle Feste",
      cookbookPage = 234,
      category = RecipeCategory.COOKIES_AND_BISCOTTI,
      contributor = "Samantha Jovanovich",
      servings = "30-40 cookies",
      prepTime = "20 mins",
      cookTime = "15 mins",
      ingredients = listOf(
        RecipeIngredient("3 cups (750 mL) all-purpose flour", "flour"),
        RecipeIngredient("3 eggs", "eggs"),
        RecipeIngredient("1 cup (250 mL) granulated sugar", "sugar"),
        RecipeIngredient("1/2 cup (125 mL) vegetable oil", "oil"),
        RecipeIngredient("2 tsp (10 mL) baking powder", "baking powder"),
        RecipeIngredient("2 tsp ground cinnamon mixed with 1/3 cup sugar or colored sprinkles", "cinnamon sugar")
      ),
      instructions = listOf(
        "Preheat oven to 350°F (180°C). Grease or line cookie sheet with parchment paper.",
        "In a small bowl, combine cinnamon and 1/3 cup sugar for coating.",
        "In a large bowl, combine eggs, 1 cup sugar, and oil. Add flour and baking powder; mix well.",
        "Divide dough into two loaves. Cut 1/3 inch slices (or use 1 tablespoon of dough for each cookie).",
        "Roll dough into a rope about 1 cm in diameter and 5 inches long.",
        "Shape each roll into an 'S' shape.",
        "Drop upside down in cinnamon-sugar mixture or colored sprinkles.",
        "Place on parchment paper-lined cookie sheet. Bake for 12-15 minutes until golden.",
        "Cool on wire racks."
      ),
      notes = "A wonderful family tradition for kids of all generations to roll, shape, and decorate together.",
      tags = listOf("Cookies", "S Cookies", "Samantha", "Kids Baking", "Heirloom"),
      originalPhotoCaption = "S Cookies shaped by kids with cinnamon sugar",
      originalPhotoPage = 234
    )
  )
}
