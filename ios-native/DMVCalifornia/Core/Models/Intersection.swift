import Foundation

// MARK: - Intersection puzzle game models
// Mirrors the web app's src/types/intersection.ts so the shared
// intersection-levels.json decodes identically on both platforms.

enum IntersectionType: String, Codable {
    case fourWayStop = "four-way-stop"
    case twoWayStop = "two-way-stop"
    case uncontrolled
    case tIntersection = "t-intersection"
    case signal

    /// Human-readable label, e.g. "four way stop".
    var displayName: String {
        rawValue.replacingOccurrences(of: "-", with: " ")
    }
}

enum AgentType: String, Codable {
    case car, pedestrian, cyclist, emergency
}

enum Direction: String, Codable {
    case north, south, east, west
}

enum Intent: String, Codable {
    case straight, left, right
}

enum AgentLane: String, Codable {
    case left, right, bike
}

struct Agent: Codable, Hashable, Identifiable {
    let id: String
    let type: AgentType
    let approachFrom: Direction
    let intent: Intent
    let lane: AgentLane?
    let label: String?
}

struct IntersectionLevel: Codable, Hashable, Identifiable {
    let id: String
    let title: String
    let description: String
    let intersectionType: IntersectionType
    let agents: [Agent]
    /// Agent ids in the legal order they may proceed.
    let correctOrder: [String]
    /// agentId -> why it goes when it does (shown in the recap).
    let stepRules: [String: String]
    /// "<tappedId>><shouldBeId>" or "*" -> collision rule text.
    let collisionRules: [String: String]
    let cvcReference: String?
}

/// JSON wrapper — file shape is { "levels": [...] }.
struct IntersectionLevelsResponse: Codable {
    let levels: [IntersectionLevel]
}

/// Persisted per-level result (best run is kept).
struct IntersectionResult: Codable, Hashable {
    let levelId: String
    let stars: Int          // 1...3
    let attempts: Int       // failed attempts before solving
    let solvedAt: Date
}

/// Star rating from the number of failed attempts before solving.
func starsForAttempts(_ attempts: Int) -> Int {
    if attempts <= 1 { return 3 }
    if attempts == 2 { return 2 }
    return 1
}
