import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapAddressPicker from '../components/MapAddressPicker';
import { useRouter } from 'expo-router';
import { useRestaurantProfileStore } from '../store/restaurantProfileStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MapPickerScreen() {
    const router = useRouter();
    const { profile } = useRestaurantProfileStore();

    const handleLocationSelected = async (location: any) => {
        console.log('Location selected:', location);

        // Store location data in AsyncStorage
        try {
            await AsyncStorage.setItem('selected_restaurant_location', JSON.stringify(location));
            console.log('Location saved to AsyncStorage');
        } catch (error) {
            console.error('Error saving location:', error);
        }

        // Navigate back
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <MapAddressPicker
                onLocationSelected={handleLocationSelected}
                initialLocation={
                    profile?.latitude && profile?.longitude
                        ? {
                            latitude: Number(profile.latitude),
                            longitude: Number(profile.longitude),
                        }
                        : undefined
                }
            />
        </SafeAreaView>
    );
}
