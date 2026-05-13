package com.dmvcalifornia.app.core.model

import kotlinx.serialization.Serializable

// MARK: - Quiz Attempt & History

@Serializable
data class QuizAttempt(
    val id: String = java.util.UUID.randomUUID().toString(),
    val quizId: String,
    val quizTitle: String,
    val score: Int,
    val totalQuestions: Int,
    val percentage: Double,
    val completedAt: Long = System.currentTimeMillis(),
    val wrongAnswers: List<WrongAnswer> = emptyList()
)

@Serializable
data class WrongAnswer(
    val questionId: Int,
    val question: String,
    val selectedAnswer: Int,
    val correctAnswer: Int,
    val category: String? = null
)

// MARK: - Quiz Result (for passing between screens)

data class QuizResult(
    val score: Int,
    val totalQuestions: Int,
    val percentage: Double,
    val passed: Boolean,
    val wrongAnswers: List<WrongAnswer> = emptyList(),
    val elapsedSeconds: Int? = null,
    val timeLimitSeconds: Int? = null
) {
    constructor(
        score: Int,
        totalQuestions: Int,
        percentage: Double,
        passingScore: Int = 83,
        wrongAnswers: List<WrongAnswer> = emptyList(),
        elapsedSeconds: Int? = null,
        timeLimitSeconds: Int? = null
    ) : this(
        score = score,
        totalQuestions = totalQuestions,
        percentage = percentage,
        passed = percentage >= passingScore.toDouble(),
        wrongAnswers = wrongAnswers,
        elapsedSeconds = elapsedSeconds,
        timeLimitSeconds = timeLimitSeconds
    )

    val formattedElapsedTime: String?
        get() {
            val elapsed = elapsedSeconds ?: return null
            val minutes = elapsed / 60
            val seconds = elapsed % 60
            return String.format("%d:%02d", minutes, seconds)
        }
}

// MARK: - Study Streak

@Serializable
data class StudyStreak(
    var currentStreak: Int = 0,
    var longestStreak: Int = 0,
    var lastStudyDate: String = "",
    var totalDaysStudied: Int = 0
)

// MARK: - Overall Stats

data class OverallStats(
    val totalQuizzes: Int = 0,
    val totalQuestions: Int = 0,
    val averageScore: Double = 0.0,
    val bestScore: Double = 0.0
)

// MARK: - Score History Entry (for charts)

data class ScoreHistoryEntry(
    val id: String = java.util.UUID.randomUUID().toString(),
    val date: Long,
    val percentage: Double,
    val quizTitle: String
)

// MARK: - Weak Area

data class WeakArea(
    val category: String,
    val wrongCount: Int,
    val totalCount: Int
) {
    val percentage: Double
        get() = if (totalCount > 0) wrongCount.toDouble() / totalCount.toDouble() * 100.0 else 0.0
}

// MARK: - Quiz Progress (for resume)

@Serializable
data class QuizProgress(
    val quizId: String,
    val quizTitle: String,
    val currentQuestionIndex: Int,
    val userAnswers: List<Int?>,
    val answeredCorrectly: List<Boolean?>,
    val bookmarkedQuestions: List<Int>,
    val startTime: Long,
    val remainingSeconds: Int? = null,
    val savedAt: Long = System.currentTimeMillis()
) {
    val answeredCount: Int get() = userAnswers.count { it != null }
    val totalQuestions: Int get() = userAnswers.size
    val progressPercentage: Int
        get() = if (totalQuestions > 0) (answeredCount.toDouble() / totalQuestions.toDouble() * 100).toInt() else 0
}
