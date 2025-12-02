import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Chip, IconButton } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { AppIcon } from '../ui';

const { height } = Dimensions.get('window');

interface FoodImageProps {
  image: string;
  isVeg: boolean;
  isPopular: boolean;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

export default function FoodImage({ 
  image, 
  isVeg, 
  isPopular, 
  isFavorite, 
  onFavoriteToggle 
}: FoodImageProps) {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: image }}
        style={styles.foodImage}
        resizeMode="cover"
      />
      
      <View style={styles.imageOverlay}>
        <View style={styles.imageBadges}>
          {isVeg && (
            <Chip style={styles.vegBadge} textStyle={styles.vegBadgeText}>
              Veg
            </Chip>
          )}
          {isPopular && (
            <Chip style={styles.popularBadge} textStyle={styles.popularBadgeText}>
              Popular
            </Chip>
          )}
        </View>
        
        <IconButton
          // eslint-disable-next-line react/no-unstable-nested-components
          icon={() => (
            isFavorite ? 
              <AppIcon.Favorite 
                size={24} 
                color={DesignSystem.colors.error}
              /> :
              <AppIcon.FavoriteOutline 
                size={24} 
                color={DesignSystem.colors.text.inverse}
              />
          )}
          onPress={onFavoriteToggle}
          style={styles.favoriteButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    height: height * 0.3,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: DesignSystem.spacing.md,
  },
  imageBadges: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.sm,
  },
  vegBadge: {
    backgroundColor: DesignSystem.colors.success,
  },
  vegBadgeText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.inverse,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  popularBadge: {
    backgroundColor: DesignSystem.colors.primary[500],
  },
  popularBadgeText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.inverse,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: DesignSystem.borderRadius.xl,
  },
});
