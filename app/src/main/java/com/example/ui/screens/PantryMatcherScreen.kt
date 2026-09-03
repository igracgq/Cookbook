package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
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
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.Kitchen
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.Restaurant
import androidx.compose.material.icons.outlined.ShoppingBag
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.MatchResult
import com.example.data.repository.CookbookDataSource
import com.example.ui.viewmodel.CookbookViewModel
import com.example.ui.viewmodel.MatcherFilter
import com.example.ui.viewmodel.ScreenDestination

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun PantryMatcherScreen(
  viewModel: CookbookViewModel,
  modifier: Modifier = Modifier
) {
  val pantryList by viewModel.pantryItems.collectAsStateWithLifecycle()
  val pantryNames = pantryList.map { it.name.lowercase() }.toSet()
  val newIngredientText by viewModel.newIngredientText.collectAsStateWithLifecycle()
  val matcherFilter by viewModel.matcherFilter.collectAsStateWithLifecycle()
  val matchResults by viewModel.pantryMatches.collectAsStateWithLifecycle()

  LazyColumn(
    modifier = modifier
      .fillMaxSize()
      .testTag("pantry_matcher_column"),
    contentPadding = PaddingValues(bottom = 96.dp)
  ) {
    // Header Banner
    item {
      Card(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 10.dp),
        shape = RoundedCornerShape(24.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
      ) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(18.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Box(
            modifier = Modifier
              .size(44.dp)
              .clip(CircleShape)
              .background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center
          ) {
            Icon(
              imageVector = Icons.Default.Kitchen,
              contentDescription = null,
              tint = MaterialTheme.colorScheme.primary,
              modifier = Modifier.size(24.dp)
            )
          }

          Spacer(modifier = Modifier.width(14.dp))

          Column {
            Text(
              text = "What Can I Make?",
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.SemiBold,
              color = MaterialTheme.colorScheme.onSurface
            )
            Text(
              text = "Input the ingredients you have to find matching heritage recipes.",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
        }
      }
    }

    // Ingredient Input Field - Sleek Interface Style
    item {
      Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          verticalAlignment = Alignment.CenterVertically
        ) {
          OutlinedTextField(
            value = newIngredientText,
            onValueChange = { viewModel.onNewIngredientTextChanged(it) },
            modifier = Modifier
              .weight(1f)
              .testTag("pantry_input"),
            placeholder = {
              Text(
                "Enter ingredient (e.g. eggs, garlic, pasta)",
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                fontSize = 14.sp
              )
            },
            singleLine = true,
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
              focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
              unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
              focusedBorderColor = MaterialTheme.colorScheme.primary,
              unfocusedBorderColor = Color.Transparent
            ),
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
            keyboardActions = KeyboardActions(
              onDone = {
                if (newIngredientText.isNotBlank()) {
                  viewModel.addPantryIngredient(newIngredientText)
                }
              }
            ),
            trailingIcon = {
              if (newIngredientText.isNotEmpty()) {
                IconButton(onClick = { viewModel.onNewIngredientTextChanged("") }) {
                  Icon(imageVector = Icons.Default.Clear, contentDescription = "Clear", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
              }
            }
          )

          Spacer(modifier = Modifier.width(8.dp))

          Button(
            onClick = {
              if (newIngredientText.isNotBlank()) {
                viewModel.addPantryIngredient(newIngredientText)
              }
            },
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.testTag("add_ingredient_button"),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
          ) {
            Icon(imageVector = Icons.Default.Add, contentDescription = "Add")
            Spacer(modifier = Modifier.width(4.dp))
            Text("Add", fontWeight = FontWeight.SemiBold)
          }
        }
      }
    }

    // Quick Add Staples - Sleek Interface Filter Pills
    item {
      Column(modifier = Modifier.padding(top = 10.dp, bottom = 6.dp)) {
        Text(
          text = "PANTRY FILTERS",
          fontSize = 11.sp,
          fontWeight = FontWeight.Bold,
          letterSpacing = 1.sp,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
          modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
        )

        Row(
          modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 2.dp),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          CookbookDataSource.commonPantryIngredients.forEach { item ->
            val isAdded = pantryNames.contains(item.lowercase())
            Surface(
              modifier = Modifier
                .clip(CircleShape)
                .clickable {
                  if (isAdded) {
                    viewModel.removePantryIngredient(item)
                  } else {
                    viewModel.addPantryIngredient(item)
                  }
                }
                .testTag("quick_staple_${item}"),
              color = if (isAdded) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.primaryContainer,
              shape = CircleShape
            ) {
              Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
              ) {
                Icon(
                  imageVector = if (isAdded) Icons.Default.Check else Icons.Default.Add,
                  contentDescription = null,
                  modifier = Modifier.size(14.dp),
                  tint = if (isAdded) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onPrimaryContainer
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                  text = item,
                  fontSize = 12.sp,
                  fontWeight = if (isAdded) FontWeight.SemiBold else FontWeight.Medium,
                  color = if (isAdded) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onPrimaryContainer
                )
              }
            }
          }
        }
      }
    }

    // Current Pantry Items Card
    item {
      Card(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 8.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(24.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
      ) {
        Column(modifier = Modifier.padding(16.dp)) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Text(
              text = "Your Kitchen Ingredients (${pantryList.size})",
              style = MaterialTheme.typography.titleSmall,
              fontWeight = FontWeight.SemiBold,
              color = MaterialTheme.colorScheme.onSurface
            )

            if (pantryList.isNotEmpty()) {
              TextButton(
                onClick = { viewModel.clearAllPantry() },
                contentPadding = PaddingValues(0.dp)
              ) {
                Text("Clear All", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
              }
            }
          }

          if (pantryList.isEmpty()) {
            Spacer(modifier = Modifier.height(6.dp))
            Text(
              text = "You haven't added any ingredients yet.",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(10.dp))
            OutlinedButton(
              onClick = { viewModel.seedCommonPantry() },
              shape = RoundedCornerShape(12.dp),
              modifier = Modifier.testTag("seed_pantry_button")
            ) {
              Text("Load Sample Italian Pantry (Eggs, Garlic, Pasta, Oil...)")
            }
          } else {
            Spacer(modifier = Modifier.height(10.dp))
            FlowRow(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.spacedBy(6.dp),
              verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
              pantryList.forEach { item ->
                Surface(
                  color = MaterialTheme.colorScheme.primaryContainer,
                  shape = CircleShape,
                  modifier = Modifier.testTag("pantry_chip_${item.name}")
                ) {
                  Row(
                    modifier = Modifier.padding(start = 12.dp, end = 6.dp, top = 4.dp, bottom = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                  ) {
                    Text(
                      text = item.name.replaceFirstChar { it.uppercase() },
                      fontSize = 12.sp,
                      color = MaterialTheme.colorScheme.onPrimaryContainer,
                      fontWeight = FontWeight.Medium
                    )
                    IconButton(
                      onClick = { viewModel.removePantryIngredient(item.name) },
                      modifier = Modifier.size(24.dp)
                    ) {
                      Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Remove ${item.name}",
                        modifier = Modifier.size(14.dp),
                        tint = MaterialTheme.colorScheme.onPrimaryContainer
                      )
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Match Filter Tabs
    item {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .horizontalScroll(rememberScrollState())
          .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        MatcherFilter.values().forEach { filter ->
          val isSelected = matcherFilter == filter
          Surface(
            modifier = Modifier
              .clip(CircleShape)
              .clickable { viewModel.setMatcherFilter(filter) }
              .testTag("matcher_tab_${filter.name}"),
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
                text = filter.label,
                fontSize = 12.sp,
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
              )
            }
          }
        }
      }
    }

    // Results Header
    item {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Text(
          text = "Matching Recipes (${matchResults.size})",
          style = MaterialTheme.typography.titleSmall,
          fontWeight = FontWeight.SemiBold,
          color = MaterialTheme.colorScheme.onSurface
        )
      }
    }

    // Empty matches
    if (matchResults.isEmpty()) {
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
              imageVector = Icons.Outlined.ShoppingBag,
              contentDescription = null,
              modifier = Modifier.size(48.dp),
              tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
            )
            Text(
              text = if (pantryList.isEmpty()) {
                "Add your ingredients above to see matching recipes!"
              } else {
                "No recipes match this filter. Try adding more ingredients or select 'All Matches'."
              },
              style = MaterialTheme.typography.bodyMedium,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
        }
      }
    }

    // Match Items
    items(matchResults, key = { it.recipe.id }) { result ->
      PantryMatchCard(
        result = result,
        onClick = { viewModel.navigateTo(ScreenDestination.Detail(result.recipe.id)) }
      )
    }
  }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun PantryMatchCard(
  result: MatchResult,
  onClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  val recipe = result.recipe
  val isFullMatch = result.missingIngredients.isEmpty()

  Card(
    modifier = modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp, vertical = 6.dp)
      .clickable { onClick() }
      .testTag("pantry_match_card_${recipe.id}"),
    shape = RoundedCornerShape(24.dp),
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
      // Sleek square leading icon box
      Box(
        modifier = Modifier
          .size(68.dp)
          .clip(RoundedCornerShape(16.dp))
          .background(MaterialTheme.colorScheme.primaryContainer),
        contentAlignment = Alignment.Center
      ) {
        Icon(
          imageVector = Icons.Outlined.Restaurant,
          contentDescription = null,
          tint = MaterialTheme.colorScheme.primary,
          modifier = Modifier.size(28.dp)
        )
      }

      Spacer(modifier = Modifier.width(12.dp))

      Column(modifier = Modifier.weight(1f)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Surface(
            color = if (isFullMatch) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.primaryContainer,
            shape = RoundedCornerShape(6.dp)
          ) {
            Text(
              text = if (isFullMatch) "100% READY TO COOK" else "${result.matchPercentage}% MATCH (${result.matchedCount}/${result.totalKeyIngredients})",
              color = if (isFullMatch) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onPrimaryContainer,
              fontSize = 10.sp,
              fontWeight = FontWeight.Bold,
              modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
            )
          }

          Text(
            text = "p. ${recipe.cookbookPage}",
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }

        Spacer(modifier = Modifier.height(4.dp))

        Text(
          text = recipe.title,
          style = MaterialTheme.typography.titleMedium,
          fontWeight = FontWeight.SemiBold,
          color = MaterialTheme.colorScheme.onSurface,
          maxLines = 1,
          overflow = TextOverflow.Ellipsis
        )

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

        Spacer(modifier = Modifier.height(6.dp))

        LinearProgressIndicator(
          progress = { result.matchPercentage / 100f },
          modifier = Modifier
            .fillMaxWidth()
            .height(5.dp)
            .clip(RoundedCornerShape(3.dp)),
          color = MaterialTheme.colorScheme.primary,
          trackColor = MaterialTheme.colorScheme.surfaceVariant
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Missing ingredients notification
        if (result.missingIngredients.isNotEmpty()) {
          Text(
            text = "Need ${result.missingIngredients.size} item${if (result.missingIngredients.size > 1) "s" else ""}:",
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.primary
          )
          Spacer(modifier = Modifier.height(4.dp))
          FlowRow(
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
          ) {
            result.missingIngredients.forEach { missing ->
              Surface(
                color = MaterialTheme.colorScheme.surfaceVariant,
                shape = RoundedCornerShape(6.dp)
              ) {
                Text(
                  text = missing,
                  fontSize = 10.sp,
                  color = MaterialTheme.colorScheme.onSurfaceVariant,
                  modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
              }
            }
          }
        } else {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
              imageVector = Icons.Default.DoneAll,
              contentDescription = null,
              tint = MaterialTheme.colorScheme.primary,
              modifier = Modifier.size(15.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
              text = "You have all ingredients ready!",
              fontSize = 11.sp,
              color = MaterialTheme.colorScheme.primary,
              fontWeight = FontWeight.SemiBold
            )
          }
        }
      }
    }
  }
}
