// oneQlick/app/(tabs)/_layout.tsx (FINAL ROBUST VERSION)

import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
// NOTE: Assuming this hook correctly manages the user role.
import { useAuth } from '../../hooks/useAuthZustand'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext'; 

export default function TabLayout() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme(); 

  const isDark = theme === 'dark';
  
  // 🔑 1. Define the current user's role string
  const role = user?.role?.toLowerCase();

  // 🔑 2. Determine the key flag for conditional rendering
  // This flag is TRUE only if the user is a delivery partner
  const isDelivery = role === 'delivery_partner' || role === 'delivery'; 
  
  // You might also find it helpful to explicitly define the customer/restaurant owner flag
  const isCustomerOrRestaurant = !isDelivery;

  // Define theme colors
  const ACTIVE_COLOR = isDark ? '#BB86FC' : '#4F46E5'; 
  const INACTIVE_COLOR = isDark ? '#AAAAAA' : '#6B7280';
  const TAB_BAR_BACKGROUND = isDark ? '#1E1E1E' : 'white';
  const TAB_BORDER_COLOR = isDark ? '#333333' : '#f0f0f0';


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        
        tabBarStyle: {
          backgroundColor: TAB_BAR_BACKGROUND,
          borderTopColor: TAB_BORDER_COLOR,
          elevation: 8,
          height: 75 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >

      {/* Hidden index - Always hide */}
      <Tabs.Screen name="index" options={{ href: null }} />

      {/* 1 → DELIVERIES: SHOW ONLY FOR DELIVERY PARTNER */}
      <Tabs.Screen
        name="deliveries"
        options={{
          // Show if Delivery Partner, hide otherwise
          href: isDelivery ? 'deliveries' : null, 
          title: 'Deliveries',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="delivery-dining" size={26} color={color} />
          ),
        }}
      />

      {/* 2 → EARNINGS: SHOW ONLY FOR DELIVERY PARTNER */}
      <Tabs.Screen
        name="earnings"
        options={{
          // Show if Delivery Partner, hide otherwise
          href: isDelivery ? 'earnings' : null, 
          title: 'Earnings',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="attach-money" size={26} color={color} />
          ),
        }}
      />

      {/* 3 → ORDERS: SHOW FOR RESTAURANT OWNER/CUSTOMER, HIDE FOR DELIVERY PARTNER */}
      <Tabs.Screen
        name="orders"
        options={{
          // Show if NOT a Delivery Partner, hide otherwise (This includes Restaurant Owners)
          href: isDelivery ? null : 'orders', 
          title: 'Orders',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="list-alt" size={26} color={color} />
          ),
        }}
      />

      {/* 4 → MENU: SHOW FOR RESTAURANT OWNER/CUSTOMER, HIDE FOR DELIVERY PARTNER */}
      <Tabs.Screen
        name="menu"
        options={{
          // Show if NOT a Delivery Partner, hide otherwise (This includes Restaurant Owners)
          href: isDelivery ? null : 'menu', 
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="restaurant-menu" size={26} color={color} />
          ),
        }}
      />

      {/* 5 → ACTIVITY: SHOW ONLY FOR DELIVERY PARTNER */}
      <Tabs.Screen
        name="activity"
        options={{
          // Show if Delivery Partner, hide otherwise
          href: isDelivery ? 'activity' : null, 
          title: 'Activity',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={26} color={color} />
          ),
        }}
      />

      {/* 6 → PROFILE: VISIBLE FOR ALL ROLES */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={26} color={color} />
          ),
        }}
      />

      {/* 7 → SETTINGS: VISIBLE FOR ALL ROLES */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={26} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}