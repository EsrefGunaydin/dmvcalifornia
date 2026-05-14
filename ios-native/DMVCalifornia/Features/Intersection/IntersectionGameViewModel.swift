import SwiftUI
import Combine

enum IntersectionGameStatus {
    case playing, crashed, complete
}

@MainActor
final class IntersectionGameViewModel: ObservableObject {
    let level: IntersectionLevel

    @Published var status: IntersectionGameStatus = .playing
    @Published var tappedOrder: [String] = []
    @Published var attempts = 0
    @Published var crashRule: String?
    @Published var savedStars: Int?

    // Per-agent render state, consumed by IntersectionSceneView.
    @Published var agentPositions: [String: CGPoint] = [:]
    @Published var agentRotations: [String: Double] = [:]
    @Published var agentStatus: [String: AgentVisualStatus] = [:]
    @Published var agentBadge: [String: Int] = [:]

    private let storageService: StorageServiceProtocol

    init(level: IntersectionLevel, storageService: StorageServiceProtocol = StorageService.shared) {
        self.level = level
        self.storageService = storageService
        resetState()
    }

    /// The recap order shown on the completion panel.
    var recapOrder: [String] { level.correctOrder }

    func displayName(for agentId: String) -> String {
        guard let agent = level.agents.first(where: { $0.id == agentId }) else { return agentId }
        switch agent.type {
        case .car: return "Car"
        case .pedestrian: return "Pedestrian"
        case .cyclist: return "Cyclist"
        case .emergency: return "Emergency vehicle"
        }
    }

    // MARK: - Interaction

    func tap(_ agentId: String) {
        guard status == .playing else { return }
        let step = tappedOrder.count
        let expected = level.correctOrder[step]

        if agentId == expected {
            tappedOrder.append(agentId)
            agentBadge[agentId] = tappedOrder.count
            agentStatus[agentId] = .moving
            animateThrough(agentId)

            if tappedOrder.count == level.correctOrder.count {
                let stars = starsForAttempts(attempts)
                status = .complete
                savedStars = stars
                persist(stars: stars)
            }
        } else {
            // Wrong tap — collision.
            let key = "\(agentId)>\(expected)"
            crashRule = level.collisionRules[key]
                ?? level.collisionRules["*"]
                ?? "That road user does not have the right of way yet."
            agentStatus[agentId] = .crashed
            status = .crashed
            attempts += 1
        }
    }

    func retry() {
        crashRule = nil
        status = .playing
        tappedOrder = []
        resetState()
    }

    // MARK: - Animation

    private func animateThrough(_ agentId: String) {
        guard let agent = level.agents.first(where: { $0.id == agentId }) else { return }

        let start: CGPoint
        let mid: CGPoint
        let exit: CGPoint
        let finalRotation: Double

        if agent.type == .pedestrian {
            let p = IntersectionGeometry.pedPath(agent.approachFrom)
            start = p.start; mid = p.mid; exit = p.exit
            finalRotation = 0
        } else {
            start = IntersectionGeometry.vehicleStart(agent.approachFrom)
            exit = IntersectionGeometry.vehicleExit(agent.approachFrom, agent.intent)
            mid = IntersectionGeometry.vehicleMid(agent.approachFrom, agent.intent, start: start, exit: exit)
            finalRotation = IntersectionGeometry.finalAngle(agent.approachFrom, agent.intent)
        }

        // Phase 1: start -> corner
        withAnimation(.easeIn(duration: 0.4)) {
            agentPositions[agentId] = mid
        }
        // Phase 2: corner -> exit, rotating into the final direction
        Task { @MainActor in
            try? await Task.sleep(nanoseconds: 400_000_000)
            withAnimation(.easeInOut(duration: 0.4)) {
                self.agentPositions[agentId] = exit
                self.agentRotations[agentId] = finalRotation
            }
            try? await Task.sleep(nanoseconds: 450_000_000)
            self.agentStatus[agentId] = .done
        }
    }

    private func resetState() {
        var positions: [String: CGPoint] = [:]
        var rotations: [String: Double] = [:]
        var statuses: [String: AgentVisualStatus] = [:]
        for agent in level.agents {
            if agent.type == .pedestrian {
                positions[agent.id] = IntersectionGeometry.pedPath(agent.approachFrom).start
                rotations[agent.id] = 0
            } else {
                positions[agent.id] = IntersectionGeometry.vehicleStart(agent.approachFrom)
                rotations[agent.id] = IntersectionGeometry.travelAngle(agent.approachFrom)
            }
            statuses[agent.id] = .idle
        }
        agentPositions = positions
        agentRotations = rotations
        agentStatus = statuses
        agentBadge = [:]
    }

    // MARK: - Persistence

    private func persist(stars: Int) {
        let result = IntersectionResult(
            levelId: level.id,
            stars: stars,
            attempts: attempts,
            solvedAt: Date()
        )
        Task {
            try? await storageService.saveIntersectionResult(result)
        }
    }
}
