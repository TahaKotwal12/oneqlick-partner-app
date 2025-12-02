import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export default function Button({ 
  variant = 'primary', 
  size = 'medium', 
  style, 
  contentStyle,
  ...props 
}: CustomButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    style,
  ];

  const buttonContentStyle = [
    styles.content,
    styles[`${size}Content`],
    contentStyle,
  ];

  return (
    <PaperButton
      style={buttonStyle}
      contentStyle={buttonContentStyle}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: DesignSystem.borderRadius.md,
  },
  primary: {
    backgroundColor: DesignSystem.colors.primary[500],
  },
  secondary: {
    backgroundColor: DesignSystem.colors.secondary[500],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: DesignSystem.colors.primary[500],
  },
  small: {
    minHeight: DesignSystem.sizes.button.sm,
  },
  medium: {
    minHeight: DesignSystem.sizes.button.md,
  },
  large: {
    minHeight: DesignSystem.sizes.button.lg,
  },
  content: {
    paddingHorizontal: DesignSystem.spacing.md,
  },
  smallContent: {
    paddingVertical: DesignSystem.spacing.xs,
  },
  mediumContent: {
    paddingVertical: DesignSystem.spacing.sm,
  },
  largeContent: {
    paddingVertical: DesignSystem.spacing.md,
  },
}); 