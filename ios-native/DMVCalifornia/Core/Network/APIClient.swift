import Foundation
import Combine

// MARK: - API Error

enum APIError: LocalizedError {
    case invalidURL
    case networkError(Error)
    case decodingError(Error)
    case serverError(statusCode: Int, message: String?)
    case noData

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .decodingError(let error):
            return "Failed to decode response: \(error.localizedDescription)"
        case .serverError(let statusCode, let message):
            return message ?? "Server error: \(statusCode)"
        case .noData:
            return "No data received"
        }
    }
}

// MARK: - Leaderboard Result

struct LeaderboardResult {
    let entries: [LeaderboardEntry]  // Deduplicated, best score per user
    let totalAttempts: Int           // Original total count
    let averageScore: Double         // Average across all attempts
}

// MARK: - API Client Protocol

protocol APIClientProtocol {
    func submitScore(_ submission: LeaderboardSubmission) async throws -> LeaderboardResponse
    func getLeaderboard(quizId: String?) async throws -> LeaderboardResult
}

// MARK: - API Client Implementation

final class APIClient: APIClientProtocol {
    private let session: URLSession
    private let baseURL: String
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    init(
        session: URLSession = .shared,
        baseURL: String = Constants.API.baseURL
    ) {
        self.session = session
        self.baseURL = baseURL
        self.decoder = JSONDecoder()
        self.encoder = JSONEncoder()
    }

    // MARK: - Submit Score

    func submitScore(_ submission: LeaderboardSubmission) async throws -> LeaderboardResponse {
        let url = try buildURL(endpoint: Constants.API.leaderboardEndpoint)

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try encoder.encode(submission)

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.noData
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            let errorMessage = try? decoder.decode(ErrorResponse.self, from: data).message
            throw APIError.serverError(statusCode: httpResponse.statusCode, message: errorMessage)
        }

        do {
            return try decoder.decode(LeaderboardResponse.self, from: data)
        } catch {
            throw APIError.decodingError(error)
        }
    }

    // MARK: - Get Leaderboard

    func getLeaderboard(quizId: String?) async throws -> LeaderboardResult {
        var urlString = baseURL + Constants.API.leaderboardEndpoint
        if let quizId = quizId {
            urlString += "?quizId=\(quizId)"
        }

        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }

        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.noData
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.serverError(statusCode: httpResponse.statusCode, message: nil)
        }

        do {
            let listResponse = try decoder.decode(LeaderboardListResponse.self, from: data)
            let allEntries = listResponse.leaderboard

            // Calculate stats from all entries
            let totalAttempts = allEntries.count
            let averageScore = allEntries.isEmpty ? 0.0 : allEntries.reduce(0.0) { $0 + $1.percentage } / Double(allEntries.count)

            // Deduplicate by name, keeping the best score for each user
            let deduplicatedEntries = deduplicateLeaderboard(allEntries)

            return LeaderboardResult(
                entries: deduplicatedEntries,
                totalAttempts: totalAttempts,
                averageScore: averageScore
            )
        } catch {
            throw APIError.decodingError(error)
        }
    }

    /// Deduplicate leaderboard entries by name, keeping only the highest score per user
    private func deduplicateLeaderboard(_ entries: [LeaderboardEntry]) -> [LeaderboardEntry] {
        var bestByName: [String: LeaderboardEntry] = [:]

        for entry in entries {
            let normalizedName = entry.name.lowercased().trimmingCharacters(in: .whitespaces)
            if let existing = bestByName[normalizedName] {
                // Keep the entry with the higher percentage
                if entry.percentage > existing.percentage {
                    bestByName[normalizedName] = entry
                }
            } else {
                bestByName[normalizedName] = entry
            }
        }

        // Sort by percentage descending
        return bestByName.values.sorted { $0.percentage > $1.percentage }
    }

    // MARK: - Helpers

    private func buildURL(endpoint: String) throws -> URL {
        guard let url = URL(string: baseURL + endpoint) else {
            throw APIError.invalidURL
        }
        return url
    }
}

// MARK: - Error Response

private struct ErrorResponse: Codable {
    let message: String?
}

// MARK: - Shared Instance

extension APIClient {
    static let shared = APIClient()
}
