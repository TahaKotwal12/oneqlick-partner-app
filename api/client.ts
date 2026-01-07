import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get API URL from environment variables
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl ||
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    'https://oneqlick-backend-app-production.up.railway.app/api/v1';

console.log('🌐 API Base URL:', API_BASE_URL);

interface RequestConfig extends RequestInit {
    requiresAuth?: boolean;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async getAuthHeaders(): Promise<Record<string, string>> {
        const token = await AsyncStorage.getItem('access_token');
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<{ success: boolean; data?: T; error?: string; statusCode?: number }> {
        const { requiresAuth = false, ...fetchConfig } = config;

        try {
            const headers = requiresAuth
                ? await this.getAuthHeaders()
                : { 'Content-Type': 'application/json' };

            const url = `${this.baseURL}${endpoint}`;

            console.log(`📡 API Request: ${fetchConfig.method || 'GET'} ${url}`);

            const response = await fetch(url, {
                ...fetchConfig,
                headers: {
                    ...headers,
                    ...fetchConfig.headers,
                },
            });

            const responseData = await response.json();

            console.log(`✅ API Response (${response.status}):`, responseData);

            if (!response.ok) {
                return {
                    success: false,
                    error: responseData.detail || responseData.message || 'Request failed',
                    statusCode: response.status,
                };
            }

            // Handle CommonResponse format from backend
            if (responseData.code && responseData.data !== undefined) {
                return {
                    success: responseData.code >= 200 && responseData.code < 300,
                    data: responseData.data,
                    statusCode: responseData.code,
                };
            }

            return {
                success: true,
                data: responseData,
                statusCode: response.status,
            };
        } catch (error) {
            console.error('❌ API Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
                statusCode: 0,
            };
        }
    }

    async get<T>(endpoint: string, requiresAuth = false) {
        return this.request<T>(endpoint, { method: 'GET', requiresAuth });
    }

    async post<T>(endpoint: string, data?: any, requiresAuth = false) {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth,
        });
    }

    async put<T>(endpoint: string, data?: any, requiresAuth = false) {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            requiresAuth,
        });
    }

    async delete<T>(endpoint: string, requiresAuth = false) {
        return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
