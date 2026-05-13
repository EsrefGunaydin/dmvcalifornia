package com.dmvcalifornia.app.feature.bookmark

import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.dmvcalifornia.app.core.model.BookmarkedQuestion
import com.dmvcalifornia.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookmarksScreen(
    navController: NavController,
    viewModel: BookmarksViewModel = hiltViewModel()
) {
    val bookmarks by viewModel.bookmarks.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Bookmarks") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { padding ->
        if (bookmarks.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.BookmarkBorder,
                        contentDescription = null,
                        tint = DmvTextTertiary,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(Spacing.lg))
                    Text(
                        text = "No bookmarks yet",
                        style = MaterialTheme.typography.headlineSmall,
                        color = DmvTextSecondary
                    )
                    Text(
                        text = "Bookmark questions during quizzes to review later",
                        fontSize = 14.sp,
                        color = DmvTextTertiary
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .background(DmvBackground),
                contentPadding = PaddingValues(Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                items(bookmarks, key = { it.id }) { bookmark ->
                    BookmarkCard(
                        bookmark = bookmark,
                        onDelete = { viewModel.removeBookmark(bookmark) }
                    )
                }
            }
        }
    }
}

@Composable
private fun BookmarkCard(
    bookmark: BookmarkedQuestion,
    onDelete: () -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .animateContentSize()
            .clickable { expanded = !expanded },
        shape = RoundedCornerShape(CornerRadius.lg),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(Spacing.lg)) {
            Row(verticalAlignment = Alignment.Top) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = bookmark.question,
                        fontWeight = FontWeight.Medium,
                        color = DmvText,
                        fontSize = 15.sp
                    )
                    if (bookmark.category != null) {
                        Text(
                            text = bookmark.category,
                            fontSize = 12.sp,
                            color = DmvTextTertiary,
                            modifier = Modifier.padding(top = Spacing.xs)
                        )
                    }
                }
                IconButton(onClick = onDelete) {
                    Icon(
                        Icons.Default.Delete,
                        contentDescription = "Remove bookmark",
                        tint = DmvError.copy(alpha = 0.7f),
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            if (expanded) {
                Spacer(modifier = Modifier.height(Spacing.md))
                HorizontalDivider(color = DmvDivider)
                Spacer(modifier = Modifier.height(Spacing.md))

                bookmark.options.forEachIndexed { index, option ->
                    val isCorrect = index == bookmark.correctAnswer
                    Row(
                        modifier = Modifier.padding(vertical = 2.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${'A' + index}. ",
                            fontWeight = if (isCorrect) FontWeight.Bold else FontWeight.Normal,
                            color = if (isCorrect) DmvSuccess else DmvText,
                            fontSize = 14.sp
                        )
                        Text(
                            text = option,
                            fontWeight = if (isCorrect) FontWeight.Bold else FontWeight.Normal,
                            color = if (isCorrect) DmvSuccess else DmvText,
                            fontSize = 14.sp
                        )
                        if (isCorrect) {
                            Icon(
                                Icons.Default.Check,
                                contentDescription = null,
                                tint = DmvSuccess,
                                modifier = Modifier
                                    .size(16.dp)
                                    .padding(start = 4.dp)
                            )
                        }
                    }
                }

                if (bookmark.explanation != null) {
                    Spacer(modifier = Modifier.height(Spacing.md))
                    Text(
                        text = bookmark.explanation,
                        fontSize = 13.sp,
                        color = DmvTextSecondary
                    )
                }
            }
        }
    }
}
