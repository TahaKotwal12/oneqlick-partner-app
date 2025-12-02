// Enhanced Modal Component - Fallback Implementation
// Production-ready modal with consistent styling

import React from 'react';
import { Modal as RNModal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DesignSystem } from '../../constants/designSystem';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'centered' | 'bottomSheet';
  children?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  variant = 'default',
  children,
  ...props
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.modal,
          variant === 'centered' && styles.centered,
          variant === 'bottomSheet' && styles.bottomSheet,
        ]}>
          <View style={styles.content}>
            {(title || description) && (
              <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {title && (
              <Text style={styles.title}>{title}</Text>
            )}
            
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
            
            <View style={styles.body}>
              {children}
            </View>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: DesignSystem.colors.background.surface,
    borderRadius: DesignSystem.borderRadius.lg,
    margin: DesignSystem.spacing.md,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopLeftRadius: DesignSystem.borderRadius.xl,
    borderTopRightRadius: DesignSystem.borderRadius.xl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  content: {
    padding: DesignSystem.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: DesignSystem.spacing.sm,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DesignSystem.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: DesignSystem.colors.text.primary,
    fontWeight: 'bold',
  },
  title: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
  },
  description: {
    fontSize: DesignSystem.typography.fontSize.base,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.md,
  },
  body: {
    // Body styles
  },
});

// Pre-configured modal components
export const AppModal = {
  // Confirmation Modal
  Confirmation: (props: Omit<ModalProps, 'title' | 'description'>) => (
    <Modal
      title="Confirm Action"
      description="Are you sure you want to proceed?"
      {...props}
    />
  ),
  
  // Success Modal
  Success: (props: Omit<ModalProps, 'title' | 'description'>) => (
    <Modal
      title="Success"
      description="Your action was completed successfully."
      {...props}
    />
  ),
  
  // Error Modal
  Error: (props: Omit<ModalProps, 'title' | 'description'>) => (
    <Modal
      title="Error"
      description="Something went wrong. Please try again."
      {...props}
    />
  ),
  
  // Bottom Sheet
  BottomSheet: (props: Omit<ModalProps, 'variant'>) => (
    <Modal variant="bottomSheet" {...props} />
  ),
  
  // Centered Modal
  Centered: (props: Omit<ModalProps, 'variant'>) => (
    <Modal variant="centered" {...props} />
  ),
};

