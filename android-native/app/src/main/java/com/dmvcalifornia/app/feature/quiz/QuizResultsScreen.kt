package com.dmvcalifornia.app.feature.quiz

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.dmvcalifornia.app.ui.navigation.Routes
import com.dmvcalifornia.app.ui.theme.*

@Composable
fun QuizResultsScreen(
    quizId: String,
    quizTitle: String,
    score: Int,
    totalQuestions: Int,
    percentage: Double,
    passed: Boolean,
    navController: NavController
) {
    val scoreColor = if (passed) DmvSuccess else DmvError

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DmvBackground)
            .verticalScroll(rememberScrollState())
            .padding(Spacing.lg),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(Spacing.xxxl))

        // Result icon
        Box(
            modifier = Modifier
                .size(100.dp)
                .clip(CircleShape)
                .background(scoreColor.copy(alpha = 0.1f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                if (passed) Icons.Default.CheckCircle else Icons.Default.Cancel,
                contentDescription = null,
                tint = scoreColor,
                modifier = Modifier.size(56.dp)
            )
        }

        Spacer(modifier = Modifier.height(Spacing.xl))

        Text(
            text = if (passed) "Congratulations!" else "Keep Practicing!",
            style = MaterialTheme.typography.displayMedium,
            color = DmvText,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(Spacing.sm))

        Text(
            text = if (passed) "You passed the test!" else "You need 83% to pass",
            style = MaterialTheme.typography.bodyLarge,
            color = DmvTextSecondary,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(Spacing.xxxl))

        // Score display
        Text(
            text = "${percentage.toInt()}%",
            fontSize = 64.sp,
            fontWeight = FontWeight.Bold,
            color = scoreColor
        )

        Text(
            text = "$score out of $totalQuestions correct",
            style = MaterialTheme.typography.bodyLarge,
            color = DmvTextSecondary
        )

        Spacer(modifier = Modifier.height(Spacing.xxxl))

        // Action buttons
        Button(
            onClick = {
                navController.navigate(Routes.quizDetail(quizId, quizTitle)) {
                    popUpTo(Routes.QUIZZES) { inclusive = false }
                }
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = DmvOrange),
            shape = RoundedCornerShape(CornerRadius.lg)
        ) {
            Icon(Icons.Default.Refresh, contentDescription = null)
            Spacer(modifier = Modifier.width(Spacing.sm))
            Text("Retake Quiz")
        }

        Spacer(modifier = Modifier.height(Spacing.md))

        OutlinedButton(
            onClick = {
                navController.popBackStack(Routes.QUIZZES, false)
            },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(CornerRadius.lg)
        ) {
            Text("Back to Tests", color = DmvOrange)
        }

        Spacer(modifier = Modifier.height(Spacing.xxxl))
    }
}
