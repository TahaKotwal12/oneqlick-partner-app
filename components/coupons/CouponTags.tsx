import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { Button, Surface, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';
import { Coupon } from '../../data/cartData';

interface CouponTagsProps {
  coupons: Coupon[];
  appliedCoupon?: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  onViewAll: () => void;
  showViewAll?: boolean;
  maxVisible?: number;
  context?: 'cart' | 'checkout';
}

const { width } = Dimensions.get('window');

export default function CouponTags({
  coupons,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onViewAll,
  showViewAll = true,
  maxVisible = 3,
  context = 'cart',
}: CouponTagsProps) {
  const [expandedCoupon, setExpandedCoupon] = useState<string | null>(null);

  const visibleCoupons = coupons.slice(0, maxVisible);
  const hasMoreCoupons = coupons.length > maxVisible;

  const handleCouponPress = (coupon: Coupon) => {
    if (appliedCoupon?.code === coupon.code) {
      onRemoveCoupon();
    } else {
      onApplyCoupon(coupon);
    }
  };

  const handleCouponInfo = (coupon: Coupon) => {
    setExpandedCoupon(expandedCoupon === coupon.code ? null : coupon.code);
  };

  const formatDiscountText = (coupon: Coupon): string => {
    if (coupon.type === 'percentage') {
      return `${coupon.discount}% OFF`;
    } else {
      return `₹${coupon.discount} OFF`;
    }
  };

  const getCouponColor = (coupon: Coupon): string => {
    if (appliedCoupon?.code === coupon.code) {
      return DesignSystem.colors.success;
    }
    
    // Color based on discount type
    if (coupon.type === 'percentage') {
      return DesignSystem.colors.primary[500];
    } else {
      return DesignSystem.colors.accent[500];
    }
  };

  const renderCouponTag = (coupon: Coupon, index: number) => {
    const isApplied = appliedCoupon?.code === coupon.code;
    const isExpanded = expandedCoupon === coupon.code;
    const couponColor = getCouponColor(coupon);

    return (
      <View key={coupon.code} style={styles.couponContainer}>
        <Pressable
          style={[
            styles.couponTag,
            {
              backgroundColor: DesignSystem.colors.background.primary,
              borderColor: isApplied ? DesignSystem.colors.success : couponColor,
              borderWidth: isApplied ? 2 : 1,
            }
          ]}
          onPress={() => handleCouponPress(coupon)}
          onLongPress={() => handleCouponInfo(coupon)}
        >
          <View style={styles.couponContent}>
            <View style={styles.couponHeader}>
              <Text style={[styles.couponCode, { 
                color: isApplied ? DesignSystem.colors.success : couponColor 
              }]}>
                {coupon.code}
              </Text>
              <Text style={[styles.discountText, { 
                color: isApplied ? DesignSystem.colors.success : DesignSystem.colors.text.secondary 
              }]}>
                {formatDiscountText(coupon)}
              </Text>
            </View>
            
            {isExpanded && (
              <View style={styles.couponDetails}>
                <Text style={styles.couponDescription}>
                  {coupon.description}
                </Text>
                <Text style={styles.minOrderText}>
                  Min. order: ₹{coupon.minOrder}
                </Text>
              </View>
            )}
          </View>
          
          {isApplied && (
            <View style={styles.appliedIndicator}>
              <MaterialIcons 
                name="check-circle" 
                size={16} 
                color={DesignSystem.colors.success} 
              />
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  const renderViewAllButton = () => {
    if (!showViewAll || !hasMoreCoupons) return null;

    return (
      <View style={styles.viewAllContainer}>
        <Button
          mode="outlined"
          onPress={onViewAll}
          style={styles.viewAllButton}
          contentStyle={styles.viewAllButtonContent}
          labelStyle={styles.viewAllButtonLabel}
          icon="arrow-right"
        >
          View All
        </Button>
      </View>
    );
  };

  if (coupons.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons 
          name="local-offer" 
          size={32} 
          color={DesignSystem.colors.text.secondary} 
        />
        <Text style={styles.emptyText}>No coupons available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Available Offers</Text>
        <Text style={styles.sectionSubtitle}>
          Tap to apply • Long press for details
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {visibleCoupons.map((coupon, index) => renderCouponTag(coupon, index))}
        {renderViewAllButton()}
      </ScrollView>

      {/* Applied Coupon Info */}
      {appliedCoupon && (
        <Surface style={styles.appliedCouponInfo}>
          <View style={styles.appliedCouponContent}>
            <MaterialIcons 
              name="check-circle" 
              size={20} 
              color={DesignSystem.colors.success} 
            />
            <Text style={styles.appliedCouponText}>
              {appliedCoupon.code} applied - {formatDiscountText(appliedCoupon)}
            </Text>
            <IconButton
              icon="close"
              size={16}
              iconColor={DesignSystem.colors.text.secondary}
              onPress={onRemoveCoupon}
              style={styles.removeButton}
            />
          </View>
        </Surface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: DesignSystem.spacing.md,
  },
  header: {
    marginBottom: DesignSystem.spacing.sm,
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
  },
  scrollView: {
    marginBottom: DesignSystem.spacing.sm,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  couponContainer: {
    marginRight: DesignSystem.spacing.sm,
  },
  couponTag: {
    borderRadius: DesignSystem.borderRadius.lg,
    padding: DesignSystem.spacing.sm,
    minWidth: 120,
    maxWidth: 160,
    ...DesignSystem.shadows.sm,
    overflow: 'hidden',
  },
  couponContent: {
    alignItems: 'center',
  },
  couponHeader: {
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  couponCode: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    marginBottom: DesignSystem.spacing.xs,
  },
  discountText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.secondary,
  },
  couponDetails: {
    marginTop: DesignSystem.spacing.xs,
    alignItems: 'center',
  },
  couponDescription: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.text.secondary,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  minOrderText: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.warning,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  appliedIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: 12,
    padding: 2,
    ...DesignSystem.shadows.sm,
  },
  viewAllContainer: {
    marginLeft: DesignSystem.spacing.sm,
    justifyContent: 'center',
  },
  viewAllButton: {
    borderColor: DesignSystem.colors.primary[500],
    borderRadius: DesignSystem.borderRadius.lg,
  },
  viewAllButtonContent: {
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.md,
  },
  viewAllButtonLabel: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  appliedCouponInfo: {
    marginTop: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.md,
    backgroundColor: DesignSystem.colors.background.primary,
    borderWidth: 1,
    borderColor: DesignSystem.colors.success + '30',
    ...DesignSystem.shadows.sm,
  },
  appliedCouponContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.spacing.sm,
  },
  appliedCouponText: {
    flex: 1,
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.success,
    marginLeft: DesignSystem.spacing.sm,
  },
  removeButton: {
    margin: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing.xl,
    paddingHorizontal: DesignSystem.spacing.md,
  },
  emptyText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    marginTop: DesignSystem.spacing.sm,
  },
});
