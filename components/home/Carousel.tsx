import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CarouselItem } from './carouselData';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 32;
const CARD_MARGIN = 8;
const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;

interface CarouselProps {
  items: CarouselItem[];
  currentIndex: number;
  onItemChange: (index: number) => void;
  onItemPress: (item: CarouselItem) => void;
}

export default function Carousel({ items, currentIndex, onItemChange, onItemPress }: CarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  // Auto-swipe functionality
  useEffect(() => {
    if (!autoPlayEnabled || items.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      onItemChange(nextIndex);
      
      scrollViewRef.current?.scrollTo({
        x: nextIndex * TOTAL_CARD_WIDTH,
        animated: true,
      });
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, autoPlayEnabled, items.length, onItemChange]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / TOTAL_CARD_WIDTH);
    
    if (index !== currentIndex && index >= 0 && index < items.length) {
      onItemChange(index);
    }
  };

  const handleTouchStart = () => {
    setAutoPlayEnabled(false);
  };

  const handleTouchEnd = () => {
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setAutoPlayEnabled(true), 5000);
  };

  const renderCarouselItem = (item: CarouselItem, index: number) => {
    return (
      <Pressable
        key={item.id}
        style={[styles.carouselCard, { marginLeft: index === 0 ? 16 : CARD_MARGIN, marginRight: CARD_MARGIN }]}
        onPress={() => onItemPress(item)}
      >
        <LinearGradient
          colors={item.gradientColors as [string, string, ...string[]]}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Badge */}
          {item.badge && (
            <View style={styles.badge}>
              <MaterialCommunityIcons name="lightning-bolt" size={12} color="#4F46E5" />
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}

          {/* Content */}
          <View style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              
              {/* Offer Code */}
              {item.offerCode && (
                <View style={styles.offerCodeContainer}>
                  <Text style={styles.offerCodeLabel}>Use code:</Text>
                  <Text style={styles.offerCode}>{item.offerCode}</Text>
                </View>
              )}

              {/* Action Button */}
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{item.actionText}</Text>
                <MaterialCommunityIcons name="arrow-right" size={14} color="white" />
              </View>
            </View>

            {/* Icon Container */}
            <View style={styles.iconContainer}>
              {item.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>
              )}
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons 
                  name={item.icon as any} 
                  size={28} 
                  color="white" 
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={TOTAL_CARD_WIDTH}
        snapToAlignment="start"
        contentInsetAdjustmentBehavior="never"
      >
        {items.map(renderCarouselItem)}
        <View style={{ width: 16 }} />
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    overflow: 'hidden',
  },
  carouselCard: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 32,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    lineHeight: 14,
  },
  offerCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  offerCodeLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  offerCode: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 3,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
  iconContainer: {
    alignItems: 'center',
    opacity: 0.3,
  },
  discountBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  paginationDotActive: {
    backgroundColor: '#4F46E5',
    width: 20,
  },
}); 