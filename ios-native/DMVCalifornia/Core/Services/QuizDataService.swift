import Foundation
import Combine

// MARK: - Data Loading Error

enum DataError: LocalizedError {
    case fileNotFound
    case decodingError(Error)
    case invalidData

    var errorDescription: String? {
        switch self {
        case .fileNotFound:
            return "Data file not found"
        case .decodingError(let error):
            return "Failed to decode data: \(error.localizedDescription)"
        case .invalidData:
            return "Invalid data format"
        }
    }
}

// MARK: - Single Quiz Response (for sign test files)

struct SingleQuizResponse: Decodable {
    let quiz: Quiz
}

// MARK: - Quiz Data Service Protocol

protocol QuizDataServiceProtocol {
    func getQuizzes() async throws -> [Quiz]
    func getQuizById(_ id: String) async throws -> Quiz?
    func getQuizQuestions(quizId: String) async throws -> [Question]
    func getSpanishQuizzes() async throws -> [Quiz]
    func getTurkishQuizzes() async throws -> [Quiz]
    func getChineseQuizzes() async throws -> [Quiz]
    func getArabicQuizzes() async throws -> [Quiz]
    func getArmenianQuizzes() async throws -> [Quiz]
    func getFarsiQuizzes() async throws -> [Quiz]
    func getPunjabiQuizzes() async throws -> [Quiz]
    func getRussianQuizzes() async throws -> [Quiz]
    func getTagalogQuizzes() async throws -> [Quiz]
    func getVietnameseQuizzes() async throws -> [Quiz]
    func getFlashcardSets() async throws -> [FlashcardSet]
    func getSpanishFlashcards() async throws -> [FlashcardSet]
    func getTurkishFlashcards() async throws -> [FlashcardSet]
    func getChineseFlashcards() async throws -> [FlashcardSet]
}

// MARK: - Quiz Data Service Implementation

final class QuizDataService: QuizDataServiceProtocol {
    private let bundle: Bundle
    private let decoder = JSONDecoder()

    // Cache for loaded data
    private var englishQuizzesCache: [Quiz]?
    private var spanishQuizzesCache: [Quiz]?
    private var turkishQuizzesCache: [Quiz]?
    private var chineseQuizzesCache: [Quiz]?
    private var arabicQuizzesCache: [Quiz]?
    private var armenianQuizzesCache: [Quiz]?
    private var farsiQuizzesCache: [Quiz]?
    private var punjabiQuizzesCache: [Quiz]?
    private var russianQuizzesCache: [Quiz]?
    private var tagalogQuizzesCache: [Quiz]?
    private var vietnameseQuizzesCache: [Quiz]?
    private var flashcardsCache: [FlashcardSet]?
    private var spanishFlashcardsCache: [FlashcardSet]?
    private var turkishFlashcardsCache: [FlashcardSet]?
    private var chineseFlashcardsCache: [FlashcardSet]?
    private var allQuizzesLoaded = false

    init(bundle: Bundle = .main) {
        self.bundle = bundle
    }

    // MARK: - Load and Separate Quizzes

    private func loadAndSeparateQuizzes() async throws {
        guard !allQuizzesLoaded else { return }

        // Load main quizzes.json and separate by category
        let allQuizzes = try await loadJSON(filename: "quizzes", type: QuizzesResponse.self).quizzes

        var english: [Quiz] = []
        var spanish: [Quiz] = []

        for quiz in allQuizzes {
            if let category = quiz.category, category.contains("Spanish") {
                spanish.append(quiz)
            } else {
                english.append(quiz)
            }
        }

        englishQuizzesCache = english
        spanishQuizzesCache = spanish
        allQuizzesLoaded = true
    }

    // MARK: - English Quizzes

    func getQuizzes() async throws -> [Quiz] {
        try await loadAndSeparateQuizzes()
        var english = englishQuizzesCache ?? []

        // Motorcycle (Class M) — English-language quizzes
        if let response = try? await loadJSON(filename: "motorcycle-quizzes", type: QuizzesResponse.self) {
            english.append(contentsOf: response.quizzes)
        }
        // Commercial (Class A/B) — English-language quizzes
        if let response = try? await loadJSON(filename: "commercial-quizzes", type: QuizzesResponse.self) {
            english.append(contentsOf: response.quizzes)
        }

        englishQuizzesCache = english
        return english
    }

    func getQuizById(_ id: String) async throws -> Quiz? {
        let allQuizzes = try await getAllQuizzes()
        return allQuizzes.first { $0.id == id }
    }

    func getQuizQuestions(quizId: String) async throws -> [Question] {
        guard let quiz = try await getQuizById(quizId),
              let questions = quiz.questions else {
            throw DataError.invalidData
        }
        return questions
    }

    // MARK: - Spanish Quizzes

    func getSpanishQuizzes() async throws -> [Quiz] {
        // First load from main quizzes.json
        try await loadAndSeparateQuizzes()
        var quizzes = spanishQuizzesCache ?? []

        // Also load Spanish sign test
        if let signTest = try? await loadSingleQuiz(filename: "spanish-sign-test") {
            // Check if not already added
            if !quizzes.contains(where: { $0.id == signTest.id }) {
                quizzes.append(signTest)
            }
        }

        spanishQuizzesCache = quizzes
        return quizzes
    }

    // MARK: - Turkish Quizzes

    func getTurkishQuizzes() async throws -> [Quiz] {
        if let cached = turkishQuizzesCache {
            return cached
        }

        var quizzes: [Quiz] = []

        // Load from turkish-quizzes.json (array format)
        if let response = try? await loadJSON(filename: "turkish-quizzes", type: QuizzesResponse.self) {
            quizzes.append(contentsOf: response.quizzes)
        }

        // Also load Turkish sign test (single quiz format)
        if let signTest = try? await loadSingleQuiz(filename: "turkish-sign-test") {
            quizzes.append(signTest)
        }

        turkishQuizzesCache = quizzes
        return quizzes
    }

    // MARK: - Chinese Quizzes

    func getChineseQuizzes() async throws -> [Quiz] {
        if let cached = chineseQuizzesCache {
            return cached
        }

        do {
            let response = try await loadJSON(filename: "chinese-quizzes", type: QuizzesResponse.self)
            chineseQuizzesCache = response.quizzes
            return response.quizzes
        } catch {
            return []
        }
    }

    // MARK: - Arabic Quizzes

    func getArabicQuizzes() async throws -> [Quiz] {
        if let cached = arabicQuizzesCache { return cached }
        do {
            let response = try await loadJSON(filename: "arabic-quizzes", type: QuizzesResponse.self)
            arabicQuizzesCache = response.quizzes
            return response.quizzes
        } catch { return [] }
    }

    // MARK: - Armenian Quizzes

    func getArmenianQuizzes() async throws -> [Quiz] {
        if let cached = armenianQuizzesCache { return cached }
        do {
            let response = try await loadJSON(filename: "armenian-quizzes", type: QuizzesResponse.self)
            armenianQuizzesCache = response.quizzes
            return response.quizzes
        } catch { return [] }
    }

    // MARK: - Farsi Quizzes

    func getFarsiQuizzes() async throws -> [Quiz] {
        if let cached = farsiQuizzesCache { return cached }
        do {
            let response = try await loadJSON(filename: "farsi-quizzes", type: QuizzesResponse.self)
            farsiQuizzesCache = response.quizzes
            return response.quizzes
        } catch { return [] }
    }

    // MARK: - Punjabi Quizzes

    func getPunjabiQuizzes() async throws -> [Quiz] {
        if let cached = punjabiQuizzesCache { return cached }
        do {
            let response = try await loadJSON(filename: "punjabi-quizzes", type: QuizzesResponse.self)
            punjabiQuizzesCache = response.quizzes
            return response.quizzes
        } catch { return [] }
    }

    // MARK: - Russian Quizzes

    func getRussianQuizzes() async throws -> [Quiz] {
        if let cached = russianQuizzesCache { return cached }
        do {
            let response = try await loadJSON(filename: "russian-quizzes", type: QuizzesResponse.self)
            russianQuizzesCache = response.quizzes
            return response.quizzes
        } catch { return [] }
    }

    // MARK: - Tagalog Quizzes

    func getTagalogQuizzes() async throws -> [Quiz] {
        if let cached = tagalogQuizzesCache { return cached }
        do {
            let response = try await loadJSON(filename: "tagalog-quizzes", type: QuizzesResponse.self)
            tagalogQuizzesCache = response.quizzes
            return response.quizzes
        } catch { return [] }
    }

    // MARK: - Vietnamese Quizzes

    func getVietnameseQuizzes() async throws -> [Quiz] {
        if let cached = vietnameseQuizzesCache { return cached }
        do {
            let response = try await loadJSON(filename: "vietnamese-quizzes", type: QuizzesResponse.self)
            vietnameseQuizzesCache = response.quizzes
            return response.quizzes
        } catch { return [] }
    }

    // MARK: - All Quizzes (Combined)

    func getAllQuizzes() async throws -> [Quiz] {
        async let english = getQuizzes()
        async let spanish = getSpanishQuizzes()
        async let turkish = getTurkishQuizzes()
        async let chinese = getChineseQuizzes()
        async let arabic = getArabicQuizzes()
        async let armenian = getArmenianQuizzes()
        async let farsi = getFarsiQuizzes()
        async let punjabi = getPunjabiQuizzes()
        async let russian = getRussianQuizzes()
        async let tagalog = getTagalogQuizzes()
        async let vietnamese = getVietnameseQuizzes()

        let englishQuizzes = try await english
        let spanishQuizzes = try await spanish
        let turkishQuizzes = try await turkish
        let chineseQuizzes = try await chinese
        let arabicQuizzes = try await arabic
        let armenianQuizzes = try await armenian
        let farsiQuizzes = try await farsi
        let punjabiQuizzes = try await punjabi
        let russianQuizzes = try await russian
        let tagalogQuizzes = try await tagalog
        let vietnameseQuizzes = try await vietnamese

        return englishQuizzes + spanishQuizzes + turkishQuizzes + chineseQuizzes
            + arabicQuizzes + armenianQuizzes + farsiQuizzes + punjabiQuizzes
            + russianQuizzes + tagalogQuizzes + vietnameseQuizzes
    }

    // MARK: - Flashcards (English)

    func getFlashcardSets() async throws -> [FlashcardSet] {
        if let cached = flashcardsCache {
            return cached
        }

        let sets = try await loadJSON(filename: "flashcards", type: [FlashcardSet].self)
        flashcardsCache = sets
        return sets
    }

    // MARK: - Spanish Flashcards

    func getSpanishFlashcards() async throws -> [FlashcardSet] {
        if let cached = spanishFlashcardsCache {
            return cached
        }

        do {
            let sets = try await loadJSON(filename: "spanish-flashcards", type: [FlashcardSet].self)
            spanishFlashcardsCache = sets
            return sets
        } catch {
            return []
        }
    }

    // MARK: - Turkish Flashcards

    func getTurkishFlashcards() async throws -> [FlashcardSet] {
        if let cached = turkishFlashcardsCache {
            return cached
        }

        do {
            let sets = try await loadJSON(filename: "turkish-flashcards", type: [FlashcardSet].self)
            turkishFlashcardsCache = sets
            return sets
        } catch {
            return []
        }
    }

    // MARK: - Chinese Flashcards

    func getChineseFlashcards() async throws -> [FlashcardSet] {
        if let cached = chineseFlashcardsCache {
            return cached
        }

        do {
            let sets = try await loadJSON(filename: "chinese-flashcards", type: [FlashcardSet].self)
            chineseFlashcardsCache = sets
            return sets
        } catch {
            return []
        }
    }

    // MARK: - Helper Methods

    private func loadJSON<T: Decodable>(filename: String, type: T.Type) async throws -> T {
        guard let url = bundle.url(forResource: filename, withExtension: "json") else {
            throw DataError.fileNotFound
        }

        do {
            let data = try Data(contentsOf: url)
            return try decoder.decode(T.self, from: data)
        } catch let decodingError as DecodingError {
            throw DataError.decodingError(decodingError)
        } catch {
            throw DataError.decodingError(error)
        }
    }

    private func loadSingleQuiz(filename: String) async throws -> Quiz {
        let response = try await loadJSON(filename: filename, type: SingleQuizResponse.self)
        return response.quiz
    }

    // MARK: - Cache Management

    func clearCache() {
        englishQuizzesCache = nil
        spanishQuizzesCache = nil
        turkishQuizzesCache = nil
        chineseQuizzesCache = nil
        arabicQuizzesCache = nil
        armenianQuizzesCache = nil
        farsiQuizzesCache = nil
        punjabiQuizzesCache = nil
        russianQuizzesCache = nil
        tagalogQuizzesCache = nil
        vietnameseQuizzesCache = nil
        flashcardsCache = nil
        spanishFlashcardsCache = nil
        turkishFlashcardsCache = nil
        chineseFlashcardsCache = nil
        allQuizzesLoaded = false
    }
}

// MARK: - Shared Instance

extension QuizDataService {
    static let shared = QuizDataService()
}
