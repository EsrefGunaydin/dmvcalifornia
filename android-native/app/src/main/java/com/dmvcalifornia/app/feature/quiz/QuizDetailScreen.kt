package com.dmvcalifornia.app.feature.quiz

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.dmvcalifornia.app.ui.navigation.Routes
import com.dmvcalifornia.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuizDetailScreen(
    quizId: String,
    quizTitle: String,
    navController: NavController,
    viewModel: QuizDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(quizId) {
        viewModel.loadQuiz(quizId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(quizTitle, maxLines = 1) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White
                )
            )
        }
    ) { padding ->
        when (val state = uiState) {
            is QuizUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize().padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = DmvOrange)
                }
            }
            is QuizUiState.Error -> {
                Box(
                    modifier = Modifier.fillMaxSize().padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Failed to load quiz", color = DmvError)
                }
            }
            is QuizUiState.Active -> {
                val question = state.currentQuestion
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .background(DmvBackground)
                        .verticalScroll(rememberScrollState())
                        .padding(Spacing.lg)
                ) {
                    // Progress indicator
                    LinearProgressIndicator(
                        progress = { (state.currentIndex + 1).toFloat() / state.totalQuestions },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp),
                        color = DmvOrange,
                        trackColor = DmvBorder
                    )

                    Spacer(modifier = Modifier.height(Spacing.md))

                    // Question counter & timer
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Question ${state.currentIndex + 1} of ${state.totalQuestions}",
                            fontSize = 14.sp,
                            color = DmvTextSecondary
                        )
                        if (state.remainingSeconds != null) {
                            val minutes = state.remainingSeconds / 60
                            val seconds = state.remainingSeconds % 60
                            Text(
                                text = String.format("%d:%02d", minutes, seconds),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (state.remainingSeconds < 60) DmvError else DmvTextSecondary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(Spacing.xl))

                    // Question text
                    Text(
                        text = question.question,
                        style = MaterialTheme.typography.headlineSmall,
                        color = DmvText
                    )

                    Spacer(modifier = Modifier.height(Spacing.xl))

                    // Answer options
                    question.options.forEachIndexed { index, option ->
                        val isSelected = state.selectedAnswer == index
                        val isChecked = state.isAnswerChecked
                        val isCorrect = index == question.correctAnswer

                        val containerColor = when {
                            !isChecked && isSelected -> DmvOrange.copy(alpha = 0.1f)
                            isChecked && isCorrect -> DmvSuccess.copy(alpha = 0.1f)
                            isChecked && isSelected && !isCorrect -> DmvError.copy(alpha = 0.1f)
                            else -> Color.White
                        }
                        val borderColor = when {
                            !isChecked && isSelected -> DmvOrange
                            isChecked && isCorrect -> DmvSuccess
                            isChecked && isSelected && !isCorrect -> DmvError
                            else -> DmvBorder
                        }

                        OutlinedCard(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            shape = RoundedCornerShape(CornerRadius.lg),
                            colors = CardDefaults.outlinedCardColors(containerColor = containerColor),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(borderColor)
                            ),
                            onClick = {
                                if (!isChecked) viewModel.selectAnswer(index)
                            }
                        ) {
                            Row(
                                modifier = Modifier.padding(Spacing.lg),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "${'A' + index}.",
                                    fontWeight = FontWeight.SemiBold,
                                    color = borderColor,
                                    modifier = Modifier.width(28.dp)
                                )
                                Text(
                                    text = option,
                                    color = DmvText,
                                    modifier = Modifier.weight(1f)
                                )
                                if (isChecked && isCorrect) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = DmvSuccess)
                                } else if (isChecked && isSelected && !isCorrect) {
                                    Icon(Icons.Default.Cancel, contentDescription = null, tint = DmvError)
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(Spacing.xl))

                    // Explanation (shown after checking)
                    if (state.isAnswerChecked && question.explanation != null) {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(CornerRadius.lg),
                            colors = CardDefaults.cardColors(
                                containerColor = DmvInfo.copy(alpha = 0.08f)
                            )
                        ) {
                            Column(modifier = Modifier.padding(Spacing.lg)) {
                                Text(
                                    text = "Explanation",
                                    fontWeight = FontWeight.SemiBold,
                                    color = DmvInfo
                                )
                                Spacer(modifier = Modifier.height(Spacing.sm))
                                Text(
                                    text = question.explanation,
                                    color = DmvText,
                                    fontSize = 14.sp
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(Spacing.lg))
                    }

                    // Action buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(Spacing.md)
                    ) {
                        if (!state.isAnswerChecked) {
                            Button(
                                onClick = { viewModel.checkAnswer() },
                                enabled = state.selectedAnswer != null,
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(containerColor = DmvOrange),
                                shape = RoundedCornerShape(CornerRadius.lg)
                            ) {
                                Text("Check Answer")
                            }
                        } else {
                            if (state.currentIndex < state.totalQuestions - 1) {
                                Button(
                                    onClick = { viewModel.nextQuestion() },
                                    modifier = Modifier.weight(1f),
                                    colors = ButtonDefaults.buttonColors(containerColor = DmvOrange),
                                    shape = RoundedCornerShape(CornerRadius.lg)
                                ) {
                                    Text("Next Question")
                                }
                            } else {
                                Button(
                                    onClick = {
                                        val result = viewModel.finishQuiz()
                                        navController.navigate(
                                            Routes.quizResults(
                                                quizId = quizId,
                                                quizTitle = quizTitle,
                                                score = result.score,
                                                total = result.totalQuestions,
                                                percentage = result.percentage,
                                                passed = result.passed
                                            )
                                        )
                                    },
                                    modifier = Modifier.weight(1f),
                                    colors = ButtonDefaults.buttonColors(containerColor = DmvSuccess),
                                    shape = RoundedCornerShape(CornerRadius.lg)
                                ) {
                                    Text("Finish Quiz")
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(Spacing.xxxl))
                }
            }
        }
    }
}
