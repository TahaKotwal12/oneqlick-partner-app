// Enhanced Alert Component - Fallback Implementation
// Production-ready alert dialogs

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DesignSystem } from '../../constants/designSystem';

interface AlertProps {
  status?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  action?: {
    text: string;
    onPress: () => void;
  };
  variant?: 'solid' | 'subtle' | 'left-accent' | 'top-accent';
  children?: React.ReactNode;
}

export default function Alert({
  status = 'info',
  title,
  description,
  action,
  variant = 'subtle',
  children,
  ...props
}: AlertProps) {
  const getStatusProps = () => {
    switch (status) {
      case 'success':
        return {
          backgroundColor: DesignSystem.colors.secondary[50],
          borderColor: DesignSystem.colors.success,
          color: DesignSystem.colors.success,
        };
      case 'error':
        return {
          backgroundColor: DesignSystem.colors.error + '10',
          borderColor: DesignSystem.colors.error,
          color: DesignSystem.colors.error,
        };
      case 'warning':
        return {
          backgroundColor: DesignSystem.colors.warning + '10',
          borderColor: DesignSystem.colors.warning,
          color: DesignSystem.colors.warning,
        };
      case 'info':
      default:
        return {
          backgroundColor: DesignSystem.colors.info + '10',
          borderColor: DesignSystem.colors.info,
          color: DesignSystem.colors.info,
        };
    }
  };

  const statusProps = getStatusProps();

  return (
    <View
      style={[
        styles.alert,
        {
          backgroundColor: statusProps.backgroundColor,
          borderColor: statusProps.borderColor,
        },
        variant === 'left-accent' && styles.leftAccent,
        variant === 'top-accent' && styles.topAccent,
      ]}
      {...props}
    >
      <View style={styles.content}>
        <View style={[styles.icon, { backgroundColor: statusProps.color }]} />
        <View style={styles.textContainer}>
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
        {action && (
          <TouchableOpacity onPress={action.onPress} style={styles.action}>
            <Text style={[styles.actionText, { color: statusProps.color }]}>
              {action.text}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    borderRadius: DesignSystem.borderRadius.md,
    padding: DesignSystem.spacing.md,
    borderWidth: 1,
    marginVertical: DesignSystem.spacing.sm,
  },
  leftAccent: {
    borderLeftWidth: 4,
    borderLeftColor: DesignSystem.colors.primary[600],
  },
  topAccent: {
    borderTopWidth: 4,
    borderTopColor: DesignSystem.colors.primary[600],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: DesignSystem.spacing.sm,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  description: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    lineHeight: 20,
  },
  action: {
    marginLeft: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.xs,
  },
  actionText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
});

// Pre-configured alert components
export const AppAlert = {
  Success: (props: Omit<AlertProps, 'status'>) => (
    <Alert status="success" {...props} />
  ),
  
  Error: (props: Omit<AlertProps, 'status'>) => (
    <Alert status="error" {...props} />
  ),
  
  Warning: (props: Omit<AlertProps, 'status'>) => (
    <Alert status="warning" {...props} />
  ),
  
  Info: (props: Omit<AlertProps, 'status'>) => (
    <Alert status="info" {...props} />
  ),
};

