import SwiftUI

// MARK: - Gamified Answer Option

struct GamifiedAnswerOption: View {
    let option: String
    let index: Int
    let isSelected: Bool
    let isCorrect: Bool
    let showResult: Bool
    let action: () -> Void

    @State private var shake = false
    @State private var bounce = false
    @State private var showParticles = false

    private var isWrong: Bool {
        showResult && isSelected && !isCorrect
    }

    private var isCorrectAnswer: Bool {
        showResult && isCorrect
    }

    var body: some View {
        Button(action: {
            guard !showResult else { return }
            HapticManager.shared.selection()
            action()
        }) {
            HStack(spacing: 14) {
                // Option indicator
                ZStack {
                    Circle()
                        .fill(backgroundColor)
                        .frame(width: 32, height: 32)

                    if showResult && isCorrectAnswer {
                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .scaleEffect(bounce ? 1.2 : 1)
                    } else if isWrong {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    } else {
                        Text(String(UnicodeScalar(65 + index)!))
                            .font(.system(size: 14, weight: .semibold, design: .rounded))
                            .foregroundColor(isSelected ? .white : .secondary)
                    }
                }

                // Option text
                Text(option)
                    .font(.system(size: 16, weight: .medium, design: .rounded))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.leading)

                Spacer()

                // Result indicator
                if showResult {
                    if isCorrectAnswer {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                            .scaleEffect(bounce ? 1.3 : 1)
                    } else if isWrong {
                        Image(systemName: "arrow.uturn.backward")
                            .foregroundColor(.gray)
                    }
                }
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: GamifiedTheme.Radius.large)
                    .fill(cardBackground)
                    .shadow(
                        color: shadowColor,
                        radius: isSelected ? 12 : 6,
                        x: 0,
                        y: isSelected ? 6 : 3
                    )
            )
            .overlay(
                RoundedRectangle(cornerRadius: GamifiedTheme.Radius.large)
                    .stroke(borderColor, lineWidth: isSelected ? 3 : 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
        .scaleEffect(bounce ? 1.02 : 1)
        .offset(x: shake ? -5 : 0)
        .overlay {
            if showParticles && isCorrectAnswer {
                ParticleExplosion(isActive: true, color: .yellow, particleCount: 12)
            }
        }
        .onChange(of: showResult) { showing in
            if showing {
                if isCorrectAnswer {
                    HapticManager.shared.correctAnswer()
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
                        bounce = true
                    }
                    showParticles = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        withAnimation { bounce = false }
                    }
                } else if isWrong {
                    HapticManager.shared.wrongAnswer()
                    withAnimation(.default.repeatCount(3, autoreverses: true).speed(4)) {
                        shake = true
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        shake = false
                    }
                }
            }
        }
        .disabled(showResult)
    }

    // MARK: - Computed Colors

    private var backgroundColor: Color {
        if isCorrectAnswer {
            return GamifiedTheme.Colors.softGreen
        } else if isWrong {
            return GamifiedTheme.Colors.softRed
        } else if isSelected {
            return GamifiedTheme.Colors.softBlue
        }
        return Color.gray.opacity(0.2)
    }

    private var cardBackground: Color {
        if isCorrectAnswer {
            return GamifiedTheme.Colors.softGreen.opacity(0.1)
        } else if isWrong {
            return GamifiedTheme.Colors.softRed.opacity(0.1)
        } else if isSelected {
            return GamifiedTheme.Colors.softBlue.opacity(0.1)
        }
        return Color.white
    }

    private var borderColor: Color {
        if isCorrectAnswer {
            return GamifiedTheme.Colors.softGreen
        } else if isWrong {
            return GamifiedTheme.Colors.softRed
        } else if isSelected {
            return GamifiedTheme.Colors.softBlue
        }
        return Color.gray.opacity(0.2)
    }

    private var shadowColor: Color {
        if isCorrectAnswer {
            return GamifiedTheme.Colors.softGreen.opacity(0.3)
        } else if isWrong {
            return GamifiedTheme.Colors.softRed.opacity(0.3)
        } else if isSelected {
            return GamifiedTheme.Colors.softBlue.opacity(0.3)
        }
        return Color.black.opacity(0.08)
    }
}

// MARK: - Gamified Explanation Card

struct GamifiedExplanationCard: View {
    let isCorrect: Bool
    let explanation: String
    let xpEarned: Int

    @State private var showContent = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Image(systemName: isCorrect ? "checkmark.circle.fill" : "info.circle.fill")
                    .font(.system(size: 24))
                    .foregroundColor(isCorrect ? GamifiedTheme.Colors.softGreen : GamifiedTheme.Colors.softBlue)

                Text(isCorrect ? "Correct!" : "Here's the explanation")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(isCorrect ? GamifiedTheme.Colors.softGreen : .primary)

                Spacer()

                // XP indicator
                if isCorrect && xpEarned > 0 {
                    HStack(spacing: 4) {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                        Text("+\(xpEarned)")
                            .fontWeight(.bold)
                            .foregroundColor(GamifiedTheme.Colors.xpPurple)
                    }
                    .font(.system(size: 14, design: .rounded))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(
                        Capsule()
                            .fill(GamifiedTheme.Colors.xpPurple.opacity(0.1))
                    )
                }
            }

            // Explanation text
            Text(explanation)
                .font(.system(size: 15, design: .rounded))
                .foregroundColor(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: GamifiedTheme.Radius.large)
                .fill(isCorrect ? GamifiedTheme.Colors.softGreen.opacity(0.1) : GamifiedTheme.Colors.softBlue.opacity(0.1))
        )
        .overlay(
            RoundedRectangle(cornerRadius: GamifiedTheme.Radius.large)
                .stroke(
                    isCorrect ? GamifiedTheme.Colors.softGreen.opacity(0.3) : GamifiedTheme.Colors.softBlue.opacity(0.3),
                    lineWidth: 1
                )
        )
        .opacity(showContent ? 1 : 0)
        .offset(y: showContent ? 0 : 20)
        .onAppear {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                showContent = true
            }
        }
    }
}

// MARK: - Gamified Navigation Buttons

struct GamifiedNavigationButtons: View {
    let canGoBack: Bool
    let isLastQuestion: Bool
    let canContinue: Bool
    let onPrevious: () -> Void
    let onNext: () -> Void
    let onFinish: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Previous button
            Button(action: {
                HapticManager.shared.buttonTap()
                onPrevious()
            }) {
                HStack(spacing: 6) {
                    Image(systemName: "chevron.left")
                    Text("Back")
                }
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundColor(.secondary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    RoundedRectangle(cornerRadius: GamifiedTheme.Radius.large)
                        .fill(Color.gray.opacity(0.1))
                )
            }
            .buttonStyle(PlainButtonStyle())
            .opacity(canGoBack ? 1 : 0.4)
            .disabled(!canGoBack)

            // Next / Finish button
            Button(action: {
                HapticManager.shared.buttonTap()
                if isLastQuestion {
                    onFinish()
                } else {
                    onNext()
                }
            }) {
                HStack(spacing: 6) {
                    Text(isLastQuestion ? "Finish Quiz" : "Next")
                    Image(systemName: isLastQuestion ? "checkmark" : "chevron.right")
                }
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    RoundedRectangle(cornerRadius: GamifiedTheme.Radius.large)
                        .fill(
                            canContinue ?
                            (isLastQuestion ? GamifiedTheme.Gradients.success : GamifiedTheme.Gradients.primary) :
                                LinearGradient(colors: [.gray], startPoint: .leading, endPoint: .trailing)
                        )
                )
                .shadow(
                    color: canContinue ? (isLastQuestion ? GamifiedTheme.Colors.softGreen.opacity(0.4) : GamifiedTheme.Colors.softRed.opacity(0.4)) : .clear,
                    radius: 10,
                    x: 0,
                    y: 5
                )
            }
            .buttonStyle(PlainButtonStyle())
            .disabled(!canContinue)
            .pressEffect()
        }
        .padding()
        .background(Color.white)
    }
}

// MARK: - Preview

#Preview("Answer Options") {
    VStack(spacing: 12) {
        GamifiedAnswerOption(
            option: "Option A - This is the correct answer with some long text",
            index: 0,
            isSelected: true,
            isCorrect: true,
            showResult: true,
            action: {}
        )

        GamifiedAnswerOption(
            option: "Option B - This is wrong",
            index: 1,
            isSelected: true,
            isCorrect: false,
            showResult: true,
            action: {}
        )

        GamifiedAnswerOption(
            option: "Option C - Not selected",
            index: 2,
            isSelected: false,
            isCorrect: false,
            showResult: true,
            action: {}
        )
    }
    .padding()
}
