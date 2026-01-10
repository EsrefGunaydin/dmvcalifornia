import SwiftUI

struct QuizResultsView: View {
    let result: QuizResult
    let quizId: String
    let quizTitle: String

    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel = QuizResultsViewModel()
    @State private var showConfetti = false

    var body: some View {
        ScrollView {
            VStack(spacing: DMVTheme.Spacing.xl) {
                // Result Card
                resultCard

                // Leaderboard Submission
                if !viewModel.hasSubmitted {
                    leaderboardForm
                } else {
                    // Show leaderboard after submission
                    if !viewModel.topLeaderboardEntries.isEmpty {
                        leaderboardSection
                    } else if let rank = viewModel.leaderboardRank {
                        rankCard(rank: rank)
                    }
                }

                // Actions
                actionsSection
            }
            .padding()
        }
        .background(Color.dmvBackground)
        .navigationTitle("Results")
        .navigationBarBackButtonHidden(true)
        .confetti(isShowing: $showConfetti, intensity: .high)
        .trophyCelebration(isShowing: $viewModel.showTrophyCelebration, rank: viewModel.leaderboardRank ?? 1)
        .onAppear {
            // Show confetti if user passed
            if result.passed {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    showConfetti = true
                }
            }
        }
    }

    // MARK: - Rank Card

    private func rankCard(rank: Int) -> some View {
        DMVCard {
            HStack(spacing: DMVTheme.Spacing.md) {
                Image(systemName: rank <= 10 ? "trophy.fill" : "number.circle.fill")
                    .font(.system(size: 32))
                    .foregroundColor(rank <= 3 ? .yellow : (rank <= 10 ? .orange : .dmvBlue))

                VStack(alignment: .leading, spacing: 4) {
                    Text("Your Ranking")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.dmvTextSecondary)

                    Text("#\(rank)")
                        .font(DMVTheme.Typography.title)
                        .foregroundColor(.dmvText)
                }

                Spacer()

                if rank <= 10 {
                    Text("Top 10!")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.dmvOrange)
                        .cornerRadius(DMVTheme.CornerRadius.full)
                }
            }
            .padding()
        }
    }

    // MARK: - Leaderboard Section

    private var leaderboardSection: some View {
        DMVCard {
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.md) {
                // Header
                HStack {
                    Image(systemName: "trophy.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.yellow)

                    Text("Leaderboard")
                        .font(DMVTheme.Typography.headline)
                        .foregroundColor(.dmvText)

                    Spacer()

                    Text("\(viewModel.totalLeaderboardEntries) players")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.dmvTextSecondary)
                }

                Divider()

                // Top 5 entries
                ForEach(Array(viewModel.topLeaderboardEntries.enumerated()), id: \.element.id) { index, entry in
                    leaderboardRow(rank: index + 1, entry: entry, isCurrentUser: isCurrentUser(entry))
                }

                // User's position if not in top 5
                if let rank = viewModel.leaderboardRank, rank > 5 {
                    HStack {
                        Text("...")
                            .font(DMVTheme.Typography.body)
                            .foregroundColor(.dmvTextSecondary)
                            .frame(maxWidth: .infinity)
                    }
                    .padding(.vertical, 4)

                    // Show user's rank
                    userRankRow(rank: rank)
                }
            }
            .padding()
        }
    }

    private func leaderboardRow(rank: Int, entry: LeaderboardEntry, isCurrentUser: Bool) -> some View {
        HStack(spacing: DMVTheme.Spacing.md) {
            // Rank badge
            ZStack {
                Circle()
                    .fill(rankColor(for: rank))
                    .frame(width: 32, height: 32)

                Text("\(rank)")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(rank <= 3 ? .white : .dmvText)
            }

            // Name
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.name)
                    .font(DMVTheme.Typography.body)
                    .foregroundColor(isCurrentUser ? .dmvOrange : .dmvText)
                    .fontWeight(isCurrentUser ? .bold : .regular)

                if isCurrentUser {
                    Text("You")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.dmvOrange)
                }
            }

            Spacer()

            // Score
            Text("\(Int(entry.percentage))%")
                .font(DMVTheme.Typography.headline)
                .foregroundColor(isCurrentUser ? .dmvOrange : .dmvSuccess)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(isCurrentUser ? Color.dmvOrange.opacity(0.1) : Color.clear)
        .cornerRadius(DMVTheme.CornerRadius.md)
    }

    private func userRankRow(rank: Int) -> some View {
        HStack(spacing: DMVTheme.Spacing.md) {
            // Rank badge
            ZStack {
                Circle()
                    .fill(Color.dmvOrange)
                    .frame(width: 32, height: 32)

                Text("\(rank)")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
            }

            // Name
            VStack(alignment: .leading, spacing: 2) {
                Text(viewModel.name)
                    .font(DMVTheme.Typography.body)
                    .foregroundColor(.dmvOrange)
                    .fontWeight(.bold)

                Text("Your Position")
                    .font(DMVTheme.Typography.caption)
                    .foregroundColor(.dmvOrange)
            }

            Spacer()

            // Score
            Text("\(Int(result.percentage))%")
                .font(DMVTheme.Typography.headline)
                .foregroundColor(.dmvOrange)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(Color.dmvOrange.opacity(0.1))
        .cornerRadius(DMVTheme.CornerRadius.md)
    }

    private func rankColor(for rank: Int) -> Color {
        switch rank {
        case 1: return Color(hex: "FFD700") // Gold
        case 2: return Color(hex: "C0C0C0") // Silver
        case 3: return Color(hex: "CD7F32") // Bronze
        default: return Color.dmvBackground
        }
    }

    private func isCurrentUser(_ entry: LeaderboardEntry) -> Bool {
        let userName = viewModel.name.lowercased().trimmingCharacters(in: .whitespaces)
        let entryName = entry.name.lowercased().trimmingCharacters(in: .whitespaces)
        return userName == entryName
    }

    // MARK: - Result Card

    private var resultCard: some View {
        DMVCard {
            VStack(spacing: DMVTheme.Spacing.lg) {
                // Circular Progress Ring with Score
                ZStack {
                    CircularProgressRing(
                        progress: result.percentage / 100,
                        lineWidth: 14,
                        size: 160,
                        backgroundColor: Color.dmvBorder,
                        gradientColors: result.passed
                            ? [.dmvSuccess, .dmvTeal]
                            : [.dmvError, .dmvOrange]
                    )

                    VStack(spacing: 4) {
                        AnimatedPercentageCounter(
                            percentage: result.percentage,
                            duration: 1.2,
                            font: .system(size: 36, weight: .bold),
                            textColor: result.passed ? .dmvSuccess : .dmvError
                        )

                        Text(result.passed ? "PASSED" : "FAILED")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(result.passed ? .dmvSuccess : .dmvError)
                    }
                }
                .padding(.top, DMVTheme.Spacing.md)

                // Status Text
                Text(result.passed ? "Congratulations!" : "Keep Practicing!")
                    .font(DMVTheme.Typography.title2)
                    .foregroundColor(.dmvText)

                Text(result.passed ? "You passed the quiz!" : "You need 83% to pass")
                    .font(DMVTheme.Typography.subheadline)
                    .foregroundColor(.dmvTextSecondary)

                // Stats Row
                HStack(spacing: DMVTheme.Spacing.lg) {
                    // Correct answers
                    VStack(spacing: 4) {
                        HStack(spacing: 2) {
                            AnimatedCounter(
                                value: result.score,
                                duration: 1.0,
                                font: .system(size: 24, weight: .bold),
                                textColor: .dmvSuccess
                            )
                            Text("/\(result.totalQuestions)")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(.dmvText)
                        }
                        Text("Correct")
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvTextSecondary)
                    }
                    .frame(maxWidth: .infinity)

                    // Divider
                    Rectangle()
                        .fill(Color.dmvBorder)
                        .frame(width: 1, height: 40)

                    // Wrong answers
                    VStack(spacing: 4) {
                        AnimatedCounter(
                            value: result.totalQuestions - result.score,
                            duration: 1.0,
                            font: .system(size: 24, weight: .bold),
                            textColor: .dmvError
                        )
                        Text("Wrong")
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvTextSecondary)
                    }
                    .frame(maxWidth: .infinity)

                    // Time (if available)
                    if let elapsedTime = result.formattedElapsedTime {
                        Rectangle()
                            .fill(Color.dmvBorder)
                            .frame(width: 1, height: 40)

                        VStack(spacing: 4) {
                            Text(elapsedTime)
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(.dmvText)
                            Text("Time")
                                .font(DMVTheme.Typography.caption)
                                .foregroundColor(.dmvTextSecondary)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
                .padding(.top, DMVTheme.Spacing.sm)
            }
            .frame(maxWidth: .infinity)
            .padding()
        }
        .cardEntrance(index: 0)
    }

    // MARK: - Leaderboard Form

    private var leaderboardForm: some View {
        DMVCard {
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.md) {
                Text("Submit to Leaderboard")
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(.dmvText)

                TextField("Your Name", text: $viewModel.name)
                    .textFieldStyle(.roundedBorder)

                TextField("Email (optional)", text: $viewModel.email)
                    .textFieldStyle(.roundedBorder)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)

                DMVButton("Submit Score", style: .primary, isLoading: viewModel.isSubmitting, icon: "paperplane.fill") {
                    Task {
                        await viewModel.submitScore(
                            quizId: quizId,
                            score: result.score,
                            percentage: result.percentage
                        )
                    }
                }
                .disabled(viewModel.name.isEmpty)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding()
        }
    }

    // MARK: - Actions Section

    private var actionsSection: some View {
        VStack(spacing: DMVTheme.Spacing.md) {
            DMVButton("Try Again", style: .secondary, icon: "arrow.counterclockwise") {
                // Notify to reset the quiz
                NotificationCenter.default.post(name: .quizShouldReset, object: nil)
                coordinator.pop()
            }

            DMVButton("Back to Tests", style: .outline, icon: "list.bullet") {
                coordinator.popToRoot()
            }
        }
    }
}

// MARK: - Notification Names

extension Notification.Name {
    static let quizShouldReset = Notification.Name("quizShouldReset")
}

// MARK: - Preview

#Preview {
    NavigationStack {
        QuizResultsView(
            result: QuizResult(score: 38, totalQuestions: 46, percentage: 82.6),
            quizId: "1",
            quizTitle: "Test Quiz"
        )
        .environmentObject(AppCoordinator())
    }
}
