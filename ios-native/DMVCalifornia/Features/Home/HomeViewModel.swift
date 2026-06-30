import Foundation
import Combine

@MainActor
final class HomeViewModel: ObservableObject {
    @Published var totalQuizzes: Int = 0
    @Published var totalFlashcards: Int = 0
    @Published var streak: StudyStreak = StudyStreak()
    @Published var recentAttempts: [QuizAttempt] = []
    @Published var isLoading = false
    @Published var error: Error?

    private let quizDataService: QuizDataServiceProtocol
    private let storageService: StorageServiceProtocol

    init(
        quizDataService: QuizDataServiceProtocol = QuizDataService.shared,
        storageService: StorageServiceProtocol = StorageService.shared
    ) {
        self.quizDataService = quizDataService
        self.storageService = storageService
    }

    func loadData() async {
        isLoading = true
        error = nil

        do {
            // Load all quizzes across every language
            async let allQuizzesTask = quizDataService.getAllQuizzes()

            // Load all flashcards (all languages)
            async let englishFlashcardsTask = quizDataService.getFlashcardSets()
            async let spanishFlashcardsTask = quizDataService.getSpanishFlashcards()
            async let turkishFlashcardsTask = quizDataService.getTurkishFlashcards()
            async let chineseFlashcardsTask = quizDataService.getChineseFlashcards()

            let allQuizzes = try await allQuizzesTask

            let (englishFlashcards, spanishFlashcards, turkishFlashcards, chineseFlashcards) = try await (
                englishFlashcardsTask, spanishFlashcardsTask, turkishFlashcardsTask, chineseFlashcardsTask
            )

            totalQuizzes = allQuizzes.count
            totalFlashcards = englishFlashcards.count + spanishFlashcards.count + turkishFlashcards.count + chineseFlashcards.count

            // Load streak and recent activity
            streak = await storageService.getStreak()
            recentAttempts = await storageService.getRecentActivity(limit: 5)
        } catch {
            self.error = error
        }

        isLoading = false
    }
}
