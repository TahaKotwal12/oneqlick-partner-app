import { Platform } from 'react-native';

// Format currency (Indian Rupees)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format time duration
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Validate phone number with country code
export const isValidPhoneWithCountry = (phone: string, countryCode: string, maxLength: number): boolean => {
  // Remove country code and non-digit characters
  const cleanedPhone = phone.replace(countryCode, '').replace(/\D/g, '');
  
  // Check if phone number has the correct length
  if (cleanedPhone.length !== maxLength) {
    return false;
  }
  
  // Country-specific validation rules
  switch (countryCode) {
    case '+91': // India
      return /^[6-9]\d{9}$/.test(cleanedPhone);
    case '+1': // US/Canada
      return /^[2-9]\d{9}$/.test(cleanedPhone);
    case '+44': // UK
      return /^[1-9]\d{9}$/.test(cleanedPhone);
    case '+86': // China
      return /^1[3-9]\d{9}$/.test(cleanedPhone);
    case '+81': // Japan
      return /^[1-9]\d{9}$/.test(cleanedPhone);
    case '+49': // Germany
      return /^[1-9]\d{10}$/.test(cleanedPhone);
    case '+33': // France
      return /^[1-9]\d{8}$/.test(cleanedPhone);
    case '+55': // Brazil
      return /^[1-9]\d{10}$/.test(cleanedPhone);
    case '+61': // Australia
      return /^[1-9]\d{8}$/.test(cleanedPhone);
    case '+7': // Russia
      return /^9\d{9}$/.test(cleanedPhone);
    case '+82': // South Korea
      return /^[1-9]\d{9}$/.test(cleanedPhone);
    case '+62': // Indonesia
      return /^8\d{9,10}$/.test(cleanedPhone);
    case '+90': // Turkey
      return /^5\d{9}$/.test(cleanedPhone);
    case '+966': // Saudi Arabia
      return /^5\d{8}$/.test(cleanedPhone);
    case '+27': // South Africa
      return /^[6-8]\d{8}$/.test(cleanedPhone);
    case '+52': // Mexico
      return /^[1-9]\d{9}$/.test(cleanedPhone);
    case '+234': // Nigeria
      return /^[7-9]\d{9}$/.test(cleanedPhone);
    case '+92': // Pakistan
      return /^3\d{9}$/.test(cleanedPhone);
    case '+880': // Bangladesh
      return /^1[3-9]\d{8}$/.test(cleanedPhone);
    case '+63': // Philippines
      return /^9\d{9}$/.test(cleanedPhone);
    case '+84': // Vietnam
      return /^[3-9]\d{8}$/.test(cleanedPhone);
    case '+66': // Thailand
      return /^[6-9]\d{8}$/.test(cleanedPhone);
    case '+65': // Singapore
      return /^[3689]\d{7}$/.test(cleanedPhone);
    case '+60': // Malaysia
      return /^1\d{8,9}$/.test(cleanedPhone);
    case '+971': // UAE
      return /^5\d{8}$/.test(cleanedPhone);
    case '+972': // Israel
      return /^5\d{8}$/.test(cleanedPhone);
    case '+94': // Sri Lanka
      return /^7\d{8}$/.test(cleanedPhone);
    case '+977': // Nepal
      return /^9[78]\d{8}$/.test(cleanedPhone);
    default:
      // Generic validation: just check if it's all digits with the correct length
      return cleanedPhone.length === maxLength && /^\d+$/.test(cleanedPhone);
  }
};

// Capitalize first letter
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Check if device is iOS
export const isIOS = Platform.OS === 'ios';

// Check if device is Android
export const isAndroid = Platform.OS === 'android';

// Validate password strength
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters with uppercase, lowercase, number, and special character
  // More inclusive special characters: includes #, $, %, &, *, +, -, =, @, !, ?, ~, ^, etc.
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{8,}$/;
  return passwordRegex.test(password);
}; 