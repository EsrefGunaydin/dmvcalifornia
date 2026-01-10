import AppIntents
import Foundation

// MARK: - Start Practice Test Intent

struct StartPracticeTestIntent: AppIntent {
    static var title: LocalizedStringResource = "Start DMV Practice Test"
    static var description = IntentDescription("Opens a random DMV practice test")

    static var openAppWhenRun: Bool = true

    @MainActor
    func perform() async throws -> some IntentResult & OpensIntent {
        // This will open the app - the app will handle starting a random quiz
        UserDefaults.standard.set(true, forKey: "startRandomQuiz")
        return .result()
    }
}

// MARK: - Check Progress Intent

struct CheckProgressIntent: AppIntent {
    static var title: LocalizedStringResource = "Check DMV Progress"
    static var description = IntentDescription("Shows your current study streak and statistics")

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        // Load shared widget data for stats
        let data = loadProgressData()

        let streakText = data.streak == 1 ? "1 day" : "\(data.streak) days"
        let responseText: String

        if data.totalQuizzes == 0 {
            responseText = "You haven't taken any DMV practice tests yet. Your study streak is \(streakText). Start practicing to track your progress!"
        } else {
            responseText = "Your current study streak is \(streakText). You've completed \(data.totalQuizzes) quizzes with an average score of \(Int(data.averageScore))%. Keep up the great work!"
        }

        return .result(dialog: IntentDialog(stringLiteral: responseText))
    }

    private func loadProgressData() -> (streak: Int, totalQuizzes: Int, averageScore: Double) {
        let appGroupIdentifier = "group.us.dmvcalifornia.app"
        let dataKey = "widgetData"

        guard let userDefaults = UserDefaults(suiteName: appGroupIdentifier),
              let data = userDefaults.data(forKey: dataKey) else {
            return (0, 0, 0)
        }

        do {
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601

            struct SharedData: Codable {
                let currentStreak: Int
                let totalQuizzes: Int
                let averageScore: Double
            }

            let sharedData = try decoder.decode(SharedData.self, from: data)
            return (sharedData.currentStreak, sharedData.totalQuizzes, sharedData.averageScore)
        } catch {
            return (0, 0, 0)
        }
    }
}

// MARK: - Get Last Score Intent

struct GetLastScoreIntent: AppIntent {
    static var title: LocalizedStringResource = "Get Last DMV Score"
    static var description = IntentDescription("Tells you your most recent quiz score")

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let (score, title) = loadLastScore()

        let responseText: String
        if let score = score, let title = title {
            let passed = score >= 83
            let emoji = passed ? "Congratulations!" : "Keep practicing!"
            responseText = "Your last quiz was \"\(title)\" with a score of \(score)%. \(emoji)"
        } else {
            responseText = "You haven't completed any DMV practice tests yet. Start a test to track your scores!"
        }

        return .result(dialog: IntentDialog(stringLiteral: responseText))
    }

    private func loadLastScore() -> (Int?, String?) {
        let appGroupIdentifier = "group.us.dmvcalifornia.app"
        let dataKey = "widgetData"

        guard let userDefaults = UserDefaults(suiteName: appGroupIdentifier),
              let data = userDefaults.data(forKey: dataKey) else {
            return (nil, nil)
        }

        do {
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601

            struct SharedData: Codable {
                let lastScore: Int?
                let lastQuizTitle: String?
            }

            let sharedData = try decoder.decode(SharedData.self, from: data)
            return (sharedData.lastScore, sharedData.lastQuizTitle)
        } catch {
            return (nil, nil)
        }
    }
}

// MARK: - App Shortcuts Provider

struct DMVAppShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: StartPracticeTestIntent(),
            phrases: [
                "Start \(.applicationName) practice test",
                "Start DMV practice test",
                "Open \(.applicationName) quiz",
                "Practice for DMV test",
                "Help me study for DMV"
            ],
            shortTitle: "Start Practice Test",
            systemImageName: "doc.text"
        )

        AppShortcut(
            intent: CheckProgressIntent(),
            phrases: [
                "Check my \(.applicationName) progress",
                "Check my DMV progress",
                "What's my \(.applicationName) streak",
                "How am I doing on DMV practice",
                "Show my DMV study stats"
            ],
            shortTitle: "Check Progress",
            systemImageName: "chart.line.uptrend.xyaxis"
        )

        AppShortcut(
            intent: GetLastScoreIntent(),
            phrases: [
                "What was my last \(.applicationName) score",
                "What was my last DMV score",
                "Tell me my latest quiz score",
                "How did I do on my last DMV test"
            ],
            shortTitle: "Get Last Score",
            systemImageName: "number"
        )
    }
}
