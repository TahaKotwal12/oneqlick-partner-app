// Enhanced Button Component for oneQlick User App
// Production-ready button with comprehensive variants and states

import React from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import Icon, { AppIcon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonState = 'default' | 'loading' | 'disabled';

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  onPress?: () => void;
  icon?: string;
  iconFamily?: 'MaterialIcons' | 'MaterialCommunityIcons' | 'Ionicons' | 'AntDesign' | 'Feather';
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingText?: string;
  disabled?: boolean;
  testID?: string;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  state = 'default',
  onPress,
  icon,
  iconFamily = 'MaterialIcons',
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  loadingText = 'Loading...',
  disabled = false,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || state === 'disabled' || state === 'loading';
  const isLoading = state === 'loading';
  
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];
  
  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
    textStyle,
  ];
  
  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <ActivityIndicator 
            size="small" 
            color={getLoadingColor(variant)} 
            style={styles.loadingIndicator}
          />
          <Text style={textStyleCombined}>
            {loadingText}
          </Text>
        </>
      );
    }
    
    if (icon) {
      return (
        <>
          {iconPosition === 'left' && (
            <Icon 
              name={icon} 
              family={iconFamily}
              size={getIconSize(size)}
              color={getIconColor(variant, isDisabled)}
              style={styles.iconLeft}
            />
          )}
          <Text style={textStyleCombined}>
            {title}
          </Text>
          {iconPosition === 'right' && (
            <Icon 
              name={icon} 
              family={iconFamily}
              size={getIconSize(size)}
              color={getIconColor(variant, isDisabled)}
              style={styles.iconRight}
            />
          )}
        </>
      );
    }
    
    return <Text style={textStyleCombined}>{title}</Text>;
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        pressed && !isDisabled && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      testID={testID}
    >
      {renderContent()}
    </Pressable>
  );
}

// Helper functions
const getIconSize = (size: ButtonSize): number => {
  const sizeMap = {
    sm: DesignSystem.sizes.icon.sm,
    md: DesignSystem.sizes.icon.md,
    lg: DesignSystem.sizes.icon.lg,
  };
  return sizeMap[size];
};

const getIconColor = (variant: ButtonVariant, isDisabled: boolean): string => {
  if (isDisabled) return DesignSystem.colors.text.disabled;
  
  const colorMap = {
    primary: DesignSystem.colors.text.inverse,
    secondary: DesignSystem.colors.text.primary,
    outline: DesignSystem.colors.primary[500],
    ghost: DesignSystem.colors.primary[500],
    danger: DesignSystem.colors.text.inverse,
  };
  
  return colorMap[variant];
};

const getLoadingColor = (variant: ButtonVariant): string => {
  const colorMap = {
    primary: DesignSystem.colors.text.inverse,
    secondary: DesignSystem.colors.text.primary,
    outline: DesignSystem.colors.primary[500],
    ghost: DesignSystem.colors.primary[500],
    danger: DesignSystem.colors.text.inverse,
  };
  
  return colorMap[variant];
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DesignSystem.borderRadius.md,
    ...DesignSystem.shadows.sm,
  },
  
  // Variants
  primary: {
    backgroundColor: DesignSystem.colors.primary[600],
  },
  secondary: {
    backgroundColor: DesignSystem.colors.secondary[500],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: DesignSystem.colors.primary[600],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: DesignSystem.colors.error,
  },
  
  // Sizes
  sm: {
    paddingVertical: DesignSystem.spacing.xs,
    paddingHorizontal: DesignSystem.spacing.sm,
    minHeight: DesignSystem.sizes.button.sm,
  },
  md: {
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.md,
    minHeight: DesignSystem.sizes.button.md,
  },
  lg: {
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.lg,
    minHeight: DesignSystem.sizes.button.lg,
  },
  
  // States
  disabled: {
    opacity: 0.6,
    ...DesignSystem.shadows.none,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  
  // Layout
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: DesignSystem.colors.text.onPrimary,
  },
  secondaryText: {
    color: DesignSystem.colors.text.onSecondary,
  },
  outlineText: {
    color: DesignSystem.colors.primary[600],
  },
  ghostText: {
    color: DesignSystem.colors.primary[600],
  },
  dangerText: {
    color: DesignSystem.colors.text.inverse,
  },
  
  // Text sizes
  smText: {
    fontSize: DesignSystem.typography.fontSize.sm,
  },
  mdText: {
    fontSize: DesignSystem.typography.fontSize.base,
  },
  lgText: {
    fontSize: DesignSystem.typography.fontSize.lg,
  },
  
  // Disabled text
  disabledText: {
    color: DesignSystem.colors.text.disabled,
  },
  
  // Loading
  loadingIndicator: {
    marginRight: DesignSystem.spacing.xs,
  },
  
  // Icons
  iconLeft: {
    marginRight: DesignSystem.spacing.xs,
  },
  iconRight: {
    marginLeft: DesignSystem.spacing.xs,
  },
});

// Pre-configured button components for common use cases
export const AppButton = {
  Primary: (props: Omit<ButtonProps, 'variant'>) => (
    <Button variant="primary" {...props} />
  ),
  
  Secondary: (props: Omit<ButtonProps, 'variant'>) => (
    <Button variant="secondary" {...props} />
  ),
  
  Outline: (props: Omit<ButtonProps, 'variant'>) => (
    <Button variant="outline" {...props} />
  ),
  
  Ghost: (props: Omit<ButtonProps, 'variant'>) => (
    <Button variant="ghost" {...props} />
  ),
  
  Danger: (props: Omit<ButtonProps, 'variant'>) => (
    <Button variant="danger" {...props} />
  ),
  
  // Action buttons
  AddToCart: (props: Omit<ButtonProps, 'title' | 'icon' | 'iconPosition'>) => (
    <Button 
      title="Add to Cart" 
      icon="shopping-cart" 
      iconPosition="left"
      {...props} 
    />
  ),
  
  OrderNow: (props: Omit<ButtonProps, 'title' | 'icon' | 'iconPosition'>) => (
    <Button 
      title="Order Now" 
      icon="local-shipping" 
      iconPosition="right"
      {...props} 
    />
  ),
  
  Continue: (props: Omit<ButtonProps, 'title' | 'icon' | 'iconPosition'>) => (
    <Button 
      title="Continue" 
      icon="arrow-forward" 
      iconPosition="right"
      {...props} 
    />
  ),
  
  Back: (props: Omit<ButtonProps, 'title' | 'icon' | 'iconPosition'>) => (
    <Button 
      title="Back" 
      icon="arrow-back" 
      iconPosition="left"
      variant="ghost"
      {...props} 
    />
  ),
  
  Save: (props: Omit<ButtonProps, 'title' | 'icon' | 'iconPosition'>) => (
    <Button 
      title="Save" 
      icon="save" 
      iconPosition="left"
      {...props} 
    />
  ),
  
  Cancel: (props: Omit<ButtonProps, 'title' | 'variant'>) => (
    <Button 
      title="Cancel" 
      variant="outline"
      {...props} 
    />
  ),
  
  Delete: (props: Omit<ButtonProps, 'title' | 'icon' | 'iconPosition' | 'variant'>) => (
    <Button 
      title="Delete" 
      icon="delete" 
      iconPosition="left"
      variant="danger"
      {...props} 
    />
  ),
};
