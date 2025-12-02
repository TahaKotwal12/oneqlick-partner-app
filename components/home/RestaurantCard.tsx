import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  distance: string;
  image: string;
  isOpen: boolean;
  offers: any[];
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: (restaurantId: string) => void;
}

export default function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  const handleRestaurantPress = () => {
    onPress(restaurant.id);
  };

  return (
    <Pressable
      style={styles.restaurantCard}
      onPress={handleRestaurantPress}
    >
      <Surface style={styles.cardSurface}>
        <View style={styles.restaurantImageContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
          {!restaurant.isOpen && (
            <View style={styles.closedOverlay}>
              <Text style={styles.closedText}>Closed</Text>
            </View>
          )}
          
          {/* Status indicator */}
          <View style={[styles.statusIndicator, { backgroundColor: restaurant.isOpen ? '#10B981' : '#EF4444' }]}>
            <MaterialIcons 
              name="fiber-manual-record" 
              size={8} 
              color="white" 
            />
            <Text style={styles.statusText}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
          
          {/* Offers */}
          {restaurant.offers.length > 0 && (
            <View style={styles.offersContainer}>
              <Chip style={styles.mainOfferTag} textStyle={styles.mainOfferTagText}>
                {restaurant.offers[0].title || restaurant.offers[0]}
              </Chip>
              {restaurant.offers.length > 1 && (
                <View style={styles.moreOffersIndicator}>
                  <Text style={styles.moreOffersText}>+{restaurant.offers.length - 1}</Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.restaurantContent}>
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#F59E0B" />
              <Text style={styles.rating}>{restaurant.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.restaurantCuisine} numberOfLines={1}>
            {restaurant.cuisine}
          </Text>
          
          <View style={styles.restaurantDetails}>
            <View style={styles.detailItem}>
              <MaterialIcons name="access-time" size={14} color="#6B7280" />
              <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="location-on" size={14} color="#6B7280" />
              <Text style={styles.detailText}>{restaurant.distance}</Text>
            </View>
          </View>
          
          <View style={styles.restaurantFooter}>
            <Text style={styles.minOrder}>Min ₹{restaurant.minOrder || 0}</Text>
            <View style={styles.orderButton}>
              <Text style={styles.orderButtonText}>Order Now</Text>
            </View>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  restaurantCard: {
    marginRight: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing.sm,
  },
  cardSurface: {
    width: 280,
    borderRadius: DesignSystem.borderRadius.xl,
    backgroundColor: DesignSystem.colors.background.primary,
    ...DesignSystem.shadows.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  closedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: DesignSystem.colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: DesignSystem.colors.text.inverse,
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  statusIndicator: {
    position: 'absolute',
    top: DesignSystem.spacing.sm,
    right: DesignSystem.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: DesignSystem.borderRadius.md,
    ...DesignSystem.shadows.sm,
  },
  statusText: {
    color: DesignSystem.colors.text.inverse,
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    marginLeft: 4,
  },
  offersContainer: {
    position: 'absolute',
    bottom: DesignSystem.spacing.sm,
    left: DesignSystem.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  mainOfferTag: {
    backgroundColor: DesignSystem.colors.primary[500],
    height: 28,
  },
  mainOfferTagText: {
    color: DesignSystem.colors.text.inverse,
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  moreOffersIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: DesignSystem.borderRadius.md,
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: 4,
  },
  moreOffersText: {
    color: DesignSystem.colors.text.inverse,
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  restaurantContent: {
    padding: DesignSystem.spacing.md,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DesignSystem.spacing.sm,
  },
  restaurantName: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
    flex: 1,
    marginRight: DesignSystem.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.primary[50],
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: DesignSystem.borderRadius.md,
  },
  rating: {
    marginLeft: 4,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
    fontSize: DesignSystem.typography.fontSize.sm,
  },
  restaurantCuisine: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: DesignSystem.colors.text.secondary,
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minOrder: {
    color: DesignSystem.colors.primary[500],
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  orderButton: {
    backgroundColor: DesignSystem.colors.primary[500],
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.xl,
  },
  orderButtonText: {
    color: DesignSystem.colors.text.inverse,
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
}); 