import SwiftUI
import GoogleMobileAds

// MARK: - Banner Ad View

struct BannerAdView: View {
    let adSize: GADAdSize

    init(adSize: GADAdSize = GADAdSizeBanner) {
        self.adSize = adSize
    }

    var body: some View {
        BannerAdViewRepresentable(adSize: adSize)
            .frame(
                width: adSize.size.width,
                height: adSize.size.height
            )
    }
}

// MARK: - UIViewRepresentable for GADBannerView

struct BannerAdViewRepresentable: UIViewRepresentable {
    let adSize: GADAdSize

    func makeUIView(context: Context) -> GADBannerView {
        let bannerView = GADBannerView(adSize: adSize)
        bannerView.adUnitID = Constants.AdMob.bannerAdUnitID
        bannerView.rootViewController = getRootViewController()
        bannerView.delegate = context.coordinator
        bannerView.load(GADRequest())
        return bannerView
    }

    func updateUIView(_ uiView: GADBannerView, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    private func getRootViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootViewController = windowScene.windows.first?.rootViewController else {
            return nil
        }
        return rootViewController
    }

    // MARK: - Coordinator

    class Coordinator: NSObject, GADBannerViewDelegate {
        func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {
            print("[BannerAd] Ad received successfully")
        }

        func bannerView(_ bannerView: GADBannerView, didFailToReceiveAdWithError error: Error) {
            print("[BannerAd] Failed to receive ad: \(error.localizedDescription)")
        }

        func bannerViewDidRecordImpression(_ bannerView: GADBannerView) {
            print("[BannerAd] Impression recorded")
        }

        func bannerViewDidRecordClick(_ bannerView: GADBannerView) {
            print("[BannerAd] Click recorded")
        }
    }
}

// MARK: - Adaptive Banner Ad View

struct AdaptiveBannerAdView: View {
    @State private var adSize: GADAdSize = GADAdSizeBanner

    var body: some View {
        GeometryReader { geometry in
            let adWidth = geometry.size.width
            BannerAdViewRepresentable(
                adSize: GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth(adWidth)
            )
            .onAppear {
                adSize = GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth(adWidth)
            }
        }
        .frame(height: 50)
    }
}

// MARK: - Preview

#Preview {
    VStack {
        Spacer()
        BannerAdView()
        AdaptiveBannerAdView()
    }
}
