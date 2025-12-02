export const Colors = {
  // Primary Colors - Deep Indigo Blue
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#4338CA',
  primaryHover: '#4F40D9',
  
  // Secondary Colors - Vibrant Lime Green
  secondary: '#84CC16',
  secondaryLight: '#A3E635',
  secondaryDark: '#65A30D',
  secondaryHover: '#78BF0F',
  
  // Accent Colors - Sunset Orange
  accent: '#FB923C',
  accentLight: '#FDBA74',
  accentDark: '#F97316',
  accentHover: '#FA8829',
  
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
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  darkGray: '#374151',
  
  // Text Colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textDisabled: '#D1D5DB',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#1F2937',
  textOnAccent: '#FFFFFF',
  
  // Background Colors
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceDark: '#F5F7FA',
  
  // Border Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  borderFocus: '#4F46E5',
  divider: '#E5E7EB',
  
  // Rating Colors
  rating: '#F59E0B',
  ratingEmpty: '#D1D5DB',
  
  // Delivery Status Colors
  deliveryPending: '#F59E0B',
  deliveryConfirmed: '#3B82F6',
  deliveryPreparing: '#8B5CF6',
  deliveryOutForDelivery: '#FB923C',
  deliveryDelivered: '#10B981',
  deliveryCancelled: '#EF4444',
} as const;

export type ColorKey = keyof typeof Colors; 