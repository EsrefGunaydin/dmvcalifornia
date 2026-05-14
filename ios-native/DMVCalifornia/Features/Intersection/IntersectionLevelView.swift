import SwiftUI
import Combine

// MARK: - Level View Model

@MainActor
final class IntersectionLevelViewModel: ObservableObject {
    @Published var level: IntersectionLevel?
    @Published var levelNumber = 0
    @Published var nextLevelId: String?
    @Published var isLoading = true
    @Published var errorMessage: String?

    private let dataService: IntersectionDataServiceProtocol
    private let levelId: String

    init(levelId: String, dataService: IntersectionDataServiceProtocol = IntersectionDataService.shared) {
        self.levelId = levelId
        self.dataService = dataService
    }

    func load() async {
        isLoading = true
        errorMessage = nil
        do {
            let levels = try await dataService.getLevels()
            guard let idx = levels.firstIndex(where: { $0.id == levelId }) else {
                errorMessage = "This puzzle could not be found."
                isLoading = false
                return
            }
            level = levels[idx]
            levelNumber = idx + 1
            nextLevelId = levels.indices.contains(idx + 1) ? levels[idx + 1].id : nil
        } catch {
            errorMessage = "Couldn't load this puzzle."
        }
        isLoading = false
    }
}

// MARK: - Level View

struct IntersectionLevelView: View {
    @StateObject private var viewModel: IntersectionLevelViewModel

    init(levelId: String) {
        _viewModel = StateObject(wrappedValue: IntersectionLevelViewModel(levelId: levelId))
    }

    var body: some View {
        ScrollView {
            VStack(spacing: DMVTheme.Spacing.lg) {
                if viewModel.isLoading {
                    ProgressView()
                        .padding(.top, DMVTheme.Spacing.xxxl)
                } else if let level = viewModel.level {
                    header(for: level)
                    IntersectionGameView(level: level, nextLevelId: viewModel.nextLevelId)
                } else {
                    Text(viewModel.errorMessage ?? "Something went wrong.")
                        .font(DMVTheme.Typography.subheadline)
                        .foregroundColor(.dmvTextSecondary)
                        .padding(.top, DMVTheme.Spacing.xxxl)
                }
            }
            .padding()
        }
        .background(Color.dmvBackground)
        .navigationTitle(viewModel.isLoading ? "Loading…" : "Level \(viewModel.levelNumber)")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(Color.dmvOrange, for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .task { await viewModel.load() }
    }

    private func header(for level: IntersectionLevel) -> some View {
        VStack(alignment: .leading, spacing: DMVTheme.Spacing.xs) {
            Text(level.intersectionType.displayName.uppercased())
                .font(DMVTheme.Typography.caption2)
                .fontWeight(.bold)
                .foregroundColor(.dmvOrange)
            Text(level.title)
                .font(DMVTheme.Typography.title3)
                .fontWeight(.bold)
                .foregroundColor(.dmvText)
            Text(level.description)
                .font(DMVTheme.Typography.subheadline)
                .foregroundColor(.dmvTextSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.lg)
        .dmvShadow(DMVTheme.Shadow.sm)
    }
}
