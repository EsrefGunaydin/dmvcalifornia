import SwiftUI

struct FlashcardDeckView: View {
    let flashcardSet: FlashcardSet

    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel: FlashcardDeckViewModel

    init(flashcardSet: FlashcardSet) {
        self.flashcardSet = flashcardSet
        self._viewModel = StateObject(wrappedValue: FlashcardDeckViewModel(flashcardSet: flashcardSet))
    }

    var body: some View {
        ScrollView {
            VStack(spacing: DMVTheme.Spacing.lg) {
                // Progress
                VStack(spacing: DMVTheme.Spacing.sm) {
                    ProgressView(value: viewModel.progress)
                        .tint(.dmvTeal)

                    Text("Card \(viewModel.currentCardIndex + 1) of \(flashcardSet.cards.count)")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.dmvTextSecondary)
                }

                // Flashcard
                if let card = viewModel.currentCard {
                    FlashcardCardView(
                        question: card.question,
                        answer: card.answer,
                        isFlipped: $viewModel.isFlipped
                    )
                    .onTapGesture {
                        withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                            viewModel.flipCard()
                        }
                    }
                }

                // Navigation Buttons - Side by Side
                HStack(spacing: DMVTheme.Spacing.md) {
                    // Previous Button
                    Button {
                        viewModel.previousCard()
                    } label: {
                        Text("Previous")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(hex: "9CA3AF"))
                            .cornerRadius(DMVTheme.CornerRadius.md)
                    }
                    .opacity(viewModel.currentCardIndex > 0 ? 1 : 0.5)
                    .disabled(viewModel.currentCardIndex == 0)

                    // Next Button
                    Button {
                        viewModel.nextCard()
                    } label: {
                        Text(viewModel.isLastCard ? "Done" : "Next")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.dmvOrange)
                            .cornerRadius(DMVTheme.CornerRadius.md)
                    }
                }

                // Native Ad
                NativeAdView(refreshKey: viewModel.nativeAdRefreshKey)
            }
            .padding()
        }
        .background(Color.dmvBackground)
        .navigationTitle(flashcardSet.title)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Restart") {
                    viewModel.restart()
                }
                .foregroundColor(.dmvOrange)
            }
        }
    }
}

// MARK: - Flashcard Card View

struct FlashcardCardView: View {
    let question: String
    let answer: String
    @Binding var isFlipped: Bool

    var body: some View {
        ZStack {
            // Front (Question)
            cardFace(label: "Question", text: question, color: .dmvTeal)
                .rotation3DEffect(.degrees(isFlipped ? 180 : 0), axis: (x: 0, y: 1, z: 0))
                .opacity(isFlipped ? 0 : 1)

            // Back (Answer)
            cardFace(label: "Answer", text: answer, color: .dmvOrange)
                .rotation3DEffect(.degrees(isFlipped ? 0 : -180), axis: (x: 0, y: 1, z: 0))
                .opacity(isFlipped ? 1 : 0)
        }
    }

    private func cardFace(label: String, text: String, color: Color) -> some View {
        VStack(spacing: DMVTheme.Spacing.lg) {
            Text(label)
                .font(DMVTheme.Typography.caption)
                .foregroundColor(.white)
                .padding(.horizontal, DMVTheme.Spacing.md)
                .padding(.vertical, DMVTheme.Spacing.xs)
                .background(color)
                .cornerRadius(DMVTheme.CornerRadius.full)

            Text(text)
                .font(DMVTheme.Typography.title3)
                .foregroundColor(.dmvText)
                .multilineTextAlignment(.center)
                .padding()
        }
        .frame(maxWidth: .infinity, minHeight: 300)
        .padding()
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.xl)
        .dmvShadow(DMVTheme.Shadow.lg)
    }
}

// MARK: - ViewModel

@MainActor
final class FlashcardDeckViewModel: ObservableObject {
    @Published var currentCardIndex = 0
    @Published var isFlipped = false
    @Published var nativeAdRefreshKey = 0

    let flashcardSet: FlashcardSet

    init(flashcardSet: FlashcardSet) {
        self.flashcardSet = flashcardSet
    }

    var currentCard: Flashcard? {
        guard currentCardIndex < flashcardSet.cards.count else { return nil }
        return flashcardSet.cards[currentCardIndex]
    }

    var progress: Double {
        Double(currentCardIndex + 1) / Double(flashcardSet.cards.count)
    }

    var isLastCard: Bool {
        currentCardIndex == flashcardSet.cards.count - 1
    }

    func flipCard() {
        isFlipped.toggle()
    }

    func nextCard() {
        guard !isLastCard else { return }
        currentCardIndex += 1
        isFlipped = false
        // Refresh native ad
        nativeAdRefreshKey += 1
    }

    func previousCard() {
        guard currentCardIndex > 0 else { return }
        currentCardIndex -= 1
        isFlipped = false
        // Refresh native ad
        nativeAdRefreshKey += 1
    }

    func restart() {
        currentCardIndex = 0
        isFlipped = false
        // Refresh native ad
        nativeAdRefreshKey += 1
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        FlashcardDeckView(flashcardSet: FlashcardSet(
            id: "1",
            title: "Test Set",
            description: "Test description",
            category: "Test",
            slug: "test",
            language: nil,
            cards: [
                Flashcard(id: 1, question: "What is the speed limit?", answer: "65 mph"),
                Flashcard(id: 2, question: "When to use turn signals?", answer: "100 feet before turning")
            ]
        ))
        .environmentObject(AppCoordinator())
    }
}
