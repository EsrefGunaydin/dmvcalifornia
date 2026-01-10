import SwiftUI

// MARK: - Gamified Theme

struct GamifiedTheme {
    // MARK: - Soft Gradients

    struct Gradients {
        static let primary = LinearGradient(
            colors: [Color(hex: "FF6B6B"), Color(hex: "FF8E53")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let success = LinearGradient(
            colors: [Color(hex: "56AB2F"), Color(hex: "A8E063")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let info = LinearGradient(
            colors: [Color(hex: "2193B0"), Color(hex: "6DD5ED")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let warning = LinearGradient(
            colors: [Color(hex: "F7971E"), Color(hex: "FFD200")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let purple = LinearGradient(
            colors: [Color(hex: "667EEA"), Color(hex: "764BA2")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let streak = LinearGradient(
            colors: [Color(hex: "F093FB"), Color(hex: "F5576C")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let card = LinearGradient(
            colors: [Color.white, Color(hex: "F8F9FA")],
            startPoint: .top,
            endPoint: .bottom
        )

        static let darkCard = LinearGradient(
            colors: [Color(hex: "2D3436"), Color(hex: "1E272E")],
            startPoint: .top,
            endPoint: .bottom
        )
    }

    // MARK: - Soft Colors

    struct Colors {
        static let background = Color(hex: "F5F7FA")
        static let cardBackground = Color.white
        static let softShadow = Color.black.opacity(0.08)

        // XP and Levels
        static let xpGold = Color(hex: "FFD700")
        static let xpPurple = Color(hex: "9B59B6")

        // Achievement Colors
        static let bronze = Color(hex: "CD7F32")
        static let silver = Color(hex: "C0C0C0")
        static let gold = Color(hex: "FFD700")
        static let platinum = Color(hex: "E5E4E2")
        static let diamond = Color(hex: "B9F2FF")

        // Soft accent colors
        static let softRed = Color(hex: "FF6B6B")
        static let softGreen = Color(hex: "51CF66")
        static let softBlue = Color(hex: "339AF0")
        static let softYellow = Color(hex: "FCC419")
        static let softPurple = Color(hex: "845EF7")
        static let softPink = Color(hex: "F06595")
        static let softOrange = Color(hex: "FF922B")
        static let softTeal = Color(hex: "20C997")
    }

    // MARK: - Soft Shadows

    struct Shadows {
        static func soft(color: Color = .black.opacity(0.1), radius: CGFloat = 20, y: CGFloat = 10) -> some View {
            EmptyView()
        }
    }

    // MARK: - Bouncy Animation

    struct Animation {
        static let bouncy = SwiftUI.Animation.spring(response: 0.4, dampingFraction: 0.6, blendDuration: 0)
        static let smooth = SwiftUI.Animation.easeInOut(duration: 0.3)
        static let quick = SwiftUI.Animation.easeOut(duration: 0.2)
        static let celebration = SwiftUI.Animation.spring(response: 0.5, dampingFraction: 0.5, blendDuration: 0)
    }

    // MARK: - Corner Radius

    struct Radius {
        static let small: CGFloat = 12
        static let medium: CGFloat = 16
        static let large: CGFloat = 24
        static let xl: CGFloat = 32
        static let full: CGFloat = 100
    }
}

// MARK: - Color Hex Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Soft Card Modifier

struct SoftCardModifier: ViewModifier {
    var padding: CGFloat = 16
    var cornerRadius: CGFloat = GamifiedTheme.Radius.large

    func body(content: Content) -> some View {
        content
            .padding(padding)
            .background(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .fill(Color.white)
                    .shadow(color: .black.opacity(0.06), radius: 15, x: 0, y: 8)
                    .shadow(color: .black.opacity(0.04), radius: 3, x: 0, y: 2)
            )
    }
}

extension View {
    func softCard(padding: CGFloat = 16, cornerRadius: CGFloat = GamifiedTheme.Radius.large) -> some View {
        modifier(SoftCardModifier(padding: padding, cornerRadius: cornerRadius))
    }
}

// MARK: - Gradient Card Modifier

struct GradientCardModifier: ViewModifier {
    let gradient: LinearGradient
    var padding: CGFloat = 16
    var cornerRadius: CGFloat = GamifiedTheme.Radius.large

    func body(content: Content) -> some View {
        content
            .padding(padding)
            .background(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .fill(gradient)
                    .shadow(color: .black.opacity(0.15), radius: 15, x: 0, y: 8)
            )
    }
}

extension View {
    func gradientCard(_ gradient: LinearGradient, padding: CGFloat = 16, cornerRadius: CGFloat = GamifiedTheme.Radius.large) -> some View {
        modifier(GradientCardModifier(gradient: gradient, padding: padding, cornerRadius: cornerRadius))
    }
}

// MARK: - Press Effect Modifier

struct PressEffectModifier: ViewModifier {
    @State private var isPressed = false

    func body(content: Content) -> some View {
        content
            .scaleEffect(isPressed ? 0.96 : 1.0)
            .animation(GamifiedTheme.Animation.quick, value: isPressed)
            .simultaneousGesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in isPressed = true }
                    .onEnded { _ in isPressed = false }
            )
    }
}

extension View {
    func pressEffect() -> some View {
        modifier(PressEffectModifier())
    }
}

// MARK: - Shimmer Effect

struct ShimmerModifier: ViewModifier {
    @State private var phase: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .overlay(
                GeometryReader { geometry in
                    LinearGradient(
                        colors: [
                            .clear,
                            .white.opacity(0.4),
                            .clear
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                    .frame(width: geometry.size.width * 2)
                    .offset(x: -geometry.size.width + (geometry.size.width * 2 * phase))
                }
            )
            .mask(content)
            .onAppear {
                withAnimation(.linear(duration: 1.5).repeatForever(autoreverses: false)) {
                    phase = 1
                }
            }
    }
}

extension View {
    func shimmer() -> some View {
        modifier(ShimmerModifier())
    }
}
