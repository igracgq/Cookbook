package com.example.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke

/**
 * Renders a warm neutral beige / almost-white canvas textured with a delicate,
 * transparent black & white sketched culinary pattern (vegetables & herbs:
 * basil leaves, chili peppers, garlic, rosemary, peppercorns, tomatoes)
 * as requested from screenshot 2.
 */
@Composable
fun CulinaryMonochromeBackground(
  modifier: Modifier = Modifier,
  alpha: Float = 0.045f,
  content: (@Composable () -> Unit)? = null
) {
  Box(
    modifier = modifier
      .fillMaxSize()
      .background(MaterialTheme.colorScheme.background)
  ) {
    Canvas(modifier = Modifier.fillMaxSize()) {
      val inkColor = Color(0xFF1A1510)
      val inkAlpha = alpha // Black & white transparent feel that doesn't distract from text

      val w = size.width
      val h = size.height

      // Draw subtle scattered culinary illustrations along edges & corners
      // 1. Basil leaves (Top right)
      drawBasilSprig(this, Offset(w * 0.88f, h * 0.06f), scale = 1.2f, inkColor, inkAlpha)
      drawBasilSprig(this, Offset(w * 0.10f, h * 0.42f), scale = 0.9f, inkColor, inkAlpha)
      drawBasilSprig(this, Offset(w * 0.92f, h * 0.78f), scale = 1.1f, inkColor, inkAlpha)

      // 2. Chili peppers with stems (Top left & bottom)
      drawChiliPepper(this, Offset(w * 0.08f, h * 0.08f), angleDeg = 35f, inkColor, inkAlpha)
      drawChiliPepper(this, Offset(w * 0.86f, h * 0.48f), angleDeg = -45f, inkColor, inkAlpha)
      drawChiliPepper(this, Offset(w * 0.15f, h * 0.88f), angleDeg = 15f, inkColor, inkAlpha)

      // 3. Garlic bulbs (Center right & bottom right)
      drawGarlicBulb(this, Offset(w * 0.90f, h * 0.28f), scale = 1.0f, inkColor, inkAlpha)
      drawGarlicBulb(this, Offset(w * 0.06f, h * 0.68f), scale = 0.85f, inkColor, inkAlpha)
      drawGarlicBulb(this, Offset(w * 0.75f, h * 0.94f), scale = 1.1f, inkColor, inkAlpha)

      // 4. Rosemary sprigs (Left margin & top center)
      drawRosemarySprig(this, Offset(w * 0.04f, h * 0.22f), scale = 1.0f, inkColor, inkAlpha)
      drawRosemarySprig(this, Offset(w * 0.94f, h * 0.62f), scale = 0.9f, inkColor, inkAlpha)

      // 5. Cherry tomatoes with calyx (Top center & mid bottom)
      drawCherryTomato(this, Offset(w * 0.50f, h * 0.04f), radius = 22f, inkColor, inkAlpha)
      drawCherryTomato(this, Offset(w * 0.38f, h * 0.95f), radius = 26f, inkColor, inkAlpha)

      // 6. Peppercorns scattered delicately
      val peppercorns = listOf(
        Offset(w * 0.20f, h * 0.05f),
        Offset(w * 0.24f, h * 0.07f),
        Offset(w * 0.80f, h * 0.15f),
        Offset(w * 0.95f, h * 0.38f),
        Offset(w * 0.05f, h * 0.54f),
        Offset(w * 0.12f, h * 0.56f),
        Offset(w * 0.88f, h * 0.70f),
        Offset(w * 0.08f, h * 0.80f),
        Offset(w * 0.52f, h * 0.92f),
        Offset(w * 0.60f, h * 0.94f)
      )
      for (pt in peppercorns) {
        drawCircle(
          color = inkColor.copy(alpha = inkAlpha * 1.5f),
          radius = 3.5f,
          center = pt
        )
      }
    }

    content?.invoke()
  }
}

private fun drawBasilSprig(
  drawScope: DrawScope,
  center: Offset,
  scale: Float,
  color: Color,
  alpha: Float
) {
  val stroke = Stroke(width = 1.8f * scale)
  val fillAlpha = alpha * 0.4f
  val strokeAlpha = alpha * 1.8f

  val p1 = Path().apply {
    moveTo(center.x, center.y)
    cubicTo(
      center.x - 30f * scale, center.y - 40f * scale,
      center.x + 10f * scale, center.y - 70f * scale,
      center.x + 35f * scale, center.y - 45f * scale
    )
    cubicTo(
      center.x + 30f * scale, center.y - 20f * scale,
      center.x + 15f * scale, center.y - 10f * scale,
      center.x, center.y
    )
    close()
  }
  drawScope.drawPath(p1, color.copy(alpha = fillAlpha))
  drawScope.drawPath(p1, color.copy(alpha = strokeAlpha), style = stroke)

  // Leaf center vein
  val vein = Path().apply {
    moveTo(center.x, center.y)
    quadraticBezierTo(
      center.x + 10f * scale, center.y - 30f * scale,
      center.x + 25f * scale, center.y - 50f * scale
    )
  }
  drawScope.drawPath(vein, color.copy(alpha = strokeAlpha * 0.8f), style = Stroke(width = 1.2f * scale))
}

private fun drawChiliPepper(
  drawScope: DrawScope,
  pos: Offset,
  angleDeg: Float,
  color: Color,
  alpha: Float
) {
  val stroke = Stroke(width = 2.0f)
  val pepperPath = Path().apply {
    moveTo(pos.x, pos.y)
    // Curving horn shape
    cubicTo(
      pos.x + 30f, pos.y + 10f,
      pos.x + 55f, pos.y + 35f,
      pos.x + 65f, pos.y + 65f
    )
    cubicTo(
      pos.x + 50f, pos.y + 55f,
      pos.x + 35f, pos.y + 30f,
      pos.x, pos.y + 14f
    )
    close()
  }
  drawScope.drawPath(pepperPath, color.copy(alpha = alpha * 0.5f))
  drawScope.drawPath(pepperPath, color.copy(alpha = alpha * 1.8f), style = stroke)

  // Stem & calyx
  val stem = Path().apply {
    moveTo(pos.x, pos.y)
    quadraticBezierTo(pos.x - 10f, pos.y - 8f, pos.x - 15f, pos.y - 15f)
  }
  drawScope.drawPath(stem, color.copy(alpha = alpha * 1.8f), style = Stroke(width = 1.6f))
}

private fun drawGarlicBulb(
  drawScope: DrawScope,
  pos: Offset,
  scale: Float,
  color: Color,
  alpha: Float
) {
  val stroke = Stroke(width = 1.8f * scale)
  // Teardrop bulb outline
  val garlic = Path().apply {
    moveTo(pos.x, pos.y - 30f * scale)
    cubicTo(
      pos.x - 28f * scale, pos.y - 5f * scale,
      pos.x - 26f * scale, pos.y + 20f * scale,
      pos.x, pos.y + 22f * scale
    )
    cubicTo(
      pos.x + 26f * scale, pos.y + 20f * scale,
      pos.x + 28f * scale, pos.y - 5f * scale,
      pos.x, pos.y - 30f * scale
    )
    close()
  }
  drawScope.drawPath(garlic, color.copy(alpha = alpha * 0.4f))
  drawScope.drawPath(garlic, color.copy(alpha = alpha * 1.8f), style = stroke)

  // Inner clove divider lines
  val cloveLeft = Path().apply {
    moveTo(pos.x, pos.y - 25f * scale)
    quadraticBezierTo(pos.x - 12f * scale, pos.y, pos.x - 6f * scale, pos.y + 20f * scale)
  }
  val cloveRight = Path().apply {
    moveTo(pos.x, pos.y - 25f * scale)
    quadraticBezierTo(pos.x + 12f * scale, pos.y, pos.x + 6f * scale, pos.y + 20f * scale)
  }
  drawScope.drawPath(cloveLeft, color.copy(alpha = alpha * 1.3f), style = Stroke(width = 1.2f * scale))
  drawScope.drawPath(cloveRight, color.copy(alpha = alpha * 1.3f), style = Stroke(width = 1.2f * scale))
}

private fun drawRosemarySprig(
  drawScope: DrawScope,
  pos: Offset,
  scale: Float,
  color: Color,
  alpha: Float
) {
  val stroke = Stroke(width = 1.5f * scale)
  val stem = Path().apply {
    moveTo(pos.x, pos.y)
    quadraticBezierTo(pos.x + 15f * scale, pos.y + 40f * scale, pos.x + 20f * scale, pos.y + 80f * scale)
  }
  drawScope.drawPath(stem, color.copy(alpha = alpha * 1.8f), style = stroke)

  // Needles
  val needleCount = 6
  for (i in 1..needleCount) {
    val py = pos.y + i * 11f * scale
    val px = pos.x + (i * 3f) * scale
    drawScope.drawLine(
      color = color.copy(alpha = alpha * 1.6f),
      start = Offset(px, py),
      end = Offset(px - 14f * scale, py - 6f * scale),
      strokeWidth = 1.4f * scale
    )
    drawScope.drawLine(
      color = color.copy(alpha = alpha * 1.6f),
      start = Offset(px, py),
      end = Offset(px + 14f * scale, py - 4f * scale),
      strokeWidth = 1.4f * scale
    )
  }
}

private fun drawCherryTomato(
  drawScope: DrawScope,
  center: Offset,
  radius: Float,
  color: Color,
  alpha: Float
) {
  drawScope.drawCircle(
    color = color.copy(alpha = alpha * 0.4f),
    radius = radius,
    center = center
  )
  drawScope.drawCircle(
    color = color.copy(alpha = alpha * 1.8f),
    radius = radius,
    center = center,
    style = Stroke(width = 1.8f)
  )

  // Star calyx at top
  val calyx = Path().apply {
    moveTo(center.x, center.y - radius)
    lineTo(center.x - 7f, center.y - radius - 8f)
    moveTo(center.x, center.y - radius)
    lineTo(center.x + 7f, center.y - radius - 7f)
    moveTo(center.x, center.y - radius)
    lineTo(center.x, center.y - radius - 11f)
  }
  drawScope.drawPath(calyx, color.copy(alpha = alpha * 2.0f), style = Stroke(width = 1.5f))
}
