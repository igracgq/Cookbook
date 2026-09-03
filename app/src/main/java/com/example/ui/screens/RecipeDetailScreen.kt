package com.example.ui.screens

import android.content.Context
import android.content.Intent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
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
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AddShoppingCart
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.FormatQuote
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.NoteAdd
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.PanTool
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Print
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import com.example.ui.components.RecipeHeroPhotoCard
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.DifficultyLevel
import com.example.data.model.NutritionInfo
import com.example.data.model.Recipe
import com.example.data.model.SpiceLevel
import com.example.data.repository.CookbookDataSource
import com.example.ui.components.CulinaryMonochromeBackground
import com.example.ui.components.HandsFreeCookingDialog
import com.example.ui.components.PrintExportBookDialog
import com.example.ui.viewmodel.CookbookViewModel
import com.example.util.IngredientScaler
import com.example.util.UnitSystem
import kotlinx.coroutines.launch
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun RecipeDetailScreen(
  recipeId: String,
  viewModel: CookbookViewModel,
  modifier: Modifier = Modifier
) {
  val context = LocalContext.current
  val recipe = viewModel.getRecipeById(recipeId)
  val favorites by viewModel.favoriteRecipeIds.collectAsStateWithLifecycle()
  val isFavorite = favorites.contains(recipeId)
  val checkedIngredients by viewModel.checkedIngredients.collectAsStateWithLifecycle()
  val multiplier by viewModel.servingMultiplier.collectAsStateWithLifecycle()
  val unitSystem by viewModel.unitSystem.collectAsStateWithLifecycle()
  val userRatings by viewModel.userRatings.collectAsStateWithLifecycle()
  val isHandsFree by viewModel.isHandsFreeActive.collectAsStateWithLifecycle()
  val handsFreeStep by viewModel.handsFreeStepIndex.collectAsStateWithLifecycle()
  val isPrintExport by viewModel.isPrintExportOpen.collectAsStateWithLifecycle()
  val activeNote by viewModel.activeRecipeNote.collectAsStateWithLifecycle()
  val timerSeconds by viewModel.timerSecondsRemaining.collectAsStateWithLifecycle()
  val timerTotalSeconds by viewModel.timerTotalSeconds.collectAsStateWithLifecycle()
  val isTimerRunning by viewModel.isTimerRunning.collectAsStateWithLifecycle()
  val isTimerAlert by viewModel.isTimerAlertTriggered.collectAsStateWithLifecycle()
  val timerLabel by viewModel.timerLabel.collectAsStateWithLifecycle()
  val spiceCustomization by viewModel.recipeSpiceCustomization.collectAsStateWithLifecycle()
  val customPhotos by viewModel.customRecipePhotos.collectAsStateWithLifecycle()

  var noteEditText by remember { mutableStateOf("") }
  val snackbarHostState = remember { SnackbarHostState() }
  val scope = rememberCoroutineScope()

  LaunchedEffect(recipeId) {
    viewModel.loadRecipeNotes(recipeId)
  }

  LaunchedEffect(activeNote) {
    noteEditText = activeNote
  }

  if (recipe == null) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
      Text("Recipe not found.", color = MaterialTheme.colorScheme.onSurface)
    }
    return
  }

  val effectiveSpice = spiceCustomization[recipe.id] ?: recipe.calculatedSpiceLevel
  val difficulty = recipe.calculatedDifficulty
  val baseNutrition = recipe.calculatedNutrition
  val (effectiveRating, ratingCount) = viewModel.getEffectiveRating(recipe)
  val myRating = userRatings[recipe.id]

  if (isHandsFree) {
    HandsFreeCookingDialog(
      recipe = recipe,
      currentStepIndex = handsFreeStep,
      onStepChanged = { viewModel.setHandsFreeStep(it) },
      onDismiss = { viewModel.closeHandsFree() },
      onStartTimerMinutes = { mins, lbl -> viewModel.startTimer(mins, lbl) }
    )
  }

  if (isPrintExport) {
    PrintExportBookDialog(
      currentRecipe = recipe,
      allRecipes = CookbookDataSource.allRecipes,
      favoriteRecipeIds = favorites,
      onDismiss = { viewModel.closePrintExport() }
    )
  }

  Scaffold(
    snackbarHost = { SnackbarHost(snackbarHostState) },
    topBar = {
      TopAppBar(
        title = {
          Text(
            text = recipe.category.displayName,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium
          )
        },
        navigationIcon = {
          IconButton(
            onClick = { viewModel.navigateBack() },
            modifier = Modifier.testTag("detail_back_button")
          ) {
            Icon(
              imageVector = Icons.AutoMirrored.Filled.ArrowBack,
              contentDescription = "Back"
            )
          }
        },
        actions = {
          // Hands-free kitchen cooking action
          IconButton(
            onClick = { viewModel.openHandsFree(0) },
            modifier = Modifier.testTag("detail_hands_free_button")
          ) {
            Icon(
              imageVector = Icons.Default.Mic,
              contentDescription = "Hands-Free Kitchen Mode",
              tint = MaterialTheme.colorScheme.primary
            )
          }

          // Share recipe action
          IconButton(
            onClick = {
              shareRecipeDetails(context, recipe, multiplier, unitSystem)
            },
            modifier = Modifier.testTag("detail_share_button")
          ) {
            Icon(
              imageVector = Icons.Default.Share,
              contentDescription = "Share Recipe",
              tint = MaterialTheme.colorScheme.onSurface
            )
          }

          // Print & PDF Keepsake export action
          IconButton(
            onClick = { viewModel.openPrintExport(recipe.id) },
            modifier = Modifier.testTag("detail_print_button")
          ) {
            Icon(
              imageVector = Icons.Default.Print,
              contentDescription = "Export Print Book",
              tint = MaterialTheme.colorScheme.onSurface
            )
          }

          // Favorite button
          IconButton(
            onClick = { viewModel.toggleFavorite(recipe.id) },
            modifier = Modifier.testTag("detail_fav_button")
          ) {
            Icon(
              imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
              contentDescription = "Favorite",
              tint = if (isFavorite) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
            )
          }
        },
        colors = TopAppBarDefaults.topAppBarColors(
          containerColor = MaterialTheme.colorScheme.surface
        )
      )
    }
  ) { paddingValues ->
    Box(
      modifier = modifier
        .fillMaxSize()
        .padding(paddingValues)
    ) {
      CulinaryMonochromeBackground(
        modifier = Modifier.fillMaxSize(),
        alpha = 0.05f
      )

      LazyColumn(
        modifier = Modifier
          .fillMaxSize()
          .testTag("recipe_detail_column"),
        contentPadding = PaddingValues(bottom = 96.dp)
      ) {
      // Recipe Title & Header Section
      item {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            Surface(
              color = MaterialTheme.colorScheme.primaryContainer,
              shape = CircleShape
            ) {
              Text(
                text = recipe.category.displayName,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
              )
            }

            Surface(
              color = MaterialTheme.colorScheme.surfaceVariant,
              shape = CircleShape
            ) {
              Text(
                text = "${recipe.calculatedDifficulty.label} • ${recipe.servings}",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
              )
            }
          }

          Spacer(modifier = Modifier.height(10.dp))

          Text(
            text = recipe.title,
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onBackground
          )

          if (recipe.italianTitle.isNotEmpty() && !recipe.italianTitle.equals(recipe.title, ignoreCase = true)) {
            Spacer(modifier = Modifier.height(2.dp))
            Text(
              text = recipe.italianTitle,
              style = MaterialTheme.typography.titleMedium,
              fontStyle = FontStyle.Italic,
              color = MaterialTheme.colorScheme.primary
            )
          }

          Spacer(modifier = Modifier.height(6.dp))

          Text(
            text = "From the kitchen of ${recipe.contributor}",
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.primary
          )

          // Auto-Tagging dietary, cooking speed & main ingredient tags
          if (recipe.autoTags.isNotEmpty()) {
            Spacer(modifier = Modifier.height(10.dp))
            FlowRow(
              horizontalArrangement = Arrangement.spacedBy(6.dp),
              verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
              recipe.autoTags.forEach { tag ->
                Surface(
                  color = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.7f),
                  shape = RoundedCornerShape(8.dp),
                  border = BorderStroke(0.5.dp, MaterialTheme.colorScheme.outlineVariant)
                ) {
                  Text(
                    text = tag,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSecondaryContainer,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                  )
                }
              }
            }
          }
        }
      }

      // Recipe Hero Photo Card (PDF Archival Photo, User Photo, or Heritage Art)
      item {
        RecipeHeroPhotoCard(
          recipe = recipe,
          customPhotoUri = customPhotos[recipe.id],
          isFavorite = isFavorite,
          onToggleFavorite = { viewModel.toggleFavorite(recipe.id) },
          onPhotoSelected = { uri -> viewModel.setCustomRecipePhoto(recipe.id, uri) },
          onPhotoRemoved = { viewModel.removeCustomRecipePhoto(recipe.id) },
          modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
        )
      }

      // Hands-Free Kitchen Mode JUMBO Banner Card
      item {
        Card(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .clickable { viewModel.openHandsFree(0) }
            .testTag("hands_free_banner_button"),
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
          border = BorderStroke(1.5.dp, MaterialTheme.colorScheme.primary)
        ) {
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              modifier = Modifier.weight(1f)
            ) {
              Box(
                modifier = Modifier
                  .size(46.dp)
                  .clip(CircleShape)
                  .background(MaterialTheme.colorScheme.primary),
                contentAlignment = Alignment.Center
              ) {
                Icon(
                  imageVector = Icons.Default.Restaurant,
                  contentDescription = null,
                  tint = Color.White,
                  modifier = Modifier.size(24.dp)
                )
              }

              Spacer(modifier = Modifier.width(14.dp))

              Column {
                Text(
                  text = "Hands-Free Kitchen Mode",
                  style = MaterialTheme.typography.titleMedium,
                  fontWeight = FontWeight.Bold,
                  color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                Text(
                  text = "Cook step-by-step with giant tap buttons & voice control",
                  style = MaterialTheme.typography.bodySmall,
                  color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                )
              }
            }

            Surface(
              shape = RoundedCornerShape(20.dp),
              color = MaterialTheme.colorScheme.primary
            ) {
              Text(
                text = "Cook ▶",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
              )
            }
          }
        }
      }

      // Interactive Recipe Rating Card
      item {
        Card(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .testTag("recipe_rating_card"),
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
          border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
        ) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(14.dp)
          ) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                  text = String.format(Locale.US, "%.1f", effectiveRating),
                  style = MaterialTheme.typography.titleLarge,
                  fontWeight = FontWeight.Bold,
                  color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                  text = "★",
                  fontSize = 22.sp,
                  color = Color(0xFFE5A01D) // Golden Star
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                  text = "($ratingCount reviews)",
                  style = MaterialTheme.typography.bodyMedium,
                  color = MaterialTheme.colorScheme.onSurfaceVariant
                )
              }

              if (myRating != null) {
                Surface(
                  color = MaterialTheme.colorScheme.primaryContainer,
                  shape = RoundedCornerShape(8.dp)
                ) {
                  Text(
                    text = "You: $myRating ★",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                  )
                }
              }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
              text = if (myRating == null) "Tap stars to rate this family recipe:" else "Update your rating:",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(4.dp))

            // 5 Clickable Stars
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceAround,
              verticalAlignment = Alignment.CenterVertically
            ) {
              (1..5).forEach { starIndex ->
                val isSelectedStar = (myRating ?: 0) >= starIndex
                IconButton(
                  onClick = {
                    viewModel.rateRecipe(recipe.id, starIndex)
                    scope.launch {
                      snackbarHostState.showSnackbar("Thank you! Rated $starIndex stars for ${recipe.title}")
                    }
                  },
                  modifier = Modifier
                    .size(44.dp)
                    .testTag("rate_star_$starIndex")
                ) {
                  Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = "Rate $starIndex stars",
                    tint = if (isSelectedStar) Color(0xFFE5A01D) else MaterialTheme.colorScheme.outlineVariant,
                    modifier = Modifier.size(30.dp)
                  )
                }
              }
            }
          }
        }
      }

      // Specs Summary Card (Prep time, Cook time, Yield, Difficulty Level)
      item {
        RecipeSpecsCard(
          prepTime = recipe.prepTime,
          cookTime = recipe.cookTime,
          servings = recipe.servings,
          difficulty = difficulty
        )
      }

      // Spicy Options & Heat Customizer Card
      item {
        SpicyOptionsCard(
          currentSpice = effectiveSpice,
          onSelectSpice = { newSpice ->
            viewModel.setRecipeCustomSpice(recipe.id, newSpice)
            scope.launch {
              snackbarHostState.showSnackbar("Spice level set to ${newSpice.label}")
            }
          }
        )
      }

      // Nutritious Information Card (automatically scales with serving multiplier!)
      item {
        NutritiousInformationCard(
          nutrition = baseNutrition,
          multiplier = multiplier
        )
      }

      // Scaled Servings & Unit Conversion Card
      item {
        Card(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .testTag("servings_unit_conversion_card"),
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
          border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
        ) {
          Column(modifier = Modifier.padding(14.dp)) {
            // Servings Scaler Row
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(
                text = "Scale Servings:",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface
              )

              Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                listOf(0.5f to "½x", 1.0f to "1x", 1.5f to "1.5x", 2.0f to "2x", 3.0f to "3x").forEach { (scale, label) ->
                  val isSelected = multiplier == scale
                  Surface(
                    modifier = Modifier
                      .clip(CircleShape)
                      .clickable { viewModel.setServingMultiplier(scale) }
                      .testTag("scale_${label}"),
                    color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                    shape = CircleShape
                  ) {
                    Text(
                      text = label,
                      fontSize = 12.sp,
                      fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                      color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                      modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                    )
                  }
                }
              }
            }

            Spacer(modifier = Modifier.height(10.dp))
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))
            Spacer(modifier = Modifier.height(10.dp))

            // Unit Conversion Toggle: Imperial vs Metric
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Column {
                Text(
                  text = "Measurement Units:",
                  style = MaterialTheme.typography.bodyMedium,
                  fontWeight = FontWeight.SemiBold,
                  color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                  text = if (unitSystem == UnitSystem.IMPERIAL) "Cups, Oz, Lbs, Tsp" else "Grams, Kg, mL, Liters",
                  style = MaterialTheme.typography.bodySmall,
                  color = MaterialTheme.colorScheme.onSurfaceVariant
                )
              }

              Row(
                modifier = Modifier
                  .clip(RoundedCornerShape(20.dp))
                  .background(MaterialTheme.colorScheme.surfaceVariant)
                  .padding(3.dp)
              ) {
                Box(
                  modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(if (unitSystem == UnitSystem.IMPERIAL) MaterialTheme.colorScheme.primary else Color.Transparent)
                    .clickable { viewModel.setUnitSystem(UnitSystem.IMPERIAL) }
                    .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                  Text(
                    text = "Imperial",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (unitSystem == UnitSystem.IMPERIAL) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                  )
                }

                Box(
                  modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(if (unitSystem == UnitSystem.METRIC) MaterialTheme.colorScheme.primary else Color.Transparent)
                    .clickable { viewModel.setUnitSystem(UnitSystem.METRIC) }
                    .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                  Text(
                    text = "Metric",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (unitSystem == UnitSystem.METRIC) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                  )
                }
              }
            }
          }
        }
      }

      // Ingredients Section Header & Action
      item {
        Spacer(modifier = Modifier.height(10.dp))
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            text = "Ingredients (${checkedIngredients.size}/${recipe.ingredients.size} prep checked)",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onBackground
          )

          TextButton(
            onClick = {
              viewModel.addRecipeIngredientsToPantry(recipe)
              scope.launch {
                snackbarHostState.showSnackbar("Added recipe ingredients to your pantry!")
              }
            },
            contentPadding = PaddingValues(0.dp)
          ) {
            Icon(
              imageVector = Icons.Default.AddShoppingCart,
              contentDescription = null,
              modifier = Modifier.size(16.dp),
              tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text("Add to Pantry", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
          }
        }
      }

      // Interactive Ingredients List
      items(recipe.ingredients.size) { index ->
        val ingredient = recipe.ingredients[index]
        val isChecked = checkedIngredients.contains(ingredient.rawText)

        Surface(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 3.dp)
            .clickable { viewModel.toggleIngredientChecked(ingredient.rawText) }
            .testTag("ingredient_checkbox_${index}"),
          color = if (isChecked) MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f) else MaterialTheme.colorScheme.surface,
          shape = RoundedCornerShape(12.dp),
          border = BorderStroke(1.dp, if (isChecked) Color.Transparent else MaterialTheme.colorScheme.outline)
        ) {
          Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Checkbox(
              checked = isChecked,
              onCheckedChange = { viewModel.toggleIngredientChecked(ingredient.rawText) },
              colors = CheckboxDefaults.colors(checkedColor = MaterialTheme.colorScheme.primary)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
              text = IngredientScaler.scaleAndConvert(ingredient.rawText, multiplier, unitSystem).displayText,
              style = MaterialTheme.typography.bodyMedium,
              color = if (isChecked) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface,
              textDecoration = if (isChecked) TextDecoration.LineThrough else TextDecoration.None
            )
          }
        }
      }

      // Cooking Assistant Timer Component
      item {
        Spacer(modifier = Modifier.height(16.dp))
        CookingTimerCard(
          recipeTitle = recipe.title,
          recipeCookTime = recipe.cookTime,
          secondsRemaining = timerSeconds,
          totalSeconds = timerTotalSeconds,
          isRunning = isTimerRunning,
          isAlert = isTimerAlert,
          label = timerLabel,
          onStartRecipeTimer = { viewModel.startRecipeTimer(recipe) },
          onStartMinutes = { viewModel.startTimer(it, label = "${recipe.title} (${it}m)") },
          onAddMinutes = { viewModel.addTimerMinutes(it) },
          onTogglePause = { viewModel.pauseResumeTimer() },
          onReset = { viewModel.resetTimer() },
          onDismissAlert = { viewModel.dismissTimerAlert() }
        )
      }

      // Preparation Instructions Header
      item {
        Spacer(modifier = Modifier.height(16.dp))
        Text(
          text = "Preparation & Cooking Method",
          style = MaterialTheme.typography.titleMedium,
          fontWeight = FontWeight.SemiBold,
          color = MaterialTheme.colorScheme.onBackground,
          modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
        )
      }

      // Instruction Steps
      items(recipe.instructions.size) { stepIndex ->
        val step = recipe.instructions[stepIndex]
        Card(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
          shape = RoundedCornerShape(20.dp),
          border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
          colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
          elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
        ) {
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .padding(14.dp),
            verticalAlignment = Alignment.Top
          ) {
            Box(
              modifier = Modifier
                .size(28.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer),
              contentAlignment = Alignment.Center
            ) {
              Text(
                text = "${stepIndex + 1}",
                color = MaterialTheme.colorScheme.onPrimaryContainer,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
              )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Text(
              text = step,
              style = MaterialTheme.typography.bodyMedium,
              lineHeight = 22.sp,
              color = MaterialTheme.colorScheme.onSurface
            )
          }
        }
      }

      // Nonna's Heritage Tips & Notes
      if (recipe.notes.isNotEmpty()) {
        item {
          Spacer(modifier = Modifier.height(12.dp))
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .padding(horizontal = 16.dp, vertical = 6.dp),
            shape = RoundedCornerShape(24.dp),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
          ) {
            Row(
              modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
              verticalAlignment = Alignment.Top
            ) {
              Icon(
                imageVector = Icons.Default.FormatQuote,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(28.dp)
              )
              Spacer(modifier = Modifier.width(12.dp))
              Column {
                Text(
                  text = "Heritage Kitchen Tip",
                  style = MaterialTheme.typography.titleSmall,
                  fontWeight = FontWeight.Bold,
                  color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                  text = recipe.notes,
                  style = MaterialTheme.typography.bodyMedium,
                  color = MaterialTheme.colorScheme.onSurfaceVariant,
                  lineHeight = 20.sp
                )
              }
            }
          }
        }
      }

      // Personal Notes Card (Persistent in Room Database)
      item {
        Spacer(modifier = Modifier.height(12.dp))
        Card(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
          shape = RoundedCornerShape(24.dp),
          border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
          colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
          elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
        ) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(16.dp)
          ) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                  imageVector = Icons.Default.NoteAdd,
                  contentDescription = null,
                  tint = MaterialTheme.colorScheme.primary,
                  modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                  text = "My Personal Kitchen Notes",
                  style = MaterialTheme.typography.titleSmall,
                  fontWeight = FontWeight.Bold,
                  color = MaterialTheme.colorScheme.onSurface
                )
              }

              Button(
                onClick = {
                  viewModel.saveActiveRecipeNote(recipe.id, noteEditText)
                  scope.launch {
                    snackbarHostState.showSnackbar("Note saved to cookbook!")
                  }
                },
                modifier = Modifier.testTag("save_note_button"),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
              ) {
                Icon(
                  imageVector = Icons.Default.Save,
                  contentDescription = null,
                  modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text("Save", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
              }
            }

            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
              value = noteEditText,
              onValueChange = { noteEditText = it },
              modifier = Modifier
                .fillMaxWidth()
                .testTag("personal_note_input"),
              placeholder = {
                Text(
                  "Add your family variations, oven temperature notes, wine pairings...",
                  fontSize = 13.sp,
                  color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
                )
              },
              minLines = 3,
              shape = RoundedCornerShape(14.dp),
              colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = Color.Transparent
              )
            )
          }
        }
      }
    }
  }
}
}

/**
 * Key Recipe Specs & Difficulty Level Card
 */
@Composable
fun RecipeSpecsCard(
  prepTime: String,
  cookTime: String,
  servings: String,
  difficulty: DifficultyLevel
) {
  Card(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp, vertical = 8.dp),
    shape = RoundedCornerShape(24.dp),
    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceAround,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Text(
            text = "PREP TIME",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
          Spacer(modifier = Modifier.height(4.dp))
          Text(text = prepTime, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface)
        }
        Box(
          modifier = Modifier
            .height(30.dp)
            .width(1.dp)
            .background(MaterialTheme.colorScheme.outline)
        )
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Text(
            text = "COOK TIME",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
          Spacer(modifier = Modifier.height(4.dp))
          Text(text = cookTime, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface)
        }
        Box(
          modifier = Modifier
            .height(30.dp)
            .width(1.dp)
            .background(MaterialTheme.colorScheme.outline)
        )
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Text(
            text = "YIELD",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
          Spacer(modifier = Modifier.height(4.dp))
          Text(text = servings, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface)
        }
      }

      Spacer(modifier = Modifier.height(14.dp))
      HorizontalDivider(color = MaterialTheme.colorScheme.outline, thickness = 1.dp)
      Spacer(modifier = Modifier.height(12.dp))

      // Difficulty level section
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(
            imageVector = Icons.Default.Speed,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(18.dp)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = "DIFFICULTY LEVEL",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.8.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }

        // Visual indicator dots (●●○)
        Row(
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
          repeat(3) { dotIndex ->
            val isActive = dotIndex < difficulty.dots
            Box(
              modifier = Modifier
                .size(10.dp)
                .clip(CircleShape)
                .background(
                  if (isActive) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
                )
            )
          }
          Spacer(modifier = Modifier.width(4.dp))
          Text(
            text = difficulty.label,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
          )
        }
      }

      Spacer(modifier = Modifier.height(4.dp))
      Text(
        text = difficulty.description,
        fontSize = 12.sp,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        lineHeight = 16.sp
      )
    }
  }
}

/**
 * Spicy Options Card (Heat Profile Customizer)
 */
@Composable
fun SpicyOptionsCard(
  currentSpice: SpiceLevel,
  onSelectSpice: (SpiceLevel) -> Unit
) {
  Card(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp, vertical = 6.dp),
    shape = RoundedCornerShape(24.dp),
    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(
            imageVector = Icons.Default.LocalFireDepartment,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(20.dp)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = "SPICY OPTIONS & HEAT LEVEL",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.8.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }

        Surface(
          color = MaterialTheme.colorScheme.primaryContainer,
          shape = CircleShape
        ) {
          Text(
            text = currentSpice.label,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onPrimaryContainer,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
          )
        }
      }

      Spacer(modifier = Modifier.height(10.dp))

      // 4 Selectable Spicy Level Chips
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        SpiceLevel.values().forEach { level ->
          val isSelected = currentSpice == level
          Surface(
            modifier = Modifier
              .clip(RoundedCornerShape(12.dp))
              .clickable { onSelectSpice(level) }
              .testTag("spice_option_${level.name}"),
            color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, if (isSelected) Color.Transparent else MaterialTheme.colorScheme.outline)
          ) {
            Column(
              modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
              horizontalAlignment = Alignment.CenterHorizontally
            ) {
              Text(
                text = "${level.chiliIcon} ${level.label}",
                fontSize = 12.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface
              )
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(10.dp))

      // Kitchen note for chosen heat level
      Surface(
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
      ) {
        Row(
          modifier = Modifier.padding(10.dp),
          verticalAlignment = Alignment.Top
        ) {
          Text(
            text = "Chef Note:",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = currentSpice.tip,
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            lineHeight = 16.sp
          )
        }
      }
    }
  }
}

/**
 * Nutritious Information Card
 * Displays estimated calories, macronutrients (protein, carbs, fat), fiber, and sodium,
 * cleanly adjusted by the serving multiplier!
 */
@Composable
fun NutritiousInformationCard(
  nutrition: NutritionInfo,
  multiplier: Float
) {
  val scaledCalories = (nutrition.calories * multiplier).toInt()
  val scaledProtein = (nutrition.proteinGrams * multiplier).toInt()
  val scaledCarbs = (nutrition.carbsGrams * multiplier).toInt()
  val scaledFat = (nutrition.fatGrams * multiplier).toInt()
  val scaledFiber = (nutrition.fiberGrams * multiplier).toInt()
  val scaledSodium = (nutrition.sodiumMg * multiplier).toInt()

  val totalMacros = (scaledProtein + scaledCarbs + scaledFat).coerceAtLeast(1)
  val proteinPct = (scaledProtein * 100) / totalMacros
  val carbsPct = (scaledCarbs * 100) / totalMacros
  val fatPct = (scaledFat * 100) / totalMacros

  Card(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp, vertical = 6.dp),
    shape = RoundedCornerShape(24.dp),
    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(
            imageVector = Icons.Default.FitnessCenter,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(18.dp)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = "NUTRITION INFORMATION",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.8.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }

        Text(
          text = if (multiplier == 1.0f) "Per Serving" else "Scaled (${multiplier}x)",
          fontSize = 11.sp,
          fontWeight = FontWeight.Medium,
          color = MaterialTheme.colorScheme.primary
        )
      }

      Spacer(modifier = Modifier.height(12.dp))

      // 4 Main Macro Cards in a Row
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        MacroBox(
          label = "CALORIES",
          value = "$scaledCalories",
          unit = "kcal",
          modifier = Modifier.weight(1f)
        )
        MacroBox(
          label = "PROTEIN",
          value = "$scaledProtein",
          unit = "g",
          modifier = Modifier.weight(1f)
        )
        MacroBox(
          label = "CARBS",
          value = "$scaledCarbs",
          unit = "g",
          modifier = Modifier.weight(1f)
        )
        MacroBox(
          label = "FAT",
          value = "$scaledFat",
          unit = "g",
          modifier = Modifier.weight(1f)
        )
      }

      Spacer(modifier = Modifier.height(12.dp))

      // Visual Macro Distribution Proportion Bar
      Column {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          Text(
            text = "Macro Ratio: Protein $proteinPct% • Carbs $carbsPct% • Fat $fatPct%",
            fontSize = 10.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .height(6.dp)
            .clip(CircleShape)
        ) {
          Box(
            modifier = Modifier
              .weight(proteinPct.coerceAtLeast(1).toFloat())
              .fillMaxHeight()
              .background(MaterialTheme.colorScheme.primary)
          )
          Box(
            modifier = Modifier
              .weight(carbsPct.coerceAtLeast(1).toFloat())
              .fillMaxHeight()
              .background(MaterialTheme.colorScheme.secondary)
          )
          Box(
            modifier = Modifier
              .weight(fatPct.coerceAtLeast(1).toFloat())
              .fillMaxHeight()
              .background(MaterialTheme.colorScheme.tertiary)
          )
        }
      }

      Spacer(modifier = Modifier.height(12.dp))

      // Secondary Micronutrient info: Fiber & Sodium
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Surface(
          color = MaterialTheme.colorScheme.surfaceVariant,
          shape = RoundedCornerShape(10.dp)
        ) {
          Text(
            text = "Dietary Fiber: ${scaledFiber}g",
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
          )
        }

        Surface(
          color = MaterialTheme.colorScheme.surfaceVariant,
          shape = RoundedCornerShape(10.dp)
        ) {
          Text(
            text = "Sodium: ${scaledSodium}mg",
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
          )
        }
      }
    }
  }
}

@Composable
private fun MacroBox(
  label: String,
  value: String,
  unit: String,
  modifier: Modifier = Modifier
) {
  Surface(
    modifier = modifier,
    color = MaterialTheme.colorScheme.surfaceVariant,
    shape = RoundedCornerShape(12.dp),
    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
  ) {
    Column(
      modifier = Modifier.padding(vertical = 8.dp, horizontal = 4.dp),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      Text(
        text = label,
        fontSize = 9.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 0.5.sp,
        color = MaterialTheme.colorScheme.onSurfaceVariant
      )
      Spacer(modifier = Modifier.height(2.dp))
      Row(verticalAlignment = Alignment.Bottom) {
        Text(
          text = value,
          fontSize = 15.sp,
          fontWeight = FontWeight.Bold,
          color = MaterialTheme.colorScheme.onSurface
        )
        Text(
          text = unit,
          fontSize = 10.sp,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
          modifier = Modifier.padding(start = 1.dp, bottom = 1.dp)
        )
      }
    }
  }
}

/**
 * Cooking Timer Component
 * Allows 1-tap start based on recipe cook time, adjusting minutes (+1m, +5m, etc),
 * pause/resume, reset, and alert state.
 */
@Composable
fun CookingTimerCard(
  recipeTitle: String,
  recipeCookTime: String,
  secondsRemaining: Int,
  totalSeconds: Int,
  isRunning: Boolean,
  isAlert: Boolean,
  label: String,
  onStartRecipeTimer: () -> Unit,
  onStartMinutes: (Int) -> Unit,
  onAddMinutes: (Int) -> Unit,
  onTogglePause: () -> Unit,
  onReset: () -> Unit,
  onDismissAlert: () -> Unit
) {
  val minutes = secondsRemaining / 60
  val seconds = secondsRemaining % 60
  val timeFormatted = String.format(Locale.getDefault(), "%02d:%02d", minutes, seconds)

  Card(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp),
    shape = RoundedCornerShape(24.dp),
    border = BorderStroke(
      if (isAlert) 2.dp else 1.dp,
      if (isAlert) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
    ),
    colors = CardDefaults.cardColors(
      containerColor = if (isAlert) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f) else MaterialTheme.colorScheme.surface
    ),
    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(
            imageVector = if (isAlert) Icons.Default.NotificationsActive else Icons.Default.Timer,
            contentDescription = null,
            tint = if (isAlert) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(20.dp)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = if (isAlert) "TIMER FINISHED!" else "KITCHEN COOKING TIMER",
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
            color = if (isAlert) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
          )
        }

        Text(
          text = timeFormatted,
          style = MaterialTheme.typography.headlineSmall,
          fontWeight = FontWeight.Bold,
          color = if (isRunning) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
        )
      }

      // If alert triggered when timer finished
      if (isAlert) {
        Spacer(modifier = Modifier.height(10.dp))
        Surface(
          color = MaterialTheme.colorScheme.primaryContainer,
          shape = RoundedCornerShape(12.dp),
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .padding(horizontal = 12.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Text(
              text = "⏰ Time is up! Check your dish.",
              fontSize = 13.sp,
              fontWeight = FontWeight.SemiBold,
              color = MaterialTheme.colorScheme.onPrimaryContainer
            )
            IconButton(
              onClick = onDismissAlert,
              modifier = Modifier.size(28.dp)
            ) {
              Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Dismiss Alert",
                tint = MaterialTheme.colorScheme.onPrimaryContainer
              )
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(10.dp))

      // 1-Tap Start Cook Timer button
      if (!isRunning && secondsRemaining == 0) {
        Button(
          onClick = onStartRecipeTimer,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("timer_start_recipe_button"),
          shape = RoundedCornerShape(14.dp),
          colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
        ) {
          Icon(
            imageVector = Icons.Default.PlayArrow,
            contentDescription = null,
            modifier = Modifier.size(18.dp)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = "Start Timer for this Recipe ($recipeCookTime)",
            fontWeight = FontWeight.SemiBold,
            fontSize = 13.sp
          )
        }

        Spacer(modifier = Modifier.height(10.dp))
      }

      // Quick preset minutes
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(6.dp)
      ) {
        listOf(1, 3, 5, 10, 15, 20, 30).forEach { min ->
          Surface(
            modifier = Modifier
              .clip(CircleShape)
              .clickable {
                if (isRunning || secondsRemaining > 0) {
                  onAddMinutes(min)
                } else {
                  onStartMinutes(min)
                }
              }
              .testTag("timer_preset_${min}m"),
            color = MaterialTheme.colorScheme.surfaceVariant,
            shape = CircleShape
          ) {
            Text(
              text = if (isRunning || secondsRemaining > 0) "+$min m" else "$min min",
              fontSize = 12.sp,
              fontWeight = FontWeight.Medium,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
              modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
            )
          }
        }
      }

      if (isRunning || secondsRemaining > 0) {
        Spacer(modifier = Modifier.height(12.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          Button(
            onClick = onTogglePause,
            modifier = Modifier
              .weight(1f)
              .testTag("timer_play_pause_button"),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
          ) {
            Icon(
              imageVector = if (isRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
              contentDescription = null,
              modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
              if (isRunning) "Pause" else "Resume",
              fontWeight = FontWeight.SemiBold
            )
          }

          OutlinedButton(
            onClick = onReset,
            modifier = Modifier.testTag("timer_reset_button"),
            shape = RoundedCornerShape(14.dp)
          ) {
            Icon(
              imageVector = Icons.Default.Refresh,
              contentDescription = "Reset",
              modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text("Reset", fontWeight = FontWeight.SemiBold)
          }
        }
      }
    }
  }
}

/**
 * Native Android Sharing intent supporting Email, SMS, WhatsApp, and Social Media
 */
private fun shareRecipeDetails(
  context: Context,
  recipe: Recipe,
  multiplier: Float,
  unitSystem: UnitSystem
) {
  val ingredientsList = recipe.ingredients.joinToString("\n") {
    "• " + IngredientScaler.scaleAndConvert(it.rawText, multiplier, unitSystem).displayText
  }
  val instructionsList = recipe.instructions.mapIndexed { i, step ->
    "${i + 1}. $step"
  }.joinToString("\n\n")

  val shareText = """
    🍽️ ${recipe.title} ${if (recipe.italianTitle.isNotEmpty()) "(${recipe.italianTitle})" else ""}
    From the kitchen of ${recipe.contributor}
    Ruffolo-Vitale Family Heritage Cookbook

    ⏱️ Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Servings: ${recipe.servings}
    🌶️ Heat: ${recipe.baseSpiceLevel.label} | Difficulty: ${recipe.calculatedDifficulty.label}
    🏷️ Tags: ${recipe.autoTags.joinToString(", ")}

    📝 INGREDIENTS (${if (unitSystem == UnitSystem.METRIC) "Metric" else "Imperial"}, ${multiplier}x scale):
    $ingredientsList

    👨‍🍳 INSTRUCTIONS:
    $instructionsList

    ${if (recipe.notes.isNotEmpty()) "💡 Nonna's Secret Kitchen Tip: ${recipe.notes}\n" else ""}
    Shared from the Heritage Cookbook App ✨
  """.trimIndent()

  val sendIntent = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_SUBJECT, "Family Recipe: ${recipe.title}")
    putExtra(Intent.EXTRA_TEXT, shareText)
  }
  val chooser = Intent.createChooser(sendIntent, "Share Recipe with...")
  context.startActivity(chooser)
}
