package com.example.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "favorite_recipes")
data class FavoriteEntity(
  @PrimaryKey val recipeId: String,
  val savedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "pantry_items")
data class PantryItemEntity(
  @PrimaryKey val name: String,
  val category: String = "Pantry",
  val addedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "recipe_notes")
data class RecipeNoteEntity(
  @PrimaryKey val recipeId: String,
  val note: String,
  val updatedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "recipe_ratings")
data class RecipeRatingEntity(
  @PrimaryKey val recipeId: String,
  val rating: Int,
  val ratedAt: Long = System.currentTimeMillis()
)
