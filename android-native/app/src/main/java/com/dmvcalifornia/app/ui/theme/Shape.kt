package com.dmvcalifornia.app.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

val DMVShapes = Shapes(
    small = RoundedCornerShape(6.dp),
    medium = RoundedCornerShape(12.dp),
    large = RoundedCornerShape(16.dp),
    extraLarge = RoundedCornerShape(24.dp)
)

object CornerRadius {
    val sm = 6.dp
    val md = 8.dp
    val lg = 12.dp
    val xl = 16.dp
    val full = 9999.dp
}
