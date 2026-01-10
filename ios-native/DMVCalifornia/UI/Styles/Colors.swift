import SwiftUI

// MARK: - DMV California Color Palette

extension Color {
    // Primary Colors
    static let dmvOrange = Color(hex: "EE3918")
    static let dmvBlue = Color(hex: "4A90C2")  // Official CA DMV blue
    static let dmvTeal = Color(hex: "13CFB6")

    // Background Colors
    static let dmvBackground = Color(hex: "F5F5F5")
    static let dmvCard = Color.white
    static let dmvSurface = Color(hex: "FAFAFA")

    // Text Colors
    static let dmvText = Color(hex: "1A1A1A")
    static let dmvTextSecondary = Color(hex: "666666")
    static let dmvTextTertiary = Color(hex: "999999")

    // Border Colors
    static let dmvBorder = Color(hex: "E5E5E5")
    static let dmvDivider = Color(hex: "EEEEEE")

    // Status Colors
    static let dmvSuccess = Color(hex: "22C55E")
    static let dmvError = Color(hex: "EF4444")
    static let dmvWarning = Color(hex: "F59E0B")
    static let dmvInfo = Color(hex: "3B82F6")

    // Difficulty Colors
    static let dmvEasy = Color(hex: "22C55E")
    static let dmvMedium = Color(hex: "F59E0B")
    static let dmvHard = Color(hex: "EF4444")
}

// MARK: - Gradient Definitions

extension LinearGradient {
    static let dmvPrimaryGradient = LinearGradient(
        colors: [Color.dmvOrange, Color.dmvOrange.opacity(0.8)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let dmvTealGradient = LinearGradient(
        colors: [Color.dmvTeal, Color.dmvTeal.opacity(0.8)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let dmvSuccessGradient = LinearGradient(
        colors: [Color.dmvSuccess, Color.dmvSuccess.opacity(0.8)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let dmvBlueGradient = LinearGradient(
        colors: [Color.dmvBlue, Color.dmvBlue.opacity(0.8)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}
