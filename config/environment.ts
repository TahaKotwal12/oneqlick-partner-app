// Environment configuration
export const ENV = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 
    'http://localhost:8000/api/v1',
  
  // Google OAuth (for future use)
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 
    '1024710005377-603b3r4u26tgehu0nc1d9frjb1j0v1u9.apps.googleusercontent.com',
  
  // App Configuration
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'OneQlick',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  
  // Feature Flags
  ENABLE_GOOGLE_SIGNIN: process.env.EXPO_PUBLIC_ENABLE_GOOGLE_SIGNIN === 'true' || false,
  ENABLE_OTP_VERIFICATION: process.env.EXPO_PUBLIC_ENABLE_OTP_VERIFICATION === 'true' || true,
  ENABLE_PUSH_NOTIFICATIONS: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true' || false,
  
  // Debug Configuration
  DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true' || __DEV__,
  LOG_LEVEL: process.env.EXPO_PUBLIC_LOG_LEVEL || (__DEV__ ? 'debug' : 'error'),
  
  // Development Settings
  DEV_MODE: process.env.EXPO_PUBLIC_DEV_MODE === 'true' || __DEV__,
  MOCK_API: process.env.EXPO_PUBLIC_MOCK_API === 'true' || false,
};

export default ENV;