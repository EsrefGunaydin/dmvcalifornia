package com.dmvcalifornia.app.core.model

import kotlinx.serialization.Serializable
import kotlin.math.roundToInt

@Serializable
data class Quiz(
    val id: String,
    val title: String,
    val description: String,
    val slug: String,
    val category: String? = null,
    val passingScore: Int? = null,
    val timeLimit: Double? = null,
    val language: String? = null,
    val questions: List<Question>? = null
) {
    val questionsCount: Int get() = questions?.size ?: 0

    val timeLimitMinutes: Int
        get() = timeLimit?.toFloat()?.roundToInt() ?: 0

    /** "California DMV Simulation Test #1" -> "DMV Simulation Test 1" */
    val displayTitle: String
        get() {
            var result = title
            if (result.startsWith("California ")) {
                result = result.removePrefix("California ")
            }
            result = result.replace("#", "")
            return result
        }
}

@Serializable
data class Question(
    val id: Int,
    val question: String,
    val options: List<String>,
    val correctAnswer: Int,
    val explanation: String? = null,
    val category: String? = null,
    val difficulty: String? = null,
    val image: String? = null
) {
    val hasImage: Boolean get() = !image.isNullOrEmpty()

    /**
     * Converts paths like "/images/traffic-signs-2/stop.jpeg" to "traffic-signs-2/stop"
     */
    val assetImagePath: String?
        get() {
            val img = image ?: return null
            if (img.isEmpty()) return null
            var name = img
            if (name.startsWith("/images/")) {
                name = name.removePrefix("/images/")
            }
            // Remove file extension
            val dotIndex = name.lastIndexOf('.')
            if (dotIndex > 0) {
                name = name.substring(0, dotIndex)
            }
            return name
        }
}

@Serializable
data class QuizzesResponse(
    val quizzes: List<Quiz>
)

@Serializable
data class SingleQuizResponse(
    val quiz: Quiz
)
