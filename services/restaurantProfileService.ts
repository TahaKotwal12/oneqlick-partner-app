// Restaurant Profile Service for Partner App
import { ENV } from '../config/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = ENV.API_BASE_URL;

// Types
export interface RestaurantProfile {
    restaurant_id: string;
    name: string;
    description: string;
    phone: string;
    email: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    image?: string;
    cover_image?: string;
    cuisine_type: string;
    avg_delivery_time: number;
    min_order_amount: number;
    delivery_fee: number;
    rating: number;
    total_ratings: number;
    status: string;
    is_open: boolean;
    opening_time?: string;
    closing_time?: string;
    created_at: string;
    updated_at: string;
}

export interface UpdateRestaurantProfileRequest {
    name?: string;
    description?: string;
    phone?: string;
    email?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
    image?: string;
    cover_image?: string;
    cuisine_type?: string;
    avg_delivery_time?: number;
    min_order_amount?: number;
    delivery_fee?: number;
}

export interface UpdateOperatingHoursRequest {
    opening_time?: string;
    closing_time?: string;
    is_open?: boolean;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    message_id: string;
    data: T;
}

// Get auth token
const getAuthToken = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

// API request helper
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = await getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
}

// Restaurant Profile Service
export const restaurantProfileService = {
    // Get restaurant profile
    async getProfile(): Promise<ApiResponse<RestaurantProfile>> {
        console.log('restaurantProfileService - getProfile called');
        console.log('restaurantProfileService - API_BASE_URL:', API_BASE_URL);

        try {
            const result = await apiRequest<RestaurantProfile>('/partner/restaurant/profile', {
                method: 'GET',
            });
            console.log('restaurantProfileService - getProfile success:', result);
            return result;
        } catch (error) {
            console.error('restaurantProfileService - getProfile error:', error);
            throw error;
        }
    },

    // Create restaurant profile
    async createRestaurant(data: UpdateRestaurantProfileRequest): Promise<ApiResponse<RestaurantProfile>> {
        console.log('restaurantProfileService - createRestaurant called with:', data);

        try {
            const result = await apiRequest<RestaurantProfile>('/partner/restaurant/profile', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            console.log('restaurantProfileService - createRestaurant success:', result);
            return result;
        } catch (error) {
            console.error('restaurantProfileService - createRestaurant error:', error);
            throw error;
        }
    },

    // Update restaurant profile
    async updateProfile(data: UpdateRestaurantProfileRequest): Promise<ApiResponse<RestaurantProfile>> {
        console.log('restaurantProfileService - updateProfile called with:', data);

        try {
            const result = await apiRequest<RestaurantProfile>('/partner/restaurant/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            console.log('restaurantProfileService - updateProfile success:', result);
            return result;
        } catch (error) {
            console.error('restaurantProfileService - updateProfile error:', error);
            throw error;
        }
    },

    // Update operating hours
    async updateOperatingHours(data: UpdateOperatingHoursRequest): Promise<ApiResponse<RestaurantProfile>> {
        console.log('restaurantProfileService - updateOperatingHours called with:', data);

        try {
            const result = await apiRequest<RestaurantProfile>('/partner/restaurant/profile/operating-hours', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            console.log('restaurantProfileService - updateOperatingHours success:', result);
            return result;
        } catch (error) {
            console.error('restaurantProfileService - updateOperatingHours error:', error);
            throw error;
        }
    },
};
