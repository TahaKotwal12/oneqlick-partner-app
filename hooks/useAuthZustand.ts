// Updated Auth Hook using Zustand
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
    clearError,
    checkAuthState,
  } = useAuthStore();

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
    clearError,
    checkAuthState,
  };
}
