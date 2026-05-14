import Foundation

// MARK: - Intersection Data Service
// Loads the bundled intersection-levels.json into typed models.
// Mirrors the loadJSON pattern used by QuizDataService.

protocol IntersectionDataServiceProtocol {
    func getLevels() async throws -> [IntersectionLevel]
    func getLevel(id: String) async throws -> IntersectionLevel?
}

final class IntersectionDataService: IntersectionDataServiceProtocol {
    private let bundle: Bundle
    private let decoder = JSONDecoder()
    private var cache: [IntersectionLevel]?

    init(bundle: Bundle = .main) {
        self.bundle = bundle
    }

    func getLevels() async throws -> [IntersectionLevel] {
        if let cache {
            return cache
        }
        guard let url = bundle.url(forResource: "intersection-levels", withExtension: "json") else {
            throw DataError.fileNotFound
        }
        do {
            let data = try Data(contentsOf: url)
            let response = try decoder.decode(IntersectionLevelsResponse.self, from: data)
            cache = response.levels
            return response.levels
        } catch let decodingError as DecodingError {
            throw DataError.decodingError(decodingError)
        } catch {
            throw DataError.decodingError(error)
        }
    }

    func getLevel(id: String) async throws -> IntersectionLevel? {
        let levels = try await getLevels()
        return levels.first { $0.id == id }
    }
}

// MARK: - Shared Instance

extension IntersectionDataService {
    static let shared = IntersectionDataService()
}
