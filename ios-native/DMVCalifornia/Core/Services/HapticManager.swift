import SwiftUI
import UIKit

// MARK: - Haptic Feedback Manager

final class HapticManager {
    static let shared = HapticManager()

    private let lightGenerator = UIImpactFeedbackGenerator(style: .light)
    private let mediumGenerator = UIImpactFeedbackGenerator(style: .medium)
    private let heavyGenerator = UIImpactFeedbackGenerator(style: .heavy)
    private let softGenerator = UIImpactFeedbackGenerator(style: .soft)
    private let rigidGenerator = UIImpactFeedbackGenerator(style: .rigid)
    private let selectionGenerator = UISelectionFeedbackGenerator()
    private let notificationGenerator = UINotificationFeedbackGenerator()

    private init() {
        // Prepare generators
        lightGenerator.prepare()
        mediumGenerator.prepare()
        selectionGenerator.prepare()
        notificationGenerator.prepare()
    }

    // MARK: - Basic Haptics

    func light() {
        lightGenerator.impactOccurred()
    }

    func medium() {
        mediumGenerator.impactOccurred()
    }

    func heavy() {
        heavyGenerator.impactOccurred()
    }

    func soft() {
        softGenerator.impactOccurred()
    }

    func rigid() {
        rigidGenerator.impactOccurred()
    }

    func selection() {
        selectionGenerator.selectionChanged()
    }

    // MARK: - Notification Haptics

    func success() {
        notificationGenerator.notificationOccurred(.success)
    }

    func warning() {
        notificationGenerator.notificationOccurred(.warning)
    }

    func error() {
        notificationGenerator.notificationOccurred(.error)
    }

    // MARK: - Custom Patterns

    func correctAnswer() {
        // Light, quick success
        lightGenerator.impactOccurred(intensity: 0.8)
    }

    func wrongAnswer() {
        // Firm error
        rigidGenerator.impactOccurred(intensity: 0.6)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { [weak self] in
            self?.rigidGenerator.impactOccurred(intensity: 0.4)
        }
    }

    func xpGain() {
        // Subtle celebration
        softGenerator.impactOccurred(intensity: 0.5)
    }

    func levelUp() {
        // Exciting escalation
        Task { @MainActor in
            mediumGenerator.impactOccurred(intensity: 0.6)
            try? await Task.sleep(nanoseconds: 100_000_000)
            heavyGenerator.impactOccurred(intensity: 0.8)
            try? await Task.sleep(nanoseconds: 100_000_000)
            heavyGenerator.impactOccurred(intensity: 1.0)
            try? await Task.sleep(nanoseconds: 150_000_000)
            notificationGenerator.notificationOccurred(.success)
        }
    }

    func achievement() {
        // Special celebration
        Task { @MainActor in
            rigidGenerator.impactOccurred(intensity: 0.7)
            try? await Task.sleep(nanoseconds: 100_000_000)
            rigidGenerator.impactOccurred(intensity: 0.9)
            try? await Task.sleep(nanoseconds: 100_000_000)
            notificationGenerator.notificationOccurred(.success)
        }
    }

    func streakMilestone() {
        // Fire-like haptic
        Task { @MainActor in
            for i in 0..<5 {
                softGenerator.impactOccurred(intensity: CGFloat(i + 1) * 0.2)
                try? await Task.sleep(nanoseconds: 80_000_000)
            }
        }
    }

    func buttonTap() {
        lightGenerator.impactOccurred(intensity: 0.5)
    }

    func cardFlip() {
        mediumGenerator.impactOccurred(intensity: 0.4)
    }

    func quizComplete() {
        Task { @MainActor in
            heavyGenerator.impactOccurred(intensity: 0.8)
            try? await Task.sleep(nanoseconds: 200_000_000)
            notificationGenerator.notificationOccurred(.success)
        }
    }

    func perfectScore() {
        Task { @MainActor in
            for _ in 0..<3 {
                heavyGenerator.impactOccurred(intensity: 1.0)
                try? await Task.sleep(nanoseconds: 150_000_000)
            }
            notificationGenerator.notificationOccurred(.success)
        }
    }
}
