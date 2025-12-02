import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, Button, IconButton, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';
import {
  getAddressTypeIcon,
  getAddressTypeColor,
  getAddressTypeName,
} from '../../addressData';

interface AddressCardProps {
  address: any;
  onEdit: (address: any) => void;
  onDelete: (address: any) => void;
  onSetDefault: (address: any) => void;
  onSelect?: (address: any) => void;
  isSelectionMode?: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  onSelect,
  isSelectionMode = false,
}: AddressCardProps) {
  const handleCardPress = () => {
    if (isSelectionMode && onSelect) {
      onSelect(address);
    } else if (!isSelectionMode) {
      onEdit(address);
    }
  };

  return (
    <View style={styles.addressCard}>
      <Pressable onPress={handleCardPress}>
        <Surface style={[
          GlobalStyles.components.card, 
          styles.addressSurface,
          isSelectionMode && styles.selectableCard
        ]}>
        {/* Address Header */}
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeSection}>
            <View style={[styles.typeIconContainer, { backgroundColor: getAddressTypeColor(address.address_type) }]}>
              <MaterialIcons
                name={getAddressTypeIcon(address.address_type)}
                size={DesignSystem.sizes.icon.sm}
                color="white"
              />
            </View>
            <View style={styles.addressTypeInfo}>
              <Text style={[GlobalStyles.typography.h6, styles.addressTypeName]}>
                {getAddressTypeName(address.address_type)}
              </Text>
              {address.is_default && (
                <Chip 
                  mode="flat" 
                  textStyle={styles.defaultChipText}
                  style={styles.defaultChip}
                  icon="star"
                >
                  Default
                </Chip>
              )}
            </View>
          </View>
          
          {!isSelectionMode && (
            <View style={styles.addressActions}>
              <IconButton
                icon="pencil"
                size={DesignSystem.sizes.icon.sm}
                iconColor={DesignSystem.colors.text.secondary}
                onPress={() => onEdit(address)}
                style={styles.actionIcon}
              />
              <IconButton
                icon="delete"
                size={DesignSystem.sizes.icon.sm}
                iconColor={DesignSystem.colors.error}
                onPress={() => onDelete(address)}
                style={styles.actionIcon}
              />
            </View>
          )}
        </View>
        
        {/* Address Content */}
        <View style={styles.addressContent}>
          <Text style={[GlobalStyles.typography.body1, styles.addressName]}>{address.full_name}</Text>
          <Text style={[GlobalStyles.typography.body2, styles.addressText]}>
            {address.address_line1}{address.address_line2 ? `, ${address.address_line2}` : ''}, {address.city}, {address.state} {address.postal_code}
          </Text>
          
          {/* Status Indicators */}
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <MaterialIcons
                name="check-circle"
                size={DesignSystem.sizes.icon.xs}
                color={DesignSystem.colors.success}
              />
              <Text style={styles.statusText}>In delivery area</Text>
            </View>
            
            {address.landmark && (
              <View style={styles.statusItem}>
                <MaterialIcons
                  name="location-on"
                  size={DesignSystem.sizes.icon.xs}
                  color={DesignSystem.colors.info}
                />
                <Text style={styles.statusText}>Near {address.landmark}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Action Buttons - Only show in management mode */}
        {!isSelectionMode && (
          <View style={styles.cardActions}>
            {!address.is_default && (
              <Button
                mode="outlined"
                onPress={() => onSetDefault(address)}
                icon="star"
                style={styles.actionButton}
                labelStyle={styles.actionButtonLabel}
                compact
              >
                Set as Default
              </Button>
            )}
          </View>
        )}
        
        {/* Selection indicator */}
        {isSelectionMode && (
          <View style={styles.selectionIndicator}>
            <MaterialIcons 
              name="check-circle" 
              size={20} 
              color={DesignSystem.colors.primary[500]} 
            />
            <Text style={styles.selectionText}>Tap to select</Text>
          </View>
        )}
        </Surface>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addressCard: {
    marginBottom: DesignSystem.spacing.md,
  },
  addressSurface: {
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressHeader: {
    ...GlobalStyles.layout.rowSpaceBetween,
    alignItems: 'flex-start',
    marginBottom: DesignSystem.spacing.sm,
  },
  addressTypeSection: {
    ...GlobalStyles.layout.row,
    flex: 1,
    alignItems: 'center',
  },
  typeIconContainer: {
    width: DesignSystem.sizes.avatar.md,
    height: DesignSystem.sizes.avatar.md,
    borderRadius: DesignSystem.borderRadius.full,
    ...GlobalStyles.layout.rowCenter,
    marginRight: DesignSystem.spacing.sm,
  },
  addressTypeInfo: {
    flex: 1,
  },
  addressTypeName: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  defaultChip: {
    backgroundColor: DesignSystem.colors.warning + '20',
    alignSelf: 'flex-start',
  },
  defaultChipText: {
    color: DesignSystem.colors.warning,
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  addressActions: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: DesignSystem.spacing.xs,
  },
  addressContent: {
    marginBottom: DesignSystem.spacing.sm,
  },
  addressName: {
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    marginBottom: DesignSystem.spacing.xs,
  },
  addressText: {
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.sm,
    lineHeight: DesignSystem.typography.lineHeight.normal * DesignSystem.typography.fontSize.sm,
  },
  statusContainer: {
    ...GlobalStyles.layout.row,
    flexWrap: 'wrap',
    gap: DesignSystem.spacing.sm,
  },
  statusItem: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.neutral[100],
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: DesignSystem.spacing.xs,
    borderRadius: DesignSystem.borderRadius.full,
  },
  statusText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  cardActions: {
    ...GlobalStyles.layout.row,
    justifyContent: 'center',
    paddingTop: DesignSystem.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.border.light,
  },
  actionButton: {
    borderRadius: DesignSystem.borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: DesignSystem.spacing.lg,
  },
  actionButtonLabel: {
    ...GlobalStyles.typography.button,
    fontSize: DesignSystem.typography.fontSize.sm,
  },
  selectableCard: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectionIndicator: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: DesignSystem.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.border.light,
    gap: DesignSystem.spacing.xs,
  },
  selectionText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
});
