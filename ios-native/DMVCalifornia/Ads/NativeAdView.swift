import SwiftUI
import GoogleMobileAds

// MARK: - Native Ad View

struct NativeAdView: View {
    @StateObject private var viewModel = NativeAdViewModel()
    let refreshKey: Int

    init(refreshKey: Int = 0) {
        self.refreshKey = refreshKey
    }

    var body: some View {
        Group {
            if let nativeAd = viewModel.nativeAd {
                NativeAdContentView(nativeAd: nativeAd)
            } else if viewModel.isLoading {
                loadingView
            } else {
                // Placeholder when no ad - still reserve space
                adPlaceholder
            }
        }
        .onChange(of: refreshKey) { _ in
            viewModel.loadAd()
        }
        .onAppear {
            if viewModel.nativeAd == nil && !viewModel.isLoading {
                viewModel.loadAd()
            }
        }
    }

    private var adPlaceholder: some View {
        VStack(spacing: DMVTheme.Spacing.sm) {
            Image(systemName: "rectangle.on.rectangle.angled")
                .font(.system(size: 32))
                .foregroundColor(.dmvTextTertiary)
            Text("Advertisement")
                .font(DMVTheme.Typography.caption)
                .foregroundColor(.dmvTextTertiary)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 120)
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.md)
        .overlay(
            RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                .stroke(Color.dmvBorder, lineWidth: 1)
        )
    }

    private var loadingView: some View {
        HStack {
            ProgressView()
                .scaleEffect(0.8)
            Text("Loading ad...")
                .font(DMVTheme.Typography.caption)
                .foregroundColor(.dmvTextSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.md)
    }
}

// MARK: - Native Ad Content View

struct NativeAdContentView: View {
    let nativeAd: GADNativeAd

    var body: some View {
        VStack(alignment: .leading, spacing: DMVTheme.Spacing.sm) {
            // Ad badge
            HStack {
                Spacer()
                Text("Ad")
                    .font(DMVTheme.Typography.caption2)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color.orange)
                    .cornerRadius(4)
            }

            // Header with icon and headline
            HStack(alignment: .top, spacing: DMVTheme.Spacing.md) {
                // App Icon
                if let icon = nativeAd.icon?.image {
                    Image(uiImage: icon)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 48, height: 48)
                        .cornerRadius(DMVTheme.CornerRadius.sm)
                }

                VStack(alignment: .leading, spacing: 4) {
                    // Headline
                    if let headline = nativeAd.headline {
                        Text(headline)
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.dmvText)
                            .lineLimit(2)
                    }

                    // Advertiser
                    if let advertiser = nativeAd.advertiser {
                        Text(advertiser)
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvTextSecondary)
                    }

                    // Star rating
                    if let rating = nativeAd.starRating?.doubleValue, rating > 0 {
                        HStack(spacing: 2) {
                            ForEach(0..<5) { index in
                                Image(systemName: index < Int(rating) ? "star.fill" : "star")
                                    .font(.system(size: 10))
                                    .foregroundColor(.yellow)
                            }
                            Text(String(format: "%.1f", rating))
                                .font(DMVTheme.Typography.caption2)
                                .foregroundColor(.dmvTextSecondary)
                        }
                    }
                }

                Spacer()
            }

            // Body text
            if let body = nativeAd.body {
                Text(body)
                    .font(DMVTheme.Typography.subheadline)
                    .foregroundColor(.dmvTextSecondary)
                    .lineLimit(3)
            }

            // Media view (if available) - only show if valid aspect ratio
            if nativeAd.mediaContent.hasVideoContent || nativeAd.mediaContent.aspectRatio > 0.1 {
                NativeAdMediaViewRepresentable(mediaContent: nativeAd.mediaContent)
                    .aspectRatio(max(nativeAd.mediaContent.aspectRatio, 1.0), contentMode: .fit)
                    .frame(maxWidth: .infinity)
                    .frame(height: 150)
                    .clipped()
                    .cornerRadius(DMVTheme.CornerRadius.sm)
            }

            // Call to action button
            if let callToAction = nativeAd.callToAction {
                Button(action: {}) {
                    Text(callToAction)
                        .font(DMVTheme.Typography.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, DMVTheme.Spacing.md)
                        .background(Color.dmvOrange)
                        .cornerRadius(DMVTheme.CornerRadius.md)
                }
                .disabled(true) // Actual tap is handled by GAD
            }
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.lg)
        .clipped()
        .dmvShadow(DMVTheme.Shadow.sm)
    }
}

// MARK: - Native Ad Media View Representable

struct NativeAdMediaViewRepresentable: UIViewRepresentable {
    let mediaContent: GADMediaContent

    func makeUIView(context: Context) -> UIView {
        let containerView = UIView()
        containerView.clipsToBounds = true
        containerView.backgroundColor = .clear

        let mediaView = GADMediaView()
        mediaView.mediaContent = mediaContent
        mediaView.contentMode = .scaleAspectFit
        mediaView.clipsToBounds = true
        mediaView.translatesAutoresizingMaskIntoConstraints = false

        containerView.addSubview(mediaView)

        NSLayoutConstraint.activate([
            mediaView.topAnchor.constraint(equalTo: containerView.topAnchor),
            mediaView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            mediaView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            mediaView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor)
        ])

        return containerView
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        if let mediaView = uiView.subviews.first as? GADMediaView {
            mediaView.mediaContent = mediaContent
        }
    }
}

// MARK: - Native Ad View Model

@MainActor
final class NativeAdViewModel: NSObject, ObservableObject {
    @Published var nativeAd: GADNativeAd?
    @Published var isLoading = false

    private var adLoader: GADAdLoader?

    func loadAd() {
        // Clean up previous ad
        nativeAd = nil
        isLoading = true

        guard let rootViewController = getRootViewController() else {
            isLoading = false
            return
        }

        let options = GADMultipleAdsAdLoaderOptions()
        options.numberOfAds = 1

        adLoader = GADAdLoader(
            adUnitID: Constants.AdMob.nativeAdUnitID,
            rootViewController: rootViewController,
            adTypes: [.native],
            options: [options]
        )
        adLoader?.delegate = self
        adLoader?.load(GADRequest())
    }

    private func getRootViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootViewController = windowScene.windows.first?.rootViewController else {
            return nil
        }
        return rootViewController
    }
}

// MARK: - GADAdLoaderDelegate

extension NativeAdViewModel: GADAdLoaderDelegate {
    nonisolated func adLoader(_ adLoader: GADAdLoader, didFailToReceiveAdWithError error: Error) {
        print("[NativeAd] Failed to load: \(error.localizedDescription)")
        Task { @MainActor in
            self.isLoading = false
        }
    }
}

// MARK: - GADNativeAdLoaderDelegate

extension NativeAdViewModel: GADNativeAdLoaderDelegate {
    nonisolated func adLoader(_ adLoader: GADAdLoader, didReceive nativeAd: GADNativeAd) {
        print("[NativeAd] Ad received successfully")
        Task { @MainActor in
            self.nativeAd = nativeAd
            self.isLoading = false
        }
    }
}

// MARK: - Preview

#Preview {
    NativeAdView(refreshKey: 0)
        .padding()
}
