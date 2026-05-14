import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel = HomeViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Header with badge
                headerSection

                // Gradient bar
                LinearGradient(
                    colors: [.dmvOrange, .dmvTeal],
                    startPoint: .leading,
                    endPoint: .trailing
                )
                .frame(height: 4)

                VStack(spacing: DMVTheme.Spacing.xl) {
                    // Quick Actions
                    quickActionsSection

                    // Intersection game
                    intersectionSection

                    // Features
                    featuresSection

                    // CTA
                    ctaSection

                    // Rate & Share
                    rateShareSection
                }
                .padding()
            }
        }
        .background(Color.dmvBackground)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                Text("DMV California")
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(.white)
            }
        }
        .toolbarBackground(Color.dmvOrange, for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .task {
            await viewModel.loadData()
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.xs) {
                Text("DMV California")
                    .font(DMVTheme.Typography.title)
                    .foregroundColor(.dmvOrange)

                Text("Your DMV Success Partner")
                    .font(DMVTheme.Typography.subheadline)
                    .foregroundColor(.dmvTextSecondary)
            }

            Spacer()

            // Success Guaranteed Badge
            SuccessGuaranteedBadge()
        }
        .padding()
        .background(Color.dmvCard)
    }

    // MARK: - Quick Actions Section

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: DMVTheme.Spacing.md) {
            Text("Quick Start")
                .font(DMVTheme.Typography.title3)
                .fontWeight(.bold)
                .foregroundColor(.dmvText)

            HStack(spacing: DMVTheme.Spacing.md) {
                // Practice Tests - Filled style
                HomeQuickActionCard(
                    title: "Practice Tests",
                    subtitle: "\(viewModel.totalQuizzes) Available",
                    icon: "doc.text.fill",
                    style: .filled
                ) {
                    coordinator.switchTab(to: .quizzes)
                }

                // Flashcards - Outline style
                HomeQuickActionCard(
                    title: "Flashcards",
                    subtitle: "\(viewModel.totalFlashcards) Sets",
                    icon: "rectangle.on.rectangle",
                    style: .outline
                ) {
                    coordinator.switchTab(to: .flashcards)
                }
            }
        }
    }

    // MARK: - Intersection Game Section

    private var intersectionSection: some View {
        Button {
            coordinator.navigate(to: .intersectionLanding)
        } label: {
            HStack(spacing: DMVTheme.Spacing.md) {
                ZStack {
                    Circle()
                        .fill(Color.white.opacity(0.2))
                        .frame(width: 56, height: 56)
                    Image(systemName: "arrow.triangle.branch")
                        .font(.system(size: 26, weight: .bold))
                        .foregroundColor(.white)
                }

                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: DMVTheme.Spacing.sm) {
                        Text("Intersection")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.white)
                        Text("NEW")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.dmvOrange)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.white)
                            .cornerRadius(DMVTheme.CornerRadius.sm)
                    }
                    Text("Right-of-way puzzles — who goes first?")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.white.opacity(0.9))
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white.opacity(0.8))
            }
            .padding()
            .frame(maxWidth: .infinity)
            .background(
                LinearGradient(
                    colors: [.dmvOrange, .dmvTeal],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .cornerRadius(DMVTheme.CornerRadius.lg)
            .dmvShadow(DMVTheme.Shadow.sm)
        }
        .buttonStyle(PlainButtonStyle())
    }

    // MARK: - Features Section

    private var featuresSection: some View {
        VStack(spacing: DMVTheme.Spacing.md) {
            FeatureRow(
                title: "Official DMV Questions",
                description: "Practice with questions from the official California DMV handbook"
            )
            .cardEntrance(index: 0)

            FeatureRow(
                title: "Instant Feedback",
                description: "Get detailed explanations for every answer"
            )
            .cardEntrance(index: 1)

            FeatureRow(
                title: "Track Your Progress",
                description: "Compete with others on the leaderboard"
            )
            .cardEntrance(index: 2)

            FeatureRow(
                title: "Pass Guarantee",
                description: "Practice until you're ready to ace the real test"
            )
            .cardEntrance(index: 3)
        }
    }

    // MARK: - CTA Section

    private var ctaSection: some View {
        VStack(spacing: DMVTheme.Spacing.md) {
            // Animated car icon
            ZStack {
                // Glow effect
                Circle()
                    .fill(Color.dmvOrange.opacity(0.2))
                    .frame(width: 100, height: 100)
                    .blur(radius: 20)

                Image(systemName: "car.fill")
                    .font(.system(size: 48))
                    .foregroundColor(.dmvOrange)
                    .floating(yOffset: 6, duration: 2.5)
            }
            .heroAnimation()

            Text("Ready to Get Started?")
                .font(DMVTheme.Typography.title2)
                .foregroundColor(.dmvText)
                .staggeredAnimation(index: 1)

            Text("Start practicing now and ace your California DMV written test!")
                .font(DMVTheme.Typography.subheadline)
                .foregroundColor(.dmvTextSecondary)
                .multilineTextAlignment(.center)
                .staggeredAnimation(index: 2)

            // Pulsing start button
            Button {
                coordinator.switchTab(to: .quizzes)
            } label: {
                HStack(spacing: DMVTheme.Spacing.sm) {
                    Text("Start Practicing")
                        .font(DMVTheme.Typography.headline)
                    Image(systemName: "arrow.right")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, DMVTheme.Spacing.lg)
                .padding(.horizontal, DMVTheme.Spacing.xl)
                .background(
                    RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                        .fill(Color.dmvOrange)
                )
            }
            .buttonStyle(.bounce)
            .pulse(minScale: 0.98, maxScale: 1.02, duration: 1.5)
            .glow(color: .dmvOrange, radius: 15)
            .staggeredAnimation(index: 3)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.lg)
        .dmvShadow(DMVTheme.Shadow.sm)
    }

    // MARK: - Rate & Share Section

    private var rateShareSection: some View {
        HStack(spacing: DMVTheme.Spacing.md) {
            // Rate App Button - Opens App Store directly
            Button(action: openAppStoreForRating) {
                HStack(spacing: 8) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 20))
                    Text("Rate App")
                        .font(DMVTheme.Typography.headline)
                }
                .foregroundColor(.dmvOrange)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.dmvCard)
                .cornerRadius(DMVTheme.CornerRadius.lg)
                .overlay(
                    RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.lg)
                        .stroke(Color.dmvOrange, lineWidth: 2)
                )
            }

            // Share App Button
            ShareLink(
                item: URL(string: "https://apps.apple.com/app/dmv-california/id6754900213")!,
                subject: Text("DMV California App"),
                message: Text("Check out this app to help you pass the California DMV written test!")
            ) {
                HStack(spacing: 8) {
                    Image(systemName: "square.and.arrow.up")
                        .font(.system(size: 20))
                    Text("Share")
                        .font(DMVTheme.Typography.headline)
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.dmvBlue)
                .cornerRadius(DMVTheme.CornerRadius.lg)
            }
            .buttonStyle(.press)
        }
    }

    private func openAppStoreForRating() {
        let appStoreID = "6754900213"
        // Use the standard App Store review URL format
        guard let url = URL(string: "https://apps.apple.com/app/id\(appStoreID)?action=write-review") else {
            return
        }
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
}

// MARK: - Success Guaranteed Badge

struct SuccessGuaranteedBadge: View {
    var body: some View {
        ZStack {
            // Badge background
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "F59E0B"), Color(hex: "D97706")],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .frame(width: 90, height: 90)

            // Inner circle
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "FCD34D"), Color(hex: "F59E0B")],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .frame(width: 75, height: 75)

            // Badge content
            VStack(spacing: 2) {
                // Stars at top
                HStack(spacing: 2) {
                    ForEach(0..<3, id: \.self) { _ in
                        Image(systemName: "star.fill")
                            .font(.system(size: 8))
                            .foregroundColor(Color(hex: "92400E"))
                    }
                }

                Text("SUCCESS")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(Color(hex: "92400E"))

                Text("GUARANTEED")
                    .font(.system(size: 8, weight: .bold))
                    .foregroundColor(Color(hex: "92400E"))

                // Stars at bottom
                HStack(spacing: 2) {
                    ForEach(0..<4, id: \.self) { _ in
                        Image(systemName: "star.fill")
                            .font(.system(size: 6))
                            .foregroundColor(Color(hex: "92400E"))
                    }
                }
            }
        }
        // Ribbon effect
        .overlay(
            VStack {
                Spacer()
                HStack(spacing: 30) {
                    RibbonTail()
                        .fill(Color(hex: "B45309"))
                        .frame(width: 15, height: 20)
                    RibbonTail()
                        .fill(Color(hex: "B45309"))
                        .frame(width: 15, height: 20)
                        .scaleEffect(x: -1)
                }
                .offset(y: 10)
            }
        )
    }
}

struct RibbonTail: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: 0, y: 0))
        path.addLine(to: CGPoint(x: rect.width, y: 0))
        path.addLine(to: CGPoint(x: rect.width, y: rect.height))
        path.addLine(to: CGPoint(x: rect.width / 2, y: rect.height * 0.6))
        path.addLine(to: CGPoint(x: 0, y: rect.height))
        path.closeSubpath()
        return path
    }
}

// MARK: - Quick Action Card

enum CardStyle {
    case filled
    case outline
}

struct HomeQuickActionCard: View {
    let title: String
    let subtitle: String
    let icon: String
    let style: CardStyle
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: DMVTheme.Spacing.md) {
                Image(systemName: icon)
                    .font(.system(size: 32))
                    .foregroundColor(style == .filled ? .white : .dmvOrange)

                Text(title)
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(style == .filled ? .white : .dmvOrange)

                Text(subtitle)
                    .font(DMVTheme.Typography.caption)
                    .foregroundColor(style == .filled ? .white.opacity(0.9) : .dmvOrange.opacity(0.8))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, DMVTheme.Spacing.xl)
            .padding(.horizontal, DMVTheme.Spacing.md)
            .background(
                Group {
                    if style == .filled {
                        Color.dmvOrange
                    } else {
                        Color.dmvCard
                    }
                }
            )
            .cornerRadius(DMVTheme.CornerRadius.lg)
            .overlay(
                RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.lg)
                    .stroke(Color.dmvOrange, lineWidth: style == .outline ? 2 : 0)
            )
            .dmvShadow(DMVTheme.Shadow.sm)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Feature Row

struct FeatureRow: View {
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: DMVTheme.Spacing.md) {
            // Teal checkmark circle
            ZStack {
                Circle()
                    .fill(Color.dmvTeal)
                    .frame(width: 44, height: 44)

                Image(systemName: "checkmark")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(.dmvText)

                Text(description)
                    .font(DMVTheme.Typography.subheadline)
                    .foregroundColor(.dmvTextSecondary)
            }

            Spacer()
        }
        .padding()
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.lg)
        .dmvShadow(DMVTheme.Shadow.sm)
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        HomeView()
            .environmentObject(AppCoordinator())
    }
}
