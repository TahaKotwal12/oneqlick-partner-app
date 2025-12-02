import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import { Text, Surface, Button, IconButton, Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { GOOGLE_MAPS_API_KEY, DEFAULT_MAP_REGION, MAP_CONFIG } from '../../config/maps';

const { width, height } = Dimensions.get('window');

// Map picker props
interface MapPickerProps {
  // Location data
  initialLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  
  // Callbacks
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  onClose: () => void;
  
  // Configuration
  title?: string;
  showSearch?: boolean;
  showCurrentLocation?: boolean;
  allowManualSelection?: boolean;
  markerTitle?: string;
  markerDescription?: string;
  
  // Styling
  height?: number;
  borderRadius?: number;
}

// Address suggestion interface
interface AddressSuggestion {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
}

export default function MapPicker({
  initialLocation,
  onLocationSelect,
  onClose,
  title = 'Select Location',
  showSearch = true,
  showCurrentLocation = true,
  allowManualSelection = true,
  markerTitle = 'Selected Location',
  markerDescription = 'Tap to confirm this location',
  height = Dimensions.get('window').height * 0.7,
  borderRadius = DesignSystem.borderRadius.lg,
}: MapPickerProps) {
  // State
  const [region, setRegion] = useState<Region>(DEFAULT_MAP_REGION);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  // Refs
  const mapRef = useRef<MapView>(null);

  // Initialize component
  useEffect(() => {
    initializeMap();
    requestLocationPermission();
  }, []);

  // Initialize map with initial location or current location
  const initializeMap = async () => {
    if (initialLocation) {
      setRegion({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setSelectedLocation({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
      });
      setSelectedAddress(initialLocation.address || '');
    } else {
      await getCurrentLocation();
    }
  };

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        await getCurrentLocation();
      }
    } catch (error) {
      console.error('Location permission error:', error);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const currentLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(currentLoc);
      setRegion({
        ...currentLoc,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      // Get address for current location
      const address = await getAddressFromCoordinates(currentLoc.latitude, currentLoc.longitude);
      setSelectedAddress(address);
      setSelectedLocation(currentLoc);
    } catch (error) {
      console.error('Current location error:', error);
      Alert.alert('Location Error', 'Unable to get current location. Please select manually.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  };

  // Search for addresses
  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&components=country:in&types=address`
      );
      const data = await response.json();
      
      if (data.predictions) {
        const suggestions: AddressSuggestion[] = data.predictions.map((prediction: any, index: number) => ({
          id: `suggestion_${index}`,
          name: prediction.structured_formatting?.main_text || prediction.description,
          address: prediction.description,
          coordinates: { latitude: 0, longitude: 0 }, // Will be filled when selected
        }));
        
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Address search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    searchAddresses(query);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    try {
      setIsLoading(true);
      setSearchQuery(suggestion.address);
      setShowSuggestions(false);
      
      // Get coordinates for the selected address
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(suggestion.address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const coordinates = {
          latitude: location.lat,
          longitude: location.lng,
        };
        
        setSelectedLocation(coordinates);
        setSelectedAddress(suggestion.address);
        setRegion({
          ...coordinates,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        
        // Animate to the selected location
        mapRef.current?.animateToRegion({
          ...coordinates,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    } catch (error) {
      console.error('Suggestion selection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle map press
  const handleMapPress = async (event: any) => {
    if (!allowManualSelection) return;
    
    const coordinates = event.nativeEvent.coordinate;
    setSelectedLocation(coordinates);
    
    // Get address for the selected location
    const address = await getAddressFromCoordinates(coordinates.latitude, coordinates.longitude);
    setSelectedAddress(address);
  };

  // Handle region change
  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  // Handle confirm location
  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      Alert.alert('No Location Selected', 'Please select a location on the map.');
      return;
    }
    
    onLocationSelect({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: selectedAddress,
    });
  };

  // Handle current location button
  const handleCurrentLocation = () => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
      setRegion({
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      mapRef.current?.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } else {
      getCurrentLocation();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon={() => (
              <MaterialIcons 
                name="arrow-back" 
                size={DesignSystem.sizes.icon.md} 
                color={DesignSystem.colors.text.primary} 
              />
            )}
            onPress={onClose}
            style={styles.backButton}
          />
          <Text style={[GlobalStyles.typography.h4, styles.headerTitle]}>
            {title}
          </Text>
        </View>
        
        <Button
          mode="contained"
          onPress={handleConfirmLocation}
          disabled={!selectedLocation}
          style={styles.confirmButton}
          buttonColor={DesignSystem.colors.primary[500]}
        >
          Confirm
        </Button>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search for address, landmark, or area..."
            onChangeText={handleSearchChange}
            value={searchQuery}
            style={styles.searchBar}
            icon={() => (
              <MaterialIcons
                name="search"
                size={DesignSystem.sizes.icon.sm}
                color={DesignSystem.colors.text.secondary}
              />
            )}
            inputStyle={styles.searchInput}
          />
          
          {/* Search suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <Surface style={styles.suggestionsContainer}>
              {searchSuggestions.map((suggestion) => (
                <Pressable
                  key={suggestion.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(suggestion)}
                >
                  <MaterialIcons 
                    name="location-on" 
                    size={DesignSystem.sizes.icon.sm} 
                    color={DesignSystem.colors.text.secondary} 
                  />
                  <View style={styles.suggestionContent}>
                    <Text style={[GlobalStyles.typography.body1, styles.suggestionName]}>
                      {suggestion.name}
                    </Text>
                    <Text style={[GlobalStyles.typography.body2, styles.suggestionAddress]}>
                      {suggestion.address}
                    </Text>
                  </View>
                  <MaterialIcons 
                    name="arrow-upward" 
                    size={DesignSystem.sizes.icon.xs} 
                    color={DesignSystem.colors.text.secondary} 
                  />
                </Pressable>
              ))}
            </Surface>
          )}
        </View>
      )}

      {/* Map Container */}
      <View style={[styles.mapContainer, { height, borderRadius }]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChange={handleRegionChange}
          onPress={handleMapPress}
          showsUserLocation={showCurrentLocation && locationPermission}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsTraffic={true}
          showsIndoors={true}
          mapType="standard"
        >
          {/* Selected location marker */}
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title={markerTitle}
              description={markerDescription}
            >
              <View style={styles.selectedMarker}>
                <Text style={styles.markerText}>📍</Text>
              </View>
            </Marker>
          )}
        </MapView>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          {showCurrentLocation && (
            <Pressable style={styles.controlButton} onPress={handleCurrentLocation}>
              <MaterialIcons name="my-location" size={20} color="#333" />
            </Pressable>
          )}
        </View>

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={DesignSystem.colors.primary[500]} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </View>

      {/* Selected Location Info */}
      {selectedLocation && (
        <Surface style={styles.locationInfo}>
          <View style={styles.locationHeader}>
            <MaterialIcons 
              name="location-on" 
              size={DesignSystem.sizes.icon.md} 
              color={DesignSystem.colors.primary[500]} 
            />
            <Text style={[GlobalStyles.typography.h6, styles.locationTitle]}>
              Selected Location
            </Text>
          </View>
          <Text style={[GlobalStyles.typography.body2, styles.locationAddress]}>
            {selectedAddress}
          </Text>
          <Text style={[GlobalStyles.typography.caption, styles.locationCoordinates]}>
            {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
          </Text>
        </Surface>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background.secondary,
  },
  
  // Header
  header: {
    ...GlobalStyles.layout.rowSpaceBetween,
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.background.primary,
    ...DesignSystem.shadows.sm,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.border.light,
  },
  headerLeft: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    margin: 0,
    marginRight: DesignSystem.spacing.xs,
  },
  headerTitle: {
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    flex: 1,
  },
  confirmButton: {
    borderRadius: DesignSystem.borderRadius.full,
  },
  
  // Search Container
  searchContainer: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.background.primary,
  },
  searchBar: {
    backgroundColor: DesignSystem.colors.background.primary,
    elevation: 2,
  },
  searchInput: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.primary,
  },
  suggestionsContainer: {
    marginTop: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.md,
    elevation: 4,
    maxHeight: 200,
  },
  suggestionItem: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    padding: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.border.light,
  },
  suggestionContent: {
    flex: 1,
    marginLeft: DesignSystem.spacing.sm,
  },
  suggestionName: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  suggestionAddress: {
    color: DesignSystem.colors.text.secondary,
  },
  
  // Map Container
  mapContainer: {
    margin: DesignSystem.spacing.md,
    overflow: 'hidden',
    ...DesignSystem.shadows.lg,
  },
  map: {
    flex: 1,
  },
  
  // Map Controls
  mapControls: {
    position: 'absolute',
    top: DesignSystem.spacing.md,
    right: DesignSystem.spacing.md,
    gap: DesignSystem.spacing.sm,
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...DesignSystem.shadows.md,
  },
  
  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.primary,
    marginTop: DesignSystem.spacing.sm,
  },
  
  // Location Info
  locationInfo: {
    margin: DesignSystem.spacing.md,
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.lg,
    backgroundColor: DesignSystem.colors.background.primary,
    ...DesignSystem.shadows.sm,
  },
  locationHeader: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  locationTitle: {
    color: DesignSystem.colors.text.primary,
    marginLeft: DesignSystem.spacing.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  locationAddress: {
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.xs,
  },
  locationCoordinates: {
    color: DesignSystem.colors.text.disabled,
  },
  
  // Selected Marker
  selectedMarker: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DesignSystem.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
    ...DesignSystem.shadows.lg,
    elevation: 8,
  },
  markerText: {
    fontSize: 28,
    textAlign: 'center',
  },
});
