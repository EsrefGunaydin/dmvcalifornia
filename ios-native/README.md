# DMV California - Native iOS App

A native Swift/iOS implementation of the DMV California practice test app.

## Tech Stack

- **UI Framework**: SwiftUI
- **Architecture**: MVVM with Combine
- **Minimum iOS**: 15.0+
- **Ads**: Google Mobile Ads SDK 11.0+

## Project Setup

### 1. Create Xcode Project

1. Open Xcode 15+
2. Create a new iOS App project
3. Product Name: `DMVCalifornia`
4. Bundle Identifier: `us.dmvcalifornia.app` (or your own)
5. Interface: SwiftUI
6. Language: Swift

### 2. Add Swift Package Dependencies

Go to File > Add Package Dependencies and add:

- **Google Mobile Ads**: `https://github.com/googleads/swift-package-manager-google-mobile-ads` (version 11.0.0+)
- **Charts**: `https://github.com/danielgindi/Charts` (version 5.0.0+)

### 3. Import Source Files

1. Delete the default `ContentView.swift` created by Xcode
2. Drag and drop the following folders into your Xcode project:
   - `App/`
   - `Core/`
   - `Features/`
   - `UI/`
   - `Ads/`
   - `Resources/`

### 4. Configure Info.plist

Copy the keys from `Info.plist` into your project's Info.plist:

- `GADApplicationIdentifier`: Your AdMob App ID
- `SKAdNetworkItems`: SKAdNetwork identifiers for ad attribution
- `NSUserTrackingUsageDescription`: ATT tracking description

### 5. Update App Entry Point

In your `DMVCaliforniaApp.swift`, ensure you have:

```swift
@main
struct DMVCaliforniaApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var coordinator = AppCoordinator()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(coordinator)
        }
    }
}
```

## Project Structure

```
DMVCalifornia/
├── App/
│   ├── DMVCaliforniaApp.swift     # App entry point
│   ├── AppDelegate.swift          # AdMob initialization
│   └── Configuration/
│       └── Constants.swift        # API URLs, Ad IDs, Keys
├── Core/
│   ├── Models/                    # Data models
│   ├── Services/                  # StorageService, QuizDataService
│   ├── Network/                   # APIClient for leaderboard
│   └── Extensions/
├── Features/
│   ├── Home/                      # Home screen
│   ├── Quizzes/                   # Quiz list, detail, results
│   ├── Flashcards/                # Flashcard list, deck
│   ├── Progress/                  # Stats, streaks
│   ├── Bookmarks/                 # Saved questions
│   └── Settings/                  # About screen
├── UI/
│   ├── Components/                # Reusable views
│   ├── Styles/                    # Colors, Theme
│   └── Navigation/                # AppCoordinator
├── Ads/
│   ├── BannerAdView.swift
│   ├── InterstitialAdManager.swift
│   └── NativeAdView.swift
└── Resources/
    ├── Assets.xcassets
    └── Data/                      # Bundled JSON files
```

## Ad Configuration

The app uses Google Mobile Ads SDK with the following ad placements:

| Ad Type | Location | Behavior |
|---------|----------|----------|
| Banner | Quiz list, Flashcard list, Progress | Adaptive banner at bottom |
| Interstitial | During quiz | Every 10 questions |
| Native | Quiz detail | Refreshes on each question |

### Ad Unit IDs (Production)

Update these in `Constants.swift`:

- Banner: `ca-app-pub-5871431582903988/3833956341`
- Interstitial: `ca-app-pub-5871431582903988/9810716499`
- Native: `ca-app-pub-5871431582903988/8886639643`

## Features

- ✅ Practice Tests (English, Spanish, Turkish)
- ✅ Flashcards with flip animation
- ✅ Progress tracking with streaks
- ✅ Bookmarked questions
- ✅ Leaderboard submission
- ✅ AdMob integration (Banner, Interstitial, Native)
- ✅ Home Screen Widgets (Small, Medium, Large)
- ✅ Siri Shortcuts ("Start DMV practice test", "Check my progress")
- ✅ Offline mode with automatic sync

## API Endpoints

The only network calls are for the leaderboard:

- `POST /api/leaderboard` - Submit score
- `GET /api/leaderboard?quizId=...` - Fetch leaderboard

Base URL: `https://dmvcalifornia.us`

## Enhanced Features Setup

### Widgets

1. In Xcode, go to File > New > Target
2. Select "Widget Extension"
3. Name it `DMVCaliforniaWidget`
4. Add the files from `DMVCaliforniaWidget/` folder
5. Enable App Groups capability for both main app and widget:
   - Select target > Signing & Capabilities > + Capability > App Groups
   - Add `group.us.dmvcalifornia.app`

### Siri Shortcuts

1. In Xcode, go to File > New > Target
2. Select "Intents Extension" (or just add App Intents to main app)
3. Add the files from `DMVCaliforniaIntents/` folder
4. The shortcuts will automatically appear in Shortcuts app:
   - "Start DMV practice test"
   - "Check my DMV progress"
   - "Get last DMV score"

### Offline Mode

The app automatically:
- Detects network connectivity
- Queues leaderboard submissions when offline
- Syncs automatically when back online
- Shows pending submissions count

## Building

1. Select your target device/simulator
2. Build and run (⌘R)

## Testing

Run unit tests with ⌘U. Tests are located in `DMVCaliforniaTests/`.
