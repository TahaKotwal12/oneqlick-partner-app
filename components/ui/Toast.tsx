// Enhanced Toast Component - Fallback Implementation
// Production-ready toast notifications

import React from 'react';
import { Alert } from 'react-native';
import { DesignSystem } from '../../constants/designSystem';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  placement?: 'top' | 'bottom';
}

export function useAppToast() {
  const showToast = ({
    title,
    description,
    variant = 'info',
    duration = 4000,
    placement = 'top',
    ...props
  }: ToastProps) => {
    // For now, use Alert as fallback
    const message = title + (description ? `\n${description}` : '');
    
    switch (variant) {
      case 'success':
        Alert.alert('Success', message);
        break;
      case 'error':
        Alert.alert('Error', message);
        break;
      case 'warning':
        Alert.alert('Warning', message);
        break;
      case 'info':
      default:
        Alert.alert('Info', message);
        break;
    }
  };

  return {
    showToast,
    showSuccess: (title: string, description?: string) =>
      showToast({ title, description, variant: 'success' }),
    showError: (title: string, description?: string) =>
      showToast({ title, description, variant: 'error' }),
    showWarning: (title: string, description?: string) =>
      showToast({ title, description, variant: 'warning' }),
    showInfo: (title: string, description?: string) =>
      showToast({ title, description, variant: 'info' }),
  };
}

// Pre-configured toast functions
export const AppToast = {
  success: (title: string, description?: string) => {
    // This would be used in components that have access to useAppToast
    console.log('Success Toast:', title, description);
  },
  error: (title: string, description?: string) => {
    console.log('Error Toast:', title, description);
  },
  warning: (title: string, description?: string) => {
    console.log('Warning Toast:', title, description);
  },
  info: (title: string, description?: string) => {
    console.log('Info Toast:', title, description);
  },
};

