import SwiftUI

struct AboutView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: DMVTheme.Spacing.xl) {
                // Logo
                VStack(spacing: DMVTheme.Spacing.md) {
                    Image(systemName: "car.fill")
                        .font(.system(size: 64))
                        .foregroundColor(.dmvOrange)

                    Text("DMV California")
                        .font(DMVTheme.Typography.title)
                        .foregroundColor(.dmvText)

                    Text("Your DMV Success Partner")
                        .font(DMVTheme.Typography.subheadline)
                        .foregroundColor(.dmvTextSecondary)
                }
                .padding(.vertical, DMVTheme.Spacing.xl)

                // Features
                DMVCard {
                    VStack(alignment: .leading, spacing: DMVTheme.Spacing.md) {
                        Text("Features")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.dmvText)

                        FeatureItem(icon: "doc.text.fill", title: "Practice Tests", description: "Real DMV questions to help you prepare")
                        FeatureItem(icon: "rectangle.on.rectangle.fill", title: "Flashcards", description: "Quick study cards for memorization")
                        FeatureItem(icon: "chart.line.uptrend.xyaxis", title: "Progress Tracking", description: "Track your improvement over time")
                        FeatureItem(icon: "bookmark.fill", title: "Bookmarks", description: "Save questions for later review")
                        FeatureItem(icon: "globe", title: "Multi-language", description: "English, Spanish, and Turkish")
                    }
                }

                // Disclaimer
                DMVCard {
                    VStack(alignment: .leading, spacing: DMVTheme.Spacing.sm) {
                        Text("Disclaimer")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.dmvText)

                        Text("This app is designed to help you prepare for the California DMV written test. The questions are based on the California Driver Handbook and are for practice purposes only. This app is not affiliated with the California Department of Motor Vehicles.")
                            .font(DMVTheme.Typography.body)
                            .foregroundColor(.dmvTextSecondary)
                    }
                }

                // Version (dynamic from bundle)
                Text("Version \(Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.5")")
                    .font(DMVTheme.Typography.caption)
                    .foregroundColor(.dmvTextTertiary)
            }
            .padding()
        }
        .background(Color.dmvBackground)
        .navigationTitle("About")
    }
}

// MARK: - Feature Item

struct FeatureItem: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: DMVTheme.Spacing.md) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(.dmvOrange)
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(DMVTheme.Typography.subheadline)
                    .foregroundColor(.dmvText)

                Text(description)
                    .font(DMVTheme.Typography.caption)
                    .foregroundColor(.dmvTextSecondary)
            }
        }
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        AboutView()
    }
}
