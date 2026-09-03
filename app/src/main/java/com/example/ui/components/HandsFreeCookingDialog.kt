package com.example.ui.components

import android.app.Activity
import android.content.Intent
import android.speech.RecognizerIntent
import android.speech.tts.TextToSpeech
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.filled.VolumeUp
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.data.model.Recipe
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HandsFreeCookingDialog(
  recipe: Recipe,
  currentStepIndex: Int,
  onStepChanged: (Int) -> Unit,
  onDismiss: () -> Unit,
  onStartTimerMinutes: (Int, String) -> Unit
) {
  val context = LocalContext.current
  val totalSteps = recipe.instructions.size.coerceAtLeast(1)
  val safeStepIndex = currentStepIndex.coerceIn(0, totalSteps - 1)
  val currentInstruction = recipe.instructions.getOrElse(safeStepIndex) { "Follow recipe directions." }

  var showIngredientsGlance by remember { mutableStateOf(false) }

  // Android Text-to-Speech
  var tts by remember { mutableStateOf<TextToSpeech?>(null) }
  var isSpeaking by remember { mutableStateOf(false) }

  DisposableEffect(Unit) {
    var textToSpeech: TextToSpeech? = null
    textToSpeech = TextToSpeech(context) { status ->
      if (status == TextToSpeech.SUCCESS) {
        textToSpeech?.language = Locale.US
      }
    }
    tts = textToSpeech

    onDispose {
      textToSpeech?.stop()
      textToSpeech?.shutdown()
    }
  }

  // Voice Recognition Launcher
  val speechLauncher = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.StartActivityForResult()
  ) { result ->
    if (result.resultCode == Activity.RESULT_OK) {
      val spokenList = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
      val heard = spokenList?.firstOrNull()?.lowercase() ?: ""

      when {
        heard.contains("next") || heard.contains("forward") -> {
          if (safeStepIndex < totalSteps - 1) {
            onStepChanged(safeStepIndex + 1)
          }
        }
        heard.contains("back") || heard.contains("previous") || heard.contains("prev") -> {
          if (safeStepIndex > 0) {
            onStepChanged(safeStepIndex - 1)
          }
        }
        heard.contains("read") || heard.contains("repeat") || heard.contains("speak") -> {
          tts?.speak("Step ${safeStepIndex + 1}. $currentInstruction", TextToSpeech.QUEUE_FLUSH, null, "step_tts")
        }
      }
    }
  }

  // Extract timer mention if any (e.g. "simmer for 15 minutes")
  val timerMatch = Regex("""(\d+)\s*(?:minutes?|mins?)""", RegexOption.IGNORE_CASE).find(currentInstruction)
  val stepTimerMinutes = timerMatch?.groupValues?.get(1)?.toIntOrNull()

  Dialog(
    onDismissRequest = onDismiss,
    properties = DialogProperties(usePlatformDefaultWidth = false)
  ) {
    Surface(
      modifier = Modifier.fillMaxSize(),
      color = MaterialTheme.colorScheme.background
    ) {
      Column(
        modifier = Modifier
          .fillMaxSize()
          .padding(20.dp),
        verticalArrangement = Arrangement.SpaceBetween
      ) {
        // --- TOP BAR: Step progress, voice indicator, close ---
        Column(modifier = Modifier.fillMaxWidth()) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Box(
                modifier = Modifier
                  .size(40.dp)
                  .clip(CircleShape)
                  .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
              ) {
                Icon(
                  imageVector = Icons.Default.Restaurant,
                  contentDescription = null,
                  tint = MaterialTheme.colorScheme.primary,
                  modifier = Modifier.size(20.dp)
                )
              }
              Spacer(modifier = Modifier.width(12.dp))
              Column {
                Text(
                  text = "Hands-Free Kitchen Mode",
                  style = MaterialTheme.typography.titleMedium,
                  fontWeight = FontWeight.Bold,
                  color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                  text = recipe.title,
                  style = MaterialTheme.typography.bodySmall,
                  color = MaterialTheme.colorScheme.onSurfaceVariant
                )
              }
            }

            IconButton(
              onClick = onDismiss,
              modifier = Modifier
                .size(48.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.surfaceVariant)
            ) {
              Icon(Icons.Default.Close, contentDescription = "Exit Hands-Free", tint = MaterialTheme.colorScheme.onSurface)
            }
          }

          Spacer(modifier = Modifier.height(14.dp))

          // Progress bar
          LinearProgressIndicator(
            progress = { (safeStepIndex + 1).toFloat() / totalSteps },
            modifier = Modifier
              .fillMaxWidth()
              .height(8.dp)
              .clip(RoundedCornerShape(4.dp)),
            color = MaterialTheme.colorScheme.primary,
            trackColor = MaterialTheme.colorScheme.surfaceVariant
          )

          Spacer(modifier = Modifier.height(8.dp))

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Text(
              text = "STEP ${safeStepIndex + 1} OF $totalSteps",
              style = MaterialTheme.typography.labelLarge,
              fontWeight = FontWeight.Bold,
              color = MaterialTheme.colorScheme.primary,
              letterSpacing = 1.sp
            )

            Text(
              text = if (showIngredientsGlance) "Hide Ingredients ▲" else "Peek Ingredients ▼",
              style = MaterialTheme.typography.labelMedium,
              fontWeight = FontWeight.SemiBold,
              color = MaterialTheme.colorScheme.secondary,
              modifier = Modifier
                .clip(RoundedCornerShape(6.dp))
                .clickable { showIngredientsGlance = !showIngredientsGlance }
                .padding(horizontal = 8.dp, vertical = 2.dp)
            )
          }

          // Expandable Ingredients Glance
          AnimatedVisibility(visible = showIngredientsGlance) {
            Card(
              modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
              colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
              shape = RoundedCornerShape(12.dp),
              border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
            ) {
              LazyColumn(
                modifier = Modifier
                  .fillMaxWidth()
                  .height(150.dp)
                  .padding(12.dp)
              ) {
                item {
                  Text(
                    text = "Quick Ingredients Check:",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                  )
                  Spacer(modifier = Modifier.height(4.dp))
                }
                items(recipe.ingredients) { ing ->
                  Text(
                    text = "• ${ing.rawText}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.padding(vertical = 2.dp)
                  )
                }
              }
            }
          }
        }

        // --- CENTER: Massive High-Contrast Step Card ---
        Card(
          modifier = Modifier
            .fillMaxWidth()
            .weight(1f)
            .padding(vertical = 12.dp),
          colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
          shape = RoundedCornerShape(20.dp),
          border = androidx.compose.foundation.BorderStroke(1.5.dp, MaterialTheme.colorScheme.outlineVariant),
          elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
          Column(
            modifier = Modifier
              .fillMaxSize()
              .padding(24.dp),
            verticalArrangement = Arrangement.SpaceBetween
          ) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Box(
                modifier = Modifier
                  .clip(RoundedCornerShape(8.dp))
                  .background(MaterialTheme.colorScheme.primaryContainer)
                  .padding(horizontal = 14.dp, vertical = 6.dp)
              ) {
                Text(
                  text = "ACTION ${safeStepIndex + 1}",
                  style = MaterialTheme.typography.labelLarge,
                  fontWeight = FontWeight.Bold,
                  color = MaterialTheme.colorScheme.onPrimaryContainer
                )
              }

              // Read aloud action
              IconButton(
                onClick = {
                  tts?.speak("Step ${safeStepIndex + 1}. $currentInstruction", TextToSpeech.QUEUE_FLUSH, null, "step_tts")
                },
                modifier = Modifier
                  .size(48.dp)
                  .clip(CircleShape)
                  .background(MaterialTheme.colorScheme.surfaceVariant)
              ) {
                Icon(
                  imageVector = Icons.AutoMirrored.Filled.VolumeUp,
                  contentDescription = "Read Step Aloud",
                  tint = MaterialTheme.colorScheme.primary
                )
              }
            }

            // Jumbo Instruction Text (readable from across kitchen)
            Text(
              text = currentInstruction,
              style = MaterialTheme.typography.headlineSmall.copy(
                fontSize = 24.sp,
                lineHeight = 36.sp,
                fontWeight = FontWeight.Medium
              ),
              color = MaterialTheme.colorScheme.onSurface,
              modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
            )

            // Embedded Step Timer button if time mentioned
            if (stepTimerMinutes != null && stepTimerMinutes > 0) {
              Box(
                modifier = Modifier
                  .fillMaxWidth()
                  .clip(RoundedCornerShape(12.dp))
                  .background(MaterialTheme.colorScheme.tertiaryContainer)
                  .clickable {
                    onStartTimerMinutes(stepTimerMinutes, "${recipe.title} - Step ${safeStepIndex + 1}")
                  }
                  .padding(horizontal = 16.dp, vertical = 12.dp)
              ) {
                Row(
                  modifier = Modifier.fillMaxWidth(),
                  horizontalArrangement = Arrangement.SpaceBetween,
                  verticalAlignment = Alignment.CenterVertically
                ) {
                  Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                      imageVector = Icons.Default.Timer,
                      contentDescription = null,
                      tint = MaterialTheme.colorScheme.onTertiaryContainer
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                      text = "Step mentions ${stepTimerMinutes} mins",
                      style = MaterialTheme.typography.bodyMedium,
                      fontWeight = FontWeight.SemiBold,
                      color = MaterialTheme.colorScheme.onTertiaryContainer
                    )
                  }
                  Text(
                    text = "Start Timer ▶",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                  )
                }
              }
            } else {
              Spacer(modifier = Modifier.height(1.dp))
            }
          }
        }

        // --- BOTTOM: Giant 76dp Tap Targets for Messy Kitchen Hands ---
        Column(modifier = Modifier.fillMaxWidth()) {
          // Voice recognition assistant bar
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .clip(RoundedCornerShape(14.dp))
              .background(MaterialTheme.colorScheme.surfaceVariant)
              .clickable {
                try {
                  val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_PROMPT, "Say 'Next', 'Back', or 'Read Step'")
                  }
                  speechLauncher.launch(intent)
                } catch (e: Exception) {
                  // Fallback speech prompt
                }
              }
              .padding(vertical = 12.dp, horizontal = 16.dp),
            contentAlignment = Alignment.Center
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.Center
            ) {
              Icon(
                imageVector = Icons.Default.Mic,
                contentDescription = "Voice Control",
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(24.dp)
              )
              Spacer(modifier = Modifier.width(10.dp))
              Text(
                text = "Tap or Speak: \"Next\", \"Back\", or \"Read Step\"",
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface
              )
            }
          }

          Spacer(modifier = Modifier.height(12.dp))

          // Jumbo Prev & Next Buttons
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(14.dp)
          ) {
            // Jumbo PREV
            Box(
              modifier = Modifier
                .weight(1f)
                .height(76.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(
                  if (safeStepIndex > 0) MaterialTheme.colorScheme.surfaceVariant
                  else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                )
                .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(16.dp))
                .clickable(enabled = safeStepIndex > 0) {
                  onStepChanged(safeStepIndex - 1)
                },
              contentAlignment = Alignment.Center
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                  imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                  contentDescription = null,
                  modifier = Modifier.size(28.dp),
                  tint = if (safeStepIndex > 0) MaterialTheme.colorScheme.onSurface else Color.Gray
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                  text = "PREVIOUS",
                  style = MaterialTheme.typography.titleMedium,
                  fontWeight = FontWeight.Bold,
                  color = if (safeStepIndex > 0) MaterialTheme.colorScheme.onSurface else Color.Gray
                )
              }
            }

            // Jumbo NEXT / FINISH
            val isLastStep = safeStepIndex == totalSteps - 1
            Box(
              modifier = Modifier
                .weight(1.3f)
                .height(76.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(
                  if (isLastStep) Color(0xFF4A7C59) // Forest green completion
                  else MaterialTheme.colorScheme.primary
                )
                .clickable {
                  if (isLastStep) {
                    onDismiss()
                  } else {
                    onStepChanged(safeStepIndex + 1)
                  }
                },
              contentAlignment = Alignment.Center
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                  text = if (isLastStep) "DONE! ✓" else "NEXT STEP",
                  style = MaterialTheme.typography.titleMedium,
                  fontWeight = FontWeight.Bold,
                  color = Color.White
                )
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                  imageVector = if (isLastStep) Icons.Default.Check else Icons.AutoMirrored.Filled.ArrowForward,
                  contentDescription = null,
                  modifier = Modifier.size(28.dp),
                  tint = Color.White
                )
              }
            }
          }
        }
      }
    }
  }
}
