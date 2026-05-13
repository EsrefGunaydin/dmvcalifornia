package com.dmvcalifornia.app.feature.progress

import androidx.lifecycle.ViewModel
import com.dmvcalifornia.app.core.data.StorageManager
import com.dmvcalifornia.app.core.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class ProgressViewModel @Inject constructor(
    private val storageManager: StorageManager
) : ViewModel() {

    private val _streak = MutableStateFlow(StudyStreak())
    val streak: StateFlow<StudyStreak> = _streak.asStateFlow()

    private val _stats = MutableStateFlow(OverallStats())
    val stats: StateFlow<OverallStats> = _stats.asStateFlow()

    private val _weakAreas = MutableStateFlow<List<WeakArea>>(emptyList())
    val weakAreas: StateFlow<List<WeakArea>> = _weakAreas.asStateFlow()

    private val _recentActivity = MutableStateFlow<List<QuizAttempt>>(emptyList())
    val recentActivity: StateFlow<List<QuizAttempt>> = _recentActivity.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        _streak.value = storageManager.getStreak()
        _stats.value = storageManager.getOverallStats()
        _weakAreas.value = storageManager.getWeakAreas()
        _recentActivity.value = storageManager.getRecentActivity()
    }
}
