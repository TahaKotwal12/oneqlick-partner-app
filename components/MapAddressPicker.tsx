import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface LocationData {
    latitude: number;
    longitude: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    landmark?: string;
}

interface Props {
    onLocationSelected: (location: LocationData) => void;
    initialLocation?: {
        latitude: number;
        longitude: number;
    };
}

export default function MapAddressPicker({ onLocationSelected, initialLocation }: Props) {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);

    const [region, setRegion] = useState({
        latitude: initialLocation?.latitude || 18.5204,
        longitude: initialLocation?.longitude || 73.8567,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [markerPosition, setMarkerPosition] = useState({
        latitude: initialLocation?.latitude || 18.5204,
        longitude: initialLocation?.longitude || 73.8567,
    });

    const [loading, setLoading] = useState(false);
    const [addressData, setAddressData] = useState<LocationData>({
        latitude: 0,
        longitude: 0,
        address_line1: '',
        city: '',
        state: '',
        postal_code: '',
    });

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                getCurrentLocation();
            } else {
                Alert.alert(
                    'Permission Denied',
                    'Location permission is required to use this feature'
                );
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
        }
    };

    const getCurrentLocation = async () => {
        try {
            setLoading(true);
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            setRegion(newRegion);
            setMarkerPosition({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            mapRef.current?.animateToRegion(newRegion, 1000);

            // Reverse geocode to get address
            await reverseGeocode(location.coords.latitude, location.coords.longitude);
        } catch (error) {
            console.error('Error getting current location:', error);
            Alert.alert('Error', 'Failed to get current location');
        } finally {
            setLoading(false);
        }
    };

    const reverseGeocode = async (latitude: number, longitude: number) => {
        try {
            setLoading(true);
            const results = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (results && results.length > 0) {
                const address = results[0];

                const locationData: LocationData = {
                    latitude,
                    longitude,
                    address_line1: `${address.name || ''} ${address.street || ''}`.trim(),
                    city: address.city || address.subregion || '',
                    state: address.region || '',
                    postal_code: address.postalCode || '',
                    landmark: address.name || '',
                };

                setAddressData(locationData);
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            Alert.alert('Error', 'Failed to get address details');
        } finally {
            setLoading(false);
        }
    };

    const handleMapPress = async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setMarkerPosition({ latitude, longitude });
        await reverseGeocode(latitude, longitude);
    };

    const handleConfirm = () => {
        if (!addressData.address_line1 || !addressData.city) {
            Alert.alert('Incomplete Address', 'Please ensure address details are filled');
            return;
        }

        onLocationSelected(addressData);
        router.back();
    };

    const searchLocation = async () => {
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            const results = await Location.geocodeAsync(searchQuery);

            if (results && results.length > 0) {
                const location = results[0];
                const newRegion = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };

                setRegion(newRegion);
                setMarkerPosition({
                    latitude: location.latitude,
                    longitude: location.longitude,
                });

                mapRef.current?.animateToRegion(newRegion, 1000);
                await reverseGeocode(location.latitude, location.longitude);
            } else {
                Alert.alert('Not Found', 'Location not found. Please try a different search.');
            }
        } catch (error) {
            console.error('Error searching location:', error);
            Alert.alert('Error', 'Failed to search location');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <View style={styles.searchInputContainer}>
                    <MaterialIcons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for area, street name..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={searchLocation}
                        returnKeyType="search"
                    />
                </View>

                <TouchableOpacity onPress={getCurrentLocation} style={styles.locationButton}>
                    <MaterialIcons name="my-location" size={24} color="#FF6B35" />
                </TouchableOpacity>
            </View>

            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={region}
                onPress={handleMapPress}
                showsUserLocation
                showsMyLocationButton={false}
            >
                <Marker
                    coordinate={markerPosition}
                    draggable
                    onDragEnd={async (e) => {
                        const { latitude, longitude } = e.nativeEvent.coordinate;
                        setMarkerPosition({ latitude, longitude });
                        await reverseGeocode(latitude, longitude);
                    }}
                >
                    <View style={styles.markerContainer}>
                        <MaterialIcons name="location-on" size={40} color="#FF6B35" />
                    </View>
                </Marker>
            </MapView>

            {/* Address Details Card */}
            <View style={styles.addressCard}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#FF6B35" />
                        <Text style={styles.loadingText}>Getting address...</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.addressHeader}>
                            <MaterialIcons name="location-on" size={24} color="#FF6B35" />
                            <Text style={styles.addressTitle}>Selected Location</Text>
                        </View>

                        <Text style={styles.addressText}>
                            {addressData.address_line1 || 'Move the pin to select location'}
                        </Text>
                        <Text style={styles.addressSubText}>
                            {addressData.city && addressData.state
                                ? `${addressData.city}, ${addressData.state} ${addressData.postal_code}`
                                : 'Address details will appear here'}
                        </Text>

                        <View style={styles.coordsContainer}>
                            <Text style={styles.coordsText}>
                                📍 {markerPosition.latitude.toFixed(6)}, {markerPosition.longitude.toFixed(6)}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                (!addressData.address_line1 || !addressData.city) && styles.confirmButtonDisabled,
                            ]}
                            onPress={handleConfirm}
                            disabled={!addressData.address_line1 || !addressData.city}
                        >
                            <MaterialIcons name="check-circle" size={20} color="#FFF" />
                            <Text style={styles.confirmButtonText}>Confirm Location</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 16,
        right: 16,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    backButton: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#333',
    },
    locationButton: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    map: {
        flex: 1,
    },
    markerContainer: {
        alignItems: 'center',
    },
    addressCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#666',
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    addressTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    addressText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
        fontWeight: '500',
    },
    addressSubText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    coordsContainer: {
        backgroundColor: '#F5F5F5',
        padding: 8,
        borderRadius: 6,
        marginBottom: 16,
    },
    coordsText: {
        fontSize: 12,
        color: '#666',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    confirmButton: {
        backgroundColor: '#FF6B35',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    confirmButtonDisabled: {
        backgroundColor: '#CCC',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
