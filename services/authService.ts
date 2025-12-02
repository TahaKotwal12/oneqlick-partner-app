import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, User } from '../types';

// Mock Users
const MOCK_RESTAURANT_USER: User = {
  user_id: 'mock-rest-001',
  email: 'restaurant@oneqlick.com',
  phone: '+1234567890',
  first_name: 'Restaurant',
  last_name: 'Owner',
  role: 'restaurant_owner',
  status: 'active',
  email_verified: true,
  phone_verified: true,
  loyalty_points: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_DELIVERY_USER: User = {
  user_id: 'mock-del-001',
  email: 'driver@oneqlick.com',
  phone: '+0987654321',
  first_name: 'Delivery',
  last_name: 'Partner',
  role: 'delivery_partner',
  status: 'active',
  email_verified: true,
  phone_verified: true,
  loyalty_points: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const authService = {
  login: async (identifier: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple mock logic
    if (identifier === 'restaurant@oneqlick.com') {
      const token = 'mock-restaurant-token';
      await AsyncStorage.setItem('access_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(MOCK_RESTAURANT_USER));
      return {
        success: true,
        data: { user: MOCK_RESTAURANT_USER, token },
        statusCode: 200,
      };
    } else if (identifier === 'partner@oneqlick.com') {
      const token = 'mock-delivery-token';
      await AsyncStorage.setItem('access_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(MOCK_DELIVERY_USER));
      return {
        success: true,
        data: { user: MOCK_DELIVERY_USER, token },
        statusCode: 200,
      };
    }

    // Default fallback for testing if needed, or error
    return {
      success: false,
      error: 'Invalid credentials. Try "restaurant@oneqlick.com" or "partner@oneqlick.com".',
      statusCode: 401,
    };
  },

  signup: async (userData: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const role = userData.role || 'restaurant_owner';
    const mockUser = role === 'restaurant_owner' ? MOCK_RESTAURANT_USER : MOCK_DELIVERY_USER;
    const token = `mock-${role}-token`;

    await AsyncStorage.setItem('access_token', token);
    await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));

    return {
      success: true,
      data: { user: mockUser, token },
      statusCode: 201,
    };
  },

  logout: async (): Promise<ApiResponse<void>> => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user_data');
    return { success: true, data: undefined, statusCode: 200 };
  },

  googleSignIn: async (): Promise<ApiResponse<{ user: User; token: string }>> => ({
    success: false,
    error: 'Not implemented in mock',
    statusCode: 501
  }),

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => ({
    success: true,
    data: { token: 'mock-refreshed-token' },
    statusCode: 200
  }),

  sendOTP: async (phone?: string, email?: string, type?: string): Promise<ApiResponse<{ message: string; remaining_attempts: number; max_attempts: number }>> => ({
    success: true,
    data: { message: 'OTP sent', remaining_attempts: 2, max_attempts: 3 },
    statusCode: 200
  }),

  verifyOTP: async (code: string, phone?: string, email?: string, type?: string): Promise<ApiResponse<{ message: string }>> => ({
    success: true,
    data: { message: 'OTP verified' },
    statusCode: 200
  }),

  getProfile: async (): Promise<ApiResponse<User>> => {
    const userData = await AsyncStorage.getItem('user_data');
    return {
      success: true,
      data: userData ? JSON.parse(userData) : MOCK_RESTAURANT_USER,
      statusCode: 200,
    };
  },

  updateProfile: async (data: any): Promise<ApiResponse<User>> => ({
    success: true,
    data: { ...MOCK_RESTAURANT_USER, ...data },
    statusCode: 200
  }),

  changePassword: async (data: any): Promise<ApiResponse<{ message: string }>> => ({
    success: true,
    data: { message: 'Password changed' },
    statusCode: 200
  }),

  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('access_token');
    return !!token;
  },

  getCurrentUser: async (): Promise<User | null> => {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => ({
    success: true,
    data: { message: 'Reset OTP sent' },
    statusCode: 200
  }),

  verifyResetOTP: async (code: string, email: string): Promise<ApiResponse<{ message: string }>> => ({
    success: true,
    data: { message: 'Reset OTP verified' },
    statusCode: 200
  }),

  resetPassword: async (code: string, email: string, password: string): Promise<ApiResponse<{ message: string }>> => ({
    success: true,
    data: { message: 'Password reset successful' },
    statusCode: 200
  }),
};
