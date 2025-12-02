export interface CartItem {
  id: string;
  foodItem: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    isVeg: boolean;
  };
  quantity: number;
  addOns: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  customizations?: {
    size?: string;
    spiceLevel?: string;
    specialInstructions?: string;
  };
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount: number;
  description: string;
}

export interface CartData {
  items: CartItem[];
  deliveryAddress: string;
  addresses: string[];
  deliveryFee: number;
  packagingCharges: number;
  estimatedDelivery: string;
}

// Sample cart items
export const cartItems: CartItem[] = [
  {
    id: 'cart-1',
    foodItem: {
      id: 'chicken-biryani',
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice with tender chicken pieces, cooked with traditional spices',
      price: 180,
      originalPrice: 220,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=150&fit=crop&crop=center',
      isVeg: false,
    },
    quantity: 2,
    addOns: [
      { id: 'extra-raita', name: 'Extra Raita', price: 20 },
      { id: 'boiled-egg', name: 'Boiled Egg', price: 15 },
    ],
    customizations: {
      size: 'Large',
      spiceLevel: 'Medium',
    },
  },
  {
    id: 'cart-2',
    foodItem: {
      id: 'paneer-butter-masala',
      name: 'Paneer Butter Masala',
      description: 'Cottage cheese cubes in rich, creamy tomato-based gravy',
      price: 160,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=150&fit=crop&crop=center',
      isVeg: true,
    },
    quantity: 1,
    addOns: [
      { id: 'extra-naan', name: 'Extra Naan', price: 25 },
    ],
    customizations: {
      spiceLevel: 'Mild',
    },
  },
  {
    id: 'cart-3',
    foodItem: {
      id: 'dal-makhani',
      name: 'Dal Makhani',
      description: 'Black lentils slow-cooked with cream and butter',
      price: 120,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=150&fit=crop&crop=center',
      isVeg: true,
    },
    quantity: 1,
    addOns: [],
    customizations: {
      spiceLevel: 'Medium',
    },
  },
  {
    id: 'cart-4',
    foodItem: {
      id: 'gulab-jamun',
      name: 'Gulab Jamun',
      description: 'Sweet, soft milk solids balls soaked in rose-flavored sugar syrup',
      price: 80,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=200&h=150&fit=crop&crop=center',
      isVeg: true,
    },
    quantity: 2,
    addOns: [],
  },
];

// Available coupons
export const availableCoupons: Coupon[] = [
  {
    code: 'FIRST20',
    discount: 20,
    type: 'percentage',
    minOrder: 200,
    maxDiscount: 100,
    description: 'Get 20% off on your first order (max ₹100)',
  },
  {
    code: 'SAVE50',
    discount: 50,
    type: 'fixed',
    minOrder: 300,
    maxDiscount: 50,
    description: 'Save ₹50 on orders above ₹300',
  },
  {
    code: 'WELCOME30',
    discount: 30,
    type: 'percentage',
    minOrder: 150,
    maxDiscount: 150,
    description: 'Welcome offer: 30% off (max ₹150)',
  },
  {
    code: 'FREEDEL',
    discount: 30,
    type: 'fixed',
    minOrder: 400,
    maxDiscount: 30,
    description: 'Free delivery on orders above ₹400',
  },
];

// Cart configuration
export const cartData: CartData = {
  items: cartItems,
  deliveryAddress: 'House No. 45, Rajpur Village, Haridwar, Uttarakhand 249401',
  addresses: [
    'House No. 45, Rajpur Village, Haridwar, Uttarakhand 249401',
    'Flat 12, Green Valley Apartments, Jwalapur, Haridwar, UK 249407',
    'Shop No. 8, Bus Stand Market, Haridwar, Uttarakhand 249401',
    'Village Panchayat Office, Rajpur Village, Haridwar, UK 249401',
  ],
  deliveryFee: 30,
  packagingCharges: 15,
  estimatedDelivery: '35-40 minutes',
};

// Calculate cart totals
export const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((total, item) => {
    const itemTotal = item.foodItem.price * item.quantity;
    const addOnsTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return total + itemTotal + addOnsTotal;
  }, 0);

  const gst = subtotal * 0.05; // 5% GST
  const deliveryFee = cartData.deliveryFee;
  const packagingCharges = cartData.packagingCharges;

  return {
    subtotal,
    gst,
    deliveryFee,
    packagingCharges,
    total: subtotal + gst + deliveryFee + packagingCharges,
  };
};
