import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuthZustand';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const { user } = useAuth();
  const theme = useTheme();

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
          height: 60,
          paddingBottom: 8,
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

      {/* Restaurant Tabs */}
      {user?.role === 'restaurant_owner' ? (
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
        // Hide these if not restaurant
        <>
          <Tabs.Screen name="orders" options={{ href: null }} />
          <Tabs.Screen name="menu" options={{ href: null }} />
        </>
      )}

      {/* Delivery Tabs */}
      {user?.role === 'delivery_partner' ? (
        <Tabs.Screen
          name="deliveries"
          options={{
            title: 'Deliveries',
            tabBarIcon: ({ color }) => <MaterialIcons name="delivery-dining" size={24} color={color} />,
          }}
        />
      ) : (
        <Tabs.Screen name="deliveries" options={{ href: null }} />
      )}

      {/* Common Tabs */}
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
    </Tabs>
  );
}