import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationState {
  // State
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  displayName: string;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  
  // Actions
  setLocation: (latitude: number, longitude: number, displayName: string) => void;
  setDisplayName: (displayName: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setPermission: (hasPermission: boolean) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      // Initial state
      currentLocation: null,
      displayName: 'Getting your location...',
      isLoading: false,
      error: null,
      hasPermission: false,

      // Actions
      setLocation: (latitude: number, longitude: number, displayName: string) => {
        set({
          currentLocation: { latitude, longitude },
          displayName,
          isLoading: false,
          error: null,
        });
      },

      setDisplayName: (displayName: string) => {
        set({ displayName });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      setPermission: (hasPermission: boolean) => {
        set({ hasPermission });
      },

      clearLocation: () => {
        set({
          currentLocation: null,
          displayName: 'Tap to set your location',
          isLoading: false,
          error: null,
          hasPermission: false,
        });
      },
    }),
    {
      name: 'oneqlick-location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentLocation: state.currentLocation,
        displayName: state.displayName,
        hasPermission: state.hasPermission,
      }),
    }
  )
);
