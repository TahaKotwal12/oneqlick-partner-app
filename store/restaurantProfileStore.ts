import { create } from 'zustand';
import {
    restaurantProfileService,
    RestaurantProfile,
    UpdateRestaurantProfileRequest,
    UpdateOperatingHoursRequest
} from '../services/restaurantProfileService';

interface RestaurantProfileState {
    profile: RestaurantProfile | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchProfile: () => Promise<void>;
    updateProfile: (data: UpdateRestaurantProfileRequest) => Promise<{ success: boolean; error?: string }>;
    updateOperatingHours: (data: UpdateOperatingHoursRequest) => Promise<{ success: boolean; error?: string }>;
    clearError: () => void;
}

export const useRestaurantProfileStore = create<RestaurantProfileState>((set, get) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await restaurantProfileService.getProfile();
            set({
                profile: response.data,
                isLoading: false
            });
        } catch (error: any) {
            console.error('Error fetching restaurant profile:', error);
            set({
                error: error.message || 'Failed to fetch restaurant profile',
                isLoading: false
            });
        }
    },

    updateProfile: async (data: UpdateRestaurantProfileRequest) => {
        set({ isLoading: true, error: null });
        try {
            const response = await restaurantProfileService.updateProfile(data);
            set({
                profile: response.data,
                isLoading: false
            });
            return { success: true };
        } catch (error: any) {
            console.error('Error updating restaurant profile:', error);
            const errorMessage = error.message || 'Failed to update restaurant profile';
            set({
                error: errorMessage,
                isLoading: false
            });
            return { success: false, error: errorMessage };
        }
    },

    updateOperatingHours: async (data: UpdateOperatingHoursRequest) => {
        set({ isLoading: true, error: null });
        try {
            const response = await restaurantProfileService.updateOperatingHours(data);
            set({
                profile: response.data,
                isLoading: false
            });
            return { success: true };
        } catch (error: any) {
            console.error('Error updating operating hours:', error);
            const errorMessage = error.message || 'Failed to update operating hours';
            set({
                error: errorMessage,
                isLoading: false
            });
            return { success: false, error: errorMessage };
        }
    },

    clearError: () => set({ error: null }),
}));
