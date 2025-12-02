import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { getAddressTypeIcon, getAddressTypeColor } from '../../app/profile/addressData';
import { useAddressStore, Address } from '../../store/addressStore';

interface AddressSelectorProps {
  onAddressSelect: (address: Address) => void;
  selectedAddress?: Address | null;
  onAddNewAddress: () => void;
}

export default function AddressSelector({ 
  onAddressSelect, 
  selectedAddress, 
  onAddNewAddress 
}: AddressSelectorProps) {
  const { addresses, fetchAddresses } = useAddressStore();
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  // Fetch addresses when component mounts
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddressPress = (address: Address) => {
    onAddressSelect(address);
    setShowAllAddresses(false);
  };

  const handleAddNewAddress = () => {
    onAddNewAddress();
  };

  const renderAddressCard = (address: Address, isSelected: boolean = false) => (
    <Pressable
      key={address.address_id}
      style={[
        styles.addressCard,
        isSelected && styles.selectedAddressCard
      ]}
      onPress={() => handleAddressPress(address)}
    >
      <Surface style={[
        styles.addressSurface,
        isSelected && styles.selectedAddressSurface
      ]}>
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeSection}>
            <View style={[
              styles.typeIconContainer, 
              { backgroundColor: getAddressTypeColor(address.address_type) }
            ]}>
              <MaterialIcons
                name={getAddressTypeIcon(address.address_type)}
                size={16}
                color="white"
              />
            </View>
            <View style={styles.addressTypeInfo}>
              <Text style={styles.addressTypeName}>
                {address.title}
              </Text>
              {address.is_default && (
                <Chip
                  mode="flat"
                  compact
                  style={styles.defaultChip}
                  textStyle={styles.defaultChipText}
                >
                  Default
                </Chip>
              )}
            </View>
          </View>
          
          {isSelected && (
            <IconButton
              icon="check-circle"
              size={20}
              iconColor={DesignSystem.colors.primary[500]}
            />
          )}
        </View>
        
        <View style={styles.addressContent}>
          <Text style={styles.addressText}>
            {`${address.address_line1}, ${address.city}, ${address.postal_code}`}
          </Text>
          
          <View style={styles.statusContainer}>
            <Chip
              mode="flat"
              compact
              style={styles.statusChip}
              textStyle={styles.statusChipText}
              icon="check-circle"
            >
              Available for delivery
            </Chip>
          </View>
        </View>
      </Surface>
    </Pressable>
  );

  const renderQuickAddresses = () => {
    const quickAddresses = addresses.slice(0, 2);
    
    return (
      <View style={styles.quickAddressesContainer}>
        <Text style={styles.sectionTitle}>Quick Select</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickAddressesScroll}
        >
          {quickAddresses.map((address) => 
            renderAddressCard(address, selectedAddress?.address_id === address.address_id)
          )}
        </ScrollView>
      </View>
    );
  };

  const renderAllAddresses = () => {
    if (!showAllAddresses) return null;

    return (
      <View style={styles.allAddressesContainer}>
        <View style={styles.allAddressesHeader}>
          <Text style={styles.sectionTitle}>All Addresses</Text>
          <Button
            mode="text"
            onPress={() => setShowAllAddresses(false)}
            textColor={DesignSystem.colors.text.secondary}
            compact
          >
            Close
          </Button>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.allAddressesScroll}
        >
          {addresses.map((address) => 
            renderAddressCard(address, selectedAddress?.address_id === address.address_id)
          )}
        </ScrollView>
      </View>
    );
  };

  const renderSelectedAddress = () => {
    if (!selectedAddress) return null;

    return (
      <View style={styles.selectedAddressContainer}>
        <View style={styles.selectedAddressHeader}>
          <Text style={styles.sectionTitle}>Selected Address</Text>
          <Button
            mode="text"
            onPress={() => setShowAllAddresses(true)}
            textColor={DesignSystem.colors.primary[500]}
            compact
          >
            Change
          </Button>
        </View>
        
        {renderAddressCard(selectedAddress, true)}
      </View>
    );
  };

  const renderNoAddressState = () => (
    <View style={styles.noAddressContainer}>
      <MaterialCommunityIcons
        name="map-marker-off"
        size={48}
        color={DesignSystem.colors.neutral[400]}
      />
      <Text style={styles.noAddressTitle}>No Address Selected</Text>
      <Text style={styles.noAddressSubtitle}>
        Select a delivery address to continue with your order
      </Text>
      <Button
        mode="contained"
        onPress={handleAddNewAddress}
        style={styles.addAddressButton}
        buttonColor={DesignSystem.colors.primary[500]}
        icon="plus"
      >
        Add New Address
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      {!selectedAddress ? (
        <>
          {addresses.length > 0 ? (
            <>
              {renderQuickAddresses()}
              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setShowAllAddresses(true)}
                  style={styles.viewAllButton}
                  textColor={DesignSystem.colors.primary[500]}
                  icon="map-marker-multiple"
                >
                  View All Addresses
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAddNewAddress}
                  style={styles.addNewButton}
                  buttonColor={DesignSystem.colors.primary[500]}
                  icon="plus"
                >
                  Add New
                </Button>
              </View>
            </>
          ) : (
            renderNoAddressState()
          )}
        </>
      ) : (
        renderSelectedAddress()
      )}
      
      {renderAllAddresses()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Section Headers
  sectionTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
  },
  
  // Quick Addresses
  quickAddressesContainer: {
    marginBottom: DesignSystem.spacing.md,
  },
  quickAddressesScroll: {
    paddingRight: DesignSystem.spacing.md,
  },
  
  // All Addresses
  allAddressesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: DesignSystem.colors.background.primary,
    zIndex: DesignSystem.zIndex.modal,
  },
  allAddressesHeader: {
    ...GlobalStyles.layout.rowSpaceBetween,
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.border.light,
  },
  allAddressesScroll: {
    padding: DesignSystem.spacing.md,
  },
  
  // Selected Address
  selectedAddressContainer: {
    marginBottom: DesignSystem.spacing.md,
  },
  selectedAddressHeader: {
    ...GlobalStyles.layout.rowSpaceBetween,
    marginBottom: DesignSystem.spacing.sm,
  },
  
  // Address Cards
  addressCard: {
    marginRight: DesignSystem.spacing.sm,
    marginBottom: DesignSystem.spacing.sm,
  },
  selectedAddressCard: {
    // Additional styles for selected state
  },
  addressSurface: {
    borderRadius: DesignSystem.borderRadius.lg,
    ...DesignSystem.shadows.sm,
    backgroundColor: DesignSystem.colors.background.primary,
    minWidth: 280,
  },
  selectedAddressSurface: {
    borderWidth: 2,
    borderColor: DesignSystem.colors.primary[500],
    ...DesignSystem.shadows.md,
  },
  
  // Address Header
  addressHeader: {
    ...GlobalStyles.layout.rowSpaceBetween,
    padding: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.tertiary,
  },
  addressTypeSection: {
    ...GlobalStyles.layout.row,
    flex: 1,
  },
  typeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    ...GlobalStyles.layout.rowCenter,
    marginRight: DesignSystem.spacing.sm,
  },
  addressTypeInfo: {
    flex: 1,
  },
  addressTypeName: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  defaultChip: {
    backgroundColor: DesignSystem.colors.warning,
    alignSelf: 'flex-start',
  },
  defaultChipText: {
    color: 'white',
    fontSize: DesignSystem.typography.fontSize.xs,
  },
  
  // Address Content
  addressContent: {
    padding: DesignSystem.spacing.md,
  },
  addressText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    lineHeight: DesignSystem.typography.fontSize.sm * DesignSystem.typography.lineHeight.normal,
    marginBottom: DesignSystem.spacing.sm,
  },
  statusContainer: {
    ...GlobalStyles.layout.row,
  },
  statusChip: {
    backgroundColor: DesignSystem.colors.success,
  },
  statusChipText: {
    color: 'white',
    fontSize: DesignSystem.typography.fontSize.xs,
  },
  warningChip: {
    backgroundColor: DesignSystem.colors.warning,
  },
  warningChipText: {
    color: 'white',
  },
  
  // Action Buttons
  actionButtons: {
    ...GlobalStyles.layout.row,
    gap: DesignSystem.spacing.sm,
  },
  viewAllButton: {
    flex: 1,
    borderColor: DesignSystem.colors.primary[500],
  },
  addNewButton: {
    flex: 1,
  },
  
  // No Address State
  noAddressContainer: {
    ...GlobalStyles.layout.columnCenter,
    padding: DesignSystem.spacing['2xl'],
  },
  noAddressTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginTop: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing.sm,
  },
  noAddressSubtitle: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    textAlign: 'center',
    lineHeight: DesignSystem.typography.fontSize.sm * DesignSystem.typography.lineHeight.normal,
    marginBottom: DesignSystem.spacing.lg,
  },
  addAddressButton: {
    borderRadius: DesignSystem.borderRadius.md,
  },
});
