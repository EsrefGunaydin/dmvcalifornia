import SwiftUI

// MARK: - Skeleton View

struct SkeletonView: View {
    var cornerRadius: CGFloat = 8

    @State private var isAnimating = false

    var body: some View {
        GeometryReader { geometry in
            RoundedRectangle(cornerRadius: cornerRadius)
                .fill(Color.dmvBorder.opacity(0.3))
                .overlay(
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color.clear,
                                    Color.white.opacity(0.4),
                                    Color.clear
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .offset(x: isAnimating ? geometry.size.width : -geometry.size.width)
                )
                .clipped()
        }
        .onAppear {
            withAnimation(
                .linear(duration: 1.5)
                .repeatForever(autoreverses: false)
            ) {
                isAnimating = true
            }
        }
    }
}

// MARK: - Skeleton Card (Quiz/Flashcard)

struct SkeletonCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: DMVTheme.Spacing.sm) {
            // Title skeleton (2 lines)
            SkeletonView()
                .frame(height: 16)

            SkeletonView()
                .frame(width: 100, height: 16)

            Spacer()

            // Count skeleton
            SkeletonView()
                .frame(width: 80, height: 14)
        }
        .padding()
        .frame(height: 110)
        .background(Color.dmvCard)
        .cornerRadius(DMVTheme.CornerRadius.lg)
        .dmvShadow(DMVTheme.Shadow.sm)
    }
}

// MARK: - Skeleton Grid

struct SkeletonGrid: View {
    let columns: Int
    let rows: Int

    private var gridColumns: [GridItem] {
        Array(repeating: GridItem(.flexible()), count: columns)
    }

    var body: some View {
        LazyVGrid(columns: gridColumns, spacing: DMVTheme.Spacing.md) {
            ForEach(0..<(columns * rows), id: \.self) { _ in
                SkeletonCard()
            }
        }
        .padding()
    }
}

// MARK: - Skeleton Filter Chips

struct SkeletonFilterChips: View {
    let count: Int

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: DMVTheme.Spacing.sm) {
                ForEach(0..<count, id: \.self) { index in
                    SkeletonView(cornerRadius: 20)
                        .frame(width: index == 0 ? 50 : 60, height: 36)
                }
            }
            .padding(.horizontal)
        }
    }
}

// MARK: - Quiz List Skeleton

struct QuizListSkeleton: View {
    var body: some View {
        VStack(spacing: 0) {
            // Search bar skeleton
            VStack(spacing: DMVTheme.Spacing.md) {
                SkeletonView(cornerRadius: DMVTheme.CornerRadius.md)
                    .frame(height: 48)
                    .padding(.horizontal)

                // Filter chips skeleton
                SkeletonFilterChips(count: 5)
            }
            .padding(.vertical)
            .background(Color.dmvBackground)

            // Grid skeleton
            ScrollView {
                SkeletonGrid(columns: 2, rows: 4)
            }
        }
    }
}

// MARK: - Flashcard List Skeleton

struct FlashcardListSkeleton: View {
    var body: some View {
        VStack(spacing: 0) {
            // Filter chips skeleton
            SkeletonFilterChips(count: 5)
                .padding(.vertical, DMVTheme.Spacing.md)
                .background(Color.dmvBackground)

            // Grid skeleton
            ScrollView {
                SkeletonGrid(columns: 2, rows: 3)
            }
        }
    }
}

// MARK: - Preview

#Preview {
    VStack {
        QuizListSkeleton()
    }
    .background(Color.dmvBackground)
}
