package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface CookbookDao {
  // Favorites
  @Query("SELECT * FROM favorite_recipes ORDER BY savedAt DESC")
  fun getAllFavorites(): Flow<List<FavoriteEntity>>

  @Query("SELECT EXISTS(SELECT 1 FROM favorite_recipes WHERE recipeId = :recipeId)")
  fun isFavorite(recipeId: String): Flow<Boolean>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun insertFavorite(favorite: FavoriteEntity)

  @Query("DELETE FROM favorite_recipes WHERE recipeId = :recipeId")
  suspend fun deleteFavorite(recipeId: String)

  // Pantry
  @Query("SELECT * FROM pantry_items ORDER BY addedAt DESC")
  fun getAllPantryItems(): Flow<List<PantryItemEntity>>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun insertPantryItem(item: PantryItemEntity)

  @Query("DELETE FROM pantry_items WHERE name = :name")
  suspend fun deletePantryItem(name: String)

  @Query("DELETE FROM pantry_items")
  suspend fun clearAllPantryItems()

  // Notes
  @Query("SELECT note FROM recipe_notes WHERE recipeId = :recipeId")
  fun getNoteForRecipe(recipeId: String): Flow<String?>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun saveNote(recipeNote: RecipeNoteEntity)

  @Query("DELETE FROM recipe_notes WHERE recipeId = :recipeId")
  suspend fun deleteNote(recipeId: String)

  // Ratings
  @Query("SELECT * FROM recipe_ratings")
  fun getAllRatings(): Flow<List<RecipeRatingEntity>>

  @Query("SELECT rating FROM recipe_ratings WHERE recipeId = :recipeId")
  fun getRatingForRecipe(recipeId: String): Flow<Int?>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun saveRating(rating: RecipeRatingEntity)

  // Photos
  @Query("SELECT * FROM recipe_photos")
  fun getAllPhotos(): Flow<List<RecipePhotoEntity>>

  @Query("SELECT photoUri FROM recipe_photos WHERE recipeId = :recipeId")
  fun getPhotoForRecipe(recipeId: String): Flow<String?>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun savePhoto(photo: RecipePhotoEntity)

  @Query("DELETE FROM recipe_photos WHERE recipeId = :recipeId")
  suspend fun deletePhoto(recipeId: String)
}
