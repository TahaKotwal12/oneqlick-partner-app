// Location Hook using Zustand
import { useLocationStore } from '../store/locationStore';

export function useLocation() {
  const {
    currentLocation,
    displayName,
    isLoading,
    error,
    hasPermission,
    setLocation,
    setDisplayName,
    setLoading,
    setError,
    setPermission,
    clearLocation,
  } = useLocationStore();

  return {
    currentLocation,
    displayName,
    isLoading,
    error,
    hasPermission,
    setLocation,
    setDisplayName,
    setLoading,
    setError,
    setPermission,
    clearLocation,
  };
}
