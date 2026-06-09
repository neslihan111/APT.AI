import 'package:flutter/material.dart';

class AppColors {
  // Light Mode Colors
  static const Color primary = Color(0xFF2563EB);
  static const Color primaryContainer = Color(0xFF2563EB);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onPrimaryContainer = Color(0xFFEEEFFF);
  static const Color primaryFixedDim = Color(0xFFB4C5FF);
  static const Color primaryFixed = Color(0xFFDBE1FF);
  static const Color onPrimaryFixed = Color(0xFF00174B);
  static const Color onPrimaryFixedVariant = Color(0xFF003EA8);

  static const Color secondary = Color(0xFF64748B);
  static const Color secondaryContainer = Color(0xFFE0F2FE);
  static const Color onSecondary = Color(0xFFFFFFFF);
  static const Color onSecondaryContainer = Color(0xFF0369A1);
  static const Color secondaryFixedDim = Color(0xFFB7C8E1);
  static const Color secondaryFixed = Color(0xFFD3E4FE);
  static const Color onSecondaryFixed = Color(0xFF0B1C30);
  static const Color onSecondaryFixedVariant = Color(0xFF38485D);

  static const Color tertiary = Color(0xFF10B981);
  static const Color tertiaryContainer = Color(0xFFDCFCE3);
  static const Color onTertiary = Color(0xFFFFFFFF);
  static const Color onTertiaryContainer = Color(0xFF15803D);
  static const Color tertiaryFixedDim = Color(0xFF4EDEA3);
  static const Color tertiaryFixed = Color(0xFF6FFBBE);
  static const Color onTertiaryFixed = Color(0xFF002113);
  static const Color onTertiaryFixedVariant = Color(0xFF005236);

  static const Color error = Color(0xFFEF4444);
  static const Color errorContainer = Color(0xFFFEE2E2);
  static const Color onError = Color(0xFFFFFFFF);
  static const Color onErrorContainer = Color(0xFFB91C1C);

  static const Color background = Color(0xFFF8FAFC);
  static const Color onBackground = Color(0xFF0F172A);

  static const Color surface = Color(0xFFF8FAFC);
  static const Color onSurface = Color(0xFF0F172A);
  static const Color surfaceDim = Color(0xFFD8DADC);
  static const Color surfaceBright = Color(0xFFF8FAFC);
  static const Color surfaceContainerLowest = Color(0xFFFFFFFF);
  static const Color surfaceContainerLow = Color(0xFFF1F5F9);
  static const Color surfaceContainer = Color(0xFFE2E8F0);
  static const Color surfaceContainerHigh = Color(0xFFCBD5E1);
  static const Color surfaceContainerHighest = Color(0xFF94A3B8);
  static const Color surfaceVariant = Color(0xFFE2E8F0);
  static const Color onSurfaceVariant = Color(0xFF64748B);

  static const Color outline = Color(0xFF94A3B8);
  static const Color outlineVariant = Color(0xFFE2E8F0);
  static const Color surfaceTint = Color(0xFF2563EB);
  static const Color inverseSurface = Color(0xFF2D3133);
  static const Color inverseOnSurface = Color(0xFFEFF1F3);
  static const Color inversePrimary = Color(0xFFB4C5FF);

  static const Color infoBlue = Color(0xFF3B82F6);

  // Dark Mode overrides
  static const Color darkBackground = Color(0xFF191C1E);
  static const Color darkOnBackground = Color(0xFFECEEF0);
  static const Color darkSurface = Color(0xFF191C1E);
  static const Color darkOnSurface = Color(0xFFECEEF0);
  static const Color darkSurfaceContainerLow = Color(0xFF2D3133);
  static const Color darkSurfaceContainerLowest = Color(0xFF111416);
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme(
        brightness: Brightness.light,
        primary: AppColors.primary,
        onPrimary: AppColors.onPrimary,
        primaryContainer: AppColors.primaryContainer,
        onPrimaryContainer: AppColors.onPrimaryContainer,
        secondary: AppColors.secondary,
        onSecondary: AppColors.onSecondary,
        secondaryContainer: AppColors.secondaryContainer,
        onSecondaryContainer: AppColors.onSecondaryContainer,
        tertiary: AppColors.tertiary,
        onTertiary: AppColors.onTertiary,
        tertiaryContainer: AppColors.tertiaryContainer,
        onTertiaryContainer: AppColors.onTertiaryContainer,
        error: AppColors.error,
        onError: AppColors.onError,
        errorContainer: AppColors.errorContainer,
        onErrorContainer: AppColors.onErrorContainer,
        surface: AppColors.surface,
        onSurface: AppColors.onSurface,
        surfaceVariant: AppColors.surfaceVariant,
        onSurfaceVariant: AppColors.onSurfaceVariant,
        outline: AppColors.outline,
        outlineVariant: AppColors.outlineVariant,
        inverseSurface: AppColors.inverseSurface,
        onInverseSurface: AppColors.inverseOnSurface,
        inversePrimary: AppColors.inversePrimary,
      ),
      scaffoldBackgroundColor: AppColors.background,
      fontFamily: 'Inter',
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          height: 1.33,
          letterSpacing: -0.02,
          color: AppColors.onSurface,
        ),
        headlineMedium: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          height: 1.4,
          letterSpacing: -0.01,
          color: AppColors.onSurface,
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.normal,
          height: 1.5,
          color: AppColors.onSurface,
        ),
        labelMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          height: 1.43,
          color: AppColors.onSurfaceVariant,
        ),
        labelSmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          height: 1.33,
          letterSpacing: 0.02,
          color: AppColors.outline,
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.surfaceContainerLowest,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: AppColors.outlineVariant, width: 1),
        ),
        elevation: 0,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme(
        brightness: Brightness.dark,
        primary: AppColors.primaryFixedDim,
        onPrimary: AppColors.onPrimaryFixed,
        primaryContainer: AppColors.onPrimaryFixedVariant,
        onPrimaryContainer: AppColors.primaryFixed,
        secondary: AppColors.secondaryFixedDim,
        onSecondary: AppColors.onSecondaryFixed,
        secondaryContainer: AppColors.onSecondaryFixedVariant,
        onSecondaryContainer: AppColors.secondaryFixed,
        tertiary: AppColors.tertiaryFixedDim,
        onTertiary: AppColors.onTertiaryFixed,
        tertiaryContainer: AppColors.onTertiaryFixedVariant,
        onTertiaryContainer: AppColors.tertiaryFixed,
        error: AppColors.error,
        onError: AppColors.onError,
        errorContainer: AppColors.errorContainer,
        onErrorContainer: AppColors.onErrorContainer,
        surface: AppColors.darkSurface,
        onSurface: AppColors.darkOnSurface,
        surfaceVariant: AppColors.outline,
        onSurfaceVariant: AppColors.secondaryFixedDim,
        outline: AppColors.outline,
        outlineVariant: AppColors.outline,
        inverseSurface: AppColors.inverseOnSurface,
        onInverseSurface: AppColors.inverseSurface,
        inversePrimary: AppColors.primary,
      ),
      scaffoldBackgroundColor: AppColors.darkBackground,
      fontFamily: 'Inter',
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          height: 1.33,
          letterSpacing: -0.02,
          color: AppColors.darkOnSurface,
        ),
        headlineMedium: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          height: 1.4,
          letterSpacing: -0.01,
          color: AppColors.darkOnSurface,
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.normal,
          height: 1.5,
          color: AppColors.darkOnSurface,
        ),
        labelMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          height: 1.43,
          color: AppColors.secondaryFixedDim,
        ),
        labelSmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          height: 1.33,
          letterSpacing: 0.02,
          color: AppColors.outline,
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkSurfaceContainerLow,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: AppColors.outline, width: 1),
        ),
        elevation: 0,
      ),
    );
  }
}
