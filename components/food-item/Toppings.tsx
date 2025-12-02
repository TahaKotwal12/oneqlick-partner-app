import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, Checkbox } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';

interface ToppingOption {
  id: string;
  name: string;
  price: number;
}

interface ToppingsProps {
  toppingOptions: ToppingOption[];
  selectedToppings: string[];
  onToppingToggle: (toppingId: string) => void;
}

export default function Toppings({
  toppingOptions,
  selectedToppings,
  onToppingToggle,
}: ToppingsProps) {
  return (
    <Surface style={styles.sectionCard} elevation={1}>
      <Text style={styles.sectionTitle}>Toppings</Text>
      <Text style={styles.sectionSubtitle}>Customize your order</Text>
      <View style={styles.addonList}>
        {toppingOptions.map((topping) => (
          <Pressable
            key={topping.id}
            style={[styles.addonItem, selectedToppings.includes(topping.id) && styles.addonItemActive]}
            onPress={() => onToppingToggle(topping.id)}
          >
            <View style={styles.addonInfo}>
              <Text style={[styles.addonName, selectedToppings.includes(topping.id) && styles.addonNameActive]}>
                {topping.name}
              </Text>
            </View>
            <View style={styles.addonRight}>
              <Text style={styles.addonPrice}>+₹{topping.price}</Text>
              <Checkbox
                status={selectedToppings.includes(topping.id) ? 'checked' : 'unchecked'}
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
