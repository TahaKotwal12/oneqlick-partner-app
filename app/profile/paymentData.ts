export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'netbanking' | 'cod';
  name: string;
  displayName: string;
  maskedNumber?: string;
  upiId?: string;
  bankName?: string;
  cardType?: 'credit' | 'debit';
  expiryDate?: string;
  balance?: number;
  isDefault: boolean;
  isVerified: boolean;
  isActive: boolean;
  lastUsed?: string;
  icon: string;
  color: string;
  brandColor: string;
}

export interface PaymentOption {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'netbanking' | 'cod';
  name: string;
  description: string;
  icon: string;
  color: string;
  isAvailable: boolean;
  requiresVerification: boolean;
}

export interface PaymentHistory {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
  restaurant: string;
}

// Sample payment methods data
export const samplePaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'upi',
    name: 'PhonePe',
    displayName: 'PhonePe',
    maskedNumber: '**** 9876',
    upiId: 'priya.sharma@ybl',
    isDefault: true,
    isVerified: true,
    isActive: true,
    lastUsed: '2024-01-15T14:30:00Z',
    icon: 'phone',
    color: '#5F259F',
    brandColor: '#5F259F',
  },
  {
    id: 'pm-2',
    type: 'upi',
    name: 'Google Pay',
    displayName: 'Google Pay',
    maskedNumber: 'priya.sharma@oksbi',
    upiId: 'priya.sharma@oksbi',
    isDefault: false,
    isVerified: true,
    isActive: true,
    lastUsed: '2024-01-10T12:00:00Z',
    icon: 'google',
    color: '#01875F',
    brandColor: '#01875F',
  },
  {
    id: 'pm-3',
    type: 'card',
    name: 'ICICI Credit Card',
    displayName: 'ICICI Credit Card',
    maskedNumber: '**** 1234',
    bankName: 'ICICI Bank',
    cardType: 'credit',
    expiryDate: '12/26',
    isDefault: false,
    isVerified: true,
    isActive: true,
    lastUsed: '2024-01-08T18:00:00Z',
    icon: 'credit-card',
    color: '#4F46E5',
    brandColor: '#4F46E5',
  },
  {
    id: 'pm-4',
    type: 'wallet',
    name: 'Paytm Wallet',
    displayName: 'Paytm Wallet',
    balance: 1250,
    isDefault: false,
    isVerified: true,
    isActive: true,
    lastUsed: '2024-01-12T16:00:00Z',
    icon: 'account-balance-wallet',
    color: '#00BAF9',
    brandColor: '#00BAF9',
  },
];

// Available payment options to add
export const availablePaymentOptions: PaymentOption[] = [
  {
    id: 'add-card',
    type: 'card',
    name: 'Credit/Debit Card',
    description: 'Add your credit or debit card for secure payments',
    icon: 'credit-card',
    color: '#4F46E5',
    isAvailable: true,
    requiresVerification: true,
  },
  {
    id: 'add-upi',
    type: 'upi',
    name: 'UPI Apps',
    description: 'PhonePe, Google Pay, Paytm, BHIM and more',
    icon: 'smartphone',
    color: '#5F259F',
    isAvailable: true,
    requiresVerification: true,
  },
  {
    id: 'add-wallet',
    type: 'wallet',
    name: 'Digital Wallets',
    description: 'Paytm, PhonePe, Amazon Pay and other wallets',
    icon: 'account-balance-wallet',
    color: '#00BAF9',
    isAvailable: true,
    requiresVerification: true,
  },
  {
    id: 'add-netbanking',
    type: 'netbanking',
    name: 'Net Banking',
    description: 'Direct bank transfer from your account',
    icon: 'account-balance',
    color: '#2196F3',
    isAvailable: true,
    requiresVerification: true,
  },
  {
    id: 'add-cod',
    type: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: 'money',
    color: '#10B981',
    isAvailable: true,
    requiresVerification: false,
  },
];

// Sample payment history
export const samplePaymentHistory: PaymentHistory[] = [
  {
    id: 'ph-1',
    orderId: 'ORD001234',
    amount: 517.50,
    paymentMethod: 'PhonePe',
    status: 'success',
    date: '2024-01-15T14:30:00Z',
    restaurant: "Sharma's Kitchen",
  },
  {
    id: 'ph-2',
    orderId: 'ORD001233',
    amount: 380.00,
    paymentMethod: 'Google Pay',
    status: 'success',
    date: '2024-01-10T12:00:00Z',
    restaurant: 'Pizza Corner',
  },
  {
    id: 'ph-3',
    orderId: 'ORD001232',
    amount: 650.00,
    paymentMethod: 'ICICI Credit Card',
    status: 'success',
    date: '2024-01-08T18:00:00Z',
    restaurant: 'Chinese Wok',
  },
  {
    id: 'ph-4',
    orderId: 'ORD001231',
    amount: 280.00,
    paymentMethod: 'Paytm Wallet',
    status: 'success',
    date: '2024-01-05T20:00:00Z',
    restaurant: 'Burger House',
  },
];

// Helper functions
export const getPaymentMethodIcon = (type: string): string => {
  const method = samplePaymentMethods.find(m => m.id === type);
  return method?.icon || 'credit-card';
};

export const getPaymentMethodColor = (type: string): string => {
  const method = samplePaymentMethods.find(m => m.id === type);
  return method?.color || '#6B7280';
};

export const getPaymentMethodName = (type: string): string => {
  const method = samplePaymentMethods.find(m => m.id === type);
  return method?.displayName || 'Unknown';
};

export const formatAmount = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'success':
      return '#10B981';
    case 'pending':
      return '#F59E0B';
    case 'failed':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

export const getPaymentStatusIcon = (status: string): string => {
  switch (status) {
    case 'success':
      return 'check-circle';
    case 'pending':
      return 'clock';
    case 'failed':
      return 'error';
    default:
      return 'help';
  }
};

export const getVerificationStatus = (isVerified: boolean): {
  text: string;
  color: string;
  icon: string;
} => {
  if (isVerified) {
    return {
      text: 'Verified',
      color: '#10B981',
      icon: 'verified',
    };
  } else {
    return {
      text: 'Unverified',
      color: '#FF9800',
      icon: 'warning',
    };
  }
};

// Default export
export default {
  samplePaymentMethods,
  availablePaymentOptions,
  samplePaymentHistory,
  getPaymentMethodIcon,
  getPaymentMethodColor,
  getPaymentMethodName,
  formatAmount,
  formatDate,
  formatTime,
  getPaymentStatusColor,
  getPaymentStatusIcon,
  getVerificationStatus,
}; 