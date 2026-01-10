import SwiftUI
import Darwin

// MARK: - Confetti View

struct ConfettiView: View {
    let isActive: Bool
    var intensity: ConfettiIntensity = .medium
    var colors: [Color] = [
        .red, .orange, .yellow, .green, .blue, .purple, .pink
    ]

    enum ConfettiIntensity: Int {
        case low = 30
        case medium = 60
        case high = 100
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                if isActive {
                    ForEach(0..<intensity.rawValue, id: \.self) { index in
                        ConfettiPiece(
                            color: colors[index % colors.count],
                            size: geometry.size,
                            delay: Double(index) * 0.02
                        )
                    }
                }
            }
        }
        .allowsHitTesting(false)
    }
}

// MARK: - Confetti Piece

struct ConfettiPiece: View {
    let color: Color
    let size: CGSize
    let delay: Double

    @State private var isAnimating = false
    @State private var rotation = Double.random(in: 0...360)
    @State private var startX: CGFloat = 0
    @State private var drift: CGFloat = 0
    @State private var pieceSize: CGFloat = 12

    private let shape: ConfettiShape = ConfettiShape.allCases.randomElement()!

    enum ConfettiShape: CaseIterable {
        case circle, rectangle, triangle, star
    }

    var body: some View {
        shapeView
            .foregroundColor(color)
            .frame(width: pieceSize, height: pieceSize)
            .rotationEffect(.degrees(isAnimating ? rotation + Double.random(in: 360...720) : rotation))
            .position(x: startX + (isAnimating ? drift : 0), y: isAnimating ? size.height + 50 : -20)
            .opacity(isAnimating ? 0 : 1)
            .onAppear {
                // Randomize starting position across entire screen width
                startX = CGFloat.random(in: 0...size.width)
                // Random horizontal drift while falling
                drift = CGFloat.random(in: -80...80)
                // Random size
                pieceSize = CGFloat.random(in: 8...16)

                withAnimation(
                    .easeOut(duration: Double.random(in: 2...4))
                    .delay(delay)
                ) {
                    isAnimating = true
                }
            }
    }

    @ViewBuilder
    private var shapeView: some View {
        switch shape {
        case .circle:
            Circle()
        case .rectangle:
            Rectangle()
        case .triangle:
            Triangle()
        case .star:
            Star(corners: 5, smoothness: 0.45)
        }
    }
}

// MARK: - Custom Shapes

struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

struct Star: Shape {
    let corners: Int
    let smoothness: CGFloat

    func path(in rect: CGRect) -> Path {
        guard corners >= 2 else { return Path() }

        let center = CGPoint(x: rect.width / 2, y: rect.height / 2)
        var currentAngle: Double = -.pi / 2
        let angleAdjustment: Double = .pi * 2 / Double(corners * 2)
        let innerX = center.x * smoothness
        let innerY = center.y * smoothness
        var path = Path()

        path.move(to: CGPoint(
            x: center.x * Darwin.cos(currentAngle),
            y: center.y * Darwin.sin(currentAngle)
        ))

        var bottomEdge: CGFloat = 0

        for corner in 0..<corners * 2 {
            let sinAngle = CGFloat(Darwin.sin(currentAngle))
            let cosAngle = CGFloat(Darwin.cos(currentAngle))
            let bottom: CGFloat

            if corner.isMultiple(of: 2) {
                bottom = center.y * sinAngle
                path.addLine(to: CGPoint(
                    x: center.x * cosAngle + center.x,
                    y: center.y * sinAngle + center.y
                ))
            } else {
                bottom = innerY * sinAngle
                path.addLine(to: CGPoint(
                    x: innerX * cosAngle + center.x,
                    y: innerY * sinAngle + center.y
                ))
            }

            if bottom > bottomEdge {
                bottomEdge = bottom
            }

            currentAngle += angleAdjustment
        }

        return path
    }
}

// MARK: - Confetti Modifier

struct ConfettiModifier: ViewModifier {
    @Binding var isShowing: Bool
    var intensity: ConfettiView.ConfettiIntensity = .medium

    func body(content: Content) -> some View {
        ZStack {
            content
            ConfettiView(isActive: isShowing, intensity: intensity)
        }
        .onChange(of: isShowing) { newValue in
            if newValue {
                // Auto-hide after animation
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                    isShowing = false
                }
            }
        }
    }
}

extension View {
    func confetti(isShowing: Binding<Bool>, intensity: ConfettiView.ConfettiIntensity = .medium) -> some View {
        modifier(ConfettiModifier(isShowing: isShowing, intensity: intensity))
    }
}

// MARK: - Particle Explosion

struct ParticleExplosion: View {
    let isActive: Bool
    var color: Color = .yellow
    var particleCount: Int = 20

    var body: some View {
        ZStack {
            if isActive {
                ForEach(0..<particleCount, id: \.self) { index in
                    Particle(
                        color: color,
                        angle: .degrees(Double(index) * (360 / Double(particleCount)))
                    )
                }
            }
        }
    }
}

struct Particle: View {
    let color: Color
    let angle: Angle

    @State private var isAnimating = false

    var body: some View {
        Circle()
            .fill(color)
            .frame(width: 8, height: 8)
            .offset(x: isAnimating ? 60 : 0)
            .rotationEffect(angle)
            .opacity(isAnimating ? 0 : 1)
            .scaleEffect(isAnimating ? 0.3 : 1)
            .onAppear {
                withAnimation(.easeOut(duration: 0.6)) {
                    isAnimating = true
                }
            }
    }
}

// MARK: - Sparkle Effect

struct SparkleView: View {
    let isActive: Bool
    var color: Color = .yellow

    @State private var sparkles: [SparkleData] = []

    struct SparkleData: Identifiable {
        let id = UUID()
        let x: CGFloat
        let y: CGFloat
        let size: CGFloat
        let delay: Double
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                ForEach(sparkles) { sparkle in
                    SparkleShape()
                        .fill(color)
                        .frame(width: sparkle.size, height: sparkle.size)
                        .position(x: sparkle.x, y: sparkle.y)
                        .modifier(SparkleAnimationModifier(delay: sparkle.delay))
                }
            }
            .onChange(of: isActive) { newValue in
                if newValue {
                    generateSparkles(in: geometry.size)
                } else {
                    sparkles = []
                }
            }
        }
        .allowsHitTesting(false)
    }

    private func generateSparkles(in size: CGSize) {
        sparkles = (0..<15).map { i in
            SparkleData(
                x: CGFloat.random(in: 0...size.width),
                y: CGFloat.random(in: 0...size.height),
                size: CGFloat.random(in: 10...25),
                delay: Double(i) * 0.1
            )
        }
    }
}

struct SparkleShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)

        for i in 0..<4 {
            let angle = Double(i) * .pi / 2
            let outerPoint = CGPoint(
                x: center.x + CGFloat(Darwin.cos(angle)) * rect.width / 2,
                y: center.y + CGFloat(Darwin.sin(angle)) * rect.height / 2
            )
            let innerAngle1 = angle - .pi / 4
            let innerAngle2 = angle + .pi / 4
            let innerRadius = rect.width / 6
            let innerPoint1 = CGPoint(
                x: center.x + CGFloat(Darwin.cos(innerAngle1)) * innerRadius,
                y: center.y + CGFloat(Darwin.sin(innerAngle1)) * innerRadius
            )
            let innerPoint2 = CGPoint(
                x: center.x + CGFloat(Darwin.cos(innerAngle2)) * innerRadius,
                y: center.y + CGFloat(Darwin.sin(innerAngle2)) * innerRadius
            )

            if i == 0 {
                path.move(to: outerPoint)
            } else {
                path.addLine(to: outerPoint)
            }
            path.addLine(to: innerPoint2)
        }
        path.closeSubpath()
        return path
    }
}

struct SparkleAnimationModifier: ViewModifier {
    let delay: Double
    @State private var scale: CGFloat = 0
    @State private var opacity: Double = 0
    @State private var rotation: Double = 0

    func body(content: Content) -> some View {
        content
            .scaleEffect(scale)
            .opacity(opacity)
            .rotationEffect(.degrees(rotation))
            .onAppear {
                withAnimation(.easeOut(duration: 0.3).delay(delay)) {
                    scale = 1
                    opacity = 1
                    rotation = 45
                }
                withAnimation(.easeIn(duration: 0.3).delay(delay + 0.5)) {
                    scale = 0
                    opacity = 0
                }
            }
    }
}

// MARK: - Trophy Celebration (Top 10 Leaderboard)

struct TrophyCelebrationView: View {
    let isActive: Bool
    let rank: Int

    @State private var showTrophy = false
    @State private var showRank = false
    @State private var showStars = false
    @State private var trophyScale: CGFloat = 0
    @State private var rankScale: CGFloat = 0

    private let goldColor = Color(red: 1.0, green: 0.84, blue: 0.0) // #FFD700
    private let orangeGoldColor = Color(red: 1.0, green: 0.65, blue: 0.0) // #FFA500

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                if isActive {
                    // Background overlay
                    Color.black.opacity(showTrophy ? 0.6 : 0)
                        .ignoresSafeArea()
                        .animation(.easeInOut(duration: 0.3), value: showTrophy)

                    VStack(spacing: 20) {
                        // Trophy
                        ZStack {
                            // Glow effect
                            Circle()
                                .fill(
                                    RadialGradient(
                                        colors: [.yellow.opacity(0.6), .clear],
                                        center: .center,
                                        startRadius: 0,
                                        endRadius: 100
                                    )
                                )
                                .frame(width: 200, height: 200)
                                .scaleEffect(showStars ? 1.5 : 1)
                                .opacity(showStars ? 0.8 : 0)

                            // Trophy icon
                            Image(systemName: "trophy.fill")
                                .font(.system(size: 80))
                                .foregroundStyle(
                                    LinearGradient(
                                        colors: [goldColor, orangeGoldColor],
                                        startPoint: .top,
                                        endPoint: .bottom
                                    )
                                )
                                .shadow(color: .orange.opacity(0.5), radius: 10)
                        }
                        .scaleEffect(trophyScale)

                        // Rank text
                        VStack(spacing: 8) {
                            Text("TOP \(rank)!")
                                .font(.system(size: 36, weight: .black))
                                .foregroundStyle(
                                    LinearGradient(
                                        colors: [.yellow, .orange],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )

                            Text("You made it to the leaderboard!")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.white)
                        }
                        .scaleEffect(rankScale)
                        .opacity(showRank ? 1 : 0)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)

                    // Floating stars
                    if showStars {
                        ForEach(0..<12, id: \.self) { i in
                            FloatingStar(index: i, screenSize: geometry.size)
                        }
                    }
                }
            }
        }
        .onChange(of: isActive) { newValue in
            if newValue {
                startAnimation()
            } else {
                resetAnimation()
            }
        }
        .allowsHitTesting(false)
    }

    private func startAnimation() {
        // Trophy appears with bounce
        withAnimation(.spring(response: 0.5, dampingFraction: 0.6)) {
            showTrophy = true
            trophyScale = 1
        }

        // Rank appears after trophy
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.7)) {
                showRank = true
                rankScale = 1
            }
        }

        // Stars appear
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            withAnimation(.easeOut(duration: 0.5)) {
                showStars = true
            }
        }
    }

    private func resetAnimation() {
        showTrophy = false
        showRank = false
        showStars = false
        trophyScale = 0
        rankScale = 0
    }
}

struct FloatingStar: View {
    let index: Int
    let screenSize: CGSize

    @State private var yOffset: CGFloat = 0
    @State private var opacity: Double = 1
    @State private var rotation: Double = 0
    @State private var xPosition: CGFloat = 0
    @State private var starSize: CGFloat = 16

    var body: some View {
        Image(systemName: "star.fill")
            .font(.system(size: starSize))
            .foregroundColor(.yellow)
            .position(x: xPosition, y: screenSize.height)
            .offset(y: yOffset)
            .opacity(opacity)
            .rotationEffect(.degrees(rotation))
            .onAppear {
                xPosition = CGFloat.random(in: 20...(screenSize.width - 20))
                starSize = CGFloat.random(in: 12...24)
                let delay = Double(index) * 0.1
                withAnimation(.easeOut(duration: 2).delay(delay)) {
                    yOffset = -screenSize.height - 100
                    rotation = Double.random(in: -180...180)
                }
                withAnimation(.easeIn(duration: 0.5).delay(delay + 1.5)) {
                    opacity = 0
                }
            }
    }
}

// MARK: - Trophy Celebration Modifier

struct TrophyCelebrationModifier: ViewModifier {
    @Binding var isShowing: Bool
    let rank: Int
    var autoDismissAfter: Double = 3.0

    func body(content: Content) -> some View {
        ZStack {
            content
            TrophyCelebrationView(isActive: isShowing, rank: rank)
        }
        .onChange(of: isShowing) { newValue in
            if newValue {
                DispatchQueue.main.asyncAfter(deadline: .now() + autoDismissAfter) {
                    isShowing = false
                }
            }
        }
    }
}

extension View {
    func trophyCelebration(isShowing: Binding<Bool>, rank: Int) -> some View {
        modifier(TrophyCelebrationModifier(isShowing: isShowing, rank: rank))
    }
}
