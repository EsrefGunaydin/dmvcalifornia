package com.dmvcalifornia.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.dmvcalifornia.app.feature.bookmark.BookmarksScreen
import com.dmvcalifornia.app.feature.flashcard.FlashcardDeckScreen
import com.dmvcalifornia.app.feature.flashcard.FlashcardsListScreen
import com.dmvcalifornia.app.feature.home.HomeScreen
import com.dmvcalifornia.app.feature.progress.ProgressScreen
import com.dmvcalifornia.app.feature.quiz.QuizDetailScreen
import com.dmvcalifornia.app.feature.quiz.QuizResultsScreen
import com.dmvcalifornia.app.feature.quiz.QuizzesScreen
import com.dmvcalifornia.app.feature.settings.AboutScreen
import com.dmvcalifornia.app.ui.theme.DmvOrange

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    // Show bottom bar only on main tabs
    val showBottomBar = Tab.entries.any { tab ->
        currentDestination?.hierarchy?.any { it.route == tab.route } == true
    }

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar(
                    containerColor = androidx.compose.ui.graphics.Color.White
                ) {
                    Tab.entries.forEach { tab ->
                        val selected = currentDestination?.hierarchy?.any { it.route == tab.route } == true
                        NavigationBarItem(
                            icon = { Icon(tab.icon, contentDescription = tab.title) },
                            label = { Text(tab.title) },
                            selected = selected,
                            onClick = {
                                navController.navigate(tab.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = DmvOrange,
                                selectedTextColor = DmvOrange,
                                indicatorColor = DmvOrange.copy(alpha = 0.1f)
                            )
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Routes.HOME,
            modifier = Modifier.padding(innerPadding)
        ) {
            // Main tabs
            composable(Routes.HOME) {
                HomeScreen(navController = navController)
            }
            composable(Routes.QUIZZES) {
                QuizzesScreen(navController = navController)
            }
            composable(Routes.FLASHCARDS) {
                FlashcardsListScreen(navController = navController)
            }
            composable(Routes.PROGRESS) {
                ProgressScreen(navController = navController)
            }

            // Quiz Detail
            composable(
                route = Routes.QUIZ_DETAIL,
                arguments = listOf(
                    navArgument("quizId") { type = NavType.StringType },
                    navArgument("quizTitle") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                val quizId = backStackEntry.arguments?.getString("quizId") ?: ""
                val quizTitle = java.net.URLDecoder.decode(
                    backStackEntry.arguments?.getString("quizTitle") ?: "", "UTF-8"
                )
                QuizDetailScreen(
                    quizId = quizId,
                    quizTitle = quizTitle,
                    navController = navController
                )
            }

            // Quiz Results
            composable(
                route = Routes.QUIZ_RESULTS,
                arguments = listOf(
                    navArgument("quizId") { type = NavType.StringType },
                    navArgument("quizTitle") { type = NavType.StringType },
                    navArgument("score") { type = NavType.IntType },
                    navArgument("total") { type = NavType.IntType },
                    navArgument("percentage") { type = NavType.StringType },
                    navArgument("passed") { type = NavType.BoolType }
                )
            ) { backStackEntry ->
                val quizId = backStackEntry.arguments?.getString("quizId") ?: ""
                val quizTitle = java.net.URLDecoder.decode(
                    backStackEntry.arguments?.getString("quizTitle") ?: "", "UTF-8"
                )
                val score = backStackEntry.arguments?.getInt("score") ?: 0
                val total = backStackEntry.arguments?.getInt("total") ?: 0
                val percentage = backStackEntry.arguments?.getString("percentage")?.toDoubleOrNull() ?: 0.0
                val passed = backStackEntry.arguments?.getBoolean("passed") ?: false
                QuizResultsScreen(
                    quizId = quizId,
                    quizTitle = quizTitle,
                    score = score,
                    totalQuestions = total,
                    percentage = percentage,
                    passed = passed,
                    navController = navController
                )
            }

            // Flashcard Deck
            composable(
                route = Routes.FLASHCARD_DECK,
                arguments = listOf(
                    navArgument("setId") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                val setId = backStackEntry.arguments?.getString("setId") ?: ""
                FlashcardDeckScreen(setId = setId, navController = navController)
            }

            // Bookmarks
            composable(Routes.BOOKMARKS) {
                BookmarksScreen(navController = navController)
            }

            // About
            composable(Routes.ABOUT) {
                AboutScreen(navController = navController)
            }
        }
    }
}
