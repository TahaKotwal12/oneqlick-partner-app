import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FoodItem } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

interface EnhancedFoodItemCardProps {
  dish: FoodItem;
  onAddToCart: (dish: FoodItem) => void;
  onPress?: (dish: FoodItem) => void;
  viewMode: 'list' | 'grid';
  index?: number;
}

export default function EnhancedFoodItemCard({ 
  dish, 
  onAddToCart, 
  onPress,
  viewMode,
  index = 0
}: EnhancedFoodItemCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      await onAddToCart(dish);
    } finally {
      setIsLoading(false);
    }
  }, [quantity, onAddToCart, dish, isLoading]);

  const handleIncreaseQuantity = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      await onAddToCart(dish);
    } finally {
      setIsLoading(false);
    }
  }, [quantity, onAddToCart, dish, isLoading]);

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

  // Render different layouts based on view mode
  if (viewMode === 'grid') {
    return (
      <Pressable onPress={handleCardPress} style={styles.gridCardContainer}>
        <Surface style={styles.gridCard}>
          {/* Image Container */}
          <View style={styles.gridImageContainer}>
            <Image 
              source={{ uri: dish.image }} 
              style={styles.gridImage}
              resizeMode="cover"
            />
            
            {/* Overlays */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.gridImageOverlay}
            />
            
            {/* Badges */}
            <View style={styles.gridBadgesContainer}>
              {dish.isPopular && (
                <View style={styles.popularBadge}>
                  <MaterialCommunityIcons name="fire" size={10} color="white" />
                  <Text style={styles.popularBadgeText}>Popular</Text>
                </View>
              )}
              
              {/* Veg/Non-veg indicator */}
              <View style={[styles.vegIndicatorGrid, { backgroundColor: dish.isVeg ? '#10B981' : '#EF4444' }]}>
                <MaterialCommunityIcons 
                  name={dish.isVeg ? "leaf" : "food-drumstick"} 
                  size={10} 
                  color="white" 
                />
              </View>
            </View>

            {/* Quick Add Button */}
            <View style={styles.quickAddContainer}>
              {quantity === 0 ? (
                <Pressable
                  style={styles.quickAddButton}
                  onPress={handleAddToCart}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons 
                    name={isLoading ? "loading" : "plus"} 
                    size={16} 
                    color="white" 
                  />
                </Pressable>
              ) : (
                <View style={styles.gridQuantitySelector}>
                  <Pressable
                    style={styles.gridQuantityButton}
                    onPress={handleDecreaseQuantity}
                  >
                    <MaterialCommunityIcons name="minus" size={12} color="#4F46E5" />
                  </Pressable>
                  <Text style={styles.gridQuantityText}>{quantity}</Text>
                  <Pressable
                    style={styles.gridQuantityButton}
                    onPress={handleIncreaseQuantity}
                    disabled={isLoading}
                  >
                    <MaterialCommunityIcons 
                      name={isLoading ? "loading" : "plus"} 
                      size={12} 
                      color="#4F46E5" 
                    />
                  </Pressable>
                </View>
              )}
            </View>
          </View>
          
          {/* Content */}
          <View style={styles.gridContent}>
            <Text style={styles.gridDishName} numberOfLines={1}>
              {dish.name}
            </Text>
            <Text style={styles.gridDishCategory}>{dish.category}</Text>
            
            <View style={styles.gridRatingRow}>
              <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
              <Text style={styles.gridRating}>4.5</Text>
              <Text style={styles.gridDeliveryTime}>• 25 min</Text>
            </View>
            
            <View style={styles.gridPriceRow}>
              <Text style={styles.gridPrice}>₹{dish.price}</Text>
              <Text style={styles.gridOriginalPrice}>₹{Math.round(dish.price * 1.2)}</Text>
            </View>
          </View>
        </Surface>
      </Pressable>
    );
  }

  // List View
  return (
    <Pressable onPress={handleCardPress} style={styles.listCardContainer}>
      <Surface style={styles.listCard}>
        {/* Image */}
        <View style={styles.listImageContainer}>
          <Image 
            source={{ uri: dish.image }} 
            style={styles.listImage}
            resizeMode="cover"
          />
          
          {dish.isPopular && (
            <View style={styles.listPopularBadge}>
              <MaterialCommunityIcons name="fire" size={10} color="white" />
              <Text style={styles.listPopularText}>Hot</Text>
            </View>
          )}
        </View>
        
        {/* Content */}
        <View style={styles.listContent}>
          {/* Header */}
          <View style={styles.listHeader}>
            <View style={styles.listNameRow}>
              <Text style={styles.listDishName} numberOfLines={1}>
                {dish.name}
              </Text>
              <View style={[styles.listVegIndicator, { backgroundColor: dish.isVeg ? '#10B981' : '#EF4444' }]}>
                <MaterialCommunityIcons 
                  name={dish.isVeg ? "leaf" : "food-drumstick"} 
                  size={8} 
                  color="white" 
                />
              </View>
            </View>
            <Text style={styles.listDishCategory}>{dish.category}</Text>
          </View>
          
          {/* Description */}
          <Text style={styles.listDescription} numberOfLines={2}>
            {dish.description}
          </Text>
          
          {/* Metrics */}
          <View style={styles.listMetrics}>
            <View style={styles.listRatingContainer}>
              <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
              <Text style={styles.listRating}>4.5</Text>
              <Text style={styles.listRatingCount}>(120+)</Text>
            </View>
            
            <View style={styles.listTimeContainer}>
              <MaterialCommunityIcons name="clock-outline" size={12} color="#6B7280" />
              <Text style={styles.listTime}>25-30 min</Text>
            </View>
          </View>
          
          {/* Footer */}
          <View style={styles.listFooter}>
            <View style={styles.listPriceContainer}>
              <Text style={styles.listPrice}>₹{dish.price}</Text>
              <Text style={styles.listOriginalPrice}>₹{Math.round(dish.price * 1.2)}</Text>
              <Text style={styles.listSavings}>Save ₹{Math.round(dish.price * 0.2)}</Text>
            </View>
            
            {/* Add to Cart Button */}
            {quantity === 0 ? (
              <Pressable
                style={styles.listAddButton}
                onPress={handleAddToCart}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#4F46E5', '#6366F1']}
                  style={styles.listAddGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialCommunityIcons 
                    name={isLoading ? "loading" : "plus"} 
                    size={14} 
                    color="white" 
                  />
                  <Text style={styles.listAddText}>Add</Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <View style={styles.listQuantitySelector}>
                <Pressable
                  style={styles.listQuantityButton}
                  onPress={handleDecreaseQuantity}
                >
                  <MaterialCommunityIcons name="minus" size={14} color="#4F46E5" />
                </Pressable>
                <Text style={styles.listQuantityText}>{quantity}</Text>
                <Pressable
                  style={styles.listQuantityButton}
                  onPress={handleIncreaseQuantity}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons 
                    name={isLoading ? "loading" : "plus"} 
                    size={14} 
                    color="#4F46E5" 
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Grid View Styles
  gridCardContainer: {
    marginBottom: 8,
  },
  gridCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gridImageContainer: {
    position: 'relative',
    height: 120,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  gridBadgesContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vegIndicatorGrid: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  quickAddButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  gridQuantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 4,
    elevation: 2,
  },
  gridQuantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridQuantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    marginHorizontal: 6,
    minWidth: 12,
    textAlign: 'center',
  },
  gridContent: {
    padding: 12,
  },
  gridDishName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  gridDishCategory: {
    fontSize: 10,
    color: '#4F46E5',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  gridRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridRating: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 2,
  },
  gridDeliveryTime: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 4,
  },
  gridPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },
  gridOriginalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },

  // List View Styles
  listCardContainer: {
    marginBottom: 8,
  },
  listCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 120,
  },
  listImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  listPopularBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  listPopularText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '700',
  },
  listContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listHeader: {
    marginBottom: 6,
  },
  listNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  listDishName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  listVegIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listDishCategory: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  listDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  listMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 2,
  },
  listRatingCount: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 2,
  },
  listTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  listTime: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  listOriginalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  listSavings: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
  listAddButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  listAddGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  listAddText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  listQuantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  listQuantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listQuantityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
    marginHorizontal: 8,
    minWidth: 16,
    textAlign: 'center',
  },

  // Shared Styles
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '700',
  },
}); 