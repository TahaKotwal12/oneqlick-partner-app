import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { AppIcon } from '../ui';

interface BasicInfoProps {
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  prepTime: string;
  calories: number;
  cuisine: string;
}

export default function BasicInfo({
  name,
  description,
  rating,
  reviewCount,
  price,
  originalPrice,
  prepTime,
  calories,
  cuisine,
}: BasicInfoProps) {
  return (
    <Surface style={styles.basicInfoCard} elevation={1}>
      <View style={styles.titleRow}>
        <View style={styles.titleSection}>
          <Text style={styles.foodName}>{name}</Text>
          <Text style={styles.foodDescription}>{description}</Text>
        </View>
      </View>
      
      <View style={styles.ratingRow}>
        <View style={styles.ratingContainer}>
          <AppIcon.Star size={16} color={DesignSystem.colors.warning} />
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{price}</Text>
          {originalPrice ? (
            <Text style={styles.originalPrice}>₹{originalPrice}</Text>
          ) : null}
        </View>
      </View>
      
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <AppIcon.Time size={14} color={DesignSystem.colors.text.secondary} />
          <Text style={styles.metaText}>{prepTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <AppIcon.Popular size={14} color={DesignSystem.colors.text.secondary} />
          <Text style={styles.metaText}>{calories} cal</Text>
        </View>
        <View style={styles.metaItem}>
          <AppIcon.Restaurant size={14} color={DesignSystem.colors.text.secondary} />
          <Text style={styles.metaText}>{cuisine}</Text>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  basicInfoCard: {
    margin: DesignSystem.spacing.md,
    padding: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.borderRadius.lg,
    backgroundColor: DesignSystem.colors.background.primary,
  },
  titleRow: {
    marginBottom: DesignSystem.spacing.md,
  },
  titleSection: {
    flex: 1,
  },
  foodName: {
    ...GlobalStyles.typography.h4,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  foodDescription: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.primary,
    marginLeft: DesignSystem.spacing.xs,
    marginRight: DesignSystem.spacing.sm,
  },
  reviewCount: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  currentPrice: {
    ...GlobalStyles.typography.h5,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  originalPrice: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  metaText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
  },
});
