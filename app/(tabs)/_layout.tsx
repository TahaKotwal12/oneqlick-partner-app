// oneQlick/app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuthZustand';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const role = user?.role?.toLowerCase();

  const isRestaurant = role === 'restaurant_owner' || role === 'restaurant';
  const isDelivery = role === 'delivery_partner' || role === 'delivery';

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

      {/* Hidden index */}
      <Tabs.Screen name="index" options={{ href: null }} />

      {/* 1 → DELIVERIES */}
      {isDelivery ? (
        <Tabs.Screen
          name="deliveries"
          options={{
            title: 'Deliveries',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="delivery-dining" size={26} color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="deliveries" options={{ href: null }} />
      )}

      {/* 2 → EARNINGS */}
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="attach-money" size={26} color={color} />
          ),
        }}
      />

      {/* 3 → ORDERS */}
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="list-alt" size={26} color={color} />
          ),
        }}
      />

      {/* 4 → MENU */}
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="restaurant-menu" size={26} color={color} />
          ),
        }}
      />

      {/* 5 → ACTIVITY */}
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={26} color={color} />
          ),
        }}
      />

      {/* 6 → PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={26} color={color} />
          ),
        }}
      />

      {/* 7 → SETTINGS */}
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
