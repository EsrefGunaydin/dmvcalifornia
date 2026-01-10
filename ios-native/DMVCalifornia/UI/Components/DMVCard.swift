import SwiftUI

// MARK: - DMV Card

struct DMVCard<Content: View>: View {
    let content: Content
    let padding: CGFloat

    init(
        padding: CGFloat = DMVTheme.Spacing.lg,
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.padding = padding
    }

    var body: some View {
        content
            .padding(padding)
            .background(Color.dmvCard)
            .cornerRadius(DMVTheme.CornerRadius.lg)
            .dmvShadow(DMVTheme.Shadow.md)
    }
}

// MARK: - Quiz Card

struct QuizCard: View {
    let title: String
    let questionsCount: Int
    let category: String?
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.sm) {
                // Title - full name with multiple lines
                Text(title)
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(.dmvText)
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)
                    .fixedSize(horizontal: false, vertical: true)

                Spacer()

                // Questions count
                HStack {
                    Image(systemName: "doc.text")
                        .font(.system(size: 12))
                    Text("\(questionsCount) Questions")
                        .font(DMVTheme.Typography.caption)
                }
                .foregroundColor(.dmvTextSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(DMVTheme.Spacing.md)
            .frame(height: 110)
            .background(Color.dmvCard)
            .cornerRadius(DMVTheme.CornerRadius.lg)
            .dmvShadow(DMVTheme.Shadow.md)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Flashcard Set Card

struct FlashcardSetCard: View {
    let title: String
    let cardsCount: Int
    let category: String
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.sm) {
                // Title - full name with multiple lines
                Text(title)
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(.dmvText)
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)
                    .fixedSize(horizontal: false, vertical: true)

                Spacer()

                // Cards count
                HStack {
                    Image(systemName: "rectangle.on.rectangle")
                        .font(.system(size: 12))
                    Text("\(cardsCount) Cards")
                        .font(DMVTheme.Typography.caption)
                }
                .foregroundColor(.dmvTextSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(DMVTheme.Spacing.md)
            .frame(height: 110)
            .background(Color.dmvCard)
            .cornerRadius(DMVTheme.CornerRadius.lg)
            .dmvShadow(DMVTheme.Shadow.md)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Stats Card

struct StatsCard: View {
    let title: String
    let value: String
    let icon: String
    let iconColor: Color

    var body: some View {
        VStack(spacing: DMVTheme.Spacing.sm) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(iconColor)

            Text(value)
                .font(DMVTheme.Typography.title2)
                .foregroundColor(.dmvText)

            Text(title)
                .font(DMVTheme.Typography.caption)
                .foregroundColor(.dmvTextSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(DMVTheme.Spacing.lg)
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.lg)
        .dmvShadow(DMVTheme.Shadow.sm)
    }
}

// MARK: - Preview

#Preview {
    ScrollView {
        VStack(spacing: 16) {
            DMVCard {
                Text("Simple Card Content")
            }

            QuizCard(
                title: "DMV Simulation Test 1",
                questionsCount: 46,
                category: nil,
                onTap: {}
            )

            FlashcardSetCard(
                title: "Road Signs Set 1",
                cardsCount: 15,
                category: "Signs",
                onTap: {}
            )

            HStack(spacing: 12) {
                StatsCard(title: "Quizzes", value: "12", icon: "doc.text.fill", iconColor: .dmvOrange)
                StatsCard(title: "Avg Score", value: "85%", icon: "chart.line.uptrend.xyaxis", iconColor: .dmvBlue)
            }
        }
        .padding()
    }
    .background(Color.dmvBackground)
}
