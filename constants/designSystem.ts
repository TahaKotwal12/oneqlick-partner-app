// Design System for oneQlick User App
// Centralized design tokens for consistent UI across the application

export const DesignSystem = {
  // Color Palette
  colors: {
    // Primary Colors - Deep Indigo Blue
    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1', // Main primary
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
    },
    
    // Secondary Colors - Vibrant Lime Green
    secondary: {
      50: '#F7FEE7',
      100: '#ECFCCB',
      200: '#D9F99D',
      300: '#BEF264',
      400: '#A3E635',
      500: '#84CC16', // Main secondary
      600: '#65A30D',
      700: '#4D7C0F',
      800: '#365314',
      900: '#1A2E05',
    },
    
    // Accent Colors - Sunset Orange
    accent: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316', // Main accent
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    
    // Status Colors
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',
    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#DC2626',
    info: '#3B82F6',
    infoLight: '#60A5FA',
    infoDark: '#2563EB',
    
    // Neutral Colors
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    
    // Text Colors
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      disabled: '#D1D5DB',
      inverse: '#FFFFFF',
      onPrimary: '#FFFFFF',
      onSecondary: '#1F2937',
      onAccent: '#FFFFFF',
    },
    
    // Background Colors
    background: {
      primary: '#F8FAFC',
      secondary: '#F1F5F9',
      tertiary: '#FFFFFF',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      surfaceDark: '#F5F7FA',
      overlay: 'rgba(0, 0, 0, 0.5)',
      overlayLight: 'rgba(0, 0, 0, 0.3)',
      overlayDark: 'rgba(0, 0, 0, 0.7)',
    },
    
    // Border Colors
    border: {
      light: '#F3F4F6',
      medium: '#E5E7EB',
      dark: '#D1D5DB',
      focus: '#4F46E5',
    },
  },
  
  // Spacing System (8px base unit)
  spacing: {
    xs: 4,    // 0.25rem
    sm: 8,    // 0.5rem
    md: 16,   // 1rem
    lg: 24,   // 1.5rem
    xl: 32,   // 2rem
    '2xl': 40, // 2.5rem
    '3xl': 48, // 3rem
    '4xl': 64, // 4rem
  },
  
  // Typography Scale
  typography: {
    // Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    
    // Font Weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  
  // Shadows/Elevation
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  
  // Component Sizes
  sizes: {
    // Button Heights
    button: {
      sm: 32,
      md: 44,
      lg: 52,
    },
    
    // Input Heights
    input: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    
    // Icon Sizes
    icon: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    },
    
    // Avatar Sizes
    avatar: {
      sm: 32,
      md: 40,
      lg: 56,
      xl: 80,
    },
  },
  
  // Animation Durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// Type definitions for better TypeScript support
export type ColorKey = keyof typeof DesignSystem.colors;
export type SpacingKey = keyof typeof DesignSystem.spacing;
export type TypographyKey = keyof typeof DesignSystem.typography;
export type BorderRadiusKey = keyof typeof DesignSystem.borderRadius;
export type ShadowKey = keyof typeof DesignSystem.shadows;
