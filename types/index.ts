// User related types
export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  profile_image?: string;
  email_verified: boolean;
  phone_verified: boolean;
  date_of_birth?: string;
  gender?: string;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  locationServices: boolean;
  language: 'en' | 'hi' | 'ta' | 'te' | 'bn';
  currency: 'INR' | 'USD';
}

// Restaurant related types
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  totalRatings: number;
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  image: string;
  banner?: string;
  isOpen: boolean;
  isVeg: boolean;
  isPureVeg: boolean;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  categories: string[];
  offers: Offer[];
  featured: boolean;
}

export interface FoodItem {
  food_item_id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  category_id: string;
  is_veg: boolean;
  is_available: boolean;
  is_popular?: boolean;
  is_recommended?: boolean;
  allergens?: string[];
  nutrition_info?: NutritionInfo;
  customization_options?: CustomizationOption[];
  add_ons?: AddOn[];
  rating?: number;
  total_ratings?: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  options: string[];
  required: boolean;
  maxSelections?: number;
  is_available?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount: number;
  validUntil: string;
}

// Order related types
export interface Order {
  order_id: string;
  order_number: string;
  customer_id: string;
  restaurant_id: string;
  restaurant_name?: string;
  restaurant_address?: string;
  items: OrderItem[];
  subtotal?: number;
  delivery_fee?: number;
  tax?: number;
  total_amount: number;
  order_status: OrderStatus;
  created_at: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  delivery_address: string | DeliveryAddress;
  payment_method?: PaymentMethod;
  payment_status?: string;
  special_instructions?: string;
  tracking_info?: TrackingInfo;
}

export interface OrderItem {
  food_item_id?: string;
  id?: string;
  name: string;
  price?: number;
  quantity: number;
  customization?: Record<string, string>;
  add_ons?: string[];
  total_price?: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'picked_up'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'completed';

export interface DeliveryAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  name: string;
  lastFourDigits?: string;
  isDefault: boolean;
}

export interface TrackingInfo {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedTimeRemaining: string;
  driverInfo?: DriverInfo;
  updates: TrackingUpdate[];
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  photo?: string;
}

export interface TrackingUpdate {
  timestamp: string;
  status: OrderStatus;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Cart related types
export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  customization?: Record<string, string>;
  addOns: AddOn[];
  totalPrice: number;
  specialInstructions?: string;
}

export interface Cart {
  id: string;
  userId: string;
  restaurantId?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  appliedOffers: Offer[];
  discountAmount: number;
}

// Search and Filter types
export interface SearchFilters {
  cuisine?: string[];
  priceRange?: [number, number];
  rating?: number;
  deliveryTime?: number;
  isVeg?: boolean;
  isOpen?: boolean;
  offers?: boolean;
  sortBy?: 'rating' | 'delivery_time' | 'price_low' | 'price_high' | 'distance';
}

export interface SearchResult {
  restaurants: Restaurant[];
  totalCount: number;
  hasMore: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Navigation types
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  '(modals)': undefined;
  restaurant: { id: string };
  checkout: undefined;
  'order-tracking': { id: string };
  profile: undefined;
};

export type AuthStackParamList = {
  login: undefined;
  signup: undefined;
  'forgot-password': undefined;
  'otp-verification': undefined;
};

export type TabParamList = {
  home: undefined;
  search: undefined;
  orders: undefined;
  profile: undefined;
};

export type ModalParamList = {
  cart: undefined;
  filter: undefined;
  'location-picker': undefined;
};