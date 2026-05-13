package com.dmvcalifornia.app.feature.bookmark

import androidx.lifecycle.ViewModel
import com.dmvcalifornia.app.core.data.StorageManager
import com.dmvcalifornia.app.core.model.BookmarkedQuestion
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class BookmarksViewModel @Inject constructor(
    private val storageManager: StorageManager
) : ViewModel() {

    private val _bookmarks = MutableStateFlow<List<BookmarkedQuestion>>(emptyList())
    val bookmarks: StateFlow<List<BookmarkedQuestion>> = _bookmarks.asStateFlow()

    init {
        loadBookmarks()
    }

    private fun loadBookmarks() {
        _bookmarks.value = storageManager.getBookmarks()
    }

    fun removeBookmark(bookmark: BookmarkedQuestion) {
        storageManager.removeBookmark(bookmark.questionId, bookmark.quizId)
        loadBookmarks()
    }
}
