import Foundation

// MARK: - Quiz Models

struct Quiz: Identifiable, Codable, Hashable {
    let id: String
    let title: String
    let description: String
    let slug: String
    let category: String?
    let passingScore: Int?
    let timeLimit: Double?  // Changed to Double to handle decimal values like 22.5
    var questions: [Question]?

    // Computed property for questions count
    var questionsCount: Int {
        questions?.count ?? 0
    }

    // Computed property for time limit in minutes (rounded)
    var timeLimitMinutes: Int {
        guard let timeLimit = timeLimit else { return 0 }
        return Int(timeLimit.rounded())
    }

    /// Display title for cards - shortened version without "California" prefix
    /// "California DMV Simulation Test #1" → "DMV Simulation Test 1"
    var displayTitle: String {
        var result = title
        // Remove "California " prefix
        if result.hasPrefix("California ") {
            result = String(result.dropFirst(11))
        }
        // Remove "#" before numbers (e.g., "#1" → "1")
        result = result.replacingOccurrences(of: "#", with: "")
        return result
    }

    enum CodingKeys: String, CodingKey {
        case id, title, description, slug, category, passingScore, timeLimit, questions
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)

        // Handle id as either String or Int
        if let intId = try? container.decode(Int.self, forKey: .id) {
            self.id = String(intId)
        } else {
            self.id = try container.decode(String.self, forKey: .id)
        }

        self.title = try container.decode(String.self, forKey: .title)
        self.description = try container.decode(String.self, forKey: .description)
        self.slug = try container.decode(String.self, forKey: .slug)
        self.category = try container.decodeIfPresent(String.self, forKey: .category)
        self.passingScore = try container.decodeIfPresent(Int.self, forKey: .passingScore)
        self.timeLimit = try container.decodeIfPresent(Double.self, forKey: .timeLimit)
        self.questions = try container.decodeIfPresent([Question].self, forKey: .questions)
    }

    init(
        id: String,
        title: String,
        description: String,
        slug: String,
        category: String? = nil,
        passingScore: Int? = nil,
        timeLimit: Double? = nil,
        questions: [Question]? = nil
    ) {
        self.id = id
        self.title = title
        self.description = description
        self.slug = slug
        self.category = category
        self.passingScore = passingScore
        self.timeLimit = timeLimit
        self.questions = questions
    }
}

struct Question: Identifiable, Codable, Hashable {
    let id: Int
    let question: String
    let options: [String]
    let correctAnswer: Int
    let explanation: String?
    let category: String?
    let difficulty: String?
    let image: String?

    var hasImage: Bool {
        guard let image = image else { return false }
        return !image.isEmpty
    }

    /// Returns the image name for loading from bundle
    /// Converts paths like "/images/traffic-signs-2/stop.jpeg" to "traffic-signs-2/stop"
    var bundleImageName: String? {
        guard let image = image, !image.isEmpty else { return nil }
        // Remove /images/ prefix and file extension
        var name = image
        if name.hasPrefix("/images/") {
            name = String(name.dropFirst(8))
        }
        // Remove file extension
        if let dotIndex = name.lastIndex(of: ".") {
            name = String(name[..<dotIndex])
        }
        return name
    }
}

// MARK: - Quiz Response (for JSON parsing)

struct QuizzesResponse: Codable {
    let quizzes: [Quiz]
}
