package com.dmvcalifornia.app.feature.flashcard

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.dmvcalifornia.app.core.data.QuizDataSource
import com.dmvcalifornia.app.core.model.Flashcard
import com.dmvcalifornia.app.core.model.FlashcardSet
import com.dmvcalifornia.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FlashcardDeckScreen(
    setId: String,
    navController: NavController,
    viewModel: FlashcardDeckViewModel = hiltViewModel()
) {
    val flashcardSet by viewModel.flashcardSet.collectAsState()
    val currentIndex by viewModel.currentIndex.collectAsState()
    val isFlipped by viewModel.isFlipped.collectAsState()

    LaunchedEffect(setId) {
        viewModel.loadSet(setId)
    }

    val set = flashcardSet
    if (set == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = DmvTeal)
        }
        return
    }

    val currentCard = set.cards.getOrNull(currentIndex) ?: return

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(set.displayTitle) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(DmvBackground)
                .padding(Spacing.lg),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Progress
            Text(
                text = "${currentIndex + 1} of ${set.cardsCount}",
                color = DmvTextSecondary,
                fontSize = 14.sp
            )

            LinearProgressIndicator(
                progress = { (currentIndex + 1).toFloat() / set.cardsCount },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = Spacing.md)
                    .height(4.dp),
                color = DmvTeal,
                trackColor = DmvBorder
            )

            Spacer(modifier = Modifier.height(Spacing.xl))

            // Flashcard with 3D flip
            val rotation by animateFloatAsState(
                targetValue = if (isFlipped) 180f else 0f,
                animationSpec = tween(400),
                label = "flip"
            )

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
                    .graphicsLayer {
                        rotationY = rotation
                        cameraDistance = 12f * density
                    }
                    .clickable { viewModel.toggleFlip() },
                shape = RoundedCornerShape(GamifiedTheme.Radius.large),
                colors = CardDefaults.cardColors(
                    containerColor = if (rotation <= 90f) Color.White else DmvTeal.copy(alpha = 0.05f)
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(Spacing.xxl),
                    contentAlignment = Alignment.Center
                ) {
                    if (rotation <= 90f) {
                        // Front - Question
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                Icons.Default.QuestionMark,
                                contentDescription = null,
                                tint = DmvTeal,
                                modifier = Modifier.size(32.dp)
                            )
                            Spacer(modifier = Modifier.height(Spacing.lg))
                            Text(
                                text = currentCard.question,
                                style = MaterialTheme.typography.headlineSmall,
                                color = DmvText,
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(Spacing.lg))
                            Text(
                                text = "Tap to reveal answer",
                                fontSize = 13.sp,
                                color = DmvTextTertiary
                            )
                        }
                    } else {
                        // Back - Answer (mirrored so text reads correctly)
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.graphicsLayer { rotationY = 180f }
                        ) {
                            Icon(
                                Icons.Default.Lightbulb,
                                contentDescription = null,
                                tint = DmvSuccess,
                                modifier = Modifier.size(32.dp)
                            )
                            Spacer(modifier = Modifier.height(Spacing.lg))
                            Text(
                                text = currentCard.answer,
                                style = MaterialTheme.typography.bodyLarge,
                                color = DmvText,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Navigation buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                OutlinedButton(
                    onClick = { viewModel.previousCard() },
                    enabled = currentIndex > 0,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(CornerRadius.lg)
                ) {
                    Icon(Icons.Default.ChevronLeft, contentDescription = null)
                    Text("Previous")
                }

                Button(
                    onClick = { viewModel.nextCard() },
                    enabled = currentIndex < set.cardsCount - 1,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = DmvTeal),
                    shape = RoundedCornerShape(CornerRadius.lg)
                ) {
                    Text("Next")
                    Icon(Icons.Default.ChevronRight, contentDescription = null)
                }
            }

            Spacer(modifier = Modifier.height(Spacing.lg))
        }
    }
}
