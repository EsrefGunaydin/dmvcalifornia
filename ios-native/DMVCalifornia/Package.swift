// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "DMVCalifornia",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "DMVCalifornia",
            targets: ["DMVCalifornia"]
        ),
    ],
    dependencies: [
        // Google Mobile Ads SDK
        .package(
            url: "https://github.com/googleads/swift-package-manager-google-mobile-ads",
            from: "11.0.0"
        ),
        // Charts library for iOS 15+ (Swift Charts requires iOS 16+)
        .package(
            url: "https://github.com/danielgindi/Charts",
            from: "5.0.0"
        ),
    ],
    targets: [
        .target(
            name: "DMVCalifornia",
            dependencies: [
                .product(name: "GoogleMobileAds", package: "swift-package-manager-google-mobile-ads"),
                .product(name: "DGCharts", package: "Charts"),
            ],
            path: ".",
            exclude: [
                "Package.swift",
            ],
            resources: [
                .process("Resources/Data"),
                .process("Resources/Assets.xcassets"),
            ]
        ),
        .testTarget(
            name: "DMVCaliforniaTests",
            dependencies: ["DMVCalifornia"],
            path: "DMVCaliforniaTests"
        ),
    ]
)
