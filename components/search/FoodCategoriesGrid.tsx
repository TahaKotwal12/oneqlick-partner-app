import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Image, FlatList } from 'react-native';
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

interface FoodCategoriesGridProps {
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
            size={DesignSystem.sizes.icon.lg} 
            color={DesignSystem.colors.text.secondary} 
          />
        </View>
      )}
    </View>
  );
};

export default function FoodCategoriesGrid({ categories }: FoodCategoriesGridProps) {
  const router = useRouter();

  const handleCategoryPress = (categoryName: string) => {
    router.push(`/search?category=${categoryName}`);
  };

  const renderCategory = ({ item: category, index }: { item: FoodCategory; index: number }) => {
    return (
      <Pressable
        key={category.id}
        style={[
          styles.categoryItem,
          { marginLeft: index % 4 === 0 ? 0 : DesignSystem.spacing.sm }
        ]}
        onPress={() => handleCategoryPress(category.name)}
      >
        <View style={styles.categoryCard}>
          {/* Category Image with fallback */}
          <CategoryImage category={category} />
          
          {/* Name */}
          <Text style={styles.categoryName} numberOfLines={2}>
            {category.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Food Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={4}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.lg,
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.md,
  },
  gridContainer: {
    paddingBottom: DesignSystem.spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: DesignSystem.spacing.md,
  },
  categoryItem: {
    flex: 1,
    maxWidth: '22%',
  },
  categoryCard: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
