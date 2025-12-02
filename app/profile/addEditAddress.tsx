import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { useAddressForm } from '../../hooks/profile/useAddressForm';
import {
  AddressHeader,
  LocationSearch,
  MapContainer,
  AddressTypeSelection,
  AddressForm,
  ActionButtons,
  SaveConfirmationDialog,
} from '../../components/profile/address';

export default function AddEditAddressScreen() {
  const router = useRouter();
  const {
    // State
    formData,
    validation,
    searchQuery,
    showSuggestions,
    searchSuggestions,
    selectedLocation,
    mapRegion,
    locationPermission,
    isMapLoading,
    showSaveDialog,
    isEditMode,
    
    // Actions
    handleInputChange,
    handleAddressTypeSelect,
    handleSearch,
    handleSuggestionSelect,
    handleMapPress,
    handleMapRegionChange,
    handleSaveAddress,
    confirmSaveAddress,
    getCurrentLocation,
    
    // Computed
    isFormValid,
    
    // Dialog actions
    setShowSaveDialog,
  } = useAddressForm();

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      // Navigate back to addresses screen
      router.back();
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [router]);

  return (
    <SafeAreaView style={[GlobalStyles.layout.container, styles.container]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <AddressHeader />
        
        {/* Content */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Location Search */}
          <LocationSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            showSuggestions={showSuggestions}
            searchSuggestions={searchSuggestions}
            onSuggestionSelect={handleSuggestionSelect}
          />
          
          {/* Map Container */}
          <MapContainer
            mapRegion={mapRegion}
            onMapPress={handleMapPress}
            onRegionChangeComplete={handleMapRegionChange}
            selectedLocation={selectedLocation}
            locationPermission={locationPermission}
            isMapLoading={isMapLoading}
            onGetCurrentLocation={getCurrentLocation}
          />
          
          {/* Address Type Selection */}
          <AddressTypeSelection
            selectedAddressType={formData.address_type}
            onAddressTypeSelect={handleAddressTypeSelect}
            selectedLocation={selectedLocation}
          />
          
          {/* Address Form */}
          <AddressForm
            formData={formData}
            validation={validation}
            onInputChange={handleInputChange}
          />
        </ScrollView>
        
        {/* Action Buttons - Fixed at bottom */}
        <View style={styles.actionButtonsContainer}>
          <ActionButtons
            isEditMode={isEditMode}
            isFormValid={isFormValid}
            onSaveAddress={handleSaveAddress}
          />
        </View>
      
      {/* Save Confirmation Dialog */}
        <SaveConfirmationDialog
        visible={showSaveDialog}
          isEditMode={isEditMode}
          onCancel={() => setShowSaveDialog(false)}
          onConfirm={confirmSaveAddress}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignSystem.colors.background.primary,
  },
  
  // Keyboard Avoidance
  keyboardView: {
    flex: 1,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
    padding: DesignSystem.spacing.md,
  },
  scrollContent: {
    paddingBottom: DesignSystem.spacing.xl,
  },
  actionButtonsContainer: {
    backgroundColor: DesignSystem.colors.background.primary,
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingTop: DesignSystem.spacing.md,
    paddingBottom: DesignSystem.spacing.lg, // Add proper bottom padding
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.border.light,
    elevation: 8,
    shadowColor: DesignSystem.colors.text.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
}); 