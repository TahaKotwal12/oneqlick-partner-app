import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';

interface EmptyAddressesStateProps {
  onAddFirstAddress: () => void;
  isSelectionMode?: boolean;
}

export default function EmptyAddressesState({ onAddFirstAddress, isSelectionMode = false }: EmptyAddressesStateProps) {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="location-off"
        size={DesignSystem.sizes.icon.xl}
        color={DesignSystem.colors.neutral[300]}
      />
      <Text style={[GlobalStyles.typography.h5, styles.emptyTitle]}>
        {isSelectionMode ? 'No Addresses Available' : 'No Addresses Found'}
      </Text>
      <Text style={[GlobalStyles.typography.body2, styles.emptySubtitle]}>
        {isSelectionMode 
          ? 'Add a delivery address to continue with your order'
          : 'Add your first delivery address to get started'
        }
      </Text>
      <Button
        mode="contained"
        onPress={onAddFirstAddress}
        icon="plus"
        style={styles.addFirstButton}
        buttonColor={DesignSystem.colors.primary[500]}
      >
        {isSelectionMode ? 'Add Delivery Address' : 'Add Your First Address'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    ...GlobalStyles.layout.columnCenter,
    paddingVertical: DesignSystem.spacing['2xl'],
    paddingHorizontal: DesignSystem.spacing.xl,
  },
  emptyTitle: {
    color: DesignSystem.colors.text.primary,
    marginTop: DesignSystem.spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: DesignSystem.colors.text.secondary,
    marginTop: DesignSystem.spacing.sm,
    textAlign: 'center',
    lineHeight: DesignSystem.typography.lineHeight.normal * DesignSystem.typography.fontSize.base,
  },
  addFirstButton: {
    marginTop: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.borderRadius.full,
    paddingHorizontal: DesignSystem.spacing.lg,
  },
});
