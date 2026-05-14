import SwiftUI

// MARK: - Intersection scene
// SwiftUI port of the web app's SVG IntersectionScene. Everything is laid out
// in a logical 400x400 space and scaled to fit. The scene is purely
// presentational — the view model owns positions, rotations and status.

enum AgentVisualStatus {
    case idle, moving, done, crashed
}

// Palette matching the web app's AGENT_COLORS.
let intersectionAgentColors: [Color] = [
    Color(red: 0.145, green: 0.388, blue: 0.922), // blue
    Color(red: 0.486, green: 0.227, blue: 0.929), // violet
    Color(red: 0.031, green: 0.569, blue: 0.698), // cyan
    Color(red: 0.859, green: 0.153, blue: 0.467), // pink
    Color(red: 0.792, green: 0.541, blue: 0.016), // gold
]

/// Colour-code the label pill by what it conveys.
func intersectionLabelStyle(_ label: String) -> (bg: Color, fg: Color) {
    let l = label.lowercased()
    if l.contains("red") { return (Color(red: 0.86, green: 0.15, blue: 0.15), .white) }
    if l.contains("green") { return (Color(red: 0.086, green: 0.639, blue: 0.290), .white) }
    if l.contains("siren") || l.contains("emergency") {
        return (Color(red: 0.86, green: 0.15, blue: 0.15), .white)
    }
    if l.contains("yellow") || l.contains("caution") {
        return (Color(red: 0.96, green: 0.62, blue: 0.07), Color(white: 0.12))
    }
    return (Color(white: 0.12), .white)
}

/// Direction (degrees, 0 = up) a pedestrian crosses, given the arm they wait
/// on. They cross perpendicular to the traffic on that arm.
func pedestrianWalkAngle(_ approachFrom: Direction) -> Double {
    switch approachFrom {
    case .north: return 90   // crosses eastbound
    case .south: return 270  // crosses westbound
    case .west:  return 0    // crosses northbound
    case .east:  return 180  // crosses southbound
    }
}

// MARK: - Scene

struct IntersectionSceneView: View {
    let level: IntersectionLevel
    let agentPositions: [String: CGPoint]
    let agentRotations: [String: Double]
    let agentStatus: [String: AgentVisualStatus]
    let agentBadge: [String: Int]
    let disabled: Bool
    let onTap: (String) -> Void

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            let scale = side / IntersectionGeometry.canvasSize

            ZStack(alignment: .topLeading) {
                IntersectionBackground(type: level.intersectionType)
                    .frame(width: IntersectionGeometry.canvasSize,
                           height: IntersectionGeometry.canvasSize)

                ForEach(Array(level.agents.enumerated()), id: \.element.id) { index, agent in
                    let pos = agentPositions[agent.id]
                        ?? IntersectionGeometry.vehicleStart(agent.approachFrom)
                    let status = agentStatus[agent.id] ?? .idle
                    AgentView(
                        agent: agent,
                        color: intersectionAgentColors[index % intersectionAgentColors.count],
                        rotation: agentRotations[agent.id]
                            ?? IntersectionGeometry.travelAngle(agent.approachFrom),
                        status: status,
                        badge: agentBadge[agent.id],
                        tappable: status == .idle && !disabled,
                        onTap: { onTap(agent.id) }
                    )
                    .position(x: pos.x, y: pos.y)
                }
            }
            .frame(width: IntersectionGeometry.canvasSize, height: IntersectionGeometry.canvasSize)
            .scaleEffect(scale)
            .frame(width: geo.size.width, height: geo.size.height)
        }
        .aspectRatio(1, contentMode: .fit)
    }
}

// MARK: - Static background (roads, signs, signals, crosswalks)

struct IntersectionBackground: View {
    let type: IntersectionType

    var body: some View {
        Canvas { ctx, size in
            let c = IntersectionGeometry.center
            let hr = IntersectionGeometry.halfRoad
            let isT = type == .tIntersection

            // ground
            ctx.fill(
                Path(roundedRect: CGRect(x: 0, y: 0, width: size.width, height: size.height),
                     cornerRadius: 12),
                with: .color(Color(red: 0.91, green: 0.94, blue: 0.90))
            )
            // horizontal road
            ctx.fill(
                Path(CGRect(x: 0, y: c - hr, width: size.width, height: hr * 2)),
                with: .color(Color(white: 0.36))
            )
            // vertical road — full, or only the southern arm for a T
            if isT {
                ctx.fill(
                    Path(CGRect(x: c - hr, y: c - hr, width: hr * 2, height: 200 + hr)),
                    with: .color(Color(white: 0.36))
                )
            } else {
                ctx.fill(
                    Path(CGRect(x: c - hr, y: 0, width: hr * 2, height: size.height)),
                    with: .color(Color(white: 0.36))
                )
            }

            // centre lane dashes
            let dash = StrokeStyle(lineWidth: 3, dash: [14, 12])
            let lane = Color(red: 0.96, green: 0.77, blue: 0.26)
            var hLeft = Path(); hLeft.move(to: CGPoint(x: 0, y: c)); hLeft.addLine(to: CGPoint(x: c - hr, y: c))
            ctx.stroke(hLeft, with: .color(lane), style: dash)
            var hRight = Path(); hRight.move(to: CGPoint(x: c + hr, y: c)); hRight.addLine(to: CGPoint(x: size.width, y: c))
            ctx.stroke(hRight, with: .color(lane), style: dash)
            if !isT {
                var vTop = Path(); vTop.move(to: CGPoint(x: c, y: 0)); vTop.addLine(to: CGPoint(x: c, y: c - hr))
                ctx.stroke(vTop, with: .color(lane), style: dash)
            }
            var vBot = Path(); vBot.move(to: CGPoint(x: c, y: c + hr)); vBot.addLine(to: CGPoint(x: c, y: size.height))
            ctx.stroke(vBot, with: .color(lane), style: dash)

            // crosswalks (uncontrolled / signal only)
            if type != .fourWayStop {
                drawCrosswalks(ctx, c: c, hr: hr)
            }

            // intersection controls
            switch type {
            case .fourWayStop:
                for p in [
                    CGPoint(x: c + hr + 16, y: c + hr + 16),
                    CGPoint(x: c - hr - 16, y: c - hr - 16),
                    CGPoint(x: c + hr + 16, y: c - hr - 16),
                    CGPoint(x: c - hr - 16, y: c + hr + 16),
                ] { drawStopSign(ctx, at: p) }
            case .signal:
                for p in [
                    CGPoint(x: c + hr + 14, y: c + hr + 14),
                    CGPoint(x: c - hr - 14, y: c - hr - 14),
                    CGPoint(x: c + hr + 14, y: c - hr - 14),
                    CGPoint(x: c - hr - 14, y: c + hr + 14),
                ] { drawSignalHead(ctx, at: p) }
            default:
                break
            }
        }
    }

    private func drawCrosswalks(_ ctx: GraphicsContext, c: CGFloat, hr: CGFloat) {
        let stripe = Color(white: 0.96)
        func bars(x: CGFloat, y: CGFloat, w: CGFloat, h: CGFloat, vertical: Bool) {
            let count = 6
            for i in 0..<count {
                let rect: CGRect = vertical
                    ? CGRect(x: x + (CGFloat(i) * w) / CGFloat(count), y: y, width: w / CGFloat(count) - 3, height: h)
                    : CGRect(x: x, y: y + (CGFloat(i) * h) / CGFloat(count), width: w, height: h / CGFloat(count) - 3)
                ctx.fill(Path(rect), with: .color(stripe))
            }
        }
        bars(x: c - hr, y: c - hr - 18, w: hr * 2, h: 14, vertical: true)
        bars(x: c - hr, y: c + hr + 4, w: hr * 2, h: 14, vertical: true)
        bars(x: c - hr - 18, y: c - hr, w: 14, h: hr * 2, vertical: false)
        bars(x: c + hr + 4, y: c - hr, w: 14, h: hr * 2, vertical: false)
    }

    private func drawStopSign(_ ctx: GraphicsContext, at p: CGPoint) {
        let r: CGFloat = 11
        var oct = Path()
        for i in 0..<8 {
            let a = (.pi / 4) * Double(i) + .pi / 8
            let pt = CGPoint(x: p.x + r * CGFloat(cos(a)), y: p.y + r * CGFloat(sin(a)))
            if i == 0 { oct.move(to: pt) } else { oct.addLine(to: pt) }
        }
        oct.closeSubpath()
        ctx.fill(oct, with: .color(Color(red: 0.86, green: 0.15, blue: 0.15)))
        ctx.stroke(oct, with: .color(.white), lineWidth: 1.5)
        ctx.draw(
            Text("STOP").font(.system(size: 6, weight: .bold)).foregroundColor(.white),
            at: p
        )
    }

    private func drawSignalHead(_ ctx: GraphicsContext, at p: CGPoint) {
        ctx.fill(
            Path(roundedRect: CGRect(x: p.x - 5, y: p.y - 13, width: 10, height: 26), cornerRadius: 3),
            with: .color(Color(white: 0.16))
        )
        ctx.fill(Path(ellipseIn: CGRect(x: p.x - 3, y: p.y - 10, width: 6, height: 6)),
                 with: .color(Color(red: 0.5, green: 0.11, blue: 0.11)))
        ctx.fill(Path(ellipseIn: CGRect(x: p.x - 3, y: p.y - 3, width: 6, height: 6)),
                 with: .color(Color(red: 0.47, green: 0.21, blue: 0.05)))
        ctx.fill(Path(ellipseIn: CGRect(x: p.x - 3, y: p.y + 4, width: 6, height: 6)),
                 with: .color(Color(red: 0.08, green: 0.33, blue: 0.16)))
    }
}

// MARK: - Agent

struct AgentView: View {
    let agent: Agent
    let color: Color
    let rotation: Double
    let status: AgentVisualStatus
    let badge: Int?
    let tappable: Bool
    let onTap: () -> Void

    var body: some View {
        ZStack {
            // status ring
            if status == .idle && tappable {
                Circle()
                    .stroke(Color(red: 0.957, green: 0.318, blue: 0.118),
                            style: StrokeStyle(lineWidth: 2, dash: [4, 4]))
                    .frame(width: 52, height: 52)
            } else if status == .moving || status == .done {
                Circle()
                    .stroke(Color(red: 0.086, green: 0.639, blue: 0.290), lineWidth: 3)
                    .frame(width: 52, height: 52)
            } else if status == .crashed {
                Circle()
                    .stroke(Color(red: 0.86, green: 0.15, blue: 0.15), lineWidth: 3)
                    .frame(width: 52, height: 52)
            }

            // rotating sprite + intent arrow
            ZStack {
                if agent.type != .pedestrian {
                    IntentArrowView(intent: agent.intent).offset(y: -34)
                }
                AgentSprite(agent: agent, color: color)
            }
            .rotationEffect(.degrees(rotation))
            .opacity(status == .done ? 0.4 : 1)
            .modifier(CrashShake(active: status == .crashed))

            // pedestrian walking-direction arrow (pedestrians never rotate,
            // so the arrow is placed ahead of them in the crossing direction)
            if agent.type == .pedestrian {
                let walkAngle = pedestrianWalkAngle(agent.approachFrom)
                let rad = walkAngle * .pi / 180
                PedestrianArrowView()
                    .rotationEffect(.degrees(walkAngle))
                    .offset(x: CGFloat(sin(rad)) * 26, y: CGFloat(-cos(rad)) * 26)
                    .opacity(status == .done ? 0.4 : 1)
            }

            // order badge (not rotated)
            if let badge {
                Text("\(badge)")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                    .frame(width: 20, height: 20)
                    .background(Circle().fill(Color(red: 0.086, green: 0.639, blue: 0.290)))
                    .overlay(Circle().stroke(.white, lineWidth: 2))
                    .offset(x: 18, y: -22)
            }

            // label pill (not rotated). Kept over the roadway and clear of
            // the corner stop signs: behind N/S cars, and pulled into the
            // travel lane (never into a corner) for E/W cars.
            if let label = agent.label, status == .idle {
                let style = intersectionLabelStyle(label)
                let labelOffset: CGSize = {
                    switch agent.approachFrom {
                    case .north: return CGSize(width: 0, height: -44)
                    case .south: return CGSize(width: 0, height: 40)
                    case .west:  return CGSize(width: 30, height: -40)
                    case .east:  return CGSize(width: -30, height: 40)
                    }
                }()
                Text(label)
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(style.fg)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Capsule().fill(style.bg))
                    .fixedSize()
                    .offset(x: labelOffset.width, y: labelOffset.height)
            }
        }
        .frame(width: 120, height: 120)
        .contentShape(Rectangle())
        .onTapGesture { if tappable { onTap() } }
    }
}

/// Brief shake when an agent is involved in a collision.
struct CrashShake: ViewModifier {
    let active: Bool
    @State private var phase: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .offset(x: active ? phase : 0)
            .onChange(of: active) { isActive in
                guard isActive else { phase = 0; return }
                withAnimation(.linear(duration: 0.08).repeatCount(5, autoreverses: true)) {
                    phase = 4
                }
            }
    }
}

// MARK: - Sprites (drawn pointing "up" / north)

struct AgentSprite: View {
    let agent: Agent
    let color: Color

    var body: some View {
        switch agent.type {
        case .car:        CarSprite(color: color)
        case .cyclist:    CyclistSprite()
        case .pedestrian: PedestrianSprite()
        case .emergency:  EmergencySprite()
        }
    }
}

struct CarSprite: View {
    let color: Color
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 9)
                .fill(color)
                .frame(width: 28, height: 46)
                .overlay(RoundedRectangle(cornerRadius: 9).strokeBorder(Color(white: 0.12), lineWidth: 1.5))
            RoundedRectangle(cornerRadius: 5)
                .fill(Color.black.opacity(0.24))
                .frame(width: 22, height: 19)
            // windshield
            RoundedRectangle(cornerRadius: 3)
                .fill(Color(red: 0.81, green: 0.91, blue: 1.0))
                .frame(width: 18, height: 8)
                .offset(y: -12)
            // rear window
            RoundedRectangle(cornerRadius: 3)
                .fill(Color(red: 0.81, green: 0.91, blue: 1.0).opacity(0.8))
                .frame(width: 16, height: 6)
                .offset(y: 13)
            // headlights
            HStack(spacing: 12) {
                Capsule().fill(Color(red: 1, green: 0.97, blue: 0.8)).frame(width: 5, height: 3)
                Capsule().fill(Color(red: 1, green: 0.97, blue: 0.8)).frame(width: 5, height: 3)
            }.offset(y: -20)
            // taillights
            HStack(spacing: 12) {
                Capsule().fill(Color.red).frame(width: 5, height: 3)
                Capsule().fill(Color.red).frame(width: 5, height: 3)
            }.offset(y: 20)
        }
        .frame(width: 40, height: 52)
    }
}

struct CyclistSprite: View {
    var body: some View {
        ZStack {
            Capsule().fill(Color(white: 0.12)).frame(width: 6, height: 17).offset(y: -13)
            Capsule().fill(Color(white: 0.12)).frame(width: 6, height: 17).offset(y: 13)
            Rectangle().fill(Color(red: 0.082, green: 0.502, blue: 0.239)).frame(width: 3, height: 26)
            Capsule().fill(Color(white: 0.22)).frame(width: 14, height: 2.6).offset(y: -8)
            Circle().fill(Color(red: 0.086, green: 0.639, blue: 0.290))
                .frame(width: 14, height: 14)
                .overlay(Circle().stroke(.white, lineWidth: 1.6))
                .offset(y: 1)
            Circle().fill(Color(red: 0.99, green: 0.91, blue: 0.55)).frame(width: 6, height: 6).offset(y: -0.5)
        }
        .frame(width: 30, height: 44)
    }
}

struct PedestrianSprite: View {
    var body: some View {
        ZStack {
            Ellipse().fill(Color(red: 0.96, green: 0.62, blue: 0.07))
                .frame(width: 18, height: 13)
                .overlay(Ellipse().stroke(.white, lineWidth: 2))
                .offset(y: 3)
            Circle().fill(Color(red: 0.99, green: 0.83, blue: 0.30))
                .frame(width: 12, height: 12)
                .overlay(Circle().stroke(.white, lineWidth: 2))
                .offset(y: -4)
        }
        .frame(width: 26, height: 26)
    }
}

struct EmergencySprite: View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 7)
                .fill(Color(red: 0.97, green: 0.98, blue: 0.99))
                .frame(width: 30, height: 50)
                .overlay(RoundedRectangle(cornerRadius: 7).strokeBorder(Color(red: 0.86, green: 0.15, blue: 0.15), lineWidth: 2.2))
            RoundedRectangle(cornerRadius: 2)
                .fill(Color(red: 0.86, green: 0.15, blue: 0.15))
                .frame(width: 24, height: 6)
                .offset(y: -22)
            RoundedRectangle(cornerRadius: 3)
                .fill(Color(red: 0.81, green: 0.91, blue: 1.0))
                .frame(width: 20, height: 7)
                .offset(y: -13)
            // red cross
            ZStack {
                Rectangle().fill(Color(red: 0.86, green: 0.15, blue: 0.15)).frame(width: 5, height: 15)
                Rectangle().fill(Color(red: 0.86, green: 0.15, blue: 0.15)).frame(width: 15, height: 5)
            }.offset(y: 6)
            HStack(spacing: 12) {
                Capsule().fill(Color.red).frame(width: 5, height: 3)
                Capsule().fill(Color.red).frame(width: 5, height: 3)
            }.offset(y: 21)
        }
        .frame(width: 40, height: 56)
    }
}

// MARK: - Intent arrow

struct IntentArrowView: View {
    let intent: Intent

    var body: some View {
        Canvas { ctx, _ in
            // 70x70 canvas; bottom-centre (35,70) sits at the front of the car.
            let amber = Color(red: 0.96, green: 0.62, blue: 0.07)
            var shaft = Path()
            var headCenter = CGPoint(x: 35, y: 24)
            var headRotation: Angle = .zero

            switch intent {
            case .straight:
                shaft.move(to: CGPoint(x: 35, y: 42))
                shaft.addLine(to: CGPoint(x: 35, y: 24))
                headCenter = CGPoint(x: 35, y: 24)
                headRotation = .degrees(0)
            case .left:
                shaft.move(to: CGPoint(x: 41, y: 42))
                shaft.addLine(to: CGPoint(x: 41, y: 28))
                shaft.addQuadCurve(to: CGPoint(x: 35, y: 22), control: CGPoint(x: 41, y: 22))
                shaft.addLine(to: CGPoint(x: 25, y: 22))
                headCenter = CGPoint(x: 25, y: 22)
                headRotation = .degrees(-90)
            case .right:
                shaft.move(to: CGPoint(x: 29, y: 42))
                shaft.addLine(to: CGPoint(x: 29, y: 28))
                shaft.addQuadCurve(to: CGPoint(x: 35, y: 22), control: CGPoint(x: 29, y: 22))
                shaft.addLine(to: CGPoint(x: 45, y: 22))
                headCenter = CGPoint(x: 45, y: 22)
                headRotation = .degrees(90)
            }

            // white halo + amber shaft
            ctx.stroke(shaft, with: .color(.white),
                       style: StrokeStyle(lineWidth: 9, lineCap: .round, lineJoin: .round))
            ctx.stroke(shaft, with: .color(amber),
                       style: StrokeStyle(lineWidth: 5, lineCap: .round, lineJoin: .round))

            // arrowhead — triangle apex pointing up, rotated per intent
            var head = Path()
            head.move(to: CGPoint(x: 0, y: -8))
            head.addLine(to: CGPoint(x: 8, y: 5))
            head.addLine(to: CGPoint(x: -8, y: 5))
            head.closeSubpath()
            var headCtx = ctx
            headCtx.translateBy(x: headCenter.x, y: headCenter.y)
            headCtx.rotate(by: headRotation)
            headCtx.fill(head, with: .color(amber))
            headCtx.stroke(head, with: .color(.white), lineWidth: 2.5)
        }
        .frame(width: 70, height: 70)
    }
}

/// Compact straight arrow for pedestrians — points "up" by default and is
/// rotated to the crossing direction by the caller.
struct PedestrianArrowView: View {
    var body: some View {
        Canvas { ctx, _ in
            // 44x44 canvas, arrow points up.
            let amber = Color(red: 0.96, green: 0.62, blue: 0.07)
            var shaft = Path()
            shaft.move(to: CGPoint(x: 22, y: 33))
            shaft.addLine(to: CGPoint(x: 22, y: 17))
            ctx.stroke(shaft, with: .color(.white),
                       style: StrokeStyle(lineWidth: 8, lineCap: .round))
            ctx.stroke(shaft, with: .color(amber),
                       style: StrokeStyle(lineWidth: 4.5, lineCap: .round))

            var head = Path()
            head.move(to: CGPoint(x: 22, y: 8))
            head.addLine(to: CGPoint(x: 30, y: 21))
            head.addLine(to: CGPoint(x: 14, y: 21))
            head.closeSubpath()
            ctx.fill(head, with: .color(amber))
            ctx.stroke(head, with: .color(.white), lineWidth: 2.5)
        }
        .frame(width: 44, height: 44)
    }
}
