import SwiftUI

struct ProgressScreenView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel = ProgressViewModel()

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(spacing: DMVTheme.Spacing.lg) {
                    // Streak Card
                    streakCard

                    // Stats Grid
                    statsGrid

                    // Empty State or Content
                    if viewModel.stats.totalQuizzes == 0 {
                        EmptyStateView(
                            icon: "chart.bar",
                            title: "No Progress Yet",
                            message: "Complete your first quiz to see your progress here.",
                            actionTitle: "Start Quiz"
                        ) {
                            coordinator.switchTab(to: .quizzes)
                        }
                    } else {
                        // Weak Areas
                        if !viewModel.weakAreas.isEmpty {
                            weakAreasCard
                        }

                        // Bookmarks
                        bookmarksCard

                        // Recent Activity
                        if !viewModel.recentActivity.isEmpty {
                            recentActivityCard
                        }
                    }
                }
                .padding()
            }

            // Banner Ad at bottom
            AdaptiveBannerAdView()
                .padding(.horizontal)
        }
        .background(Color.dmvBackground)
        .navigationTitle("Progress")
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    coordinator.navigate(to: .about)
                } label: {
                    Image(systemName: "info.circle")
                        .foregroundColor(.dmvOrange)
                }
            }
        }
        .task {
            await viewModel.loadData()
        }
        .refreshable {
            await viewModel.loadData()
        }
    }

    // MARK: - Streak Card

    private var streakCard: some View {
        DMVCard {
            HStack {
                VStack(alignment: .leading, spacing: DMVTheme.Spacing.xs) {
                    HStack {
                        Image(systemName: "flame.fill")
                            .foregroundColor(.orange)
                        Text("Study Streak")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.dmvText)
                    }

                    Text("\(viewModel.streak.currentStreak) day\(viewModel.streak.currentStreak == 1 ? "" : "s")")
                        .font(DMVTheme.Typography.title)
                        .foregroundColor(.dmvOrange)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: DMVTheme.Spacing.xs) {
                    Text("Best: \(viewModel.streak.longestStreak) days")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.dmvTextSecondary)

                    Text("Total: \(viewModel.streak.totalDaysStudied) days")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.dmvTextSecondary)
                }
            }
        }
    }

    // MARK: - Stats Grid

    private var statsGrid: some View {
        HStack(spacing: DMVTheme.Spacing.md) {
            StatsCard(
                title: "Quizzes",
                value: "\(viewModel.stats.totalQuizzes)",
                icon: "doc.text.fill",
                iconColor: .dmvOrange
            )

            StatsCard(
                title: "Avg Score",
                value: "\(Int(viewModel.stats.averageScore))%",
                icon: "chart.line.uptrend.xyaxis",
                iconColor: .dmvBlue
            )

            StatsCard(
                title: "Best",
                value: "\(Int(viewModel.stats.bestScore))%",
                icon: "trophy.fill",
                iconColor: .dmvWarning
            )
        }
    }

    // MARK: - Weak Areas Card

    private var weakAreasCard: some View {
        DMVCard {
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.md) {
                Text("Areas to Improve")
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(.dmvText)

                ForEach(viewModel.weakAreas.prefix(3)) { area in
                    HStack {
                        Text(area.category)
                            .font(DMVTheme.Typography.subheadline)
                            .foregroundColor(.dmvText)

                        Spacer()

                        Text("\(area.wrongCount) wrong")
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvError)
                    }
                }
            }
        }
    }

    // MARK: - Bookmarks Card

    private var bookmarksCard: some View {
        DMVCard {
            HStack {
                VStack(alignment: .leading, spacing: DMVTheme.Spacing.xs) {
                    Text("Bookmarked Questions")
                        .font(DMVTheme.Typography.headline)
                        .foregroundColor(.dmvText)

                    Text("\(viewModel.bookmarks.count) questions saved")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.dmvTextSecondary)
                }

                Spacer()

                Button {
                    coordinator.navigate(to: .bookmarks)
                } label: {
                    Image(systemName: "chevron.right")
                        .foregroundColor(.dmvOrange)
                }
            }
        }
    }

    // MARK: - Recent Activity Card

    private var recentActivityCard: some View {
        DMVCard {
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.md) {
                Text("Recent Activity")
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(.dmvText)

                ForEach(viewModel.recentActivity.prefix(5)) { attempt in
                    HStack {
                        VStack(alignment: .leading) {
                            Text(attempt.quizTitle)
                                .font(DMVTheme.Typography.subheadline)
                                .foregroundColor(.dmvText)
                                .lineLimit(1)

                            Text(attempt.completedAt, style: .date)
                                .font(DMVTheme.Typography.caption)
                                .foregroundColor(.dmvTextSecondary)
                        }

                        Spacer()

                        Text("\(Int(attempt.percentage))%")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(attempt.percentage >= 83 ? .dmvSuccess : .dmvError)
                    }
                }
            }
        }
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        ProgressScreenView()
            .environmentObject(AppCoordinator())
    }
}
