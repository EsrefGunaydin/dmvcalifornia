package com.dmvcalifornia.app.feature.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.dmvcalifornia.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AboutScreen(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("About") },
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
                .verticalScroll(rememberScrollState())
                .padding(Spacing.lg),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(Spacing.xxxl))

            Icon(
                Icons.Default.DirectionsCar,
                contentDescription = null,
                tint = DmvOrange,
                modifier = Modifier.size(64.dp)
            )

            Spacer(modifier = Modifier.height(Spacing.lg))

            Text(
                text = "DMV California",
                style = MaterialTheme.typography.displayMedium,
                color = DmvText
            )

            Text(
                text = "Version 1.0.0",
                fontSize = 14.sp,
                color = DmvTextSecondary
            )

            Spacer(modifier = Modifier.height(Spacing.xxxl))

            Text(
                text = "Practice for your California DMV written test with simulation tests, flashcards, and progress tracking.",
                textAlign = TextAlign.Center,
                color = DmvTextSecondary,
                modifier = Modifier.padding(horizontal = Spacing.xl)
            )

            Spacer(modifier = Modifier.height(Spacing.xxxl))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(Spacing.lg)) {
                    Text(
                        text = "Features",
                        fontWeight = FontWeight.SemiBold,
                        color = DmvText
                    )
                    Spacer(modifier = Modifier.height(Spacing.md))
                    FeatureRow("Full DMV simulation tests")
                    FeatureRow("Multi-language support")
                    FeatureRow("Flashcard study mode")
                    FeatureRow("Progress tracking & streaks")
                    FeatureRow("Gamification & achievements")
                    FeatureRow("Offline support")
                }
            }

            Spacer(modifier = Modifier.height(Spacing.xxxl))

            Text(
                text = "dmvcalifornia.us",
                color = DmvBlue,
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(Spacing.xxxl))
        }
    }
}

@Composable
private fun FeatureRow(text: String) {
    Row(
        modifier = Modifier.padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            Icons.Default.Check,
            contentDescription = null,
            tint = DmvSuccess,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(Spacing.sm))
        Text(text = text, fontSize = 14.sp, color = DmvText)
    }
}
