import { MaterialIcons } from '@expo/vector-icons';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  profilePhoto?: string;
  profileCompletion: number;
  memberSince: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface ProfileSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  type: 'navigation' | 'toggle' | 'select' | 'action';
  route?: string;
  value?: string | boolean;
  options?: string[];
  onPress?: () => void;
  badge?: string | number;
}

export interface SavedAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  isSelected: boolean;
}

export interface FavoriteRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image?: string;
  lastOrdered: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'netbanking';
  name: string;
  number?: string;
  upiId?: string;
  bankName?: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  isEnabled: boolean;
  category: 'orders' | 'offers' | 'app' | 'marketing';
}

export interface AppSetting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'select' | 'action';
  value?: string | boolean;
  options?: string[];
}

// Sample user profile data
export const userProfile: UserProfile = {
  id: 'user-001',
  name: 'Priya Sharma',
  phone: '+91 98765-43210',
  email: 'priya.sharma@email.com',
  profilePhoto: 'https://example.com/profile-photo.jpg',
  profileCompletion: 85,
  memberSince: 'January 2024',
  totalOrders: 24,
  totalSpent: 12500,
  loyaltyPoints: 1250,
  isEmailVerified: true,
  isPhoneVerified: true,
};

// Profile sections data
export const profileSections: ProfileSection[] = [
  // My Account Section (includes Personal Information and Saved Addresses)
  {
    id: 'personal-info',
    title: 'Personal Information',
    subtitle: 'Manage your profile details',
    icon: 'account-circle',
    type: 'navigation',
    route: '/profile/edit',
    badge: 'Edit',
  },
  {
    id: 'saved-addresses',
    title: 'Saved Addresses',
    subtitle: 'Manage delivery addresses',
    icon: 'location-on',
    type: 'navigation',
    route: '/profile/addresses',
  },
  
  // Orders & History Section (only Order History)
  {
    id: 'order-history',
    title: 'Order History',
    subtitle: 'View all your past orders',
    icon: 'history',
    type: 'navigation',
    route: '/order-history',
  },
  
  // Notifications Section (only App Notifications)
  {
    id: 'app-notifications',
    title: 'App Notifications',
    description: 'General app updates and features',
    icon: 'apps',
    type: 'toggle',
    value: false,
  },
  
  // Support Section (Contact Us and Rate App)
  {
    id: 'contact-us',
    title: 'Contact Us',
    subtitle: 'Get in touch with our team',
    icon: 'support-agent',
    type: 'navigation',
    route: '/support/contact',
  },
  {
    id: 'rate-app',
    title: 'Rate App',
    subtitle: 'Share your feedback',
    icon: 'star',
    type: 'action',
  },
  
  // Settings Section (only Location Services)
  {
    id: 'location-services',
    title: 'Location Services',
    description: 'Allow app to access your location',
    icon: 'my-location',
    type: 'toggle',
    value: true,
  },
];

// Sample saved addresses
export const savedAddresses: SavedAddress[] = [
  {
    id: 'addr-1',
    type: 'home',
    name: 'Home',
    address: '123 Main Street, Apartment 4B',
    landmark: 'Near Central Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    isDefault: true,
    isSelected: true,
  },
  {
    id: 'addr-2',
    type: 'work',
    name: 'Office',
    address: '456 Business Park, Floor 8',
    landmark: 'Opposite Metro Station',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400002',
    isDefault: false,
    isSelected: false,
  },
  {
    id: 'addr-3',
    type: 'other',
    name: 'Parents House',
    address: '789 Residential Colony, House 12',
    landmark: 'Near Temple',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400003',
    isDefault: false,
    isSelected: false,
  },
];

// Sample favorite restaurants
export const favoriteRestaurants: FavoriteRestaurant[] = [
  {
    id: 'fav-1',
    name: "Sharma's Kitchen",
    cuisine: 'North Indian',
    rating: 4.5,
    deliveryTime: '25-35 mins',
    image: 'https://example.com/sharma-kitchen.jpg',
    lastOrdered: '2 days ago',
  },
  {
    id: 'fav-2',
    name: 'Dosa Corner',
    cuisine: 'South Indian',
    rating: 4.7,
    deliveryTime: '20-30 mins',
    image: 'https://example.com/dosa-corner.jpg',
    lastOrdered: '1 week ago',
  },
  {
    id: 'fav-3',
    name: 'Pizza Corner',
    cuisine: 'Italian',
    rating: 4.3,
    deliveryTime: '30-45 mins',
    image: 'https://example.com/pizza-corner.jpg',
    lastOrdered: '3 days ago',
  },
  {
    id: 'fav-4',
    name: 'Spice Garden',
    cuisine: 'Fusion',
    rating: 4.4,
    deliveryTime: '30-45 mins',
    image: 'https://example.com/spice-garden.jpg',
    lastOrdered: '5 days ago',
  },
  {
    id: 'fav-5',
    name: 'Burger House',
    cuisine: 'Fast Food',
    rating: 4.2,
    deliveryTime: '25-35 mins',
    image: 'https://example.com/burger-house.jpg',
    lastOrdered: '1 week ago',
  },
  {
    id: 'fav-6',
    name: 'Chinese Wok',
    cuisine: 'Chinese',
    rating: 4.1,
    deliveryTime: '35-50 mins',
    image: 'https://example.com/chinese-wok.jpg',
    lastOrdered: '2 weeks ago',
  },
  {
    id: 'fav-7',
    name: 'Sushi Bar',
    cuisine: 'Japanese',
    rating: 4.6,
    deliveryTime: '40-55 mins',
    image: 'https://example.com/sushi-bar.jpg',
    lastOrdered: '3 weeks ago',
  },
  {
    id: 'fav-8',
    name: 'Ice Cream Parlor',
    cuisine: 'Desserts',
    rating: 4.8,
    deliveryTime: '15-25 mins',
    image: 'https://example.com/ice-cream.jpg',
    lastOrdered: '4 days ago',
  },
];

// Sample payment methods
export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pay-1',
    type: 'card',
    name: 'HDFC Credit Card',
    number: '**** **** **** 1234',
    isDefault: true,
    isActive: true,
  },
  {
    id: 'pay-2',
    type: 'upi',
    name: 'Google Pay',
    upiId: 'priya.sharma@okicici',
    isDefault: false,
    isActive: true,
  },
  {
    id: 'pay-3',
    type: 'wallet',
    name: 'Paytm Wallet',
    number: 'Balance: ₹2,450',
    isDefault: false,
    isActive: true,
  },
];

// Sample notification settings
export const notificationSettings: NotificationSetting[] = [
  {
    id: 'notif-1',
    title: 'Order Updates',
    description: 'Get notified about order status changes',
    isEnabled: true,
    category: 'orders',
  },
  {
    id: 'notif-2',
    title: 'Offers & Promotions',
    description: 'Receive special deals and discounts',
    isEnabled: true,
    category: 'offers',
  },
  {
    id: 'notif-3',
    title: 'App Notifications',
    description: 'General app updates and features',
    isEnabled: false,
    category: 'app',
  },
  {
    id: 'notif-4',
    title: 'Marketing Emails',
    description: 'Receive promotional emails',
    isEnabled: false,
    category: 'marketing',
  },
];

// Sample app settings
export const appSettings: AppSetting[] = [
  {
    id: 'setting-1',
    title: 'Language',
    description: 'Choose your preferred language',
    type: 'select',
    value: 'English',
    options: ['English', 'Hindi', 'Gujarati', 'Marathi'],
  },
  {
    id: 'setting-2',
    title: 'Dark Mode',
    description: 'Switch between light and dark themes',
    type: 'toggle',
    value: false,
  },
  {
    id: 'setting-3',
    title: 'Location Services',
    description: 'Allow app to access your location',
    type: 'toggle',
    value: true,
  },
  {
    id: 'setting-4',
    title: 'Data Usage',
    description: 'Manage app data and cache',
    type: 'action',
  },
];

// Helper functions
export const getAddressTypeIcon = (type: string): string => {
  switch (type) {
    case 'home': return 'home';
    case 'work': return 'work';
    default: return 'location-on';
  }
};

export const getPaymentTypeIcon = (type: string): string => {
  switch (type) {
    case 'card': return 'credit-card';
    case 'upi': return 'account-balance-wallet';
    case 'wallet': return 'account-balance-wallet';
    case 'netbanking': return 'account-balance';
    default: return 'payment';
  }
};

// Default export to prevent routing issues
export default {
  userProfile,
  profileSections,
  savedAddresses,
  favoriteRestaurants,
  paymentMethods,
  notificationSettings,
  appSettings,
  getAddressTypeIcon,
  getPaymentTypeIcon,
}; 