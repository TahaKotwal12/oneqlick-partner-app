import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, Checkbox } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';

interface BeverageOption {
  id: string;
  name: string;
  price: number;
}

interface BeveragesProps {
  beverageOptions: BeverageOption[];
  selectedBeverages: string[];
  onBeverageToggle: (beverageId: string) => void;
}

export default function Beverages({
  beverageOptions,
  selectedBeverages,
  onBeverageToggle,
}: BeveragesProps) {
  return (
    <Surface style={styles.sectionCard} elevation={1}>
      <Text style={styles.sectionTitle}>Beverages</Text>
      <Text style={styles.sectionSubtitle}>Add drinks to your meal</Text>
      <View style={styles.addonList}>
        {beverageOptions.map((beverage) => (
          <Pressable
            key={beverage.id}
            style={[styles.addonItem, selectedBeverages.includes(beverage.id) && styles.addonItemActive]}
            onPress={() => onBeverageToggle(beverage.id)}
          >
            <View style={styles.addonInfo}>
              <Text style={[styles.addonName, selectedBeverages.includes(beverage.id) && styles.addonNameActive]}>
                {beverage.name}
              </Text>
            </View>
            <View style={styles.addonRight}>
              <Text style={styles.addonPrice}>+₹{beverage.price}</Text>
              <Checkbox
                status={selectedBeverages.includes(beverage.id) ? 'checked' : 'unchecked'}
                color={DesignSystem.colors.primary[500]}
              />
            </View>
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
  sectionSubtitle: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.md,
  },
  addonList: {
    gap: DesignSystem.spacing.sm,
  },
  addonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
  },
  addonItemActive: {
    borderColor: DesignSystem.colors.primary[500],
    backgroundColor: DesignSystem.colors.primary[50],
  },
  addonInfo: {
    flex: 1,
  },
  addonName: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.primary,
  },
  addonNameActive: {
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  addonRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  addonPrice: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
});
