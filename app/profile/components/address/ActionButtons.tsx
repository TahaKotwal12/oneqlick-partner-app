import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';

interface ActionButtonsProps {
  isEditMode: boolean;
  isFormValid: boolean;
  onSaveAddress: () => void;
}

export default function ActionButtons({
  isEditMode,
  isFormValid,
  onSaveAddress,
}: ActionButtonsProps) {
  const router = useRouter();

  return (
    <View style={styles.actionButtons}>
      <Button
        mode="outlined"
        onPress={() => router.back()}
        icon="close"
        style={styles.actionButton}
        labelStyle={styles.actionButtonLabel}
      >
        Cancel
      </Button>
      
      <Button
        mode="contained"
        onPress={onSaveAddress}
        icon="check"
        style={styles.actionButton}
        labelStyle={styles.actionButtonLabel}
        disabled={!isFormValid}
        buttonColor={DesignSystem.colors.primary[500]}
      >
        {isEditMode ? 'Update Address' : 'Save Address'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    ...GlobalStyles.layout.row,
    gap: DesignSystem.spacing.sm,
    marginBottom: DesignSystem.spacing.sm, // Add small bottom margin
  },
  actionButton: {
    flex: 1,
    borderRadius: DesignSystem.borderRadius.full,
  },
  actionButtonLabel: {
    ...GlobalStyles.typography.button,
  },
});
