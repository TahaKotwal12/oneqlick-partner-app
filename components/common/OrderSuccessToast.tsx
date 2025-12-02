import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Modal,
  Portal,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';

const { height: screenHeight } = Dimensions.get('window');

interface OrderSuccessToastProps {
  readonly visible: boolean;
  readonly orderId: string;
  readonly onTrackOrder: () => void;
  readonly onClose: () => void;
  readonly onViewOrders: () => void;
}

export default function OrderSuccessToast({
  visible,
  orderId,
  onTrackOrder,
  onClose,
  onViewOrders,
}: OrderSuccessToastProps) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  const handleTrackOrder = () => {
    console.log('Track Order button pressed');
    handleClose(); // Close first
    onTrackOrder(); // Then navigate
  };

  const handleViewOrders = () => {
    console.log('View Orders button pressed');
    handleClose(); // Close first
    onViewOrders(); // Then navigate
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
      >
        <Animated.View
          style={[
            styles.dialogContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Surface style={styles.dialog}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.successIconContainer}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={48}
                  color={DesignSystem.colors.success}
                />
              </View>
              <IconButton
                icon="close"
                size={24}
                iconColor={DesignSystem.colors.text.secondary}
                onPress={handleClose}
                style={styles.closeButton}
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Order Placed Successfully!</Text>
              <Text style={styles.subtitle}>
                Your order has been confirmed and is being prepared
              </Text>
              
              <View style={styles.orderIdContainer}>
                <Text style={styles.orderIdLabel}>Order ID</Text>
                <Text style={styles.orderIdValue}>{orderId}</Text>
              </View>

              {/* Order Details */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={20}
                    color={DesignSystem.colors.primary[500]}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailTitle}>Estimated Delivery</Text>
                    <Text style={styles.detailText}>25-30 minutes</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color={DesignSystem.colors.primary[500]}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailTitle}>Real-time Tracking</Text>
                    <Text style={styles.detailText}>Track your order live</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="storefront"
                    size={20}
                    color={DesignSystem.colors.primary[500]}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailTitle}>Restaurant</Text>
                    <Text style={styles.detailText}>Pizza Palace</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={handleViewOrders}
                style={styles.actionButton}
                textColor={DesignSystem.colors.primary[500]}
                icon="format-list-bulleted"
                labelStyle={styles.buttonLabel}
              >
                View Orders
              </Button>
              <Button
                mode="contained"
                onPress={handleTrackOrder}
                style={styles.actionButton}
                buttonColor={DesignSystem.colors.primary[500]}
                icon="map-marker-path"
                labelStyle={styles.buttonLabel}
              >
                Track Order
              </Button>
            </View>
          </Surface>
        </Animated.View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: DesignSystem.spacing.lg,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 400,
  },
  dialog: {
    borderRadius: DesignSystem.borderRadius.xl,
    ...DesignSystem.shadows.xl,
    backgroundColor: DesignSystem.colors.background.primary,
    overflow: 'hidden',
  },
  header: {
    ...GlobalStyles.layout.rowSpaceBetween,
    padding: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.tertiary,
  },
  successIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    margin: 0,
  },
  content: {
    padding: DesignSystem.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: DesignSystem.typography.fontSize['2xl'],
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  subtitle: {
    fontSize: DesignSystem.typography.fontSize.base,
    color: DesignSystem.colors.text.secondary,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.lg,
    lineHeight: DesignSystem.typography.fontSize.base * 1.4,
  },
  orderIdContainer: {
    backgroundColor: DesignSystem.colors.primary[50],
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.md,
    marginBottom: DesignSystem.spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.xs,
  },
  orderIdValue: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.primary[500],
  },
  detailsContainer: {
    width: '100%',
    gap: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing.lg,
  },
  detailItem: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    gap: DesignSystem.spacing.md,
    padding: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.background.secondary,
    borderRadius: DesignSystem.borderRadius.md,
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.primary,
    marginBottom: 2,
  },
  detailText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
  },
  actionButtons: {
    ...GlobalStyles.layout.row,
    padding: DesignSystem.spacing.lg,
    paddingTop: 0,
    gap: DesignSystem.spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: DesignSystem.borderRadius.md,
    paddingVertical: DesignSystem.spacing.sm,
  },
  buttonLabel: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
});
