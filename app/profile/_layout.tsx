import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Profile',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          title: 'Edit Profile',
          headerShown: true,
          headerStyle: { backgroundColor: '#4F46E5' },
          headerTintColor: 'white'
        }} 
      />
      <Stack.Screen 
        name="addresses" 
        options={{ 
          title: 'My Addresses',
          headerShown: false,
          headerStyle: { backgroundColor: '#4F46E5' },
          headerTintColor: 'white'
        }} 
      />
      <Stack.Screen 
        name="addEditAddress" 
        options={{ 
          title: 'Add New Address',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="payment" 
        options={{ 
          title: 'Payment Methods',
          headerShown: true,
          headerStyle: { backgroundColor: '#4F46E5' },
          headerTintColor: 'white'
        }} 
      />
    </Stack>
  );
} 