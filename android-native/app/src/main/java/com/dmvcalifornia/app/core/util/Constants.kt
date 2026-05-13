package com.dmvcalifornia.app.core.util

import com.dmvcalifornia.app.BuildConfig

object Constants {
    object Api {
        const val BASE_URL = "https://dmvcalifornia.us/api/"
        const val LEADERBOARD_ENDPOINT = "leaderboard"
    }

    object Storage {
        const val QUIZ_HISTORY = "dmv_quiz_history"
        const val BOOKMARKS = "dmv_bookmarks"
        const val STREAK = "dmv_streak"
        const val QUIZ_PROGRESS = "dmv_quiz_progress"
        const val USER_PROGRESS = "userProgress"
        const val DAILY_CHALLENGES = "dailyChallenges"
        const val PENDING_SUBMISSIONS = "pendingLeaderboardSubmissions"
        const val ONBOARDING_COMPLETED = "onboarding_completed"
        const val PREFS_NAME = "dmv_california_prefs"
    }

    object AdMob {
        val USE_TEST_ADS = BuildConfig.DEBUG

        object Production {
            const val BANNER = "ca-app-pub-5871431582903988/ANDROID_BANNER_ID"
            const val INTERSTITIAL = "ca-app-pub-5871431582903988/ANDROID_INTERSTITIAL_ID"
            const val NATIVE = "ca-app-pub-5871431582903988/ANDROID_NATIVE_ID"
        }

        object Test {
            const val BANNER = "ca-app-pub-3940256099942544/6300978111"
            const val INTERSTITIAL = "ca-app-pub-3940256099942544/1033173712"
            const val NATIVE = "ca-app-pub-3940256099942544/2247696110"
        }

        val bannerAdUnitId: String
            get() = if (USE_TEST_ADS) Test.BANNER else Production.BANNER

        val interstitialAdUnitId: String
            get() = if (USE_TEST_ADS) Test.INTERSTITIAL else Production.INTERSTITIAL

        val nativeAdUnitId: String
            get() = if (USE_TEST_ADS) Test.NATIVE else Production.NATIVE
    }

    object Quiz {
        const val PASSING_SCORE = 83
        const val INTERSTITIAL_AD_INTERVAL = 10
        const val MAX_HISTORY_ENTRIES = 100
    }
}
