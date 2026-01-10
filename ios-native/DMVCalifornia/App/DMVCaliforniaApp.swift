import SwiftUI

@main
struct DMVCaliforniaApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var coordinator = AppCoordinator()
    @StateObject private var onboardingManager = OnboardingManager()

    var body: some Scene {
        WindowGroup {
            ZStack {
                ContentView()
                    .environmentObject(coordinator)

                // Onboarding overlay
                if onboardingManager.shouldShowOnboarding {
                    OnboardingView(onboardingManager: onboardingManager)
                        .transition(.opacity)
                        .zIndex(1)
                }
            }
            .animation(.easeInOut(duration: 0.3), value: onboardingManager.shouldShowOnboarding)
        }
    }
}
