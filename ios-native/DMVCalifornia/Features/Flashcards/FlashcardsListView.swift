import SwiftUI

// MARK: - Flashcard Language Filter

enum FlashcardLanguageFilter: String, CaseIterable {
    case all = "All"
    case english = "🇺🇸"
    case spanish = "🇪🇸"
    case turkish = "🇹🇷"
    case chinese = "🇨🇳"
}

struct FlashcardsListView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel = FlashcardsListViewModel()

    private let columns = [
        GridItem(.flexible()),
        GridItem(.flexible())
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Language Filter
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: DMVTheme.Spacing.sm) {
                    ForEach(FlashcardLanguageFilter.allCases, id: \.self) { filter in
                        FlashcardFilterChip(
                            title: filter.rawValue,
                            isSelected: viewModel.languageFilter == filter,
                            count: viewModel.getCount(for: filter)
                        ) {
                            viewModel.languageFilter = filter
                        }
                    }
                }
                .padding(.horizontal)
            }
            .padding(.vertical, DMVTheme.Spacing.md)
            .background(Color.dmvBackground)

            // Flashcard List
            if viewModel.isLoading {
                ScrollView {
                    SkeletonGrid(columns: 2, rows: 3)
                }
            } else if viewModel.filteredFlashcardSets.isEmpty {
                EmptyStateView(
                    icon: "rectangle.on.rectangle",
                    title: "No Flashcards",
                    message: "Flashcard sets will appear here."
                )
            } else {
                ScrollView {
                    LazyVGrid(columns: columns, spacing: DMVTheme.Spacing.md) {
                        ForEach(viewModel.filteredFlashcardSets) { set in
                            FlashcardSetCard(
                                title: set.displayTitle,
                                cardsCount: set.cardsCount,
                                category: set.category
                            ) {
                                coordinator.navigate(to: .flashcardDeck(flashcardSet: set))
                            }
                        }
                    }
                    .padding()
                }
            }

            // Banner Ad at bottom
            AdaptiveBannerAdView()
                .padding(.horizontal)
        }
        .background(Color.dmvBackground)
        .navigationTitle("Flashcards")
        .task {
            await viewModel.loadFlashcards()
        }
    }
}

// MARK: - Flashcard Filter Chip

struct FlashcardFilterChip: View {
    let title: String
    let isSelected: Bool
    let count: Int
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))

                if count > 0 {
                    Text("\(count)")
                        .font(.system(size: 12))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(isSelected ? Color.white.opacity(0.2) : Color.dmvBlue.opacity(0.1))
                        .cornerRadius(10)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? Color.dmvBlue : Color.dmvCard)
            .foregroundColor(isSelected ? .white : .dmvText)
            .cornerRadius(DMVTheme.CornerRadius.full)
            .overlay(
                RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.full)
                    .stroke(isSelected ? Color.clear : Color.dmvBorder, lineWidth: 1)
            )
        }
    }
}

// MARK: - ViewModel

@MainActor
final class FlashcardsListViewModel: ObservableObject {
    @Published var flashcardSets: [FlashcardSet] = []
    @Published var filteredFlashcardSets: [FlashcardSet] = []
    @Published var isLoading = false
    @Published var error: Error?
    @Published var languageFilter: FlashcardLanguageFilter = .all {
        didSet {
            applyFilter()
        }
    }

    private let quizDataService: QuizDataServiceProtocol

    // Flashcard counts by language
    private var englishFlashcards: [FlashcardSet] = []
    private var spanishFlashcards: [FlashcardSet] = []
    private var turkishFlashcards: [FlashcardSet] = []
    private var chineseFlashcards: [FlashcardSet] = []

    init(quizDataService: QuizDataServiceProtocol = QuizDataService.shared) {
        self.quizDataService = quizDataService
    }

    func loadFlashcards() async {
        isLoading = true
        do {
            // Load all flashcard types concurrently
            async let englishTask = quizDataService.getFlashcardSets()
            async let spanishTask = quizDataService.getSpanishFlashcards()
            async let turkishTask = quizDataService.getTurkishFlashcards()
            async let chineseTask = quizDataService.getChineseFlashcards()

            let (english, spanish, turkish, chinese) = try await (englishTask, spanishTask, turkishTask, chineseTask)

            englishFlashcards = english
            spanishFlashcards = spanish
            turkishFlashcards = turkish
            chineseFlashcards = chinese

            // Combine all flashcards
            flashcardSets = english + spanish + turkish + chinese

            // Apply initial filter
            applyFilter()
        } catch {
            self.error = error
        }
        isLoading = false
    }

    func getCount(for filter: FlashcardLanguageFilter) -> Int {
        switch filter {
        case .all:
            return flashcardSets.count
        case .english:
            return englishFlashcards.count
        case .spanish:
            return spanishFlashcards.count
        case .turkish:
            return turkishFlashcards.count
        case .chinese:
            return chineseFlashcards.count
        }
    }

    private func applyFilter() {
        switch languageFilter {
        case .all:
            filteredFlashcardSets = flashcardSets
        case .english:
            filteredFlashcardSets = englishFlashcards
        case .spanish:
            filteredFlashcardSets = spanishFlashcards
        case .turkish:
            filteredFlashcardSets = turkishFlashcards
        case .chinese:
            filteredFlashcardSets = chineseFlashcards
        }
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        FlashcardsListView()
            .environmentObject(AppCoordinator())
    }
}
