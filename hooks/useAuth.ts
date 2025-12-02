import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      const user = await authService.getCurrentUser();
      
      setAuthState({
        isAuthenticated,
        user,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.login(identifier, password);
      
      if (response.success && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false,
        });
        return { success: true };
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.logout();
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  const signup = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.signup(userData);
      
      if (response.success && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false,
        });
        return { success: true };
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return { success: false, error: response.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      return { success: false, error: 'Signup failed' };
    }
  };

  return {
    ...authState,
    login,
    logout,
    signup,
  };
} 