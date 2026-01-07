import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import restaurantOrderService, {
    RestaurantOrder,
    RestaurantOrderDetail,
    OrderAnalytics,
} from '../services/restaurantOrderService';

interface RestaurantOrderStore {
    // State
    pendingOrders: RestaurantOrder[];
    activeOrders: RestaurantOrder[];
    orderHistory: RestaurantOrder[];
    selectedOrder: RestaurantOrderDetail | null;
    analytics: OrderAnalytics | null;
    isLoading: boolean;
    error: string | null;
    pendingCount: number;
    activeCount: number;

    // Actions
    fetchPendingOrders: () => Promise<{ success: boolean; error?: string }>;
    fetchActiveOrders: () => Promise<{ success: boolean; error?: string }>;
    fetchOrderHistory: (page?: number, limit?: number) => Promise<{ success: boolean; error?: string }>;
    fetchOrderDetails: (orderId: string) => Promise<{ success: boolean; error?: string }>;
    acceptOrder: (orderId: string, prepTimeMinutes: number) => Promise<{ success: boolean; error?: string }>;
    rejectOrder: (orderId: string, reason: string) => Promise<{ success: boolean; error?: string }>;
    updateOrderStatus: (orderId: string, newStatus: 'preparing' | 'ready_for_pickup') => Promise<{ success: boolean; error?: string }>;
    fetchAnalytics: (startDate?: string, endDate?: string) => Promise<{ success: boolean; error?: string }>;
    refreshAllOrders: () => Promise<void>;
    clearError: () => void;
    clearSelectedOrder: () => void;
    resetStore: () => void;
}

export const useRestaurantOrderStore = create<RestaurantOrderStore>()(
    persist(
        (set, get) => ({
            // Initial State
            pendingOrders: [],
            activeOrders: [],
            orderHistory: [],
            selectedOrder: null,
            analytics: null,
            isLoading: false,
            error: null,
            pendingCount: 0,
            activeCount: 0,

            // Fetch Pending Orders
            fetchPendingOrders: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await restaurantOrderService.getPendingOrders();

                    if (response.success && response.data) {
                        set({
                            pendingOrders: response.data.orders,
                            pendingCount: response.data.total_count,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ isLoading: false, error: response.error || 'Failed to fetch pending orders' });
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pending orders';
                    set({ isLoading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            // Fetch Active Orders
            fetchActiveOrders: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await restaurantOrderService.getActiveOrders();

                    if (response.success && response.data) {
                        set({
                            activeOrders: response.data.orders,
                            activeCount: response.data.total_count,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ isLoading: false, error: response.error || 'Failed to fetch active orders' });
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active orders';
                    set({ isLoading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            // Fetch Order History
            fetchOrderHistory: async (page = 1, limit = 20) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await restaurantOrderService.getOrderHistory(page, limit);

                    if (response.success && response.data) {
                        // If page 1, replace; otherwise append
                        const updatedHistory = page === 1
                            ? response.data.orders
                            : [...get().orderHistory, ...response.data.orders];

                        set({
                            orderHistory: updatedHistory,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ isLoading: false, error: response.error || 'Failed to fetch order history' });
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order history';
                    set({ isLoading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            // Fetch Order Details
            fetchOrderDetails: async (orderId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await restaurantOrderService.getOrderDetails(orderId);

                    if (response.success && response.data) {
                        set({
                            selectedOrder: response.data,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ isLoading: false, error: response.error || 'Failed to fetch order details' });
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order details';
                    set({ isLoading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            // Accept Order
            acceptOrder: async (orderId, prepTimeMinutes) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await restaurantOrderService.acceptOrder(orderId, prepTimeMinutes);

                    if (response.success && response.data) {
                        // Remove from pending, add to active
                        const updatedPending = get().pendingOrders.filter(o => o.order_id !== orderId);
                        const updatedActive = [response.data, ...get().activeOrders];

                        set({
                            pendingOrders: updatedPending,
                            activeOrders: updatedActive,
                            pendingCount: get().pendingCount - 1,
                            activeCount: get().activeCount + 1,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ isLoading: false, error: response.error || 'Failed to accept order' });
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to accept order';
                    set({ isLoading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            // Reject Order
            rejectOrder: async (orderId, reason) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await restaurantOrderService.rejectOrder(orderId, reason);

                    if (response.success) {
                        // Remove from pending orders
                        const updatedPending = get().pendingOrders.filter(o => o.order_id !== orderId);

                        set({
                            pendingOrders: updatedPending,
                            pendingCount: get().pendingCount - 1,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ isLoading: false, error: response.error || 'Failed to reject order' });
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to reject order';
                    set({ isLoading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            // Update Order Status
            updateOrderStatus: async (orderId, newStatus) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await restaurantOrderService.updateOrderStatus(orderId, newStatus);

                    if (response.success && response.data) {
                        // Update the order in active orders list
                        const updatedActive = get().activeOrders.map(order =>
                            order.order_id === orderId ? response.data! : order
                        );

                        set({
                            activeOrders: updatedActive,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ isLoading: false, error: response.error || 'Failed to update order status' });
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
                    set({ isLoading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            // Fetch Analytics
            fetchAnalytics: async (startDate?, endDate?) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await restaurantOrderService.getAnalytics(startDate, endDate);

                    if (response.success && response.data) {
                        set({
                            analytics: response.data,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ isLoading: false, error: response.error || 'Failed to fetch analytics' });
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics';
                    set({ isLoading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            // Refresh All Orders
            refreshAllOrders: async () => {
                await Promise.all([
                    get().fetchPendingOrders(),
                    get().fetchActiveOrders(),
                ]);
            },

            // Clear Error
            clearError: () => {
                set({ error: null });
            },

            // Clear Selected Order
            clearSelectedOrder: () => {
                set({ selectedOrder: null });
            },

            // Reset Store
            resetStore: () => {
                set({
                    pendingOrders: [],
                    activeOrders: [],
                    orderHistory: [],
                    selectedOrder: null,
                    analytics: null,
                    isLoading: false,
                    error: null,
                    pendingCount: 0,
                    activeCount: 0,
                });
            },
        }),
        {
            name: 'restaurant-order-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist order counts and history, not active orders
            partialize: (state) => ({
                orderHistory: state.orderHistory,
            }),
        }
    )
);

export default useRestaurantOrderStore;
