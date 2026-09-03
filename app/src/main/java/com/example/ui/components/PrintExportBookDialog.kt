package com.example.ui.components

import android.content.Context
import android.print.PrintAttributes
import android.print.PrintManager
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Print
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.data.model.Recipe

enum class BookTemplate(
  val title: String,
  val subtitle: String,
  val accentColorHex: String,
  val bgHex: String
) {
  VINTAGE_HEIRLOOM(
    "Vintage Heirloom",
    "Warm parchment tones, classic serif headings & Italian crest borders",
    "#8C3A27",
    "#FAF6EE"
  ),
  MODERN_MINIMALIST(
    "Modern Minimalist",
    "High-contrast monochrome layout with clean lines & nutrition grid",
    "#222222",
    "#FFFFFF"
  ),
  TUSCAN_TRATTORIA(
    "Tuscan Trattoria",
    "Warm terracotta headers, rustic culinary stamps & festive accents",
    "#B85D36",
    "#FCF9F2"
  )
}

enum class ExportScope(val label: String) {
  SINGLE_RECIPE("Current Recipe"),
  FAVORITES("My Favorites"),
  FULL_ARCHIVE("Complete Archive (All 158)")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PrintExportBookDialog(
  currentRecipe: Recipe?,
  allRecipes: List<Recipe>,
  favoriteRecipeIds: Set<String>,
  onDismiss: () -> Unit
) {
  val context = LocalContext.current
  var selectedTemplate by remember { mutableStateOf(BookTemplate.VINTAGE_HEIRLOOM) }
  var selectedScope by remember {
    mutableStateOf(if (currentRecipe != null) ExportScope.SINGLE_RECIPE else ExportScope.FULL_ARCHIVE)
  }
  var dedicationText by remember {
    mutableStateOf("Compiled with love for the Ruffolo & Vitale Family • Holiday Keepsake Edition")
  }
  var bookTitle by remember {
    mutableStateOf("Heritage Cookbook: Nonna's Secret Recipes")
  }

  val recipesToExport = when (selectedScope) {
    ExportScope.SINGLE_RECIPE -> listOfNotNull(currentRecipe ?: allRecipes.firstOrNull())
    ExportScope.FAVORITES -> {
      val favs = allRecipes.filter { favoriteRecipeIds.contains(it.id) }
      if (favs.isNotEmpty()) favs else allRecipes.take(10)
    }
    ExportScope.FULL_ARCHIVE -> allRecipes
  }

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
          .padding(18.dp)
      ) {
        // --- HEADER ---
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(42.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer),
              contentAlignment = Alignment.Center
            ) {
              Icon(
                imageVector = Icons.Default.MenuBook,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(24.dp)
              )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
              Text(
                text = "Print-Ready Keepsake Book",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
              )
              Text(
                text = "Export beautiful PDF for printing & binding holiday gifts",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
              )
            }
          }

          IconButton(
            onClick = onDismiss,
            modifier = Modifier
              .size(40.dp)
              .clip(CircleShape)
              .background(MaterialTheme.colorScheme.surfaceVariant)
          ) {
            Icon(Icons.Default.Close, contentDescription = "Close", tint = MaterialTheme.colorScheme.onSurface)
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // --- CONTENT BODY ---
        Column(
          modifier = Modifier
            .weight(1f)
            .verticalScroll(rememberScrollState())
        ) {
          // 1. Scope Selection Tabs
          Text(
            text = "1. SELECT EXPORT SCOPE",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            letterSpacing = 0.5.sp
          )
          Spacer(modifier = Modifier.height(6.dp))
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            ExportScope.values().forEach { scope ->
              val isSelected = selectedScope == scope
              Box(
                modifier = Modifier
                  .weight(1f)
                  .clip(RoundedCornerShape(10.dp))
                  .background(
                    if (isSelected) MaterialTheme.colorScheme.primaryContainer
                    else MaterialTheme.colorScheme.surface
                  )
                  .border(
                    1.dp,
                    if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outlineVariant,
                    RoundedCornerShape(10.dp)
                  )
                  .clickable { selectedScope = scope }
                  .padding(vertical = 10.dp, horizontal = 8.dp),
                contentAlignment = Alignment.Center
              ) {
                Text(
                  text = scope.label,
                  style = MaterialTheme.typography.labelSmall,
                  fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                  color = if (isSelected) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurface
                )
              }
            }
          }

          Spacer(modifier = Modifier.height(16.dp))

          // 2. Pre-Designed Book Templates
          Text(
            text = "2. CHOOSE KEEPSAKE BOOK TEMPLATE",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            letterSpacing = 0.5.sp
          )
          Spacer(modifier = Modifier.height(8.dp))

          Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            BookTemplate.values().forEach { template ->
              val isSelected = selectedTemplate == template
              Card(
                modifier = Modifier
                  .fillMaxWidth()
                  .clickable { selectedTemplate = template },
                colors = CardDefaults.cardColors(
                  containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)
                  else MaterialTheme.colorScheme.surface
                ),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(
                  if (isSelected) 2.dp else 1.dp,
                  if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outlineVariant
                )
              ) {
                Row(
                  modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                  verticalAlignment = Alignment.CenterVertically
                ) {
                  Box(
                    modifier = Modifier
                      .size(24.dp)
                      .clip(CircleShape)
                      .border(
                        2.dp,
                        if (isSelected) MaterialTheme.colorScheme.primary else Color.Gray,
                        CircleShape
                      )
                      .background(if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent),
                    contentAlignment = Alignment.Center
                  ) {
                    if (isSelected) {
                      Icon(Icons.Default.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                    }
                  }

                  Spacer(modifier = Modifier.width(14.dp))

                  Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                      Text(
                        text = template.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                      )
                      if (template == BookTemplate.VINTAGE_HEIRLOOM) {
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                          modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(MaterialTheme.colorScheme.tertiaryContainer)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                          Text(
                            text = "RECOMMENDED",
                            style = MaterialTheme.typography.labelSmall,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onTertiaryContainer
                          )
                        }
                      }
                    }
                    Text(
                      text = template.subtitle,
                      style = MaterialTheme.typography.bodySmall,
                      color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                  }
                }
              }
            }
          }

          Spacer(modifier = Modifier.height(16.dp))

          // 3. Dedication & Cover Customization
          Text(
            text = "3. COVER & DEDICATION INSCRIPTION",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            letterSpacing = 0.5.sp
          )
          Spacer(modifier = Modifier.height(6.dp))

          OutlinedTextField(
            value = bookTitle,
            onValueChange = { bookTitle = it },
            label = { Text("Book Title") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
          )

          Spacer(modifier = Modifier.height(8.dp))

          OutlinedTextField(
            value = dedicationText,
            onValueChange = { dedicationText = it },
            label = { Text("Gift Inscription / Dedication") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            maxLines = 3
          )

          Spacer(modifier = Modifier.height(16.dp))

          // 4. Live Printable Book Page Spread Preview
          Text(
            text = "4. LIVE BOOK PAGE SPREAD PREVIEW",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            letterSpacing = 0.5.sp
          )
          Spacer(modifier = Modifier.height(8.dp))

          // Realistic 8.5" x 11" Paper Sheet Preview
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(12.dp)),
            colors = CardDefaults.cardColors(containerColor = Color(android.graphics.Color.parseColor(selectedTemplate.bgHex))),
            shape = RoundedCornerShape(12.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
            ) {
              val sample = recipesToExport.firstOrNull() ?: currentRecipe ?: allRecipes.first()

              // Italian Ornate Book Top Border
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  text = "RUFFOLO • VITALE HERITAGE ARCHIVE",
                  style = MaterialTheme.typography.labelSmall,
                  fontSize = 10.sp,
                  fontWeight = FontWeight.Bold,
                  letterSpacing = 1.5.sp,
                  color = Color(android.graphics.Color.parseColor(selectedTemplate.accentColorHex))
                )
                Text(
                  text = sample.contributor,
                  style = MaterialTheme.typography.labelSmall,
                  fontSize = 10.sp,
                  color = Color.DarkGray
                )
              }

              Spacer(modifier = Modifier.height(10.dp))

              Text(
                text = sample.title,
                style = MaterialTheme.typography.headlineMedium,
                fontFamily = FontFamily.Serif,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1E1712)
              )
              if (sample.italianTitle.isNotEmpty() && !sample.italianTitle.equals(sample.title, true)) {
                Text(
                  text = sample.italianTitle,
                  style = MaterialTheme.typography.titleSmall,
                  fontFamily = FontFamily.Cursive,
                  fontSize = 18.sp,
                  color = Color(android.graphics.Color.parseColor(selectedTemplate.accentColorHex))
                )
              }

              Text(
                text = "Family Recipe from: ${sample.contributor} • Prep: ${sample.prepTime} | Cook: ${sample.cookTime} | Yield: ${sample.servings}",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray,
                modifier = Modifier.padding(vertical = 4.dp)
              )

              Box(
                modifier = Modifier
                  .fillMaxWidth()
                  .height(1.dp)
                  .background(Color(android.graphics.Color.parseColor(selectedTemplate.accentColorHex)).copy(alpha = 0.3f))
              )

              Spacer(modifier = Modifier.height(10.dp))

              Row(modifier = Modifier.fillMaxWidth()) {
                // Left column: Ingredients
                Column(modifier = Modifier.weight(1f)) {
                  Text(
                    text = "INGREDIENTS",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = Color(android.graphics.Color.parseColor(selectedTemplate.accentColorHex)),
                    letterSpacing = 1.sp
                  )
                  Spacer(modifier = Modifier.height(4.dp))
                  sample.ingredients.take(6).forEach { ing ->
                    Text(
                      text = "• ${ing.rawText}",
                      style = MaterialTheme.typography.bodySmall,
                      fontSize = 12.sp,
                      color = Color(0xFF2C2219),
                      modifier = Modifier.padding(vertical = 1.dp)
                    )
                  }
                  if (sample.ingredients.size > 6) {
                    Text(
                      text = "+ ${sample.ingredients.size - 6} more ingredients...",
                      style = MaterialTheme.typography.labelSmall,
                      color = Color.Gray
                    )
                  }
                }

                Spacer(modifier = Modifier.width(16.dp))

                // Right column: Method
                Column(modifier = Modifier.weight(1.2f)) {
                  Text(
                    text = "PREPARATION",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = Color(android.graphics.Color.parseColor(selectedTemplate.accentColorHex)),
                    letterSpacing = 1.sp
                  )
                  Spacer(modifier = Modifier.height(4.dp))
                  sample.instructions.take(3).forEachIndexed { i, step ->
                    Text(
                      text = "${i + 1}. $step",
                      style = MaterialTheme.typography.bodySmall,
                      fontSize = 12.sp,
                      color = Color(0xFF2C2219),
                      modifier = Modifier.padding(vertical = 2.dp)
                    )
                  }
                }
              }

              Spacer(modifier = Modifier.height(10.dp))

              // Nonna's Note banner
              Box(
                modifier = Modifier
                  .fillMaxWidth()
                  .background(Color.White.copy(alpha = 0.6f), RoundedCornerShape(6.dp))
                  .border(0.5.dp, Color.LightGray, RoundedCornerShape(6.dp))
                  .padding(8.dp)
              ) {
                Text(
                  text = "Family Note: ${sample.notes.ifEmpty { "Handmade with love in the traditional southern Italian style." }}",
                  style = MaterialTheme.typography.bodySmall,
                  fontFamily = FontFamily.Serif,
                  fontSize = 11.sp,
                  color = Color(0xFF3E3126)
                )
              }
            }
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // --- BOTTOM EXPORT BUTTON ---
        Button(
          onClick = {
            printRecipesDocument(
              context = context,
              recipes = recipesToExport,
              template = selectedTemplate,
              bookTitle = bookTitle,
              dedication = dedicationText
            )
          },
          modifier = Modifier
            .fillMaxWidth()
            .height(56.dp),
          colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
          shape = RoundedCornerShape(14.dp)
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
          ) {
            Icon(Icons.Default.Print, contentDescription = null, tint = Color.White)
            Spacer(modifier = Modifier.width(10.dp))
            Text(
              text = "Export & Print Book (${recipesToExport.size} Recipes)",
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.Bold,
              color = Color.White
            )
          }
        }
      }
    }
  }
}

/**
 * Builds printable HTML using the selected keepsake template and invokes
 * Android's standard PrintManager to output high-resolution print pages or save as PDF.
 */
private fun printRecipesDocument(
  context: Context,
  recipes: List<Recipe>,
  template: BookTemplate,
  bookTitle: String,
  dedication: String
) {
  val printManager = context.getSystemService(Context.PRINT_SERVICE) as? PrintManager ?: return

  val html = buildString {
    append("<!DOCTYPE html><html><head><meta charset='utf-8'>")
    append("<style>")
    append("""
      @page {
        size: letter portrait;
        margin: 0.6in 0.5in 0.6in 0.5in;
      }
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        background-color: ${template.bgHex};
        color: #222222;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
      }
      .cover-page {
        page-break-after: always;
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        border: 4px double ${template.accentColorHex};
        padding: 40px;
        margin: 20px;
      }
      .cover-title {
        font-size: 32pt;
        color: ${template.accentColorHex};
        margin-bottom: 12px;
        font-weight: bold;
      }
      .cover-sub {
        font-size: 16pt;
        color: #555555;
        margin-bottom: 40px;
      }
      .cover-dedication {
        font-size: 14pt;
        font-style: italic;
        color: #444444;
        max-width: 500px;
        line-height: 1.6;
        border-top: 1px solid #cccccc;
        border-bottom: 1px solid #cccccc;
        padding: 20px 0;
      }
      .recipe-page {
        page-break-after: always;
        padding: 20px 10px;
        box-sizing: border-box;
      }
      .header-bar {
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid ${template.accentColorHex};
        padding-bottom: 6px;
        margin-bottom: 16px;
        font-size: 10pt;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: ${template.accentColorHex};
      }
      .recipe-title {
        font-size: 24pt;
        color: #111111;
        margin: 0 0 4px 0;
        font-weight: bold;
      }
      .italian-title {
        font-size: 15pt;
        font-style: italic;
        color: ${template.accentColorHex};
        margin-bottom: 10px;
      }
      .meta-info {
        font-size: 10pt;
        color: #666666;
        margin-bottom: 18px;
      }
      .content-grid {
        display: flex;
        gap: 24px;
      }
      .ingredients-col {
        flex: 1;
        background: rgba(0,0,0,0.02);
        padding: 12px 16px;
        border-radius: 6px;
      }
      .method-col {
        flex: 1.4;
      }
      h3 {
        font-size: 12pt;
        color: ${template.accentColorHex};
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 0;
        border-bottom: 1px solid #dddddd;
        padding-bottom: 4px;
      }
      ul {
        list-style-type: square;
        padding-left: 18px;
        margin: 0;
        font-size: 11pt;
        line-height: 1.6;
      }
      ol {
        padding-left: 20px;
        margin: 0;
        font-size: 11pt;
        line-height: 1.6;
      }
      li {
        margin-bottom: 6px;
      }
      .notes-box {
        margin-top: 20px;
        background: #FFFFFF;
        border: 1px dashed ${template.accentColorHex};
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 10.5pt;
        font-style: italic;
      }
    """.trimIndent())
    append("</style></head><body>")

    // Cover Page
    append("<div class='cover-page'>")
    append("<div class='cover-title'>$bookTitle</div>")
    append("<div class='cover-sub'>Ruffolo & Vitale Family Heritage Collection</div>")
    append("<div class='cover-dedication'>$dedication</div>")
    append("<p style='margin-top: 40px; font-size: 10pt; color: #888888;'>Printed Holiday Keepsake Edition • ${recipes.size} Family Heirloom Recipes</p>")
    append("</div>")

    // Recipe Pages
    for (recipe in recipes) {
      append("<div class='recipe-page'>")
      append("<div class='header-bar'>")
      append("<span>Ruffolo • Vitale Family Cookbook</span>")
      append("<span>${recipe.contributor}</span>")
      append("</div>")

      append("<div class='recipe-title'>${recipe.title}</div>")
      if (recipe.italianTitle.isNotEmpty() && !recipe.italianTitle.equals(recipe.title, true)) {
        append("<div class='italian-title'>${recipe.italianTitle}</div>")
      }

      append("<div class='meta-info'>Contributed by: <strong>${recipe.contributor}</strong> &nbsp;|&nbsp; Prep: ${recipe.prepTime} &nbsp;|&nbsp; Cook: ${recipe.cookTime} &nbsp;|&nbsp; Servings: ${recipe.servings} &nbsp;|&nbsp; Category: ${recipe.category.displayName}</div>")

      append("<div class='content-grid'>")

      // Ingredients
      append("<div class='ingredients-col'>")
      append("<h3>Ingredients</h3><ul>")
      for (ing in recipe.ingredients) {
        append("<li>${ing.rawText}</li>")
      }
      append("</ul></div>")

      // Instructions
      append("<div class='method-col'>")
      append("<h3>Method</h3><ol>")
      for (step in recipe.instructions) {
        append("<li>$step</li>")
      }
      append("</ol>")

      if (recipe.notes.isNotEmpty()) {
        append("<div class='notes-box'><strong>Heritage Note:</strong> ${recipe.notes}</div>")
      }

      append("</div>") // method-col
      append("</div>") // content-grid
      append("</div>") // recipe-page
    }

    append("</body></html>")
  }

  val webView = WebView(context).apply {
    webViewClient = object : WebViewClient() {
      override fun onPageFinished(view: WebView?, url: String?) {
        val printAdapter = createPrintDocumentAdapter("HeritageCookbookGift")
        val jobName = "Heritage_Cookbook_Keepsake"
        printManager.print(
          jobName,
          printAdapter,
          PrintAttributes.Builder()
            .setMediaSize(PrintAttributes.MediaSize.NA_LETTER)
            .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
            .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
            .build()
        )
      }
    }
  }

  webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null)
}
