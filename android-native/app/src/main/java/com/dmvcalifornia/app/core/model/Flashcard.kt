package com.dmvcalifornia.app.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Flashcard(
    val id: Int,
    val question: String,
    val answer: String
)

@Serializable
data class FlashcardSet(
    val id: String,
    val title: String,
    val description: String,
    val category: String,
    val slug: String,
    val language: String? = null,
    val cards: List<Flashcard>
) {
    val cardsCount: Int get() = cards.size

    /** Display title: "DMV Flashcards 1", "DMV Flashcards 2", etc. */
    val displayTitle: String
        get() {
            val lastComponent = id.split("-").lastOrNull()
            val number = lastComponent?.toIntOrNull()
            return if (number != null) "DMV Flashcards $number" else title
        }
}
