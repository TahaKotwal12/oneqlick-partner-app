import * as Location from 'expo-location';

export interface LocationData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: {
    street: string | null;
    name: string | null;
    city: string | null;
    region: string | null;
    country: string | null;
    postalCode: string | null;
  };
  displayName: string;
}

export interface AddressFormData {
  city: string;
  state: string;
  area: string;
  street?: string;
  pincode?: string;
}

// Backend response interface
interface BackendLocationResponse {
  success: boolean;
  address: {
    full: string;
    short: string;
    components: {
      street: string;
      locality: string;
      city: string;
      state: string;
      country: string;
      countryCode: string;
      pincode: string;
    };
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  metadata: {
    source: string;
    cached: boolean;
    processingTime: string;
    timestamp: string;
  };
}

/**
 * Get location from backend service
 */
const getLocationFromBackend = async (latitude: number, longitude: number): Promise<BackendLocationResponse> => {
  try {
    const response = await fetch('https://location-service-xocf.vercel.app/api/v1/location/reverse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
        language: 'en'
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend service error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Backend service returned unsuccessful response');
    }

    // Log the metadata for debugging (as requested)
    console.log('Location Service Metadata:', {
      source: data.metadata.source,
      cached: data.metadata.cached,
      processingTime: data.metadata.processingTime,
      timestamp: data.metadata.timestamp
    });

    return data;
  } catch (error) {
    console.error('Backend location service error:', error);
    throw error;
  }
};

/**
 * Get current location with high accuracy and detailed address information
 */
export const getCurrentLocation = async (): Promise<LocationData> => {
  try {
    // Check if location services are enabled
    const isLocationEnabled = await Location.hasServicesEnabledAsync();
    if (!isLocationEnabled) {
      throw new Error('Location services are disabled. Please enable location services in your device settings.');
    }

    // Check and request location permissions
    let { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      const permissionResponse = await Location.requestForegroundPermissionsAsync();
      status = permissionResponse.status;
      
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }
    }

    // Get current position with highest accuracy for precise coordinates
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      timeInterval: 1000, // Update every 1 second for better accuracy
      distanceInterval: 1, // Update every 1 meter movement
    });

    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    // Log GPS accuracy for debugging
    console.log('GPS Location Data:', {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: location.coords.accuracy,
      altitude: location.coords.altitude,
      timestamp: new Date(location.timestamp).toISOString()
    });

    // Get address from our backend service
    const backendResponse = await getLocationFromBackend(coords.latitude, coords.longitude);
    
    // Transform backend response to our LocationData format
    const addressData: LocationData['address'] = {
      street: backendResponse.address.components.street || null,
      name: backendResponse.address.components.locality || null,
      city: backendResponse.address.components.city || null,
      region: backendResponse.address.components.state || null,
      country: backendResponse.address.components.country || null,
      postalCode: backendResponse.address.components.pincode || null,
    };

    // Use the full address from backend as display name (as requested)
    const displayName = backendResponse.address.full || backendResponse.address.short || 'Location not found';

    return {
      coordinates: coords,
      address: addressData,
      displayName,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    
    // Fallback to expo-location if backend fails
    try {
      console.log('Falling back to expo-location...');
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const addressResponse = await Location.reverseGeocodeAsync(coords);
      let displayName = '';
      let addressData: LocationData['address'] = {
        street: null,
        name: null,
        city: null,
        region: null,
        country: null,
        postalCode: null,
      };

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        
        addressData = {
          street: address.street,
          name: address.name,
          city: address.city,
          region: address.region,
          country: address.country,
          postalCode: address.postalCode,
        };

        if (address.street && address.city) {
          displayName = `${address.street}, ${address.city}`;
        } else if (address.name && address.city) {
          displayName = `${address.name}, ${address.city}`;
        } else if (address.city) {
          displayName = address.city;
        }
      }

      if (!displayName) {
        displayName = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
      }

      return {
        coordinates: coords,
        address: addressData,
        displayName,
      };
    } catch (fallbackError) {
      console.error('Fallback location service also failed:', fallbackError);
      throw error; // Throw original error
    }
  }
};

/**
 * Extract address form data from location data
 */
export const extractAddressFormData = (locationData: LocationData): AddressFormData => {
  const { address } = locationData;
  
  return {
    city: address.city || '',
    state: address.region || '',
    area: address.name || address.street || '',
    street: address.street || '',
    pincode: address.postalCode || '',
  };
};

/**
 * Get location with address form data for easy form filling
 */
export const getLocationForAddressForm = async (): Promise<{
  locationData: LocationData;
  formData: AddressFormData;
}> => {
  const locationData = await getCurrentLocation();
  const formData = extractAddressFormData(locationData);
  
  return {
    locationData,
    formData,
  };
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Get distance from current location to given coordinates
 */
export const getDistanceFromCurrentLocation = async (
  addressLat: number,
  addressLon: number
): Promise<number> => {
  try {
    const currentLocation = await getCurrentLocation();
    return calculateDistance(
      currentLocation.coordinates.latitude,
      currentLocation.coordinates.longitude,
      addressLat,
      addressLon
    );
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 0; // Return 0 if we can't get current location
  }
}; 