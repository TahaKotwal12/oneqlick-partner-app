import { ApiResponse, Order, FoodItem } from '../types';
import { apiClient } from '../api/client';

// ============================================================================
// RESTAURANT OWNER APIs
// ============================================================================

export const partnerAPI = {
    restaurant: {
        /**
         * Get all orders for restaurant owner
         */
        getOrders: async (status?: string): Promise<ApiResponse<Order[]>> => {
            try {
                const endpoint = status
                    ? `/partner/restaurant/orders?status=${status}`
                    : '/partner/restaurant/orders';

                const response = await apiClient.get<{
                    orders: Order[];
                    total_count: number;
                    has_more: boolean;
                }>(endpoint, true);

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data.orders,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to fetch orders',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                console.error('Get orders error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch orders',
                    statusCode: 500,
                };
            }
        },

        /**
         * Get specific order details
         */
        getOrderDetails: async (orderId: string): Promise<ApiResponse<Order>> => {
            try {
                const response = await apiClient.get<Order>(
                    `/partner/restaurant/orders/${orderId}`,
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to fetch order details',
                    statusCode: response.statusCode || 404,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch order details',
                    statusCode: 500,
                };
            }
        },

        /**
         * Update order status
         */
        updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
            try {
                const response = await apiClient.put<Order>(
                    `/partner/restaurant/orders/${orderId}/status`,
                    { status },
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to update order status',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to update order status',
                    statusCode: 500,
                };
            }
        },

        /**
         * Get restaurant statistics
         */
        getStats: async (): Promise<ApiResponse<any>> => {
            try {
                const response = await apiClient.get<{
                    today_orders: number;
                    pending_orders: number;
                    revenue_today: number;
                    avg_preparation_time: number;
                    total_orders_this_month: number;
                    revenue_this_month: number;
                }>('/partner/restaurant/stats', true);

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to fetch statistics',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch statistics',
                    statusCode: 500,
                };
            }
        },

        /**
         * Get menu items
         */
        getMenu: async (): Promise<ApiResponse<FoodItem[]>> => {
            try {
                const response = await apiClient.get<{
                    items: FoodItem[];
                    total_count: number;
                }>('/partner/restaurant/menu', true);

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data.items,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to fetch menu',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch menu',
                    statusCode: 500,
                };
            }
        },

        /**
         * Update menu item status (availability)
         */
        updateMenuItemStatus: async (
            itemId: string,
            isAvailable: boolean
        ): Promise<ApiResponse<FoodItem>> => {
            try {
                const response = await apiClient.put<FoodItem>(
                    `/partner/restaurant/menu/${itemId}/availability`,
                    { is_available: isAvailable },
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to update menu item status',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to update menu item status',
                    statusCode: 500,
                };
            }
        },

        /**
         * Create menu item
         */
        createMenuItem: async (itemData: {
            name: string;
            price: number;
            description: string;
            category_id: string;
            image_url?: string;
            is_veg?: boolean;
            ingredients?: string;
            prep_time?: number;
        }): Promise<ApiResponse<FoodItem>> => {
            try {
                const response = await apiClient.post<FoodItem>(
                    '/partner/restaurant/menu',
                    itemData,
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 201,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to create menu item',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to create menu item',
                    statusCode: 500,
                };
            }
        },

        /**
         * Update menu item
         */
        updateMenuItem: async (
            itemId: string,
            itemData: {
                name?: string;
                price?: number;
                description?: string;
                image_url?: string;
            }
        ): Promise<ApiResponse<FoodItem>> => {
            try {
                const response = await apiClient.put<FoodItem>(
                    `/partner/restaurant/menu/${itemId}`,
                    itemData,
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to update menu item',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to update menu item',
                    statusCode: 500,
                };
            }
        },

        /**
         * Delete menu item
         */
        deleteMenuItem: async (itemId: string): Promise<ApiResponse<void>> => {
            try {
                const response = await apiClient.delete<{ deleted: boolean }>(
                    `/partner/restaurant/menu/${itemId}`,
                    true
                );

                if (response.success) {
                    return {
                        success: true,
                        data: undefined,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to delete menu item',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to delete menu item',
                    statusCode: 500,
                };
            }
        },

        /**
         * Get earnings
         */
        getEarnings: async (period: string): Promise<ApiResponse<any>> => {
            try {
                const response = await apiClient.get<any>(
                    `/partner/restaurant/earnings?period=${period}`,
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to fetch earnings',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch earnings',
                    statusCode: 500,
                };
            }
        },
    },

    // ============================================================================
    // DELIVERY PARTNER APIs
    // ============================================================================

    delivery: {
        /**
         * Get available delivery requests
         */
        getRequests: async (): Promise<ApiResponse<Order[]>> => {
            try {
                const response = await apiClient.get<{
                    requests: Order[];
                    total_count: number;
                }>('/partner/delivery/requests', true);

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data.requests,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to fetch delivery requests',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch delivery requests',
                    statusCode: 500,
                };
            }
        },

        /**
         * Accept delivery request
         */
        acceptRequest: async (orderId: string): Promise<ApiResponse<Order>> => {
            try {
                const response = await apiClient.post<Order>(
                    `/partner/delivery/requests/${orderId}/accept`,
                    {},
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to accept delivery request',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to accept delivery request',
                    statusCode: 500,
                };
            }
        },

        /**
         * Update delivery status
         */
        updateDeliveryStatus: async (
            orderId: string,
            status: string
        ): Promise<ApiResponse<Order>> => {
            try {
                const response = await apiClient.put<Order>(
                    `/partner/delivery/orders/${orderId}/status`,
                    { status },
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to update delivery status',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to update delivery status',
                    statusCode: 500,
                };
            }
        },

        /**
         * Toggle availability (online/offline)
         */
        toggleAvailability: async (isOnline: boolean): Promise<ApiResponse<{ is_online: boolean }>> => {
            try {
                const response = await apiClient.put<{ is_online: boolean }>(
                    '/partner/delivery/availability',
                    { is_online: isOnline },
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to update availability',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to update availability',
                    statusCode: 500,
                };
            }
        },

        /**
         * Get delivery earnings
         */
        getEarnings: async (period: string): Promise<ApiResponse<any>> => {
            try {
                const response = await apiClient.get<any>(
                    `/partner/delivery/earnings?period=${period}`,
                    true
                );

                if (response.success && response.data) {
                    return {
                        success: true,
                        data: response.data,
                        statusCode: 200,
                    };
                }

                return {
                    success: false,
                    error: response.error || 'Failed to fetch earnings',
                    statusCode: response.statusCode || 400,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch earnings',
                    statusCode: 500,
                };
            }
        },
    },
};