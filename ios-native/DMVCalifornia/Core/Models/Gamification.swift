import Foundation
import SwiftUI

// MARK: - User Level

struct UserLevel: Codable, Equatable {
    let level: Int
    let title: String
    let minXP: Int
    let maxXP: Int
    let icon: String
    let color: String

    var progress: Double {
        0 // Calculated externally with current XP
    }

    static let levels: [UserLevel] = [
        UserLevel(level: 1, title: "Learner", minXP: 0, maxXP: 100, icon: "leaf.fill", color: "51CF66"),
        UserLevel(level: 2, title: "Student", minXP: 100, maxXP: 250, icon: "book.fill", color: "339AF0"),
        UserLevel(level: 3, title: "Apprentice", minXP: 250, maxXP: 500, icon: "graduationcap.fill", color: "845EF7"),
        UserLevel(level: 4, title: "Scholar", minXP: 500, maxXP: 850, icon: "star.fill", color: "FCC419"),
        UserLevel(level: 5, title: "Expert", minXP: 850, maxXP: 1300, icon: "flame.fill", color: "FF922B"),
        UserLevel(level: 6, title: "Master", minXP: 1300, maxXP: 1900, icon: "bolt.fill", color: "F06595"),
        UserLevel(level: 7, title: "Champion", minXP: 1900, maxXP: 2600, icon: "trophy.fill", color: "FFD700"),
        UserLevel(level: 8, title: "Legend", minXP: 2600, maxXP: 3500, icon: "crown.fill", color: "B9F2FF"),
        UserLevel(level: 9, title: "Road Master", minXP: 3500, maxXP: 5000, icon: "car.fill", color: "FF6B6B"),
        UserLevel(level: 10, title: "DMV Pro", minXP: 5000, maxXP: Int.max, icon: "shield.fill", color: "9B59B6"),
    ]

    static func level(for xp: Int) -> UserLevel {
        levels.last { xp >= $0.minXP } ?? levels[0]
    }

    var gradientColors: [Color] {
        let baseColor = Color(hex: color)
        return [baseColor, baseColor.opacity(0.7)]
    }
}

// MARK: - XP Event

enum XPEvent: Int {
    case quizCompleted = 10
    case quizPassed = 25         // 83%+ score
    case perfectQuiz = 50        // 100% score
    case correctAnswer = 2
    case streakDay = 15
    case streakWeek = 100        // 7-day streak bonus
    case flashcardCompleted = 5
    case flashcardSetMastered = 30
    case firstQuizOfDay = 20
    case achievementUnlocked = 35

    var description: String {
        switch self {
        case .quizCompleted: return "Quiz Completed"
        case .quizPassed: return "Quiz Passed!"
        case .perfectQuiz: return "Perfect Score!"
        case .correctAnswer: return "Correct Answer"
        case .streakDay: return "Daily Streak"
        case .streakWeek: return "Week Streak Bonus"
        case .flashcardCompleted: return "Flashcard Set Done"
        case .flashcardSetMastered: return "Set Mastered"
        case .firstQuizOfDay: return "First Quiz Today"
        case .achievementUnlocked: return "Achievement!"
        }
    }
}

// MARK: - User Progress

struct UserProgress: Codable {
    var totalXP: Int = 0
    var todayXP: Int = 0
    var lastXPDate: String = ""
    var quizzesCompleted: Int = 0
    var quizzesPassed: Int = 0
    var perfectQuizzes: Int = 0
    var correctAnswers: Int = 0
    var flashcardsStudied: Int = 0
    var totalStudyTime: TimeInterval = 0
    var achievements: [String] = []

    var currentLevel: UserLevel {
        UserLevel.level(for: totalXP)
    }

    var levelProgress: Double {
        let level = currentLevel
        if level.maxXP == Int.max { return 1.0 }
        let xpInLevel = totalXP - level.minXP
        let xpNeeded = level.maxXP - level.minXP
        return min(1.0, Double(xpInLevel) / Double(xpNeeded))
    }

    var xpToNextLevel: Int {
        let level = currentLevel
        if level.maxXP == Int.max { return 0 }
        return level.maxXP - totalXP
    }
}

// MARK: - Achievement

struct Achievement: Identifiable, Codable, Equatable {
    let id: String
    let title: String
    let description: String
    let icon: String
    let tier: AchievementTier
    let category: AchievementCategory
    let requirement: Int
    var unlockedAt: Date?

    var isUnlocked: Bool {
        unlockedAt != nil
    }

    enum AchievementTier: String, Codable, CaseIterable {
        case bronze, silver, gold, platinum, diamond

        var color: Color {
            switch self {
            case .bronze: return Color(hex: "CD7F32")
            case .silver: return Color(hex: "C0C0C0")
            case .gold: return Color(hex: "FFD700")
            case .platinum: return Color(hex: "E5E4E2")
            case .diamond: return Color(hex: "B9F2FF")
            }
        }

        var xpBonus: Int {
            switch self {
            case .bronze: return 25
            case .silver: return 50
            case .gold: return 100
            case .platinum: return 200
            case .diamond: return 500
            }
        }
    }

    enum AchievementCategory: String, Codable, CaseIterable {
        case quizzes = "Quizzes"
        case streaks = "Streaks"
        case flashcards = "Flashcards"
        case mastery = "Mastery"
        case special = "Special"
    }

    // MARK: - All Achievements

    static let all: [Achievement] = [
        // Quiz Achievements
        Achievement(id: "first_quiz", title: "First Steps", description: "Complete your first quiz", icon: "flag.fill", tier: .bronze, category: .quizzes, requirement: 1),
        Achievement(id: "quiz_5", title: "Getting Started", description: "Complete 5 quizzes", icon: "doc.text.fill", tier: .bronze, category: .quizzes, requirement: 5),
        Achievement(id: "quiz_25", title: "Quiz Enthusiast", description: "Complete 25 quizzes", icon: "doc.text.fill", tier: .silver, category: .quizzes, requirement: 25),
        Achievement(id: "quiz_100", title: "Quiz Master", description: "Complete 100 quizzes", icon: "doc.text.fill", tier: .gold, category: .quizzes, requirement: 100),
        Achievement(id: "quiz_500", title: "Quiz Legend", description: "Complete 500 quizzes", icon: "doc.text.fill", tier: .diamond, category: .quizzes, requirement: 500),

        // Perfect Score Achievements
        Achievement(id: "perfect_1", title: "Perfectionist", description: "Get a perfect score", icon: "star.fill", tier: .silver, category: .mastery, requirement: 1),
        Achievement(id: "perfect_10", title: "Flawless", description: "Get 10 perfect scores", icon: "star.fill", tier: .gold, category: .mastery, requirement: 10),
        Achievement(id: "perfect_50", title: "Untouchable", description: "Get 50 perfect scores", icon: "star.fill", tier: .platinum, category: .mastery, requirement: 50),

        // Streak Achievements
        Achievement(id: "streak_3", title: "On Fire", description: "Maintain a 3-day streak", icon: "flame.fill", tier: .bronze, category: .streaks, requirement: 3),
        Achievement(id: "streak_7", title: "Week Warrior", description: "Maintain a 7-day streak", icon: "flame.fill", tier: .silver, category: .streaks, requirement: 7),
        Achievement(id: "streak_30", title: "Monthly Master", description: "Maintain a 30-day streak", icon: "flame.fill", tier: .gold, category: .streaks, requirement: 30),
        Achievement(id: "streak_100", title: "Unstoppable", description: "Maintain a 100-day streak", icon: "flame.fill", tier: .diamond, category: .streaks, requirement: 100),

        // Flashcard Achievements
        Achievement(id: "flash_set", title: "Card Collector", description: "Complete a flashcard set", icon: "rectangle.on.rectangle.fill", tier: .bronze, category: .flashcards, requirement: 1),
        Achievement(id: "flash_all", title: "Card Master", description: "Complete all flashcard sets", icon: "rectangle.on.rectangle.fill", tier: .gold, category: .flashcards, requirement: 5),

        // Special Achievements
        Achievement(id: "pass_first", title: "Ready to Drive", description: "Pass your first quiz (83%+)", icon: "car.fill", tier: .silver, category: .special, requirement: 1),
        Achievement(id: "pass_10", title: "Road Ready", description: "Pass 10 quizzes", icon: "car.fill", tier: .gold, category: .special, requirement: 10),
        Achievement(id: "level_5", title: "Rising Star", description: "Reach Level 5", icon: "arrow.up.circle.fill", tier: .silver, category: .special, requirement: 5),
        Achievement(id: "level_10", title: "DMV Pro", description: "Reach Level 10", icon: "crown.fill", tier: .diamond, category: .special, requirement: 10),
    ]

    static func get(_ id: String) -> Achievement? {
        all.first { $0.id == id }
    }
}

// MARK: - Daily Challenge

struct DailyChallenge: Identifiable, Codable {
    let id: String
    let title: String
    let description: String
    let icon: String
    let target: Int
    var current: Int
    let xpReward: Int
    let date: String

    var isCompleted: Bool {
        current >= target
    }

    var progress: Double {
        min(1.0, Double(current) / Double(target))
    }

    static func generateChallenges(for date: Date) -> [DailyChallenge] {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let dateString = dateFormatter.string(from: date)

        return [
            DailyChallenge(
                id: "daily_quiz_\(dateString)",
                title: "Quiz Time",
                description: "Complete 3 quizzes today",
                icon: "doc.text.fill",
                target: 3,
                current: 0,
                xpReward: 50,
                date: dateString
            ),
            DailyChallenge(
                id: "daily_correct_\(dateString)",
                title: "Accuracy",
                description: "Answer 20 questions correctly",
                icon: "checkmark.circle.fill",
                target: 20,
                current: 0,
                xpReward: 40,
                date: dateString
            ),
            DailyChallenge(
                id: "daily_flash_\(dateString)",
                title: "Flash Study",
                description: "Review 1 flashcard set",
                icon: "rectangle.on.rectangle.fill",
                target: 1,
                current: 0,
                xpReward: 30,
                date: dateString
            ),
        ]
    }
}

// MARK: - XP Gain Animation Data

struct XPGain: Identifiable {
    let id = UUID()
    let amount: Int
    let event: XPEvent
    let timestamp: Date = Date()
}
