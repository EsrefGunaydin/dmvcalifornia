package com.dmvcalifornia.app.core.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.intOrNull

@Serializable
data class LeaderboardEntry(
    val id: String? = null,
    @SerialName("_id") val mongoId: String? = null,
    val quizId: JsonElement? = null,
    val date: String = "",
    val name: String = "",
    val email: String? = null,
    val points: Int = 0,
    val percentage: Double = 0.0,
    val completedAt: String = ""
) {
    val resolvedId: String get() = id ?: mongoId ?: java.util.UUID.randomUUID().toString()

    val resolvedQuizId: String
        get() {
            val element = quizId ?: return ""
            return when (element) {
                is JsonPrimitive -> {
                    element.intOrNull?.toString() ?: element.content
                }
                else -> element.toString()
            }
        }
}

@Serializable
data class LeaderboardSubmission(
    val quizId: String,
    val name: String,
    val email: String? = null,
    val points: Int,
    val percentage: Double,
    val completedAt: String,
    val date: String
) {
    companion object {
        fun create(
            quizId: String,
            name: String,
            email: String?,
            points: Int,
            percentage: Double
        ): LeaderboardSubmission {
            val isoFormatter = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US)
            isoFormatter.timeZone = java.util.TimeZone.getTimeZone("UTC")
            val dateFormatter = java.text.SimpleDateFormat("MMM d, yyyy", java.util.Locale.US)
            val now = java.util.Date()
            return LeaderboardSubmission(
                quizId = quizId,
                name = name,
                email = email,
                points = points,
                percentage = percentage,
                completedAt = isoFormatter.format(now),
                date = dateFormatter.format(now)
            )
        }
    }
}

@Serializable
data class LeaderboardResponse(
    val success: Boolean,
    val message: String? = null
)

@Serializable
data class LeaderboardListResponse(
    val leaderboard: List<LeaderboardEntry>
)

data class LeaderboardResult(
    val entries: List<LeaderboardEntry>,
    val totalAttempts: Int,
    val averageScore: Double
)
