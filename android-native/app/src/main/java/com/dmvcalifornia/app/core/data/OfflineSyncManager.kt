package com.dmvcalifornia.app.core.data

import android.content.Context
import android.content.SharedPreferences
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import com.dmvcalifornia.app.core.model.LeaderboardSubmission
import com.dmvcalifornia.app.core.network.ApiClient
import com.dmvcalifornia.app.core.util.Constants
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class PendingLeaderboardSubmission(
    val id: String,
    val submission: LeaderboardSubmission,
    val createdAt: Long,
    var retryCount: Int = 0
)

@Singleton
class OfflineSyncManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val apiClient: ApiClient,
    private val prefs: SharedPreferences,
    private val json: Json
) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val _isOnline = MutableStateFlow(true)
    val isOnline: StateFlow<Boolean> = _isOnline.asStateFlow()

    private val _pendingSubmissions = MutableStateFlow<List<PendingLeaderboardSubmission>>(emptyList())
    val pendingSubmissions: StateFlow<List<PendingLeaderboardSubmission>> = _pendingSubmissions.asStateFlow()

    private val _isSyncing = MutableStateFlow(false)

    init {
        loadPendingSubmissions()
        startNetworkMonitoring()
    }

    private fun startNetworkMonitoring() {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        connectivityManager.registerNetworkCallback(request, object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                val wasOffline = !_isOnline.value
                _isOnline.value = true
                if (wasOffline) {
                    scope.launch { syncPendingSubmissions() }
                }
            }

            override fun onLost(network: Network) {
                _isOnline.value = false
            }
        })
    }

    suspend fun queueSubmission(submission: LeaderboardSubmission) {
        val pending = PendingLeaderboardSubmission(
            id = java.util.UUID.randomUUID().toString(),
            submission = submission,
            createdAt = System.currentTimeMillis()
        )

        if (_isOnline.value) {
            val success = submitToLeaderboard(pending)
            if (!success) addToPendingQueue(pending)
        } else {
            addToPendingQueue(pending)
        }
    }

    private fun addToPendingQueue(pending: PendingLeaderboardSubmission) {
        _pendingSubmissions.value = _pendingSubmissions.value + pending
        savePendingSubmissions()
    }

    suspend fun syncPendingSubmissions() {
        if (!_isOnline.value || _pendingSubmissions.value.isEmpty() || _isSyncing.value) return
        _isSyncing.value = true

        val failed = mutableListOf<PendingLeaderboardSubmission>()
        for (submission in _pendingSubmissions.value) {
            val success = submitToLeaderboard(submission)
            if (!success) {
                val updated = submission.copy(retryCount = submission.retryCount + 1)
                if (updated.retryCount < 3) failed.add(updated)
            }
        }

        _pendingSubmissions.value = failed
        savePendingSubmissions()
        _isSyncing.value = false
    }

    private suspend fun submitToLeaderboard(pending: PendingLeaderboardSubmission): Boolean {
        return try {
            apiClient.submitScore(pending.submission)
            true
        } catch (_: Exception) {
            false
        }
    }

    private fun loadPendingSubmissions() {
        val data = prefs.getString(Constants.Storage.PENDING_SUBMISSIONS, null) ?: return
        try {
            _pendingSubmissions.value = json.decodeFromString(
                ListSerializer(PendingLeaderboardSubmission.serializer()), data
            )
        } catch (_: Exception) {}
    }

    private fun savePendingSubmissions() {
        val data = json.encodeToString(
            ListSerializer(PendingLeaderboardSubmission.serializer()),
            _pendingSubmissions.value
        )
        prefs.edit().putString(Constants.Storage.PENDING_SUBMISSIONS, data).apply()
    }
}
