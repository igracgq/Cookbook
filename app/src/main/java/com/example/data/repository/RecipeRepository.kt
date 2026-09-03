package com.example.data.repository

import com.example.data.local.CookbookDao
import com.example.data.local.FavoriteEntity
import com.example.data.local.PantryItemEntity
import com.example.data.local.RecipeNoteEntity
import com.example.data.model.MatchResult
import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class RecipeRepository(private val cookbookDao: CookbookDao) {

  val allRecipes: List<Recipe> = CookbookDataSource.allRecipes

  val favoriteRecipeIds: Flow<Set<String>> =
    cookbookDao.getAllFavorites().map { list -> list.map { it.recipeId }.toSet() }

  val pantryItems: Flow<List<PantryItemEntity>> =
    cookbookDao.getAllPantryItems()

  fun isFavorite(recipeId: String): Flow<Boolean> =
    cookbookDao.isFavorite(recipeId)

  suspend fun toggleFavorite(recipeId: String, currentIsFav: Boolean) {
    if (currentIsFav) {
      cookbookDao.deleteFavorite(recipeId)
    } else {
      cookbookDao.insertFavorite(FavoriteEntity(recipeId = recipeId))
    }
  }

  suspend fun addPantryItem(name: String, category: String = "Pantry") {
    val clean = name.trim().lowercase()
    if (clean.isNotEmpty()) {
      cookbookDao.insertPantryItem(PantryItemEntity(name = clean, category = category))
    }
  }

  suspend fun removePantryItem(name: String) {
    cookbookDao.deletePantryItem(name.trim().lowercase())
  }

  suspend fun clearPantry() {
    cookbookDao.clearAllPantryItems()
  }

  fun getRecipeNote(recipeId: String): Flow<String?> =
    cookbookDao.getNoteForRecipe(recipeId)

  suspend fun saveRecipeNote(recipeId: String, note: String) {
    if (note.trim().isEmpty()) {
      cookbookDao.deleteNote(recipeId)
    } else {
      cookbookDao.saveNote(RecipeNoteEntity(recipeId = recipeId, note = note.trim()))
    }
  }

  val allRatings: Flow<Map<String, Int>> =
    cookbookDao.getAllRatings().map { list -> list.associate { it.recipeId to it.rating } }

  suspend fun saveRecipeRating(recipeId: String, rating: Int) {
    cookbookDao.saveRating(com.example.data.local.RecipeRatingEntity(recipeId = recipeId, rating = rating))
  }

  fun search(query: String, category: RecipeCategory? = null): List<Recipe> {
    return CookbookDataSource.searchRecipes(query, category)
  }

  fun matchWithPantry(pantryNames: Set<String>): List<MatchResult> {
    return CookbookDataSource.matchByIngredients(pantryNames)
  }

  fun getAlphabeticallySortedRecipes(): List<Recipe> {
    return allRecipes.sortedWith(compareBy(String.CASE_INSENSITIVE_ORDER) { it.title.trim() })
  }

  fun getAlphabeticalIndex(): Map<Char, List<Recipe>> {
    return CookbookDataSource.getRecipesByLetter()
  }

  fun getCategoryIndex(): Map<RecipeCategory, List<Recipe>> {
    return CookbookDataSource.getRecipesByCategory()
  }

  fun getRecipeById(id: String): Recipe? {
    return CookbookDataSource.findRecipeById(id)
  }
}
