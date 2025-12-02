// Enhanced Icon Component for oneQlick User App
// Centralized icon management with comprehensive icon support

import React from 'react';
import { 
  MaterialIcons, 
  MaterialCommunityIcons, 
  Ionicons, 
  AntDesign, 
  Feather, 
  FontAwesome,
  FontAwesome5,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Zocial,
  Foundation
} from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';

export type IconFamily = 
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'Ionicons'
  | 'AntDesign'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Entypo'
  | 'SimpleLineIcons'
  | 'Octicons'
  | 'Zocial'
  | 'Foundation';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface IconProps {
  name: string;
  family?: IconFamily;
  size?: IconSize;
  color?: string;
  style?: any;
  onPress?: () => void;
}

const iconFamilies = {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Zocial,
  Foundation,
};

const getIconSize = (size: IconSize): number => {
  if (typeof size === 'number') return size;
  
  const sizeMap = {
    xs: DesignSystem.sizes.icon.xs,
    sm: DesignSystem.sizes.icon.sm,
    md: DesignSystem.sizes.icon.md,
    lg: DesignSystem.sizes.icon.lg,
    xl: DesignSystem.sizes.icon.xl,
  };
  
  return sizeMap[size];
};

export default function Icon({ 
  name, 
  family = 'MaterialIcons', 
  size = 'md', 
  color = DesignSystem.colors.text.primary,
  style,
  onPress 
}: IconProps) {
  const IconComponent = iconFamilies[family];
  const iconSize = getIconSize(size);
  
  if (!IconComponent) {
    console.warn(`Icon family "${family}" not found. Falling back to MaterialIcons.`);
    return React.createElement(MaterialIcons, { 
      name: name as any, 
      size: iconSize, 
      color: color, 
      style: style,
      onPress: onPress
    });
  }
  
  try {
    return React.createElement(IconComponent, { 
      name: name as any, 
      size: iconSize, 
      color: color, 
      style: style,
      onPress: onPress
    });
  } catch (error) {
    // Log error and return null if icon not found
    console.warn(`Icon "${name}" not found in ${family}.`, error);
    return null;
  }
}

// Pre-configured icon components for common use cases
export const AppIcon = {
  // Navigation Icons
  Home: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "home", family: "MaterialIcons", ...props });
  },
  Search: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "search", family: "MaterialIcons", ...props });
  },
  Orders: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "receipt", family: "MaterialIcons", ...props });
  },
  Cart: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "shopping-cart", family: "MaterialIcons", ...props });
  },
  Profile: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "person", family: "MaterialIcons", ...props });
  },
  
  // Food & Restaurant Icons
  Restaurant: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "restaurant", family: "MaterialIcons", ...props });
  },
  Food: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "restaurant-menu", family: "MaterialIcons", ...props });
  },
  Star: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "star", family: "MaterialIcons", ...props });
  },
  StarOutline: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "star-border", family: "MaterialIcons", ...props });
  },
  Favorite: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "favorite", family: "MaterialIcons", ...props });
  },
  FavoriteOutline: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "favorite-border", family: "MaterialIcons", ...props });
  },
  
  // Action Icons
  Add: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "add", family: "MaterialIcons", ...props });
  },
  Remove: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "remove", family: "MaterialIcons", ...props });
  },
  Edit: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "edit", family: "MaterialIcons", ...props });
  },
  Delete: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "delete", family: "MaterialIcons", ...props });
  },
  Check: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "check", family: "MaterialIcons", ...props });
  },
  Close: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "close", family: "MaterialIcons", ...props });
  },
  
  // Location Icons
  Location: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "location-on", family: "MaterialIcons", ...props });
  },
  LocationOutline: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "location-off", family: "MaterialIcons", ...props });
  },
  Map: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "map", family: "MaterialIcons", ...props });
  },
  
  // Time Icons
  Time: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "access-time", family: "MaterialIcons", ...props });
  },
  Clock: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "schedule", family: "MaterialIcons", ...props });
  },
  
  // Communication Icons
  Phone: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "phone", family: "MaterialIcons", ...props });
  },
  Email: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "email", family: "MaterialIcons", ...props });
  },
  Message: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "message", family: "MaterialIcons", ...props });
  },
  
  // Status Icons
  Success: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "check-circle", family: "MaterialIcons", ...props });
  },
  Error: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "error", family: "MaterialIcons", ...props });
  },
  Warning: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "warning", family: "MaterialIcons", ...props });
  },
  Info: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "info", family: "MaterialIcons", ...props });
  },
  
  // Arrow Icons
  ArrowUp: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "keyboard-arrow-up", family: "MaterialIcons", ...props });
  },
  ArrowDown: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "keyboard-arrow-down", family: "MaterialIcons", ...props });
  },
  ArrowLeft: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "keyboard-arrow-left", family: "MaterialIcons", ...props });
  },
  ArrowRight: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "keyboard-arrow-right", family: "MaterialIcons", ...props });
  },
  ChevronRight: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "chevron-right", family: "MaterialIcons", ...props });
  },
  ChevronLeft: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "chevron-left", family: "MaterialIcons", ...props });
  },
  
  // Payment Icons
  CreditCard: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "credit-card", family: "MaterialIcons", ...props });
  },
  Payment: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "payment", family: "MaterialIcons", ...props });
  },
  Wallet: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "account-balance-wallet", family: "MaterialIcons", ...props });
  },
  
  // Settings Icons
  Settings: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "settings", family: "MaterialIcons", ...props });
  },
  Notifications: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "notifications", family: "MaterialIcons", ...props });
  },
  Help: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "help", family: "MaterialIcons", ...props });
  },
  
  // Delivery Icons
  Delivery: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "local-shipping", family: "MaterialIcons", ...props });
  },
  Bike: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "pedal-bike", family: "MaterialIcons", ...props });
  },
  Scooter: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "electric-scooter", family: "MaterialIcons", ...props });
  },
  
  // Veg/Non-veg Icons
  Veg: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "circle", family: "MaterialIcons", ...props });
  },
  NonVeg: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "cancel", family: "MaterialIcons", ...props });
  },
  
  // Popular/Featured Icons
  Popular: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "local-fire-department", family: "MaterialIcons", ...props });
  },
  Featured: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "star", family: "MaterialIcons", ...props });
  },
  New: (props: Omit<IconProps, 'name' | 'family'>) => {
    return React.createElement(Icon, { name: "new-releases", family: "MaterialIcons", ...props });
  },
};