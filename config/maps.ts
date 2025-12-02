// Google Maps Configuration
export const GOOGLE_MAPS_API_KEY = 'AIzaSyDIu_601dSOHh-_78l-we4ZWNrxqo5wGbk';

// Mumbai coordinates for default location
export const MUMBAI_COORDINATES = {
  latitude: 19.0760,
  longitude: 72.8777,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Default map region
export const DEFAULT_MAP_REGION = MUMBAI_COORDINATES;

// Map configuration
export const MAP_CONFIG = {
  // Map styling - Use Google Maps default colors
  mapStyle: undefined, // This will use the default Google Maps styling
  
  // Map settings
  showsUserLocation: true,
  showsMyLocationButton: true,
  showsCompass: true,
  showsScale: true,
  showsBuildings: true,
  showsTraffic: false,
  showsIndoors: true,
  
  // Zoom levels
  minZoomLevel: 5,
  maxZoomLevel: 20,
  defaultZoomLevel: 15,
  
  // Animation settings
  animateToRegion: true,
  animationDuration: 1000,
};

// Address types with coordinates
export const ADDRESS_TYPES = {
  home: {
    name: 'Home',
    icon: 'home',
    color: '#4CAF50',
    coordinates: {
      latitude: 19.1136,
      longitude: 72.8697,
      address: 'Rustomjee Apartment, Western Express Hwy, Gundavali, Andheri East, Mumbai, Maharashtra 400059',
    },
  },
  office: {
    name: 'Office',
    icon: 'work',
    color: '#2196F3',
    coordinates: {
      latitude: 19.1865,
      longitude: 72.8546,
      address: '412-413, 4th Floor, Palm Spring Complex, New Link Rd, above Croma, Malad, Mindspace, Malad West, Mumbai, Maharashtra 400064',
    },
  },
  restaurant1: {
    name: 'Restaurant 1',
    icon: 'restaurant',
    color: '#FF9800',
    coordinates: {
      latitude: 19.1865,
      longitude: 72.8546,
      address: 'Ground Floor, Laxmi Palace, S.V.Road, Lane, opposite Sundar Nagar, Malad West, Mumbai, Maharashtra 400064',
    },
  },
  restaurant2: {
    name: 'Restaurant 2',
    icon: 'restaurant',
    color: '#FF5722',
    coordinates: {
      latitude: 19.1865,
      longitude: 72.8546,
      address: 'Goldline Business Center, New Link Rd, near Greens Restaurant, Malad, Ram Nagar, Malad West, Mumbai, Maharashtra 400064',
    },
  },
};

// Delivery partner simulation data
export const DELIVERY_PARTNERS = {
  partner1: {
    id: 'partner1',
    name: 'Rajesh Kumar',
    phone: '+91 98765-43210',
    vehicle: 'Bike',
    rating: 4.8,
    currentLocation: {
      latitude: 19.1865,
      longitude: 72.8546,
      lastUpdated: new Date().toISOString(),
    },
    status: 'on_way',
    estimatedArrival: '15 mins',
  },
  partner2: {
    id: 'partner2',
    name: 'Priya Sharma',
    phone: '+91 98765-43211',
    vehicle: 'Bike',
    rating: 4.9,
    currentLocation: {
      latitude: 19.1136,
      longitude: 72.8697,
      lastUpdated: new Date().toISOString(),
    },
    status: 'picked_up',
    estimatedArrival: '25 mins',
  },
};

// Map utilities
export const MapUtils = {
  // Calculate distance between two coordinates
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Get region from coordinates
  getRegionFromCoordinates: (coordinates: Array<{latitude: number, longitude: number}>) => {
    if (coordinates.length === 0) return DEFAULT_MAP_REGION;
    
    const latitudes = coordinates.map(coord => coord.latitude);
    const longitudes = coordinates.map(coord => coord.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
    
    const deltaLat = (maxLat - minLat) * 1.2; // Add 20% padding
    const deltaLon = (maxLon - minLon) * 1.2;
    
    return {
      latitude: centerLat,
      longitude: centerLon,
      latitudeDelta: Math.max(deltaLat, 0.01),
      longitudeDelta: Math.max(deltaLon, 0.01),
    };
  },

  // Format address for display
  formatAddress: (address: string, maxLength: number = 50): string => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  },

  // Get address type icon
  getAddressTypeIcon: (type: string): string => {
    const typeMap: {[key: string]: string} = {
      home: 'home',
      office: 'work',
      restaurant: 'restaurant',
      other: 'location-on',
    };
    return typeMap[type] || 'location-on';
  },

  // Get address type color
  getAddressTypeColor: (type: string): string => {
    const colorMap: {[key: string]: string} = {
      home: '#4CAF50',
      office: '#2196F3',
      restaurant: '#FF9800',
      other: '#9E9E9E',
    };
    return colorMap[type] || '#9E9E9E';
  },
};
