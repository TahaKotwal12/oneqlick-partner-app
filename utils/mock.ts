// oneQlick/utils/mock.ts (Example)

// Import the mock data files
import deliveryOrders from '../src/mock/delivery_orders.json';
import restaurantOrders from '../src/mock/restaurant_orders.json';
import menuItems from '../src/mock/menu_items.json';
import profile from '../src/mock/profile.json';

// Set up a constant to easily switch between mock and real API
export const USE_MOCK = true; // IMPORTANT: Set to false for real API integration later

// Function to simulate fetching delivery orders
export const getDeliveryOrders = () => {
  if (USE_MOCK) {
    // Return a copy of the mock data to allow local state manipulation
    return JSON.parse(JSON.stringify(deliveryOrders)); 
  }
  // TODO: Add logic to fetch from real API here
  return [];
};

// ... similarly for getRestaurantOrders, getMenuItems, getProfile, etc.