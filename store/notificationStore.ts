import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  type: 'order' | 'offer' | 'promotion' | 'system' | 'restaurant';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (notificationId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getUnreadCount: () => number;
  getNotifications: () => Notification[];
  getUnreadNotifications: () => Notification[];
}

type NotificationStore = NotificationState & NotificationActions;

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Delivered Successfully!',
    message:
      'Your order from Spice Garden has been delivered. Hope you enjoy your delicious meal!',
    timestamp: '2 minutes ago',
    isRead: false,
    actionUrl: '/order-tracking',
    priority: 'high',
  },
  {
    id: '2',
    type: 'offer',
    title: 'MEGA PIZZA SALE - 50% OFF!',
    message:
      'Get 50% off on all pizzas at Pizza Palace. Valid till midnight today! Limited time offer.',
    timestamp: '1 hour ago',
    isRead: false,
    actionUrl: '/restaurant/pizza-palace',
    priority: 'high',
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Free Delivery Weekend!',
    message:
      'Enjoy free delivery on all orders above ₹199 this weekend. No hidden charges!',
    timestamp: '3 hours ago',
    isRead: false,
    priority: 'medium',
  },
  {
    id: '4',
    type: 'restaurant',
    title: 'New Restaurant: Chinese Wok',
    message:
      'Chinese Wok is now available in your area. Try their authentic Chinese cuisine with special launch offers!',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: '/restaurant/chinese-wok',
    priority: 'medium',
  },
  {
    id: '5',
    type: 'system',
    title: 'App Update Available',
    message:
      'A new version of oneQlick is available with exciting features and performance improvements!',
    timestamp: '2 days ago',
    isRead: true,
    priority: 'low',
  },
  {
    id: '6',
    type: 'order',
    title: 'Order Confirmed',
    message:
      'Your order from Dosa Corner has been confirmed and the restaurant is preparing your food.',
    timestamp: '2 days ago',
    isRead: true,
    actionUrl: '/order-tracking',
    priority: 'medium',
  },
];

// This is the new, correct structure.
// We define the default state INSIDE the 'persist' function.
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      // 1. Default state is defined here (this fixes the "resetting" bug)
      notifications: sampleNotifications,
      unreadCount: sampleNotifications.filter((n) => !n.isRead).length,
      isLoading: false,
      error: null,

      // 2. All your functions (actions)
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        set({ notifications, unreadCount });
      },

      // This is the CORRECT function for marking one item as read
      markAsRead: (notificationId) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true } // This just sets isRead to true
              : notification
          );
          const unreadCount = updatedNotifications.filter(
            (n) => !n.isRead
          ).length;
          return { notifications: updatedNotifications, unreadCount };
        });
      },

      // This is the CORRECT function for 'Mark all as read'
      markAllAsRead: () => {
        set((state) => {
          if (!state.notifications || state.notifications.length === 0) {
            return state;
          }
          // Ensure all properties are preserved when marking as read
          const updatedNotifications = state.notifications.map(
            (notification) => {
              // Preserve all existing properties
              return {
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                timestamp: notification.timestamp,
                isRead: true, // Mark as read
                actionUrl: notification.actionUrl,
                priority: notification.priority,
              };
            }
          );
          return { notifications: updatedNotifications, unreadCount: 0 };
        });
      },

      addNotification: (notification) => {
        set((state) => {
          const updatedNotifications = [notification, ...state.notifications];
          const unreadCount = updatedNotifications.filter(
            (n) => !n.isRead
          ).length;
          return { notifications: updatedNotifications, unreadCount };
        });
      },

      removeNotification: (notificationId) => {
        set((state) => {
          const updatedNotifications = state.notifications.filter(
            (notification) => notification.id !== notificationId
          );
          const unreadCount = updatedNotifications.filter(
            (n) => !n.isRead
          ).length;
          return { notifications: updatedNotifications, unreadCount };
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      getUnreadCount: () => {
        const state = get();
        return state.notifications.filter((n) => !n.isRead).length;
      },

      getNotifications: () => {
        const state = get();
        return state.notifications;
      },

      getUnreadNotifications: () => {
        const state = get();
        return state.notifications.filter((n) => !n.isRead);
      },
    }),
    {
      name: 'notification-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);