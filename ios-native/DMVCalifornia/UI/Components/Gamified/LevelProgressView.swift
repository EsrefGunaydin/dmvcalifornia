import SwiftUI

// MARK: - Level Progress Ring

struct LevelProgressRing: View {
    let level: UserLevel
    let progress: Double
    let xp: Int
    var size: CGFloat = 120
    var showDetails: Bool = true

    @State private var animatedProgress: Double = 0

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                // Background ring
                Circle()
                    .stroke(
                        Color.gray.opacity(0.2),
                        lineWidth: size * 0.12
                    )

                // Progress ring
                Circle()
                    .trim(from: 0, to: animatedProgress)
                    .stroke(
                        LinearGradient(
                            colors: level.gradientColors,
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        style: StrokeStyle(
                            lineWidth: size * 0.12,
                            lineCap: .round
                        )
                    )
                    .rotationEffect(.degrees(-90))
                    .animation(GamifiedTheme.Animation.bouncy, value: animatedProgress)

                // Center content
                VStack(spacing: 2) {
                    Image(systemName: level.icon)
                        .font(.system(size: size * 0.25))
                        .foregroundStyle(
                            LinearGradient(
                                colors: level.gradientColors,
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )

                    Text("\(level.level)")
                        .font(.system(size: size * 0.2, weight: .bold, design: .rounded))
                        .foregroundColor(.primary)
                }
            }
            .frame(width: size, height: size)

            if showDetails {
                VStack(spacing: 2) {
                    Text(level.title)
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                        .foregroundColor(.primary)

                    Text("\(xp) XP")
                        .font(.system(size: 12, weight: .medium, design: .rounded))
                        .foregroundColor(.secondary)
                }
            }
        }
        .onAppear {
            animatedProgress = progress
        }
        .onChange(of: progress) { newProgress in
            withAnimation(GamifiedTheme.Animation.bouncy) {
                animatedProgress = newProgress
            }
        }
    }
}

// MARK: - XP Progress Bar

struct XPProgressBar: View {
    let currentXP: Int
    let minXP: Int
    let maxXP: Int
    let level: UserLevel
    var height: CGFloat = 12

    @State private var animatedProgress: Double = 0

    private var progress: Double {
        guard maxXP > minXP else { return 1.0 }
        return Double(currentXP - minXP) / Double(maxXP - minXP)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            // Header
            HStack {
                HStack(spacing: 4) {
                    Image(systemName: level.icon)
                        .foregroundStyle(
                            LinearGradient(
                                colors: level.gradientColors,
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                    Text("Level \(level.level)")
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                }

                Spacer()

                Text("\(currentXP) / \(maxXP == Int.max ? "∞" : "\(maxXP)") XP")
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundColor(.secondary)
            }

            // Progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Background
                    RoundedRectangle(cornerRadius: height / 2)
                        .fill(Color.gray.opacity(0.2))

                    // Progress
                    RoundedRectangle(cornerRadius: height / 2)
                        .fill(
                            LinearGradient(
                                colors: level.gradientColors,
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geometry.size.width * animatedProgress)
                        .animation(GamifiedTheme.Animation.bouncy, value: animatedProgress)

                    // Shine effect
                    if animatedProgress > 0 {
                        RoundedRectangle(cornerRadius: height / 2)
                            .fill(
                                LinearGradient(
                                    colors: [.white.opacity(0.3), .clear],
                                    startPoint: .top,
                                    endPoint: .bottom
                                )
                            )
                            .frame(width: geometry.size.width * animatedProgress, height: height / 2)
                            .offset(y: -height / 4)
                    }
                }
            }
            .frame(height: height)
        }
        .onAppear {
            animatedProgress = progress
        }
        .onChange(of: progress) { newProgress in
            withAnimation(GamifiedTheme.Animation.bouncy) {
                animatedProgress = newProgress
            }
        }
    }
}

// MARK: - Animated Streak Display

struct AnimatedStreakView: View {
    let streak: Int
    var size: CGFloat = 80

    @State private var isAnimating = false
    @State private var flameScale: CGFloat = 1.0

    var body: some View {
        VStack(spacing: 4) {
            ZStack {
                // Glow effect
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [
                                Color.orange.opacity(0.3),
                                Color.orange.opacity(0.1),
                                Color.clear
                            ],
                            center: .center,
                            startRadius: size * 0.2,
                            endRadius: size * 0.6
                        )
                    )
                    .frame(width: size * 1.5, height: size * 1.5)
                    .scaleEffect(isAnimating ? 1.1 : 1.0)

                // Flame icon
                Image(systemName: "flame.fill")
                    .font(.system(size: size * 0.5))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.yellow, .orange, .red],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .scaleEffect(flameScale)
                    .shadow(color: .orange.opacity(0.5), radius: 10, x: 0, y: 5)

                // Streak number
                Text("\(streak)")
                    .font(.system(size: size * 0.25, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .shadow(color: .black.opacity(0.3), radius: 2, x: 0, y: 1)
                    .offset(y: size * 0.1)
            }
            .frame(width: size, height: size)

            Text(streak == 1 ? "day streak" : "day streak")
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundColor(.secondary)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                isAnimating = true
            }
            withAnimation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true)) {
                flameScale = 1.1
            }
        }
    }
}

// MARK: - Daily Challenge Card

struct DailyChallengeCard: View {
    let challenge: DailyChallenge
    @State private var animatedProgress: Double = 0

    var body: some View {
        HStack(spacing: 12) {
            // Icon
            ZStack {
                Circle()
                    .fill(challenge.isCompleted ? GamifiedTheme.Gradients.success : GamifiedTheme.Gradients.info)
                    .frame(width: 44, height: 44)

                Image(systemName: challenge.isCompleted ? "checkmark" : challenge.icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
            }

            // Content
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(challenge.title)
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                        .foregroundColor(challenge.isCompleted ? .secondary : .primary)
                        .strikethrough(challenge.isCompleted)

                    Spacer()

                    HStack(spacing: 2) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 10))
                            .foregroundColor(.yellow)
                        Text("+\(challenge.xpReward) XP")
                            .font(.system(size: 11, weight: .medium, design: .rounded))
                            .foregroundColor(.secondary)
                    }
                }

                // Progress bar
                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 3)
                            .fill(Color.gray.opacity(0.2))

                        RoundedRectangle(cornerRadius: 3)
                            .fill(challenge.isCompleted ? GamifiedTheme.Colors.softGreen : GamifiedTheme.Colors.softBlue)
                            .frame(width: geometry.size.width * animatedProgress)
                    }
                }
                .frame(height: 6)

                Text("\(challenge.current)/\(challenge.target)")
                    .font(.system(size: 11, weight: .medium, design: .rounded))
                    .foregroundColor(.secondary)
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: GamifiedTheme.Radius.medium)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
        )
        .opacity(challenge.isCompleted ? 0.7 : 1)
        .onAppear {
            withAnimation(GamifiedTheme.Animation.bouncy.delay(0.2)) {
                animatedProgress = challenge.progress
            }
        }
    }
}

// MARK: - XP Gain Toast

struct XPGainToast: View {
    let gain: XPGain
    @State private var isVisible = false
    @State private var yOffset: CGFloat = 50

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "star.fill")
                .foregroundColor(.yellow)

            Text("+\(gain.amount) XP")
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .foregroundColor(.white)

            Text(gain.event.description)
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.8))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(
            Capsule()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "667EEA"), Color(hex: "764BA2")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .shadow(color: .purple.opacity(0.4), radius: 10, x: 0, y: 5)
        )
        .opacity(isVisible ? 1 : 0)
        .offset(y: yOffset)
        .onAppear {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.7)) {
                isVisible = true
                yOffset = 0
            }
        }
    }
}

// MARK: - Preview

#Preview("Level Ring") {
    VStack(spacing: 30) {
        LevelProgressRing(
            level: UserLevel.levels[4],
            progress: 0.65,
            xp: 950
        )

        XPProgressBar(
            currentXP: 950,
            minXP: 850,
            maxXP: 1300,
            level: UserLevel.levels[4]
        )
        .padding(.horizontal)

        AnimatedStreakView(streak: 7)
    }
}
