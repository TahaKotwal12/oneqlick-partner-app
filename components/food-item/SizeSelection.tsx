import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';

interface SizeOption {
  id: string;
  name: string;
  price: number;
}

interface SizeSelectionProps {
  sizeOptions: SizeOption[];
  selectedSize: string;
  basePrice: number;
  onSizeSelect: (sizeId: string) => void;
}

export default function SizeSelection({
  sizeOptions,
  selectedSize,
  basePrice,
  onSizeSelect,
}: SizeSelectionProps) {
  return (
    <Surface style={styles.sectionCard} elevation={1}>
      <Text style={styles.sectionTitle}>Choose Size</Text>
      <View style={styles.sizeOptions}>
        {sizeOptions.map((size) => (
          <Pressable
            key={size.id}
            style={[styles.sizeOption, selectedSize === size.id && styles.sizeOptionActive]}
            onPress={() => onSizeSelect(size.id)}
          >
            <Text style={[styles.sizeOptionText, selectedSize === size.id && styles.sizeOptionTextActive]}>
              {size.name}
            </Text>
            <Text style={styles.sizeOptionPrice}>₹{basePrice + size.price}</Text>
          </Pressable>
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    margin: DesignSystem.spacing.md,
    marginTop: 0,
    padding: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.borderRadius.lg,
    backgroundColor: DesignSystem.colors.background.primary,
  },
  sectionTitle: {
    ...GlobalStyles.typography.h6,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.sm,
  },
  sizeOption: {
    flex: 1,
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.md,
    borderWidth: 2,
    borderColor: DesignSystem.colors.border.light,
    alignItems: 'center',
  },
  sizeOptionActive: {
    borderColor: DesignSystem.colors.primary[500],
    backgroundColor: DesignSystem.colors.primary[50],
  },
  sizeOptionText: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    marginBottom: DesignSystem.spacing.xs,
  },
  sizeOptionTextActive: {
    color: DesignSystem.colors.primary[500],
  },
  sizeOptionPrice: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
});
