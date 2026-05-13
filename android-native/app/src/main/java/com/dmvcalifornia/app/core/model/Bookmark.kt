package com.dmvcalifornia.app.core.model

import kotlinx.serialization.Serializable

@Serializable
data class BookmarkedQuestion(
    val id: String = java.util.UUID.randomUUID().toString(),
    val questionId: Int,
    val quizId: String,
    val question: String,
    val options: List<String>,
    val correctAnswer: Int,
    val explanation: String? = null,
    val category: String? = null,
    val bookmarkedAt: Long = System.currentTimeMillis()
) {
    companion object {
        fun fromQuestion(question: Question, quizId: String) = BookmarkedQuestion(
            questionId = question.id,
            quizId = quizId,
            question = question.question,
            options = question.options,
            correctAnswer = question.correctAnswer,
            explanation = question.explanation,
            category = question.category
        )
    }
}
