import SwiftUI

// MARK: - Language Filter

enum LanguageFilter: String, CaseIterable {
    case all
    case english
    case spanish
    case turkish
    case chinese
    case arabic
    case armenian
    case farsi
    case hindi
    case korean
    case punjabi
    case russian
    case tagalog
    case vietnamese

    var displayName: String {
        switch self {
        case .all:        return "All languages"
        case .english:    return "English"
        case .spanish:    return "Spanish"
        case .turkish:    return "Turkish"
        case .chinese:    return "Chinese"
        case .arabic:     return "Arabic"
        case .armenian:   return "Armenian"
        case .farsi:      return "Farsi"
        case .hindi:      return "Hindi"
        case .korean:     return "Korean"
        case .punjabi:    return "Punjabi"
        case .russian:    return "Russian"
        case .tagalog:    return "Tagalog"
        case .vietnamese: return "Vietnamese"
        }
    }

    var flag: String {
        switch self {
        case .all:        return "🌐"
        case .english:    return "🇺🇸"
        case .spanish:    return "🇪🇸"
        case .turkish:    return "🇹🇷"
        case .chinese:    return "🇨🇳"
        case .arabic:     return "🇸🇦"
        case .armenian:   return "🇦🇲"
        case .farsi:      return "🇮🇷"
        case .hindi:      return "🇮🇳"
        case .korean:     return "🇰🇷"
        case .punjabi:    return "🇵🇰"
        case .russian:    return "🇷🇺"
        case .tagalog:    return "🇵🇭"
        case .vietnamese: return "🇻🇳"
        }
    }
}

// MARK: - Quizzes View

struct QuizzesView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel = QuizzesViewModel()

    var body: some View {
        VStack(spacing: 0) {
            // Search and Filter header
            VStack(spacing: DMVTheme.Spacing.sm) {

                // Search bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.dmvTextSecondary)
                    TextField("Search quizzes...", text: $viewModel.searchQuery)
                }
                .padding()
                .background(Color.dmvCard)
                .cornerRadius(DMVTheme.CornerRadius.md)

                // Primary: language name dropdown
                Menu {
                    ForEach(LanguageFilter.allCases, id: \.self) { filter in
                        Button {
                            viewModel.languageFilter = filter
                        } label: {
                            if viewModel.languageFilter == filter {
                                Label(
                                    "\(filter.flag)  \(filter.displayName)  (\(viewModel.getCount(for: filter)))",
                                    systemImage: "checkmark"
                                )
                            } else {
                                Text("\(filter.flag)  \(filter.displayName)  (\(viewModel.getCount(for: filter)))")
                            }
                        }
                    }
                } label: {
                    HStack(spacing: 8) {
                        Text(viewModel.languageFilter.flag)
                            .font(.system(size: 18))
                        Text(viewModel.languageFilter.displayName)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.dmvText)
                        Spacer()
                        Text("\(viewModel.getCount(for: viewModel.languageFilter))")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.dmvOrange)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color.dmvOrange.opacity(0.12))
                            .cornerRadius(10)
                        Image(systemName: "chevron.down")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.dmvTextSecondary)
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 11)
                    .background(Color.dmvCard)
                    .cornerRadius(DMVTheme.CornerRadius.md)
                    .overlay(
                        RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                            .stroke(Color.dmvBorder, lineWidth: 1.5)
                    )
                }

                // Secondary: flag chips for quick switching
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(LanguageFilter.allCases, id: \.self) { filter in
                            let isActive = viewModel.languageFilter == filter
                            Button {
                                viewModel.languageFilter = filter
                            } label: {
                                Text(filter.flag)
                                    .font(.system(size: 18))
                                    .frame(width: 38, height: 34)
                                    .background(isActive ? Color.dmvOrange : Color.dmvCard)
                                    .cornerRadius(8)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(isActive ? Color.clear : Color.dmvBorder, lineWidth: 1)
                                    )
                            }
                            .buttonStyle(.press)
                        }
                    }
                    .padding(.horizontal, 1)
                }
            }
            .padding()
            .background(Color.dmvBackground)

            // Quiz list
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

            // Banner ad
            AdaptiveBannerAdView()
                .padding(.horizontal)
        }
        .background(Color.dmvBackground)
        .toolbar(.hidden, for: .navigationBar)
        .task {
            await viewModel.loadQuizzes()
        }
        .refreshable {
            await viewModel.loadQuizzes()
        }
    }
}

// MARK: - Filter Chip (kept for potential reuse)

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
