package com.dmvcalifornia.app.feature.home

import androidx.lifecycle.ViewModel
import com.dmvcalifornia.app.core.data.StorageManager
import com.dmvcalifornia.app.core.model.OverallStats
import com.dmvcalifornia.app.core.model.StudyStreak
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val storageManager: StorageManager
) : ViewModel() {

    private val _streak = MutableStateFlow(StudyStreak())
    val streak: StateFlow<StudyStreak> = _streak.asStateFlow()

    private val _stats = MutableStateFlow(OverallStats())
    val stats: StateFlow<OverallStats> = _stats.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        _streak.value = storageManager.getStreak()
        _stats.value = storageManager.getOverallStats()
    }

    fun refresh() {
        loadData()
    }
}
