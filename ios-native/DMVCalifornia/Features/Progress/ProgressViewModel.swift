import Foundation

@MainActor
final class ProgressViewModel: ObservableObject {
    @Published var streak = StudyStreak()
    @Published var stats = OverallStats()
    @Published var scoreHistory: [ScoreHistoryEntry] = []
    @Published var weakAreas: [WeakArea] = []
    @Published var bookmarks: [BookmarkedQuestion] = []
    @Published var recentActivity: [QuizAttempt] = []
    @Published var isLoading = false

    private let storageService: StorageServiceProtocol

    init(storageService: StorageServiceProtocol = StorageService.shared) {
        self.storageService = storageService
    }

    func loadData() async {
        isLoading = true

        // Load all data concurrently
        async let streakTask = storageService.getStreak()
        async let statsTask = storageService.getOverallStats()
        async let historyTask = storageService.getScoreHistory(limit: 10)
        async let weakAreasTask = storageService.getWeakAreas()
        async let bookmarksTask = storageService.getBookmarks()
        async let activityTask = storageService.getRecentActivity(limit: 5)

        (streak, stats, scoreHistory, weakAreas, bookmarks, recentActivity) = await (
            streakTask, statsTask, historyTask, weakAreasTask, bookmarksTask, activityTask
        )

        isLoading = false
    }
}
