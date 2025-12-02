import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';

interface FoodCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
  image: string;
}

interface FoodCategoriesProps {
  categories: FoodCategory[];
}

// Component for handling image loading with fallback
const CategoryImage = ({ category }: { category: FoodCategory }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={styles.imageContainer}>
      {!imageError ? (
        <Image 
          source={{ uri: category.image }}
          style={styles.categoryImage}
          resizeMode="cover"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />
      ) : null}
      
      {/* Show fallback icon when image fails to load or is loading */}
      {(imageError || imageLoading) && (
        <View style={styles.fallbackIcon}>
          <MaterialCommunityIcons 
            name={category.icon as any} 
            size={DesignSystem.sizes.icon.md} 
            color={DesignSystem.colors.text.secondary} 
          />
        </View>
      )}
    </View>
  );
};

export default function FoodCategories({ categories }: FoodCategoriesProps) {
  const router = useRouter();

  const handleCategoryPress = (categoryName: string) => {
    router.push(`/search?category=${categoryName}`);
  };

  const renderCategory = (category: FoodCategory, index: number) => {
    return (
    <Pressable
      key={category.id}
        style={[
          styles.categoryItem,
          { marginLeft: index === 0 ? DesignSystem.spacing.md : 0 }
        ]}
      onPress={() => handleCategoryPress(category.name)}
    >
        <View style={styles.categoryCard}>
          {/* Category Image with fallback */}
          <CategoryImage category={category} />
          
          {/* Name */}
          <Text style={styles.categoryName} numberOfLines={1}>
            {category.name}
          </Text>
        </View>
    </Pressable>
  );
  };

  return (
    <View style={styles.section}>
      {/* Simple Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Food Categories</Text>
        <Pressable 
          style={styles.viewAllButton}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#4F46E5" />
        </Pressable>
      </View>
      
      {/* Categories Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category, index) => renderCategory(category, index))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: DesignSystem.spacing.lg,
    backgroundColor: DesignSystem.colors.background.primary,
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionHeader: {
    ...GlobalStyles.layout.rowSpaceBetween,
    paddingHorizontal: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
  },
  viewAllButton: {
    ...GlobalStyles.layout.row,
    gap: DesignSystem.spacing.xs,
  },
  viewAllText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.primary[500],
  },
  scrollContent: {
    paddingRight: DesignSystem.spacing.md,
  },
  categoryItem: {
    marginRight: DesignSystem.spacing.sm,
  },
  categoryCard: {
    alignItems: 'center',
    width: 80,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: DesignSystem.spacing.xs,
    overflow: 'hidden',
    ...DesignSystem.shadows.md,
    position: 'relative',
    backgroundColor: DesignSystem.colors.neutral[100], // Background for fallback
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  fallbackIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: DesignSystem.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    textAlign: 'center',
    color: DesignSystem.colors.text.primary,
    lineHeight: DesignSystem.typography.fontSize.xs * DesignSystem.typography.lineHeight.normal,
  },
}); 