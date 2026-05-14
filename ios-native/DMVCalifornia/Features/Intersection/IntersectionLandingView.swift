import SwiftUI

struct IntersectionLandingView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel = IntersectionLandingViewModel()

    private let columns = [
        GridItem(.flexible(), spacing: DMVTheme.Spacing.md),
        GridItem(.flexible(), spacing: DMVTheme.Spacing.md),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: DMVTheme.Spacing.xl) {
                heroSection

                if viewModel.isLoading {
                    ProgressView()
                        .padding(.top, DMVTheme.Spacing.xxxl)
                } else if let error = viewModel.errorMessage {
                    Text(error)
                        .font(DMVTheme.Typography.subheadline)
                        .foregroundColor(.dmvTextSecondary)
                        .padding(.top, DMVTheme.Spacing.xxxl)
                } else {
                    levelGrid
                }
            }
            .padding()
        }
        .background(Color.dmvBackground)
        .navigationTitle("Intersection")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(Color.dmvOrange, for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .task { await viewModel.load() }
    }

    // MARK: - Hero

    private var heroSection: some View {
        VStack(spacing: DMVTheme.Spacing.md) {
            ZStack {
                Circle()
                    .fill(Color.dmvOrange.opacity(0.15))
                    .frame(width: 84, height: 84)
                Image(systemName: "arrow.triangle.branch")
                    .font(.system(size: 38, weight: .bold))
                    .foregroundColor(.dmvOrange)
            }

            Text("Who goes first?")
                .font(DMVTheme.Typography.title2)
                .fontWeight(.bold)
                .foregroundColor(.dmvText)

            Text("Tap the cars, pedestrians and cyclists in the order they may legally proceed. Get it wrong and you'll see the collision — and the rule you missed.")
                .font(DMVTheme.Typography.subheadline)
                .foregroundColor(.dmvTextSecondary)
                .multilineTextAlignment(.center)

            if viewModel.solvedCount > 0 {
                HStack(spacing: DMVTheme.Spacing.xl) {
                    statPill(value: "\(viewModel.solvedCount)/\(viewModel.levels.count)", label: "Solved")
                    statPill(value: "\(viewModel.totalStars)/\(viewModel.maxStars)", label: "Stars ⭐")
                }
                .padding(.top, DMVTheme.Spacing.xs)
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.lg)
        .dmvShadow(DMVTheme.Shadow.sm)
    }

    private func statPill(value: String, label: String) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(DMVTheme.Typography.title3)
                .fontWeight(.bold)
                .foregroundColor(.dmvOrange)
            Text(label)
                .font(DMVTheme.Typography.caption)
                .foregroundColor(.dmvTextSecondary)
        }
    }

    // MARK: - Level grid

    private var levelGrid: some View {
        LazyVGrid(columns: columns, spacing: DMVTheme.Spacing.md) {
            ForEach(Array(viewModel.levels.enumerated()), id: \.element.id) { index, level in
                let unlocked = viewModel.isUnlocked(index)
                IntersectionLevelCard(
                    number: index + 1,
                    title: level.title,
                    intersectionType: level.intersectionType.displayName,
                    stars: viewModel.stars(for: level),
                    isUnlocked: unlocked
                )
                .onTapGesture {
                    guard unlocked else { return }
                    coordinator.navigate(to: .intersectionLevel(levelId: level.id))
                }
            }
        }
    }
}

// MARK: - Level Card

struct IntersectionLevelCard: View {
    let number: Int
    let title: String
    let intersectionType: String
    let stars: Int
    let isUnlocked: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: DMVTheme.Spacing.sm) {
            HStack {
                Text("Level \(number)")
                    .font(DMVTheme.Typography.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(isUnlocked ? .dmvOrange : .dmvTextTertiary)
                Spacer()
                if !isUnlocked {
                    Image(systemName: "lock.fill")
                        .font(.system(size: 12))
                        .foregroundColor(.dmvTextTertiary)
                }
            }

            Text(title)
                .font(DMVTheme.Typography.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(isUnlocked ? .dmvText : .dmvTextTertiary)
                .lineLimit(2)
                .frame(maxWidth: .infinity, alignment: .leading)
                .fixedSize(horizontal: false, vertical: true)

            Text(intersectionType)
                .font(DMVTheme.Typography.caption2)
                .foregroundColor(.dmvTextSecondary)

            Spacer(minLength: 0)

            HStack(spacing: 2) {
                ForEach(0..<3, id: \.self) { i in
                    Image(systemName: i < stars ? "star.fill" : "star")
                        .font(.system(size: 12))
                        .foregroundColor(i < stars ? .dmvWarning : .dmvTextTertiary.opacity(0.5))
                }
            }
        }
        .padding(DMVTheme.Spacing.md)
        .frame(height: 140, alignment: .topLeading)
        .frame(maxWidth: .infinity)
        .background(isUnlocked ? Color.dmvCard : Color.dmvSurface)
        .cornerRadius(DMVTheme.CornerRadius.lg)
        .overlay(
            RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.lg)
                .stroke(stars > 0 ? Color.dmvWarning.opacity(0.4) : Color.dmvBorder, lineWidth: 1)
        )
        .dmvShadow(DMVTheme.Shadow.sm)
        .opacity(isUnlocked ? 1 : 0.7)
    }
}
