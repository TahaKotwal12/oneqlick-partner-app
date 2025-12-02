import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  // State
  isOnboardingComplete: boolean;
  isFirstLaunch: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    orderUpdates: boolean;
    offers: boolean;
    general: boolean;
  };
  isOnline: boolean;
  lastActiveTime: number;
  
  // Actions
  completeOnboarding: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  updateNotificationSettings: (settings: Partial<AppState['notifications']>) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastActiveTime: () => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isOnboardingComplete: false,
      isFirstLaunch: true,
      theme: 'light',
      language: 'en',
      notifications: {
        orderUpdates: true,
        offers: true,
        general: false,
      },
      isOnline: true,
      lastActiveTime: Date.now(),

      // Actions
      completeOnboarding: () => {
        set({
          isOnboardingComplete: true,
          isFirstLaunch: false,
        });
      },

      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme });
      },

      setLanguage: (language: string) => {
        set({ language });
      },

      updateNotificationSettings: (settings: Partial<AppState['notifications']>) => {
        set(state => ({
          notifications: {
            ...state.notifications,
            ...settings,
          },
        }));
      },

      setOnlineStatus: (isOnline: boolean) => {
        set({ isOnline });
      },

      updateLastActiveTime: () => {
        set({ lastActiveTime: Date.now() });
      },

      resetApp: () => {
        set({
          isOnboardingComplete: false,
          isFirstLaunch: true,
          theme: 'light',
          language: 'en',
          notifications: {
            orderUpdates: true,
            offers: true,
            general: false,
          },
          isOnline: true,
          lastActiveTime: Date.now(),
        });
      },
    }),
    {
      name: 'oneqlick-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOnboardingComplete: state.isOnboardingComplete,
        isFirstLaunch: state.isFirstLaunch,
        theme: state.theme,
        language: state.language,
        notifications: state.notifications,
      }),
    }
  )
);
