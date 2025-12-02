import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';

interface AddAddressButtonProps {
  onPress: () => void;
}

export default function AddAddressButton({ onPress }: AddAddressButtonProps) {
  return (
    <View style={styles.addButtonContainer}>
      <Button
        mode="contained"
        onPress={onPress}
        icon="plus"
        style={styles.addButton}
        buttonColor={DesignSystem.colors.primary[500]}
        labelStyle={styles.addButtonLabel}
      >
        Add New Address
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.primary,
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  addButton: {
    borderRadius: DesignSystem.borderRadius.full,
    alignSelf: 'center',
    paddingHorizontal: DesignSystem.spacing.lg,
  },
  addButtonLabel: {
    ...GlobalStyles.typography.button,
    color: 'white',
  },
});
