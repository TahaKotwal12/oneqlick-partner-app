import { MaterialIcons } from '@expo/vector-icons';
import { getCurrentLocation, getDistanceFromCurrentLocation } from '../../utils/locationUtils';

export interface Address {
  address_id: string;
  address_type: 'home' | 'work' | 'restaurant' | 'other';
  title: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  isSelected: boolean;
  latitude?: number;
  longitude?: number;
  distance?: number; // Distance from current location in km
  deliveryArea: boolean; // Whether address is in delivery area
  lastUsed?: string; // Last time this address was used
}

export interface AddressType {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

export interface DeliveryArea {
  city: string;
  state: string;
  pincodes: string[];
  isActive: boolean;
}

// Address types with icons and colors
export const addressTypes: AddressType[] = [
  {
    id: 'home',
    name: 'Home',
    icon: 'home',
    color: '#10B981',
  },
  {
    id: 'work',
    name: 'Work',
    icon: 'work',
    color: '#3B82F6',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: 'restaurant',
    color: '#F97316',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'location-on',
    color: '#F59E0B',
  },
];

// Sample addresses data
export const sampleAddresses: Address[] = [
  {
    address_id: 'addr-1',
    address_type: 'home',
    title: 'Home',
    full_name: 'John Doe',
    address_line1: 'House No. 45, Rajpur Village',
    address_line2: 'Near Temple',
    landmark: 'Near Temple',
    city: 'Haridwar',
    state: 'Uttarakhand',
    postal_code: '249201',
    is_default: true,
    isSelected: true,
    latitude: 29.9457,
    longitude: 78.1642,
    distance: 0.5,
    deliveryArea: true,
    lastUsed: '2024-01-15T14:30:00Z',
  },
  {
    address_id: 'addr-2',
    address_type: 'work',
    title: 'Office',
    full_name: 'John Doe',
    address_line1: 'Sharma Electronics, Main Market',
    address_line2: 'Rajpur',
    landmark: 'Main Market',
    city: 'Haridwar',
    state: 'Uttarakhand',
    postal_code: '249201',
    is_default: false,
    isSelected: false,
    latitude: 29.9462,
    longitude: 78.1638,
    distance: 1.2,
    deliveryArea: true,
    lastUsed: '2024-01-10T12:00:00Z',
  },
  {
    address_id: 'addr-3',
    address_type: 'other',
    title: "Friend's House",
    full_name: 'John Doe',
    address_line1: "Friend's House, Civil Lines",
    address_line2: '',
    landmark: 'Civil Lines',
    city: 'Haridwar',
    state: 'Uttarakhand',
    postal_code: '249408',
    is_default: false,
    isSelected: false,
    latitude: 29.9445,
    longitude: 78.1650,
    distance: 2.1,
    deliveryArea: true,
    lastUsed: '2024-01-05T18:00:00Z',
  },
];

// Delivery areas data
export const deliveryAreas: DeliveryArea[] = [
  {
    city: 'Haridwar',
    state: 'Uttarakhand',
    pincodes: ['249201', '249202', '249203', '249204', '249205', '249408'],
    isActive: true,
  },
  {
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincodes: ['248001', '248002', '248003', '248004', '248005'],
    isActive: true,
  },
];

// Helper functions
export const getAddressTypeIcon = (type: string): keyof typeof MaterialIcons.glyphMap => {
  const addressType = addressTypes.find(t => t.id === type);
  return addressType?.icon || 'location-on';
};

export const getAddressTypeColor = (type: string): string => {
  const addressType = addressTypes.find(t => t.id === type);
  return addressType?.color || '#6B7280';
};

export const getAddressTypeName = (type: string): string => {
  const addressType = addressTypes.find(t => t.id === type);
  return addressType?.name || 'Other';
};

export const formatFullAddress = (address: Address): string => {
  const parts = [
    address.address_line1,
    address.address_line2,
    address.landmark,
    address.city,
    address.state,
    address.postal_code,
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const formatShortAddress = (address: Address): string => {
  const parts = [
    address.address_line1,
    address.city,
    address.postal_code,
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const validatePincode = (pincode: string): boolean => {
  // Indian pincode validation (6 digits)
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const validateDeliveryArea = (pincode: string): boolean => {
  return deliveryAreas.some(area => 
    area.isActive && area.pincodes.includes(pincode)
  );
};

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



export const searchNearbyPlaces = async (
  query: string,
  latitude: number,
  longitude: number
): Promise<any[]> => {
  // Simulate nearby places search
  const mockPlaces = [
    {
      id: 'place-1',
      name: 'Rajpur Market',
      address: 'Rajpur, Haridwar',
      coordinates: { latitude: 29.9462, longitude: 78.1638 },
      distance: 0.8,
    },
    {
      id: 'place-2',
      name: 'Temple Area',
      address: 'Near Temple, Rajpur',
      coordinates: { latitude: 29.9450, longitude: 78.1645 },
      distance: 0.3,
    },
    {
      id: 'place-3',
      name: 'Civil Lines',
      address: 'Civil Lines, Haridwar',
      coordinates: { latitude: 29.9445, longitude: 78.1650 },
      distance: 1.8,
    },
  ];
  
  return mockPlaces.filter(place => 
    place.name.toLowerCase().includes(query.toLowerCase()) ||
    place.address.toLowerCase().includes(query.toLowerCase())
  );
};

// Default export to prevent routing issues
export default {
  addressTypes,
  sampleAddresses,
  deliveryAreas,
  getAddressTypeIcon,
  getAddressTypeColor,
  getAddressTypeName,
  formatFullAddress,
  formatShortAddress,
  validatePincode,
  validateDeliveryArea,
  calculateDistance,
  getCurrentLocation,
  searchNearbyPlaces,
}; 