import Foundation

@MainActor
final class QuizResultsViewModel: ObservableObject {
    @Published var name = ""
    @Published var email = ""
    @Published var isSubmitting = false
    @Published var hasSubmitted = false
    @Published var submitMessage: String?
    @Published var error: Error?
    @Published var leaderboardRank: Int? = nil
    @Published var showTrophyCelebration = false
    @Published var topLeaderboardEntries: [LeaderboardEntry] = []
    @Published var totalLeaderboardEntries: Int = 0

    private let offlineSyncManager: OfflineSyncManager
    private let interstitialAdManager: InterstitialAdManager
    private let apiClient: APIClientProtocol

    init(
        offlineSyncManager: OfflineSyncManager = OfflineSyncManager.shared,
        interstitialAdManager: InterstitialAdManager = InterstitialAdManager.shared,
        apiClient: APIClientProtocol = APIClient.shared
    ) {
        self.offlineSyncManager = offlineSyncManager
        self.interstitialAdManager = interstitialAdManager
        self.apiClient = apiClient
    }

    var isOnline: Bool {
        offlineSyncManager.isOnline
    }

    var hasPendingSubmissions: Bool {
        !offlineSyncManager.pendingSubmissions.isEmpty
    }

    var isTopTen: Bool {
        if let rank = leaderboardRank {
            return rank <= 10
        }
        return false
    }

    func submitScore(quizId: String, score: Int, percentage: Double) async {
        guard !name.isEmpty else { return }

        isSubmitting = true
        error = nil
        submitMessage = nil
        leaderboardRank = nil

        let submission = LeaderboardSubmission(
            quizId: quizId,
            name: name,
            email: email.isEmpty ? nil : email,
            points: score,
            percentage: percentage
        )

        // Use offline sync manager to handle submission
        await offlineSyncManager.queueSubmission(submission)

        if offlineSyncManager.isOnline {
            hasSubmitted = true
            submitMessage = "Score submitted successfully!"

            // Check leaderboard ranking
            await checkLeaderboardRanking(quizId: quizId, userName: name)

            // Show interstitial ad after successful submission
            interstitialAdManager.showAd()
        } else {
            hasSubmitted = true
            submitMessage = "Score saved! Will be submitted when you're back online."
        }

        isSubmitting = false
    }

    private func checkLeaderboardRanking(quizId: String, userName: String) async {
        do {
            let result = try await apiClient.getLeaderboard(quizId: quizId)
            let normalizedUserName = userName.lowercased().trimmingCharacters(in: .whitespaces)

            // Store top 5 entries for display
            topLeaderboardEntries = Array(result.entries.prefix(5))
            totalLeaderboardEntries = result.entries.count

            // Find user's rank in the leaderboard
            for (index, entry) in result.entries.enumerated() {
                let entryName = entry.name.lowercased().trimmingCharacters(in: .whitespaces)
                if entryName == normalizedUserName {
                    leaderboardRank = index + 1 // 1-based rank
                    break
                }
            }

            // Trigger trophy celebration if in top 10
            if isTopTen {
                // Small delay to let the UI update first
                try? await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds
                showTrophyCelebration = true
            }
        } catch {
            // Silently fail - ranking check is not critical
            print("Failed to check leaderboard ranking: \(error)")
        }
    }
}
