import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { useAddresses } from '../../hooks/profile/useAddresses';
import { useAddressStore } from '../../store/addressStore';
import {
  AddressesHeader,
  AddAddressButton,
  AddressCard,
  EmptyAddressesState,
} from '../../components/profile/address';

export default function AddressesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isSelectionMode = params.mode === 'select';
  
  const { fetchAddresses } = useAddressStore();
  const {
    addresses,
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleSetDefault,
    handleSelectAddress,
    handleHelpPress,
  } = useAddresses(isSelectionMode);

  // Fetch addresses when component mounts
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      // Navigate back to profile screen
      router.back();
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [router]);

  return (
    <SafeAreaView style={[GlobalStyles.layout.container, styles.container]}>
      {/* Header */}
      <AddressesHeader onHelpPress={handleHelpPress} />
      
      {/* Content */}
      <View style={styles.content}>
        {addresses.length === 0 ? (
          <EmptyAddressesState 
            onAddFirstAddress={handleAddAddress} 
            isSelectionMode={isSelectionMode}
          />
        ) : (
          <>
            {/* Add Address Button - Only show when there are addresses */}
            <AddAddressButton onPress={handleAddAddress} />
            
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {addresses.map((address) => (
                <AddressCard
                  key={address.address_id}
                  address={address}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefault}
                  onSelect={isSelectionMode ? handleSelectAddress : undefined}
                  isSelectionMode={isSelectionMode}
                />
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignSystem.colors.background.primary,
  },
  
  // Content Styles
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingBottom: DesignSystem.spacing.lg,
  },
}); 