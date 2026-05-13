package com.dmvcalifornia.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DMVColorScheme = lightColorScheme(
    primary = DmvOrange,
    onPrimary = Color.White,
    primaryContainer = DmvOrange.copy(alpha = 0.1f),
    onPrimaryContainer = DmvOrange,
    secondary = DmvBlue,
    onSecondary = Color.White,
    secondaryContainer = DmvBlue.copy(alpha = 0.1f),
    onSecondaryContainer = DmvBlue,
    tertiary = DmvTeal,
    onTertiary = Color.White,
    tertiaryContainer = DmvTeal.copy(alpha = 0.1f),
    onTertiaryContainer = DmvTeal,
    background = DmvBackground,
    onBackground = DmvText,
    surface = DmvSurface,
    onSurface = DmvText,
    surfaceVariant = DmvCard,
    onSurfaceVariant = DmvTextSecondary,
    outline = DmvBorder,
    outlineVariant = DmvDivider,
    error = DmvError,
    onError = Color.White,
)

@Composable
fun DMVCaliforniaTheme(
    content: @Composable () -> Unit
) {
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = Color.White.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = true
        }
    }

    MaterialTheme(
        colorScheme = DMVColorScheme,
        typography = DMVTypography,
        shapes = DMVShapes,
        content = content
    )
}
