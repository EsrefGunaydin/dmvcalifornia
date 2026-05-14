import SwiftUI

struct IntersectionGameView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel: IntersectionGameViewModel
    let nextLevelId: String?

    init(level: IntersectionLevel, nextLevelId: String?) {
        self.nextLevelId = nextLevelId
        _viewModel = StateObject(wrappedValue: IntersectionGameViewModel(level: level))
    }

    var body: some View {
        VStack(spacing: DMVTheme.Spacing.lg) {
            // Scene
            IntersectionSceneView(
                level: viewModel.level,
                agentPositions: viewModel.agentPositions,
                agentRotations: viewModel.agentRotations,
                agentStatus: viewModel.agentStatus,
                agentBadge: viewModel.agentBadge,
                disabled: viewModel.status != .playing,
                onTap: { viewModel.tap($0) }
            )
            .padding(DMVTheme.Spacing.sm)
            .background(Color.dmvSurface)
            .cornerRadius(DMVTheme.CornerRadius.lg)

            // Status panel
            switch viewModel.status {
            case .playing:  instructionPanel
            case .crashed:  crashPanel
            case .complete: completePanel
            }
        }
        .padding(DMVTheme.Spacing.md)
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.lg)
    }

    // MARK: - Playing

    private var instructionPanel: some View {
        VStack(spacing: DMVTheme.Spacing.xs) {
            Text("Tap the road users in the order they may legally proceed.")
                .font(DMVTheme.Typography.body)
                .foregroundColor(.dmvText)
                .multilineTextAlignment(.center)
            Text("\(viewModel.tappedOrder.count) of \(viewModel.level.agents.count) chosen")
                .font(DMVTheme.Typography.footnote)
                .foregroundColor(.dmvTextSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Crashed

    private var crashPanel: some View {
        VStack(alignment: .leading, spacing: DMVTheme.Spacing.md) {
            HStack(alignment: .top, spacing: DMVTheme.Spacing.sm) {
                Text("💥").font(.system(size: 24))
                VStack(alignment: .leading, spacing: 4) {
                    Text("Collision — wrong order")
                        .font(DMVTheme.Typography.headline)
                        .foregroundColor(.dmvError)
                    Text(viewModel.crashRule ?? "")
                        .font(DMVTheme.Typography.subheadline)
                        .foregroundColor(.dmvText)
                        .fixedSize(horizontal: false, vertical: true)
                    if let cvc = viewModel.level.cvcReference {
                        Text(cvc)
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvTextTertiary)
                            .padding(.top, 2)
                    }
                }
            }
            Button(action: { viewModel.retry() }) {
                Text("Try Again")
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, DMVTheme.Spacing.md)
                    .background(Color.dmvOrange)
                    .cornerRadius(DMVTheme.CornerRadius.md)
            }
        }
        .padding(DMVTheme.Spacing.md)
        .background(Color.dmvError.opacity(0.08))
        .overlay(
            RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                .stroke(Color.dmvError.opacity(0.3), lineWidth: 2)
        )
        .cornerRadius(DMVTheme.CornerRadius.md)
    }

    // MARK: - Complete

    private var completePanel: some View {
        VStack(spacing: DMVTheme.Spacing.md) {
            VStack(spacing: 4) {
                HStack(spacing: 2) {
                    ForEach(0..<3, id: \.self) { i in
                        Text("⭐")
                            .font(.system(size: 26))
                            .opacity(i < (viewModel.savedStars ?? 0) ? 1 : 0.25)
                    }
                }
                Text("Intersection cleared!")
                    .font(DMVTheme.Typography.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.dmvSuccess)
                Text(
                    viewModel.attempts == 0
                        ? "Perfect — solved on the first try."
                        : "Solved after \(viewModel.attempts) \(viewModel.attempts == 1 ? "mistake" : "mistakes")."
                )
                .font(DMVTheme.Typography.footnote)
                .foregroundColor(.dmvTextSecondary)
            }

            // Rule recap
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.sm) {
                Text("Why this is the order:")
                    .font(DMVTheme.Typography.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.dmvText)
                ForEach(Array(viewModel.recapOrder.enumerated()), id: \.offset) { idx, agentId in
                    HStack(alignment: .top, spacing: DMVTheme.Spacing.sm) {
                        Text("\(idx + 1)")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 20, height: 20)
                            .background(Circle().fill(Color.dmvSuccess))
                        (
                            Text(viewModel.displayName(for: agentId)).bold().foregroundColor(.dmvText)
                            + Text(" — \(viewModel.level.stepRules[agentId] ?? "")").foregroundColor(.dmvTextSecondary)
                        )
                        .font(DMVTheme.Typography.subheadline)
                        .fixedSize(horizontal: false, vertical: true)
                    }
                }
                if let cvc = viewModel.level.cvcReference {
                    Text(cvc)
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.dmvTextTertiary)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(DMVTheme.Spacing.md)
            .background(Color.dmvCard)
            .cornerRadius(DMVTheme.CornerRadius.md)

            // Actions
            HStack(spacing: DMVTheme.Spacing.md) {
                Button(action: { viewModel.retry() }) {
                    Text("Replay")
                        .font(DMVTheme.Typography.headline)
                        .foregroundColor(.dmvText)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, DMVTheme.Spacing.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                                .stroke(Color.dmvTextTertiary, lineWidth: 2)
                        )
                }
                Button(action: {
                    if let next = nextLevelId {
                        coordinator.navigate(to: .intersectionLevel(levelId: next))
                    } else {
                        coordinator.pop()
                    }
                }) {
                    Text(nextLevelId != nil ? "Next Level →" : "All Levels")
                        .font(DMVTheme.Typography.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, DMVTheme.Spacing.md)
                        .background(Color.dmvOrange)
                        .cornerRadius(DMVTheme.CornerRadius.md)
                }
            }
        }
        .padding(DMVTheme.Spacing.md)
        .background(Color.dmvSuccess.opacity(0.08))
        .overlay(
            RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                .stroke(Color.dmvSuccess.opacity(0.3), lineWidth: 2)
        )
        .cornerRadius(DMVTheme.CornerRadius.md)
    }
}
