import SwiftUI

struct BookmarksView: View {
    @StateObject private var viewModel = BookmarksViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading {
                LoadingView("Loading bookmarks...")
            } else if viewModel.bookmarks.isEmpty {
                EmptyStateView(
                    icon: "bookmark",
                    title: "No Bookmarks",
                    message: "Questions you bookmark during quizzes will appear here."
                )
            } else {
                List {
                    ForEach(viewModel.bookmarks) { bookmark in
                        BookmarkRow(bookmark: bookmark, isExpanded: viewModel.expandedIds.contains(bookmark.id)) {
                            viewModel.toggleExpanded(bookmark.id)
                        }
                    }
                    .onDelete { indexSet in
                        Task {
                            await viewModel.deleteBookmarks(at: indexSet)
                        }
                    }
                }
                .listStyle(.plain)
            }
        }
        .background(Color.dmvBackground)
        .navigationTitle("Bookmarks")
        .task {
            await viewModel.loadBookmarks()
        }
    }
}

// MARK: - Bookmark Row

struct BookmarkRow: View {
    let bookmark: BookmarkedQuestion
    let isExpanded: Bool
    let onTap: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: DMVTheme.Spacing.sm) {
            // Header
            Button(action: onTap) {
                HStack {
                    VStack(alignment: .leading, spacing: DMVTheme.Spacing.xs) {
                        if let category = bookmark.category {
                            Text(category)
                                .font(DMVTheme.Typography.caption)
                                .foregroundColor(.dmvOrange)
                        }

                        Text(bookmark.question)
                            .font(DMVTheme.Typography.subheadline)
                            .foregroundColor(.dmvText)
                            .lineLimit(isExpanded ? nil : 2)
                    }

                    Spacer()

                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .foregroundColor(.dmvTextSecondary)
                }
            }
            .buttonStyle(PlainButtonStyle())

            // Expanded Content
            if isExpanded {
                VStack(alignment: .leading, spacing: DMVTheme.Spacing.sm) {
                    ForEach(Array(bookmark.options.enumerated()), id: \.offset) { index, option in
                        HStack(alignment: .top, spacing: DMVTheme.Spacing.sm) {
                            Image(systemName: index == bookmark.correctAnswer ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(index == bookmark.correctAnswer ? .dmvSuccess : .dmvTextSecondary)
                                .font(.system(size: 14))

                            Text(option)
                                .font(DMVTheme.Typography.body)
                                .foregroundColor(index == bookmark.correctAnswer ? .dmvSuccess : .dmvText)
                        }
                    }

                    if let explanation = bookmark.explanation {
                        Text(explanation)
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvTextSecondary)
                            .padding(.top, DMVTheme.Spacing.xs)
                    }
                }
                .padding(.top, DMVTheme.Spacing.sm)
            }
        }
        .padding(.vertical, DMVTheme.Spacing.sm)
    }
}

// MARK: - ViewModel

@MainActor
final class BookmarksViewModel: ObservableObject {
    @Published var bookmarks: [BookmarkedQuestion] = []
    @Published var expandedIds: Set<String> = []
    @Published var isLoading = false

    private let storageService: StorageServiceProtocol

    init(storageService: StorageServiceProtocol = StorageService.shared) {
        self.storageService = storageService
    }

    func loadBookmarks() async {
        isLoading = true
        bookmarks = await storageService.getBookmarks()
        isLoading = false
    }

    func toggleExpanded(_ id: String) {
        if expandedIds.contains(id) {
            expandedIds.remove(id)
        } else {
            expandedIds.insert(id)
        }
    }

    func deleteBookmarks(at indexSet: IndexSet) async {
        for index in indexSet {
            let bookmark = bookmarks[index]
            try? await storageService.removeBookmark(questionId: bookmark.questionId, quizId: bookmark.quizId)
        }
        bookmarks.remove(atOffsets: indexSet)
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        BookmarksView()
    }
}
