import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import deliveryOrderService, {
    DeliveryOrder,
    EarningsSummary,
    DeliveryLocation,
    ApiResponse,
} from '../services/deliveryOrderService';

// Store State Interface
interface DeliveryOrderState {
    // Orders
    availableOrders: DeliveryOrder[];
    activeDeliveries: DeliveryOrder[];
    selectedOrder: DeliveryOrder | null;
    completedToday: DeliveryOrder[];

    // Partner Status
    isOnline: boolean;
    currentLocation: DeliveryLocation | null;

    // Earnings
    earnings: EarningsSummary | null;

    // UI State
    isLoading: boolean;
    error: string | null;
    availableCount: number;
    activeCount: number;

    // Actions
    fetchAvailableOrders: () => Promise<void>;
    fetchActiveDeliveries: () => Promise<void>;
    fetchOrderDetails: (orderId: string) => Promise<void>;
    acceptDelivery: (orderId: string) => Promise<ApiResponse<DeliveryOrder>>;
    markPickedUp: (orderId: string) => Promise<ApiResponse<DeliveryOrder>>;
    completeDelivery: (
        orderId: string,
        otp: string,
        proofPhoto?: string
    ) => Promise<ApiResponse<DeliveryOrder>>;
    updateLocation: (orderId: string, lat: number, lng: number) => Promise<void>;
    fetchEarnings: () => Promise<void>;
    toggleOnlineStatus: () => void;
    setCurrentLocation: (lat: number, lng: number) => void;
    refreshAll: () => Promise<void>;
    clearError: () => void;
    clearSelectedOrder: () => void;
    resetStore: () => void;
}

// Initial state
const initialState = {
    availableOrders: [],
    activeDeliveries: [],
    selectedOrder: null,
    completedToday: [],
    isOnline: false,
    currentLocation: null,
    earnings: null,
    isLoading: false,
    error: null,
    availableCount: 0,
    activeCount: 0,
};

// Create the store
export const useDeliveryOrderStore = create<DeliveryOrderState>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Fetch available orders
            fetchAvailableOrders: async () => {
                set({ isLoading: true, error: null });
                try {
                    const { currentLocation } = get();
                    const result = await deliveryOrderService.getAvailableOrders(
                        currentLocation?.latitude,
                        currentLocation?.longitude
                    );

                    if (result.success && result.data) {
                        set({
                            availableOrders: result.data.orders || [],
                            availableCount: result.data.total_count || 0,
                            isLoading: false,
                        });
                    } else {
                        set({
                            error: result.error || 'Failed to fetch available orders',
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Unknown error',
                        isLoading: false,
                    });
                }
            },

            // Fetch active deliveries
            fetchActiveDeliveries: async () => {
                set({ isLoading: true, error: null });
                try {
                    const result = await deliveryOrderService.getActiveDeliveries();

                    if (result.success && result.data) {
                        set({
                            activeDeliveries: result.data.orders || [],
                            activeCount: result.data.total_count || 0,
                            isLoading: false,
                        });
                    } else {
                        set({
                            error: result.error || 'Failed to fetch active deliveries',
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Unknown error',
                        isLoading: false,
                    });
                }
            },

            // Fetch order details
            fetchOrderDetails: async (orderId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await deliveryOrderService.getOrderDetails(orderId);

                    if (result.success && result.data) {
                        set({
                            selectedOrder: result.data,
                            isLoading: false,
                        });
                    } else {
                        set({
                            error: result.error || 'Failed to fetch order details',
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Unknown error',
                        isLoading: false,
                    });
                }
            },

            // Accept delivery
            acceptDelivery: async (orderId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await deliveryOrderService.acceptDelivery(orderId);

                    if (result.success && result.data) {
                        // Remove from available orders
                        const availableOrders = get().availableOrders.filter(
                            (order) => order.order_id !== orderId
                        );

                        // Add to active deliveries
                        const activeDeliveries = [...get().activeDeliveries, result.data];

                        set({
                            availableOrders,
                            activeDeliveries,
                            availableCount: availableOrders.length,
                            activeCount: activeDeliveries.length,
                            selectedOrder: result.data,
                            isLoading: false,
                        });
                    } else {
                        set({
                            error: result.error || 'Failed to accept delivery',
                            isLoading: false,
                        });
                    }

                    return result;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    set({ error: errorMessage, isLoading: false });
                    return { success: false, error: errorMessage, statusCode: 0 };
                }
            },

            // Mark picked up
            markPickedUp: async (orderId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await deliveryOrderService.markPickedUp(orderId);

                    if (result.success && result.data) {
                        // Update in active deliveries
                        const activeDeliveries = get().activeDeliveries.map((order) =>
                            order.order_id === orderId ? result.data! : order
                        );

                        set({
                            activeDeliveries,
                            selectedOrder: result.data,
                            isLoading: false,
                        });
                    } else {
                        set({
                            error: result.error || 'Failed to mark as picked up',
                            isLoading: false,
                        });
                    }

                    return result;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    set({ error: errorMessage, isLoading: false });
                    return { success: false, error: errorMessage, statusCode: 0 };
                }
            },

            // Complete delivery
            completeDelivery: async (orderId: string, otp: string, proofPhoto?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await deliveryOrderService.completeDelivery(orderId, otp, proofPhoto);

                    if (result.success && result.data) {
                        // Remove from active deliveries
                        const activeDeliveries = get().activeDeliveries.filter(
                            (order) => order.order_id !== orderId
                        );

                        // Add to completed today
                        const completedToday = [...get().completedToday, result.data];

                        set({
                            activeDeliveries,
                            completedToday,
                            activeCount: activeDeliveries.length,
                            selectedOrder: null,
                            isLoading: false,
                        });

                        // Refresh earnings
                        get().fetchEarnings();
                    } else {
                        set({
                            error: result.error || 'Failed to complete delivery',
                            isLoading: false,
                        });
                    }

                    return result;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    set({ error: errorMessage, isLoading: false });
                    return { success: false, error: errorMessage, statusCode: 0 };
                }
            },

            // Update location
            updateLocation: async (orderId: string, lat: number, lng: number) => {
                try {
                    await deliveryOrderService.updateLocation(orderId, lat, lng);
                    // Update current location in store
                    set({ currentLocation: { latitude: lat, longitude: lng } });
                } catch (error) {
                    console.error('Failed to update location:', error);
                    // Don't set error state for location updates (silent fail)
                }
            },

            // Fetch earnings
            fetchEarnings: async () => {
                try {
                    const result = await deliveryOrderService.getEarnings();

                    if (result.success && result.data) {
                        set({ earnings: result.data });
                    }
                } catch (error) {
                    console.error('Failed to fetch earnings:', error);
                }
            },

            // Toggle online status
            toggleOnlineStatus: () => {
                const newStatus = !get().isOnline;
                set({ isOnline: newStatus });

                // If going online, fetch available orders
                if (newStatus) {
                    get().fetchAvailableOrders();
                }
            },

            // Set current location
            setCurrentLocation: (lat: number, lng: number) => {
                set({ currentLocation: { latitude: lat, longitude: lng } });
            },

            // Refresh all data
            refreshAll: async () => {
                const { isOnline } = get();
                await Promise.all([
                    isOnline && get().fetchAvailableOrders(),
                    get().fetchActiveDeliveries(),
                    get().fetchEarnings(),
                ]);
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },

            // Clear selected order
            clearSelectedOrder: () => {
                set({ selectedOrder: null });
            },

            // Reset store
            resetStore: () => {
                set(initialState);
            },
        }),
        {
            name: 'delivery-order-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                isOnline: state.isOnline,
                currentLocation: state.currentLocation,
                completedToday: state.completedToday,
            }),
        }
    )
);

export default useDeliveryOrderStore;
