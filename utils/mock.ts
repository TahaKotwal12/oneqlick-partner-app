// oneQlick/utils/mock.ts

// Import the mock data files. NOTE: Paths here are relative to utils/mock.ts
// Assuming your JSON files are inside 'oneQlick/src/mock/' and utils/mock.ts is inside 'oneQlick/utils/'
import deliveryOrders from '../src/mock/delivery_orders.json';
import restaurantOrders from '../src/mock/restaurant_orders.json';
import menuItems from '../src/mock/menu_items.json';
import profile from '../src/mock/profile.json';

// Set up a constant to easily switch between mock and real API
export const USE_MOCK = true;

// --- EXPORTED MOCK FETCH FUNCTIONS ---

// Function to simulate fetching delivery orders
export const getDeliveryOrders = () => {
  if (USE_MOCK) {
    // Return a copy of the mock data to allow local state manipulation
    return JSON.parse(JSON.stringify(deliveryOrders)); 
  }
  // TODO: Add logic to fetch from real API here
  return [];
};

// Function to simulate fetching restaurant orders
export const getRestaurantOrders = () => {
  if (USE_MOCK) {
    return JSON.parse(JSON.stringify(restaurantOrders)); 
  }
  // TODO: Add logic to fetch from real API here
  return [];
};

// Function to simulate fetching menu items
export const getMenuItems = () => {
  if (USE_MOCK) {
    return JSON.parse(JSON.stringify(menuItems)); 
  }
  // TODO: Add logic to fetch from real API here
  return [];
};

// Function to simulate fetching partner profile
// CRITICAL: This fixes the "getProfile is not a function" error in Task 3
export const getProfile = () => {
  if (USE_MOCK) {
    return JSON.parse(JSON.stringify(profile));
  }
  // TODO: Add logic to fetch from real API here
  return {};
};