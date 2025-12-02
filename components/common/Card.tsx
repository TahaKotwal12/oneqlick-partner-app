import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Surface, SurfaceProps } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';

interface CardProps extends SurfaceProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'small' | 'medium' | 'large' | 'none';
  margin?: 'small' | 'medium' | 'large' | 'none';
}

export default function Card({ 
  variant = 'default', 
  padding = 'medium',
  margin = 'none',
  style, 
  children,
  ...props 
}: CardProps) {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none': return styles.paddingNone;
      case 'small': return styles.paddingSmall;
      case 'large': return styles.paddingLarge;
      default: return styles.paddingMedium;
    }
  };

  const getMarginStyle = () => {
    switch (margin) {
      case 'none': return styles.marginNone;
      case 'small': return styles.marginSmall;
      case 'large': return styles.marginLarge;
      default: return styles.marginMedium;
    }
  };

  const cardStyle = [
    styles.card,
    styles[variant],
    getPaddingStyle(),
    getMarginStyle(),
    style,
  ];

  return (
    <Surface style={cardStyle} {...props}>
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: DesignSystem.borderRadius.lg,
    backgroundColor: DesignSystem.colors.background.surface,
  },
  default: {
    ...DesignSystem.shadows.sm,
  },
  elevated: {
    ...DesignSystem.shadows.lg,
  },
  outlined: {
    ...DesignSystem.shadows.none,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.medium,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: DesignSystem.spacing.sm,
  },
  paddingMedium: {
    padding: DesignSystem.spacing.md,
  },
  paddingLarge: {
    padding: DesignSystem.spacing.lg,
  },
  marginNone: {
    margin: 0,
  },
  marginSmall: {
    margin: DesignSystem.spacing.sm,
  },
  marginMedium: {
    margin: DesignSystem.spacing.md,
  },
  marginLarge: {
    margin: DesignSystem.spacing.lg,
  },
}); 