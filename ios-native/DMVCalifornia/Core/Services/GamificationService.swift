import Foundation
import SwiftUI
import Combine

// MARK: - Gamification Service

@MainActor
final class GamificationService: ObservableObject {
    static let shared = GamificationService()

    @Published private(set) var userProgress: UserProgress = UserProgress()
    @Published private(set) var dailyChallenges: [DailyChallenge] = []
    @Published private(set) var recentXPGains: [XPGain] = []
    @Published private(set) var newlyUnlockedAchievements: [Achievement] = []

    // Events for UI to observe
    @Published var showLevelUp = false
    @Published var levelUpData: (oldLevel: UserLevel, newLevel: UserLevel)?
    @Published var showXPGain = false
    @Published var lastXPGain: XPGain?

    private let defaults = UserDefaults.standard
    private let progressKey = "userProgress"
    private let challengesKey = "dailyChallenges"

    private init() {
        loadProgress()
        loadDailyChallenges()
    }

    // MARK: - XP Management

    func awardXP(for event: XPEvent, multiplier: Double = 1.0) {
        let oldLevel = userProgress.currentLevel
        let xpAmount = Int(Double(event.rawValue) * multiplier)

        userProgress.totalXP += xpAmount
        userProgress.todayXP += xpAmount

        // Track XP gain for animation
        let gain = XPGain(amount: xpAmount, event: event)
        recentXPGains.append(gain)
        lastXPGain = gain
        showXPGain = true

        // Keep only last 10 gains
        if recentXPGains.count > 10 {
            recentXPGains.removeFirst()
        }

        // Check for level up
        let newLevel = userProgress.currentLevel
        if newLevel.level > oldLevel.level {
            levelUpData = (oldLevel, newLevel)
            showLevelUp = true
            HapticManager.shared.levelUp()

            // Check level achievements
            checkLevelAchievements(level: newLevel.level)
        } else {
            HapticManager.shared.xpGain()
        }

        saveProgress()

        // Auto-hide XP gain notification after delay
        Task {
            try? await Task.sleep(nanoseconds: 2_000_000_000)
            showXPGain = false
        }
    }

    // MARK: - Quiz Events

    func recordQuizCompletion(score: Int, totalQuestions: Int, isPerfect: Bool, isPassed: Bool) {
        userProgress.quizzesCompleted += 1
        userProgress.correctAnswers += score

        // Award XP based on performance
        awardXP(for: .quizCompleted)

        if isPerfect {
            userProgress.perfectQuizzes += 1
            awardXP(for: .perfectQuiz)
            checkAchievement("perfect_1", current: userProgress.perfectQuizzes)
            checkAchievement("perfect_10", current: userProgress.perfectQuizzes)
            checkAchievement("perfect_50", current: userProgress.perfectQuizzes)
        } else if isPassed {
            userProgress.quizzesPassed += 1
            awardXP(for: .quizPassed)
            checkAchievement("pass_first", current: userProgress.quizzesPassed)
            checkAchievement("pass_10", current: userProgress.quizzesPassed)
        }

        // Check quiz count achievements
        checkAchievement("first_quiz", current: userProgress.quizzesCompleted)
        checkAchievement("quiz_5", current: userProgress.quizzesCompleted)
        checkAchievement("quiz_25", current: userProgress.quizzesCompleted)
        checkAchievement("quiz_100", current: userProgress.quizzesCompleted)
        checkAchievement("quiz_500", current: userProgress.quizzesCompleted)

        // Update daily challenges
        updateChallenge(type: "quiz")
        updateChallenge(type: "correct", amount: score)

        saveProgress()
    }

    func recordCorrectAnswer() {
        awardXP(for: .correctAnswer)
    }

    // MARK: - Streak Events

    func recordStreakDay(currentStreak: Int) {
        awardXP(for: .streakDay)

        if currentStreak > 0 && currentStreak % 7 == 0 {
            awardXP(for: .streakWeek)
        }

        // Check streak achievements
        checkAchievement("streak_3", current: currentStreak)
        checkAchievement("streak_7", current: currentStreak)
        checkAchievement("streak_30", current: currentStreak)
        checkAchievement("streak_100", current: currentStreak)
    }

    // MARK: - Flashcard Events

    func recordFlashcardSetCompleted() {
        userProgress.flashcardsStudied += 1
        awardXP(for: .flashcardCompleted)

        checkAchievement("flash_set", current: userProgress.flashcardsStudied)
        checkAchievement("flash_all", current: userProgress.flashcardsStudied)

        updateChallenge(type: "flash")
        saveProgress()
    }

    // MARK: - Achievement Management

    private func checkAchievement(_ id: String, current: Int) {
        guard let achievement = Achievement.get(id),
              !userProgress.achievements.contains(id),
              current >= achievement.requirement else { return }

        unlockAchievement(achievement)
    }

    private func checkLevelAchievements(level: Int) {
        checkAchievement("level_5", current: level)
        checkAchievement("level_10", current: level)
    }

    private func unlockAchievement(_ achievement: Achievement) {
        var unlockedAchievement = achievement
        unlockedAchievement.unlockedAt = Date()

        userProgress.achievements.append(achievement.id)
        newlyUnlockedAchievements.append(unlockedAchievement)

        // Award bonus XP
        awardXP(for: .achievementUnlocked, multiplier: Double(achievement.tier.xpBonus) / 25.0)

        HapticManager.shared.achievement()
        saveProgress()
    }

    func getUnlockedAchievements() -> [Achievement] {
        Achievement.all.compactMap { achievement in
            if userProgress.achievements.contains(achievement.id) {
                var unlocked = achievement
                unlocked.unlockedAt = Date() // Approximation
                return unlocked
            }
            return nil
        }
    }

    func getLockedAchievements() -> [Achievement] {
        Achievement.all.filter { !userProgress.achievements.contains($0.id) }
    }

    func clearNewAchievements() {
        newlyUnlockedAchievements.removeAll()
    }

    // MARK: - Daily Challenges

    private func loadDailyChallenges() {
        let today = formatDate(Date())

        if let data = defaults.data(forKey: challengesKey),
           let challenges = try? JSONDecoder().decode([DailyChallenge].self, from: data),
           challenges.first?.date == today {
            dailyChallenges = challenges
        } else {
            // Generate new challenges for today
            dailyChallenges = DailyChallenge.generateChallenges(for: Date())
            saveChallenges()
        }
    }

    private func updateChallenge(type: String, amount: Int = 1) {
        for i in dailyChallenges.indices {
            if dailyChallenges[i].id.contains(type) && !dailyChallenges[i].isCompleted {
                let wasCompleted = dailyChallenges[i].isCompleted
                dailyChallenges[i].current += amount

                if !wasCompleted && dailyChallenges[i].isCompleted {
                    // Challenge completed!
                    awardXP(for: .quizCompleted, multiplier: Double(dailyChallenges[i].xpReward) / 10.0)
                    HapticManager.shared.success()
                }
            }
        }
        saveChallenges()
    }

    private func saveChallenges() {
        if let data = try? JSONEncoder().encode(dailyChallenges) {
            defaults.set(data, forKey: challengesKey)
        }
    }

    // MARK: - Persistence

    private func loadProgress() {
        if let data = defaults.data(forKey: progressKey),
           let progress = try? JSONDecoder().decode(UserProgress.self, from: data) {
            userProgress = progress

            // Reset daily XP if new day
            let today = formatDate(Date())
            if userProgress.lastXPDate != today {
                userProgress.todayXP = 0
                userProgress.lastXPDate = today
                saveProgress()
            }
        }
    }

    private func saveProgress() {
        userProgress.lastXPDate = formatDate(Date())
        if let data = try? JSONEncoder().encode(userProgress) {
            defaults.set(data, forKey: progressKey)
        }
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }

    // MARK: - Reset (for testing)

    func resetProgress() {
        userProgress = UserProgress()
        dailyChallenges = DailyChallenge.generateChallenges(for: Date())
        saveProgress()
        saveChallenges()
    }
}
