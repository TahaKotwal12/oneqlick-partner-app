import { apiClient } from '../api/client';
import type { ApiResponse, FoodItem } from '../types';

export type PartnerCategory = {
  category_id: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

type MenuListPayload = {
  items: (FoodItem & { category_name?: string })[];
  total_count: number;
};

type CategoriesPayload = {
  categories: PartnerCategory[];
  total_count: number;
};

export const menuService = {
  async getMenu(): Promise<ApiResponse<(FoodItem & { category_name?: string })[]>> {
    const response = await apiClient.get<MenuListPayload>('/partner/restaurant/menu', true);

    if (response.success && response.data) {
      return { success: true, data: response.data.items || [], statusCode: 200 };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch menu',
      statusCode: response.statusCode || 400,
    };
  },

  async getCategories(): Promise<ApiResponse<PartnerCategory[]>> {
    const response = await apiClient.get<CategoriesPayload>(
      '/partner/restaurant/menu/categories',
      true
    );

    if (response.success && response.data) {
      return { success: true, data: response.data.categories || [], statusCode: 200 };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch categories',
      statusCode: response.statusCode || 400,
    };
  },

  async createMenuItem(itemData: {
    name: string;
    price: number;
    description: string;
    category_id: string;
    image_url?: string;
    is_veg?: boolean;
    ingredients?: string;
    prep_time?: number;
    allergens?: string;
    calories?: number;
  }): Promise<ApiResponse<FoodItem & { category_name?: string }>> {
    const response = await apiClient.post<FoodItem & { category_name?: string }>(
      '/partner/restaurant/menu',
      itemData,
      true
    );

    if (response.success && response.data) {
      return { success: true, data: response.data, statusCode: 201 };
    }

    return {
      success: false,
      error: response.error || 'Failed to create menu item',
      statusCode: response.statusCode || 400,
    };
  },

  async updateMenuItem(
    itemId: string,
    itemData: {
      name?: string;
      price?: number;
      description?: string;
      image_url?: string;
      category_id?: string;
      is_veg?: boolean;
      ingredients?: string;
      prep_time?: number;
      allergens?: string;
      calories?: number;
    }
  ): Promise<ApiResponse<FoodItem & { category_name?: string }>> {
    const response = await apiClient.put<FoodItem & { category_name?: string }>(
      `/partner/restaurant/menu/${itemId}`,
      itemData,
      true
    );

    if (response.success && response.data) {
      return { success: true, data: response.data, statusCode: 200 };
    }

    return {
      success: false,
      error: response.error || 'Failed to update menu item',
      statusCode: response.statusCode || 400,
    };
  },

  async deleteMenuItem(itemId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<{ deleted: boolean }>(
      `/partner/restaurant/menu/${itemId}`,
      true
    );

    if (response.success) {
      return { success: true, data: undefined, statusCode: 200 };
    }

    return {
      success: false,
      error: response.error || 'Failed to delete menu item',
      statusCode: response.statusCode || 400,
    };
  },

  async updateAvailability(
    itemId: string,
    isAvailable: boolean
  ): Promise<ApiResponse<FoodItem & { category_name?: string }>> {
    const response = await apiClient.put<FoodItem & { category_name?: string }>(
      `/partner/restaurant/menu/${itemId}/availability`,
      { is_available: isAvailable },
      true
    );

    if (response.success && response.data) {
      return { success: true, data: response.data, statusCode: 200 };
    }

    return {
      success: false,
      error: response.error || 'Failed to update availability',
      statusCode: response.statusCode || 400,
    };
  },
};

export default menuService;
