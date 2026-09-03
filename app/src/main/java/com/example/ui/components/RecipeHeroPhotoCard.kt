package com.example.ui.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddPhotoAlternate
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.PhotoCamera
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import coil.request.ImageRequest
import com.example.data.model.Recipe
import com.example.ui.util.RecipePhotoResolver

/**
 * Hero Photo Card matching the heirloom cookbook design and the user's reference mockup:
 *
 * 1. Shows authentic heritage photo for every single recipe!
 * 2. If the recipe has an archival photo in the family cookbook PDF, marks it with the original PDF caption & page!
 * 3. Every recipe allows the user to add or change their own photo in addition to the heritage photo.
 * 4. Floating favorite heart button in the top-right corner.
 * 5. Full warm beige color scheme without white background.
 */
@Composable
fun RecipeHeroPhotoCard(
  recipe: Recipe,
  customPhotoUri: String?,
  isFavorite: Boolean,
  onToggleFavorite: () -> Unit,
  onPhotoSelected: (String) -> Unit,
  onPhotoRemoved: () -> Unit,
  modifier: Modifier = Modifier
) {
  val context = LocalContext.current
  var showPhotoOptionsDialog by remember { mutableStateOf(false) }
  var viewingHeritageByDefault by remember { mutableStateOf(false) }

  val photoPickerLauncher = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.PickVisualMedia()
  ) { uri: Uri? ->
    uri?.let {
      viewingHeritageByDefault = false
      onPhotoSelected(it.toString())
    }
  }

  val hasPdfArchivalPhoto = recipe.originalPhotoCaption.isNotBlank()
  val heritagePhotoResId = RecipePhotoResolver.getHeritageDrawableRes(context, recipe)
  val isDisplayingCustom = customPhotoUri != null && !viewingHeritageByDefault

  if (showPhotoOptionsDialog) {
    AlertDialog(
      onDismissRequest = { showPhotoOptionsDialog = false },
      containerColor = MaterialTheme.colorScheme.surface,
      titleContentColor = MaterialTheme.colorScheme.onSurface,
      textContentColor = MaterialTheme.colorScheme.onSurfaceVariant,
      title = {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(
            imageVector = Icons.Default.CameraAlt,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(24.dp)
          )
          Spacer(modifier = Modifier.width(8.dp))
          Text("Recipe Photography", fontWeight = FontWeight.SemiBold)
        }
      },
      text = {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
          if (hasPdfArchivalPhoto) {
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = Color(0xFFE5DACB),
              modifier = Modifier.fillMaxWidth()
            ) {
              Column(modifier = Modifier.padding(10.dp)) {
                Text(
                  text = "Family Cookbook Archive",
                  fontWeight = FontWeight.Bold,
                  fontSize = 12.sp,
                  color = Color(0xFF4A3B2C)
                )
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                  text = "“${recipe.originalPhotoCaption}”",
                  fontStyle = FontStyle.Italic,
                  fontSize = 12.sp,
                  color = Color(0xFF332619)
                )
              }
            }
          }

          Text(
            text = "Every recipe has an authentic heritage photo, and you can also add your own photo of this dish.",
            fontSize = 13.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )

          if (customPhotoUri != null) {
            Surface(
              shape = RoundedCornerShape(8.dp),
              color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
              modifier = Modifier.fillMaxWidth()
            ) {
              Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(8.dp)
              ) {
                Icon(
                  imageVector = Icons.Default.AutoAwesome,
                  contentDescription = null,
                  tint = MaterialTheme.colorScheme.primary,
                  modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                  text = if (isDisplayingCustom) "Currently showing: Your photo" else "Currently showing: Heritage photo",
                  fontSize = 12.sp,
                  fontWeight = FontWeight.Medium,
                  color = MaterialTheme.colorScheme.onPrimaryContainer
                )
              }
            }
          }
        }
      },
      confirmButton = {
        Column(
          modifier = Modifier.fillMaxWidth(),
          verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
          Button(
            onClick = {
              showPhotoOptionsDialog = false
              photoPickerLauncher.launch(
                PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
              )
            },
            colors = ButtonDefaults.buttonColors(
              containerColor = MaterialTheme.colorScheme.primary,
              contentColor = MaterialTheme.colorScheme.onPrimary
            ),
            modifier = Modifier
              .fillMaxWidth()
              .testTag("dialog_pick_photo_button")
          ) {
            Icon(
              imageVector = Icons.Default.AddPhotoAlternate,
              contentDescription = null,
              modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(if (customPhotoUri != null) "Choose Different Photo" else "Add My Photo")
          }

          if (customPhotoUri != null) {
            Button(
              onClick = {
                viewingHeritageByDefault = !viewingHeritageByDefault
                showPhotoOptionsDialog = false
              },
              colors = ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.secondaryContainer,
                contentColor = MaterialTheme.colorScheme.onSecondaryContainer
              ),
              modifier = Modifier.fillMaxWidth()
            ) {
              Icon(
                imageVector = Icons.Default.Visibility,
                contentDescription = null,
                modifier = Modifier.size(18.dp)
              )
              Spacer(modifier = Modifier.width(6.dp))
              Text(if (isDisplayingCustom) "Switch to Heritage Photo" else "Switch to My Photo")
            }

            TextButton(
              onClick = {
                showPhotoOptionsDialog = false
                viewingHeritageByDefault = false
                onPhotoRemoved()
              },
              modifier = Modifier
                .fillMaxWidth()
                .testTag("dialog_remove_photo_button")
            ) {
              Icon(
                imageVector = Icons.Default.Delete,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.error,
                modifier = Modifier.size(18.dp)
              )
              Spacer(modifier = Modifier.width(4.dp))
              Text("Remove My Custom Photo", color = MaterialTheme.colorScheme.error)
            }
          }

          TextButton(
            onClick = { showPhotoOptionsDialog = false },
            modifier = Modifier.align(Alignment.End)
          ) {
            Text("Close")
          }
        }
      },
      dismissButton = {}
    )
  }

  Card(
    shape = RoundedCornerShape(24.dp),
    colors = CardDefaults.cardColors(
      containerColor = MaterialTheme.colorScheme.surface
    ),
    border = androidx.compose.foundation.BorderStroke(
      1.dp,
      MaterialTheme.colorScheme.outline
    ),
    modifier = modifier
      .fillMaxWidth()
      .testTag("recipe_hero_photo_card")
  ) {
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .aspectRatio(1.35f)
        .clip(RoundedCornerShape(24.dp))
    ) {
      // Photo rendering (Custom User Photo OR Heritage Dish Photo)
      if (isDisplayingCustom && customPhotoUri != null) {
        SubcomposeAsyncImage(
          model = ImageRequest.Builder(context)
            .data(customPhotoUri)
            .crossfade(true)
            .build(),
          contentDescription = "Photo of ${recipe.title}",
          contentScale = ContentScale.Crop,
          loading = {
            Box(
              modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.surfaceVariant),
              contentAlignment = Alignment.Center
            ) {
              CircularProgressIndicator(
                color = MaterialTheme.colorScheme.primary,
                strokeWidth = 3.dp,
                modifier = Modifier.size(36.dp)
              )
            }
          },
          error = {
            Image(
              painter = painterResource(id = heritagePhotoResId),
              contentDescription = "Heritage dish photo of ${recipe.title}",
              contentScale = ContentScale.Crop,
              modifier = Modifier.fillMaxSize()
            )
          },
          modifier = Modifier.fillMaxSize()
        )
      } else {
        // Authentic Heritage Photo for every recipe
        Image(
          painter = painterResource(id = heritagePhotoResId),
          contentDescription = "Heritage dish photo of ${recipe.title}",
          contentScale = ContentScale.Crop,
          modifier = Modifier.fillMaxSize()
        )
      }

      // Soft vignette gradient on bottom for readable photo action overlays
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .height(110.dp)
          .align(Alignment.BottomCenter)
          .background(
            Brush.verticalGradient(
              colors = listOf(
                Color.Transparent,
                Color(0x99261D16),
                Color(0xDD261D16)
              )
            )
          )
      )

      // Top right: Floating Favorite heart button (matching user screenshot)
      Surface(
        shape = CircleShape,
        color = Color(0xE6F4EEE5), // Warm beige semi-transparent bubble
        shadowElevation = 4.dp,
        modifier = Modifier
          .align(Alignment.TopEnd)
          .padding(14.dp)
      ) {
        IconButton(
          onClick = onToggleFavorite,
          modifier = Modifier
            .size(44.dp)
            .testTag("hero_photo_fav_button")
        ) {
          Icon(
            imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
            contentDescription = if (isFavorite) "Remove from favorites" else "Add to favorites",
            tint = if (isFavorite) Color(0xFFB8452D) else MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.size(24.dp)
          )
        }
      }

      // Top left: Page badge or custom photo indicator
      Surface(
        shape = RoundedCornerShape(12.dp),
        color = Color(0xE6F4EEE5),
        shadowElevation = 2.dp,
        modifier = Modifier
          .align(Alignment.TopStart)
          .padding(14.dp)
      ) {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
        ) {
          Icon(
            imageVector = when {
              isDisplayingCustom -> Icons.Default.AutoAwesome
              hasPdfArchivalPhoto -> Icons.Default.CameraAlt
              else -> Icons.Default.Image
            },
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(15.dp)
          )
          Spacer(modifier = Modifier.width(5.dp))
          Text(
            text = when {
              isDisplayingCustom -> "My Photo"
              hasPdfArchivalPhoto -> "Family Photo"
              else -> "Heritage Photo"
            },
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurface
          )
        }
      }

      // Bottom Action: Add / Change Photo button
      Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color(0xDD261D16),
        modifier = Modifier
          .align(Alignment.BottomEnd)
          .padding(12.dp)
          .clickable { showPhotoOptionsDialog = true }
          .testTag("hero_change_photo_pill")
      ) {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp)
        ) {
          Icon(
            imageVector = if (customPhotoUri != null) Icons.Default.Edit else Icons.Outlined.PhotoCamera,
            contentDescription = "Change photo",
            tint = Color(0xFFFAF7F2),
            modifier = Modifier.size(15.dp)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = if (customPhotoUri != null) "Photo Options" else "Add My Photo",
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFFFAF7F2)
          )
        }
      }

      // Bottom left: Recipe caption overlay if present or dish title
      Box(
        modifier = Modifier
          .align(Alignment.BottomStart)
          .padding(12.dp)
          .fillMaxWidth(0.62f)
      ) {
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = Color(0xB8261D16)
        ) {
          Column(modifier = Modifier.padding(horizontal = 9.dp, vertical = 5.dp)) {
            if (hasPdfArchivalPhoto && !isDisplayingCustom) {
              Text(
                text = "Family Cookbook Archive",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFDFC6A6)
              )
              Text(
                text = "“${recipe.originalPhotoCaption}”",
                fontSize = 11.sp,
                fontStyle = FontStyle.Italic,
                color = Color(0xFFFAF7F2),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
              )
            } else {
              Text(
                text = if (isDisplayingCustom) "Custom Dish Photo" else (recipe.italianTitle.ifEmpty { recipe.title }),
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFFFAF7F2),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
              )
              Text(
                text = recipe.contributor,
                fontSize = 10.sp,
                color = Color(0xFFDFC6A6)
              )
            }
          }
        }
      }
    }
  }
}
