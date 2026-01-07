import { Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuthZustand';
import { Text, View, ActivityIndicator } from 'react-native';

export default function TabIndex() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF6B35" />
            </View>
        );
    }

    // Redirect based on user role
    if (user?.role === 'restaurant_owner') {
        return <Redirect href="/(tabs)/orders" />;
    } else if (user?.role === 'delivery_partner') {
        return <Redirect href="/(tabs)/deliveries" />;
    }

    // Fallback to profile
    return <Redirect href="/(tabs)/profile" />;
}
