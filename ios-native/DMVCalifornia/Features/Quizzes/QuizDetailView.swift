import SwiftUI

struct QuizDetailView: View {
    let quizId: String
    let quizTitle: String

    @EnvironmentObject private var coordinator: AppCoordinator
    @StateObject private var viewModel: QuizDetailViewModel
    @State private var isLeaderboardExpanded = false
    @State private var showTimeExpiredAlert = false
    @State private var showResumeAlert = false
    @State private var savedProgress: QuizProgress?

    init(quizId: String, quizTitle: String) {
        self.quizId = quizId
        self.quizTitle = quizTitle
        self._viewModel = StateObject(wrappedValue: QuizDetailViewModel(quizId: quizId, quizTitle: quizTitle))
    }

    var body: some View {
        VStack(spacing: 0) {
            if let question = viewModel.currentQuestion {
                ScrollView {
                    VStack(spacing: DMVTheme.Spacing.lg) {
                        // Countdown Timer
                        if viewModel.hasTimeLimit {
                            timerCard
                        }

                        // Progress Header
                        progressHeader

                        // Question Card
                        questionCard(question)

                        // Native Ad
                        NativeAdView(refreshKey: viewModel.nativeAdRefreshKey)

                        // Questions Grid
                        questionsGrid

                        // Banner Ad
                        BannerAdView()

                        // Leaderboard Section
                        leaderboardSection
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical)
                }
            } else if viewModel.isLoading || viewModel.questions.isEmpty && viewModel.error == nil {
                // Show loading when: actively loading OR questions not yet loaded (no error)
                LoadingView("Loading questions...")
            } else {
                EmptyStateView(
                    icon: "exclamationmark.triangle",
                    title: "Error Loading Quiz",
                    message: "Unable to load quiz questions.",
                    actionTitle: "Go Back"
                ) {
                    coordinator.pop()
                }
            }
        }
        .background(Color.dmvBackground)
        .navigationTitle(quizTitle)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    Task { await viewModel.toggleBookmark() }
                } label: {
                    Image(systemName: viewModel.isCurrentQuestionBookmarked ? "bookmark.fill" : "bookmark")
                        .foregroundColor(.dmvOrange)
                }
            }
        }
        .task {
            // Skip if already loaded (e.g., returning from ad)
            guard viewModel.questions.isEmpty else { return }

            // Check for saved progress first
            if let progress = await StorageService.shared.getQuizProgress(),
               progress.quizId == quizId {
                savedProgress = progress
                showResumeAlert = true
            } else {
                await viewModel.loadQuestions()
            }
        }
        .onAppear {
            // Reset alert state when view appears (e.g., after retry)
            if !viewModel.isTimeExpired {
                showTimeExpiredAlert = false
            }
        }
        .onDisappear {
            // Only save progress if NOT showing an ad (ad triggers onDisappear)
            if !viewModel.isShowingAd {
                Task {
                    await viewModel.saveProgress()
                }
                viewModel.cleanUp()
            }
        }
        .alert("Continue Quiz?", isPresented: $showResumeAlert) {
            Button("Continue") {
                Task {
                    await viewModel.loadQuestions()
                    if let progress = savedProgress {
                        viewModel.restoreProgress(progress)
                    }
                }
            }
            Button("Start Over", role: .destructive) {
                Task {
                    await viewModel.clearSavedProgress()
                    await viewModel.loadQuestions()
                }
            }
        } message: {
            if let progress = savedProgress {
                Text("You have an unfinished quiz (\(progress.answeredCount)/\(progress.totalQuestions) questions answered). Would you like to continue?")
            } else {
                Text("Would you like to continue your previous progress?")
            }
        }
        .alert("Time's Up!", isPresented: $showTimeExpiredAlert) {
            Button("View Results") {
                let result = viewModel.finishQuiz()
                coordinator.navigate(to: .quizResults(result: result, quizId: quizId, quizTitle: quizTitle))
            }
        } message: {
            Text("Your time has expired. Your quiz will be submitted automatically.")
        }
        .onChange(of: viewModel.isTimeExpired) { expired in
            if expired {
                showTimeExpiredAlert = true
            }
        }
    }

    // MARK: - Timer Card

    private var timerCard: some View {
        HStack {
            Image(systemName: viewModel.remainingSeconds <= 60 ? "clock.badge.exclamationmark" : "clock")
                .foregroundColor(Color(hex: viewModel.timerColor))
                .font(.system(size: 20))

            Text(viewModel.formattedTime)
                .font(.system(size: 24, weight: .bold, design: .monospaced))
                .foregroundColor(Color(hex: viewModel.timerColor))

            Spacer()

            Text("remaining")
                .font(DMVTheme.Typography.caption)
                .foregroundColor(.dmvTextSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                .fill(Color(hex: viewModel.timerColor).opacity(0.1))
        )
        .overlay(
            RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                .stroke(Color(hex: viewModel.timerColor), lineWidth: 2)
        )
    }

    // MARK: - Progress Header

    private var progressHeader: some View {
        VStack(spacing: DMVTheme.Spacing.sm) {
            HStack {
                Text("Question \(viewModel.currentQuestionIndex + 1) of \(viewModel.totalQuestions)")
                    .font(DMVTheme.Typography.subheadline)
                    .foregroundColor(.dmvText)

                Spacer()

                Text("\(viewModel.progressPercentage)% Complete")
                    .font(DMVTheme.Typography.subheadline)
                    .foregroundColor(.dmvTextSecondary)
            }

            // Animated Progress Bar
            AnimatedProgressBar(
                progress: viewModel.progress,
                height: 6,
                backgroundColor: .dmvBorder,
                foregroundColor: .dmvOrange
            )
        }
    }

    // MARK: - Question Card

    private func questionCard(_ question: Question) -> some View {
        VStack(spacing: DMVTheme.Spacing.md) {
            // Question Image (if available)
            if question.hasImage, let imageName = question.bundleImageName {
                QuestionImageView(imageName: imageName)
            }

            // Question Text Card
            Text(question.question)
                .font(DMVTheme.Typography.title3)
                .foregroundColor(.dmvText)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color.dmvCard)
                .cornerRadius(DMVTheme.CornerRadius.lg)

            // Answer Options (separate cards)
            ForEach(Array(question.options.enumerated()), id: \.offset) { index, option in
                AnswerOptionButton(
                    option: option,
                    index: index,
                    isSelected: viewModel.selectedAnswer == index,
                    isCorrect: index == question.correctAnswer,
                    showResult: viewModel.isAnswerLocked
                ) {
                    viewModel.selectAnswer(index)
                }
            }

            // Explanation (if answer is checked)
            if viewModel.isAnswerLocked, let explanation = question.explanation {
                explanationView(explanation)
            }

            // Navigation Buttons - Side by Side
            HStack(spacing: DMVTheme.Spacing.md) {
                // Previous Button
                Button {
                    viewModel.previousQuestion()
                } label: {
                    Text("Previous")
                        .font(DMVTheme.Typography.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(hex: "9CA3AF"))
                        .cornerRadius(DMVTheme.CornerRadius.md)
                }
                .opacity(viewModel.currentQuestionIndex > 0 ? 1 : 0.5)
                .disabled(viewModel.currentQuestionIndex == 0)

                // Check Answer / Next / Finish Button
                if !viewModel.isAnswerLocked {
                    Button {
                        viewModel.checkAnswer()
                    } label: {
                        Text("Check Answer")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(viewModel.canCheckAnswer ? Color.dmvOrange : Color.gray)
                            .cornerRadius(DMVTheme.CornerRadius.md)
                    }
                    .disabled(!viewModel.canCheckAnswer)
                } else if viewModel.isLastQuestion {
                    Button {
                        let result = viewModel.finishQuiz()
                        coordinator.navigate(to: .quizResults(result: result, quizId: quizId, quizTitle: quizTitle))
                    } label: {
                        Text("Finish")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.dmvOrange)
                            .cornerRadius(DMVTheme.CornerRadius.md)
                    }
                } else {
                    Button {
                        viewModel.nextQuestion()
                    } label: {
                        Text("Next")
                            .font(DMVTheme.Typography.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.dmvOrange)
                            .cornerRadius(DMVTheme.CornerRadius.md)
                    }
                }
            }
        }
    }

    // MARK: - Explanation View

    private func explanationView(_ explanation: String) -> some View {
        HStack(spacing: 0) {
            // Left accent border
            Rectangle()
                .fill(viewModel.isCorrect ? Color.dmvSuccess : Color.dmvOrange)
                .frame(width: 4)

            VStack(alignment: .leading, spacing: DMVTheme.Spacing.xs) {
                Text(viewModel.isCorrect ? "Correct" : "Incorrect")
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(viewModel.isCorrect ? .dmvSuccess : .dmvError)

                Text(explanation)
                    .font(DMVTheme.Typography.body)
                    .foregroundColor(.dmvText)
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(viewModel.isCorrect ? Color.dmvSuccess.opacity(0.1) : Color(hex: "FEF3C7"))
        .cornerRadius(DMVTheme.CornerRadius.md)
    }

    // MARK: - Questions Grid

    private var questionsGrid: some View {
        DMVCard {
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.md) {
                Text("Questions")
                    .font(DMVTheme.Typography.headline)
                    .foregroundColor(.dmvText)

                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 9), spacing: 8) {
                    ForEach(0..<viewModel.totalQuestions, id: \.self) { index in
                        QuestionGridCell(
                            number: index + 1,
                            status: viewModel.questionStatus(at: index)
                        ) {
                            viewModel.goToQuestion(index)
                        }
                    }
                }
            }
        }
    }

    // MARK: - Leaderboard Section

    private var leaderboardSection: some View {
        DMVCard {
            VStack(alignment: .leading, spacing: DMVTheme.Spacing.md) {
                // Header
                HStack {
                    Image(systemName: "trophy.fill")
                        .foregroundColor(.yellow)
                    Text("Leaderboard")
                        .font(DMVTheme.Typography.headline)
                        .foregroundColor(.dmvText)

                    Spacer()

                    Text("\(viewModel.leaderboardTotalAttempts) entries")
                        .font(DMVTheme.Typography.caption)
                        .foregroundColor(.dmvTextSecondary)
                }

                if viewModel.isLoadingLeaderboard {
                    HStack {
                        Spacer()
                        ProgressView()
                        Spacer()
                    }
                    .padding()
                } else if viewModel.leaderboardEntries.isEmpty {
                    Text("No entries yet. Be the first!")
                        .font(DMVTheme.Typography.subheadline)
                        .foregroundColor(.dmvTextSecondary)
                        .frame(maxWidth: .infinity)
                        .padding()
                } else {
                    // Table Header
                    HStack {
                        Text("RANK")
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvTextSecondary)
                            .frame(width: 50, alignment: .leading)

                        Text("NAME")
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvTextSecondary)
                            .frame(maxWidth: .infinity, alignment: .leading)

                        Text("SCORE")
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvTextSecondary)
                            .frame(width: 60, alignment: .center)

                        Text("DATE")
                            .font(DMVTheme.Typography.caption)
                            .foregroundColor(.dmvTextSecondary)
                            .frame(width: 80, alignment: .trailing)
                    }
                    .padding(.horizontal, DMVTheme.Spacing.sm)

                    // Entries (top 5 or all)
                    let entriesToShow = isLeaderboardExpanded ? viewModel.leaderboardEntries : Array(viewModel.leaderboardEntries.prefix(5))
                    ForEach(Array(entriesToShow.enumerated()), id: \.element.id) { index, entry in
                        LeaderboardRow(rank: index + 1, entry: entry)
                    }

                    // Show All / Show Less Button
                    if viewModel.leaderboardEntries.count > 5 {
                        Button {
                            withAnimation(.easeInOut(duration: 0.3)) {
                                isLeaderboardExpanded.toggle()
                            }
                        } label: {
                            Text(isLeaderboardExpanded ? "Show Less" : "Show All \(viewModel.leaderboardEntries.count) Entries")
                                .font(DMVTheme.Typography.subheadline)
                                .foregroundColor(.dmvOrange)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.top, DMVTheme.Spacing.sm)
                    }

                    // Stats
                    Divider()
                        .padding(.vertical, DMVTheme.Spacing.sm)

                    HStack {
                        StatColumn(value: String(format: "%.1f%%", viewModel.leaderboardHighestScore), label: "Highest\nScore")
                        Spacer()
                        StatColumn(value: String(format: "%.1f%%", viewModel.leaderboardAverageScore), label: "Average\nScore")
                        Spacer()
                        StatColumn(value: "\(viewModel.leaderboardTotalAttempts)", label: "Total\nAttempts")
                    }
                    .padding(.horizontal)
                }
            }
        }
    }

    // MARK: - Helpers

    private func difficultyColor(_ difficulty: String) -> Color {
        switch difficulty.lowercased() {
        case "easy": return .dmvEasy
        case "medium": return .dmvMedium
        case "hard": return .dmvHard
        default: return .dmvTextSecondary
        }
    }
}

// MARK: - Question Grid Cell

struct QuestionGridCell: View {
    let number: Int
    let status: QuestionStatus
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text("\(number)")
                .font(DMVTheme.Typography.caption)
                .fontWeight(.medium)
                .foregroundColor(Color(hex: status.textColor))
                .frame(width: 32, height: 32)
                .background(Color(hex: status.backgroundColor))
                .cornerRadius(6)
        }
    }
}

// MARK: - Leaderboard Row

struct LeaderboardRow: View {
    let rank: Int
    let entry: LeaderboardEntry

    var body: some View {
        HStack {
            // Rank with medal for top 3
            Group {
                if rank == 1 {
                    Text("🥇")
                } else if rank == 2 {
                    Text("🥈")
                } else if rank == 3 {
                    Text("🥉")
                } else {
                    Text("#\(rank)")
                        .foregroundColor(.dmvTextSecondary)
                }
            }
            .font(DMVTheme.Typography.subheadline)
            .frame(width: 50, alignment: .leading)

            // Name
            Text(entry.name)
                .font(DMVTheme.Typography.subheadline)
                .foregroundColor(.dmvText)
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)

            // Score
            Text(String(format: "%.1f%%", entry.percentage))
                .font(DMVTheme.Typography.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(entry.percentage >= 83 ? .dmvSuccess : .dmvError)
                .frame(width: 60, alignment: .center)

            // Date
            Text(entry.date)
                .font(DMVTheme.Typography.caption)
                .foregroundColor(.dmvTextSecondary)
                .frame(width: 80, alignment: .trailing)
        }
        .padding(.horizontal, DMVTheme.Spacing.sm)
        .padding(.vertical, DMVTheme.Spacing.xs)
        .background(rank <= 3 ? Color.yellow.opacity(0.1) : Color.clear)
        .cornerRadius(DMVTheme.CornerRadius.sm)
    }
}

// MARK: - Stat Column

struct StatColumn: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(DMVTheme.Typography.title3)
                .fontWeight(.bold)
                .foregroundColor(.dmvText)

            Text(label)
                .font(DMVTheme.Typography.caption)
                .foregroundColor(.dmvTextSecondary)
                .multilineTextAlignment(.center)
        }
    }
}

// MARK: - Answer Option Button

struct AnswerOptionButton: View {
    let option: String
    let index: Int
    let isSelected: Bool
    let isCorrect: Bool
    let showResult: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(option)
                .font(DMVTheme.Typography.body)
                .foregroundColor(textColor)
                .multilineTextAlignment(.leading)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(cardBackground)
                .cornerRadius(DMVTheme.CornerRadius.md)
                .overlay(
                    RoundedRectangle(cornerRadius: DMVTheme.CornerRadius.md)
                        .stroke(borderColor, lineWidth: 2)
                )
        }
        .buttonStyle(.press)
        .bounceOnSelection(isSelected)
        .disabled(showResult)
    }

    private var textColor: Color {
        // Always keep text black/readable
        return .dmvText
    }

    private var cardBackground: Color {
        if showResult && isCorrect {
            return Color(hex: "D1FAE5")  // Light teal/green for correct
        } else if showResult && isSelected && !isCorrect {
            return Color(hex: "FEE2E2")  // Light pink/red for wrong
        } else if isSelected && !showResult {
            return Color(hex: "FEE2E2")  // Light pink when selected (before check)
        } else if showResult && !isSelected && !isCorrect {
            return Color(hex: "F3F4F6")  // Gray background for non-relevant options after submission
        }
        return .dmvCard
    }

    private var borderColor: Color {
        if showResult && isCorrect {
            return .dmvTeal  // Teal border for correct
        } else if showResult && isSelected && !isCorrect {
            return .dmvError  // Red border for wrong
        } else if isSelected {
            return .dmvError  // Red border when selected (before check)
        } else if showResult && !isSelected && !isCorrect {
            return Color(hex: "D1D5DB")  // Gray border for non-relevant options after submission
        }
        return .dmvBorder
    }
}

// MARK: - Question Image View

struct QuestionImageView: View {
    let imageName: String

    var body: some View {
        if let uiImage = loadImage() {
            Image(uiImage: uiImage)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(maxWidth: .infinity)
                .frame(maxHeight: 200)
                .cornerRadius(DMVTheme.CornerRadius.lg)
                .padding()
                .background(Color.dmvCard)
                .cornerRadius(DMVTheme.CornerRadius.lg)
        }
    }

    private func loadImage() -> UIImage? {
        // Try to load from bundle with various extensions
        let extensions = ["jpeg", "jpg", "png", "webp"]

        // Split imageName into directory and filename
        // e.g., "traffic-signs-2/stop" -> directory: "Images/traffic-signs-2", file: "stop"
        let components = imageName.components(separatedBy: "/")
        let fileName: String
        let directory: String

        if components.count > 1 {
            fileName = components.last ?? imageName
            let subDir = components.dropLast().joined(separator: "/")
            directory = "Images/\(subDir)"
        } else {
            fileName = imageName
            directory = "Images"
        }

        for ext in extensions {
            if let path = Bundle.main.path(forResource: fileName, ofType: ext, inDirectory: directory) {
                return UIImage(contentsOfFile: path)
            }
        }

        // Also try directly in Images folder
        for ext in extensions {
            if let path = Bundle.main.path(forResource: fileName, ofType: ext, inDirectory: "Images") {
                return UIImage(contentsOfFile: path)
            }
        }

        return nil
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        QuizDetailView(quizId: "dmv-simulation-test-1", quizTitle: "Test Quiz")
            .environmentObject(AppCoordinator())
    }
}
