// API Service Layer for oneQlick User App
import { ApiResponse, PaginatedResponse, Restaurant, FoodItem, Order, User } from '../types';
import { ENV } from '../config/environment';

const API_BASE_URL = ENV.API_BASE_URL;

// API Configuration
const API_CONFIG = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Request interceptor for adding auth token
const getAuthHeaders = async () => {
  const token = await getStoredToken();
  return {
    ...API_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Token management
const getStoredToken = async (): Promise<string | null> => {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem('access_token');
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await getAuthHeaders();
    
    console.log('Making API request:', {
      url,
      method: options.method || 'GET',
      headers,
      body: options.body
    });
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      // Remove timeout as it's not a standard fetch option
    });

    console.log('API response received:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });

    const data = await response.json();
    console.log('API response data:', data);

    if (!response.ok) {
      console.error('API request failed:', {
        status: response.status,
        data: data,
        url: url
      });
      return {
        success: false,
        error: data.message || 'Request failed',
        statusCode: response.status,
      };
    }

    // API request successful
    return {
      success: true,
      data: data.data || data,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('API request error:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      url: `${API_BASE_URL}${endpoint}`,
      stack: error instanceof Error ? error.stack : undefined
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      statusCode: 0,
    };
  }
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
    });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// Restaurant API
export const restaurantAPI = {
  getNearbyRestaurants: async (params: {
    latitude: number;
    longitude: number;
    radius_km?: number;
    limit?: number;
    offset?: number;
    is_veg_only?: boolean;
    is_open?: boolean;
    sort_by?: 'distance' | 'rating' | 'delivery_time' | 'cost_low' | 'cost_high';
  }): Promise<ApiResponse<{
    restaurants: Restaurant[];
    total_count: number;
    has_more: boolean;
  }>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiRequest(`/restaurants/nearby?${queryParams.toString()}`);
  },

  getPopularDishes: async (params: {
    latitude: number;
    longitude: number;
    radius_km?: number;
    limit?: number;
    is_veg_only?: boolean;
    category?: string;
  }): Promise<ApiResponse<{
    dishes: any[];
    total_count: number;
    has_more: boolean;
  }>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiRequest(`/restaurants/popular-dishes?${queryParams.toString()}`);
  },

  getRestaurants: async (params?: {
    latitude?: number;
    longitude?: number;
    cuisine?: string;
    isVeg?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Restaurant>>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return apiRequest(`/restaurants?${queryParams.toString()}`);
  },

  getRestaurant: async (id: string, params?: { include_menu?: boolean }): Promise<ApiResponse<Restaurant>> => {
    const queryParams = new URLSearchParams();
    if (params?.include_menu) {
      queryParams.append('include_menu', 'true');
    }
    const url = queryParams.toString() ? `/restaurants/${id}?${queryParams.toString()}` : `/restaurants/${id}`;
    return apiRequest(url);
  },

  getRestaurantMenu: async (id: string): Promise<ApiResponse<FoodItem[]>> => {
    return apiRequest(`/restaurants/${id}/menu`);
  },

  searchRestaurants: async (query: string, filters?: any): Promise<ApiResponse<Restaurant[]>> => {
    return apiRequest('/restaurants/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  },

  unifiedSearch: async (params: {
    query: string;
    latitude: number;
    longitude: number;
    radius_km?: number;
    limit?: number;
    search_type?: 'all' | 'restaurants' | 'dishes' | 'categories';
    is_veg_only?: boolean;
    is_open?: boolean;
    sort_by?: 'relevance' | 'distance' | 'rating' | 'price_low' | 'price_high';
  }): Promise<ApiResponse<{
    results: any[];
    total_count: number;
    has_more: boolean;
  }>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    return apiRequest(`/restaurants/search?${queryParams.toString()}`);
  },
};

// Food Items API
export const foodAPI = {
  getFoodItems: async (params?: {
    restaurantId?: string;
    category?: string;
    isVeg?: boolean;
    isPopular?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<FoodItem>>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return apiRequest(`/food-items?${queryParams.toString()}`);
  },

  getFoodItem: async (id: string): Promise<ApiResponse<FoodItem>> => {
    return apiRequest(`/food-items/${id}`);
  },

  searchFoodItems: async (query: string): Promise<ApiResponse<FoodItem[]>> => {
    return apiRequest(`/food-items/search?q=${encodeURIComponent(query)}`);
  },

  getFoodItemById: async (id: string, params?: {
    include_restaurant?: boolean;
    include_customizations?: boolean;
  }): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const url = queryParams.toString() ? `/food-items/${id}?${queryParams.toString()}` : `/food-items/${id}`;
    return apiRequest(url);
  },

  getFoodItems: async (params?: {
    restaurant_id?: string;
    category_id?: string;
    is_veg?: boolean;
    is_popular?: boolean;
    is_recommended?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{
    food_items: any[];
    total_count: number;
    has_more: boolean;
  }>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return apiRequest(`/food-items?${queryParams.toString()}`);
  },
};

// Orders API
export const orderAPI = {
  createOrder: async (orderData: {
    restaurantId: string;
    items: Array<{
      foodItemId: string;
      quantity: number;
      customization?: Record<string, string>;
      addOns?: string[];
    }>;
    deliveryAddress: string;
    paymentMethod: string;
    specialInstructions?: string;
  }): Promise<ApiResponse<Order>> => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return apiRequest(`/orders?${queryParams.toString()}`);
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return apiRequest(`/orders/${id}`);
  },

  cancelOrder: async (id: string, reason?: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  trackOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return apiRequest(`/orders/${id}/track`);
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest('/users/profile');
  },

  updateProfile: async (userData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    profile_image?: string;
  }): Promise<ApiResponse<User>> => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest('/users/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  getUserStats: async (): Promise<ApiResponse<{
    total_orders: number;
    total_spent: number;
    loyalty_points: number;
    member_since: string;
    favorite_cuisines: string[];
    last_order_date?: string;
  }>> => {
    return apiRequest('/users/stats');
  },

  getAddresses: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest('/users/addresses');
  },

  addAddress: async (addressData: {
    title: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    latitude?: number;
    longitude?: number;
    is_default?: boolean;
    address_type?: string;
    landmark?: string;
  }): Promise<ApiResponse<any>> => {
    return apiRequest('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (id: string, addressData: {
    title?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
    is_default?: boolean;
    address_type?: string;
    landmark?: string;
  }): Promise<ApiResponse<any>> => {
    return apiRequest(`/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  deleteAddress: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/users/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  getUserSessions: async (): Promise<ApiResponse<{
    sessions: Array<{
      session_id: string;
      device_name?: string;
      device_type?: string;
      platform?: string;
      app_version?: string;
      last_activity: string;
      is_current: boolean;
    }>;
    total_sessions: number;
  }>> => {
    return apiRequest('/users/sessions');
  },

  revokeSession: async (sessionId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest(`/users/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },
};

// Utility functions
export const apiUtils = {
  isNetworkError: (error: any): boolean => {
    return error?.statusCode === 0 || error?.message?.includes('Network');
  },

  isAuthError: (error: any): boolean => {
    return error?.statusCode === 401 || error?.statusCode === 403;
  },

  getErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.error) return error.error;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  },
};

export default {
  auth: authAPI,
  restaurant: restaurantAPI,
  food: foodAPI,
  order: orderAPI,
  user: userAPI,
  utils: apiUtils,
};
