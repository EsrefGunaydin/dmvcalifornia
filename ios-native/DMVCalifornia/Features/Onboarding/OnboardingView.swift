import SwiftUI

// MARK: - Onboarding View

struct OnboardingView: View {
    @ObservedObject var onboardingManager: OnboardingManager
    @State private var currentPage = 0

    private let totalPages = 4

    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                colors: [Color.dmvBackground, Color.dmvCard],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                // Skip button
                HStack {
                    Spacer()
                    if currentPage < totalPages - 1 {
                        Button("Skip") {
                            withAnimation {
                                onboardingManager.completeOnboarding()
                            }
                        }
                        .font(DMVTheme.Typography.subheadline)
                        .foregroundColor(.dmvTextSecondary)
                        .padding()
                    }
                }

                // Page content
                TabView(selection: $currentPage) {
                    WelcomeOnboardingPage()
                        .tag(0)
                    QuizOnboardingPage()
                        .tag(1)
                    FlashcardOnboardingPage()
                        .tag(2)
                    ProgressOnboardingPage()
                        .tag(3)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .animation(.easeInOut, value: currentPage)

                // Page indicator
                HStack(spacing: 8) {
                    ForEach(0..<totalPages, id: \.self) { index in
                        Circle()
                            .fill(index == currentPage ? Color.dmvOrange : Color.dmvBorder)
                            .frame(width: 8, height: 8)
                            .scaleEffect(index == currentPage ? 1.2 : 1)
                            .animation(.spring(response: 0.3), value: currentPage)
                    }
                }
                .padding(.bottom, DMVTheme.Spacing.lg)

                // Action button
                Button {
                    if currentPage < totalPages - 1 {
                        withAnimation {
                            currentPage += 1
                        }
                    } else {
                        withAnimation {
                            onboardingManager.completeOnboarding()
                        }
                    }
                } label: {
                    Text(currentPage < totalPages - 1 ? "Next" : "Get Started")
                        .font(DMVTheme.Typography.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.dmvOrange)
                        .cornerRadius(DMVTheme.CornerRadius.lg)
                }
                .padding(.horizontal, DMVTheme.Spacing.xl)
                .padding(.bottom, DMVTheme.Spacing.xl)
            }
        }
    }
}

// MARK: - Welcome Page

struct WelcomeOnboardingPage: View {
    @State private var isAnimating = false

    var body: some View {
        VStack(spacing: DMVTheme.Spacing.xl) {
            Spacer()

            // Animated logo area
            ZStack {
                Circle()
                    .fill(Color.dmvOrange.opacity(0.1))
                    .frame(width: 200, height: 200)
                    .scaleEffect(isAnimating ? 1.1 : 1)
                    .animation(.easeInOut(duration: 2).repeatForever(autoreverses: true), value: isAnimating)

                // Mini badge preview
                VStack(spacing: 8) {
                    Image(systemName: "car.fill")
                        .font(.system(size: 50))
                        .foregroundColor(.dmvOrange)

                    HStack(spacing: 2) {
                        ForEach(0..<3, id: \.self) { _ in
                            Image(systemName: "star.fill")
                                .font(.system(size: 12))
                                .foregroundColor(.yellow)
                        }
                    }
                }
                .scaleEffect(isAnimating ? 1.05 : 0.95)
                .animation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true), value: isAnimating)
            }
            .onAppear { isAnimating = true }

            VStack(spacing: DMVTheme.Spacing.md) {
                Text("Welcome to DMV California")
                    .font(DMVTheme.Typography.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.dmvText)
                    .multilineTextAlignment(.center)

                Text("Your ultimate study companion for passing the California DMV written test on your first try!")
                    .font(DMVTheme.Typography.body)
                    .foregroundColor(.dmvTextSecondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }
            .padding(.horizontal, DMVTheme.Spacing.xl)

            Spacer()
            Spacer()
        }
    }
}

// MARK: - Quiz Preview Page

struct QuizOnboardingPage: View {
    @State private var selectedAnswer: Int? = nil
    @State private var showCorrect = false

    var body: some View {
        VStack(spacing: DMVTheme.Spacing.lg) {
            Spacer()

            // Mini Quiz Preview
            VStack(spacing: DMVTheme.Spacing.md) {
                // Question
                VStack(alignment: .leading, spacing: 8) {
                    Text("Sample Question")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.dmvOrange)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.dmvOrange.opacity(0.1))
                        .cornerRadius(4)

                    Text("What should you do when approaching a yellow traffic light?")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.dmvText)
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.dmvCard)
                .cornerRadius(12)

                // Answer options
                ForEach(0..<3, id: \.self) { index in
                    let options = ["Speed up to pass", "Stop if safe to do so", "Ignore it"]
                    let isCorrect = index == 1

                    HStack {
                        Text(options[index])
                            .font(.system(size: 13))
                            .foregroundColor(.dmvText)
                        Spacer()
                        if showCorrect && isCorrect {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.dmvSuccess)
                        }
                    }
                    .padding(12)
                    .background(
                        showCorrect && isCorrect ? Color.dmvSuccess.opacity(0.1) :
                        selectedAnswer == index ? Color.dmvOrange.opacity(0.1) : Color.dmvCard
                    )
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(
                                showCorrect && isCorrect ? Color.dmvSuccess :
                                selectedAnswer == index ? Color.dmvOrange : Color.dmvBorder,
                                lineWidth: 1
                            )
                    )
                    .onTapGesture {
                        selectedAnswer = index
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                            withAnimation { showCorrect = true }
                        }
                    }
                }
            }
            .padding()
            .background(Color.dmvBackground)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.1), radius: 10, y: 5)
            .padding(.horizontal, 24)

            VStack(spacing: DMVTheme.Spacing.md) {
                Text("Practice Tests")
                    .font(DMVTheme.Typography.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.dmvText)

                Text("Take realistic practice tests with questions from the official DMV handbook. Compete on the leaderboard!")
                    .font(DMVTheme.Typography.body)
                    .foregroundColor(.dmvTextSecondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }
            .padding(.horizontal, DMVTheme.Spacing.xl)

            Spacer()
        }
        .onAppear {
            selectedAnswer = nil
            showCorrect = false
        }
    }
}

// MARK: - Flashcard Preview Page

struct FlashcardOnboardingPage: View {
    @State private var isFlipped = false
    @State private var flipCount = 0

    var body: some View {
        VStack(spacing: DMVTheme.Spacing.lg) {
            Spacer()

            // Mini Flashcard Preview
            ZStack {
                // Back of card
                VStack(spacing: 12) {
                    Image(systemName: "lightbulb.fill")
                        .font(.system(size: 24))
                        .foregroundColor(.yellow)

                    Text("A flashing red light means you must STOP and proceed only when safe, treating it like a stop sign.")
                        .font(.system(size: 13))
                        .foregroundColor(.dmvText)
                        .multilineTextAlignment(.center)
                }
                .padding(20)
                .frame(width: 260, height: 180)
                .background(Color.dmvCard)
                .cornerRadius(16)
                .shadow(color: .black.opacity(0.1), radius: 8, y: 4)
                .rotation3DEffect(.degrees(isFlipped ? 0 : -180), axis: (x: 0, y: 1, z: 0))
                .opacity(isFlipped ? 1 : 0)

                // Front of card
                VStack(spacing: 12) {
                    HStack {
                        Text("Traffic Signs")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.dmvTeal)
                        Spacer()
                        Text("Tap to flip")
                            .font(.system(size: 9))
                            .foregroundColor(.dmvTextSecondary)
                    }

                    Spacer()

                    Text("What does a flashing red traffic light mean?")
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(.dmvText)
                        .multilineTextAlignment(.center)

                    Spacer()

                    Image(systemName: "hand.tap.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.dmvOrange.opacity(0.5))
                }
                .padding(20)
                .frame(width: 260, height: 180)
                .background(Color.dmvCard)
                .cornerRadius(16)
                .shadow(color: .black.opacity(0.1), radius: 8, y: 4)
                .rotation3DEffect(.degrees(isFlipped ? 180 : 0), axis: (x: 0, y: 1, z: 0))
                .opacity(isFlipped ? 0 : 1)
            }
            .onTapGesture {
                withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                    isFlipped.toggle()
                }
            }
            .onAppear {
                // Auto-flip demo
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                    withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                        isFlipped = true
                    }
                }
            }

            // Language flags
            HStack(spacing: 16) {
                ForEach(["🇺🇸", "🇪🇸", "🇹🇷", "🇨🇳"], id: \.self) { flag in
                    Text(flag)
                        .font(.system(size: 24))
                }
            }
            .padding(.top, 8)

            VStack(spacing: DMVTheme.Spacing.md) {
                Text("Flashcards")
                    .font(DMVTheme.Typography.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.dmvText)

                Text("Master key concepts with interactive flashcards. Available in 4 languages!")
                    .font(DMVTheme.Typography.body)
                    .foregroundColor(.dmvTextSecondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }
            .padding(.horizontal, DMVTheme.Spacing.xl)

            Spacer()
        }
    }
}

// MARK: - Progress Preview Page

struct ProgressOnboardingPage: View {
    @State private var animateStats = false

    var body: some View {
        VStack(spacing: DMVTheme.Spacing.lg) {
            Spacer()

            // Mini Progress Preview
            VStack(spacing: 16) {
                // Streak card
                HStack(spacing: 12) {
                    ZStack {
                        Circle()
                            .fill(Color.orange.opacity(0.1))
                            .frame(width: 50, height: 50)

                        Text("🔥")
                            .font(.system(size: 24))
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Study Streak")
                            .font(.system(size: 11))
                            .foregroundColor(.dmvTextSecondary)
                        HStack(alignment: .firstTextBaseline, spacing: 2) {
                            Text(animateStats ? "7" : "0")
                                .font(.system(size: 28, weight: .bold))
                                .foregroundColor(.dmvOrange)
                            Text("days")
                                .font(.system(size: 14))
                                .foregroundColor(.dmvTextSecondary)
                        }
                    }

                    Spacer()
                }
                .padding()
                .background(Color.dmvCard)
                .cornerRadius(12)

                // Stats row
                HStack(spacing: 12) {
                    MiniStatBox(
                        value: animateStats ? "23" : "0",
                        label: "Quizzes",
                        color: .dmvTeal
                    )
                    MiniStatBox(
                        value: animateStats ? "87%" : "0%",
                        label: "Avg Score",
                        color: .dmvSuccess
                    )
                    MiniStatBox(
                        value: animateStats ? "156" : "0",
                        label: "Questions",
                        color: .dmvBlue
                    )
                }
            }
            .padding()
            .background(Color.dmvBackground)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.1), radius: 10, y: 5)
            .padding(.horizontal, 24)
            .onAppear {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    withAnimation(.spring(response: 0.8, dampingFraction: 0.7)) {
                        animateStats = true
                    }
                }
            }

            VStack(spacing: DMVTheme.Spacing.md) {
                Text("Track Your Progress")
                    .font(DMVTheme.Typography.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.dmvText)

                Text("Monitor your study streaks, identify weak areas, and watch yourself improve with detailed statistics.")
                    .font(DMVTheme.Typography.body)
                    .foregroundColor(.dmvTextSecondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }
            .padding(.horizontal, DMVTheme.Spacing.xl)

            Spacer()
            Spacer()
        }
    }
}

struct MiniStatBox: View {
    let value: String
    let label: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(color)
            Text(label)
                .font(.system(size: 10))
                .foregroundColor(.dmvTextSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(Color.dmvCard)
        .cornerRadius(10)
    }
}

// MARK: - Onboarding Manager

class OnboardingManager: ObservableObject {
    private let hasSeenOnboardingKey = "hasSeenOnboarding"

    @Published var shouldShowOnboarding: Bool

    init() {
        self.shouldShowOnboarding = !UserDefaults.standard.bool(forKey: hasSeenOnboardingKey)
    }

    func completeOnboarding() {
        UserDefaults.standard.set(true, forKey: hasSeenOnboardingKey)
        shouldShowOnboarding = false
    }

    // For testing - reset onboarding state
    func resetOnboarding() {
        UserDefaults.standard.set(false, forKey: hasSeenOnboardingKey)
        shouldShowOnboarding = true
    }
}

// MARK: - Preview

#Preview {
    OnboardingView(onboardingManager: OnboardingManager())
}
