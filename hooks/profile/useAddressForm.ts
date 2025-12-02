import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { useAddressStore } from '../../store/addressStore';
import {
  AddressFormData,
  MapLocation,
  FormValidation,
  defaultFormData,
  defaultValidation,
  validateForm,
  isFormValid,
  getStateForCity,
  searchAddresses,
  AddressSuggestion,
} from '../../app/profile/addressFormData';
import { GOOGLE_MAPS_API_KEY, DEFAULT_MAP_REGION } from '../../config/maps';

export function useAddressForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditMode = params.mode === 'edit';
  const isSelectionMode = params.selectionMode === 'true';
  
  // Address store
  const { addAddress, updateAddress, getAddressById } = useAddressStore();

  // State management
  const [formData, setFormData] = useState<AddressFormData>(defaultFormData);
  const [validation, setValidation] = useState<FormValidation>(defaultValidation);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  // Search and map states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapRegion, setMapRegion] = useState(DEFAULT_MAP_REGION);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Load address data if editing
    if (isEditMode && params.addressId) {
      loadAddressData(params.addressId as string);
    } else if (!isEditMode) {
      // Only request location permission and get current location for new addresses
      requestLocationPermission();
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [isEditMode, params.addressId]);

  // Validate form whenever form data or selected location changes
  useEffect(() => {
    validateFormData(formData);
  }, [formData, selectedLocation]);

  const loadAddressData = (addressId: string) => {
    const address = getAddressById(addressId);
    if (address) {
      const addressFormData: AddressFormData = {
        title: address.title,
        full_name: address.full_name,
        phone_number: address.phone_number,
        address_type: address.address_type === 'restaurant' ? 'other' : address.address_type,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        landmark: address.landmark || '',
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        latitude: address.latitude,
        longitude: address.longitude,
        is_default: address.is_default,
      };
      
      setFormData(addressFormData);
      validateFormData(addressFormData);
      
      // Set selected location for map
      const locationAddress = `${address.address_line1}, ${address.city}, ${address.state} ${address.postal_code}`;
      if (address.latitude && address.longitude) {
        setSelectedLocation({
          latitude: address.latitude,
          longitude: address.longitude,
          address: locationAddress,
          city: address.city,
          state: address.state,
          pincode: address.postal_code,
          area: address.address_line2 || '',
        });
      }
      
      // Set search query to show the existing address
      setSearchQuery(locationAddress);
      
      // Update map region
      if (address.latitude && address.longitude) {
        setMapRegion({
          latitude: address.latitude,
          longitude: address.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    }
  };

  const validateFormData = (data: AddressFormData) => {
    const newValidation = validateForm(data, selectedLocation);
    setValidation(newValidation);
  };

  // Debounced validation to prevent immediate validation on prefilled data
  const debouncedValidateFormData = (data: AddressFormData) => {
    setTimeout(() => {
      const newValidation = validateForm(data, selectedLocation);
      setValidation(newValidation);
    }, 500); // 500ms delay
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Auto-fill state when city changes
    if (field === 'city' && typeof value === 'string') {
      const state = getStateForCity(value);
      if (state) {
        newFormData.state = state;
        setFormData(newFormData);
      }
    }
    
    validateFormData(newFormData);
  };

  const handleAddressTypeSelect = (typeId: string) => {
    const typeMap = {
      'home': 'Home',
      'work': 'Work', 
      'other': 'Other'
    };
    
    setFormData(prev => ({ 
      ...prev, 
      address_type: typeId as 'home' | 'work' | 'other',
      title: typeMap[typeId as keyof typeof typeMap] || 'Address'
    }));
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted' && !isEditMode) {
        await getCurrentLocation();
      }
    } catch (error) {
      console.error('Location permission error:', error);
    }
  };

  const getCurrentLocation = async () => {
    // Don't fetch current location in edit mode
    if (isEditMode) {
      return;
    }
    
    try {
      setIsMapLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const currentLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setMapRegion({
        ...currentLoc,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      // Get detailed address for current location
      const addressData = await getDetailedAddressFromCoordinates(currentLoc.latitude, currentLoc.longitude);
      
      setSelectedLocation({
        latitude: currentLoc.latitude,
        longitude: currentLoc.longitude,
        address: addressData.formattedAddress,
        city: addressData.city || '',
        state: addressData.state || '',
        pincode: addressData.pincode || '',
        area: addressData.locality || '',
      });
      
      // Auto-fill all form fields with current location data
      const newFormData = {
        ...formData,
        title: formData.title || generateAddressTitle(addressData, formData.address_type),
        full_name: formData.full_name || '', // Keep existing or leave empty for user to fill
        phone_number: formData.phone_number || '', // Keep existing or leave empty for user to fill
        address_line1: addressData.building || addressData.locality || '',
        address_line2: addressData.locality || '',
        city: addressData.city || '',
        state: addressData.state || '',
        postal_code: addressData.pincode || '',
        landmark: formData.landmark || '', // Keep existing landmark
      };
      setFormData(newFormData);
      
      // Use debounced validation for prefilled data
      debouncedValidateFormData(newFormData);
      
    } catch (error) {
      console.error('Current location error:', error);
    } finally {
      setIsMapLoading(false);
    }
  };

  // Generate a smart title based on address data
  const generateAddressTitle = (addressData: any, addressType: string = 'home') => {
    if (addressData.city) {
      const cityName = addressData.city;
      const typeMap = {
        'home': 'Home',
        'work': 'Work',
        'other': 'Address'
      };
      return `${typeMap[addressType as keyof typeof typeMap] || 'Address'} - ${cityName}`;
    }
    return 'Home';
  };

  const getDetailedAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}&result_type=street_address|route|locality|administrative_area_level_1|postal_code`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        
        let building = '';
        let locality = '';
        let city = '';
        let state = '';
        let pincode = '';
        let country = '';
        
        // Parse address components with better logic
        addressComponents.forEach((component: any) => {
          const types = component.types;
          
          if (types.includes('street_number') || types.includes('premise')) {
            building = component.long_name;
          } else if (types.includes('route') || types.includes('sublocality_level_1')) {
            locality = component.long_name;
          } else if (types.includes('locality')) {
            // Prioritize locality over administrative_area_level_2 for city
            city = component.long_name;
          } else if (types.includes('administrative_area_level_2') && !city) {
            // Only use administrative_area_level_2 if locality is not available
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (types.includes('postal_code')) {
            pincode = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
          }
        });
        
        // If we don't have a building number, try to use the first part of the route
        if (!building && locality) {
          building = locality;
          locality = '';
        }
        
        // If we still don't have a building, use the formatted address as fallback
        if (!building && !locality) {
          const addressParts = result.formatted_address.split(',');
          if (addressParts.length > 0) {
            building = addressParts[0].trim();
          }
        }
        
        // Additional parsing for Mumbai specifically
        if (result.formatted_address.toLowerCase().includes('mumbai')) {
          city = 'Mumbai';
        }
        
        return {
          formattedAddress: result.formatted_address,
          building,
          locality,
          city,
          state,
          pincode,
          country,
        };
      }
      
      return {
        formattedAddress: 'Unknown location',
        building: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
      };
    } catch (error) {
      console.error('Detailed geocoding error:', error);
      return {
        formattedAddress: 'Unknown location',
        building: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
      };
    }
  };

  const handleMapPress = async (event: any) => {
    const coordinates = event.nativeEvent.coordinate;
    
    try {
      setIsMapLoading(true);
      
      // Get detailed address information using Google Geocoding API
      const addressData = await getDetailedAddressFromCoordinates(coordinates.latitude, coordinates.longitude);
      
      setSelectedLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address: addressData.formattedAddress,
        city: addressData.city || '',
        state: addressData.state || '',
        pincode: addressData.pincode || '',
        area: addressData.locality || '',
      });
      
      // Update map region to center on selected location
      setMapRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      // Auto-fill all form fields with parsed address data
      const newFormData = {
        ...formData,
        title: formData.title || generateAddressTitle(addressData, formData.address_type),
        full_name: formData.full_name || '', // Keep existing or leave empty for user to fill
        phone_number: formData.phone_number || '', // Keep existing or leave empty for user to fill
        address_line1: addressData.building || addressData.locality || '',
        address_line2: addressData.locality || '',
        city: addressData.city || '',
        state: addressData.state || '',
        postal_code: addressData.pincode || '',
        landmark: formData.landmark || '', // Keep existing landmark
      };
      setFormData(newFormData);
      
      // Use debounced validation for prefilled data
      debouncedValidateFormData(newFormData);
      
    } catch (error) {
      console.error('Error getting address details:', error);
    } finally {
      setIsMapLoading(false);
    }
  };

  const handleMapRegionChange = (region: any) => {
    // Only update region if it's a significant change to prevent shaking
    const currentRegion = mapRegion;
    const latDiff = Math.abs(region.latitude - currentRegion.latitude);
    const lngDiff = Math.abs(region.longitude - currentRegion.longitude);
    const latDeltaDiff = Math.abs(region.latitudeDelta - currentRegion.latitudeDelta);
    const lngDeltaDiff = Math.abs(region.longitudeDelta - currentRegion.longitudeDelta);
    
    // Only update if change is significant (more than 0.001 degrees)
    if (latDiff > 0.001 || lngDiff > 0.001 || latDeltaDiff > 0.001 || lngDeltaDiff > 0.001) {
      setMapRegion(region);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (query.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce search to prevent too many API calls
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Use Google Places API for real-time search
        const results = await searchGooglePlaces(query);
        if (results.length > 0) {
          setSearchSuggestions(results);
          setShowSuggestions(true);
        } else {
          // Fallback to local search if no Google results
          const fallbackResults = await searchAddresses(query);
          setSearchSuggestions(fallbackResults);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to local search if API fails
        const fallbackResults = await searchAddresses(query);
        setSearchSuggestions(fallbackResults);
        setShowSuggestions(true);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce
    
    setSearchTimeout(timeout);
  };

  const searchGooglePlaces = async (query: string): Promise<AddressSuggestion[]> => {
    try {
      // Simple Google Places API call
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&components=country:in&types=geocode&language=en`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.predictions) {
        return data.predictions.map((prediction: any, index: number) => ({
          id: `google_${index}`,
          name: prediction.structured_formatting?.main_text || prediction.description,
          address: prediction.description,
          coordinates: { latitude: 0, longitude: 0 }, // Will be filled when selected
          city: '',
          state: '',
          pincode: '',
          placeId: prediction.place_id, // Store place ID for detailed info
        }));
      } else {
        console.error('Google Places API Error:', data.status, data.error_message);
        return [];
      }
    } catch (error) {
      console.error('Google Places API error:', error);
      return [];
    }
  };

  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    try {
      setIsMapLoading(true);
      setSearchQuery(suggestion.address);
      setShowSuggestions(false);
      
      let coordinates = { latitude: 0, longitude: 0 };
      let addressData = {
        formattedAddress: suggestion.address,
        building: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
      };
      
      // If we have a place ID, use Google Places Details API for more accurate data
      if (suggestion.placeId) {
        try {
          const detailsResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.placeId}&fields=geometry,address_components,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
          );
          const detailsData = await detailsResponse.json();
          
          if (detailsData.result) {
            const result = detailsData.result;
            coordinates = {
              latitude: result.geometry.location.lat,
              longitude: result.geometry.location.lng,
            };
            
            // Parse detailed address components
            const addressComponents = result.address_components;
            let building = '';
            let locality = '';
            let city = '';
            let state = '';
            let pincode = '';
            let country = '';
            
            addressComponents.forEach((component: any) => {
              const types = component.types;
              
              if (types.includes('street_number') || types.includes('premise')) {
                building = component.long_name;
              } else if (types.includes('route') || types.includes('sublocality_level_1')) {
                locality = component.long_name;
              } else if (types.includes('locality')) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_2') && !city) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                state = component.long_name;
              } else if (types.includes('postal_code')) {
                pincode = component.long_name;
              } else if (types.includes('country')) {
                country = component.long_name;
              }
            });
            
            addressData = {
              formattedAddress: result.formatted_address,
              building,
              locality,
              city,
              state,
              pincode,
              country,
            };
          }
        } catch (detailsError) {
          console.error('Places Details API error:', detailsError);
          // Fallback to geocoding
          const geocodeResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(suggestion.address)}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const geocodeData = await geocodeResponse.json();
          
          if (geocodeData.results && geocodeData.results.length > 0) {
            const result = geocodeData.results[0];
            coordinates = {
              latitude: result.geometry.location.lat,
              longitude: result.geometry.location.lng,
            };
            addressData = await getDetailedAddressFromCoordinates(coordinates.latitude, coordinates.longitude);
          }
        }
      } else {
        // Fallback to geocoding if no place ID
        const geocodeResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(suggestion.address)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.results && geocodeData.results.length > 0) {
          const result = geocodeData.results[0];
          coordinates = {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          };
          addressData = await getDetailedAddressFromCoordinates(coordinates.latitude, coordinates.longitude);
        }
      }
      
      setSelectedLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address: addressData.formattedAddress,
        city: addressData.city || '',
        state: addressData.state || '',
        pincode: addressData.pincode || '',
        area: addressData.locality || '',
      });
      
      setMapRegion({
        ...coordinates,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      // Auto-fill all form fields with parsed address data
      const newFormData = {
        ...formData,
        title: formData.title || generateAddressTitle(addressData, formData.address_type),
        full_name: formData.full_name || '', // Keep existing or leave empty for user to fill
        phone_number: formData.phone_number || '', // Keep existing or leave empty for user to fill
        address_line1: addressData.building || addressData.locality || '',
        address_line2: addressData.locality || '',
        city: addressData.city || '',
        state: addressData.state || '',
        postal_code: addressData.pincode || '',
        landmark: formData.landmark || '', // Keep existing landmark
      };
      setFormData(newFormData);
      
      // Use debounced validation for prefilled data
      debouncedValidateFormData(newFormData);
      
    } catch (error) {
      console.error('Suggestion selection error:', error);
    } finally {
      setIsMapLoading(false);
    }
  };

  const handleSaveAddress = () => {
    if (!isFormValid(validation)) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    if (!selectedLocation) {
      Alert.alert('Location Required', 'Please select a location on the map.');
      return;
    }
    
    setShowSaveDialog(true);
  };

  const confirmSaveAddress = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Location is required to save address.');
      return;
    }

    try {
      // Prepare address data for store
      const addressData = {
        title: formData.title,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address_type: formData.address_type as 'home' | 'work' | 'restaurant' | 'other',
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        is_default: formData.is_default,
      };

      if (isEditMode && params.addressId) {
        // Update existing address
        await updateAddress(params.addressId as string, addressData);
        Alert.alert(
          'Success', 
          'Address updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (isSelectionMode) {
                  router.push('/profile/addresses?mode=select');
                } else {
                  router.back();
                }
              },
            },
          ]
        );
      } else {
        // Add new address
        await addAddress(addressData);
        Alert.alert(
          'Success', 
          'Address saved successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (isSelectionMode) {
                  router.push('/profile/addresses?mode=select');
                } else {
                  router.back();
                }
              },
            },
          ]
        );
      }
      
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }
  };

  return {
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
    isFormValid: isFormValid(validation),
    
    // Dialog actions
    setShowSaveDialog,
  };
}
