import Foundation

enum Constants {
    enum API {
        static let baseURL = "https://dmvcalifornia.us/api"
        static let leaderboardEndpoint = "/leaderboard"
    }

    enum Storage {
        static let quizHistory = "@dmv_quiz_history"
        static let bookmarks = "@dmv_bookmarks"
        static let streak = "@dmv_streak"
        static let quizProgress = "@dmv_quiz_progress"
        static let appGroup = "group.com.esref.dmvcalifornia"
    }

    enum AdMob {
        #if DEBUG
        static let useTestAds = true
        #else
        static let useTestAds = false
        #endif

        // Production Ad Unit IDs
        enum Production {
            static let banner = "ca-app-pub-5871431582903988/3833956341"
            static let interstitial = "ca-app-pub-5871431582903988/9810716499"
            static let native = "ca-app-pub-5871431582903988/8886639643"
        }

        // Test Ad Unit IDs (Google's official test IDs)
        enum Test {
            static let banner = "ca-app-pub-3940256099942544/2934735716"
            static let interstitial = "ca-app-pub-3940256099942544/4411468910"
            static let native = "ca-app-pub-3940256099942544/3986624511"
        }

        static var bannerAdUnitID: String {
            useTestAds ? Test.banner : Production.banner
        }

        static var interstitialAdUnitID: String {
            useTestAds ? Test.interstitial : Production.interstitial
        }

        static var nativeAdUnitID: String {
            useTestAds ? Test.native : Production.native
        }
    }

    enum Quiz {
        static let passingScore = 83 // Default passing percentage
        static let interstitialAdInterval = 10 // Show ad every N questions
        static let maxHistoryEntries = 100
    }
}
