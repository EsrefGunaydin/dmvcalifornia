import Foundation

// MARK: - Flashcard Models

struct Flashcard: Identifiable, Codable, Hashable {
    let id: Int
    let question: String
    let answer: String
}

struct FlashcardSet: Identifiable, Codable, Hashable {
    let id: String
    let title: String
    let description: String
    let category: String
    let slug: String
    let language: String?
    let cards: [Flashcard]

    var cardsCount: Int {
        cards.count
    }

    /// Display title for cards - "DMV Flashcards 1", "DMV Flashcards 2", etc.
    var displayTitle: String {
        // Extract number from ID (e.g., "dmv-flashcards-1" -> "1")
        if let lastComponent = id.split(separator: "-").last,
           let number = Int(lastComponent) {
            return "DMV Flashcards \(number)"
        }
        return title
    }
}
