import Foundation
import CoreGraphics

// MARK: - Intersection geometry
// Pure path math, ported from the web app's IntersectionScene.tsx. Everything
// works in a logical 400x400 space; the scene view scales it to fit.

enum IntersectionGeometry {
    static let canvasSize: CGFloat = 400
    static let center: CGFloat = 200
    static let halfRoad: CGFloat = 60

    /// Where a vehicle sits frozen before entering, by the arm it approaches from.
    static func vehicleStart(_ approachFrom: Direction) -> CGPoint {
        switch approachFrom {
        case .south: return CGPoint(x: center + 30, y: 350)
        case .north: return CGPoint(x: center - 30, y: 50)
        case .west:  return CGPoint(x: 50, y: center + 30)
        case .east:  return CGPoint(x: 350, y: center - 30)
        }
    }

    /// Direction a vehicle ends up travelling after applying its turn intent.
    static func resultingDirection(_ approachFrom: Direction, _ intent: Intent) -> Direction {
        let order: [Direction] = [.north, .east, .south, .west]
        let travel: [Direction: Direction] = [
            .south: .north, .north: .south, .west: .east, .east: .west,
        ]
        var idx = order.firstIndex(of: travel[approachFrom]!)!
        if intent == .right { idx = (idx + 1) % 4 }
        if intent == .left { idx = (idx + 3) % 4 }
        return order[idx]
    }

    /// Where a vehicle exits — lane offset matches right-hand-side driving so
    /// it stays in its own lane and never drifts into oncoming traffic.
    static func vehicleExit(_ approachFrom: Direction, _ intent: Intent) -> CGPoint {
        switch resultingDirection(approachFrom, intent) {
        case .north: return CGPoint(x: center + 30, y: 50)
        case .south: return CGPoint(x: center - 30, y: 350)
        case .east:  return CGPoint(x: 350, y: center + 30)
        case .west:  return CGPoint(x: 50, y: center - 30)
        }
    }

    /// The corner point of a vehicle's path: midpoint for a straight move, the
    /// right-angle corner where entry lane meets exit lane for a turn.
    static func vehicleMid(_ approachFrom: Direction, _ intent: Intent,
                           start: CGPoint, exit: CGPoint) -> CGPoint {
        if intent == .straight {
            return CGPoint(x: (start.x + exit.x) / 2, y: (start.y + exit.y) / 2)
        }
        let startVertical = approachFrom == .south || approachFrom == .north
        return startVertical
            ? CGPoint(x: start.x, y: exit.y)
            : CGPoint(x: exit.x, y: start.y)
    }

    /// Pedestrians cross one arm perpendicular to traffic.
    static func pedPath(_ approachFrom: Direction) -> (start: CGPoint, mid: CGPoint, exit: CGPoint) {
        switch approachFrom {
        case .north: return (CGPoint(x: 120, y: 110), CGPoint(x: center, y: 110), CGPoint(x: 280, y: 110))
        case .south: return (CGPoint(x: 280, y: 290), CGPoint(x: center, y: 290), CGPoint(x: 120, y: 290))
        case .west:  return (CGPoint(x: 110, y: 280), CGPoint(x: 110, y: center), CGPoint(x: 110, y: 120))
        case .east:  return (CGPoint(x: 290, y: 120), CGPoint(x: 290, y: center), CGPoint(x: 290, y: 280))
        }
    }

    /// Rotation (degrees) so a north-pointing sprite faces its travel direction.
    static func travelAngle(_ approachFrom: Direction) -> Double {
        switch approachFrom {
        case .south: return 0
        case .north: return 180
        case .west:  return 90
        case .east:  return 270
        }
    }

    /// Facing angle after the turn completes (turners rotate ±90°).
    static func finalAngle(_ approachFrom: Direction, _ intent: Intent) -> Double {
        let base = travelAngle(approachFrom)
        switch intent {
        case .left:     return base - 90
        case .right:    return base + 90
        case .straight: return base
        }
    }
}
