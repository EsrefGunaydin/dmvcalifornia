import WidgetKit
import SwiftUI

// MARK: - Widget Entry

struct DMVWidgetEntry: TimelineEntry {
    let date: Date
    let streak: Int
    let longestStreak: Int
    let lastScore: Int?
    let lastQuizTitle: String?
    let recentScores: [Int]
    let totalQuizzes: Int
    let averageScore: Double
}

// MARK: - Timeline Provider

struct DMVWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> DMVWidgetEntry {
        DMVWidgetEntry(
            date: Date(),
            streak: 5,
            longestStreak: 10,
            lastScore: 85,
            lastQuizTitle: "DMV Practice Test",
            recentScores: [75, 80, 85, 90, 88],
            totalQuizzes: 12,
            averageScore: 82.5
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (DMVWidgetEntry) -> Void) {
        let entry = loadWidgetData()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<DMVWidgetEntry>) -> Void) {
        let entry = loadWidgetData()

        // Refresh every hour
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date()) ?? Date()
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func loadWidgetData() -> DMVWidgetEntry {
        let sharedData = SharedWidgetData.load()

        return DMVWidgetEntry(
            date: Date(),
            streak: sharedData.currentStreak,
            longestStreak: sharedData.longestStreak,
            lastScore: sharedData.lastScore,
            lastQuizTitle: sharedData.lastQuizTitle,
            recentScores: sharedData.recentScores,
            totalQuizzes: sharedData.totalQuizzes,
            averageScore: sharedData.averageScore
        )
    }
}

// MARK: - Widget Bundle

@main
struct DMVCaliforniaWidgetBundle: WidgetBundle {
    var body: some Widget {
        DMVStreakWidget()
        DMVProgressWidget()
    }
}

// MARK: - Streak Widget (Small & Medium)

struct DMVStreakWidget: Widget {
    let kind: String = "DMVStreakWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DMVWidgetProvider()) { entry in
            DMVStreakWidgetView(entry: entry)
        }
        .configurationDisplayName("Study Streak")
        .description("Track your daily study streak")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - Progress Widget (Large)

struct DMVProgressWidget: Widget {
    let kind: String = "DMVProgressWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DMVWidgetProvider()) { entry in
            DMVProgressWidgetView(entry: entry)
        }
        .configurationDisplayName("Study Progress")
        .description("View your study progress and scores")
        .supportedFamilies([.systemLarge])
    }
}

// MARK: - Streak Widget View

struct DMVStreakWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: DMVWidgetEntry

    var body: some View {
        switch family {
        case .systemSmall:
            smallView
        case .systemMedium:
            mediumView
        default:
            smallView
        }
    }

    // MARK: - Small Widget View

    private var smallView: some View {
        VStack(spacing: 8) {
            // Flame Icon
            Image(systemName: "flame.fill")
                .font(.system(size: 40))
                .foregroundColor(.orange)

            // Streak Count
            Text("\(entry.streak)")
                .font(.system(size: 36, weight: .bold, design: .rounded))
                .foregroundColor(.primary)

            // Label
            Text(entry.streak == 1 ? "day" : "days")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            LinearGradient(
                colors: [Color.orange.opacity(0.1), Color.orange.opacity(0.05)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
    }

    // MARK: - Medium Widget View

    private var mediumView: some View {
        HStack(spacing: 16) {
            // Left side - Streak
            VStack(spacing: 4) {
                Image(systemName: "flame.fill")
                    .font(.system(size: 32))
                    .foregroundColor(.orange)

                Text("\(entry.streak)")
                    .font(.system(size: 28, weight: .bold, design: .rounded))

                Text("day streak")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            .frame(maxWidth: .infinity)

            Divider()

            // Right side - Last Score
            VStack(spacing: 4) {
                if let score = entry.lastScore {
                    Text("\(score)%")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundColor(score >= 83 ? .green : .orange)

                    if let title = entry.lastQuizTitle {
                        Text(title)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                            .multilineTextAlignment(.center)
                    }

                    Text("Last Score")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                } else {
                    Image(systemName: "doc.text")
                        .font(.system(size: 24))
                        .foregroundColor(.secondary)

                    Text("No quizzes yet")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .frame(maxWidth: .infinity)
        }
        .padding()
        .background(
            LinearGradient(
                colors: [Color.orange.opacity(0.1), Color.orange.opacity(0.05)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
    }
}

// MARK: - Progress Widget View (Large)

struct DMVProgressWidgetView: View {
    let entry: DMVWidgetEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Image(systemName: "car.fill")
                    .foregroundColor(.orange)
                Text("DMV California")
                    .font(.headline)
                Spacer()
                HStack(spacing: 4) {
                    Image(systemName: "flame.fill")
                        .foregroundColor(.orange)
                    Text("\(entry.streak)")
                        .font(.headline)
                }
            }

            Divider()

            // Stats Row
            HStack(spacing: 16) {
                StatItem(title: "Quizzes", value: "\(entry.totalQuizzes)", icon: "doc.text.fill")
                StatItem(title: "Average", value: "\(Int(entry.averageScore))%", icon: "chart.line.uptrend.xyaxis")
                StatItem(title: "Best Streak", value: "\(entry.longestStreak)", icon: "trophy.fill")
            }

            Divider()

            // Recent Scores
            VStack(alignment: .leading, spacing: 8) {
                Text("Recent Scores")
                    .font(.caption)
                    .foregroundColor(.secondary)

                if entry.recentScores.isEmpty {
                    Text("Complete quizzes to see your progress")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 8)
                } else {
                    HStack(spacing: 4) {
                        ForEach(Array(entry.recentScores.suffix(5).enumerated()), id: \.offset) { index, score in
                            ScoreBar(score: score, maxScore: 100)
                        }
                    }
                    .frame(height: 60)
                }
            }

            Spacer()

            // Footer
            if let title = entry.lastQuizTitle, let score = entry.lastScore {
                HStack {
                    Text("Last: \(title)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                    Spacer()
                    Text("\(score)%")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(score >= 83 ? .green : .orange)
                }
            }
        }
        .padding()
        .background(
            LinearGradient(
                colors: [Color.orange.opacity(0.1), Color.orange.opacity(0.05)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
    }
}

// MARK: - Supporting Views

struct StatItem: View {
    let title: String
    let value: String
    let icon: String

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(.orange)
            Text(value)
                .font(.system(size: 16, weight: .bold, design: .rounded))
            Text(title)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

struct ScoreBar: View {
    let score: Int
    let maxScore: Int

    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: 2) {
                Spacer()
                RoundedRectangle(cornerRadius: 4)
                    .fill(score >= 83 ? Color.green : Color.orange)
                    .frame(height: geometry.size.height * CGFloat(score) / CGFloat(maxScore))
                Text("\(score)")
                    .font(.system(size: 8))
                    .foregroundColor(.secondary)
            }
        }
    }
}

// MARK: - Preview

#Preview("Small", as: .systemSmall) {
    DMVStreakWidget()
} timeline: {
    DMVWidgetEntry(date: Date(), streak: 7, longestStreak: 14, lastScore: 88, lastQuizTitle: "Practice Test 1", recentScores: [75, 82, 88, 90, 85], totalQuizzes: 15, averageScore: 84.0)
}

#Preview("Medium", as: .systemMedium) {
    DMVStreakWidget()
} timeline: {
    DMVWidgetEntry(date: Date(), streak: 7, longestStreak: 14, lastScore: 88, lastQuizTitle: "Practice Test 1", recentScores: [75, 82, 88, 90, 85], totalQuizzes: 15, averageScore: 84.0)
}

#Preview("Large", as: .systemLarge) {
    DMVProgressWidget()
} timeline: {
    DMVWidgetEntry(date: Date(), streak: 7, longestStreak: 14, lastScore: 88, lastQuizTitle: "DMV Simulation Test 1", recentScores: [75, 82, 88, 90, 85], totalQuizzes: 15, averageScore: 84.0)
}
