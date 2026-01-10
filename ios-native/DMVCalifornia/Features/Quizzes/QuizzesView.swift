import SwiftUI

// MARK: - Language Filter

enum LanguageFilter: String, CaseIterable {
    case all = "All"
    case english = "🇺🇸"
    case spanish = "🇪🇸"
    case turkish = "🇹🇷"
    case chinese = "🇨🇳"
}

struct QuizzesView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel = QuizzesViewModel()

    var body: some View {
        VStack(spacing: 0) {
            // Search and Filter
            VStack(spacing: DMVTheme.Spacing.md) {
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.dmvTextSecondary)
                    TextField("Search quizzes...", text: $viewModel.searchQuery)
                }
                .padding()
                .background(Color.dmvCard)
                .cornerRadius(DMVTheme.CornerRadius.md)

                // Language Filter
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: DMVTheme.Spacing.sm) {
                        ForEach(LanguageFilter.allCases, id: \.self) { filter in
                            FilterChip(
                                title: filter.rawValue,
                                isSelected: viewModel.languageFilter == filter,
                                count: viewModel.getCount(for: filter)
                            ) {
                                viewModel.languageFilter = filter
                            }
                        }
                    }
                }
            }
            .padding()
            .background(Color.dmvBackground)

            // Quiz List
            if viewModel.isLoading {
                ScrollView {
                    SkeletonGrid(columns: 2, rows: 4)
                }
            } else if viewModel.filteredQuizzes.isEmpty {
                EmptyStateView(
                    icon: "doc.text",
                    title: "No Quizzes Found",
                    message: "Try adjusting your search or filter."
                )
            } else {
                ScrollView {
                    LazyVGrid(columns: [
                        GridItem(.flexible()),
                        GridItem(.flexible())
                    ], spacing: DMVTheme.Spacing.md) {
                        ForEach(Array(viewModel.filteredQuizzes.enumerated()), id: \.element.id) { index, quiz in
                            QuizCard(
                                title: quiz.displayTitle,
                                questionsCount: quiz.questionsCount,
                                category: nil
                            ) {
                                coordinator.navigate(to: .quizDetail(quizId: quiz.id, quizTitle: quiz.displayTitle))
                            }
                            .cardEntrance(index: index)
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
        .navigationTitle("Practice Tests")
        .task {
            await viewModel.loadQuizzes()
        }
        .refreshable {
            await viewModel.loadQuizzes()
        }
    }
}

// MARK: - Filter Chip

struct FilterChip: View {
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
                        .background(isSelected ? Color.white.opacity(0.2) : Color.dmvOrange.opacity(0.1))
                        .cornerRadius(10)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? Color.dmvOrange : Color.dmvCard)
            .foregroundColor(isSelected ? .white : .dmvText)
            .cornerRadius(DMVTheme.CornerRadius.full)
            .overlay(
                RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.full)
                    .stroke(isSelected ? Color.clear : Color.dmvBorder, lineWidth: 1)
            )
        }
        .buttonStyle(.press)
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        QuizzesView()
            .environmentObject(AppCoordinator())
    }
}
