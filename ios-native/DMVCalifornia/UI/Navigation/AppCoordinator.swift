import SwiftUI

// MARK: - Tab Definition

enum Tab: Int, CaseIterable, Identifiable {
    case home
    case quizzes
    case flashcards
    case progress

    var id: Int { rawValue }

    var title: String {
        switch self {
        case .home: return "Home"
        case .quizzes: return "Tests"
        case .flashcards: return "Flashcards"
        case .progress: return "Progress"
        }
    }

    var icon: String {
        switch self {
        case .home: return "house.fill"
        case .quizzes: return "doc.text.fill"
        case .flashcards: return "rectangle.on.rectangle.fill"
        case .progress: return "chart.line.uptrend.xyaxis"
        }
    }
}

// MARK: - App Route

enum AppRoute: Hashable {
    case quizDetail(quizId: String, quizTitle: String)
    case quizResults(result: QuizResult, quizId: String, quizTitle: String)
    case flashcardDeck(flashcardSet: FlashcardSet)
    case bookmarks
    case about
}

// MARK: - App Coordinator

@MainActor
final class AppCoordinator: ObservableObject {
    @Published var selectedTab: Tab = .home
    @Published var navigationPath = NavigationPath()
    @Published var shouldStartRandomQuiz = false

    private let quizDataService: QuizDataServiceProtocol

    init(quizDataService: QuizDataServiceProtocol = QuizDataService.shared) {
        self.quizDataService = quizDataService
        checkForSiriShortcutLaunch()
    }

    // MARK: - Siri Shortcut Handling

    private func checkForSiriShortcutLaunch() {
        if UserDefaults.standard.bool(forKey: "startRandomQuiz") {
            UserDefaults.standard.set(false, forKey: "startRandomQuiz")
            shouldStartRandomQuiz = true
        }
    }

    func startRandomQuiz() async {
        do {
            let quizzes = try await quizDataService.getQuizzes()
            guard let randomQuiz = quizzes.randomElement() else { return }

            switchTab(to: .quizzes)
            try? await Task.sleep(nanoseconds: 100_000_000)
            navigate(to: .quizDetail(quizId: randomQuiz.id, quizTitle: randomQuiz.title))
            shouldStartRandomQuiz = false
        } catch {
            print("[AppCoordinator] Failed to start random quiz: \(error)")
            shouldStartRandomQuiz = false
        }
    }

    // MARK: - Navigation Methods

    func navigate(to route: AppRoute) {
        navigationPath.append(route)
    }

    func popToRoot() {
        navigationPath = NavigationPath()
    }

    func pop() {
        if !navigationPath.isEmpty {
            navigationPath.removeLast()
        }
    }

    func switchTab(to tab: Tab) {
        // Pop to root before switching tabs
        if selectedTab == tab {
            popToRoot()
        } else {
            selectedTab = tab
            navigationPath = NavigationPath()
        }
    }

    // MARK: - Deep Link Handling

    func handleDeepLink(_ url: URL) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true),
              let host = components.host else {
            return
        }

        switch host {
        case "quiz":
            if let quizId = components.queryItems?.first(where: { $0.name == "id" })?.value {
                switchTab(to: .quizzes)
                // Navigate to quiz after a brief delay to allow tab switch
                Task { @MainActor in
                    try? await Task.sleep(nanoseconds: 100_000_000)
                    navigate(to: .quizDetail(quizId: quizId, quizTitle: ""))
                }
            }
        case "flashcards":
            switchTab(to: .flashcards)
        case "progress":
            switchTab(to: .progress)
        default:
            break
        }
    }
}
