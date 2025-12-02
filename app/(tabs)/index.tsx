import { Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuthZustand';
import { Text, View } from 'react-native';

export default function TabIndex() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <View><Text>Loading...</Text></View>;
    }

    if (user?.role === 'restaurant_owner') {
        return <Redirect href="/(tabs)/orders" />;
    } else if (user?.role === 'delivery_partner') {
        return <Redirect href="/(tabs)/deliveries" />;
    }

    // Fallback
    return <Redirect href="/(tabs)/profile" />;
}
