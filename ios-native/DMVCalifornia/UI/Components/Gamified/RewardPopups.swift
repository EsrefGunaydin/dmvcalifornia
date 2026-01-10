import SwiftUI

// MARK: - Level Up Modal

struct LevelUpModal: View {
    let oldLevel: UserLevel
    let newLevel: UserLevel
    let onDismiss: () -> Void

    @State private var showContent = false
    @State private var showConfetti = false
    @State private var ringProgress: Double = 0

    var body: some View {
        ZStack {
            // Backdrop
            Color.black.opacity(0.6)
                .ignoresSafeArea()
                .onTapGesture { onDismiss() }

            // Modal
            VStack(spacing: 24) {
                // Header
                Text("LEVEL UP!")
                    .font(.system(size: 28, weight: .black, design: .rounded))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.yellow, .orange],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .scaleEffect(showContent ? 1 : 0.5)
                    .opacity(showContent ? 1 : 0)

                // Level badge
                ZStack {
                    // Outer glow
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: newLevel.gradientColors + [Color.clear],
                                center: .center,
                                startRadius: 40,
                                endRadius: 100
                            )
                        )
                        .frame(width: 200, height: 200)
                        .opacity(0.5)

                    // Progress ring
                    Circle()
                        .stroke(Color.white.opacity(0.2), lineWidth: 8)
                        .frame(width: 140, height: 140)

                    Circle()
                        .trim(from: 0, to: ringProgress)
                        .stroke(
                            LinearGradient(
                                colors: newLevel.gradientColors,
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            style: StrokeStyle(lineWidth: 8, lineCap: .round)
                        )
                        .frame(width: 140, height: 140)
                        .rotationEffect(.degrees(-90))

                    // Level content
                    VStack(spacing: 8) {
                        Image(systemName: newLevel.icon)
                            .font(.system(size: 44))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: newLevel.gradientColors,
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )

                        Text("\(newLevel.level)")
                            .font(.system(size: 36, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                    }
                }
                .scaleEffect(showContent ? 1 : 0)

                // Level title
                VStack(spacing: 4) {
                    Text(newLevel.title)
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.white)

                    HStack(spacing: 8) {
                        Text(oldLevel.title)
                            .foregroundColor(.gray)
                        Image(systemName: "arrow.right")
                            .foregroundColor(.yellow)
                        Text(newLevel.title)
                            .foregroundColor(.white)
                            .fontWeight(.semibold)
                    }
                    .font(.system(size: 14, design: .rounded))
                }
                .opacity(showContent ? 1 : 0)

                // Continue button
                Button(action: onDismiss) {
                    Text("Awesome!")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(
                            LinearGradient(
                                colors: newLevel.gradientColors,
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(GamifiedTheme.Radius.large)
                }
                .padding(.horizontal, 32)
                .scaleEffect(showContent ? 1 : 0.8)
                .opacity(showContent ? 1 : 0)
            }
            .padding(32)
            .frame(maxWidth: 340)
            .background(
                RoundedRectangle(cornerRadius: GamifiedTheme.Radius.xl)
                    .fill(Color(hex: "1A1A2E"))
            )
            .scaleEffect(showContent ? 1 : 0.8)
        }
        .confetti(isShowing: $showConfetti, intensity: .high)
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                showContent = true
            }
            withAnimation(.easeOut(duration: 1).delay(0.3)) {
                ringProgress = 1
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                showConfetti = true
            }
        }
    }
}

// MARK: - Achievement Unlock Modal

struct AchievementUnlockModal: View {
    let achievement: Achievement
    let onDismiss: () -> Void

    @State private var showContent = false
    @State private var showSparkles = false
    @State private var badgeScale: CGFloat = 0

    var body: some View {
        ZStack {
            // Backdrop
            Color.black.opacity(0.6)
                .ignoresSafeArea()
                .onTapGesture { onDismiss() }

            // Modal
            VStack(spacing: 24) {
                // Header
                Text("ACHIEVEMENT UNLOCKED")
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .tracking(2)
                    .foregroundColor(achievement.tier.color)
                    .opacity(showContent ? 1 : 0)

                // Badge
                ZStack {
                    // Glow
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [achievement.tier.color.opacity(0.5), Color.clear],
                                center: .center,
                                startRadius: 30,
                                endRadius: 80
                            )
                        )
                        .frame(width: 160, height: 160)

                    // Badge background
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [achievement.tier.color, achievement.tier.color.opacity(0.7)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 100, height: 100)
                        .shadow(color: achievement.tier.color.opacity(0.5), radius: 15, x: 0, y: 8)

                    // Icon
                    Image(systemName: achievement.icon)
                        .font(.system(size: 40))
                        .foregroundColor(.white)
                }
                .scaleEffect(badgeScale)
                .overlay(
                    SparkleView(isActive: showSparkles, color: achievement.tier.color)
                )

                // Title
                VStack(spacing: 8) {
                    Text(achievement.title)
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.white)

                    Text(achievement.description)
                        .font(.system(size: 14, design: .rounded))
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)

                    // XP reward
                    HStack(spacing: 4) {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                        Text("+\(achievement.tier.xpBonus) XP")
                            .fontWeight(.semibold)
                            .foregroundColor(.yellow)
                    }
                    .font(.system(size: 16, design: .rounded))
                    .padding(.top, 8)
                }
                .opacity(showContent ? 1 : 0)

                // Tier badge
                Text(achievement.tier.rawValue.uppercased())
                    .font(.system(size: 12, weight: .bold, design: .rounded))
                    .tracking(1)
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 6)
                    .background(
                        Capsule()
                            .fill(achievement.tier.color)
                    )
                    .opacity(showContent ? 1 : 0)

                // Continue button
                Button(action: onDismiss) {
                    Text("Claim Reward")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(achievement.tier.color)
                        .cornerRadius(GamifiedTheme.Radius.large)
                }
                .padding(.horizontal, 32)
                .opacity(showContent ? 1 : 0)
            }
            .padding(32)
            .frame(maxWidth: 340)
            .background(
                RoundedRectangle(cornerRadius: GamifiedTheme.Radius.xl)
                    .fill(Color(hex: "1A1A2E"))
            )
        }
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.6)) {
                showContent = true
                badgeScale = 1
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                showSparkles = true
            }
        }
    }
}

// MARK: - Quiz Complete Celebration

struct QuizCompleteCelebration: View {
    let score: Int
    let total: Int
    let percentage: Double
    let xpEarned: Int
    let onContinue: () -> Void

    @State private var showContent = false
    @State private var showConfetti = false
    @State private var scoreScale: CGFloat = 0
    @State private var animatedPercentage: Double = 0

    private var isPassed: Bool { percentage >= 83 }
    private var isPerfect: Bool { percentage >= 100 }

    var body: some View {
        VStack(spacing: 24) {
            // Result header
            VStack(spacing: 8) {
                Image(systemName: isPerfect ? "crown.fill" : (isPassed ? "checkmark.seal.fill" : "xmark.seal.fill"))
                    .font(.system(size: 60))
                    .foregroundStyle(
                        isPerfect ? GamifiedTheme.Gradients.warning :
                            (isPassed ? GamifiedTheme.Gradients.success : GamifiedTheme.Gradients.primary)
                    )
                    .scaleEffect(scoreScale)

                Text(isPerfect ? "PERFECT!" : (isPassed ? "PASSED!" : "Keep Practicing"))
                    .font(.system(size: 28, weight: .black, design: .rounded))
                    .foregroundColor(isPerfect ? GamifiedTheme.Colors.xpGold : (isPassed ? GamifiedTheme.Colors.softGreen : GamifiedTheme.Colors.softRed))
            }
            .opacity(showContent ? 1 : 0)

            // Score circle
            ZStack {
                Circle()
                    .stroke(Color.gray.opacity(0.2), lineWidth: 12)
                    .frame(width: 160, height: 160)

                Circle()
                    .trim(from: 0, to: animatedPercentage / 100)
                    .stroke(
                        isPassed ? GamifiedTheme.Gradients.success : GamifiedTheme.Gradients.primary,
                        style: StrokeStyle(lineWidth: 12, lineCap: .round)
                    )
                    .frame(width: 160, height: 160)
                    .rotationEffect(.degrees(-90))

                VStack(spacing: 4) {
                    Text("\(Int(animatedPercentage))%")
                        .font(.system(size: 40, weight: .bold, design: .rounded))
                        .foregroundColor(.primary)

                    Text("\(score)/\(total)")
                        .font(.system(size: 16, weight: .medium, design: .rounded))
                        .foregroundColor(.secondary)
                }
            }
            .scaleEffect(scoreScale)

            // XP earned
            HStack(spacing: 8) {
                Image(systemName: "star.fill")
                    .foregroundColor(.yellow)
                Text("+\(xpEarned) XP earned!")
                    .fontWeight(.semibold)
            }
            .font(.system(size: 18, design: .rounded))
            .foregroundColor(.primary)
            .padding(.horizontal, 20)
            .padding(.vertical, 10)
            .background(
                Capsule()
                    .fill(Color.yellow.opacity(0.15))
            )
            .opacity(showContent ? 1 : 0)

            // Passing message
            if !isPassed {
                Text("You need 83% to pass. Keep practicing!")
                    .font(.system(size: 14, design: .rounded))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .opacity(showContent ? 1 : 0)
            }

            // Continue button
            Button(action: onContinue) {
                Text("Continue")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(
                        isPassed ? GamifiedTheme.Gradients.success : GamifiedTheme.Gradients.primary
                    )
                    .cornerRadius(GamifiedTheme.Radius.large)
            }
            .padding(.horizontal)
            .opacity(showContent ? 1 : 0)
        }
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: GamifiedTheme.Radius.xl)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.1), radius: 20, x: 0, y: 10)
        )
        .padding()
        .confetti(isShowing: $showConfetti, intensity: isPerfect ? .high : .medium)
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                showContent = true
                scoreScale = 1
            }
            withAnimation(.easeOut(duration: 1).delay(0.3)) {
                animatedPercentage = percentage
            }
            if isPassed {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    showConfetti = true
                }
            }
        }
    }
}

// MARK: - Floating XP Indicator

struct FloatingXPIndicator: View {
    let amount: Int
    let position: CGPoint

    @State private var opacity: Double = 1
    @State private var yOffset: CGFloat = 0
    @State private var scale: CGFloat = 0.5

    var body: some View {
        Text("+\(amount) XP")
            .font(.system(size: 16, weight: .bold, design: .rounded))
            .foregroundColor(GamifiedTheme.Colors.xpGold)
            .shadow(color: .black.opacity(0.2), radius: 2, x: 0, y: 1)
            .opacity(opacity)
            .scaleEffect(scale)
            .offset(y: yOffset)
            .position(position)
            .onAppear {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                    scale = 1.2
                }
                withAnimation(.easeOut(duration: 1.5)) {
                    yOffset = -60
                    opacity = 0
                }
            }
    }
}

// MARK: - Preview

#Preview("Level Up") {
    LevelUpModal(
        oldLevel: UserLevel.levels[3],
        newLevel: UserLevel.levels[4],
        onDismiss: {}
    )
}

#Preview("Achievement") {
    AchievementUnlockModal(
        achievement: Achievement.all[5],
        onDismiss: {}
    )
}

#Preview("Quiz Complete") {
    QuizCompleteCelebration(
        score: 42,
        total: 46,
        percentage: 91.3,
        xpEarned: 85,
        onContinue: {}
    )
}
