import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/environment';

// API Configuration
const API_BASE_URL = ENV.API_BASE_URL;

// Storage keys
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
};

// Type Definitions
export interface DeliveryLocation {
    latitude: number;
    longitude: number;
}

export interface Restaurant {
    restaurant_id: string;
    name: string;
    address: string;
    phone: string;
    latitude: number;
    longitude: number;
}

export interface Customer {
    user_id: string;
    first_name: string;
    last_name: string;
    phone: string;
}

export interface DeliveryAddress {
    address_id: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    latitude: number;
    longitude: number;
}

export interface OrderItem {
    order_item_id: string;
    food_item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface DeliveryOrder {
    order_id: string;
    order_number: string;
    restaurant: Restaurant;
    customer: Customer;
    delivery_address: DeliveryAddress;
    items: OrderItem[];
    subtotal: number;
    tax_amount: number;
    delivery_fee: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    distance_km: number;
    estimated_delivery_time?: string;
    special_instructions?: string;
    created_at: string;
    updated_at: string;
}

export interface EarningsSummary {
    today_earnings: number;
    week_earnings: number;
    month_earnings: number;
    total_deliveries: number;
    completed_today: number;
    pending_amount: number;
    paid_amount: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    statusCode: number;
}

// Generic API request function
const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.message || 'Request failed',
                statusCode: response.status,
            };
        }

        return {
            success: true,
            data: data.data || data,
            statusCode: response.status,
        };
    } catch (error) {
        console.error('API request error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error',
            statusCode: 0,
        };
    }
};

// Delivery Order Service
export const deliveryOrderService = {
    /**
     * Get available orders for delivery
     * Orders that are ready for pickup and not yet assigned
     */
    async getAvailableOrders(
        latitude?: number,
        longitude?: number
    ): Promise<
        ApiResponse<{ orders: DeliveryOrder[]; total_count: number }>
    > {
        try {
            let url = '/orders/delivery/available';

            // Add location parameters if provided
            if (latitude !== undefined && longitude !== undefined) {
                url += `?latitude=${latitude}&longitude=${longitude}`;
            }

            const response = await apiRequest<{ orders: DeliveryOrder[]; total_count: number }>(url);
            return response;
        } catch (error) {
            console.error('Get available orders error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch available orders',
                statusCode: 0,
            };
        }
    },

    /**
     * Accept a delivery assignment
     */
    async acceptDelivery(orderId: string): Promise<ApiResponse<DeliveryOrder>> {
        try {
            const response = await apiRequest<DeliveryOrder>(`/orders/${orderId}/accept-delivery`, {
                method: 'POST',
            });
            return response;
        } catch (error) {
            console.error('Accept delivery error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to accept delivery',
                statusCode: 0,
            };
        }
    },

    /**
     * Get active deliveries
     * Orders currently being delivered by this partner
     */
    async getActiveDeliveries(): Promise<
        ApiResponse<{ orders: DeliveryOrder[]; total_count: number }>
    > {
        try {
            const response = await apiRequest<{ orders: DeliveryOrder[]; total_count: number }>(
                '/orders/delivery/active'
            );
            return response;
        } catch (error) {
            console.error('Get active deliveries error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch active deliveries',
                statusCode: 0,
            };
        }
    },

    /**
     * Get specific order details
     */
    async getOrderDetails(orderId: string): Promise<ApiResponse<DeliveryOrder>> {
        try {
            const response = await apiRequest<DeliveryOrder>(`/orders/${orderId}`);
            return response;
        } catch (error) {
            console.error('Get order details error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch order details',
                statusCode: 0,
            };
        }
    },

    /**
     * Mark order as picked up from restaurant
     */
    async markPickedUp(orderId: string): Promise<ApiResponse<DeliveryOrder>> {
        try {
            const response = await apiRequest<DeliveryOrder>(`/orders/${orderId}/pickup-complete`, {
                method: 'POST',
            });
            return response;
        } catch (error) {
            console.error('Mark picked up error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to mark as picked up',
                statusCode: 0,
            };
        }
    },

    /**
     * Complete delivery with OTP verification
     */
    async completeDelivery(
        orderId: string,
        otp: string,
        proofPhoto?: string
    ): Promise<ApiResponse<DeliveryOrder>> {
        try {
            const response = await apiRequest<DeliveryOrder>(`/orders/${orderId}/deliver`, {
                method: 'POST',
                body: JSON.stringify({
                    delivery_otp: otp,
                    proof_of_delivery: proofPhoto,
                }),
            });
            return response;
        } catch (error) {
            console.error('Complete delivery error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to complete delivery',
                statusCode: 0,
            };
        }
    },

    /**
     * Update delivery partner location
     */
    async updateLocation(
        orderId: string,
        latitude: number,
        longitude: number
    ): Promise<ApiResponse<{ message: string }>> {
        try {
            const response = await apiRequest<{ message: string }>(
                `/orders/${orderId}/update-location`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        latitude,
                        longitude,
                    }),
                }
            );
            return response;
        } catch (error) {
            console.error('Update location error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update location',
                statusCode: 0,
            };
        }
    },

    /**
     * Get earnings summary
     */
    async getEarnings(
        startDate?: string,
        endDate?: string
    ): Promise<ApiResponse<EarningsSummary>> {
        try {
            let url = '/orders/delivery/earnings';
            const params = new URLSearchParams();

            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await apiRequest<EarningsSummary>(url);
            return response;
        } catch (error) {
            console.error('Get earnings error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch earnings',
                statusCode: 0,
            };
        }
    },
};

export default deliveryOrderService;
