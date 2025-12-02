import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { authService } from '../services/authService';

type OTPType = 'phone_verification' | 'email_verification' | 'password_reset';

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  otpResendAttempts: number;
  maxOtpResendAttempts: number;

  // Actions
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    role: 'restaurant_owner' | 'delivery_partner';
    additional_data?: any;
  }) => Promise<{ success: boolean; error?: string }>;
  googleSignIn: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  updateProfile: (userData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    profile_image?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (passwordData: {
    current_password: string;
    new_password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  checkAuthState: () => Promise<void>;
  sendOTP: (phone?: string, email?: string, otpType?: OTPType) => Promise<{ success: boolean; error?: string; remainingAttempts?: number; maxAttempts?: number }>;
  verifyOTP: (otpCode: string, phone?: string, email?: string, otpType?: OTPType) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyResetOTP: (otpCode: string, email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (otpCode: string, email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetOtpResendAttempts: () => void;
  initializeOtpAttempts: (attempts: number, maxAttempts?: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      isLoading: true,
      error: null,
      otpResendAttempts: 0,
      maxOtpResendAttempts: 3,

      // Actions
      login: async (identifier: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.login(identifier, password);

          if (response.success && response.data) {
            set({
              isAuthenticated: true,
              user: response.data.user,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } else {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: response.error || 'Login failed',
            });
            return { success: false, error: response.error || 'Login failed' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      signup: async (userData: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        password: string;
        role: 'restaurant_owner' | 'delivery_partner';
        additional_data?: any;
      }) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.signup(userData);

          if (response.success && response.data) {
            // Don't automatically authenticate user after signup
            // User should verify email/phone first and then login
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: response.error || 'Signup failed',
            });
            return { success: false, error: response.error || 'Signup failed' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      googleSignIn: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.googleSignIn();

          if (response.success && response.data) {
            set({
              isAuthenticated: true,
              user: response.data.user,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } else {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: response.error || 'Google signin failed',
            });
            return { success: false, error: response.error || 'Google signin failed' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Google signin failed';
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });

          await authService.logout();

          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Still logout locally even if API fails
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      updateProfile: async (userData: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        date_of_birth?: string;
        gender?: string;
        profile_image?: string;
      }) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.updateProfile(userData);

          if (response.success && response.data) {
            set({
              user: response.data,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.error || 'Profile update failed',
            });
            return { success: false, error: response.error || 'Profile update failed' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      changePassword: async (passwordData: {
        current_password: string;
        new_password: string;
      }) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.changePassword(passwordData);

          if (response.success) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.error || 'Password change failed',
            });
            return { success: false, error: response.error || 'Password change failed' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Password change failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuthState: async () => {
        try {
          set({ isLoading: true });

          // Check if user is already authenticated
          const isAuthenticated = await authService.isAuthenticated();
          const user = await authService.getCurrentUser();

          if (isAuthenticated && user) {
            set({
              isAuthenticated: true,
              user,
              isLoading: false,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      },

      sendOTP: async (phone?: string, email?: string, otpType: OTPType = 'phone_verification') => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.sendOTP(phone, email, otpType);

          if (response.success && response.data) {
            // Update OTP resend attempts based on server response
            const remainingAttempts = response.data.remaining_attempts || 0;
            const maxAttempts = response.data.max_attempts || 3;
            const usedAttempts = maxAttempts - remainingAttempts;


            set({
              isLoading: false,
              error: null,
              otpResendAttempts: usedAttempts,
              maxOtpResendAttempts: maxAttempts
            });

            return {
              success: true,
              remainingAttempts,
              maxAttempts
            };
          } else {
            set({
              isLoading: false,
              error: response.error || 'Failed to send OTP',
            });
            return { success: false, error: response.error || 'Failed to send OTP' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      verifyOTP: async (otpCode: string, phone?: string, email?: string, otpType: OTPType = 'phone_verification') => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.verifyOTP(otpCode, phone, email, otpType);

          if (response.success) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.error || 'Failed to verify OTP',
            });
            return { success: false, error: response.error || 'Failed to verify OTP' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.forgotPassword(email);

          if (response.success) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.error || 'Failed to send password reset OTP',
            });
            return { success: false, error: response.error || 'Failed to send password reset OTP' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset OTP';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      verifyResetOTP: async (otpCode: string, email: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.verifyResetOTP(otpCode, email);

          if (response.success) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.error || 'Failed to verify reset OTP',
            });
            return { success: false, error: response.error || 'Failed to verify reset OTP' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to verify reset OTP';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      resetPassword: async (otpCode: string, email: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.resetPassword(otpCode, email, newPassword);

          if (response.success) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.error || 'Failed to reset password',
            });
            return { success: false, error: response.error || 'Failed to reset password' };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      resetOtpResendAttempts: () => {
        set({ otpResendAttempts: 0 });
      },

      initializeOtpAttempts: (attempts: number, maxAttempts: number = 3) => {
        set({ otpResendAttempts: attempts, maxOtpResendAttempts: maxAttempts });
      },
    }),
    {
      name: 'oneqlick-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
