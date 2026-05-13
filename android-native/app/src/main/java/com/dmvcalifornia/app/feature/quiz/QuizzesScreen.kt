package com.dmvcalifornia.app.feature.quiz

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.dmvcalifornia.app.core.model.Quiz
import com.dmvcalifornia.app.ui.navigation.Routes
import com.dmvcalifornia.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuizzesScreen(
    navController: NavController,
    viewModel: QuizzesViewModel = hiltViewModel()
) {
    val quizzes by viewModel.filteredQuizzes.collectAsState()
    val selectedLanguage by viewModel.selectedLanguage.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DmvBackground)
    ) {
        // Header
        Text(
            text = "Practice Tests",
            style = MaterialTheme.typography.displayMedium,
            color = DmvText,
            modifier = Modifier.padding(start = Spacing.lg, top = Spacing.lg, bottom = Spacing.sm)
        )

        // Search
        OutlinedTextField(
            value = searchQuery,
            onValueChange = viewModel::onSearchQueryChanged,
            placeholder = { Text("Search quizzes...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = Spacing.lg, vertical = Spacing.sm),
            shape = RoundedCornerShape(CornerRadius.lg),
            singleLine = true
        )

        // Language Filter Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = Spacing.lg, vertical = Spacing.sm),
            horizontalArrangement = Arrangement.spacedBy(Spacing.sm)
        ) {
            val languages = listOf("English", "Spanish", "Turkish", "Chinese")
            languages.forEach { language ->
                FilterChip(
                    selected = selectedLanguage == language,
                    onClick = { viewModel.onLanguageSelected(language) },
                    label = { Text(language, fontSize = 13.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = DmvOrange,
                        selectedLabelColor = Color.White
                    )
                )
            }
        }

        // Quiz Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(Spacing.lg),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md),
            verticalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            items(quizzes, key = { it.id }) { quiz ->
                QuizCard(
                    quiz = quiz,
                    bestScore = viewModel.getBestScore(quiz.id),
                    onClick = {
                        navController.navigate(Routes.quizDetail(quiz.id, quiz.title))
                    }
                )
            }
        }
    }
}

@Composable
private fun QuizCard(
    quiz: Quiz,
    bestScore: Double?,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(CornerRadius.lg),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(Spacing.md)
        ) {
            // Quiz number / icon area
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(CornerRadius.md))
                    .background(DmvOrange.copy(alpha = 0.1f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Description,
                    contentDescription = null,
                    tint = DmvOrange,
                    modifier = Modifier.size(22.dp)
                )
            }

            Spacer(modifier = Modifier.height(Spacing.md))

            Text(
                text = quiz.displayTitle,
                fontWeight = FontWeight.SemiBold,
                fontSize = 14.sp,
                color = DmvText,
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(Spacing.xs))

            Text(
                text = "${quiz.questionsCount} questions",
                fontSize = 12.sp,
                color = DmvTextSecondary
            )

            if (quiz.timeLimit != null) {
                Text(
                    text = "${quiz.timeLimitMinutes} min",
                    fontSize = 12.sp,
                    color = DmvTextTertiary
                )
            }

            // Best score indicator
            if (bestScore != null) {
                Spacer(modifier = Modifier.height(Spacing.sm))
                val scoreColor = if (bestScore >= 83) DmvSuccess else DmvWarning
                Text(
                    text = "Best: ${bestScore.toInt()}%",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = scoreColor
                )
            }
        }
    }
}
