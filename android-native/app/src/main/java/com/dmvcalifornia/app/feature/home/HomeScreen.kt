package com.dmvcalifornia.app.feature.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.dmvcalifornia.app.ui.navigation.Routes
import com.dmvcalifornia.app.ui.theme.*

@Composable
fun HomeScreen(
    navController: NavController,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val streak by viewModel.streak.collectAsState()
    val stats by viewModel.stats.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DmvBackground)
            .verticalScroll(rememberScrollState())
            .padding(Spacing.lg)
    ) {
        // Header
        Text(
            text = "DMV California",
            style = MaterialTheme.typography.displayMedium,
            color = DmvText,
            modifier = Modifier.padding(bottom = Spacing.sm)
        )
        Text(
            text = "Practice for your California DMV test",
            style = MaterialTheme.typography.bodyLarge,
            color = DmvTextSecondary,
            modifier = Modifier.padding(bottom = Spacing.xxl)
        )

        // Streak Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(GamifiedTheme.Radius.large),
            colors = CardDefaults.cardColors(containerColor = Color.Transparent)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GamifiedTheme.Gradients.primary)
                    .padding(Spacing.xl)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Current Streak",
                            color = Color.White.copy(alpha = 0.9f),
                            fontSize = 14.sp
                        )
                        Text(
                            text = "${streak.currentStreak} days",
                            color = Color.White,
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Icon(
                        Icons.Default.LocalFireDepartment,
                        contentDescription = "Streak",
                        tint = Color.White,
                        modifier = Modifier.size(48.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(Spacing.xl))

        // Stats Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            StatCard(
                title = "Quizzes",
                value = "${stats.totalQuizzes}",
                icon = Icons.Default.Description,
                color = DmvBlue,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Avg Score",
                value = "${stats.averageScore.toInt()}%",
                icon = Icons.Default.TrendingUp,
                color = DmvSuccess,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(Spacing.xl))

        // Quick Actions
        Text(
            text = "Quick Actions",
            style = MaterialTheme.typography.headlineSmall,
            color = DmvText,
            modifier = Modifier.padding(bottom = Spacing.md)
        )

        QuickActionButton(
            title = "Start Practice Test",
            subtitle = "Take a DMV simulation test",
            icon = Icons.Default.PlayArrow,
            gradient = Brush.linearGradient(listOf(DmvOrange, DmvOrange.copy(alpha = 0.8f))),
            onClick = { navController.navigate(Routes.QUIZZES) }
        )

        Spacer(modifier = Modifier.height(Spacing.md))

        QuickActionButton(
            title = "Study Flashcards",
            subtitle = "Review key concepts",
            icon = Icons.Default.Style,
            gradient = Brush.linearGradient(listOf(DmvTeal, DmvTeal.copy(alpha = 0.8f))),
            onClick = { navController.navigate(Routes.FLASHCARDS) }
        )

        Spacer(modifier = Modifier.height(Spacing.md))

        QuickActionButton(
            title = "View Progress",
            subtitle = "Track your improvement",
            icon = Icons.Default.ShowChart,
            gradient = Brush.linearGradient(listOf(DmvBlue, DmvBlue.copy(alpha = 0.8f))),
            onClick = { navController.navigate(Routes.PROGRESS) }
        )

        Spacer(modifier = Modifier.height(Spacing.md))

        QuickActionButton(
            title = "Bookmarks",
            subtitle = "Review saved questions",
            icon = Icons.Default.Bookmark,
            gradient = Brush.linearGradient(listOf(DmvWarning, DmvWarning.copy(alpha = 0.8f))),
            onClick = { navController.navigate(Routes.BOOKMARKS) }
        )

        Spacer(modifier = Modifier.height(Spacing.xxxl))
    }
}

@Composable
private fun StatCard(
    title: String,
    value: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(CornerRadius.lg),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier.padding(Spacing.lg),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                icon,
                contentDescription = title,
                tint = color,
                modifier = Modifier.size(28.dp)
            )
            Spacer(modifier = Modifier.height(Spacing.sm))
            Text(
                text = value,
                fontWeight = FontWeight.Bold,
                fontSize = 24.sp,
                color = DmvText
            )
            Text(
                text = title,
                fontSize = 13.sp,
                color = DmvTextSecondary
            )
        }
    }
}

@Composable
private fun QuickActionButton(
    title: String,
    subtitle: String,
    icon: ImageVector,
    gradient: Brush,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(CornerRadius.lg))
            .background(gradient)
            .clickable(onClick = onClick)
            .padding(Spacing.lg)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            Icon(
                icon,
                contentDescription = title,
                tint = Color.White,
                modifier = Modifier.size(32.dp)
            )
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    color = Color.White,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp
                )
                Text(
                    text = subtitle,
                    color = Color.White.copy(alpha = 0.8f),
                    fontSize = 13.sp
                )
            }
            Icon(
                Icons.Default.ChevronRight,
                contentDescription = null,
                tint = Color.White.copy(alpha = 0.7f)
            )
        }
    }
}
