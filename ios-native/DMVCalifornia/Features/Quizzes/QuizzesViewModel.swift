import Foundation
import Combine

@MainActor
final class QuizzesViewModel: ObservableObject {
    @Published var quizzes: [Quiz] = []
    @Published var filteredQuizzes: [Quiz] = []
    @Published var isLoading = false
    @Published var error: Error?
    @Published var languageFilter: LanguageFilter = .all
    @Published var searchQuery = ""

    private let quizDataService: QuizDataServiceProtocol
    private var cancellables = Set<AnyCancellable>()

    // Quiz counts by language
    private var englishQuizzes: [Quiz] = []
    private var spanishQuizzes: [Quiz] = []
    private var turkishQuizzes: [Quiz] = []
    private var chineseQuizzes: [Quiz] = []

    init(quizDataService: QuizDataServiceProtocol = QuizDataService.shared) {
        self.quizDataService = quizDataService
        setupBindings()
    }

    private func setupBindings() {
        // Combine search query and filter changes
        Publishers.CombineLatest($searchQuery, $languageFilter)
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .sink { [weak self] query, filter in
                self?.applyFilters(query: query, filter: filter)
            }
            .store(in: &cancellables)
    }

    func loadQuizzes() async {
        isLoading = true
        error = nil

        do {
            // Load all quiz types concurrently
            async let englishTask = quizDataService.getQuizzes()
            async let spanishTask = quizDataService.getSpanishQuizzes()
            async let turkishTask = quizDataService.getTurkishQuizzes()
            async let chineseTask = quizDataService.getChineseQuizzes()

            let (english, spanish, turkish, chinese) = try await (englishTask, spanishTask, turkishTask, chineseTask)

            englishQuizzes = english
            spanishQuizzes = spanish
            turkishQuizzes = turkish
            chineseQuizzes = chinese

            // Combine all quizzes
            quizzes = english + spanish + turkish + chinese

            // Apply initial filter
            applyFilters(query: searchQuery, filter: languageFilter)
        } catch {
            self.error = error
        }

        isLoading = false
    }

    func getCount(for filter: LanguageFilter) -> Int {
        switch filter {
        case .all:
            return quizzes.count
        case .english:
            return englishQuizzes.count
        case .spanish:
            return spanishQuizzes.count
        case .turkish:
            return turkishQuizzes.count
        case .chinese:
            return chineseQuizzes.count
        }
    }

    private func applyFilters(query: String, filter: LanguageFilter) {
        var result: [Quiz]

        // Apply language filter
        switch filter {
        case .all:
            result = quizzes
        case .english:
            result = englishQuizzes
        case .spanish:
            result = spanishQuizzes
        case .turkish:
            result = turkishQuizzes
        case .chinese:
            result = chineseQuizzes
        }

        // Apply search query
        if !query.isEmpty {
            result = result.filter { quiz in
                quiz.title.localizedCaseInsensitiveContains(query) ||
                (quiz.category?.localizedCaseInsensitiveContains(query) ?? false)
            }
        }

        filteredQuizzes = result
    }
}
