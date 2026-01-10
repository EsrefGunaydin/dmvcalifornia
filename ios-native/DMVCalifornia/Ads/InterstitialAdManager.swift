import Foundation
import GoogleMobileAds
import SwiftUI

// MARK: - Interstitial Ad Manager

@MainActor
final class InterstitialAdManager: NSObject, ObservableObject {
    @Published private(set) var isAdReady = false
    @Published private(set) var isLoading = false

    private var interstitialAd: GADInterstitialAd?
    private var questionCount = 0

    static let shared = InterstitialAdManager()

    override init() {
        super.init()
        loadAd()
    }

    // MARK: - Load Ad

    func loadAd() {
        guard !isLoading else { return }

        isLoading = true
        isAdReady = false

        let request = GADRequest()

        GADInterstitialAd.load(
            withAdUnitID: Constants.AdMob.interstitialAdUnitID,
            request: request
        ) { [weak self] ad, error in
            guard let self = self else { return }

            self.isLoading = false

            if let error = error {
                print("[InterstitialAd] Failed to load: \(error.localizedDescription)")
                // Retry after delay
                Task { @MainActor in
                    try? await Task.sleep(nanoseconds: 3_000_000_000) // 3 seconds
                    self.loadAd()
                }
                return
            }

            self.interstitialAd = ad
            self.interstitialAd?.fullScreenContentDelegate = self
            self.isAdReady = true
            print("[InterstitialAd] Ad loaded successfully")
        }
    }

    // MARK: - Show Ad

    func showAd() {
        guard let ad = interstitialAd, isAdReady else {
            print("[InterstitialAd] Ad not ready, loading new ad")
            loadAd()
            return
        }

        guard let rootViewController = getRootViewController() else {
            print("[InterstitialAd] No root view controller found")
            return
        }

        ad.present(fromRootViewController: rootViewController)
    }

    // MARK: - Track Question Progress

    func trackQuestionAnswered() {
        questionCount += 1

        // Show ad every N questions
        if questionCount >= Constants.Quiz.interstitialAdInterval {
            questionCount = 0
            showAd()
        }
    }

    func resetQuestionCount() {
        questionCount = 0
    }

    // MARK: - Helpers

    private func getRootViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootViewController = windowScene.windows.first?.rootViewController else {
            return nil
        }

        // Get the topmost presented view controller
        var topController = rootViewController
        while let presented = topController.presentedViewController {
            topController = presented
        }

        return topController
    }
}

// MARK: - GADFullScreenContentDelegate

extension InterstitialAdManager: GADFullScreenContentDelegate {
    nonisolated func adDidRecordImpression(_ ad: GADFullScreenPresentingAd) {
        print("[InterstitialAd] Impression recorded")
    }

    nonisolated func adDidRecordClick(_ ad: GADFullScreenPresentingAd) {
        print("[InterstitialAd] Click recorded")
    }

    nonisolated func ad(_ ad: GADFullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("[InterstitialAd] Failed to present: \(error.localizedDescription)")
        Task { @MainActor in
            self.loadAd()
        }
    }

    nonisolated func adWillPresentFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("[InterstitialAd] Will present full screen")
        // Notify to pause timer
        NotificationCenter.default.post(name: .interstitialAdWillPresent, object: nil)
    }

    nonisolated func adWillDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("[InterstitialAd] Will dismiss full screen")
    }

    nonisolated func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("[InterstitialAd] Did dismiss full screen")
        // Notify to resume timer
        NotificationCenter.default.post(name: .interstitialAdDidDismiss, object: nil)
        // Preload next ad
        Task { @MainActor in
            self.loadAd()
        }
    }
}

// MARK: - Notification Names

extension Notification.Name {
    static let interstitialAdWillPresent = Notification.Name("interstitialAdWillPresent")
    static let interstitialAdDidDismiss = Notification.Name("interstitialAdDidDismiss")
}

// MARK: - SwiftUI Environment Key

struct InterstitialAdManagerKey: EnvironmentKey {
    static let defaultValue = InterstitialAdManager.shared
}

extension EnvironmentValues {
    var interstitialAdManager: InterstitialAdManager {
        get { self[InterstitialAdManagerKey.self] }
        set { self[InterstitialAdManagerKey.self] = newValue }
    }
}
