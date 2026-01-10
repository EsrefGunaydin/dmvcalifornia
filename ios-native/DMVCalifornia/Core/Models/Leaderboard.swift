import Foundation

// MARK: - Leaderboard Models

struct LeaderboardEntry: Identifiable, Codable {
    let id: String
    let quizId: String
    let date: String
    let name: String
    let email: String?
    let points: Int
    let percentage: Double
    let completedAt: String

    enum CodingKeys: String, CodingKey {
        case id, quizId, date, name, email, points, percentage, completedAt
        case mongoId = "_id"
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)

        // Handle id from either "id" or "_id" field
        if let idValue = try? container.decode(String.self, forKey: .id) {
            self.id = idValue
        } else if let mongoIdValue = try? container.decode(String.self, forKey: .mongoId) {
            self.id = mongoIdValue
        } else {
            // Generate a unique ID if neither exists
            self.id = UUID().uuidString
        }

        self.date = try container.decode(String.self, forKey: .date)
        self.name = try container.decode(String.self, forKey: .name)
        self.email = try container.decodeIfPresent(String.self, forKey: .email)
        self.points = try container.decode(Int.self, forKey: .points)
        self.percentage = try container.decode(Double.self, forKey: .percentage)
        self.completedAt = try container.decode(String.self, forKey: .completedAt)

        // Handle quizId as either String or Int
        if let intQuizId = try? container.decode(Int.self, forKey: .quizId) {
            self.quizId = String(intQuizId)
        } else {
            self.quizId = try container.decode(String.self, forKey: .quizId)
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(quizId, forKey: .quizId)
        try container.encode(date, forKey: .date)
        try container.encode(name, forKey: .name)
        try container.encodeIfPresent(email, forKey: .email)
        try container.encode(points, forKey: .points)
        try container.encode(percentage, forKey: .percentage)
        try container.encode(completedAt, forKey: .completedAt)
    }

    init(
        id: String = UUID().uuidString,
        quizId: String,
        date: String,
        name: String,
        email: String? = nil,
        points: Int,
        percentage: Double,
        completedAt: String
    ) {
        self.id = id
        self.quizId = quizId
        self.date = date
        self.name = name
        self.email = email
        self.points = points
        self.percentage = percentage
        self.completedAt = completedAt
    }
}

// MARK: - Leaderboard Submission

struct LeaderboardSubmission: Codable {
    let quizId: String
    let name: String
    let email: String?
    let points: Int
    let percentage: Double
    let completedAt: String
    let date: String

    init(quizId: String, name: String, email: String?, points: Int, percentage: Double) {
        self.quizId = quizId
        self.name = name
        self.email = email
        self.points = points
        self.percentage = percentage

        let formatter = ISO8601DateFormatter()
        self.completedAt = formatter.string(from: Date())

        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MMM d, yyyy"
        self.date = dateFormatter.string(from: Date())
    }
}

// MARK: - API Response

struct LeaderboardResponse: Codable {
    let success: Bool
    let message: String?
}

struct LeaderboardListResponse: Codable {
    let leaderboard: [LeaderboardEntry]
}
