import Foundation

// MARK: - Quiz Attempt & History

struct QuizAttempt: Identifiable, Codable {
    let id: String
    let quizId: String
    let quizTitle: String
    let score: Int
    let totalQuestions: Int
    let percentage: Double
    let completedAt: Date
    let wrongAnswers: [WrongAnswer]

    init(
        id: String = UUID().uuidString,
        quizId: String,
        quizTitle: String,
        score: Int,
        totalQuestions: Int,
        percentage: Double,
        completedAt: Date = Date(),
        wrongAnswers: [WrongAnswer] = []
    ) {
        self.id = id
        self.quizId = quizId
        self.quizTitle = quizTitle
        self.score = score
        self.totalQuestions = totalQuestions
        self.percentage = percentage
        self.completedAt = completedAt
        self.wrongAnswers = wrongAnswers
    }
}

struct WrongAnswer: Codable, Hashable {
    let questionId: Int
    let question: String
    let selectedAnswer: Int
    let correctAnswer: Int
    let category: String?
}

// MARK: - Quiz Result (for passing between views)

struct QuizResult: Hashable {
    let score: Int
    let totalQuestions: Int
    let percentage: Double
    let passed: Bool
    let wrongAnswers: [WrongAnswer]
    let elapsedSeconds: Int?
    let timeLimitSeconds: Int?

    init(score: Int, totalQuestions: Int, percentage: Double, passingScore: Int = 83, wrongAnswers: [WrongAnswer] = [], elapsedSeconds: Int? = nil, timeLimitSeconds: Int? = nil) {
        self.score = score
        self.totalQuestions = totalQuestions
        self.percentage = percentage
        self.passed = percentage >= Double(passingScore)
        self.wrongAnswers = wrongAnswers
        self.elapsedSeconds = elapsedSeconds
        self.timeLimitSeconds = timeLimitSeconds
    }

    var formattedElapsedTime: String? {
        guard let elapsed = elapsedSeconds else { return nil }
        let minutes = elapsed / 60
        let seconds = elapsed % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
}

// MARK: - Study Streak

struct StudyStreak: Codable {
    var currentStreak: Int
    var longestStreak: Int
    var lastStudyDate: String
    var totalDaysStudied: Int

    init(
        currentStreak: Int = 0,
        longestStreak: Int = 0,
        lastStudyDate: String = "",
        totalDaysStudied: Int = 0
    ) {
        self.currentStreak = currentStreak
        self.longestStreak = longestStreak
        self.lastStudyDate = lastStudyDate
        self.totalDaysStudied = totalDaysStudied
    }
}

// MARK: - Overall Stats

struct OverallStats {
    let totalQuizzes: Int
    let totalQuestions: Int
    let averageScore: Double
    let bestScore: Double

    init(
        totalQuizzes: Int = 0,
        totalQuestions: Int = 0,
        averageScore: Double = 0,
        bestScore: Double = 0
    ) {
        self.totalQuizzes = totalQuizzes
        self.totalQuestions = totalQuestions
        self.averageScore = averageScore
        self.bestScore = bestScore
    }
}

// MARK: - Score History Entry (for charts)

struct ScoreHistoryEntry: Identifiable {
    let id = UUID()
    let date: Date
    let percentage: Double
    let quizTitle: String
}

// MARK: - Weak Area

struct WeakArea: Identifiable {
    var id: String { category }
    let category: String
    let wrongCount: Int
    let totalCount: Int

    var percentage: Double {
        guard totalCount > 0 else { return 0 }
        return Double(wrongCount) / Double(totalCount) * 100
    }
}

// MARK: - Quiz Progress (for resume functionality)

struct QuizProgress: Codable {
    let quizId: String
    let quizTitle: String
    let currentQuestionIndex: Int
    let userAnswers: [Int?]
    let answeredCorrectly: [Bool?]
    let bookmarkedQuestions: [Int]
    let startTime: Date
    let remainingSeconds: Int?
    let savedAt: Date

    init(
        quizId: String,
        quizTitle: String,
        currentQuestionIndex: Int,
        userAnswers: [Int?],
        answeredCorrectly: [Bool?],
        bookmarkedQuestions: Set<Int>,
        startTime: Date,
        remainingSeconds: Int? = nil,
        savedAt: Date = Date()
    ) {
        self.quizId = quizId
        self.quizTitle = quizTitle
        self.currentQuestionIndex = currentQuestionIndex
        self.userAnswers = userAnswers
        self.answeredCorrectly = answeredCorrectly
        self.bookmarkedQuestions = Array(bookmarkedQuestions)
        self.startTime = startTime
        self.remainingSeconds = remainingSeconds
        self.savedAt = savedAt
    }

    var answeredCount: Int {
        userAnswers.compactMap { $0 }.count
    }

    var totalQuestions: Int {
        userAnswers.count
    }

    var progressPercentage: Int {
        guard totalQuestions > 0 else { return 0 }
        return Int(Double(answeredCount) / Double(totalQuestions) * 100)
    }
}
