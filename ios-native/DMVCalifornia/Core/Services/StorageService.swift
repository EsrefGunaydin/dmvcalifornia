import Foundation
import Combine

// MARK: - Storage Service Protocol

protocol StorageServiceProtocol {
    // Quiz History
    func saveQuizResult(_ attempt: QuizAttempt) async throws
    func getQuizHistory() async -> [QuizAttempt]
    func getQuizBestScore(quizId: String) async -> Double?
    func getOverallStats() async -> OverallStats
    func getScoreHistory(limit: Int) async -> [ScoreHistoryEntry]
    func getRecentActivity(limit: Int) async -> [QuizAttempt]

    // Bookmarks
    func saveBookmark(_ bookmark: BookmarkedQuestion) async throws
    func removeBookmark(questionId: Int, quizId: String) async throws
    func getBookmarks() async -> [BookmarkedQuestion]
    func isBookmarked(questionId: Int, quizId: String) async -> Bool

    // Streak
    func getStreak() async -> StudyStreak
    func updateStreak() async throws -> StudyStreak

    // Weak Areas
    func getWeakAreas() async -> [WeakArea]

    // Quiz Progress (Resume)
    func saveQuizProgress(_ progress: QuizProgress) async throws
    func getQuizProgress() async -> QuizProgress?
    func clearQuizProgress() async

    // Clear Data
    func clearAllData() async throws
}

// MARK: - Storage Service Implementation

final class StorageService: StorageServiceProtocol {
    private let defaults: UserDefaults
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    // MARK: - Quiz History

    func saveQuizResult(_ attempt: QuizAttempt) async throws {
        var history = await getQuizHistory()
        history.insert(attempt, at: 0)

        // Keep only last N entries
        if history.count > Constants.Quiz.maxHistoryEntries {
            history = Array(history.prefix(Constants.Quiz.maxHistoryEntries))
        }

        let data = try encoder.encode(history)
        defaults.set(data, forKey: Constants.Storage.quizHistory)

        // Update streak
        let streak = try await updateStreak()

        // Sync widget data
        await syncWidgetData(history: history, streak: streak)
    }

    // MARK: - Widget Sync

    @MainActor
    private func syncWidgetData(history: [QuizAttempt], streak: StudyStreak) {
        let stats = calculateStats(from: history)
        WidgetDataSync.shared.syncWidgetData(
            streak: streak,
            stats: stats,
            recentAttempts: Array(history.prefix(5))
        )
    }

    private func calculateStats(from history: [QuizAttempt]) -> OverallStats {
        guard !history.isEmpty else {
            return OverallStats()
        }

        let totalQuizzes = history.count
        let totalQuestions = history.reduce(0) { $0 + $1.totalQuestions }
        let averageScore = history.reduce(0.0) { $0 + $1.percentage } / Double(totalQuizzes)
        let bestScore = history.map { $0.percentage }.max() ?? 0

        return OverallStats(
            totalQuizzes: totalQuizzes,
            totalQuestions: totalQuestions,
            averageScore: averageScore,
            bestScore: bestScore
        )
    }

    func getQuizHistory() async -> [QuizAttempt] {
        guard let data = defaults.data(forKey: Constants.Storage.quizHistory),
              let history = try? decoder.decode([QuizAttempt].self, from: data) else {
            return []
        }
        return history
    }

    func getQuizBestScore(quizId: String) async -> Double? {
        let history = await getQuizHistory()
        return history
            .filter { $0.quizId == quizId }
            .map { $0.percentage }
            .max()
    }

    func getOverallStats() async -> OverallStats {
        let history = await getQuizHistory()

        guard !history.isEmpty else {
            return OverallStats()
        }

        let totalQuizzes = history.count
        let totalQuestions = history.reduce(0) { $0 + $1.totalQuestions }
        let averageScore = history.reduce(0.0) { $0 + $1.percentage } / Double(totalQuizzes)
        let bestScore = history.map { $0.percentage }.max() ?? 0

        return OverallStats(
            totalQuizzes: totalQuizzes,
            totalQuestions: totalQuestions,
            averageScore: averageScore,
            bestScore: bestScore
        )
    }

    func getScoreHistory(limit: Int = 10) async -> [ScoreHistoryEntry] {
        let history = await getQuizHistory()
        return Array(history.prefix(limit)).reversed().map { attempt in
            ScoreHistoryEntry(
                date: attempt.completedAt,
                percentage: attempt.percentage,
                quizTitle: attempt.quizTitle
            )
        }
    }

    func getRecentActivity(limit: Int = 5) async -> [QuizAttempt] {
        let history = await getQuizHistory()
        return Array(history.prefix(limit))
    }

    // MARK: - Bookmarks

    func saveBookmark(_ bookmark: BookmarkedQuestion) async throws {
        var bookmarks = await getBookmarks()

        // Check if already bookmarked
        if bookmarks.contains(where: { $0.questionId == bookmark.questionId && $0.quizId == bookmark.quizId }) {
            return
        }

        bookmarks.insert(bookmark, at: 0)
        let data = try encoder.encode(bookmarks)
        defaults.set(data, forKey: Constants.Storage.bookmarks)
    }

    func removeBookmark(questionId: Int, quizId: String) async throws {
        var bookmarks = await getBookmarks()
        bookmarks.removeAll { $0.questionId == questionId && $0.quizId == quizId }
        let data = try encoder.encode(bookmarks)
        defaults.set(data, forKey: Constants.Storage.bookmarks)
    }

    func getBookmarks() async -> [BookmarkedQuestion] {
        guard let data = defaults.data(forKey: Constants.Storage.bookmarks),
              let bookmarks = try? decoder.decode([BookmarkedQuestion].self, from: data) else {
            return []
        }
        return bookmarks
    }

    func isBookmarked(questionId: Int, quizId: String) async -> Bool {
        let bookmarks = await getBookmarks()
        return bookmarks.contains { $0.questionId == questionId && $0.quizId == quizId }
    }

    // MARK: - Streak

    func getStreak() async -> StudyStreak {
        guard let data = defaults.data(forKey: Constants.Storage.streak),
              let streak = try? decoder.decode(StudyStreak.self, from: data) else {
            return StudyStreak()
        }
        return streak
    }

    func updateStreak() async throws -> StudyStreak {
        var streak = await getStreak()
        let today = formatDate(Date())

        // If already studied today, return current streak
        if streak.lastStudyDate == today {
            return streak
        }

        let yesterday = formatDate(Calendar.current.date(byAdding: .day, value: -1, to: Date())!)

        if streak.lastStudyDate == yesterday {
            // Consecutive day - increment streak
            streak.currentStreak += 1
        } else if streak.lastStudyDate.isEmpty || streak.lastStudyDate != today {
            // Streak broken - reset to 1
            streak.currentStreak = 1
        }

        // Update longest streak
        if streak.currentStreak > streak.longestStreak {
            streak.longestStreak = streak.currentStreak
        }

        // Update last study date and total days
        streak.lastStudyDate = today
        streak.totalDaysStudied += 1

        // Save streak
        let data = try encoder.encode(streak)
        defaults.set(data, forKey: Constants.Storage.streak)

        return streak
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }

    // MARK: - Weak Areas

    func getWeakAreas() async -> [WeakArea] {
        let history = await getQuizHistory()

        // Collect all wrong answers by category
        var categoryWrong: [String: Int] = [:]
        var categoryTotal: [String: Int] = [:]

        for attempt in history {
            for wrong in attempt.wrongAnswers {
                let category = wrong.category ?? "General"
                categoryWrong[category, default: 0] += 1
                categoryTotal[category, default: 0] += 1
            }
        }

        // Create weak areas (only include categories with 2+ wrong answers)
        return categoryWrong
            .filter { $0.value >= 2 }
            .map { category, wrongCount in
                WeakArea(
                    category: category,
                    wrongCount: wrongCount,
                    totalCount: categoryTotal[category] ?? wrongCount
                )
            }
            .sorted { $0.wrongCount > $1.wrongCount }
    }

    // MARK: - Quiz Progress (Resume)

    func saveQuizProgress(_ progress: QuizProgress) async throws {
        let data = try encoder.encode(progress)
        defaults.set(data, forKey: Constants.Storage.quizProgress)
    }

    func getQuizProgress() async -> QuizProgress? {
        guard let data = defaults.data(forKey: Constants.Storage.quizProgress),
              let progress = try? decoder.decode(QuizProgress.self, from: data) else {
            return nil
        }

        // Check if progress is not too old (24 hours max)
        let maxAge: TimeInterval = 24 * 60 * 60
        if Date().timeIntervalSince(progress.savedAt) > maxAge {
            await clearQuizProgress()
            return nil
        }

        return progress
    }

    func clearQuizProgress() async {
        defaults.removeObject(forKey: Constants.Storage.quizProgress)
    }

    // MARK: - Clear Data

    func clearAllData() async throws {
        defaults.removeObject(forKey: Constants.Storage.quizHistory)
        defaults.removeObject(forKey: Constants.Storage.bookmarks)
        defaults.removeObject(forKey: Constants.Storage.streak)
        defaults.removeObject(forKey: Constants.Storage.quizProgress)
    }
}

// MARK: - Shared Instance

extension StorageService {
    static let shared = StorageService()
}
