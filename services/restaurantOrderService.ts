import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/environment';

// API Configuration
const API_BASE_URL = ENV.API_BASE_URL;

// Storage keys
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
};

// Type Definitions
export interface OrderItem {
    order_item_id: string;
    food_item_id: string;
    food_item_name: string;
    food_item_image?: string;
    variant_id?: string;
    variant_name?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    special_instructions?: string;
}

export interface Customer {
    user_id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
}

export interface DeliveryAddress {
    address_id: string;
    title: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    latitude: number;
    longitude: number;
}

export interface RestaurantOrder {
    order_id: string;
    order_number: string;
    customer_id: string;
    customer: Customer;
    delivery_address_id: string;
    delivery_address: DeliveryAddress;
    subtotal: number;
    tax_amount: number;
    delivery_fee: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    estimated_delivery_time?: string;
    special_instructions?: string;
    created_at: string;
    updated_at: string;
}

export interface RestaurantOrderDetail extends RestaurantOrder {
    items: OrderItem[];
}

export interface OrderAnalytics {
    total_orders: number;
    pending_orders: number;
    active_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    average_order_value: number;
    orders_by_status: Record<string, number>;
    revenue_by_day: Array<{ date: string; revenue: number }>;
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
                'Accept': 'application/json',
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

// Restaurant Order Service
export const restaurantOrderService = {
    // Get pending orders (awaiting acceptance)
    async getPendingOrders(): Promise<ApiResponse<{ orders: RestaurantOrder[]; total_count: number }>> {
        try {
            const response = await apiRequest<{ orders: RestaurantOrder[]; total_count: number }>(
                '/orders/restaurant/pending'
            );
            return response;
        } catch (error) {
            console.error('Get pending orders error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch pending orders',
                statusCode: 0,
            };
        }
    },

    // Get active orders (accepted, preparing, ready for pickup)
    async getActiveOrders(): Promise<ApiResponse<{ orders: RestaurantOrder[]; total_count: number }>> {
        try {
            const response = await apiRequest<{ orders: RestaurantOrder[]; total_count: number }>(
                '/orders/restaurant/active'
            );
            return response;
        } catch (error) {
            console.error('Get active orders error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch active orders',
                statusCode: 0,
            };
        }
    },

    // Get order history (completed, cancelled, rejected)
    async getOrderHistory(
        page: number = 1,
        limit: number = 20
    ): Promise<ApiResponse<{ orders: RestaurantOrder[]; total_count: number; has_more: boolean }>> {
        try {
            const response = await apiRequest<{ orders: RestaurantOrder[]; total_count: number; has_more: boolean }>(
                `/orders/restaurant/history?page=${page}&limit=${limit}`
            );
            return response;
        } catch (error) {
            console.error('Get order history error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch order history',
                statusCode: 0,
            };
        }
    },

    // Get specific order details
    async getOrderDetails(orderId: string): Promise<ApiResponse<RestaurantOrderDetail>> {
        try {
            const response = await apiRequest<RestaurantOrderDetail>(`/orders/${orderId}`);
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

    // Accept a pending order
    async acceptOrder(
        orderId: string,
        prepTimeMinutes: number
    ): Promise<ApiResponse<RestaurantOrder>> {
        try {
            const response = await apiRequest<RestaurantOrder>(
                `/orders/${orderId}/accept`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        prep_time_minutes: prepTimeMinutes,
                    }),
                }
            );
            return response;
        } catch (error) {
            console.error('Accept order error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to accept order',
                statusCode: 0,
            };
        }
    },

    // Reject a pending order
    async rejectOrder(
        orderId: string,
        rejectionReason: string
    ): Promise<ApiResponse<RestaurantOrder>> {
        try {
            const response = await apiRequest<RestaurantOrder>(
                `/orders/${orderId}/reject`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        rejection_reason: rejectionReason,
                    }),
                }
            );
            return response;
        } catch (error) {
            console.error('Reject order error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to reject order',
                statusCode: 0,
            };
        }
    },

    // Update order status (preparing, ready_for_pickup)
    async updateOrderStatus(
        orderId: string,
        newStatus: 'preparing' | 'ready_for_pickup'
    ): Promise<ApiResponse<RestaurantOrder>> {
        try {
            const response = await apiRequest<RestaurantOrder>(
                `/orders/${orderId}/update-status`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        new_status: newStatus,
                    }),
                }
            );
            return response;
        } catch (error) {
            console.error('Update order status error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update order status',
                statusCode: 0,
            };
        }
    },

    // Get restaurant analytics
    async getAnalytics(
        startDate?: string,
        endDate?: string
    ): Promise<ApiResponse<OrderAnalytics>> {
        try {
            let url = '/orders/restaurant/analytics';
            const params = new URLSearchParams();

            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await apiRequest<OrderAnalytics>(url);
            return response;
        } catch (error) {
            console.error('Get analytics error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch analytics',
                statusCode: 0,
            };
        }
    },
};

export default restaurantOrderService;
