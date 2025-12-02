import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { Restaurant } from '../../types';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { AppIcon } from '../ui';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  showOffers?: boolean;
}

export default function RestaurantCard({ restaurant, onPress, showOffers = true }: Readonly<RestaurantCardProps>) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Surface style={styles.card}>
        {/* Restaurant Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <AppIcon.Restaurant size={40} color={DesignSystem.colors.text.disabled} />
          </View>
          
          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <AppIcon.Star size={16} color={DesignSystem.colors.warning} />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
          
          {/* Veg/Non-veg indicator */}
          <View style={styles.vegIndicator}>
            <AppIcon.Veg size={16} color={restaurant.isVeg ? DesignSystem.colors.success : DesignSystem.colors.error} />
          </View>
        </View>
        
        {/* Restaurant Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          
          <Text style={styles.cuisine} numberOfLines={1}>
            {restaurant.cuisine}
          </Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <AppIcon.Time size={14} color={DesignSystem.colors.text.secondary} />
              <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <AppIcon.Location size={14} color={DesignSystem.colors.text.secondary} />
              <Text style={styles.metaText}>{restaurant.address.split(',')[0]}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <AppIcon.Delivery size={14} color={DesignSystem.colors.text.secondary} />
              <Text style={styles.metaText}>₹{restaurant.deliveryFee}</Text>
            </View>
          </View>
          
          {/* Offers */}
          {showOffers && restaurant.offers && restaurant.offers.length > 0 && (
            <View style={styles.offersContainer}>
              <Chip style={styles.offerChip} textStyle={styles.offerText}>
                {restaurant.offers[0].title}
              </Chip>
              {restaurant.offers.length > 1 && (
                <Text style={styles.moreOffersText}>
                  +{restaurant.offers.length - 1} more
                </Text>
              )}
            </View>
          )}
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: DesignSystem.spacing.md,
  },
  card: {
    width: 280,
    borderRadius: DesignSystem.borderRadius.lg,
    elevation: 2,
    overflow: 'hidden',
    backgroundColor: DesignSystem.colors.background.primary,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: DesignSystem.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: DesignSystem.spacing.sm,
    left: DesignSystem.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: DesignSystem.spacing.xs,
    paddingVertical: 4,
    borderRadius: DesignSystem.borderRadius.md,
  },
  ratingText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.inverse,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    marginLeft: 4,
  },
  vegIndicator: {
    position: 'absolute',
    top: DesignSystem.spacing.sm,
    right: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.background.primary,
    padding: 4,
    borderRadius: DesignSystem.borderRadius.md,
  },
  infoContainer: {
    padding: DesignSystem.spacing.md,
  },
  name: {
    ...GlobalStyles.typography.h5,
    color: DesignSystem.colors.text.primary,
    marginBottom: 4,
  },
  cuisine: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.sm,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DesignSystem.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    marginLeft: 4,
  },
  offersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerChip: {
    backgroundColor: DesignSystem.colors.primary[50],
    borderColor: DesignSystem.colors.primary[500],
    borderWidth: 1,
  },
  offerText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  moreOffersText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    fontStyle: 'italic',
  },
}); 