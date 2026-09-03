package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.detectVerticalDragGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.FormatListNumbered
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.SortByAlpha
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.DifficultyLevel
import com.example.data.model.Recipe
import com.example.data.model.SpiceLevel
import com.example.ui.viewmodel.CookbookViewModel
import com.example.ui.viewmodel.IndexViewMode
import com.example.ui.viewmodel.ScreenDestination
import kotlinx.coroutines.launch

@Composable
fun AlphabeticalIndexScreen(
  viewModel: CookbookViewModel,
  modifier: Modifier = Modifier
) {
  val indexMode by viewModel.indexMode.collectAsStateWithLifecycle()
  val selectedLetter by viewModel.selectedLetter.collectAsStateWithLifecycle()
  val alphabeticalMap = viewModel.alphabeticalMap
  val categoryMap = viewModel.categoryMap
  val contributorMap = viewModel.contributorMap

  val listState = rememberLazyListState()
  val coroutineScope = rememberCoroutineScope()

  val scrollIndices = remember(alphabeticalMap) { viewModel.getAlphabeticalScrollIndices() }
  val currentVisibleLetter by remember {
    derivedStateOf { viewModel.getLetterForScrollIndex(listState.firstVisibleItemIndex) }
  }

  Column(modifier = modifier.fillMaxSize()) {
    // Header
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {
      Text(
        text = "Cookbook Index",
        style = MaterialTheme.typography.headlineSmall,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.onBackground
      )
      Text(
        text = "Nicely indexed catalog matching the physical Ruffolo-Vitale Heritage Cookbook",
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant
      )

      Spacer(modifier = Modifier.height(10.dp))

      // Mode Selector Tabs - Sleek Interface style
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        val modes = listOf(
          Triple(IndexViewMode.ALPHABETICAL_A_TO_Z, "A–Z Index", "tab_index_az"),
          Triple(IndexViewMode.BY_CATEGORY, "Table of Contents", "tab_index_category"),
          Triple(IndexViewMode.BY_CONTRIBUTOR, "Family Contributors", "tab_index_contributor")
        )

        modes.forEach { (mode, label, tag) ->
          val isSelected = indexMode == mode
          Surface(
            modifier = Modifier
              .clip(CircleShape)
              .clickable { viewModel.setIndexMode(mode) }
              .testTag(tag),
            color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
            shape = CircleShape
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(
                text = label,
                fontSize = 12.sp,
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
              )
            }
          }
        }
      }
    }

    // Secondary A-Z Selector bar if in Alphabetical mode
    if (indexMode == IndexViewMode.ALPHABETICAL_A_TO_Z) {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .horizontalScroll(rememberScrollState())
          .padding(horizontal = 16.dp, vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
      ) {
        val alphabet = ('A'..'Z').toList()
        alphabet.forEach { letter ->
          val count = alphabeticalMap[letter]?.size ?: 0
          val activeLetterHighlight = currentVisibleLetter ?: selectedLetter
          val isSelected = activeLetterHighlight == letter
          Surface(
            modifier = Modifier
              .size(34.dp)
              .clip(CircleShape)
              .clickable {
                viewModel.setSelectedLetter(letter)
                // Fast-scroll directly to the exact LazyList item index
                val targetIndex = scrollIndices[letter] ?: viewModel.getLazyListIndexForLetter(letter)
                if (targetIndex != null) {
                  coroutineScope.launch {
                    listState.scrollToItem(targetIndex)
                  }
                }
              }
              .testTag("letter_button_$letter"),
            color = if (isSelected) {
              MaterialTheme.colorScheme.primary
            } else if (count > 0) {
              MaterialTheme.colorScheme.surfaceVariant
            } else {
              Color.Transparent
            },
            shape = CircleShape
          ) {
            Box(contentAlignment = Alignment.Center) {
              Text(
                text = letter.toString(),
                fontSize = 13.sp,
                fontWeight = if (isSelected || count > 0) FontWeight.Bold else FontWeight.Normal,
                color = if (isSelected) {
                  MaterialTheme.colorScheme.onPrimary
                } else if (count > 0) {
                  MaterialTheme.colorScheme.onSurfaceVariant
                } else {
                  MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                }
              )
            }
          }
        }
      }
    }

    // Index Content with Fast-Scrolling Scrubber
    Box(modifier = Modifier.fillMaxSize()) {
      LazyColumn(
        state = listState,
        modifier = Modifier
          .fillMaxSize()
          .testTag("index_items_list"),
        contentPadding = PaddingValues(
          end = if (indexMode == IndexViewMode.ALPHABETICAL_A_TO_Z) 32.dp else 0.dp,
          bottom = 96.dp
        )
      ) {
        when (indexMode) {
          IndexViewMode.ALPHABETICAL_A_TO_Z -> {
            alphabeticalMap.forEach { (letter, recipeList) ->
              item(key = "header_$letter") {
                IndexSectionHeader(title = "$letter", count = "${recipeList.size} recipes")
              }
              items(recipeList, key = { "recipe_${it.id}" }) { recipe ->
                IndexRecipeRow(
                  recipe = recipe,
                  onClick = { viewModel.navigateTo(ScreenDestination.Detail(recipe.id)) }
                )
              }
            }
          }

          IndexViewMode.BY_CATEGORY -> {
            categoryMap.forEach { (cat, recipeList) ->
              item(key = "cat_header_${cat.name}") {
                IndexSectionHeader(
                  title = cat.displayName,
                  count = "${recipeList.size} recipes"
                )
              }
              items(recipeList, key = { "cat_recipe_${it.id}" }) { recipe ->
                IndexRecipeRow(
                  recipe = recipe,
                  onClick = { viewModel.navigateTo(ScreenDestination.Detail(recipe.id)) }
                )
              }
            }
          }

          IndexViewMode.BY_CONTRIBUTOR -> {
            contributorMap.forEach { (contributor, recipeList) ->
              item(key = "contributor_header_$contributor") {
                IndexSectionHeader(
                  title = contributor,
                  count = "${recipeList.size} recipes contributed"
                )
              }
              items(recipeList, key = { "contrib_recipe_${it.id}" }) { recipe ->
                IndexRecipeRow(
                  recipe = recipe,
                  onClick = { viewModel.navigateTo(ScreenDestination.Detail(recipe.id)) }
                )
              }
            }
          }
        }
      }

      // Vertical Fast-Scroll Scrubber Rail on right edge
      if (indexMode == IndexViewMode.ALPHABETICAL_A_TO_Z) {
        FastScrollIndexRail(
          letters = alphabeticalMap.keys.toList(),
          activeLetter = currentVisibleLetter ?: selectedLetter ?: 'A',
          onLetterSelected = { letter ->
            viewModel.setSelectedLetter(letter)
            val targetIndex = scrollIndices[letter] ?: viewModel.getLazyListIndexForLetter(letter)
            if (targetIndex != null) {
              coroutineScope.launch {
                listState.scrollToItem(targetIndex)
              }
            }
          },
          modifier = Modifier
            .align(Alignment.CenterEnd)
            .padding(end = 4.dp, top = 8.dp, bottom = 96.dp)
        )
      }
    }
  }
}

/**
 * Sleek vertical fast-scroller rail for alphabetical index navigation.
 * Supports both immediate tap-to-scroll and fluid vertical dragging with a floating preview bubble.
 */
@Composable
fun FastScrollIndexRail(
  letters: List<Char>,
  activeLetter: Char?,
  onLetterSelected: (Char) -> Unit,
  modifier: Modifier = Modifier
) {
  var railHeightPx by remember { mutableStateOf(1) }
  var isDragging by remember { mutableStateOf(false) }
  var draggedLetter by remember { mutableStateOf<Char?>(null) }

  val displayLetter = if (isDragging) draggedLetter else activeLetter

  Box(
    modifier = modifier,
    contentAlignment = Alignment.CenterEnd
  ) {
    // Floating Fast-Scroll Indicator Bubble (shown when user drags or taps)
    AnimatedVisibility(
      visible = isDragging && displayLetter != null,
      enter = fadeIn() + scaleIn(),
      exit = fadeOut() + scaleOut(),
      modifier = Modifier
        .align(Alignment.CenterStart)
        .padding(end = 48.dp)
    ) {
      Surface(
        modifier = Modifier
          .size(60.dp)
          .testTag("fast_scroll_bubble"),
        shape = CircleShape,
        color = MaterialTheme.colorScheme.primary,
        shadowElevation = 8.dp,
        border = BorderStroke(2.dp, MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.5f))
      ) {
        Box(contentAlignment = Alignment.Center) {
          Text(
            text = displayLetter?.toString() ?: "",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onPrimary
          )
        }
      }
    }

    // Vertical Letter Track
    Surface(
      modifier = Modifier
        .clip(RoundedCornerShape(16.dp))
        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.85f))
        .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.6f), RoundedCornerShape(16.dp))
        .onGloballyPositioned { coordinates ->
          if (coordinates.size.height > 0) {
            railHeightPx = coordinates.size.height
          }
        }
        .pointerInput(letters) {
          detectTapGestures(
            onPress = { offset ->
              if (letters.isNotEmpty() && railHeightPx > 0) {
                val itemHeight = railHeightPx.toFloat() / letters.size
                val index = (offset.y / itemHeight).toInt().coerceIn(0, letters.size - 1)
                val selected = letters[index]
                draggedLetter = selected
                isDragging = true
                onLetterSelected(selected)
                tryAwaitRelease()
                isDragging = false
                draggedLetter = null
              }
            }
          )
        }
        .pointerInput(letters) {
          detectVerticalDragGestures(
            onDragStart = { offset ->
              if (letters.isNotEmpty() && railHeightPx > 0) {
                isDragging = true
                val itemHeight = railHeightPx.toFloat() / letters.size
                val index = (offset.y / itemHeight).toInt().coerceIn(0, letters.size - 1)
                val selected = letters[index]
                draggedLetter = selected
                onLetterSelected(selected)
              }
            },
            onDragEnd = {
              isDragging = false
              draggedLetter = null
            },
            onDragCancel = {
              isDragging = false
              draggedLetter = null
            },
            onVerticalDrag = { change, _ ->
              change.consume()
              if (letters.isNotEmpty() && railHeightPx > 0) {
                val itemHeight = railHeightPx.toFloat() / letters.size
                val index = (change.position.y / itemHeight).toInt().coerceIn(0, letters.size - 1)
                val selected = letters[index]
                if (selected != draggedLetter) {
                  draggedLetter = selected
                  onLetterSelected(selected)
                }
              }
            }
          )
        }
        .testTag("fast_scroll_rail"),
      color = Color.Transparent
    ) {
      Column(
        modifier = Modifier.padding(horizontal = 3.dp, vertical = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceEvenly
      ) {
        letters.forEach { letter ->
          val isCurrent = displayLetter == letter
          Box(
            modifier = Modifier
              .size(20.dp)
              .clip(CircleShape)
              .background(if (isCurrent) MaterialTheme.colorScheme.primary else Color.Transparent)
              .clickable { onLetterSelected(letter) }
              .testTag("fast_scroll_letter_$letter"),
            contentAlignment = Alignment.Center
          ) {
            Text(
              text = letter.toString(),
              fontSize = 10.sp,
              fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Medium,
              color = if (isCurrent) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
        }
      }
    }
  }
}

@Composable
fun IndexSectionHeader(
  title: String,
  count: String
) {
  Surface(
    color = MaterialTheme.colorScheme.surfaceVariant,
    modifier = Modifier.fillMaxWidth()
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 6.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Text(
        text = title,
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.onSurfaceVariant
      )
      Text(
        text = count,
        style = MaterialTheme.typography.labelSmall,
        color = MaterialTheme.colorScheme.outline
      )
    }
  }
}

@Composable
fun IndexRecipeRow(
  recipe: Recipe,
  onClick: () -> Unit
) {
  Surface(
    modifier = Modifier
      .fillMaxWidth()
      .clickable { onClick() }
      .testTag("index_row_${recipe.id}"),
    color = MaterialTheme.colorScheme.surface
  ) {
    Column {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        Column(modifier = Modifier.weight(1f)) {
          Text(
            text = recipe.title,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurface
          )
          if (recipe.italianTitle.isNotEmpty() && !recipe.italianTitle.equals(recipe.title, ignoreCase = true)) {
            Text(
              text = recipe.italianTitle,
              fontSize = 12.sp,
              fontStyle = FontStyle.Italic,
              color = MaterialTheme.colorScheme.primary
            )
          }
          Text(
            text = "${recipe.category.displayName} • By ${recipe.contributor}",
            fontSize = 11.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f)
          )

          // Compact difficulty & spice row
          Row(
            modifier = Modifier.padding(top = 2.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
          ) {
            Text(
              text = "${"●".repeat(recipe.calculatedDifficulty.dots)} ${recipe.calculatedDifficulty.label}",
              fontSize = 10.sp,
              fontWeight = FontWeight.Medium,
              color = MaterialTheme.colorScheme.primary
            )
            if (recipe.calculatedSpiceLevel != SpiceLevel.MILD) {
              Text(
                text = "• ${recipe.calculatedSpiceLevel.chiliIcon} ${recipe.calculatedSpiceLevel.label}",
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.secondary
              )
            }
          }
        }

        Spacer(modifier = Modifier.width(8.dp))

        Surface(
          color = MaterialTheme.colorScheme.surfaceVariant,
          shape = RoundedCornerShape(8.dp)
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
          ) {
            Text(
              text = recipe.prepTime,
              fontSize = 12.sp,
              fontWeight = FontWeight.Medium,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
        }

        Spacer(modifier = Modifier.width(4.dp))

        Icon(
          imageVector = Icons.Default.ChevronRight,
          contentDescription = null,
          tint = MaterialTheme.colorScheme.outline
        )
      }
      HorizontalDivider(
        modifier = Modifier.padding(start = 16.dp),
        color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f)
      )
    }
  }
}
