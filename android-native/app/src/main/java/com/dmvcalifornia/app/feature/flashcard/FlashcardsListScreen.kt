package com.dmvcalifornia.app.feature.flashcard

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Style
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
import com.dmvcalifornia.app.core.model.FlashcardSet
import com.dmvcalifornia.app.ui.navigation.Routes
import com.dmvcalifornia.app.ui.theme.*

@Composable
fun FlashcardsListScreen(
    navController: NavController,
    viewModel: FlashcardsViewModel = hiltViewModel()
) {
    val flashcardSets by viewModel.filteredSets.collectAsState()
    val selectedLanguage by viewModel.selectedLanguage.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DmvBackground)
    ) {
        Text(
            text = "Flashcards",
            style = MaterialTheme.typography.displayMedium,
            color = DmvText,
            modifier = Modifier.padding(start = Spacing.lg, top = Spacing.lg, bottom = Spacing.sm)
        )

        // Language Filter
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
                        selectedContainerColor = DmvTeal,
                        selectedLabelColor = Color.White
                    )
                )
            }
        }

        LazyColumn(
            contentPadding = PaddingValues(Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            items(flashcardSets, key = { it.id }) { set ->
                FlashcardSetCard(
                    set = set,
                    onClick = { navController.navigate(Routes.flashcardDeck(set.id)) }
                )
            }
        }
    }
}

@Composable
private fun FlashcardSetCard(
    set: FlashcardSet,
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
        Row(
            modifier = Modifier.padding(Spacing.lg),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(CornerRadius.md))
                    .background(DmvTeal.copy(alpha = 0.1f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Style,
                    contentDescription = null,
                    tint = DmvTeal,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(Spacing.md))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = set.displayTitle,
                    fontWeight = FontWeight.SemiBold,
                    color = DmvText
                )
                Text(
                    text = "${set.cardsCount} cards",
                    fontSize = 13.sp,
                    color = DmvTextSecondary
                )
            }
        }
    }
}
