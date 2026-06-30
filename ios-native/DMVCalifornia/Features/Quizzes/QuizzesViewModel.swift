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
    private var arabicQuizzes: [Quiz] = []
    private var armenianQuizzes: [Quiz] = []
    private var farsiQuizzes: [Quiz] = []
    private var hindiQuizzes: [Quiz] = []
    private var koreanQuizzes: [Quiz] = []
    private var punjabiQuizzes: [Quiz] = []
    private var russianQuizzes: [Quiz] = []
    private var tagalogQuizzes: [Quiz] = []
    private var vietnameseQuizzes: [Quiz] = []

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
            async let arabicTask = quizDataService.getArabicQuizzes()
            async let armenianTask = quizDataService.getArmenianQuizzes()
            async let farsiTask = quizDataService.getFarsiQuizzes()
            async let hindiTask = quizDataService.getHindiQuizzes()
            async let koreanTask = quizDataService.getKoreanQuizzes()
            async let punjabiTask = quizDataService.getPunjabiQuizzes()
            async let russianTask = quizDataService.getRussianQuizzes()
            async let tagalogTask = quizDataService.getTagalogQuizzes()
            async let vietnameseTask = quizDataService.getVietnameseQuizzes()

            let english = try await englishTask
            let spanish = try await spanishTask
            let turkish = try await turkishTask
            let chinese = try await chineseTask
            let arabic = try await arabicTask
            let armenian = try await armenianTask
            let farsi = try await farsiTask
            let hindi = try await hindiTask
            let korean = try await koreanTask
            let punjabi = try await punjabiTask
            let russian = try await russianTask
            let tagalog = try await tagalogTask
            let vietnamese = try await vietnameseTask

            englishQuizzes = english
            spanishQuizzes = spanish
            turkishQuizzes = turkish
            chineseQuizzes = chinese
            arabicQuizzes = arabic
            armenianQuizzes = armenian
            farsiQuizzes = farsi
            hindiQuizzes = hindi
            koreanQuizzes = korean
            punjabiQuizzes = punjabi
            russianQuizzes = russian
            tagalogQuizzes = tagalog
            vietnameseQuizzes = vietnamese

            // Combine all quizzes
            quizzes = english + spanish + turkish + chinese
                + arabic + armenian + farsi + hindi + korean + punjabi + russian + tagalog + vietnamese

            // Apply initial filter
            applyFilters(query: searchQuery, filter: languageFilter)
        } catch {
            self.error = error
        }

        isLoading = false
    }

    func getCount(for filter: LanguageFilter) -> Int {
        switch filter {
        case .all: return quizzes.count
        case .english: return englishQuizzes.count
        case .spanish: return spanishQuizzes.count
        case .turkish: return turkishQuizzes.count
        case .chinese: return chineseQuizzes.count
        case .arabic: return arabicQuizzes.count
        case .armenian: return armenianQuizzes.count
        case .farsi: return farsiQuizzes.count
        case .hindi: return hindiQuizzes.count
        case .korean: return koreanQuizzes.count
        case .punjabi: return punjabiQuizzes.count
        case .russian: return russianQuizzes.count
        case .tagalog: return tagalogQuizzes.count
        case .vietnamese: return vietnameseQuizzes.count
        }
    }

    private func applyFilters(query: String, filter: LanguageFilter) {
        var result: [Quiz]

        // Apply language filter
        switch filter {
        case .all: result = quizzes
        case .english: result = englishQuizzes
        case .spanish: result = spanishQuizzes
        case .turkish: result = turkishQuizzes
        case .chinese: result = chineseQuizzes
        case .arabic: result = arabicQuizzes
        case .armenian: result = armenianQuizzes
        case .farsi: result = farsiQuizzes
        case .hindi: result = hindiQuizzes
        case .korean: result = koreanQuizzes
        case .punjabi: result = punjabiQuizzes
        case .russian: result = russianQuizzes
        case .tagalog: result = tagalogQuizzes
        case .vietnamese: result = vietnameseQuizzes
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
