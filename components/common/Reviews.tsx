import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { AppIcon } from '../ui';

export interface Review {
  id: string | number;
  reviewerName: string;
  rating: number;
  comment: string;
  date?: string;
  order?: string;
  location?: string;
  bgColor?: string;
}

interface ReviewsProps {
  reviews: Review[];
  title?: string;
  showCount?: boolean;
  maxReviews?: number;
  variant?: 'card' | 'list';
  showOrderInfo?: boolean;
  showLocation?: boolean;
  horizontal?: boolean;
}

export default function Reviews({
  reviews,
  title = "Customer Reviews",
  showCount = true,
  maxReviews,
  variant = 'list',
  showOrderInfo = false,
  showLocation = false,
  horizontal = false
}: ReviewsProps) {
  const displayReviews = maxReviews ? reviews.slice(0, maxReviews) : reviews;

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <AppIcon.Star
        key={star}
        size={12}
        color={star <= rating ? DesignSystem.colors.warning : DesignSystem.colors.neutral[300]}
      />
    ));
  };

  const renderReviewCard = (review: Review, index: number) => {
    if (variant === 'card') {
      return (
        <View key={review.id} style={[styles.testimonialCard, { marginLeft: index === 0 ? 16 : 8, marginRight: 8 }]}>
          <View style={styles.quoteIcon}>
            <MaterialCommunityIcons 
              name="format-quote-open" 
              size={20} 
              color={review.bgColor || DesignSystem.colors.primary[500]} 
            />
          </View>
          
          <Text style={styles.testimonialText}>"{review.comment}"</Text>
          
          <View style={styles.testimonialFooter}>
            <View style={[styles.userAvatar, { backgroundColor: review.bgColor || DesignSystem.colors.primary[500] }]}>
              <Text style={styles.userInitial}>{review.reviewerName.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{review.reviewerName}</Text>
              <View style={styles.ratingContainer}>
                {renderStars(review.rating)}
              </View>
              {(showOrderInfo && review.order) && (
                <Text style={styles.orderInfo}>
                  Ordered {review.order}
                  {showLocation && review.location && ` • ${review.location}`}
                </Text>
              )}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View key={review.id} style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>{review.reviewerName}</Text>
          <View style={styles.reviewRating}>
            {renderStars(review.rating)}
          </View>
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
        {review.date && <Text style={styles.reviewDate}>{review.date}</Text>}
      </View>
    );
  };

  const renderReviewItem = (review: Review) => {
    return (
      <View key={review.id} style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>{review.reviewerName}</Text>
          <View style={styles.reviewRating}>
            {renderStars(review.rating)}
          </View>
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
        {review.date && <Text style={styles.reviewDate}>{review.date}</Text>}
      </View>
    );
  };

  const renderReviews = () => {
    if (horizontal) {
      return (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
        >
          {displayReviews.map((review, index) => renderReviewCard(review, index))}
          <View style={{ width: 16 }} />
        </ScrollView>
      );
    }

    return (
      <View style={styles.verticalContainer}>
        {displayReviews.map((review, index) => 
          variant === 'card' 
            ? renderReviewCard(review, index)
            : renderReviewItem(review)
        )}
      </View>
    );
  };

  return (
    <View style={styles.reviewsSection}>
      {title && (
        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsTitle}>{title}</Text>
          {showCount && (
            <Text style={styles.reviewsCount}>({reviews.length})</Text>
          )}
        </View>
      )}
      
      {renderReviews()}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewsSection: {
    backgroundColor: 'transparent',
    marginTop: DesignSystem.spacing.lg,
    marginBottom: DesignSystem.spacing.md,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
    paddingHorizontal: 16,
  },
  reviewsTitle: {
    ...GlobalStyles.typography.h4,
    color: DesignSystem.colors.text.primary,
  },
  reviewsCount: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
  },
  
  // Vertical List Styles
  verticalContainer: {
    gap: DesignSystem.spacing.md,
  },
  reviewItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: DesignSystem.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  reviewerName: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    flex: 1,
    fontSize: 16,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: DesignSystem.spacing.sm,
  },
  reviewComment: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.sm,
    fontSize: 15,
    lineHeight: 22,
  },
  reviewDate: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.disabled,
    fontSize: 12,
  },

  // Horizontal Card Styles
  horizontalContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  testimonialCard: {
    backgroundColor: '#F5F5F7', // <--- CHANGED TO GREY HERE
    borderRadius: 16,
    padding: 20,
    width: 300,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5E5', // Slightly darker border
  },
  quoteIcon: {
    alignSelf: 'flex-start',
    marginBottom: DesignSystem.spacing.sm,
  },
  testimonialText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '500',
    marginBottom: 20,
  },
  testimonialFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitial: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 6,
  },
  orderInfo: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
});