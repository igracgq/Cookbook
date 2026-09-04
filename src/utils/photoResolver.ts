import { Recipe, RecipeCategory } from '../types';

export function getHeritagePhotoUrl(recipe: Recipe): string {
  const id = recipe.id.toLowerCase();
  const title = recipe.title.toLowerCase();

  // Specific matching logic identical to Android RecipePhotoResolver.kt
  if (id.includes('taralle') || id.includes('taralli') || title.includes('tarall')) {
    return '/images/heritage_taralli.jpg';
  }
  if (id.includes('gnocchi') || title.includes('gnocchi')) {
    return '/images/heritage_gnocchi.jpg';
  }
  if (id.includes('pizza') || title.includes('pizza') || id.includes('calzone')) {
    return '/images/heritage_pizza.jpg';
  }
  if (id.includes('lasagna') || title.includes('lasagna')) {
    return '/images/heritage_lasagna.jpg';
  }
  if (id.includes('bruschetta') || title.includes('bruschetta') || id.includes('crostini')) {
    return '/images/heritage_bruschetta.jpg';
  }
  if (id.includes('eggplant') || id.includes('melanzane') || title.includes('eggplant') || title.includes('parmigiana')) {
    return '/images/heritage_eggplant.jpg';
  }
  if (id.includes('cannoli') || title.includes('cannoli')) {
    return '/images/heritage_cannoli.jpg';
  }
  if (id.includes('tiramisu') || title.includes('tiramisu')) {
    return '/images/heritage_tiramisu.jpg';
  }
  if (id.includes('polenta') || title.includes('polenta')) {
    return '/images/heritage_polenta.jpg';
  }
  if (id.includes('wine') || title.includes('wine')) {
    return '/images/heritage_wine.jpg';
  }
  if (id.includes('pepper') || id.includes('olive') || id.includes('peperoncino') || id.includes('cantina')) {
    return '/images/heritage_calabrese_peppers.jpg';
  }
  if (
    id.includes('sausage') || id.includes('salami') || id.includes('salumi') || id.includes('soppressata') ||
    id.includes('capicollo') || id.includes('prosciutto') || id.includes('pancetta')
  ) {
    return '/images/heritage_cured_meats.jpg';
  }
  if (
    id.includes('scalille') || id.includes('turdilli') || id.includes('pizzelle') || id.includes('biscotti') ||
    id.includes('cookie') || id.includes('cuddruriaddri') || id.includes('cullurielli') || id.includes('anise')
  ) {
    return '/images/heritage_cookies.jpg';
  }
  if (
    id.includes('bread') || id.includes('focaccia') || id.includes('brioche') || id.includes('pane') || id.includes('cucullo')
  ) {
    return '/images/heritage_bread.jpg';
  }
  if (id.includes('meatball') || id.includes('polpette')) {
    return '/images/heritage_meatballs.jpg';
  }
  if (
    id.includes('cuccia') || id.includes('soup') || id.includes('minestrone') || id.includes('broth') ||
    id.includes('lentil') || id.includes('stracciatella')
  ) {
    return '/images/heritage_soup.jpg';
  }
  if (
    id.includes('baccal') || id.includes('fish') || id.includes('salmon') || id.includes('shrimp') || id.includes('calamari')
  ) {
    return '/images/heritage_seafood.jpg';
  }
  if (id.includes('salad') || id.includes('cucumber') || id.includes('insalata')) {
    return '/images/heritage_salad.jpg';
  }
  if (
    id.includes('lamb') || id.includes('roast') || id.includes('cotoletta') || id.includes('chicken') ||
    id.includes('pork') || id.includes('beef') || id.includes('steak') || id.includes('brasato')
  ) {
    return '/images/heritage_roast.jpg';
  }
  if (
    id.includes('pastiera') || id.includes('fiadone') || id.includes('ricotta_pie') || id.includes('puff') ||
    id.includes('crostata') || id.includes('cake') || id.includes('dolce')
  ) {
    return '/images/heritage_dessert.jpg';
  }
  if (
    id.includes('pasta') || id.includes('spaghetti') || id.includes('fettuccine') || id.includes('cannelloni') ||
    id.includes('tagliatelle') || id.includes('carbonara') || id.includes('penne') || id.includes('rigatoni')
  ) {
    return '/images/heritage_pasta.jpg';
  }

  // Category fallback
  switch (recipe.category) {
    case RecipeCategory.APPETIZERS:
      return '/images/heritage_bruschetta.jpg';
    case RecipeCategory.PASTA_AND_SAUCES:
    case RecipeCategory.BAKED_PASTA:
      return '/images/heritage_pasta.jpg';
    case RecipeCategory.SOUPS:
      return '/images/heritage_soup.jpg';
    case RecipeCategory.MEATS:
      return '/images/heritage_roast.jpg';
    case RecipeCategory.SEAFOOD:
      return '/images/heritage_seafood.jpg';
    case RecipeCategory.VEGETABLES:
      return '/images/heritage_eggplant.jpg';
    case RecipeCategory.SALADS:
      return '/images/heritage_salad.jpg';
    case RecipeCategory.BREADS_AND_PIZZA:
      return '/images/heritage_pizza.jpg';
    case RecipeCategory.COOKIES_AND_BISCOTTI:
    case RecipeCategory.HOLIDAY_TRADITIONS:
      return '/images/heritage_cookies.jpg';
    case RecipeCategory.CAKES_AND_DESSERTS:
    case RecipeCategory.TARTS_AND_PIES:
      return '/images/heritage_dessert.jpg';
    case RecipeCategory.EGGS:
    case RecipeCategory.PICKLING:
      return '/images/heritage_calabrese_peppers.jpg';
    default:
      return '/images/heritage_pasta.jpg';
  }
}
