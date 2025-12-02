import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { Colors } from '../constants/colors';

// Dark mode color overrides
const darkModeColors = {
  // Primary Colors - Slightly brighter for dark mode
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  primaryHover: '#7578F6',
  
  // Secondary Colors - Adjusted for dark mode
  secondary: '#84CC16',
  secondaryLight: '#A3E635',
  secondaryDark: '#65A30D',
  secondaryHover: '#94D71F',
  
  // Accent Colors - Maintained vibrancy
  accent: '#FB923C',
  accentLight: '#FDBA74',
  accentDark: '#F97316',
  accentHover: '#FC9D4F',
  
  // Status Colors - Adjusted for dark mode
  success: '#34D399',
  successLight: '#6EE7B7',
  successDark: '#10B981',
  warning: '#FBBF24',
  warningLight: '#FCD34D',
  warningDark: '#F59E0B',
  error: '#F87171',
  errorLight: '#FCA5A5',
  errorDark: '#EF4444',
  info: '#60A5FA',
  infoLight: '#93C5FD',
  infoDark: '#3B82F6',
  
  // Text Colors - Dark Mode
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textDisabled: '#64748B',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#0F172A',
  textOnAccent: '#FFFFFF',
  
  // Background Colors - Dark Mode
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  surface: '#1E293B',
  surfaceElevated: '#334155',
  surfaceDark: '#0F172A',
  
  // Border Colors - Dark Mode
  border: '#334155',
  borderLight: '#1E293B',
  borderDark: '#475569',
  borderFocus: '#6366F1',
  divider: '#334155',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#94A3B8',
  lightGray: '#1E293B',
  darkGray: '#CBD5E1',
  
  // Rating Colors
  rating: '#F59E0B',
  ratingEmpty: '#475569',
  
  // Delivery Status Colors
  deliveryPending: '#F59E0B',
  deliveryConfirmed: '#3B82F6',
  deliveryPreparing: '#8B5CF6',
  deliveryOutForDelivery: '#FB923C',
  deliveryDelivered: '#10B981',
  deliveryCancelled: '#EF4444',
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof Colors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    // Set initial theme
    setIsDarkMode(Appearance.getColorScheme() === 'dark');

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? { ...Colors, ...darkModeColors } : Colors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

