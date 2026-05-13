package com.dmvcalifornia.app.feature.flashcard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dmvcalifornia.app.core.data.QuizDataSource
import com.dmvcalifornia.app.core.model.FlashcardSet
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class FlashcardsViewModel @Inject constructor(
    private val quizDataSource: QuizDataSource
) : ViewModel() {

    private val _selectedLanguage = MutableStateFlow("English")
    val selectedLanguage: StateFlow<String> = _selectedLanguage.asStateFlow()

    private val _allSets = MutableStateFlow<List<FlashcardSet>>(emptyList())

    val filteredSets: StateFlow<List<FlashcardSet>> = _selectedLanguage.map { language ->
        when (language) {
            "English" -> quizDataSource.getFlashcardSets()
            "Spanish" -> quizDataSource.getSpanishFlashcards()
            "Turkish" -> quizDataSource.getTurkishFlashcards()
            "Chinese" -> quizDataSource.getChineseFlashcards()
            else -> emptyList()
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        loadSets()
    }

    private fun loadSets() {
        viewModelScope.launch {
            _allSets.value = quizDataSource.getFlashcardSets()
        }
    }

    fun onLanguageSelected(language: String) {
        _selectedLanguage.value = language
    }
}
