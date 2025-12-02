import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem, CartItem, Cart, Offer } from '../types';

interface CartState {
  // State
  cart: Cart;
  isLoaded: boolean;
  
  // Actions
  addToCart: (foodItem: FoodItem, quantity?: number, customization?: Record<string, string>, addOns?: string[]) => Promise<void>;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyOffer: (offer: Offer) => void;
  removeOffer: (offerId: string) => void;
  calculateTotals: () => void;
  
  // Getters
  getCartItemCount: () => number;
  isCartEmpty: () => boolean;
  canCheckout: () => boolean;
  getRestaurantId: () => string | undefined;
}

const calculateCartTotals = (cart: Cart): Cart => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal >= 199 ? 0 : 49; // Free delivery above ₹199
  const platformFee = 5;
  const tax = Math.round((subtotal * 5) / 100); // 5% GST
  
  // Calculate discount from applied offers
  let discountAmount = 0;
  cart.appliedOffers.forEach(offer => {
    if (offer.type === 'percentage') {
      const discount = Math.min(subtotal * (offer.discount / 100), offer.maxDiscount || subtotal);
      discountAmount += discount;
    } else {
      discountAmount += offer.discount;
    }
  });
  
  const total = subtotal + deliveryFee + platformFee + tax - discountAmount;

  return {
    ...cart,
    subtotal,
    deliveryFee,
    tax,
    total: Math.max(0, total),
    discountAmount,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: {
        id: '',
        userId: '',
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0,
        appliedOffers: [],
        discountAmount: 0,
      },
      isLoaded: false,

      // Actions
      addToCart: async (foodItem: FoodItem, quantity = 1, customization, addOns = []) => {
        const { cart } = get();
        
        set(state => {
          const existingItemIndex = state.cart.items.findIndex(
            item => 
              item.foodItem.id === foodItem.id &&
              JSON.stringify(item.customization) === JSON.stringify(customization) &&
              JSON.stringify(item.addOns.map(a => a.id)) === JSON.stringify(addOns)
          );

          let updatedItems: CartItem[];

          if (existingItemIndex !== -1) {
            // Update existing item
            updatedItems = [...state.cart.items];
            updatedItems[existingItemIndex].quantity += quantity;
            updatedItems[existingItemIndex].totalPrice = 
              (updatedItems[existingItemIndex].foodItem.price + 
               updatedItems[existingItemIndex].addOns.reduce((sum, addOn) => sum + addOn.price, 0)) * 
              updatedItems[existingItemIndex].quantity;
          } else {
            // Add new item
            const addOnObjects = foodItem.addOns?.filter(addOn => addOns.includes(addOn.id)) || [];
            const addOnsTotal = addOnObjects.reduce((sum, addOn) => sum + addOn.price, 0);
            const itemTotalPrice = (foodItem.price + addOnsTotal) * quantity;

            const newItem: CartItem = {
              id: Date.now().toString(),
              foodItem,
              quantity,
              customization,
              addOns: addOns.map(addOnId => {
                const addOn = foodItem.addOns?.find(a => a.id === addOnId);
                return addOn || { id: addOnId, name: '', price: 0, isAvailable: true };
              }),
              totalPrice: itemTotalPrice,
            };

            updatedItems = [...state.cart.items, newItem];
          }

          const updatedCart = calculateCartTotals({
            ...state.cart,
            items: updatedItems,
          });

          return {
            cart: updatedCart,
          };
        });
      },

      removeFromCart: (itemId: string) => {
        set(state => {
          const updatedItems = state.cart.items.filter(item => item.id !== itemId);
          const updatedCart = calculateCartTotals({
            ...state.cart,
            items: updatedItems,
          });

          return {
            cart: updatedCart,
          };
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        set(state => {
          const updatedItems = state.cart.items.map(item => {
            if (item.id === itemId) {
              const addOnsTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
              return {
                ...item,
                quantity,
                totalPrice: (item.foodItem.price + addOnsTotal) * quantity,
              };
            }
            return item;
          });

          const updatedCart = calculateCartTotals({
            ...state.cart,
            items: updatedItems,
          });

          return {
            cart: updatedCart,
          };
        });
      },

      clearCart: () => {
        set({
          cart: {
            id: '',
            userId: '',
            items: [],
            subtotal: 0,
            deliveryFee: 0,
            tax: 0,
            total: 0,
            appliedOffers: [],
            discountAmount: 0,
          },
        });
      },

      applyOffer: (offer: Offer) => {
        set(state => {
          const updatedOffers = [...state.cart.appliedOffers, offer];
          const updatedCart = calculateCartTotals({
            ...state.cart,
            appliedOffers: updatedOffers,
          });

          return {
            cart: updatedCart,
          };
        });
      },

      removeOffer: (offerId: string) => {
        set(state => {
          const updatedOffers = state.cart.appliedOffers.filter(offer => offer.id !== offerId);
          const updatedCart = calculateCartTotals({
            ...state.cart,
            appliedOffers: updatedOffers,
          });

          return {
            cart: updatedCart,
          };
        });
      },

      calculateTotals: () => {
        set(state => {
          const updatedCart = calculateCartTotals(state.cart);
          return {
            cart: updatedCart,
          };
        });
      },

      // Getters
      getCartItemCount: () => {
        const { cart } = get();
        return cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      },

      isCartEmpty: () => {
        const { cart } = get();
        return cart.items.length === 0;
      },

      canCheckout: () => {
        const { cart } = get();
        return cart.items.length > 0 && cart.total > 0;
      },

      getRestaurantId: () => {
        const { cart } = get();
        if (cart.items.length === 0) return undefined;
        return cart.items[0].foodItem.id.split('_')[0]; // Assuming food item ID contains restaurant ID
      },
    }),
    {
      name: 'oneqlick-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cart: state.cart,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoaded = true;
        }
      },
    }
  )
);
