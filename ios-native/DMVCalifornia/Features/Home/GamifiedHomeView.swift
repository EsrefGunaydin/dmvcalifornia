import SwiftUI

// MARK: - Gamified Home View

struct GamifiedHomeView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var gamificationService = GamificationService.shared
    @StateObject private var viewModel = HomeViewModel()

    @State private var showLevelUpModal = false
    @State private var showAchievementModal = false

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header with Level
                headerSection

                // Daily Streak
                streakSection

                // Daily Challenges
                dailyChallengesSection

                // Quick Actions
                quickActionsSection

                // Recent Activity
                if !viewModel.recentAttempts.isEmpty {
                    recentActivitySection
                }
            }
            .padding()
        }
        .background(GamifiedTheme.Colors.background)
        .navigationTitle("DMV California")
        .navigationBarTitleDisplayMode(.large)
        .overlay(alignment: .top) {
            // XP Toast
            if gamificationService.showXPGain, let gain = gamificationService.lastXPGain {
                XPGainToast(gain: gain)
                    .transition(.move(edge: .top).combined(with: .opacity))
                    .padding(.top, 60)
            }
        }
        .sheet(isPresented: $showLevelUpModal) {
            if let levelData = gamificationService.levelUpData {
                LevelUpModal(
                    oldLevel: levelData.oldLevel,
                    newLevel: levelData.newLevel
                ) {
                    showLevelUpModal = false
                    gamificationService.showLevelUp = false
                }
            }
        }
        .sheet(isPresented: $showAchievementModal) {
            if let achievement = gamificationService.newlyUnlockedAchievements.first {
                AchievementUnlockModal(achievement: achievement) {
                    showAchievementModal = false
                    gamificationService.clearNewAchievements()
                }
            }
        }
        .onChange(of: gamificationService.showLevelUp) { show in
            if show { showLevelUpModal = true }
        }
        .onChange(of: gamificationService.newlyUnlockedAchievements) { achievements in
            if !achievements.isEmpty { showAchievementModal = true }
        }
        .task {
            await viewModel.loadData()
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        HStack(spacing: 16) {
            // Level ring
            LevelProgressRing(
                level: gamificationService.userProgress.currentLevel,
                progress: gamificationService.userProgress.levelProgress,
                xp: gamificationService.userProgress.totalXP,
                size: 80,
                showDetails: false
            )

            // Level info
            VStack(alignment: .leading, spacing: 4) {
                Text("Level \(gamificationService.userProgress.currentLevel.level)")
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundColor(.secondary)

                Text(gamificationService.userProgress.currentLevel.title)
                    .font(.system(size: 22, weight: .bold, design: .rounded))
                    .foregroundColor(.primary)

                // XP progress bar
                XPProgressBar(
                    currentXP: gamificationService.userProgress.totalXP,
                    minXP: gamificationService.userProgress.currentLevel.minXP,
                    maxXP: gamificationService.userProgress.currentLevel.maxXP,
                    level: gamificationService.userProgress.currentLevel,
                    height: 8
                )
            }

            Spacer()
        }
        .softCard()
    }

    // MARK: - Streak Section

    private var streakSection: some View {
        HStack {
            AnimatedStreakView(
                streak: viewModel.streak.currentStreak,
                size: 70
            )

            Spacer()

            VStack(alignment: .trailing, spacing: 8) {
                HStack(spacing: 4) {
                    Text("Best:")
                        .foregroundColor(.secondary)
                    Text("\(viewModel.streak.longestStreak) days")
                        .fontWeight(.semibold)
                }

                HStack(spacing: 4) {
                    Text("Total:")
                        .foregroundColor(.secondary)
                    Text("\(viewModel.streak.totalDaysStudied) days")
                        .fontWeight(.semibold)
                }

                // Today's XP
                HStack(spacing: 4) {
                    Image(systemName: "star.fill")
                        .foregroundColor(.yellow)
                    Text("+\(gamificationService.userProgress.todayXP) XP today")
                        .fontWeight(.semibold)
                        .foregroundColor(GamifiedTheme.Colors.xpPurple)
                }
            }
            .font(.system(size: 14, design: .rounded))
        }
        .softCard()
    }

    // MARK: - Daily Challenges Section

    private var dailyChallengesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Daily Challenges")
                    .font(.system(size: 18, weight: .bold, design: .rounded))

                Spacer()

                let completed = gamificationService.dailyChallenges.filter { $0.isCompleted }.count
                Text("\(completed)/\(gamificationService.dailyChallenges.count)")
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundColor(.secondary)
            }

            ForEach(gamificationService.dailyChallenges) { challenge in
                DailyChallengeCard(challenge: challenge)
            }
        }
    }

    // MARK: - Quick Actions Section

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Start")
                .font(.system(size: 18, weight: .bold, design: .rounded))

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                QuickActionCard(
                    title: "Practice Test",
                    subtitle: "46 questions",
                    icon: "doc.text.fill",
                    gradient: GamifiedTheme.Gradients.primary
                ) {
                    coordinator.switchTab(to: .quizzes)
                }

                QuickActionCard(
                    title: "Flashcards",
                    subtitle: "5 sets",
                    icon: "rectangle.on.rectangle.fill",
                    gradient: GamifiedTheme.Gradients.purple
                ) {
                    coordinator.switchTab(to: .flashcards)
                }

                QuickActionCard(
                    title: "Weak Areas",
                    subtitle: "Focus practice",
                    icon: "target",
                    gradient: GamifiedTheme.Gradients.warning
                ) {
                    coordinator.switchTab(to: .progress)
                }

                QuickActionCard(
                    title: "Achievements",
                    subtitle: "\(gamificationService.userProgress.achievements.count) unlocked",
                    icon: "trophy.fill",
                    gradient: GamifiedTheme.Gradients.success
                ) {
                    // Navigate to achievements
                    coordinator.navigate(to: .about)
                }
            }
        }
    }

    // MARK: - Recent Activity Section

    private var recentActivitySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recent Activity")
                .font(.system(size: 18, weight: .bold, design: .rounded))

            ForEach(viewModel.recentAttempts.prefix(3)) { attempt in
                RecentActivityRow(attempt: attempt)
            }
        }
    }
}

// MARK: - Quick Action Card

struct QuickActionCard: View {
    let title: String
    let subtitle: String
    let icon: String
    let gradient: LinearGradient
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: {
            HapticManager.shared.buttonTap()
            action()
        }) {
            VStack(alignment: .leading, spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(.white)

                Spacer()

                Text(title)
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                Text(subtitle)
                    .font(.system(size: 12, design: .rounded))
                    .foregroundColor(.white.opacity(0.8))
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .frame(height: 120)
            .background(gradient)
            .cornerRadius(GamifiedTheme.Radius.large)
            .shadow(color: .black.opacity(0.15), radius: 10, x: 0, y: 5)
        }
        .buttonStyle(PlainButtonStyle())
        .pressEffect()
    }
}

// MARK: - Recent Activity Row

struct RecentActivityRow: View {
    let attempt: QuizAttempt

    private var isPassed: Bool { attempt.percentage >= 83 }

    var body: some View {
        HStack(spacing: 12) {
            // Score circle
            ZStack {
                Circle()
                    .stroke(Color.gray.opacity(0.2), lineWidth: 3)
                    .frame(width: 44, height: 44)

                Circle()
                    .trim(from: 0, to: attempt.percentage / 100)
                    .stroke(
                        isPassed ? GamifiedTheme.Colors.softGreen : GamifiedTheme.Colors.softRed,
                        style: StrokeStyle(lineWidth: 3, lineCap: .round)
                    )
                    .frame(width: 44, height: 44)
                    .rotationEffect(.degrees(-90))

                Text("\(Int(attempt.percentage))")
                    .font(.system(size: 12, weight: .bold, design: .rounded))
            }

            // Info
            VStack(alignment: .leading, spacing: 2) {
                Text(attempt.quizTitle)
                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                    .lineLimit(1)

                Text(attempt.completedAt, style: .relative)
                    .font(.system(size: 12, design: .rounded))
                    .foregroundColor(.secondary)
            }

            Spacer()

            // Status badge
            Text(isPassed ? "PASSED" : "RETRY")
                .font(.system(size: 10, weight: .bold, design: .rounded))
                .foregroundColor(.white)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(
                    Capsule()
                        .fill(isPassed ? GamifiedTheme.Colors.softGreen : GamifiedTheme.Colors.softRed)
                )
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: GamifiedTheme.Radius.medium)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
        )
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        GamifiedHomeView()
            .environmentObject(AppCoordinator())
    }
}
