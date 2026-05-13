package com.dmvcalifornia.app.feature.flashcard

import androidx.lifecycle.ViewModel
import com.dmvcalifornia.app.core.data.QuizDataSource
import com.dmvcalifornia.app.core.model.FlashcardSet
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class FlashcardDeckViewModel @Inject constructor(
    private val quizDataSource: QuizDataSource
) : ViewModel() {

    private val _flashcardSet = MutableStateFlow<FlashcardSet?>(null)
    val flashcardSet: StateFlow<FlashcardSet?> = _flashcardSet.asStateFlow()

    private val _currentIndex = MutableStateFlow(0)
    val currentIndex: StateFlow<Int> = _currentIndex.asStateFlow()

    private val _isFlipped = MutableStateFlow(false)
    val isFlipped: StateFlow<Boolean> = _isFlipped.asStateFlow()

    fun loadSet(setId: String) {
        // Search all language sets
        val allSets = quizDataSource.getFlashcardSets() +
            quizDataSource.getSpanishFlashcards() +
            quizDataSource.getTurkishFlashcards() +
            quizDataSource.getChineseFlashcards()

        _flashcardSet.value = allSets.firstOrNull { it.id == setId }
        _currentIndex.value = 0
        _isFlipped.value = false
    }

    fun toggleFlip() {
        _isFlipped.value = !_isFlipped.value
    }

    fun nextCard() {
        val set = _flashcardSet.value ?: return
        if (_currentIndex.value < set.cardsCount - 1) {
            _currentIndex.value += 1
            _isFlipped.value = false
        }
    }

    fun previousCard() {
        if (_currentIndex.value > 0) {
            _currentIndex.value -= 1
            _isFlipped.value = false
        }
    }
}
