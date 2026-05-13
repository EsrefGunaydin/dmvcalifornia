package com.dmvcalifornia.app.core.data

import android.content.SharedPreferences
import com.dmvcalifornia.app.core.model.*
import com.dmvcalifornia.app.core.util.Constants
import com.dmvcalifornia.app.core.util.DateUtils
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.nullable
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class StorageManager @Inject constructor(
    private val prefs: SharedPreferences,
    private val json: Json
) {
    // MARK: - Quiz History

    fun saveQuizResult(attempt: QuizAttempt) {
        val history = getQuizHistory().toMutableList()
        history.add(0, attempt)
        if (history.size > Constants.Quiz.MAX_HISTORY_ENTRIES) {
            while (history.size > Constants.Quiz.MAX_HISTORY_ENTRIES) {
                history.removeAt(history.lastIndex)
            }
        }
        val data = json.encodeToString(ListSerializer(QuizAttempt.serializer()), history)
        prefs.edit().putString(Constants.Storage.QUIZ_HISTORY, data).apply()
    }

    fun getQuizHistory(): List<QuizAttempt> {
        val data = prefs.getString(Constants.Storage.QUIZ_HISTORY, null) ?: return emptyList()
        return try {
            json.decodeFromString(ListSerializer(QuizAttempt.serializer()), data)
        } catch (_: Exception) {
            emptyList()
        }
    }

    fun getQuizBestScore(quizId: String): Double? {
        return getQuizHistory()
            .filter { it.quizId == quizId }
            .maxByOrNull { it.percentage }
            ?.percentage
    }

    fun getOverallStats(): OverallStats {
        val history = getQuizHistory()
        if (history.isEmpty()) return OverallStats()

        return OverallStats(
            totalQuizzes = history.size,
            totalQuestions = history.sumOf { it.totalQuestions },
            averageScore = history.sumOf { it.percentage } / history.size,
            bestScore = history.maxOf { it.percentage }
        )
    }

    fun getScoreHistory(limit: Int = 10): List<ScoreHistoryEntry> {
        return getQuizHistory().take(limit).reversed().map { attempt ->
            ScoreHistoryEntry(
                date = attempt.completedAt,
                percentage = attempt.percentage,
                quizTitle = attempt.quizTitle
            )
        }
    }

    fun getRecentActivity(limit: Int = 5): List<QuizAttempt> {
        return getQuizHistory().take(limit)
    }

    // MARK: - Bookmarks

    fun saveBookmark(bookmark: BookmarkedQuestion) {
        val bookmarks = getBookmarks().toMutableList()
        if (bookmarks.any { it.questionId == bookmark.questionId && it.quizId == bookmark.quizId }) return
        bookmarks.add(0, bookmark)
        val data = json.encodeToString(ListSerializer(BookmarkedQuestion.serializer()), bookmarks)
        prefs.edit().putString(Constants.Storage.BOOKMARKS, data).apply()
    }

    fun removeBookmark(questionId: Int, quizId: String) {
        val bookmarks = getBookmarks().toMutableList()
        bookmarks.removeAll { it.questionId == questionId && it.quizId == quizId }
        val data = json.encodeToString(ListSerializer(BookmarkedQuestion.serializer()), bookmarks)
        prefs.edit().putString(Constants.Storage.BOOKMARKS, data).apply()
    }

    fun getBookmarks(): List<BookmarkedQuestion> {
        val data = prefs.getString(Constants.Storage.BOOKMARKS, null) ?: return emptyList()
        return try {
            json.decodeFromString(ListSerializer(BookmarkedQuestion.serializer()), data)
        } catch (_: Exception) {
            emptyList()
        }
    }

    fun isBookmarked(questionId: Int, quizId: String): Boolean {
        return getBookmarks().any { it.questionId == questionId && it.quizId == quizId }
    }

    // MARK: - Streak

    fun getStreak(): StudyStreak {
        val data = prefs.getString(Constants.Storage.STREAK, null) ?: return StudyStreak()
        return try {
            json.decodeFromString(StudyStreak.serializer(), data)
        } catch (_: Exception) {
            StudyStreak()
        }
    }

    fun updateStreak(): StudyStreak {
        val streak = getStreak()
        val today = DateUtils.today()

        if (streak.lastStudyDate == today) return streak

        val updated = streak.copy()
        val yesterday = DateUtils.yesterday()

        if (updated.lastStudyDate == yesterday) {
            updated.currentStreak += 1
        } else if (updated.lastStudyDate.isEmpty() || updated.lastStudyDate != today) {
            updated.currentStreak = 1
        }

        if (updated.currentStreak > updated.longestStreak) {
            updated.longestStreak = updated.currentStreak
        }

        updated.lastStudyDate = today
        updated.totalDaysStudied += 1

        val data = json.encodeToString(StudyStreak.serializer(), updated)
        prefs.edit().putString(Constants.Storage.STREAK, data).apply()
        return updated
    }

    // MARK: - Weak Areas

    fun getWeakAreas(): List<WeakArea> {
        val history = getQuizHistory()
        val categoryWrong = mutableMapOf<String, Int>()
        val categoryTotal = mutableMapOf<String, Int>()

        for (attempt in history) {
            for (wrong in attempt.wrongAnswers) {
                val category = wrong.category ?: "General"
                categoryWrong[category] = (categoryWrong[category] ?: 0) + 1
                categoryTotal[category] = (categoryTotal[category] ?: 0) + 1
            }
        }

        return categoryWrong
            .filter { it.value >= 2 }
            .map { (category, wrongCount) ->
                WeakArea(
                    category = category,
                    wrongCount = wrongCount,
                    totalCount = categoryTotal[category] ?: wrongCount
                )
            }
            .sortedByDescending { it.wrongCount }
    }

    // MARK: - Quiz Progress (Resume)

    fun saveQuizProgress(progress: QuizProgress) {
        val data = json.encodeToString(QuizProgress.serializer(), progress)
        prefs.edit().putString(Constants.Storage.QUIZ_PROGRESS, data).apply()
    }

    fun getQuizProgress(): QuizProgress? {
        val data = prefs.getString(Constants.Storage.QUIZ_PROGRESS, null) ?: return null
        return try {
            val progress = json.decodeFromString(QuizProgress.serializer(), data)
            val maxAge = 24 * 60 * 60 * 1000L // 24 hours
            if (System.currentTimeMillis() - progress.savedAt > maxAge) {
                clearQuizProgress()
                null
            } else {
                progress
            }
        } catch (_: Exception) {
            null
        }
    }

    fun clearQuizProgress() {
        prefs.edit().remove(Constants.Storage.QUIZ_PROGRESS).apply()
    }

    // MARK: - Onboarding

    fun isOnboardingCompleted(): Boolean {
        return prefs.getBoolean(Constants.Storage.ONBOARDING_COMPLETED, false)
    }

    fun setOnboardingCompleted() {
        prefs.edit().putBoolean(Constants.Storage.ONBOARDING_COMPLETED, true).apply()
    }

    // MARK: - Clear Data

    fun clearAllData() {
        prefs.edit()
            .remove(Constants.Storage.QUIZ_HISTORY)
            .remove(Constants.Storage.BOOKMARKS)
            .remove(Constants.Storage.STREAK)
            .remove(Constants.Storage.QUIZ_PROGRESS)
            .apply()
    }
}
