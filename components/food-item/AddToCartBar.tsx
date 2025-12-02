import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';

interface AddToCartBarProps {
  totalPrice: number;
  onAddToCart: () => void;
}

export default function AddToCartBar({ totalPrice, onAddToCart }: AddToCartBarProps) {
  return (
    <Surface style={styles.addToCartBar} elevation={4}>
      <View style={styles.cartInfo}>
        <Text style={styles.cartTotalLabel}>Total</Text>
        <Text style={styles.cartTotalPrice}>₹{totalPrice}</Text>
      </View>
      
      <Button
        mode="contained"
        onPress={onAddToCart}
        style={styles.addToCartButton}
        contentStyle={styles.addToCartButtonContent}
      >
        Add to Cart
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  addToCartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing.xl,
    backgroundColor: DesignSystem.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.border.light,
  },
  cartInfo: {
    flex: 1,
  },
  cartTotalLabel: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    marginBottom: 2,
  },
  cartTotalPrice: {
    ...GlobalStyles.typography.h5,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  addToCartButton: {
    backgroundColor: DesignSystem.colors.primary[500],
    borderRadius: DesignSystem.borderRadius.md,
  },
  addToCartButtonContent: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
  },
});
