import SwiftUI

// MARK: - DMV Button Styles

enum DMVButtonStyle {
    case primary
    case secondary
    case outline
    case ghost
    case destructive
}

// MARK: - DMV Button

struct DMVButton: View {
    let title: String
    let style: DMVButtonStyle
    let isFullWidth: Bool
    let isLoading: Bool
    let isDisabled: Bool
    let icon: String?
    let action: () -> Void

    init(
        _ title: String,
        style: DMVButtonStyle = .primary,
        isFullWidth: Bool = true,
        isLoading: Bool = false,
        isDisabled: Bool = false,
        icon: String? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.style = style
        self.isFullWidth = isFullWidth
        self.isLoading = isLoading
        self.isDisabled = isDisabled
        self.icon = icon
        self.action = action
    }

    var body: some View {
        Button(action: {
            if !isLoading && !isDisabled {
                action()
            }
        }) {
            HStack(spacing: DMVTheme.Spacing.sm) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: foregroundColor))
                        .scaleEffect(0.8)
                } else if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .semibold))
                }

                Text(title)
                    .font(DMVTheme.Typography.headline)
            }
            .foregroundColor(foregroundColor)
            .frame(maxWidth: isFullWidth ? .infinity : nil)
            .padding(.vertical, DMVTheme.Spacing.lg)
            .padding(.horizontal, DMVTheme.Spacing.xl)
            .background(backgroundColor)
            .cornerRadius(DMVTheme.CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                    .stroke(borderColor, lineWidth: style == .outline ? 2 : 0)
            )
        }
        .buttonStyle(.press)
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.5 : 1.0)
    }

    private var foregroundColor: Color {
        switch style {
        case .primary, .secondary, .destructive:
            return .white
        case .outline:
            return .dmvOrange
        case .ghost:
            return .dmvOrange
        }
    }

    private var backgroundColor: Color {
        switch style {
        case .primary:
            return .dmvOrange
        case .secondary:
            return .dmvBlue
        case .outline, .ghost:
            return .clear
        case .destructive:
            return .dmvError
        }
    }

    private var borderColor: Color {
        switch style {
        case .outline:
            return .dmvOrange
        default:
            return .clear
        }
    }
}

// MARK: - Preview

#Preview {
    VStack(spacing: 16) {
        DMVButton("Primary Button", style: .primary) {}
        DMVButton("Secondary Button", style: .secondary) {}
        DMVButton("Outline Button", style: .outline) {}
        DMVButton("Ghost Button", style: .ghost, isFullWidth: false) {}
        DMVButton("Loading...", isLoading: true) {}
        DMVButton("Disabled", isDisabled: true) {}
        DMVButton("With Icon", icon: "arrow.right") {}
    }
    .padding()
}
