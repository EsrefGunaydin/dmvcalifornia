package com.dmvcalifornia.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.ShowChart
import androidx.compose.material.icons.filled.Style
import androidx.compose.ui.graphics.vector.ImageVector

// Tab definitions
enum class Tab(val title: String, val icon: ImageVector, val route: String) {
    HOME("Home", Icons.Default.Home, "home"),
    QUIZZES("Tests", Icons.Default.Description, "quizzes"),
    FLASHCARDS("Flashcards", Icons.Default.Style, "flashcards"),
    PROGRESS("Progress", Icons.Default.ShowChart, "progress");
}

// Screen routes
object Routes {
    const val HOME = "home"
    const val QUIZZES = "quizzes"
    const val FLASHCARDS = "flashcards"
    const val PROGRESS = "progress"
    const val QUIZ_DETAIL = "quiz_detail/{quizId}/{quizTitle}"
    const val QUIZ_RESULTS = "quiz_results/{quizId}/{quizTitle}/{score}/{total}/{percentage}/{passed}"
    const val FLASHCARD_DECK = "flashcard_deck/{setId}"
    const val BOOKMARKS = "bookmarks"
    const val ABOUT = "about"
    const val ONBOARDING = "onboarding"

    fun quizDetail(quizId: String, quizTitle: String): String =
        "quiz_detail/$quizId/${java.net.URLEncoder.encode(quizTitle, "UTF-8")}"

    fun quizResults(
        quizId: String, quizTitle: String,
        score: Int, total: Int, percentage: Double, passed: Boolean
    ): String = "quiz_results/$quizId/${java.net.URLEncoder.encode(quizTitle, "UTF-8")}/$score/$total/$percentage/$passed"

    fun flashcardDeck(setId: String): String = "flashcard_deck/$setId"
}
