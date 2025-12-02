import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';
import { addressTypes } from '../../addressFormData';
import { MapLocation } from '../../addressFormData';

interface AddressTypeSelectionProps {
  selectedAddressType: string;
  onAddressTypeSelect: (typeId: string) => void;
  selectedLocation: MapLocation | null;
}

export default function AddressTypeSelection({
  selectedAddressType,
  onAddressTypeSelect,
  selectedLocation,
}: AddressTypeSelectionProps) {
  return (
    <View style={styles.addressTypeContainer}>
      <Text style={[GlobalStyles.typography.h6, styles.sectionTitle]}>Select Address Type</Text>
      <View style={styles.addressTypeOptions}>
        {addressTypes.map((type) => (
          <Pressable
            key={type.id}
            style={[
              styles.addressTypeOption,
              selectedAddressType === type.id && styles.selectedAddressTypeOption
            ]}
            onPress={() => onAddressTypeSelect(type.id)}
          >
            <View style={[
              styles.addressTypeIcon,
              selectedAddressType === type.id ? styles.selectedAddressTypeIcon : styles.unselectedAddressTypeIcon
            ]}>
              <MaterialIcons 
                name={type.icon as any} 
                size={DesignSystem.sizes.icon.md} 
                color={selectedAddressType === type.id ? '#FFFFFF' : '#666666'} 
              />
            </View>
            <Text style={[
              GlobalStyles.typography.body1,
              styles.addressTypeText,
              selectedAddressType === type.id && styles.selectedAddressTypeText
            ]}>
              {type.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Location Status Indicator */}
      <View style={styles.locationStatusContainer}>
        <MaterialIcons 
          name={selectedLocation ? "location-on" : "location-off"} 
          size={DesignSystem.sizes.icon.sm} 
          color={selectedLocation ? DesignSystem.colors.success : DesignSystem.colors.text.secondary} 
        />
        <Text style={[
          GlobalStyles.typography.caption,
          styles.locationStatusText,
          { color: selectedLocation ? DesignSystem.colors.success : DesignSystem.colors.text.secondary }
        ]}>
          {selectedLocation ? 'Location selected on map' : 'Please select location on map first'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addressTypeContainer: {
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionTitle: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  addressTypeOptions: {
    ...GlobalStyles.layout.row,
    justifyContent: 'space-between',
    gap: DesignSystem.spacing.sm,
  },
  addressTypeOption: {
    flex: 1,
    ...GlobalStyles.layout.columnCenter,
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.sm,
    borderRadius: 15, // Curved border
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: DesignSystem.colors.border.light,
    minHeight: 80,
  },
  selectedAddressTypeOption: {
    borderColor: DesignSystem.colors.primary[500],
    backgroundColor: 'transparent',
    elevation: 2,
    shadowColor: DesignSystem.colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressTypeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    ...GlobalStyles.layout.rowCenter,
    marginBottom: DesignSystem.spacing.sm,
    backgroundColor: 'transparent',
  },
  selectedAddressTypeIcon: {
    backgroundColor: '#007AFF', // Use explicit blue color
  },
  unselectedAddressTypeIcon: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0', // Use explicit light gray
  },
  addressTypeText: {
    color: DesignSystem.colors.text.primary,
    textAlign: 'center',
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  selectedAddressTypeText: {
    color: DesignSystem.colors.primary[700],
    fontWeight: DesignSystem.typography.fontWeight.bold,
    fontSize: DesignSystem.typography.fontSize.base,
  },
  locationStatusContainer: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    marginTop: DesignSystem.spacing.md,
    padding: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: DesignSystem.borderRadius.sm,
    gap: DesignSystem.spacing.xs,
  },
  locationStatusText: {
    flex: 1,
  },
});
