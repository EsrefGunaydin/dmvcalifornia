package com.dmvcalifornia.app.core.network

import com.dmvcalifornia.app.core.model.LeaderboardEntry
import com.dmvcalifornia.app.core.model.LeaderboardResponse
import com.dmvcalifornia.app.core.model.LeaderboardResult
import com.dmvcalifornia.app.core.model.LeaderboardSubmission
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ApiClient @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun submitScore(submission: LeaderboardSubmission): LeaderboardResponse {
        return apiService.submitScore(submission)
    }

    suspend fun getLeaderboard(quizId: String? = null): LeaderboardResult {
        val response = apiService.getLeaderboard(quizId)
        val allEntries = response.leaderboard

        val totalAttempts = allEntries.size
        val averageScore = if (allEntries.isEmpty()) 0.0
            else allEntries.sumOf { it.percentage } / allEntries.size

        val deduplicated = deduplicateLeaderboard(allEntries)

        return LeaderboardResult(
            entries = deduplicated,
            totalAttempts = totalAttempts,
            averageScore = averageScore
        )
    }

    private fun deduplicateLeaderboard(entries: List<LeaderboardEntry>): List<LeaderboardEntry> {
        val bestByName = mutableMapOf<String, LeaderboardEntry>()
        for (entry in entries) {
            val normalizedName = entry.name.lowercase().trim()
            val existing = bestByName[normalizedName]
            if (existing == null || entry.percentage > existing.percentage) {
                bestByName[normalizedName] = entry
            }
        }
        return bestByName.values.sortedByDescending { it.percentage }
    }
}
