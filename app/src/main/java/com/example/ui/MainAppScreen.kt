package com.example.ui

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoStories
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Kitchen
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.SortByAlpha
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.outlined.AutoStories
import androidx.compose.material.icons.outlined.Kitchen
import androidx.compose.material.icons.outlined.MenuBook
import androidx.compose.material.icons.outlined.SortByAlpha
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.components.CulinaryMonochromeBackground
import com.example.ui.screens.AlphabeticalIndexScreen
import com.example.ui.screens.HeritageNotesScreen
import com.example.ui.screens.PantryMatcherScreen
import com.example.ui.screens.RecipeDetailScreen
import com.example.ui.screens.RecipeListScreen
import com.example.ui.viewmodel.CookbookViewModel
import com.example.ui.viewmodel.ScreenDestination
import java.util.Locale

@Composable
fun MainAppScreen(
  viewModel: CookbookViewModel
) {
  val currentScreen by viewModel.currentScreen.collectAsStateWithLifecycle()
  val timerSeconds by viewModel.timerSecondsRemaining.collectAsStateWithLifecycle()
  val isTimerRunning by viewModel.isTimerRunning.collectAsStateWithLifecycle()
  val isTimerAlert by viewModel.isTimerAlertTriggered.collectAsStateWithLifecycle()
  val timerLabel by viewModel.timerLabel.collectAsStateWithLifecycle()

  // Handle Android system back press
  BackHandler(enabled = currentScreen is ScreenDestination.Detail) {
    viewModel.navigateBack()
  }

  val isDetailScreen = currentScreen is ScreenDestination.Detail

  Scaffold(
    contentWindowInsets = WindowInsets.safeDrawing,
    bottomBar = {
      if (!isDetailScreen) {
        Column {
          // Global Floating Kitchen Timer Bar
          AnimatedVisibility(visible = timerSeconds > 0 || isTimerAlert) {
            Surface(
              color = if (isTimerAlert) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface,
              border = BorderStroke(1.dp, if (isTimerAlert) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline),
              shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp),
              modifier = Modifier
                .fillMaxWidth()
                .testTag("global_timer_bar")
            ) {
              Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Row(
                  verticalAlignment = Alignment.CenterVertically,
                  modifier = Modifier.weight(1f)
                ) {
                  Icon(
                    imageVector = if (isTimerAlert) Icons.Filled.NotificationsActive else Icons.Filled.Timer,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(20.dp)
                  )
                  Spacer(modifier = Modifier.width(8.dp))
                  Column {
                    Text(
                      text = if (isTimerAlert) "⏰ Timer Finished!" else timerLabel,
                      fontSize = 12.sp,
                      fontWeight = FontWeight.Bold,
                      color = MaterialTheme.colorScheme.onSurface,
                      maxLines = 1
                    )
                    if (!isTimerAlert) {
                      val mins = timerSeconds / 60
                      val secs = timerSeconds % 60
                      Text(
                        text = String.format(Locale.getDefault(), "%02d:%02d remaining", mins, secs),
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.SemiBold
                      )
                    }
                  }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                  if (isTimerAlert) {
                    Button(
                      onClick = { viewModel.dismissTimerAlert() },
                      colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                      shape = RoundedCornerShape(10.dp),
                      contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                      Text("Dismiss", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                  } else {
                    IconButton(
                      onClick = { viewModel.pauseResumeTimer() },
                      modifier = Modifier.size(32.dp)
                    ) {
                      Icon(
                        imageVector = if (isTimerRunning) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                        contentDescription = "Toggle Timer",
                        tint = MaterialTheme.colorScheme.primary
                      )
                    }
                    IconButton(
                      onClick = { viewModel.resetTimer() },
                      modifier = Modifier.size(32.dp)
                    ) {
                      Icon(
                        imageVector = Icons.Filled.Close,
                        contentDescription = "Cancel Timer",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                      )
                    }
                  }
                }
              }
            }
          }

          HorizontalDivider(
            color = MaterialTheme.colorScheme.outline,
            thickness = 1.dp
          )
          NavigationBar(
            containerColor = MaterialTheme.colorScheme.background,
            tonalElevation = 0.dp,
            modifier = Modifier.testTag("bottom_navigation_bar")
          ) {
            val navItemColors = NavigationBarItemDefaults.colors(
              selectedIconColor = MaterialTheme.colorScheme.primary,
              selectedTextColor = MaterialTheme.colorScheme.primary,
              unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
              unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
              indicatorColor = MaterialTheme.colorScheme.primaryContainer
            )

            NavigationBarItem(
              selected = currentScreen is ScreenDestination.Explore,
              onClick = { viewModel.navigateTo(ScreenDestination.Explore) },
              icon = {
                Icon(
                  imageVector = if (currentScreen is ScreenDestination.Explore) Icons.Filled.MenuBook else Icons.Outlined.MenuBook,
                  contentDescription = "Recipes"
                )
              },
              label = {
                Text(
                  "Cookbook",
                  fontSize = 11.sp,
                  fontWeight = if (currentScreen is ScreenDestination.Explore) FontWeight.SemiBold else FontWeight.Normal
                )
              },
              colors = navItemColors,
              modifier = Modifier.testTag("nav_explore")
            )

            NavigationBarItem(
              selected = currentScreen is ScreenDestination.PantryMatcher,
              onClick = { viewModel.navigateTo(ScreenDestination.PantryMatcher) },
              icon = {
                Icon(
                  imageVector = if (currentScreen is ScreenDestination.PantryMatcher) Icons.Filled.Kitchen else Icons.Outlined.Kitchen,
                  contentDescription = "What Can I Make?"
                )
              },
              label = {
                Text(
                  "Pantry",
                  fontSize = 11.sp,
                  fontWeight = if (currentScreen is ScreenDestination.PantryMatcher) FontWeight.SemiBold else FontWeight.Normal
                )
              },
              colors = navItemColors,
              modifier = Modifier.testTag("nav_pantry")
            )

            NavigationBarItem(
              selected = currentScreen is ScreenDestination.IndexCatalog,
              onClick = { viewModel.navigateTo(ScreenDestination.IndexCatalog) },
              icon = {
                Icon(
                  imageVector = if (currentScreen is ScreenDestination.IndexCatalog) Icons.Filled.SortByAlpha else Icons.Outlined.SortByAlpha,
                  contentDescription = "A–Z Index"
                )
              },
              label = {
                Text(
                  "Index",
                  fontSize = 11.sp,
                  fontWeight = if (currentScreen is ScreenDestination.IndexCatalog) FontWeight.SemiBold else FontWeight.Normal
                )
              },
              colors = navItemColors,
              modifier = Modifier.testTag("nav_index")
            )

            NavigationBarItem(
              selected = currentScreen is ScreenDestination.HeritageNotes,
              onClick = { viewModel.navigateTo(ScreenDestination.HeritageNotes) },
              icon = {
                Icon(
                  imageVector = if (currentScreen is ScreenDestination.HeritageNotes) Icons.Filled.AutoStories else Icons.Outlined.AutoStories,
                  contentDescription = "Heritage & Guides"
                )
              },
              label = {
                Text(
                  "Heritage",
                  fontSize = 11.sp,
                  fontWeight = if (currentScreen is ScreenDestination.HeritageNotes) FontWeight.SemiBold else FontWeight.Normal
                )
              },
              colors = navItemColors,
              modifier = Modifier.testTag("nav_heritage")
            )
          }
        }
      }
    }
  ) { innerPadding ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding)
    ) {
      CulinaryMonochromeBackground(
        modifier = Modifier.fillMaxSize(),
        alpha = 0.045f
      )

      AnimatedContent(
        targetState = currentScreen,
        transitionSpec = { fadeIn() togetherWith fadeOut() },
        modifier = Modifier.fillMaxSize(),
        label = "screen_transition"
      ) { targetScreen ->
        when (targetScreen) {
          is ScreenDestination.Explore -> {
            RecipeListScreen(viewModel = viewModel)
          }
          is ScreenDestination.PantryMatcher -> {
            PantryMatcherScreen(viewModel = viewModel)
          }
          is ScreenDestination.IndexCatalog -> {
            AlphabeticalIndexScreen(viewModel = viewModel)
          }
          is ScreenDestination.HeritageNotes -> {
            HeritageNotesScreen()
          }
          is ScreenDestination.Detail -> {
            RecipeDetailScreen(
              recipeId = targetScreen.recipeId,
              viewModel = viewModel
            )
          }
          is ScreenDestination.PrintExport -> {
            RecipeListScreen(viewModel = viewModel)
          }
        }
      }
    }
  }
}
