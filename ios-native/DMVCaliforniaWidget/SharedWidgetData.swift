import Foundation

// MARK: - Shared Widget Data

/// Data shared between the main app and widget via App Groups
struct SharedWidgetData: Codable {
    let currentStreak: Int
    let longestStreak: Int
    let lastScore: Int?
    let lastQuizTitle: String?
    let recentScores: [Int]
    let totalQuizzes: Int
    let averageScore: Double
    let lastUpdated: Date

    // MARK: - App Group Identifier

    static let appGroupIdentifier = "group.us.dmvcalifornia.app"
    static let dataKey = "widgetData"

    // MARK: - Default Values

    static let empty = SharedWidgetData(
        currentStreak: 0,
        longestStreak: 0,
        lastScore: nil,
        lastQuizTitle: nil,
        recentScores: [],
        totalQuizzes: 0,
        averageScore: 0,
        lastUpdated: Date()
    )

    // MARK: - Load from App Group

    static func load() -> SharedWidgetData {
        guard let userDefaults = UserDefaults(suiteName: appGroupIdentifier),
              let data = userDefaults.data(forKey: dataKey) else {
            return .empty
        }

        do {
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601
            return try decoder.decode(SharedWidgetData.self, from: data)
        } catch {
            print("[SharedWidgetData] Failed to decode: \(error)")
            return .empty
        }
    }

    // MARK: - Save to App Group

    func save() {
        guard let userDefaults = UserDefaults(suiteName: Self.appGroupIdentifier) else {
            print("[SharedWidgetData] Failed to access App Group")
            return
        }

        do {
            let encoder = JSONEncoder()
            encoder.dateEncodingStrategy = .iso8601
            let data = try encoder.encode(self)
            userDefaults.set(data, forKey: Self.dataKey)
            userDefaults.synchronize()
            print("[SharedWidgetData] Saved successfully")
        } catch {
            print("[SharedWidgetData] Failed to encode: \(error)")
        }
    }
}
