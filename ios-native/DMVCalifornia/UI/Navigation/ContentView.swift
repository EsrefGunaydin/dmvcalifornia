import SwiftUI

// MARK: - Content View (Main App Container)

struct ContentView: View {
    @EnvironmentObject private var coordinator: AppCoordinator

    var body: some View {
        TabView(selection: $coordinator.selectedTab) {
            // Home Tab
            NavigationStack(path: $coordinator.navigationPath) {
                HomeView()
                    .navigationDestination(for: AppRoute.self) { route in
                        destinationView(for: route)
                    }
            }
            .tabItem {
                Label(Tab.home.title, systemImage: Tab.home.icon)
            }
            .tag(Tab.home)

            // Quizzes Tab
            NavigationStack(path: $coordinator.navigationPath) {
                QuizzesView()
                    .navigationDestination(for: AppRoute.self) { route in
                        destinationView(for: route)
                    }
            }
            .tabItem {
                Label(Tab.quizzes.title, systemImage: Tab.quizzes.icon)
            }
            .tag(Tab.quizzes)

            // Flashcards Tab
            NavigationStack(path: $coordinator.navigationPath) {
                FlashcardsListView()
                    .navigationDestination(for: AppRoute.self) { route in
                        destinationView(for: route)
                    }
            }
            .tabItem {
                Label(Tab.flashcards.title, systemImage: Tab.flashcards.icon)
            }
            .tag(Tab.flashcards)

            // Progress Tab
            NavigationStack(path: $coordinator.navigationPath) {
                ProgressScreenView()
                    .navigationDestination(for: AppRoute.self) { route in
                        destinationView(for: route)
                    }
            }
            .tabItem {
                Label(Tab.progress.title, systemImage: Tab.progress.icon)
            }
            .tag(Tab.progress)
        }
        .tint(.dmvOrange)
        .task {
            // Handle Siri shortcut launch
            if coordinator.shouldStartRandomQuiz {
                await coordinator.startRandomQuiz()
            }
        }
        .onChange(of: coordinator.shouldStartRandomQuiz) { shouldStart in
            if shouldStart {
                Task {
                    await coordinator.startRandomQuiz()
                }
            }
        }
    }

    // MARK: - Destination View Builder

    @ViewBuilder
    private func destinationView(for route: AppRoute) -> some View {
        switch route {
        case .quizDetail(let quizId, let quizTitle):
            QuizDetailView(quizId: quizId, quizTitle: quizTitle)
        case .quizResults(let result, let quizId, let quizTitle):
            QuizResultsView(result: result, quizId: quizId, quizTitle: quizTitle)
        case .flashcardDeck(let flashcardSet):
            FlashcardDeckView(flashcardSet: flashcardSet)
        case .bookmarks:
            BookmarksView()
        case .about:
            AboutView()
        case .intersectionLanding:
            IntersectionLandingView()
        case .intersectionLevel(let levelId):
            IntersectionLevelView(levelId: levelId)
        }
    }
}

// MARK: - Preview

#Preview {
    ContentView()
        .environmentObject(AppCoordinator())
}
