package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme =
  darkColorScheme(
    primary = NeutralBeigePrimaryDark,
    onPrimary = NeutralBeigeOnPrimaryDark,
    primaryContainer = NeutralBeigePrimaryContainerDark,
    onPrimaryContainer = NeutralBeigeOnPrimaryContainerDark,
    secondary = NeutralBeigeSecondaryDark,
    onSecondary = NeutralBeigeOnSecondaryDark,
    secondaryContainer = NeutralBeigeSecondaryContainerDark,
    onSecondaryContainer = NeutralBeigeOnSecondaryContainerDark,
    tertiary = NeutralBeigeTertiaryDark,
    onTertiary = NeutralBeigeOnTertiaryDark,
    tertiaryContainer = NeutralBeigeTertiaryContainerDark,
    onTertiaryContainer = NeutralBeigeOnTertiaryContainerDark,
    background = NeutralBeigeBackgroundDark,
    onBackground = NeutralBeigeTextPrimaryDark,
    surface = NeutralBeigeSurfaceDark,
    onSurface = NeutralBeigeTextPrimaryDark,
    surfaceVariant = NeutralBeigeSurfaceVariantDark,
    onSurfaceVariant = NeutralBeigeTextSecondaryDark,
    outline = NeutralBeigeOutlineDark,
    outlineVariant = NeutralBeigeOutlineDark
  )

private val LightColorScheme =
  lightColorScheme(
    primary = NeutralBeigePrimary,
    onPrimary = NeutralBeigeOnPrimary,
    primaryContainer = NeutralBeigePrimaryContainer,
    onPrimaryContainer = NeutralBeigeOnPrimaryContainer,
    secondary = NeutralBeigeSecondary,
    onSecondary = NeutralBeigeOnPrimary,
    secondaryContainer = NeutralBeigeSecondaryContainer,
    onSecondaryContainer = NeutralBeigeOnSecondaryContainer,
    tertiary = NeutralBeigeTertiary,
    onTertiary = NeutralBeigeOnPrimary,
    tertiaryContainer = NeutralBeigeTertiaryContainer,
    onTertiaryContainer = NeutralBeigeOnTertiaryContainer,
    background = NeutralBeigeBackground,
    onBackground = NeutralBeigeTextPrimary,
    surface = NeutralBeigeSurface,
    onSurface = NeutralBeigeTextPrimary,
    surfaceVariant = NeutralBeigeSurfaceVariant,
    onSurfaceVariant = NeutralBeigeTextSecondary,
    outline = NeutralBeigeOutline,
    outlineVariant = NeutralBeigeOutlineVariant
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = false, // Always present the user's requested neutral beige almost-white canvas
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  val colorScheme = LightColorScheme

  MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}
