import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, User } from '../types';
import { apiClient } from '../api/client';

export const authService = {
  /**
   * Login with email/phone and password
   */
  login: async (identifier: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');

      const response = await apiClient.post<{
        user: User;
        tokens: {
          access_token: string;
          refresh_token: string;
          token_type: string;
          expires_in: number;
        };
      }>('/auth/login', {
        [isEmail ? 'email' : 'phone']: identifier,
        password,
      });

      if (response.success && response.data) {
        // Store tokens
        await AsyncStorage.setItem('access_token', response.data.tokens.access_token);
        await AsyncStorage.setItem('refresh_token', response.data.tokens.refresh_token);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));

        return {
          success: true,
          data: {
            user: response.data.user,
            token: response.data.tokens.access_token,
          },
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'Login failed',
        statusCode: response.statusCode || 401,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
        statusCode: 500,
      };
    }
  },

  /**
   * Signup new partner (restaurant owner or delivery partner)
   */
  signup: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    role: 'restaurant_owner' | 'delivery_partner';
    additional_data?: any;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiClient.post<{
        user: User;
        tokens?: {
          access_token: string;
          refresh_token: string;
        };
        requires_verification: boolean;
      }>('/auth/signup', userData);

      if (response.success && response.data) {
        // If tokens are provided (auto-login after signup)
        if (response.data.tokens) {
          await AsyncStorage.setItem('access_token', response.data.tokens.access_token);
          await AsyncStorage.setItem('refresh_token', response.data.tokens.refresh_token);
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));

          return {
            success: true,
            data: {
              user: response.data.user,
              token: response.data.tokens.access_token,
            },
            statusCode: 201,
          };
        }

        // If verification is required, return success but no tokens
        return {
          success: true,
          data: {
            user: response.data.user,
            token: '',
          },
          statusCode: 201,
        };
      }

      return {
        success: false,
        error: response.error || 'Signup failed',
        statusCode: response.statusCode || 400,
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed',
        statusCode: 500,
      };
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      // Call backend logout endpoint
      await apiClient.post('/auth/logout', {
        refresh_token: refreshToken,
        logout_all_devices: false,
      }, true);

      // Clear local storage
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_data');

      return { success: true, data: undefined, statusCode: 200 };
    } catch (error) {
      // Still clear local storage even if API call fails
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_data');

      return { success: true, data: undefined, statusCode: 200 };
    }
  },

  /**
   * Google Sign In (placeholder)
   */
  googleSignIn: async (): Promise<ApiResponse<{ user: User; token: string }>> => {
    return {
      success: false,
      error: 'Google Sign In not implemented yet',
      statusCode: 501,
    };
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      if (!refreshToken) {
        return {
          success: false,
          error: 'No refresh token found',
          statusCode: 401,
        };
      }

      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
      }>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (response.success && response.data) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem('refresh_token', response.data.refresh_token);

        return {
          success: true,
          data: { token: response.data.access_token },
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'Token refresh failed',
        statusCode: response.statusCode || 401,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
        statusCode: 500,
      };
    }
  },

  /**
   * Send OTP for verification
   */
  sendOTP: async (
    phone?: string,
    email?: string,
    type: string = 'email_verification'
  ): Promise<ApiResponse<{ message: string; remaining_attempts: number; max_attempts: number }>> => {
    try {
      const response = await apiClient.post<{
        message: string;
        expires_in: number;
        email?: string;
      }>('/auth/send-otp', {
        phone,
        email,
        otp_type: type,
      });

      if (response.success) {
        return {
          success: true,
          data: {
            message: response.data?.message || 'OTP sent successfully',
            remaining_attempts: 2,
            max_attempts: 3,
          },
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to send OTP',
        statusCode: response.statusCode || 400,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
        statusCode: 500,
      };
    }
  },

  /**
   * Verify OTP
   */
  verifyOTP: async (
    code: string,
    phone?: string,
    email?: string,
    type: string = 'email_verification'
  ): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.post<{
        verified: boolean;
        message: string;
      }>('/auth/verify-otp', {
        otp_code: code,
        phone,
        email,
        otp_type: type,
      });

      if (response.success) {
        return {
          success: true,
          data: { message: response.data?.message || 'OTP verified successfully' },
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'OTP verification failed',
        statusCode: response.statusCode || 400,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OTP verification failed',
        statusCode: 500,
      };
    }
  },

  /**
   * Get user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get<User>('/users/profile', true);

      if (response.success && response.data) {
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
        return {
          success: true,
          data: response.data,
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to get profile',
        statusCode: response.statusCode || 400,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile',
        statusCode: 500,
      };
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: any): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.put<User>('/users/profile', data, true);

      if (response.success && response.data) {
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
        return {
          success: true,
          data: response.data,
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'Profile update failed',
        statusCode: response.statusCode || 400,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed',
        statusCode: 500,
      };
    }
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.put<{ message: string }>('/users/password', data, true);

      if (response.success) {
        return {
          success: true,
          data: response.data || { message: 'Password changed successfully' },
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'Password change failed',
        statusCode: response.statusCode || 400,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password change failed',
        statusCode: 500,
      };
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('access_token');
    return !!token;
  },

  /**
   * Get current user from local storage
   */
  getCurrentUser: async (): Promise<User | null> => {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Forgot password - send reset OTP
   */
  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });

      if (response.success) {
        return {
          success: true,
          data: response.data || { message: 'Reset OTP sent to your email' },
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to send reset OTP',
        statusCode: response.statusCode || 400,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send reset OTP',
        statusCode: 500,
      };
    }
  },

  /**
   * Verify reset OTP
   */
  verifyResetOTP: async (code: string, email: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.post<{ verified: boolean; message: string }>(
        '/auth/verify-reset-otp',
        {
          otp_code: code,
          email,
        }
      );

      if (response.success) {
        return {
          success: true,
          data: { message: response.data?.message || 'OTP verified successfully' },
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'OTP verification failed',
        statusCode: response.statusCode || 400,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OTP verification failed',
        statusCode: 500,
      };
    }
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (
    code: string,
    email: string,
    password: string
  ): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/reset-password', {
        otp_code: code,
        email,
        new_password: password,
      });

      if (response.success) {
        return {
          success: true,
          data: response.data || { message: 'Password reset successful' },
          statusCode: 200,
        };
      }

      return {
        success: false,
        error: response.error || 'Password reset failed',
        statusCode: response.statusCode || 400,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
        statusCode: 500,
      };
    }
  },

  /**
   * Send OTP for verification
   */
  sendOTP: async (
    phone?: string,
    email?: string,
    otpType: 'phone_verification' | 'email_verification' | 'password_reset' = 'email_verification'
  ): Promise<ApiResponse<{ message: string; remaining_attempts?: number; max_attempts?: number }>> => {
    try {
      const response = await apiClient.post<{
        message: string;
        remaining_attempts?: number;
        max_attempts?: number
      }>('/auth/send-otp', {
        phone,
        email,
        otp_type: otpType,
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
        statusCode: 500,
      };
    }
  },

  /**
   * Verify OTP
   */
  verifyOTP: async (
    otpCode: string,
    phone?: string,
    email?: string,
    otpType: 'phone_verification' | 'email_verification' | 'password_reset' = 'email_verification'
  ): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/verify-otp', {
        otp_code: otpCode,
        phone,
        email,
        otp_type: otpType,
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
        statusCode: 500,
      };
    }
  },
};
