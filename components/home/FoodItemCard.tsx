import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Surface, Button, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { FoodItem } from '../../types';
import { DesignSystem } from '../../constants/designSystem';

interface FoodItemCardProps {
  dish: FoodItem;
  onAddToCart: (dish: FoodItem) => void;
  onPress?: (dish: FoodItem) => void;
  showQuantitySelector?: boolean;
}

export default function FoodItemCard({ 
  dish, 
  onAddToCart, 
  onPress,
  showQuantitySelector = true 
}: FoodItemCardProps) {
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = useCallback(async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    await onAddToCart(dish);
  }, [quantity, onAddToCart, dish]);

  const handleIncreaseQuantity = useCallback(async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    await onAddToCart(dish);
  }, [quantity, onAddToCart, dish]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  }, [quantity]);

  const handleCardPress = useCallback(() => {
    if (onPress) {
      onPress(dish);
    }
  }, [onPress, dish]);

  return (
    <Pressable onPress={handleCardPress} style={styles.cardContainer}>
      <Surface style={styles.dishCard}>
        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: dish.image }} 
            style={styles.dishImage}
            resizeMode="cover"
          />
          {dish.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>🔥 Popular</Text>
            </View>
          )}
        </View>
        
        {/* Food Details */}
        <View style={styles.dishContent}>
          {/* Header with Name and Veg Indicator */}
          <View style={styles.dishHeader}>
            <View style={styles.nameAndVegContainer}>
              <Text style={styles.dishName} numberOfLines={1}>
                {dish.name}
              </Text>
              {/* Veg/Non-veg indicator next to name */}
              <View style={[styles.vegIndicator, { backgroundColor: dish.isVeg ? '#10B981' : '#EF4444' }]}>
                <MaterialIcons 
                  name={dish.isVeg ? "circle" : "cancel"} 
                  size={10} 
                  color="white" 
                />
              </View>
            </View>
            <Text style={styles.dishCategory}>{dish.category}</Text>
          </View>
          
          <Text style={styles.dishDescription} numberOfLines={2}>
            {dish.description}
          </Text>
          
          <View style={styles.dishMeta}>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={14} color="#F59E0B" />
              <Text style={styles.dishRating}>4.5</Text>
              <Text style={styles.ratingCount}>(120)</Text>
            </View>
            <Text style={styles.preparationTime}>⏱️ 20-30 min</Text>
          </View>
          
          <View style={styles.dishFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.dishPrice}>₹{dish.price}</Text>
              <Text style={styles.deliveryInfo}>Free delivery</Text>
            </View>
            
            {showQuantitySelector && (
              quantity === 0 ? (
                <Button
                  mode="contained"
                  onPress={handleAddToCart}
                  style={styles.addToCartButton}
                  contentStyle={styles.addToCartButtonContent}
                  labelStyle={styles.addToCartButtonLabel}
                >
                  Add
                </Button>
              ) : (
                <View style={styles.quantitySelector}>
                  <IconButton
                    icon="minus"
                    size={18}
                    iconColor="#4F46E5"
                    onPress={handleDecreaseQuantity}
                    style={styles.quantityButton}
                  />
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <IconButton
                    icon="plus"
                    size={18}
                    iconColor="#4F46E5"
                    onPress={handleIncreaseQuantity}
                    style={styles.quantityButton}
                  />
                </View>
              )
            )}
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: DesignSystem.spacing.sm,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: DesignSystem.borderRadius.xl,
    padding: DesignSystem.spacing.sm,
    ...DesignSystem.shadows.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
    minHeight: 120,
  },
  imageContainer: {
    position: 'relative',
    marginRight: DesignSystem.spacing.sm,
  },
  dishImage: {
    width: 70,
    height: 70,
    borderRadius: DesignSystem.borderRadius.md,
    backgroundColor: DesignSystem.colors.primary[50],
  },
  popularBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: DesignSystem.colors.primary[500],
    paddingHorizontal: DesignSystem.spacing.xs,
    paddingVertical: 2,
    borderRadius: DesignSystem.borderRadius.sm,
    ...DesignSystem.shadows.sm,
  },
  popularBadgeText: {
    color: DesignSystem.colors.text.inverse,
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  dishContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishHeader: {
    marginBottom: DesignSystem.spacing.xs,
  },
  nameAndVegContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dishName: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
    flex: 1,
    marginRight: DesignSystem.spacing.sm,
  },
  vegIndicator: {
    width: 16,
    height: 16,
    borderRadius: DesignSystem.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...DesignSystem.shadows.sm,
  },
  dishCategory: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dishDescription: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    lineHeight: DesignSystem.typography.fontSize.sm * DesignSystem.typography.lineHeight.normal,
    marginBottom: DesignSystem.spacing.sm,
  },
  dishMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishRating: {
    marginLeft: 4,
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.text.secondary,
  },
  preparationTime: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.text.secondary,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  dishPrice: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.extrabold,
    color: DesignSystem.colors.primary[500],
    marginBottom: 2,
  },
  deliveryInfo: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.success,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  addToCartButton: {
    backgroundColor: DesignSystem.colors.primary[500],
    borderRadius: DesignSystem.borderRadius.md,
    ...DesignSystem.shadows.sm,
  },
  addToCartButtonContent: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.xs,
  },
  addToCartButtonLabel: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.inverse,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.primary[50],
    borderRadius: DesignSystem.borderRadius.xl,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: DesignSystem.colors.primary[200],
  },
  quantityButton: {
    margin: 0,
    width: 28,
    height: 28,
  },
  quantityText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.primary[500],
    marginHorizontal: DesignSystem.spacing.xs,
    minWidth: 16,
    textAlign: 'center',
  },
}); 