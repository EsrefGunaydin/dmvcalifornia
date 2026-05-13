package com.dmvcalifornia.app.feature.progress

import androidx.compose.foundation.background
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
fun ProgressScreen(
    navController: NavController,
    viewModel: ProgressViewModel = hiltViewModel()
) {
    val streak by viewModel.streak.collectAsState()
    val stats by viewModel.stats.collectAsState()
    val weakAreas by viewModel.weakAreas.collectAsState()
    val recentActivity by viewModel.recentActivity.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DmvBackground)
            .verticalScroll(rememberScrollState())
            .padding(Spacing.lg)
    ) {
        Text(
            text = "Progress",
            style = MaterialTheme.typography.displayMedium,
            color = DmvText,
            modifier = Modifier.padding(bottom = Spacing.xl)
        )

        // Streak Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(CornerRadius.lg),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Row(
                modifier = Modifier.padding(Spacing.lg),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.LocalFireDepartment,
                    contentDescription = null,
                    tint = DmvOrange,
                    modifier = Modifier.size(40.dp)
                )
                Spacer(modifier = Modifier.width(Spacing.md))
                Column {
                    Text(
                        text = "${streak.currentStreak} Day Streak",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
                        color = DmvText
                    )
                    Text(
                        text = "Longest: ${streak.longestStreak} days",
                        fontSize = 13.sp,
                        color = DmvTextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(Spacing.xl))

        // Stats Grid
        Text(
            text = "Statistics",
            style = MaterialTheme.typography.headlineSmall,
            color = DmvText,
            modifier = Modifier.padding(bottom = Spacing.md)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            MiniStatCard("Total Quizzes", "${stats.totalQuizzes}", Icons.Default.Description, DmvBlue, Modifier.weight(1f))
            MiniStatCard("Questions", "${stats.totalQuestions}", Icons.Default.QuestionAnswer, DmvTeal, Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(Spacing.md))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            MiniStatCard("Avg Score", "${stats.averageScore.toInt()}%", Icons.Default.TrendingUp, DmvSuccess, Modifier.weight(1f))
            MiniStatCard("Best Score", "${stats.bestScore.toInt()}%", Icons.Default.EmojiEvents, DmvWarning, Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(Spacing.xl))

        // Weak Areas
        if (weakAreas.isNotEmpty()) {
            Text(
                text = "Areas to Improve",
                style = MaterialTheme.typography.headlineSmall,
                color = DmvText,
                modifier = Modifier.padding(bottom = Spacing.md)
            )

            weakAreas.take(5).forEach { area ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = Spacing.sm),
                    shape = RoundedCornerShape(CornerRadius.md),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Row(
                        modifier = Modifier.padding(Spacing.md),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = area.category,
                            modifier = Modifier.weight(1f),
                            color = DmvText,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = "${area.wrongCount} wrong",
                            fontSize = 13.sp,
                            color = DmvError
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(Spacing.xl))
        }

        // Recent Activity
        if (recentActivity.isNotEmpty()) {
            Text(
                text = "Recent Activity",
                style = MaterialTheme.typography.headlineSmall,
                color = DmvText,
                modifier = Modifier.padding(bottom = Spacing.md)
            )

            recentActivity.forEach { attempt ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = Spacing.sm),
                    shape = RoundedCornerShape(CornerRadius.md),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Row(
                        modifier = Modifier.padding(Spacing.md),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = attempt.quizTitle,
                                fontWeight = FontWeight.Medium,
                                color = DmvText,
                                maxLines = 1,
                                fontSize = 14.sp
                            )
                            Text(
                                text = "${attempt.score}/${attempt.totalQuestions} correct",
                                fontSize = 12.sp,
                                color = DmvTextSecondary
                            )
                        }
                        val color = if (attempt.percentage >= 83) DmvSuccess else DmvWarning
                        Text(
                            text = "${attempt.percentage.toInt()}%",
                            fontWeight = FontWeight.Bold,
                            color = color
                        )
                    }
                }
            }
        }

        // Bookmarks link
        Spacer(modifier = Modifier.height(Spacing.xl))

        OutlinedButton(
            onClick = { navController.navigate(Routes.BOOKMARKS) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(CornerRadius.lg)
        ) {
            Icon(Icons.Default.Bookmark, contentDescription = null, tint = DmvOrange)
            Spacer(modifier = Modifier.width(Spacing.sm))
            Text("View Bookmarks", color = DmvOrange)
        }

        Spacer(modifier = Modifier.height(Spacing.xxxl))
    }
}

@Composable
private fun MiniStatCard(
    title: String,
    value: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(CornerRadius.md),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(Spacing.md)) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.height(Spacing.sm))
            Text(text = value, fontWeight = FontWeight.Bold, fontSize = 20.sp, color = DmvText)
            Text(text = title, fontSize = 12.sp, color = DmvTextSecondary)
        }
    }
}
