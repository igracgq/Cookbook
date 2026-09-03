package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Restaurant
import androidx.compose.ui.platform.LocalContext
import androidx.compose.material3.Badge
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.SubcomposeAsyncImage
import com.example.data.model.DifficultyLevel
import com.example.data.model.Recipe
import com.example.data.model.RecipeCategory
import com.example.data.model.SpiceLevel
import com.example.ui.components.CulinaryMonochromeBackground
import com.example.ui.theme.CursiveHeritageFontFamily
import com.example.ui.theme.SerifHeritageFontFamily
import com.example.ui.util.RecipePhotoResolver
import com.example.ui.viewmodel.CookbookViewModel
import com.example.ui.viewmodel.RecipeQuickFilter
import com.example.ui.viewmodel.ScreenDestination

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun RecipeListScreen(
  viewModel: CookbookViewModel,
  modifier: Modifier = Modifier
) {
  val recipes by viewModel.filteredRecipes.collectAsStateWithLifecycle()
  val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
  val selectedCategory by viewModel.selectedCategory.collectAsStateWithLifecycle()
  val selectedFilter by viewModel.selectedFilter.collectAsStateWithLifecycle()
  val selectedDifficulty by viewModel.selectedDifficulty.collectAsStateWithLifecycle()
  val favorites by viewModel.favoriteRecipeIds.collectAsStateWithLifecycle()
  val customPhotos by viewModel.customRecipePhotos.collectAsStateWithLifecycle()

  Box(modifier = modifier.fillMaxSize()) {
    CulinaryMonochromeBackground(
      modifier = Modifier.fillMaxSize(),
      alpha = 0.05f
    )

    LazyColumn(
      modifier = Modifier
        .fillMaxSize()
        .testTag("recipe_list_column"),
      contentPadding = PaddingValues(bottom = 96.dp)
    ) {
    // Cookbook Header Banner
    item {
      CookbookHeroHeader()
    }

    // Search Box - Sleek Interface style
    item {
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 6.dp)
      ) {
        OutlinedTextField(
          value = searchQuery,
          onValueChange = { viewModel.onSearchQueryChanged(it) },
          modifier = Modifier
            .fillMaxWidth()
            .testTag("recipe_search_input"),
          placeholder = {
            Text(
              "Search 1,200+ recipes, ingredients, family members...",
              color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
              fontSize = 14.sp
            )
          },
          leadingIcon = {
            Icon(
              imageVector = Icons.Default.Search,
              contentDescription = "Search icon",
              tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
          },
          trailingIcon = {
            if (searchQuery.isNotEmpty()) {
              IconButton(
                onClick = { viewModel.onSearchQueryChanged("") },
                modifier = Modifier.testTag("clear_search_button")
              ) {
                Icon(
                  imageVector = Icons.Default.Clear,
                  contentDescription = "Clear search",
                  tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
              }
            }
          },
          shape = RoundedCornerShape(16.dp),
          colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
            unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
            focusedBorderColor = MaterialTheme.colorScheme.primary,
            unfocusedBorderColor = Color.Transparent
          ),
          singleLine = true
        )
      }
    }

    // Quick Filter Chips (All, Favorites, Spicy, Easy, Family Classics, Vegetarian, Quick)
    item {
      Column(modifier = Modifier.padding(top = 4.dp, bottom = 4.dp)) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            text = "QUICK FILTERS",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }

        Row(
          modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 2.dp),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          RecipeQuickFilter.values().forEach { filter ->
            val isSelected = selectedFilter == filter
            Surface(
              modifier = Modifier
                .clip(CircleShape)
                .clickable { viewModel.onFilterSelected(filter) }
                .testTag("filter_chip_${filter.name}"),
              color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.primaryContainer,
              shape = CircleShape
            ) {
              Row(
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp),
                verticalAlignment = Alignment.CenterVertically
              ) {
                if (isSelected) {
                  Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(14.dp)
                  )
                  Spacer(modifier = Modifier.width(6.dp))
                }
                Text(
                  text = if (filter == RecipeQuickFilter.FAVORITES && favorites.isNotEmpty()) {
                    "Favorites (${favorites.size})"
                  } else {
                    filter.label
                  },
                  fontSize = 12.sp,
                  fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                  color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onPrimaryContainer
                )
              }
            }
          }
        }
      }
    }

    // Difficulty Filter Selector Bar
    item {
      Column(modifier = Modifier.padding(top = 4.dp, bottom = 4.dp)) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          Text(
            text = "DIFFICULTY LEVEL",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
          if (selectedDifficulty != null) {
            TextButton(
              onClick = { viewModel.onDifficultySelected(null) },
              contentPadding = PaddingValues(0.dp)
            ) {
              Text(
                "Clear",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary
              )
            }
          }
        }

        Row(
          modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 2.dp),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          DifficultyLevel.values().forEach { diff ->
            val isSelected = selectedDifficulty == diff
            Surface(
              modifier = Modifier
                .clip(CircleShape)
                .clickable { viewModel.onDifficultySelected(diff) }
                .testTag("diff_chip_${diff.name}"),
              color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
              shape = CircleShape
            ) {
              Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
              ) {
                if (isSelected) {
                  Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(13.dp)
                  )
                  Spacer(modifier = Modifier.width(5.dp))
                }
                Text(
                  text = "${"●".repeat(diff.dots)} ${diff.label}",
                  fontSize = 12.sp,
                  fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                  color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                )
              }
            }
          }
        }
      }
    }

    // Category Selector Bar
    item {
      Column(modifier = Modifier.padding(top = 6.dp, bottom = 8.dp)) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          Text(
            text = "BROWSE CATEGORIES",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
          if (selectedCategory != null) {
            TextButton(
              onClick = { viewModel.onCategorySelected(null) },
              contentPadding = PaddingValues(0.dp)
            ) {
              Text(
                "Clear",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary
              )
            }
          }
        }

        Row(
          modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 2.dp),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          RecipeCategory.values().forEach { cat ->
            val isSelected = selectedCategory == cat
            Surface(
              modifier = Modifier
                .clip(CircleShape)
                .clickable { viewModel.onCategorySelected(cat) }
                .testTag("category_chip_${cat.name}"),
              color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
              shape = CircleShape
            ) {
              Row(
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp),
                verticalAlignment = Alignment.CenterVertically
              ) {
                if (isSelected) {
                  Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(13.dp)
                  )
                  Spacer(modifier = Modifier.width(5.dp))
                }
                Text(
                  text = cat.displayName,
                  fontSize = 12.sp,
                  fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                  color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                )
              }
            }
          }
        }
      }
    }

    // Results Header Count
    item {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Text(
          text = if (selectedCategory != null) {
            "${selectedCategory?.displayName} (${recipes.size})"
          } else if (searchQuery.isNotEmpty()) {
            "Search Results (${recipes.size})"
          } else {
            "All Heritage Recipes (${recipes.size})"
          },
          style = MaterialTheme.typography.titleSmall,
          color = MaterialTheme.colorScheme.onSurface,
          fontWeight = FontWeight.SemiBold
        )
      }
    }

    // Empty state
    if (recipes.isEmpty()) {
      item {
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
          contentAlignment = Alignment.Center
        ) {
          Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
          ) {
            Icon(
              imageVector = Icons.Outlined.Restaurant,
              contentDescription = null,
              modifier = Modifier.size(56.dp),
              tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.6f)
            )
            Text(
              text = "No recipes found matching your filters.",
              style = MaterialTheme.typography.bodyLarge,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            TextButton(
              onClick = {
                viewModel.onSearchQueryChanged("")
                viewModel.onCategorySelected(null)
                viewModel.onFilterSelected(RecipeQuickFilter.ALL)
              }
            ) {
              Text(
                "Reset all filters",
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.SemiBold
              )
            }
          }
        }
      }
    }

    // Recipe List Items
    items(recipes, key = { it.id }) { recipe ->
      val isFav = favorites.contains(recipe.id)
      RecipeCard(
        recipe = recipe,
        customPhotoUri = customPhotos[recipe.id],
        isFavorite = isFav,
        onFavoriteToggle = { viewModel.toggleFavorite(recipe.id) },
        onClick = { viewModel.navigateTo(ScreenDestination.Detail(recipe.id)) }
      )
    }
  }
}
}

@Composable
fun CookbookHeroHeader() {
  Card(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp, vertical = 10.dp),
    shape = RoundedCornerShape(24.dp),
    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(18.dp)
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column(modifier = Modifier.weight(1f)) {
          Text(
            text = "Heritage Cookbook",
            fontFamily = CursiveHeritageFontFamily,
            fontSize = 38.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
          )
          Text(
            text = "Ruffolo • Vitale Family Legacy",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }

        Box(
          modifier = Modifier
            .size(42.dp)
            .clip(CircleShape)
            .background(MaterialTheme.colorScheme.primaryContainer)
            .border(1.dp, MaterialTheme.colorScheme.outline, CircleShape),
          contentAlignment = Alignment.Center
        ) {
          Icon(
            imageVector = Icons.Default.MenuBook,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(20.dp)
          )
        }
      }

      Spacer(modifier = Modifier.height(10.dp))

      Text(
        text = "A preserved collection of traditional & modified family recipes across generations, from Rosina Puntillo Ruffolo & Elvira Ruffolo Filice.",
        fontSize = 12.sp,
        lineHeight = 18.sp,
        color = MaterialTheme.colorScheme.onSurfaceVariant
      )
    }
  }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun RecipeCard(
  recipe: Recipe,
  customPhotoUri: String? = null,
  isFavorite: Boolean,
  onFavoriteToggle: () -> Unit,
  onClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  Card(
    modifier = modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp, vertical = 5.dp)
      .clickable { onClick() }
      .testTag("recipe_card_${recipe.id}"),
    shape = RoundedCornerShape(24.dp),
    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
  ) {
    val context = LocalContext.current
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(12.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      // Sleek square leading photo container
      Box(
        modifier = Modifier
          .size(72.dp)
          .clip(RoundedCornerShape(16.dp))
          .background(MaterialTheme.colorScheme.primaryContainer),
        contentAlignment = Alignment.Center
      ) {
        if (customPhotoUri != null) {
          SubcomposeAsyncImage(
            model = customPhotoUri,
            contentDescription = "Photo of ${recipe.title}",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
          )
        } else {
          Image(
            painter = painterResource(id = RecipePhotoResolver.getHeritageDrawableRes(context, recipe)),
            contentDescription = "Photo of ${recipe.title}",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
          )
        }

        // Archival badge indicator if recipe has photo from PDF
        if (recipe.originalPhotoCaption.isNotEmpty() && customPhotoUri == null) {
          Surface(
            shape = RoundedCornerShape(topStart = 8.dp),
            color = Color(0xDD261D16),
            modifier = Modifier
              .align(Alignment.BottomEnd)
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
            ) {
              Icon(
                imageVector = Icons.Default.CameraAlt,
                contentDescription = null,
                tint = Color(0xFFDFC6A6),
                modifier = Modifier.size(10.dp)
              )
              Spacer(modifier = Modifier.width(2.dp))
              Text(
                text = "Family",
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFFAF7F2)
              )
            }
          }
        }
      }

      Spacer(modifier = Modifier.width(12.dp))

      Column(modifier = Modifier.weight(1f)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            text = recipe.title,
            style = MaterialTheme.typography.titleMedium,
            fontFamily = SerifHeritageFontFamily,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f)
          )

          IconButton(
            onClick = onFavoriteToggle,
            modifier = Modifier
              .size(32.dp)
              .testTag("fav_button_${recipe.id}")
          ) {
            Icon(
              imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
              contentDescription = if (isFavorite) "Remove from favorites" else "Add to favorites",
              tint = if (isFavorite) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline,
              modifier = Modifier.size(18.dp)
            )
          }
        }

        if (recipe.italianTitle.isNotEmpty() && !recipe.italianTitle.equals(recipe.title, ignoreCase = true)) {
          Text(
            text = recipe.italianTitle,
            fontSize = 12.sp,
            fontStyle = FontStyle.Italic,
            color = MaterialTheme.colorScheme.primary,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
          )
        }

        Spacer(modifier = Modifier.height(3.dp))

        Text(
          text = "${recipe.prepTime} • ${recipe.ingredients.size} ingredients • ${recipe.contributor}",
          fontSize = 12.sp,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(6.dp))

        // Sleek badge tags: Category, Contributor, Difficulty, Spice, Nutrition
        Row(
          horizontalArrangement = Arrangement.spacedBy(4.dp),
          verticalAlignment = Alignment.CenterVertically,
          modifier = Modifier.horizontalScroll(rememberScrollState())
        ) {
          Surface(
            color = MaterialTheme.colorScheme.surfaceVariant,
            shape = RoundedCornerShape(6.dp)
          ) {
            Text(
              text = recipe.category.displayName,
              fontSize = 10.sp,
              fontWeight = FontWeight.Medium,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
              modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
          }

          // Difficulty Badge
          Surface(
            color = MaterialTheme.colorScheme.primaryContainer,
            shape = RoundedCornerShape(6.dp)
          ) {
            Text(
              text = "${"●".repeat(recipe.calculatedDifficulty.dots)} ${recipe.calculatedDifficulty.label}",
              fontSize = 10.sp,
              fontWeight = FontWeight.SemiBold,
              color = MaterialTheme.colorScheme.onPrimaryContainer,
              modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
          }

          // Spicy Badge
          val spice = recipe.calculatedSpiceLevel
          Surface(
            color = if (spice != SpiceLevel.MILD) MaterialTheme.colorScheme.secondaryContainer else MaterialTheme.colorScheme.surfaceVariant,
            shape = RoundedCornerShape(6.dp)
          ) {
            Text(
              text = "${spice.chiliIcon} ${spice.label}",
              fontSize = 10.sp,
              fontWeight = FontWeight.Medium,
              color = if (spice != SpiceLevel.MILD) MaterialTheme.colorScheme.onSecondaryContainer else MaterialTheme.colorScheme.onSurfaceVariant,
              modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
          }

          // Nutrition Calories
          Surface(
            color = MaterialTheme.colorScheme.surfaceVariant,
            shape = RoundedCornerShape(6.dp)
          ) {
            Text(
              text = "${recipe.calculatedNutrition.calories} kcal",
              fontSize = 10.sp,
              fontWeight = FontWeight.Medium,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
              modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
          }
        }
      }
    }
  }
}
