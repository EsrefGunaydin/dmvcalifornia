package com.dmvcalifornia.app.ui.theme

import androidx.compose.ui.graphics.Color

// Primary Colors
val DmvOrange = Color(0xFFEE3918)
val DmvBlue = Color(0xFF4A90C2)
val DmvTeal = Color(0xFF13CFB6)

// Background Colors
val DmvBackground = Color(0xFFF5F5F5)
val DmvCard = Color.White
val DmvSurface = Color(0xFFFAFAFA)

// Text Colors
val DmvText = Color(0xFF1A1A1A)
val DmvTextSecondary = Color(0xFF666666)
val DmvTextTertiary = Color(0xFF999999)

// Border Colors
val DmvBorder = Color(0xFFE5E5E5)
val DmvDivider = Color(0xFFEEEEEE)

// Status Colors
val DmvSuccess = Color(0xFF22C55E)
val DmvError = Color(0xFFEF4444)
val DmvWarning = Color(0xFFF59E0B)
val DmvInfo = Color(0xFF3B82F6)

// Difficulty Colors
val DmvEasy = Color(0xFF22C55E)
val DmvMedium = Color(0xFFF59E0B)
val DmvHard = Color(0xFFEF4444)

// Helper to create Color from hex string
fun Color.Companion.fromHex(hex: String): Color {
    val cleanHex = hex.removePrefix("#")
    return Color(android.graphics.Color.parseColor("#$cleanHex"))
}
