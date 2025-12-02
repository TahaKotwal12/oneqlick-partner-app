export interface AddressFormData {
  title: string;
  full_name: string;
  phone_number: string;
  address_type: 'home' | 'work' | 'other';
  address_line1: string;
  address_line2: string;
  landmark: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
}

export interface AddressSuggestion {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  placeId?: string; // Google Places API place ID
}

export interface FormValidation {
  title: boolean;
  address_type: boolean;
  full_name: boolean;
  phone_number: boolean;
  address_line1: boolean;
  city: boolean;
  state: boolean;
  postal_code: boolean;
}

// Default form data
export const defaultFormData: AddressFormData = {
  title: '',
  full_name: '',
  phone_number: '',
  address_type: 'home',
  address_line1: '',
  address_line2: '',
  landmark: '',
  city: '',
  state: '',
  postal_code: '',
  latitude: undefined,
  longitude: undefined,
  is_default: false,
};

// Default validation state
export const defaultValidation: FormValidation = {
  title: false,
  address_type: false,
  full_name: false,
  phone_number: false,
  address_line1: false,
  city: false,
  state: false,
  postal_code: false,
};

// Address types
export const addressTypes = [
  { id: 'home', name: 'Home', icon: 'home', color: '#4CAF50' },
  { id: 'work', name: 'Work', icon: 'business', color: '#2196F3' },
  { id: 'other', name: 'Other', icon: 'location-on', color: '#FF9800' },
];

// Sample cities and states for auto-fill
export const citiesData = {
  'Haridwar': 'Uttarakhand',
  'Dehradun': 'Uttarakhand',
  'Rishikesh': 'Uttarakhand',
  'Mussoorie': 'Uttarakhand',
  'Delhi': 'Delhi',
  'Mumbai': 'Maharashtra',
  'Bangalore': 'Karnataka',
  'Chennai': 'Tamil Nadu',
  'Kolkata': 'West Bengal',
  'Hyderabad': 'Telangana',
};

// Sample areas for different cities
export const areasData = {
  'Haridwar': [
    'Rajpur',
    'Civil Lines',
    'Jwalapur',
    'Kankhal',
    'Har Ki Pauri',
    'BHEL Township',
    'SIDCUL',
    'Bahadrabad',
    'Roorkee',
    'Manglaur',
  ],
  'Dehradun': [
    'Rajpur Road',
    'Paltan Bazaar',
    'Astley Hall',
    'Dalanwala',
    'Rajpur',
    'Clement Town',
    'Vikas Nagar',
    'Indira Nagar',
    'Prem Nagar',
    'Clock Tower',
  ],
};

// Helper functions
export const validatePhoneNumber = (phone: string): boolean => {
  // More flexible phone number validation
  if (!phone || phone.trim().length === 0) return false;
  
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if it's a valid Indian phone number (10 digits starting with 6-9)
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

export const validatePincode = (pincode: string): boolean => {
  // More flexible pincode validation
  if (!pincode || pincode.trim().length === 0) return false;
  
  // Remove all non-digit characters
  const cleanPincode = pincode.replace(/\D/g, '');
  
  // Indian pincode validation (6 digits)
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(cleanPincode);
};

export const validateForm = (formData: AddressFormData, selectedLocation?: MapLocation | null): FormValidation => {
  return {
    title: formData.title.trim().length >= 1,
    address_type: formData.address_type !== null && formData.address_type !== undefined,
    full_name: formData.full_name.trim().length >= 2,
    phone_number: validatePhoneNumber(formData.phone_number),
    address_line1: formData.address_line1.trim().length >= 1,
    city: formData.city.trim().length >= 2,
    state: formData.state.trim().length >= 2,
    postal_code: validatePincode(formData.postal_code),
  };
};

export const isFormValid = (validation: FormValidation): boolean => {
  return Object.values(validation).every(Boolean);
};

export const getCities = (): string[] => {
  return Object.keys(citiesData);
};

export const getStateForCity = (city: string): string => {
  return citiesData[city as keyof typeof citiesData] || '';
};

export const getAreasForCity = (city: string): string[] => {
  return areasData[city as keyof typeof areasData] || [];
};

export const getAddressTypeInfo = (type: string) => {
  return addressTypes.find(t => t.id === type) || addressTypes[0];
};

// Mock GPS and geocoding functions
export const getCurrentLocation = (): Promise<MapLocation> => {
  return new Promise((resolve) => {
    // Simulate GPS location detection
    setTimeout(() => {
      resolve({
        latitude: 29.9457,
        longitude: 78.1642,
        address: 'Rajpur Village, Near Temple',
        city: 'Haridwar',
        state: 'Uttarakhand',
        pincode: '249201',
        area: 'Rajpur',
      });
    }, 1000);
  });
};

export const searchAddresses = async (query: string): Promise<AddressSuggestion[]> => {
  // Simulate address search
  const mockSuggestions: AddressSuggestion[] = [
    {
      id: '1',
      name: 'Rajpur Market',
      address: 'Rajpur Market, Rajpur, Haridwar',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249201',
      coordinates: { latitude: 29.9462, longitude: 78.1638 },
      distance: 0.8,
    },
    {
      id: '2',
      name: 'Temple Area',
      address: 'Near Temple, Rajpur, Haridwar',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249201',
      coordinates: { latitude: 29.9450, longitude: 78.1645 },
      distance: 0.3,
    },
    {
      id: '3',
      name: 'Civil Lines',
      address: 'Civil Lines, Haridwar',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249408',
      coordinates: { latitude: 29.9445, longitude: 78.1650 },
      distance: 1.8,
    },
    {
      id: '4',
      name: 'Main Market',
      address: 'Main Market, Rajpur, Haridwar',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249201',
      coordinates: { latitude: 29.9465, longitude: 78.1635 },
      distance: 1.0,
    },
  ];

  return mockSuggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(query.toLowerCase()) ||
    suggestion.address.toLowerCase().includes(query.toLowerCase()) ||
    suggestion.city.toLowerCase().includes(query.toLowerCase())
  );
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<MapLocation> => {
  // Simulate reverse geocoding
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        latitude,
        longitude,
        address: 'Rajpur Village, Near Temple',
        city: 'Haridwar',
        state: 'Uttarakhand',
        pincode: '249201',
        area: 'Rajpur',
      });
    }, 500);
  });
};

// Default export
export default {
  defaultFormData,
  defaultValidation,
  addressTypes,
  citiesData,
  areasData,
  validatePhoneNumber,
  validatePincode,
  validateForm,
  isFormValid,
  getCities,
  getStateForCity,
  getAreasForCity,
  getAddressTypeInfo,
  getCurrentLocation,
  searchAddresses,
  reverseGeocode,
}; 