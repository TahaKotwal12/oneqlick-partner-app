import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapUtils } from '../config/maps';
import { userAPI } from '../services/api';

// Address interface matching backend schema
export interface Address {
  address_id: string;
  title: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  address_type: 'home' | 'work' | 'restaurant' | 'other';
  landmark?: string;
  full_name: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

// Address store state
interface AddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  isManuallySelected: boolean; // Track if address was manually selected by user
  isLoading: boolean;
  error: string | null;
}

// Address store actions
interface AddressActions {
  // Address management
  addAddress: (address: Omit<Address, 'address_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setSelectedAddress: (address: Address | null) => void;
  setManuallySelectedAddress: (address: Address | null) => void;
  setDefaultAddress: (id: string) => Promise<void>;
  
  // Address operations
  getAddressById: (id: string) => Address | undefined;
  getAddressesByType: (type: Address['address_type']) => Address[];
  getDefaultAddress: () => Address | undefined;
  searchAddresses: (query: string) => Address[];
  
  // API operations
  fetchAddresses: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility functions
  calculateDistance: (addressId: string, targetCoordinates: {latitude: number, longitude: number}) => number;
  getNearestAddresses: (targetCoordinates: {latitude: number, longitude: number}, limit?: number) => Address[];
}

// Address store type
export type AddressStore = AddressState & AddressActions;

// Initial state - start with empty addresses
const initialState: AddressState = {
  addresses: [],
  selectedAddress: null,
  isManuallySelected: false,
  isLoading: false,
  error: null,
};

// Address store
export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Add new address
      addAddress: async (addressData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await userAPI.addAddress(addressData);
          
          if (response.success && response.data) {
            const newAddress: Address = response.data;
            
            set((state) => {
              const newAddresses = [...state.addresses, newAddress];
              
              return {
                addresses: newAddresses,
                selectedAddress: newAddress,
                isLoading: false,
              };
            });
          } else {
            throw new Error(response.error || 'Failed to add address');
          }
        } catch (error) {
          console.error('Error adding address:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add address',
            isLoading: false 
          });
          throw error;
        }
      },

      // Update existing address
      updateAddress: async (id, addressData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await userAPI.updateAddress(id, addressData);
          
          if (response.success && response.data) {
            const updatedAddress: Address = response.data;
            
            set((state) => ({
              addresses: state.addresses.map((addr) =>
                addr.address_id === id ? updatedAddress : addr
              ),
              selectedAddress: state.selectedAddress?.address_id === id 
                ? updatedAddress
                : state.selectedAddress,
              isLoading: false,
            }));
          } else {
            throw new Error(response.error || 'Failed to update address');
          }
        } catch (error) {
          console.error('Error updating address:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update address',
            isLoading: false 
          });
          throw error;
        }
      },

      // Delete address
      deleteAddress: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await userAPI.deleteAddress(id);
          
          if (response.success) {
            set((state) => {
              const newAddresses = state.addresses.filter(addr => addr.address_id !== id);
              
              return {
                addresses: newAddresses,
                selectedAddress: state.selectedAddress?.address_id === id ? null : state.selectedAddress,
                isLoading: false,
              };
            });
          } else {
            throw new Error(response.error || 'Failed to delete address');
          }
        } catch (error) {
          console.error('Error deleting address:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete address',
            isLoading: false 
          });
          throw error;
        }
      },

      // Set selected address
      setSelectedAddress: (address) => {
        set({ selectedAddress: address });
      },

      // Set manually selected address (from addresses page)
      setManuallySelectedAddress: (address) => {
        set({ 
          selectedAddress: address,
          isManuallySelected: true 
        });
      },

      // Set default address
      setDefaultAddress: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await userAPI.updateAddress(id, { is_default: true });
          
          if (response.success) {
            set((state) => ({
              addresses: state.addresses.map((addr) => ({
                ...addr,
                is_default: addr.address_id === id,
              })),
              isLoading: false,
            }));
          } else {
            throw new Error(response.error || 'Failed to set default address');
          }
        } catch (error) {
          console.error('Error setting default address:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to set default address',
            isLoading: false 
          });
          throw error;
        }
      },

      // Get address by ID
      getAddressById: (id) => {
        return get().addresses.find(addr => addr.address_id === id);
      },

      // Get addresses by type
      getAddressesByType: (type) => {
        return get().addresses.filter(addr => addr.address_type === type);
      },

      // Get default address
      getDefaultAddress: () => {
        return get().addresses.find(addr => addr.is_default);
      },

      // Search addresses
      searchAddresses: (query) => {
        const addresses = get().addresses;
        const lowercaseQuery = query.toLowerCase();
        
        return addresses.filter(addr => 
          addr.full_name.toLowerCase().includes(lowercaseQuery) ||
          addr.address_line1.toLowerCase().includes(lowercaseQuery) ||
          addr.city.toLowerCase().includes(lowercaseQuery) ||
          (addr.landmark?.toLowerCase().includes(lowercaseQuery)) ||
          addr.postal_code.includes(query)
        );
      },

      // Fetch addresses from backend
      fetchAddresses: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await userAPI.getAddresses();
          
          if (response.success && response.data) {
            set({
              addresses: response.data,
              isLoading: false,
            });
          } else {
            throw new Error(response.error || 'Failed to fetch addresses');
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch addresses',
            isLoading: false 
          });
          throw error;
        }
      },

      // Sync with backend
      syncWithBackend: async () => {
        await get().fetchAddresses();
      },

      // Calculate distance between address and target coordinates
      calculateDistance: (addressId, targetCoordinates) => {
        const address = get().getAddressById(addressId);
        if (!address || !address.latitude || !address.longitude) return 0;
        
        return MapUtils.calculateDistance(
          address.latitude,
          address.longitude,
          targetCoordinates.latitude,
          targetCoordinates.longitude
        );
      },

      // Get nearest addresses
      getNearestAddresses: (targetCoordinates, limit = 5) => {
        const addresses = get().addresses;
        
        return addresses
          .filter(addr => addr.latitude && addr.longitude)
          .map(addr => ({
            ...addr,
            distance: MapUtils.calculateDistance(
              addr.latitude!,
              addr.longitude!,
              targetCoordinates.latitude,
              targetCoordinates.longitude
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, limit);
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Set error
      setError: (error) => {
        set({ error });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'address-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        addresses: state.addresses,
        selectedAddress: state.selectedAddress,
      }),
    }
  )
);

// Address store selectors
export const addressSelectors = {
  // Get all addresses
  getAllAddresses: (state: AddressStore) => state.addresses,
  
  // Get selected address
  getSelectedAddress: (state: AddressStore) => state.selectedAddress,
  
  // Get default address
  getDefaultAddress: (state: AddressStore) => state.addresses.find(addr => addr.is_default),
  
  // Get addresses by type
  getAddressesByType: (state: AddressStore, type: Address['address_type']) => 
    state.addresses.filter(addr => addr.address_type === type),
  
  // Get home addresses
  getHomeAddresses: (state: AddressStore) => 
    state.addresses.filter(addr => addr.address_type === 'home'),
  
  // Get work addresses
  getWorkAddresses: (state: AddressStore) => 
    state.addresses.filter(addr => addr.address_type === 'work'),
  
  // Get restaurant addresses
  getRestaurantAddresses: (state: AddressStore) => 
    state.addresses.filter(addr => addr.address_type === 'restaurant'),
  
  // Get loading state
  getIsLoading: (state: AddressStore) => state.isLoading,
  
  // Get error
  getError: (state: AddressStore) => state.error,
  
  // Get address count
  getAddressCount: (state: AddressStore) => state.addresses.length,
  
  // Get address count by type
  getAddressCountByType: (state: AddressStore, type: Address['address_type']) => 
    state.addresses.filter(addr => addr.address_type === type).length,
};
