package com.dmvcalifornia.app.feature.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dmvcalifornia.app.core.data.QuizDataSource
import com.dmvcalifornia.app.core.data.StorageManager
import com.dmvcalifornia.app.core.model.*
import com.dmvcalifornia.app.core.util.Constants
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class QuizUiState {
    data object Loading : QuizUiState()
    data class Error(val message: String) : QuizUiState()
    data class Active(
        val quiz: Quiz,
        val questions: List<Question>,
        val currentIndex: Int,
        val totalQuestions: Int,
        val selectedAnswer: Int?,
        val isAnswerChecked: Boolean,
        val remainingSeconds: Int?,
        val userAnswers: List<Int?>,
        val answeredCorrectly: List<Boolean?>
    ) : QuizUiState() {
        val currentQuestion: Question get() = questions[currentIndex]
    }
}

@HiltViewModel
class QuizDetailViewModel @Inject constructor(
    private val quizDataSource: QuizDataSource,
    private val storageManager: StorageManager
) : ViewModel() {

    private val _uiState = MutableStateFlow<QuizUiState>(QuizUiState.Loading)
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null
    private var quiz: Quiz? = null
    private var questions: List<Question> = emptyList()
    private var currentIndex = 0
    private var selectedAnswer: Int? = null
    private var isAnswerChecked = false
    private var remainingSeconds: Int? = null
    private var userAnswers: MutableList<Int?> = mutableListOf()
    private var answeredCorrectly: MutableList<Boolean?> = mutableListOf()
    private var startTime = System.currentTimeMillis()

    fun loadQuiz(quizId: String) {
        viewModelScope.launch {
            try {
                val loadedQuiz = quizDataSource.getQuizById(quizId)
                    ?: throw IllegalStateException("Quiz not found")
                val loadedQuestions = loadedQuiz.questions
                    ?: throw IllegalStateException("No questions in quiz")

                quiz = loadedQuiz
                questions = loadedQuestions
                userAnswers = MutableList(loadedQuestions.size) { null }
                answeredCorrectly = MutableList(loadedQuestions.size) { null }
                startTime = System.currentTimeMillis()

                // Setup timer if quiz has time limit
                loadedQuiz.timeLimit?.let { minutes ->
                    remainingSeconds = (minutes * 60).toInt()
                    startTimer()
                }

                updateState()
            } catch (e: Exception) {
                _uiState.value = QuizUiState.Error(e.message ?: "Unknown error")
            }
        }
    }

    private fun startTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (remainingSeconds != null && remainingSeconds!! > 0) {
                delay(1000)
                remainingSeconds = remainingSeconds!! - 1
                updateState()
                if (remainingSeconds == 0) {
                    // Time's up — auto-finish
                    break
                }
            }
        }
    }

    fun selectAnswer(index: Int) {
        if (isAnswerChecked) return
        selectedAnswer = index
        updateState()
    }

    fun checkAnswer() {
        val answer = selectedAnswer ?: return
        val question = questions[currentIndex]
        val isCorrect = answer == question.correctAnswer

        userAnswers[currentIndex] = answer
        answeredCorrectly[currentIndex] = isCorrect
        isAnswerChecked = true

        // Save progress
        saveProgress()
        updateState()
    }

    fun nextQuestion() {
        if (currentIndex < questions.size - 1) {
            currentIndex++
            selectedAnswer = userAnswers[currentIndex]
            isAnswerChecked = userAnswers[currentIndex] != null
            updateState()
        }
    }

    fun finishQuiz(): QuizResult {
        timerJob?.cancel()
        val q = quiz ?: return QuizResult(0, 0, 0.0, passed = false)

        val correctCount = answeredCorrectly.count { it == true }
        val total = questions.size
        val percentage = if (total > 0) correctCount.toDouble() / total * 100.0 else 0.0
        val elapsedSeconds = ((System.currentTimeMillis() - startTime) / 1000).toInt()

        val wrongAnswersList = questions.mapIndexedNotNull { index, question ->
            val userAnswer = userAnswers[index]
            if (userAnswer != null && userAnswer != question.correctAnswer) {
                WrongAnswer(
                    questionId = question.id,
                    question = question.question,
                    selectedAnswer = userAnswer,
                    correctAnswer = question.correctAnswer,
                    category = question.category
                )
            } else null
        }

        // Save to history
        val attempt = QuizAttempt(
            quizId = q.id,
            quizTitle = q.title,
            score = correctCount,
            totalQuestions = total,
            percentage = percentage,
            wrongAnswers = wrongAnswersList
        )
        storageManager.saveQuizResult(attempt)
        storageManager.updateStreak()
        storageManager.clearQuizProgress()

        return QuizResult(
            score = correctCount,
            totalQuestions = total,
            percentage = percentage,
            passingScore = q.passingScore ?: Constants.Quiz.PASSING_SCORE,
            wrongAnswers = wrongAnswersList,
            elapsedSeconds = elapsedSeconds,
            timeLimitSeconds = q.timeLimit?.let { (it * 60).toInt() }
        )
    }

    private fun saveProgress() {
        val q = quiz ?: return
        val progress = QuizProgress(
            quizId = q.id,
            quizTitle = q.title,
            currentQuestionIndex = currentIndex,
            userAnswers = userAnswers.toList(),
            answeredCorrectly = answeredCorrectly.toList(),
            bookmarkedQuestions = emptyList(),
            startTime = startTime,
            remainingSeconds = remainingSeconds
        )
        storageManager.saveQuizProgress(progress)
    }

    private fun updateState() {
        val q = quiz ?: return
        _uiState.value = QuizUiState.Active(
            quiz = q,
            questions = questions,
            currentIndex = currentIndex,
            totalQuestions = questions.size,
            selectedAnswer = selectedAnswer,
            isAnswerChecked = isAnswerChecked,
            remainingSeconds = remainingSeconds,
            userAnswers = userAnswers.toList(),
            answeredCorrectly = answeredCorrectly.toList()
        )
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
    }
}
