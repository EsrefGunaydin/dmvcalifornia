package com.dmvcalifornia.app.feature.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dmvcalifornia.app.core.data.QuizDataSource
import com.dmvcalifornia.app.core.data.StorageManager
import com.dmvcalifornia.app.core.model.Quiz
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class QuizzesViewModel @Inject constructor(
    private val quizDataSource: QuizDataSource,
    private val storageManager: StorageManager
) : ViewModel() {

    private val _allQuizzes = MutableStateFlow<List<Quiz>>(emptyList())
    private val _selectedLanguage = MutableStateFlow("English")
    val selectedLanguage: StateFlow<String> = _selectedLanguage.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    @OptIn(FlowPreview::class)
    val filteredQuizzes: StateFlow<List<Quiz>> = combine(
        _allQuizzes,
        _selectedLanguage,
        _searchQuery.debounce(300)
    ) { quizzes, language, query ->
        val languageFiltered = when (language) {
            "English" -> quizDataSource.getQuizzes()
            "Spanish" -> quizDataSource.getSpanishQuizzes()
            "Turkish" -> quizDataSource.getTurkishQuizzes()
            "Chinese" -> quizDataSource.getChineseQuizzes()
            else -> quizzes
        }
        if (query.isBlank()) languageFiltered
        else languageFiltered.filter {
            it.title.contains(query, ignoreCase = true) ||
                it.description.contains(query, ignoreCase = true)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        loadQuizzes()
    }

    private fun loadQuizzes() {
        viewModelScope.launch {
            _allQuizzes.value = quizDataSource.getQuizzes()
        }
    }

    fun onLanguageSelected(language: String) {
        _selectedLanguage.value = language
    }

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    fun getBestScore(quizId: String): Double? {
        return storageManager.getQuizBestScore(quizId)
    }
}
