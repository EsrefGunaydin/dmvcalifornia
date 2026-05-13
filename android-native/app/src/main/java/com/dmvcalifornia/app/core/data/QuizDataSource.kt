package com.dmvcalifornia.app.core.data

import android.content.Context
import com.dmvcalifornia.app.core.model.FlashcardSet
import com.dmvcalifornia.app.core.model.Quiz
import com.dmvcalifornia.app.core.model.QuizzesResponse
import com.dmvcalifornia.app.core.model.SingleQuizResponse
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class QuizDataSource @Inject constructor(
    @ApplicationContext private val context: Context,
    private val json: Json
) {
    // Caches
    private var englishQuizzesCache: List<Quiz>? = null
    private var spanishQuizzesCache: List<Quiz>? = null
    private var turkishQuizzesCache: List<Quiz>? = null
    private var chineseQuizzesCache: List<Quiz>? = null
    private var flashcardsCache: List<FlashcardSet>? = null
    private var spanishFlashcardsCache: List<FlashcardSet>? = null
    private var turkishFlashcardsCache: List<FlashcardSet>? = null
    private var chineseFlashcardsCache: List<FlashcardSet>? = null
    private var allQuizzesLoaded = false

    // MARK: - Load and Separate Quizzes

    private fun loadAndSeparateQuizzes() {
        if (allQuizzesLoaded) return
        val allQuizzes = loadJson("data/quizzes.json", QuizzesResponse.serializer()).quizzes

        val english = mutableListOf<Quiz>()
        val spanish = mutableListOf<Quiz>()

        for (quiz in allQuizzes) {
            if (quiz.category?.contains("Spanish") == true) {
                spanish.add(quiz)
            } else {
                english.add(quiz)
            }
        }

        englishQuizzesCache = english
        spanishQuizzesCache = spanish
        allQuizzesLoaded = true
    }

    // MARK: - English Quizzes

    fun getQuizzes(): List<Quiz> {
        loadAndSeparateQuizzes()
        return englishQuizzesCache ?: emptyList()
    }

    fun getQuizById(id: String): Quiz? {
        return getAllQuizzes().firstOrNull { it.id == id }
    }

    // MARK: - Spanish Quizzes

    fun getSpanishQuizzes(): List<Quiz> {
        loadAndSeparateQuizzes()
        val quizzes = (spanishQuizzesCache ?: emptyList()).toMutableList()
        try {
            val signTest = loadJson("data/spanish-sign-test.json", SingleQuizResponse.serializer()).quiz
            if (quizzes.none { it.id == signTest.id }) {
                quizzes.add(signTest)
            }
        } catch (_: Exception) {}
        spanishQuizzesCache = quizzes
        return quizzes
    }

    // MARK: - Turkish Quizzes

    fun getTurkishQuizzes(): List<Quiz> {
        turkishQuizzesCache?.let { return it }
        val quizzes = mutableListOf<Quiz>()
        try {
            val response = loadJson("data/turkish-quizzes.json", QuizzesResponse.serializer())
            quizzes.addAll(response.quizzes)
        } catch (_: Exception) {}
        try {
            val signTest = loadJson("data/turkish-sign-test.json", SingleQuizResponse.serializer()).quiz
            quizzes.add(signTest)
        } catch (_: Exception) {}
        turkishQuizzesCache = quizzes
        return quizzes
    }

    // MARK: - Chinese Quizzes

    fun getChineseQuizzes(): List<Quiz> {
        chineseQuizzesCache?.let { return it }
        return try {
            val response = loadJson("data/chinese-quizzes.json", QuizzesResponse.serializer())
            chineseQuizzesCache = response.quizzes
            response.quizzes
        } catch (_: Exception) {
            emptyList()
        }
    }

    // MARK: - All Quizzes

    fun getAllQuizzes(): List<Quiz> {
        return getQuizzes() + getSpanishQuizzes() + getTurkishQuizzes() + getChineseQuizzes()
    }

    // MARK: - Flashcards

    fun getFlashcardSets(): List<FlashcardSet> {
        flashcardsCache?.let { return it }
        return try {
            val sets = loadJson("data/flashcards.json", kotlinx.serialization.builtins.ListSerializer(FlashcardSet.serializer()))
            flashcardsCache = sets
            sets
        } catch (_: Exception) {
            emptyList()
        }
    }

    fun getSpanishFlashcards(): List<FlashcardSet> {
        spanishFlashcardsCache?.let { return it }
        return try {
            val sets = loadJson("data/spanish-flashcards.json", kotlinx.serialization.builtins.ListSerializer(FlashcardSet.serializer()))
            spanishFlashcardsCache = sets
            sets
        } catch (_: Exception) {
            emptyList()
        }
    }

    fun getTurkishFlashcards(): List<FlashcardSet> {
        turkishFlashcardsCache?.let { return it }
        return try {
            val sets = loadJson("data/turkish-flashcards.json", kotlinx.serialization.builtins.ListSerializer(FlashcardSet.serializer()))
            turkishFlashcardsCache = sets
            sets
        } catch (_: Exception) {
            emptyList()
        }
    }

    fun getChineseFlashcards(): List<FlashcardSet> {
        chineseFlashcardsCache?.let { return it }
        return try {
            val sets = loadJson("data/chinese-flashcards.json", kotlinx.serialization.builtins.ListSerializer(FlashcardSet.serializer()))
            chineseFlashcardsCache = sets
            sets
        } catch (_: Exception) {
            emptyList()
        }
    }

    // MARK: - Helper

    private fun <T> loadJson(assetPath: String, deserializer: kotlinx.serialization.DeserializationStrategy<T>): T {
        val jsonString = context.assets.open(assetPath).bufferedReader().use { it.readText() }
        return json.decodeFromString(deserializer, jsonString)
    }

    fun clearCache() {
        englishQuizzesCache = null
        spanishQuizzesCache = null
        turkishQuizzesCache = null
        chineseQuizzesCache = null
        flashcardsCache = null
        spanishFlashcardsCache = null
        turkishFlashcardsCache = null
        chineseFlashcardsCache = null
        allQuizzesLoaded = false
    }
}
