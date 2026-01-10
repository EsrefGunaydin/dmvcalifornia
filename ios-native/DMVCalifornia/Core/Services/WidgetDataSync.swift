import Foundation
import WidgetKit

// MARK: - Widget Data Sync

/// Syncs data between the main app and widgets via App Groups
@MainActor
final class WidgetDataSync {
    static let shared = WidgetDataSync()

    private let appGroupIdentifier = "group.com.esref.dmvcalifornia"
    private let dataKey = "widgetData"

    private init() {}

    // MARK: - Sync Widget Data

    /// Updates widget data from current app state
    func syncWidgetData(
        streak: StudyStreak,
        stats: OverallStats,
        recentAttempts: [QuizAttempt]
    ) {
        guard let userDefaults = UserDefaults(suiteName: appGroupIdentifier) else {
            print("[WidgetDataSync] Failed to access App Group")
            return
        }

        // Get recent scores (last 5)
        let recentScores = recentAttempts
            .prefix(5)
            .map { Int($0.percentage) }

        // Get last quiz info
        let lastAttempt = recentAttempts.first
        let lastScore = lastAttempt.map { Int($0.percentage) }
        let lastQuizTitle = lastAttempt?.quizTitle

        // Create shared data
        let sharedData = SharedWidgetDataModel(
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastScore: lastScore,
            lastQuizTitle: lastQuizTitle,
            recentScores: recentScores,
            totalQuizzes: stats.totalQuizzes,
            averageScore: stats.averageScore,
            lastUpdated: Date()
        )

        // Save to App Group
        do {
            let encoder = JSONEncoder()
            encoder.dateEncodingStrategy = .iso8601
            let data = try encoder.encode(sharedData)
            userDefaults.set(data, forKey: dataKey)
            userDefaults.synchronize()

            // Reload all widgets
            WidgetCenter.shared.reloadAllTimelines()

            print("[WidgetDataSync] Synced successfully")
        } catch {
            print("[WidgetDataSync] Failed to encode: \(error)")
        }
    }

    /// Force reload all widgets
    func reloadWidgets() {
        WidgetCenter.shared.reloadAllTimelines()
    }
}

// MARK: - Shared Widget Data Model (App Side)

struct SharedWidgetDataModel: Codable {
    let currentStreak: Int
    let longestStreak: Int
    let lastScore: Int?
    let lastQuizTitle: String?
    let recentScores: [Int]
    let totalQuizzes: Int
    let averageScore: Double
    let lastUpdated: Date
}
