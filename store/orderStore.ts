import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  addOns?: Array<{
    name: string;
    price: number;
  }>;
}

export interface OrderDetails {
  id: string;
  restaurantName: string;
  restaurantPhone: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  discount: number;
  deliveryAddress: string;
  estimatedTime: string;
  currentStatus: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'rejected';
  userDetails: {
    name: string;
    phone: string;
  };
  driverInfo?: {
    name: string;
    phone: string;
    vehicle: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  orderDate: string;
  paymentMethod: string;
}

interface OrderStore {
  currentOrder: OrderDetails | null;
  orderHistory: OrderDetails[];
  setCurrentOrder: (order: OrderDetails) => void;
  updateOrderStatus: (orderId: string, status: OrderDetails['currentStatus']) => void;
  addToHistory: (order: OrderDetails) => void;
  clearCurrentOrder: () => void;
  getOrderById: (orderId: string) => OrderDetails | null;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      orderHistory: [],

      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },

      updateOrderStatus: (orderId, status) => {
        const { currentOrder, orderHistory } = get();
        
        if (currentOrder && currentOrder.id === orderId) {
          set({ 
            currentOrder: { ...currentOrder, currentStatus: status }
          });
        }

        set({
          orderHistory: orderHistory.map(order => 
            order.id === orderId 
              ? { ...order, currentStatus: status }
              : order
          )
        });
      },

      addToHistory: (order) => {
        set(state => ({
          orderHistory: [order, ...state.orderHistory]
        }));
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },

      getOrderById: (orderId) => {
        const { currentOrder, orderHistory } = get();
        
        if (currentOrder && currentOrder.id === orderId) {
          return currentOrder;
        }
        
        return orderHistory.find(order => order.id === orderId) || null;
      },
    }),
    {
      name: 'order-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        orderHistory: state.orderHistory,
        currentOrder: state.currentOrder 
      }),
    }
  )
);