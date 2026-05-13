package com.dmvcalifornia.app.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

object GamifiedTheme {
    object Gradients {
        val primary = Brush.linearGradient(listOf(Color(0xFFFF6B6B), Color(0xFFFF8E53)))
        val success = Brush.linearGradient(listOf(Color(0xFF56AB2F), Color(0xFFA8E063)))
        val info = Brush.linearGradient(listOf(Color(0xFF2193B0), Color(0xFF6DD5ED)))
        val warning = Brush.linearGradient(listOf(Color(0xFFF7971E), Color(0xFFFFD200)))
        val purple = Brush.linearGradient(listOf(Color(0xFF667EEA), Color(0xFF764BA2)))
        val streak = Brush.linearGradient(listOf(Color(0xFFF093FB), Color(0xFFF5576C)))
        val card = Brush.linearGradient(listOf(Color.White, Color(0xFFF8F9FA)))
        val darkCard = Brush.linearGradient(listOf(Color(0xFF2D3436), Color(0xFF1E272E)))
    }

    object Colors {
        val background = Color(0xFFF5F7FA)
        val cardBackground = Color.White
        val softShadow = Color.Black.copy(alpha = 0.08f)

        // XP and Levels
        val xpGold = Color(0xFFFFD700)
        val xpPurple = Color(0xFF9B59B6)

        // Achievement Colors
        val bronze = Color(0xFFCD7F32)
        val silver = Color(0xFFC0C0C0)
        val gold = Color(0xFFFFD700)
        val platinum = Color(0xFFE5E4E2)
        val diamond = Color(0xFFB9F2FF)

        // Soft accent colors
        val softRed = Color(0xFFFF6B6B)
        val softGreen = Color(0xFF51CF66)
        val softBlue = Color(0xFF339AF0)
        val softYellow = Color(0xFFFCC419)
        val softPurple = Color(0xFF845EF7)
        val softPink = Color(0xFFF06595)
        val softOrange = Color(0xFFFF922B)
        val softTeal = Color(0xFF20C997)
    }

    object Radius {
        val small = 12.dp
        val medium = 16.dp
        val large = 24.dp
        val xl = 32.dp
        val full = 100.dp
    }
}
