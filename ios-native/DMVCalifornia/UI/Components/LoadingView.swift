import SwiftUI

// MARK: - Loading View

struct LoadingView: View {
    let message: String?

    init(_ message: String? = nil) {
        self.message = message
    }

    var body: some View {
        VStack(spacing: DMVTheme.Spacing.lg) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .dmvOrange))
                .scaleEffect(1.2)

            if let message = message {
                Text(message)
                    .font(DMVTheme.Typography.subheadline)
                    .foregroundColor(.dmvTextSecondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.dmvBackground)
    }
}

// MARK: - Loading Overlay

struct LoadingOverlay: View {
    let isLoading: Bool
    let message: String?

    init(isLoading: Bool, message: String? = nil) {
        self.isLoading = isLoading
        self.message = message
    }

    var body: some View {
        if isLoading {
            ZStack {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()

                VStack(spacing: DMVTheme.Spacing.lg) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(1.5)

                    if let message = message {
                        Text(message)
                            .font(DMVTheme.Typography.subheadline)
                            .foregroundColor(.white)
                    }
                }
                .padding(DMVTheme.Spacing.xxl)
                .background(Color.dmvText.opacity(0.8))
                .cornerRadius(DMVTheme.CornerRadius.lg)
            }
        }
    }
}

// MARK: - Empty State View

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String
    let actionTitle: String?
    let action: (() -> Void)?

    init(
        icon: String,
        title: String,
        message: String,
        actionTitle: String? = nil,
        action: (() -> Void)? = nil
    ) {
        self.icon = icon
        self.title = title
        self.message = message
        self.actionTitle = actionTitle
        self.action = action
    }

    var body: some View {
        VStack(spacing: DMVTheme.Spacing.lg) {
            Image(systemName: icon)
                .font(.system(size: 48))
                .foregroundColor(.dmvTextTertiary)

            VStack(spacing: DMVTheme.Spacing.sm) {
                Text(title)
                    .font(DMVTheme.Typography.title3)
                    .foregroundColor(.dmvText)

                Text(message)
                    .font(DMVTheme.Typography.subheadline)
                    .foregroundColor(.dmvTextSecondary)
                    .multilineTextAlignment(.center)
            }

            if let actionTitle = actionTitle, let action = action {
                DMVButton(actionTitle, style: .primary, isFullWidth: false) {
                    action()
                }
                .padding(.top, DMVTheme.Spacing.sm)
            }
        }
        .padding(DMVTheme.Spacing.xxl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Preview

#Preview {
    VStack {
        LoadingView("Loading quizzes...")

        EmptyStateView(
            icon: "doc.text",
            title: "No Quizzes Yet",
            message: "Complete your first quiz to see your progress here.",
            actionTitle: "Start Quiz",
            action: {}
        )
    }
}
