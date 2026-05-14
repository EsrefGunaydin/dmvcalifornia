import SwiftUI
import Combine

@MainActor
final class IntersectionLandingViewModel: ObservableObject {
    @Published var levels: [IntersectionLevel] = []
    @Published var results: [String: IntersectionResult] = [:]
    @Published var isLoading = true
    @Published var errorMessage: String?

    private let dataService: IntersectionDataServiceProtocol
    private let storageService: StorageServiceProtocol

    init(
        dataService: IntersectionDataServiceProtocol = IntersectionDataService.shared,
        storageService: StorageServiceProtocol = StorageService.shared
    ) {
        self.dataService = dataService
        self.storageService = storageService
    }

    func load() async {
        isLoading = true
        errorMessage = nil
        do {
            levels = try await dataService.getLevels()
        } catch {
            errorMessage = "Couldn't load the intersection puzzles."
        }
        results = await storageService.getIntersectionResults()
        isLoading = false
    }

    /// Levels unlock sequentially — the next one opens once the previous is solved.
    func isUnlocked(_ index: Int) -> Bool {
        guard index > 0 else { return true }
        guard levels.indices.contains(index - 1) else { return false }
        return results[levels[index - 1].id] != nil
    }

    func stars(for level: IntersectionLevel) -> Int {
        results[level.id]?.stars ?? 0
    }

    func nextLevelId(after level: IntersectionLevel) -> String? {
        guard let idx = levels.firstIndex(where: { $0.id == level.id }),
              levels.indices.contains(idx + 1) else { return nil }
        return levels[idx + 1].id
    }

    var solvedCount: Int { results.count }
    var totalStars: Int { results.values.reduce(0) { $0 + $1.stars } }
    var maxStars: Int { levels.count * 3 }
}
