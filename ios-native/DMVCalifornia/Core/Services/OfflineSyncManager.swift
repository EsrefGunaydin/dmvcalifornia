import Foundation
import Network
import Combine

// MARK: - Offline Sync Manager

/// Manages offline data sync, particularly for leaderboard submissions
@MainActor
final class OfflineSyncManager: ObservableObject {
    static let shared = OfflineSyncManager()

    @Published private(set) var isOnline = true
    @Published private(set) var pendingSubmissions: [PendingLeaderboardSubmission] = []
    @Published private(set) var isSyncing = false

    private let networkMonitor = NWPathMonitor()
    private let monitorQueue = DispatchQueue(label: "OfflineSyncMonitor")
    private let defaults = UserDefaults.standard
    private let pendingSubmissionsKey = "pendingLeaderboardSubmissions"

    private let apiClient: APIClientProtocol
    private var cancellables = Set<AnyCancellable>()

    init(apiClient: APIClientProtocol = APIClient.shared) {
        self.apiClient = apiClient
        loadPendingSubmissions()
        startNetworkMonitoring()
    }

    deinit {
        networkMonitor.cancel()
    }

    // MARK: - Network Monitoring

    private func startNetworkMonitoring() {
        networkMonitor.pathUpdateHandler = { [weak self] path in
            Task { @MainActor [weak self] in
                let wasOffline = self?.isOnline == false
                self?.isOnline = path.status == .satisfied

                // If we just came online and have pending submissions, sync
                if wasOffline && self?.isOnline == true {
                    await self?.syncPendingSubmissions()
                }
            }
        }
        networkMonitor.start(queue: monitorQueue)
    }

    // MARK: - Queue Submission

    /// Queues a leaderboard submission for later sync if offline
    func queueSubmission(_ submission: LeaderboardSubmission) async {
        let pending = PendingLeaderboardSubmission(
            id: UUID().uuidString,
            submission: submission,
            createdAt: Date(),
            retryCount: 0
        )

        if isOnline {
            // Try to submit immediately
            let success = await submitToLeaderboard(pending)
            if !success {
                // If failed, add to pending queue
                addToPendingQueue(pending)
            }
        } else {
            // Offline - add to queue
            addToPendingQueue(pending)
            print("[OfflineSyncManager] Queued submission for later (offline)")
        }
    }

    private func addToPendingQueue(_ pending: PendingLeaderboardSubmission) {
        pendingSubmissions.append(pending)
        savePendingSubmissions()
    }

    // MARK: - Sync Pending Submissions

    /// Attempts to sync all pending submissions
    func syncPendingSubmissions() async {
        guard isOnline, !pendingSubmissions.isEmpty, !isSyncing else { return }

        isSyncing = true
        print("[OfflineSyncManager] Syncing \(pendingSubmissions.count) pending submissions...")

        var successfulIds: [String] = []
        var failedSubmissions: [PendingLeaderboardSubmission] = []

        for submission in pendingSubmissions {
            let success = await submitToLeaderboard(submission)
            if success {
                successfulIds.append(submission.id)
            } else {
                // Increment retry count
                var updatedSubmission = submission
                updatedSubmission.retryCount += 1

                // Only keep if retry count is under limit
                if updatedSubmission.retryCount < 3 {
                    failedSubmissions.append(updatedSubmission)
                } else {
                    print("[OfflineSyncManager] Dropping submission after 3 failed attempts")
                }
            }
        }

        // Update pending submissions
        pendingSubmissions = failedSubmissions
        savePendingSubmissions()

        isSyncing = false
        print("[OfflineSyncManager] Sync complete. \(successfulIds.count) succeeded, \(failedSubmissions.count) pending")
    }

    private func submitToLeaderboard(_ pending: PendingLeaderboardSubmission) async -> Bool {
        do {
            _ = try await apiClient.submitScore(pending.submission)
            print("[OfflineSyncManager] Successfully submitted score for quiz \(pending.submission.quizId)")
            return true
        } catch {
            print("[OfflineSyncManager] Failed to submit: \(error.localizedDescription)")
            return false
        }
    }

    // MARK: - Persistence

    private func loadPendingSubmissions() {
        guard let data = defaults.data(forKey: pendingSubmissionsKey),
              let submissions = try? JSONDecoder().decode([PendingLeaderboardSubmission].self, from: data) else {
            pendingSubmissions = []
            return
        }
        pendingSubmissions = submissions
    }

    private func savePendingSubmissions() {
        guard let data = try? JSONEncoder().encode(pendingSubmissions) else { return }
        defaults.set(data, forKey: pendingSubmissionsKey)
    }

    // MARK: - Clear Queue

    func clearPendingSubmissions() {
        pendingSubmissions = []
        defaults.removeObject(forKey: pendingSubmissionsKey)
    }
}

// MARK: - Pending Submission Model

struct PendingLeaderboardSubmission: Codable, Identifiable {
    let id: String
    let submission: LeaderboardSubmission
    let createdAt: Date
    var retryCount: Int
}
