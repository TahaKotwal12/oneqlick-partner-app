import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';
import { 
  Surface, 
  IconButton, 
  Chip, 
  Searchbar,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';
import { Coupon } from '../../data/cartData';

interface ViewAllCouponsModalProps {
  visible: boolean;
  onClose: () => void;
  coupons: Coupon[];
  appliedCoupon?: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  currentOrderValue?: number;
}

const { width, height } = Dimensions.get('window');

export default function ViewAllCouponsModal({
  visible,
  onClose,
  coupons,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  currentOrderValue = 0,
}: ViewAllCouponsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'percentage' | 'fixed'>('all');

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || coupon.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const eligibleCoupons = filteredCoupons.filter(coupon => 
    currentOrderValue >= coupon.minOrder
  );

  const ineligibleCoupons = filteredCoupons.filter(coupon => 
    currentOrderValue < coupon.minOrder
  );

  const handleCouponPress = (coupon: Coupon) => {
    if (appliedCoupon?.code === coupon.code) {
      onRemoveCoupon();
    } else {
      onApplyCoupon(coupon);
    }
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
    
    if (coupon.type === 'percentage') {
      return DesignSystem.colors.primary[500];
    } else {
      return DesignSystem.colors.accent[500];
    }
  };

  const renderCouponCard = (coupon: Coupon, isEligible: boolean = true) => {
    const isApplied = appliedCoupon?.code === coupon.code;
    const couponColor = getCouponColor(coupon);

    return (
      <Pressable
        key={coupon.code}
        style={[
          styles.couponCard,
          {
            opacity: isEligible ? 1 : 0.6,
            borderColor: isEligible ? couponColor : DesignSystem.colors.border.light,
          }
        ]}
        onPress={() => isEligible && handleCouponPress(coupon)}
        disabled={!isEligible}
      >
        <View style={styles.couponCardContent}>
          <View style={styles.couponHeader}>
            <View style={styles.couponCodeContainer}>
              <Text style={[styles.couponCode, { color: couponColor }]}>
                {coupon.code}
              </Text>
              {isApplied && (
                <MaterialIcons 
                  name="check-circle" 
                  size={16} 
                  color={DesignSystem.colors.success} 
                />
              )}
            </View>
            <Text style={[styles.discountText, { color: couponColor }]}>
              {formatDiscountText(coupon)}
            </Text>
          </View>

          <Text style={styles.couponDescription}>
            {coupon.description}
          </Text>

          <View style={styles.couponFooter}>
            <View style={styles.minOrderContainer}>
              <MaterialIcons 
                name="shopping-cart" 
                size={14} 
                color={DesignSystem.colors.text.secondary} 
              />
              <Text style={styles.minOrderText}>
                Min. order: ₹{coupon.minOrder}
              </Text>
            </View>

            {coupon.type === 'percentage' && coupon.maxDiscount && (
              <Text style={styles.maxDiscountText}>
                Max. ₹{coupon.maxDiscount}
              </Text>
            )}
          </View>

          {!isEligible && (
            <View style={styles.ineligibleOverlay}>
              <Text style={styles.ineligibleText}>
                Add ₹{coupon.minOrder - currentOrderValue} more to use
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const renderFilterChips = () => (
    <View style={styles.filterContainer}>
      <Chip
        mode={filterType === 'all' ? 'flat' : 'outlined'}
        onPress={() => setFilterType('all')}
        style={[
          styles.filterChip,
          filterType === 'all' && styles.activeFilterChip
        ]}
        textStyle={filterType === 'all' ? styles.activeFilterText : styles.filterText}
      >
        All
      </Chip>
      <Chip
        mode={filterType === 'percentage' ? 'flat' : 'outlined'}
        onPress={() => setFilterType('percentage')}
        style={[
          styles.filterChip,
          filterType === 'percentage' && styles.activeFilterChip
        ]}
        textStyle={filterType === 'percentage' ? styles.activeFilterText : styles.filterText}
      >
        Percentage
      </Chip>
      <Chip
        mode={filterType === 'fixed' ? 'flat' : 'outlined'}
        onPress={() => setFilterType('fixed')}
        style={[
          styles.filterChip,
          filterType === 'fixed' && styles.activeFilterChip
        ]}
        textStyle={filterType === 'fixed' ? styles.activeFilterText : styles.filterText}
      >
        Fixed
      </Chip>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Available Coupons</Text>
            <Text style={styles.subtitle}>
              {filteredCoupons.length} coupon{filteredCoupons.length !== 1 ? 's' : ''} available
            </Text>
          </View>
          <IconButton
            icon="close"
            size={24}
            iconColor={DesignSystem.colors.text.primary}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search coupons..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />
          {renderFilterChips()}
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Eligible Coupons */}
          {eligibleCoupons.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons 
                  name="check-circle" 
                  size={20} 
                  color={DesignSystem.colors.success} 
                />
                <Text style={styles.sectionTitle}>
                  Available for your order ({eligibleCoupons.length})
                </Text>
              </View>
              {eligibleCoupons.map(coupon => renderCouponCard(coupon, true))}
            </View>
          )}

          {/* Ineligible Coupons */}
          {ineligibleCoupons.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons 
                  name="info" 
                  size={20} 
                  color={DesignSystem.colors.warning} 
                />
                <Text style={styles.sectionTitle}>
                  Add more items to unlock ({ineligibleCoupons.length})
                </Text>
              </View>
              {ineligibleCoupons.map(coupon => renderCouponCard(coupon, false))}
            </View>
          )}

          {/* No Results */}
          {filteredCoupons.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialIcons 
                name="search-off" 
                size={48} 
                color={DesignSystem.colors.text.secondary} 
              />
              <Text style={styles.emptyTitle}>No coupons found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.border.light,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: DesignSystem.typography.fontSize.xl,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
  },
  subtitle: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    marginTop: DesignSystem.spacing.xs,
  },
  closeButton: {
    margin: 0,
  },
  searchContainer: {
    padding: DesignSystem.spacing.lg,
    backgroundColor: DesignSystem.colors.background.primary,
  },
  searchBar: {
    marginBottom: DesignSystem.spacing.md,
    elevation: 0,
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: DesignSystem.borderRadius.md,
  },
  searchInput: {
    fontSize: DesignSystem.typography.fontSize.base,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.sm,
  },
  filterChip: {
    marginRight: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.background.primary,
    borderColor: DesignSystem.colors.border.light,
  },
  activeFilterChip: {
    backgroundColor: DesignSystem.colors.primary[500],
    borderColor: DesignSystem.colors.primary[500],
  },
  filterText: {
    color: DesignSystem.colors.text.secondary,
  },
  activeFilterText: {
    color: DesignSystem.colors.text.inverse,
  },
  content: {
    flex: 1,
    paddingHorizontal: DesignSystem.spacing.lg,
  },
  section: {
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginLeft: DesignSystem.spacing.sm,
  },
  couponCard: {
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: DesignSystem.borderRadius.lg,
    marginBottom: DesignSystem.spacing.sm,
    borderWidth: 1,
    ...DesignSystem.shadows.sm,
  },
  couponCardContent: {
    padding: DesignSystem.spacing.md,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  couponCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponCode: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    marginRight: DesignSystem.spacing.xs,
  },
  discountText: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  couponDescription: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.sm,
    lineHeight: DesignSystem.typography.lineHeight.normal * DesignSystem.typography.fontSize.sm,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minOrderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minOrderText: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
  },
  maxDiscountText: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.warning,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  ineligibleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: DesignSystem.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ineligibleText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.warning,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    textAlign: 'center',
  },
  appliedCouponInfo: {
    margin: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.borderRadius.md,
    ...DesignSystem.shadows.md,
  },
  appliedCouponContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.spacing.md,
  },
  appliedCouponText: {
    flex: 1,
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.primary,
    marginLeft: DesignSystem.spacing.sm,
  },
  removeButton: {
    margin: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing['4xl'],
  },
  emptyTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginTop: DesignSystem.spacing.md,
  },
  emptySubtitle: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    textAlign: 'center',
    marginTop: DesignSystem.spacing.sm,
  },
});
