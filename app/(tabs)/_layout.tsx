// oneQlick/app/(tabs)/_layout.tsx 

import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuthZustand';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

export default function TabLayout() {
  const { user } = useAuth();
  const theme = useTheme();
  const insets = useSafeAreaInsets(); 

  const isRestaurant = user?.role === 'restaurant_owner';
  const isDelivery = user?.role === 'delivery_partner'; 

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#f0f0f0',
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
      {/* Index - Hidden */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      {/* 1. RESTAURANT STARTING TABS (Conditional) */}
      {isRestaurant ? (
        // SHOW: Orders and Menu for Restaurant Owner
        <>
          <Tabs.Screen
            name="orders"
            options={{
              title: 'Orders',
              tabBarIcon: ({ color }) => <MaterialIcons name="list-alt" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="menu"
            options={{
              title: 'Menu',
              tabBarIcon: ({ color }) => <MaterialIcons name="restaurant-menu" size={24} color={color} />,
            }}
          />
        </>
      ) : (
        // 🔑 FIX: HIDE Orders and Menu for Delivery Partner/Other Roles
        <>
          <Tabs.Screen name="orders" options={{ href: null }} />
          <Tabs.Screen name="menu" options={{ href: null }} />
        </>
      )}

      {/* 2. DELIVERY STARTING TABS (Conditional) */}
      {isDelivery ? (
        <Tabs.Screen
          name="deliveries"
          options={{
            title: 'Deliveries',
            tabBarIcon: ({ color }) => <MaterialIcons name="delivery-dining" size={24} color={color} />,
          }}
        />
      ) : (
        // Hide the Deliveries tab for the Restaurant Owner/Other Roles
        <Tabs.Screen name="deliveries" options={{ href: null }} />
      )}
      
      {/* 3. COMMON TABS - Earnings and Profile */}
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color }) => <MaterialIcons name="attach-money" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />

      {/* 4. ACTIVITY TAB (Always Last) */}
      <Tabs.Screen
          name="activity" 
          options={{
            title: 'Activity', 
            tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />,
          }}
      />
    </Tabs>
  );
}