import { ApiResponse, Order, FoodItem } from '../types';

// Mock Data
const MOCK_ORDERS: Order[] = [
    {
        order_id: 'ord-001',
        order_number: 'ORD-1001',
        customer_id: 'cust-001',
        restaurant_id: 'rest-001',
        total_amount: 45.50,
        order_status: 'pending',
        created_at: new Date().toISOString(),
        items: [
            { food_item_id: 'food-1', quantity: 2, name: 'Butter Chicken', price: 15.00 },
            { food_item_id: 'food-2', quantity: 1, name: 'Naan', price: 3.50 }
        ] as any,
        payment_status: 'paid',
        delivery_address: '123 Main St, City'
    },
    {
        order_id: 'ord-002',
        order_number: 'ORD-1002',
        customer_id: 'cust-002',
        restaurant_id: 'rest-001',
        total_amount: 22.00,
        order_status: 'preparing',
        created_at: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
        items: [
            { food_item_id: 'food-3', quantity: 1, name: 'Veg Biryani', price: 12.00 }
        ] as any,
        payment_status: 'paid',
        delivery_address: '456 Park Ave, City'
    },
    {
        order_id: 'ord-003',
        order_number: 'ORD-1003',
        customer_id: 'cust-003',
        restaurant_id: 'rest-001',
        total_amount: 35.00,
        order_status: 'ready',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        items: [
            { food_item_id: 'food-1', quantity: 1, name: 'Butter Chicken', price: 15.00 }
        ] as any,
        payment_status: 'paid',
        delivery_address: '789 Road, City'
    }
];

const MOCK_MENU: FoodItem[] = [
    {
        food_item_id: 'food-1',
        restaurant_id: 'rest-001',
        name: 'Butter Chicken',
        description: 'Rich and creamy chicken curry',
        price: 15.00,
        is_veg: false,
        category_id: 'Main Course',
        image: 'https://via.placeholder.com/150',
        is_available: true,
        rating: 4.5,
        total_ratings: 100
    },
    {
        food_item_id: 'food-2',
        restaurant_id: 'rest-001',
        name: 'Garlic Naan',
        description: 'Oven baked flatbread with garlic',
        price: 3.50,
        is_veg: true,
        category_id: 'Breads',
        image: 'https://via.placeholder.com/150',
        is_available: true,
        rating: 4.8,
        total_ratings: 200
    },
    {
        food_item_id: 'food-3',
        restaurant_id: 'rest-001',
        name: 'Veg Biryani',
        description: 'Aromatic rice dish with vegetables',
        price: 12.00,
        is_veg: true,
        category_id: 'Main Course',
        image: 'https://via.placeholder.com/150',
        is_available: false,
        rating: 4.2,
        total_ratings: 50
    }
];

const MOCK_DELIVERY_REQUESTS: Order[] = [
    {
        order_id: 'ord-004',
        order_number: 'ORD-1004',
        customer_id: 'cust-004',
        restaurant_id: 'rest-002',
        restaurant_name: 'Pizza Paradise',
        restaurant_address: '101 Food Court, Mall Plaza',
        total_amount: 55.00,
        order_status: 'ready',
        created_at: new Date().toISOString(),
        items: [{ name: 'Pizza', quantity: 2 }] as any,
        payment_status: 'paid',
        delivery_address: '101 Tower, City'
    }
];

export const partnerAPI = {
    restaurant: {
        getOrders: async (status?: string): Promise<ApiResponse<Order[]>> => {
            await new Promise(resolve => setTimeout(resolve, 800));
            let filtered = MOCK_ORDERS;
            if (status) {
                filtered = MOCK_ORDERS.filter(o => o.order_status === status);
            }
            return { success: true, data: filtered, statusCode: 200 };
        },

        updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const order = MOCK_ORDERS.find(o => o.order_id === orderId);
            if (order) {
                order.order_status = status as any;
                return { success: true, data: { ...order }, statusCode: 200 };
            }
            return { success: false, error: 'Order not found', statusCode: 404 };
        },

        getMenu: async (): Promise<ApiResponse<FoodItem[]>> => {
            await new Promise(resolve => setTimeout(resolve, 800));
            return { success: true, data: MOCK_MENU, statusCode: 200 };
        },

        updateMenuItemStatus: async (itemId: string, isAvailable: boolean): Promise<ApiResponse<FoodItem>> => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const item = MOCK_MENU.find(i => i.food_item_id === itemId);
            if (item) {
                item.is_available = isAvailable;
                return { success: true, data: { ...item }, statusCode: 200 };
            }
            return { success: false, error: 'Item not found', statusCode: 404 };
        },

        getEarnings: async (period: string): Promise<ApiResponse<any>> => {
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                success: true,
                data: {
                    total_amount: 1250.50,
                    total_orders: 45,
                    tips: 120.00,
                    bonus: 50.00
                },
                statusCode: 200
            };
        },
    },

    delivery: {
        getRequests: async (): Promise<ApiResponse<Order[]>> => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, data: MOCK_DELIVERY_REQUESTS, statusCode: 200 };
        },

        acceptRequest: async (orderId: string): Promise<ApiResponse<Order>> => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const order = MOCK_DELIVERY_REQUESTS.find(o => o.order_id === orderId);
            if (order) {
                return { success: true, data: { ...order, order_status: 'preparing' }, statusCode: 200 };
            }
            return { success: false, error: 'Request expired', statusCode: 404 };
        },

        updateDeliveryStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                success: true,
                data: {
                    ...MOCK_DELIVERY_REQUESTS[0],
                    order_status: status as any
                },
                statusCode: 200
            };
        },

        toggleAvailability: async (isOnline: boolean): Promise<ApiResponse<{ is_online: boolean }>> => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data: { is_online: isOnline }, statusCode: 200 };
        },

        getEarnings: async (period: string): Promise<ApiResponse<any>> => {
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                success: true,
                data: {
                    total_amount: 450.00,
                    total_orders: 12,
                    tips: 45.00,
                    bonus: 20.00
                },
                statusCode: 200
            };
        },
    },
};
