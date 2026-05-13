import Foundation
import Combine

// MARK: - Question Status for Grid

enum QuestionStatus {
    case unanswered
    case current
    case correct
    case incorrect

    var backgroundColor: String {
        switch self {
        case .unanswered: return "FEE2E2" // Light red/pink
        case .current: return "EE3918"     // Orange (solid)
        case .correct: return "22C55E"     // Green
        case .incorrect: return "EF4444"   // Red
        }
    }

    var textColor: String {
        switch self {
        case .unanswered: return "EE3918"  // Orange text
        case .current: return "FFFFFF"     // White text
        case .correct: return "FFFFFF"     // White text
        case .incorrect: return "FFFFFF"   // White text
        }
    }
}

@MainActor
final class QuizDetailViewModel: ObservableObject {
    @Published var questions: [Question] = []
    @Published var currentQuestionIndex = 0
    @Published var selectedAnswer: Int?
    @Published var isAnswerLocked = false  // True after "Check Answer" is pressed
    @Published var userAnswers: [Int?] = []
    @Published var answeredCorrectly: [Bool?] = []  // Track if each answer was correct
    @Published var bookmarkedQuestions: Set<Int> = []
    @Published var isLoading = false
    @Published var error: Error?
    @Published var nativeAdRefreshKey = 0

    // Leaderboard
    @Published var leaderboardEntries: [LeaderboardEntry] = []
    @Published var leaderboardTotalAttempts: Int = 0
    @Published var leaderboardAverageScore: Double = 0
    @Published var isLoadingLeaderboard = false

    // Quiz metadata
    @Published var timeLimit: Double?
    @Published var passingScore: Int?
    @Published var isRTL: Bool = false

    // Timer
    @Published var remainingSeconds: Int = 0
    @Published var isTimerRunning = false
    @Published var isTimeExpired = false
    @Published var isTimerPaused = false
    @Published var isShowingAd = false
    private var timerTask: Task<Void, Never>?
    private var quizStartTime: Date?
    private var totalTimeLimitSeconds: Int?
    private var pausedTimeRemaining: Int = 0
    private var adNotificationObservers: [Any] = []

    let quizId: String
    let quizTitle: String

    private let quizDataService: QuizDataServiceProtocol
    private let storageService: StorageServiceProtocol
    private let apiClient: APIClientProtocol
    private let interstitialAdManager: InterstitialAdManager

    init(
        quizId: String,
        quizTitle: String,
        quizDataService: QuizDataServiceProtocol = QuizDataService.shared,
        storageService: StorageServiceProtocol = StorageService.shared,
        apiClient: APIClientProtocol = APIClient.shared,
        interstitialAdManager: InterstitialAdManager = InterstitialAdManager.shared
    ) {
        self.quizId = quizId
        self.quizTitle = quizTitle
        self.quizDataService = quizDataService
        self.storageService = storageService
        self.apiClient = apiClient
        self.interstitialAdManager = interstitialAdManager

        setupAdNotificationObservers()
    }

    private func setupAdNotificationObservers() {
        // Pause timer when interstitial ad appears
        let pauseObserver = NotificationCenter.default.addObserver(
            forName: .interstitialAdWillPresent,
            object: nil,
            queue: nil
        ) { [weak self] _ in
            Task { @MainActor in
                self?.pauseTimer()
            }
        }
        adNotificationObservers.append(pauseObserver)

        // Resume timer when interstitial ad dismisses
        let resumeObserver = NotificationCenter.default.addObserver(
            forName: .interstitialAdDidDismiss,
            object: nil,
            queue: nil
        ) { [weak self] _ in
            Task { @MainActor in
                self?.resumeTimer()
            }
        }
        adNotificationObservers.append(resumeObserver)

        // Reset quiz when retry is requested
        let resetObserver = NotificationCenter.default.addObserver(
            forName: .quizShouldReset,
            object: nil,
            queue: nil
        ) { [weak self] _ in
            Task { @MainActor in
                self?.resetQuiz()
            }
        }
        adNotificationObservers.append(resetObserver)
    }

    deinit {
        // Remove notification observers
        for observer in adNotificationObservers {
            NotificationCenter.default.removeObserver(observer)
        }
    }

    // MARK: - Computed Properties

    var currentQuestion: Question? {
        guard currentQuestionIndex < questions.count else { return nil }
        return questions[currentQuestionIndex]
    }

    var totalQuestions: Int {
        questions.count
    }

    var progress: Double {
        guard totalQuestions > 0 else { return 0 }
        // Progress based on answered questions
        let answered = userAnswers.compactMap { $0 }.count
        return Double(answered) / Double(totalQuestions)
    }

    var progressPercentage: Int {
        Int(progress * 100)
    }

    var isLastQuestion: Bool {
        currentQuestionIndex == questions.count - 1
    }

    var isCorrect: Bool {
        guard let selected = selectedAnswer,
              let question = currentQuestion else { return false }
        return selected == question.correctAnswer
    }

    var isCurrentQuestionBookmarked: Bool {
        guard let question = currentQuestion else { return false }
        return bookmarkedQuestions.contains(question.id)
    }

    var canCheckAnswer: Bool {
        selectedAnswer != nil && !isAnswerLocked
    }

    var allQuestionsAnswered: Bool {
        userAnswers.allSatisfy { $0 != nil }
    }

    // Leaderboard stats
    var leaderboardHighestScore: Double {
        leaderboardEntries.map { $0.percentage }.max() ?? 0
    }

    // Timer computed properties
    var formattedTime: String {
        let minutes = remainingSeconds / 60
        let seconds = remainingSeconds % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }

    var timerColor: String {
        if remainingSeconds <= 60 {
            return "EF4444" // Red - less than 1 minute
        } else if remainingSeconds <= 300 {
            return "F59E0B" // Orange/Yellow - less than 5 minutes
        }
        return "22C55E" // Green - plenty of time
    }

    var hasTimeLimit: Bool {
        guard let limit = timeLimit else { return false }
        return limit > 0
    }

    // MARK: - Question Status

    func questionStatus(at index: Int) -> QuestionStatus {
        if index == currentQuestionIndex {
            return .current
        }

        guard let wasCorrect = answeredCorrectly[index] else {
            return .unanswered
        }

        return wasCorrect ? .correct : .incorrect
    }

    // MARK: - Actions

    func loadQuestions() async {
        isLoading = true
        error = nil

        do {
            // Load quiz to get metadata
            if let quiz = try await quizDataService.getQuizById(quizId) {
                timeLimit = quiz.timeLimit
                passingScore = quiz.passingScore
                isRTL = quiz.isRTL
                questions = quiz.questions ?? []
            } else {
                questions = try await quizDataService.getQuizQuestions(quizId: quizId)
            }

            userAnswers = Array(repeating: nil, count: questions.count)
            answeredCorrectly = Array(repeating: nil, count: questions.count)

            // Load bookmarked questions
            let bookmarks = await storageService.getBookmarks()
            bookmarkedQuestions = Set(bookmarks.filter { $0.quizId == quizId }.map { $0.questionId })

            // Record quiz start time and start timer only if not already running
            if quizStartTime == nil {
                quizStartTime = Date()

                // Start timer if quiz has time limit
                if let limit = timeLimit, limit > 0 {
                    startTimer(minutes: limit)
                }
            }

            // Load leaderboard
            await loadLeaderboard()
        } catch {
            self.error = error
        }

        isLoading = false
    }

    // MARK: - Timer Methods

    func startTimer(minutes: Double) {
        totalTimeLimitSeconds = Int(minutes * 60)
        remainingSeconds = totalTimeLimitSeconds!
        isTimerRunning = true
        isTimeExpired = false
        isTimerPaused = false

        runTimer()
    }

    private func runTimer() {
        timerTask?.cancel()
        timerTask = Task { [weak self] in
            while let self = self, self.remainingSeconds > 0, !Task.isCancelled {
                try? await Task.sleep(nanoseconds: 1_000_000_000) // 1 second
                await MainActor.run {
                    // Only decrement if not paused
                    if !self.isTimerPaused && self.remainingSeconds > 0 {
                        self.remainingSeconds -= 1
                    }
                    if self.remainingSeconds == 0 {
                        self.isTimeExpired = true
                        self.isTimerRunning = false
                    }
                }
            }
        }
    }

    func pauseTimer() {
        guard isTimerRunning && !isTimerPaused else { return }
        isTimerPaused = true
        isShowingAd = true
        pausedTimeRemaining = remainingSeconds
        print("[Timer] Paused at \(remainingSeconds) seconds")
    }

    func resumeTimer() {
        guard isTimerPaused else { return }
        isTimerPaused = false
        isShowingAd = false
        print("[Timer] Resumed with \(remainingSeconds) seconds")
    }

    func stopTimer() {
        timerTask?.cancel()
        timerTask = nil
        isTimerRunning = false
        isTimerPaused = false
    }

    func cleanUp() {
        // Don't clean up if we're just showing an ad
        guard !isShowingAd else {
            print("[Timer] Skipping cleanup - ad is showing")
            return
        }
        stopTimer()
    }

    // MARK: - Save Progress (for resume)

    func saveProgress() async {
        // Only save if quiz has started and not all questions answered
        guard !questions.isEmpty,
              !allQuestionsAnswered,
              userAnswers.contains(where: { $0 != nil }) else {
            return
        }

        let progress = QuizProgress(
            quizId: quizId,
            quizTitle: quizTitle,
            currentQuestionIndex: currentQuestionIndex,
            userAnswers: userAnswers,
            answeredCorrectly: answeredCorrectly,
            bookmarkedQuestions: bookmarkedQuestions,
            startTime: quizStartTime ?? Date(),
            remainingSeconds: hasTimeLimit ? remainingSeconds : nil
        )

        try? await storageService.saveQuizProgress(progress)
    }

    func restoreProgress(_ progress: QuizProgress) {
        currentQuestionIndex = progress.currentQuestionIndex
        userAnswers = progress.userAnswers
        answeredCorrectly = progress.answeredCorrectly
        bookmarkedQuestions = Set(progress.bookmarkedQuestions)
        quizStartTime = progress.startTime

        // Restore timer if applicable
        if let remaining = progress.remainingSeconds, remaining > 0 {
            remainingSeconds = remaining
            isTimerRunning = true
            runTimer()
        }

        // Load current question state
        loadQuestionState()
    }

    func clearSavedProgress() async {
        await storageService.clearQuizProgress()
    }

    // MARK: - Reset Quiz (for retry)

    func resetQuiz() {
        // Stop and reset timer
        stopTimer()

        // Reset quiz state
        currentQuestionIndex = 0
        selectedAnswer = nil
        isAnswerLocked = false
        userAnswers = Array(repeating: nil, count: questions.count)
        answeredCorrectly = Array(repeating: nil, count: questions.count)
        isTimeExpired = false
        nativeAdRefreshKey = 0

        // Reset quiz start time
        quizStartTime = Date()

        // Restart timer if there's a time limit
        if let limit = timeLimit, limit > 0 {
            startTimer(minutes: limit)
        }

        // Reset interstitial ad counter
        interstitialAdManager.resetQuestionCount()
    }

    func loadLeaderboard() async {
        isLoadingLeaderboard = true

        do {
            let result = try await apiClient.getLeaderboard(quizId: quizId)
            leaderboardEntries = result.entries
            leaderboardTotalAttempts = result.totalAttempts
            leaderboardAverageScore = result.averageScore
        } catch {
            print("[Leaderboard] Failed to load: \(error.localizedDescription)")
            // Don't set error - leaderboard is optional
        }

        isLoadingLeaderboard = false
    }

    func selectAnswer(_ index: Int) {
        // Allow changing selection only if answer isn't locked
        guard !isAnswerLocked else { return }
        selectedAnswer = index
    }

    func checkAnswer() {
        guard let selected = selectedAnswer, !isAnswerLocked else { return }

        // Lock in the answer
        isAnswerLocked = true
        userAnswers[currentQuestionIndex] = selected

        // Track if correct
        if let question = currentQuestion {
            answeredCorrectly[currentQuestionIndex] = selected == question.correctAnswer
        }

        // Track for interstitial ad
        interstitialAdManager.trackQuestionAnswered()
    }

    func nextQuestion() {
        guard !isLastQuestion else { return }
        currentQuestionIndex += 1
        loadQuestionState()

        // Refresh native ad
        nativeAdRefreshKey += 1
    }

    func previousQuestion() {
        guard currentQuestionIndex > 0 else { return }
        currentQuestionIndex -= 1
        loadQuestionState()

        // Refresh native ad
        nativeAdRefreshKey += 1
    }

    func goToQuestion(_ index: Int) {
        guard index >= 0 && index < questions.count else { return }
        currentQuestionIndex = index
        loadQuestionState()

        // Refresh native ad
        nativeAdRefreshKey += 1
    }

    private func loadQuestionState() {
        selectedAnswer = userAnswers[currentQuestionIndex]
        isAnswerLocked = selectedAnswer != nil
    }

    func toggleBookmark() async {
        guard let question = currentQuestion else { return }

        if bookmarkedQuestions.contains(question.id) {
            try? await storageService.removeBookmark(questionId: question.id, quizId: quizId)
            bookmarkedQuestions.remove(question.id)
        } else {
            let bookmark = BookmarkedQuestion(from: question, quizId: quizId)
            try? await storageService.saveBookmark(bookmark)
            bookmarkedQuestions.insert(question.id)
        }
    }

    func finishQuiz() -> QuizResult {
        // Stop timer
        stopTimer()

        // Clear saved progress since quiz is completed
        Task {
            await clearSavedProgress()
        }

        // Calculate elapsed time
        var elapsedSeconds: Int? = nil
        if let startTime = quizStartTime {
            elapsedSeconds = Int(Date().timeIntervalSince(startTime))
        }

        var correctCount = 0
        var wrongAnswers: [WrongAnswer] = []

        for (index, question) in questions.enumerated() {
            let selected = userAnswers[index]

            if selected == question.correctAnswer {
                correctCount += 1
            } else if let selected = selected {
                wrongAnswers.append(WrongAnswer(
                    questionId: question.id,
                    question: question.question,
                    selectedAnswer: selected,
                    correctAnswer: question.correctAnswer,
                    category: question.category
                ))
            }
        }

        let percentage = Double(correctCount) / Double(questions.count) * 100

        // Save result
        let attempt = QuizAttempt(
            quizId: quizId,
            quizTitle: quizTitle,
            score: correctCount,
            totalQuestions: questions.count,
            percentage: percentage,
            wrongAnswers: wrongAnswers
        )

        Task {
            try? await storageService.saveQuizResult(attempt)
        }

        return QuizResult(
            score: correctCount,
            totalQuestions: questions.count,
            percentage: percentage,
            wrongAnswers: wrongAnswers,
            elapsedSeconds: elapsedSeconds,
            timeLimitSeconds: totalTimeLimitSeconds
        )
    }
}
