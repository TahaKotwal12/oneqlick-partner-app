import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function Badge({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  style 
}: BadgeProps) {
  const badgeStyle = [
    styles.badge,
    styles[variant],
    styles[size],
    style,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={[styles.text, styles[`${size}Text`]]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: DesignSystem.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: DesignSystem.colors.primary[600],
  },
  secondary: {
    backgroundColor: DesignSystem.colors.secondary[500],
  },
  success: {
    backgroundColor: DesignSystem.colors.success,
  },
  warning: {
    backgroundColor: DesignSystem.colors.warning,
  },
  error: {
    backgroundColor: DesignSystem.colors.error,
  },
  small: {
    paddingHorizontal: DesignSystem.spacing.xs,
    paddingVertical: 2,
    minWidth: 20,
    height: 20,
  },
  medium: {
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: 4,
    minWidth: 24,
    height: 24,
  },
  large: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: 6,
    minWidth: 32,
    height: 32,
  },
  text: {
    color: DesignSystem.colors.text.onPrimary,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  smallText: {
    fontSize: DesignSystem.typography.fontSize.xs,
  },
  mediumText: {
    fontSize: DesignSystem.typography.fontSize.sm,
  },
  largeText: {
    fontSize: DesignSystem.typography.fontSize.base,
  },
}); 