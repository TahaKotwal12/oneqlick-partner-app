import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FoodItem } from '../../types';
import EnhancedFoodItemCard from './EnhancedFoodItemCard';

const { width: screenWidth } = Dimensions.get('window');

interface PopularDishesProps {
  readonly dishes: FoodItem[];
  readonly onAddToCart: (dish: FoodItem) => void;
}

type ViewMode = 'grid' | 'list';

export default function PopularDishes({ dishes, onAddToCart }: PopularDishesProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const handleFoodItemPress = (dish: FoodItem) => {
    console.log('PopularDish pressed with ID:', dish.id);
    router.push(`/food-item/${dish.id}`);
  };

  // Filter dishes based on active filter
  const filteredDishes = dishes.filter(dish => {
    switch (activeFilter) {
      case 'veg':
        return dish.isVeg === true;
      case 'non-veg':
        return dish.isVeg === false;
      case 'all':
      default:
        return true;
    }
  });

  const handleFilterPress = (filter: 'all' | 'veg' | 'non-veg') => {
    setActiveFilter(filter);
  };
    
    return (
    <View style={styles.section}>
      {/* Enhanced Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons name="fire" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Popular Dishes</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Most loved by our customers</Text>
          <View style={styles.statsContainer}>
            <MaterialCommunityIcons name="chart-line" size={14} color="#10B981" />
            <Text style={styles.statsText}>{filteredDishes.length} trending dishes</Text>
            </View>
        </View>
        
        <View style={styles.headerActions}>
          {/* View Mode Toggle */}
          <View style={styles.viewModeToggle}>
            <Pressable 
              style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <MaterialCommunityIcons 
                name="view-list" 
                size={16} 
                color={viewMode === 'list' ? '#4F46E5' : '#6B7280'} 
              />
            </Pressable>
            <Pressable 
              style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
              onPress={() => setViewMode('grid')}
            >
              <MaterialCommunityIcons 
                name="view-grid" 
                size={16} 
                color={viewMode === 'grid' ? '#4F46E5' : '#6B7280'} 
              />
            </Pressable>
          </View>
          
          {/* View All Button */}
          <Pressable 
            style={styles.viewAllButton}
            onPress={() => router.push('/search')}
          >
            <LinearGradient
              colors={['#4F46E5', '#6366F1']}
              style={styles.viewAllGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialCommunityIcons name="arrow-right" size={14} color="white" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* Filter Tags */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {[
          { label: 'All', icon: 'silverware', value: 'all' as const },
          { label: 'Veg', icon: 'leaf', value: 'veg' as const },
          { label: 'Non-Veg', icon: 'food-drumstick', value: 'non-veg' as const },
        ].map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <Pressable 
              key={filter.label} 
              style={[styles.filterTag, isActive && styles.filterTagActive]}
              onPress={() => handleFilterPress(filter.value)}
            >
              <MaterialCommunityIcons 
                name={filter.icon as any} 
                size={14} 
                color={isActive ? '#4F46E5' : '#6B7280'} 
              />
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Dishes Container */}
      <View style={styles.dishesContainer}>
        {viewMode === 'list' ? (
          // List View
          <View style={styles.listContainer}>
            {filteredDishes.map((dish, index) => (
              <EnhancedFoodItemCard
                key={dish.id}
                dish={dish}
                onAddToCart={onAddToCart}
                onPress={handleFoodItemPress}
                viewMode="list"
                index={index}
              />
            ))}
          </View>
        ) : (
          // Grid View
          <View style={styles.gridContainer}>
            {filteredDishes.map((dish, index) => (
              <View key={dish.id} style={styles.gridItem}>
                <EnhancedFoodItemCard
                  dish={dish}
                  onAddToCart={onAddToCart}
                  onPress={handleFoodItemPress}
                  viewMode="grid"
                  index={index}
                />
              </View>
            ))}
          </View>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    paddingVertical: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  headerActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    padding: 6,
    borderRadius: 6,
    minWidth: 28,
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  viewAllButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  viewAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  viewAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTagActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#4F46E5',
  },
  dishesContainer: {
    paddingHorizontal: 16,
  },
  listContainer: {
    gap: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (screenWidth - 44) / 2, // Account for padding and gap
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
}); 