import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';

interface SaveConfirmationDialogProps {
  visible: boolean;
  isEditMode: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function SaveConfirmationDialog({
  visible,
  isEditMode,
  onCancel,
  onConfirm,
}: SaveConfirmationDialogProps) {
  if (!visible) return null;

  return (
    <View style={styles.dialogOverlay}>
      <View style={styles.dialogContainer}>
        <Text style={[GlobalStyles.typography.h6, styles.dialogTitle]}>
          {isEditMode ? 'Update Address' : 'Save Address'}
        </Text>
        <Text style={[GlobalStyles.typography.body2, styles.dialogMessage]}>
          {isEditMode 
            ? 'Are you sure you want to update this address?' 
            : 'Are you sure you want to save this address?'
          }
        </Text>
        <View style={styles.dialogActions}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={styles.dialogButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            style={styles.dialogButton}
            buttonColor={DesignSystem.colors.primary[500]}
          >
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialogContainer: {
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: DesignSystem.borderRadius.lg,
    padding: DesignSystem.spacing.lg,
    margin: DesignSystem.spacing.lg,
    minWidth: 280,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dialogTitle: {
    color: DesignSystem.colors.text.primary,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  dialogMessage: {
    color: DesignSystem.colors.text.secondary,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.lg,
    lineHeight: DesignSystem.typography.lineHeight.normal * DesignSystem.typography.fontSize.base,
  },
  dialogActions: {
    ...GlobalStyles.layout.row,
    gap: DesignSystem.spacing.sm,
  },
  dialogButton: {
    flex: 1,
    borderRadius: DesignSystem.borderRadius.full,
  },
});
