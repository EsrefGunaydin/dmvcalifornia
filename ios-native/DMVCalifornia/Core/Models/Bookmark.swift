import Foundation

// MARK: - Bookmarked Question

struct BookmarkedQuestion: Identifiable, Codable, Hashable {
    let id: String
    let questionId: Int
    let quizId: String
    let question: String
    let options: [String]
    let correctAnswer: Int
    let explanation: String?
    let category: String?
    let bookmarkedAt: Date

    init(
        id: String = UUID().uuidString,
        questionId: Int,
        quizId: String,
        question: String,
        options: [String],
        correctAnswer: Int,
        explanation: String? = nil,
        category: String? = nil,
        bookmarkedAt: Date = Date()
    ) {
        self.id = id
        self.questionId = questionId
        self.quizId = quizId
        self.question = question
        self.options = options
        self.correctAnswer = correctAnswer
        self.explanation = explanation
        self.category = category
        self.bookmarkedAt = bookmarkedAt
    }

    /// Create a BookmarkedQuestion from a Question
    init(from question: Question, quizId: String) {
        self.id = UUID().uuidString
        self.questionId = question.id
        self.quizId = quizId
        self.question = question.question
        self.options = question.options
        self.correctAnswer = question.correctAnswer
        self.explanation = question.explanation
        self.category = question.category
        self.bookmarkedAt = Date()
    }
}
