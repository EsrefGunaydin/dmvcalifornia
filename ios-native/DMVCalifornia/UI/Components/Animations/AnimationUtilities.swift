import SwiftUI

// MARK: - Press Effect Button Style

struct PressEffectButtonStyle: ButtonStyle {
    var scale: CGFloat = 0.95
    var opacity: CGFloat = 0.9
    var enableHaptic: Bool = true

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? scale : 1.0)
            .opacity(configuration.isPressed ? opacity : 1.0)
            .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
            .onChange(of: configuration.isPressed) { isPressed in
                if isPressed && enableHaptic {
                    HapticManager.shared.light()
                }
            }
    }
}

extension ButtonStyle where Self == PressEffectButtonStyle {
    static var press: PressEffectButtonStyle { PressEffectButtonStyle() }
    static func press(scale: CGFloat = 0.95, haptic: Bool = true) -> PressEffectButtonStyle {
        PressEffectButtonStyle(scale: scale, enableHaptic: haptic)
    }
}

// MARK: - Bounce Button Style

struct BounceButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.92 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: configuration.isPressed)
            .onChange(of: configuration.isPressed) { isPressed in
                if isPressed {
                    HapticManager.shared.medium()
                }
            }
    }
}

extension ButtonStyle where Self == BounceButtonStyle {
    static var bounce: BounceButtonStyle { BounceButtonStyle() }
}

// MARK: - Card Entrance Animation Modifier

struct CardEntranceModifier: ViewModifier {
    let index: Int
    let totalItems: Int
    @State private var isVisible = false

    var delay: Double {
        Double(index) * 0.05
    }

    func body(content: Content) -> some View {
        content
            .opacity(isVisible ? 1 : 0)
            .offset(y: isVisible ? 0 : 20)
            .scaleEffect(isVisible ? 1 : 0.95)
            .onAppear {
                withAnimation(.spring(response: 0.4, dampingFraction: 0.8).delay(delay)) {
                    isVisible = true
                }
            }
    }
}

extension View {
    func cardEntrance(index: Int, total: Int = 10) -> some View {
        modifier(CardEntranceModifier(index: index, totalItems: total))
    }
}

// MARK: - Staggered List Animation

struct StaggeredAnimationModifier: ViewModifier {
    let index: Int
    let animation: Animation
    @State private var isVisible = false

    init(index: Int, baseDelay: Double = 0.05) {
        self.index = index
        self.animation = .spring(response: 0.5, dampingFraction: 0.7)
            .delay(Double(index) * baseDelay)
    }

    func body(content: Content) -> some View {
        content
            .opacity(isVisible ? 1 : 0)
            .offset(y: isVisible ? 0 : 30)
            .onAppear {
                withAnimation(animation) {
                    isVisible = true
                }
            }
    }
}

extension View {
    func staggeredAnimation(index: Int, baseDelay: Double = 0.05) -> some View {
        modifier(StaggeredAnimationModifier(index: index, baseDelay: baseDelay))
    }
}

// MARK: - Animated Progress Bar

struct AnimatedProgressBar: View {
    let progress: Double
    var height: CGFloat = 6
    var backgroundColor: Color = .dmvBorder
    var foregroundColor: Color = .dmvOrange
    var animationDuration: Double = 0.8

    @State private var animatedProgress: Double = 0

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                // Background
                Rectangle()
                    .fill(backgroundColor)
                    .frame(height: height)
                    .cornerRadius(height / 2)

                // Foreground (animated)
                Rectangle()
                    .fill(foregroundColor)
                    .frame(width: geometry.size.width * animatedProgress, height: height)
                    .cornerRadius(height / 2)
            }
        }
        .frame(height: height)
        .onAppear {
            withAnimation(.spring(response: animationDuration, dampingFraction: 0.7)) {
                animatedProgress = progress
            }
        }
        .onChange(of: progress) { newValue in
            withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                animatedProgress = newValue
            }
        }
    }
}

// MARK: - Animated Counter

struct AnimatedCounter: View {
    let value: Int
    let duration: Double
    var font: Font = .system(size: 48, weight: .bold)
    var textColor: Color = .dmvText

    @State private var displayedValue: Int = 0

    var body: some View {
        Text("\(displayedValue)")
            .font(font)
            .foregroundColor(textColor)
            .monospacedDigit()
            .onAppear {
                animateValue()
            }
            .onChange(of: value) { _ in
                animateValue()
            }
    }

    private func animateValue() {
        let startValue = displayedValue
        let endValue = value
        let totalSteps = min(abs(endValue - startValue), 60)
        let stepDuration = duration / Double(max(totalSteps, 1))

        guard totalSteps > 0 else {
            displayedValue = endValue
            return
        }

        for step in 0...totalSteps {
            DispatchQueue.main.asyncAfter(deadline: .now() + stepDuration * Double(step)) {
                let progress = Double(step) / Double(totalSteps)
                // Ease out curve
                let easedProgress = 1 - pow(1 - progress, 3)
                displayedValue = startValue + Int(Double(endValue - startValue) * easedProgress)
            }
        }
    }
}

// MARK: - Animated Percentage Counter

struct AnimatedPercentageCounter: View {
    let percentage: Double
    let duration: Double
    var font: Font = .system(size: 48, weight: .bold)
    var textColor: Color = .dmvText

    @State private var displayedPercentage: Double = 0

    var body: some View {
        Text("\(Int(displayedPercentage))%")
            .font(font)
            .foregroundColor(textColor)
            .monospacedDigit()
            .onAppear {
                animateValue()
            }
    }

    private func animateValue() {
        let steps = 60
        let stepDuration = duration / Double(steps)

        for step in 0...steps {
            DispatchQueue.main.asyncAfter(deadline: .now() + stepDuration * Double(step)) {
                let progress = Double(step) / Double(steps)
                // Ease out curve
                let easedProgress = 1 - pow(1 - progress, 3)
                displayedPercentage = percentage * easedProgress
            }
        }
    }
}

// MARK: - Circular Progress Ring

struct CircularProgressRing: View {
    let progress: Double
    var lineWidth: CGFloat = 12
    var size: CGFloat = 150
    var backgroundColor: Color = Color.dmvBorder
    var foregroundColor: Color = .dmvOrange
    var gradientColors: [Color]? = nil

    @State private var animatedProgress: Double = 0

    var body: some View {
        ZStack {
            // Background ring
            Circle()
                .stroke(backgroundColor, lineWidth: lineWidth)
                .frame(width: size, height: size)

            // Progress ring
            Circle()
                .trim(from: 0, to: animatedProgress)
                .stroke(
                    gradientColors != nil
                        ? AnyShapeStyle(AngularGradient(colors: gradientColors!, center: .center))
                        : AnyShapeStyle(foregroundColor),
                    style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                )
                .frame(width: size, height: size)
                .rotationEffect(.degrees(-90))
        }
        .onAppear {
            withAnimation(.spring(response: 1.0, dampingFraction: 0.7).delay(0.2)) {
                animatedProgress = progress
            }
        }
    }
}

// MARK: - Pulse Animation Modifier

struct PulseModifier: ViewModifier {
    @State private var isPulsing = false
    var minScale: CGFloat = 0.95
    var maxScale: CGFloat = 1.05
    var duration: Double = 1.5

    func body(content: Content) -> some View {
        content
            .scaleEffect(isPulsing ? maxScale : minScale)
            .animation(
                .easeInOut(duration: duration)
                .repeatForever(autoreverses: true),
                value: isPulsing
            )
            .onAppear {
                isPulsing = true
            }
    }
}

extension View {
    func pulse(minScale: CGFloat = 0.95, maxScale: CGFloat = 1.05, duration: Double = 1.5) -> some View {
        modifier(PulseModifier(minScale: minScale, maxScale: maxScale, duration: duration))
    }
}

// MARK: - Glow Animation Modifier

struct GlowModifier: ViewModifier {
    let color: Color
    let radius: CGFloat
    @State private var isGlowing = false

    func body(content: Content) -> some View {
        content
            .shadow(color: color.opacity(isGlowing ? 0.8 : 0.3), radius: isGlowing ? radius : radius / 2)
            .animation(
                .easeInOut(duration: 1.2)
                .repeatForever(autoreverses: true),
                value: isGlowing
            )
            .onAppear {
                isGlowing = true
            }
    }
}

extension View {
    func glow(color: Color = .dmvOrange, radius: CGFloat = 10) -> some View {
        modifier(GlowModifier(color: color, radius: radius))
    }
}

// MARK: - Shake Animation Modifier

struct ShakeModifier: ViewModifier {
    @Binding var trigger: Bool
    var amount: CGFloat = 10
    var shakesPerUnit: CGFloat = 3

    func body(content: Content) -> some View {
        content
            .offset(x: trigger ? 0 : 0)
            .modifier(ShakeEffect(amount: amount, shakesPerUnit: shakesPerUnit, animatableData: trigger ? 1 : 0))
            .onChange(of: trigger) { newValue in
                if newValue {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                        trigger = false
                    }
                }
            }
    }
}

struct ShakeEffect: GeometryEffect {
    var amount: CGFloat
    var shakesPerUnit: CGFloat
    var animatableData: CGFloat

    func effectValue(size: CGSize) -> ProjectionTransform {
        let translation = amount * sin(animatableData * .pi * shakesPerUnit)
        return ProjectionTransform(CGAffineTransform(translationX: translation, y: 0))
    }
}

extension View {
    func shake(trigger: Binding<Bool>, amount: CGFloat = 10) -> some View {
        modifier(ShakeModifier(trigger: trigger, amount: amount))
    }
}

// MARK: - Bounce Effect for Selection

struct BounceSelectionModifier: ViewModifier {
    let isSelected: Bool
    @State private var bounceScale: CGFloat = 1.0

    func body(content: Content) -> some View {
        content
            .scaleEffect(bounceScale)
            .onChange(of: isSelected) { selected in
                if selected {
                    HapticManager.shared.light()
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
                        bounceScale = 1.05
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                        withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) {
                            bounceScale = 1.0
                        }
                    }
                }
            }
    }
}

extension View {
    func bounceOnSelection(_ isSelected: Bool) -> some View {
        modifier(BounceSelectionModifier(isSelected: isSelected))
    }
}

// MARK: - Tab Bar Bounce Modifier

struct TabBarBounceModifier: ViewModifier {
    let isSelected: Bool
    @State private var yOffset: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .offset(y: yOffset)
            .onChange(of: isSelected) { selected in
                if selected {
                    HapticManager.shared.selection()
                    withAnimation(.spring(response: 0.25, dampingFraction: 0.5)) {
                        yOffset = -4
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                        withAnimation(.spring(response: 0.2, dampingFraction: 0.6)) {
                            yOffset = 0
                        }
                    }
                }
            }
    }
}

extension View {
    func tabBarBounce(isSelected: Bool) -> some View {
        modifier(TabBarBounceModifier(isSelected: isSelected))
    }
}

// MARK: - Hero Section Animation

struct HeroAnimationModifier: ViewModifier {
    @State private var isVisible = false
    @State private var iconRotation: Double = 0

    func body(content: Content) -> some View {
        content
            .opacity(isVisible ? 1 : 0)
            .scaleEffect(isVisible ? 1 : 0.8)
            .onAppear {
                withAnimation(.spring(response: 0.6, dampingFraction: 0.7)) {
                    isVisible = true
                }
            }
    }
}

extension View {
    func heroAnimation() -> some View {
        modifier(HeroAnimationModifier())
    }
}

// MARK: - Floating Animation

struct FloatingModifier: ViewModifier {
    @State private var isFloating = false
    var yOffset: CGFloat = 8
    var duration: Double = 2.0

    func body(content: Content) -> some View {
        content
            .offset(y: isFloating ? -yOffset : yOffset)
            .animation(
                .easeInOut(duration: duration)
                .repeatForever(autoreverses: true),
                value: isFloating
            )
            .onAppear {
                isFloating = true
            }
    }
}

extension View {
    func floating(yOffset: CGFloat = 8, duration: Double = 2.0) -> some View {
        modifier(FloatingModifier(yOffset: yOffset, duration: duration))
    }
}
