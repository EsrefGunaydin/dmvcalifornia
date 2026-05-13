package com.dmvcalifornia.app.core.model

import kotlinx.serialization.Serializable

// MARK: - User Level

data class UserLevel(
    val level: Int,
    val title: String,
    val minXP: Int,
    val maxXP: Int,
    val icon: String,
    val color: String
) {
    companion object {
        val levels = listOf(
            UserLevel(1, "Learner", 0, 100, "leaf", "51CF66"),
            UserLevel(2, "Student", 100, 250, "book", "339AF0"),
            UserLevel(3, "Apprentice", 250, 500, "school", "845EF7"),
            UserLevel(4, "Scholar", 500, 850, "star", "FCC419"),
            UserLevel(5, "Expert", 850, 1300, "fire", "FF922B"),
            UserLevel(6, "Master", 1300, 1900, "bolt", "F06595"),
            UserLevel(7, "Champion", 1900, 2600, "trophy", "FFD700"),
            UserLevel(8, "Legend", 2600, 3500, "crown", "B9F2FF"),
            UserLevel(9, "Road Master", 3500, 5000, "car", "FF6B6B"),
            UserLevel(10, "DMV Pro", 5000, Int.MAX_VALUE, "shield", "9B59B6"),
        )

        fun levelFor(xp: Int): UserLevel =
            levels.lastOrNull { xp >= it.minXP } ?: levels[0]
    }
}

// MARK: - XP Event

enum class XPEvent(val points: Int, val description: String) {
    QUIZ_COMPLETED(10, "Quiz Completed"),
    QUIZ_PASSED(25, "Quiz Passed!"),
    PERFECT_QUIZ(50, "Perfect Score!"),
    CORRECT_ANSWER(2, "Correct Answer"),
    STREAK_DAY(15, "Daily Streak"),
    STREAK_WEEK(100, "Week Streak Bonus"),
    FLASHCARD_COMPLETED(5, "Flashcard Set Done"),
    FLASHCARD_SET_MASTERED(30, "Set Mastered"),
    FIRST_QUIZ_OF_DAY(20, "First Quiz Today"),
    ACHIEVEMENT_UNLOCKED(35, "Achievement!");
}

// MARK: - User Progress

@Serializable
data class UserProgress(
    var totalXP: Int = 0,
    var todayXP: Int = 0,
    var lastXPDate: String = "",
    var quizzesCompleted: Int = 0,
    var quizzesPassed: Int = 0,
    var perfectQuizzes: Int = 0,
    var correctAnswers: Int = 0,
    var flashcardsStudied: Int = 0,
    var totalStudyTime: Double = 0.0,
    var achievements: MutableList<String> = mutableListOf()
) {
    val currentLevel: UserLevel get() = UserLevel.levelFor(totalXP)

    val levelProgress: Double
        get() {
            val level = currentLevel
            if (level.maxXP == Int.MAX_VALUE) return 1.0
            val xpInLevel = totalXP - level.minXP
            val xpNeeded = level.maxXP - level.minXP
            return (xpInLevel.toDouble() / xpNeeded.toDouble()).coerceAtMost(1.0)
        }

    val xpToNextLevel: Int
        get() {
            val level = currentLevel
            if (level.maxXP == Int.MAX_VALUE) return 0
            return level.maxXP - totalXP
        }
}

// MARK: - Achievement

@Serializable
data class Achievement(
    val id: String,
    val title: String,
    val description: String,
    val icon: String,
    val tier: AchievementTier,
    val category: AchievementCategory,
    val requirement: Int,
    var unlockedAt: Long? = null
) {
    val isUnlocked: Boolean get() = unlockedAt != null

    companion object {
        val all = listOf(
            // Quiz Achievements
            Achievement("first_quiz", "First Steps", "Complete your first quiz", "flag", AchievementTier.BRONZE, AchievementCategory.QUIZZES, 1),
            Achievement("quiz_5", "Getting Started", "Complete 5 quizzes", "doc_text", AchievementTier.BRONZE, AchievementCategory.QUIZZES, 5),
            Achievement("quiz_25", "Quiz Enthusiast", "Complete 25 quizzes", "doc_text", AchievementTier.SILVER, AchievementCategory.QUIZZES, 25),
            Achievement("quiz_100", "Quiz Master", "Complete 100 quizzes", "doc_text", AchievementTier.GOLD, AchievementCategory.QUIZZES, 100),
            Achievement("quiz_500", "Quiz Legend", "Complete 500 quizzes", "doc_text", AchievementTier.DIAMOND, AchievementCategory.QUIZZES, 500),
            // Perfect Score Achievements
            Achievement("perfect_1", "Perfectionist", "Get a perfect score", "star", AchievementTier.SILVER, AchievementCategory.MASTERY, 1),
            Achievement("perfect_10", "Flawless", "Get 10 perfect scores", "star", AchievementTier.GOLD, AchievementCategory.MASTERY, 10),
            Achievement("perfect_50", "Untouchable", "Get 50 perfect scores", "star", AchievementTier.PLATINUM, AchievementCategory.MASTERY, 50),
            // Streak Achievements
            Achievement("streak_3", "On Fire", "Maintain a 3-day streak", "fire", AchievementTier.BRONZE, AchievementCategory.STREAKS, 3),
            Achievement("streak_7", "Week Warrior", "Maintain a 7-day streak", "fire", AchievementTier.SILVER, AchievementCategory.STREAKS, 7),
            Achievement("streak_30", "Monthly Master", "Maintain a 30-day streak", "fire", AchievementTier.GOLD, AchievementCategory.STREAKS, 30),
            Achievement("streak_100", "Unstoppable", "Maintain a 100-day streak", "fire", AchievementTier.DIAMOND, AchievementCategory.STREAKS, 100),
            // Flashcard Achievements
            Achievement("flash_set", "Card Collector", "Complete a flashcard set", "cards", AchievementTier.BRONZE, AchievementCategory.FLASHCARDS, 1),
            Achievement("flash_all", "Card Master", "Complete all flashcard sets", "cards", AchievementTier.GOLD, AchievementCategory.FLASHCARDS, 5),
            // Special Achievements
            Achievement("pass_first", "Ready to Drive", "Pass your first quiz (83%+)", "car", AchievementTier.SILVER, AchievementCategory.SPECIAL, 1),
            Achievement("pass_10", "Road Ready", "Pass 10 quizzes", "car", AchievementTier.GOLD, AchievementCategory.SPECIAL, 10),
            Achievement("level_5", "Rising Star", "Reach Level 5", "arrow_up", AchievementTier.SILVER, AchievementCategory.SPECIAL, 5),
            Achievement("level_10", "DMV Pro", "Reach Level 10", "crown", AchievementTier.DIAMOND, AchievementCategory.SPECIAL, 10),
        )

        fun get(id: String): Achievement? = all.firstOrNull { it.id == id }
    }
}

@Serializable
enum class AchievementTier(val colorHex: String, val xpBonus: Int) {
    BRONZE("CD7F32", 25),
    SILVER("C0C0C0", 50),
    GOLD("FFD700", 100),
    PLATINUM("E5E4E2", 200),
    DIAMOND("B9F2FF", 500);
}

@Serializable
enum class AchievementCategory(val displayName: String) {
    QUIZZES("Quizzes"),
    STREAKS("Streaks"),
    FLASHCARDS("Flashcards"),
    MASTERY("Mastery"),
    SPECIAL("Special");
}

// MARK: - Daily Challenge

@Serializable
data class DailyChallenge(
    val id: String,
    val title: String,
    val description: String,
    val icon: String,
    val target: Int,
    var current: Int,
    val xpReward: Int,
    val date: String
) {
    val isCompleted: Boolean get() = current >= target
    val progress: Double get() = (current.toDouble() / target.toDouble()).coerceAtMost(1.0)

    companion object {
        fun generateChallenges(dateString: String): List<DailyChallenge> = listOf(
            DailyChallenge(
                id = "daily_quiz_$dateString",
                title = "Quiz Time",
                description = "Complete 3 quizzes today",
                icon = "doc_text",
                target = 3,
                current = 0,
                xpReward = 50,
                date = dateString
            ),
            DailyChallenge(
                id = "daily_correct_$dateString",
                title = "Accuracy",
                description = "Answer 20 questions correctly",
                icon = "check_circle",
                target = 20,
                current = 0,
                xpReward = 40,
                date = dateString
            ),
            DailyChallenge(
                id = "daily_flash_$dateString",
                title = "Flash Study",
                description = "Review 1 flashcard set",
                icon = "cards",
                target = 1,
                current = 0,
                xpReward = 30,
                date = dateString
            ),
        )
    }
}

// MARK: - XP Gain (for animation)

data class XPGain(
    val id: Long = System.nanoTime(),
    val amount: Int,
    val event: XPEvent,
    val timestamp: Long = System.currentTimeMillis()
)
