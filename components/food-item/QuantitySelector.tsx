import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, IconButton, Divider } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { AppIcon } from '../ui';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  basePrice: number;
  sizePrice: number;
  toppingPrice: number;
  beveragePrice: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  basePrice,
  sizePrice,
  beveragePrice,
  toppingPrice,
}: QuantitySelectorProps) {
  const totalPrice = (basePrice + sizePrice + toppingPrice + beveragePrice) * quantity;

  return (
    <Surface style={styles.sectionCard} elevation={1}>
      <View style={styles.quantityHeader}>
        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantityControls}>
          <IconButton
            // eslint-disable-next-line react/no-unstable-nested-components
            icon={() => (
              <AppIcon.Remove 
                size={20} 
                color={quantity <= 1 ? DesignSystem.colors.text.disabled : DesignSystem.colors.primary[500]} 
              />
            )}
            onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
          />
          <Text style={styles.quantityText}>{quantity}</Text>
          <IconButton
            // eslint-disable-next-line react/no-unstable-nested-components
            icon={() => (
              <AppIcon.Add 
                size={20} 
                color={DesignSystem.colors.primary[500]} 
              />
            )}
            onPress={() => onQuantityChange(quantity + 1)}
            style={styles.quantityButton}
          />
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Base Price</Text>
          <Text style={styles.priceValue}>₹{basePrice + sizePrice}</Text>
        </View>
        
        {toppingPrice > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Toppings</Text>
            <Text style={styles.priceValue}>+₹{toppingPrice}</Text>
          </View>
        )}
        
        {beveragePrice > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Beverages</Text>
            <Text style={styles.priceValue}>+₹{beveragePrice}</Text>
          </View>
        )}
        
        {quantity > 1 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Quantity × {quantity}</Text>
            <Text style={styles.priceValue}>×{quantity}</Text>
          </View>
        )}
        
        <Divider style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{totalPrice}</Text>
        </View>
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
  quantityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  quantityButton: {
    backgroundColor: DesignSystem.colors.primary[50],
    borderRadius: DesignSystem.borderRadius.xl,
  },
  quantityButtonDisabled: {
    backgroundColor: DesignSystem.colors.neutral[100],
  },
  quantityText: {
    ...GlobalStyles.typography.h6,
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    minWidth: 30,
    textAlign: 'center',
  },
  divider: {
    marginVertical: DesignSystem.spacing.sm,
  },
  priceBreakdown: {
    gap: DesignSystem.spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
  },
  priceValue: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...GlobalStyles.typography.h6,
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  totalValue: {
    ...GlobalStyles.typography.h5,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
});
