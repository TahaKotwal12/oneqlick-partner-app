import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRestaurantProfileStore } from '../../store/restaurantProfileStore';
import { restaurantProfileService } from '../../services/restaurantProfileService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RestaurantSettingsScreen() {
    const router = useRouter();
    const { profile, fetchProfile } = useRestaurantProfileStore();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        email: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        latitude: 0,
        longitude: 0,
        cuisine_type: '',
        avg_delivery_time: '30',
        min_order_amount: '100',
        delivery_fee: '40',
        opening_time: '09:00',
        closing_time: '22:00',
        is_open: true,
    });

    // Load restaurant data only once on mount
    useEffect(() => {
        if (profile && !hasLoadedInitialData) {
            loadRestaurantData();
            setHasLoadedInitialData(true);
        }
    }, [profile, hasLoadedInitialData]);

    // Check for selected location from map picker
    useEffect(() => {
        const checkForSelectedLocation = async () => {
            try {
                const locationData = await AsyncStorage.getItem('selected_restaurant_location');
                if (locationData) {
                    const location = JSON.parse(locationData);
                    console.log('Auto-filling from map selection:', location);

                    // Update form with location data
                    setFormData(prev => ({
                        ...prev,
                        address_line1: location.address_line1 || prev.address_line1,
                        address_line2: location.address_line2 || prev.address_line2,
                        city: location.city || prev.city,
                        state: location.state || prev.state,
                        postal_code: location.postal_code || prev.postal_code,
                        latitude: location.latitude || prev.latitude,
                        longitude: location.longitude || prev.longitude,
                    }));

                    // Clear the stored location
                    await AsyncStorage.removeItem('selected_restaurant_location');

                    Alert.alert(
                        'Location Updated',
                        'Address fields have been auto-filled from the map. Please review and save.'
                    );
                }
            } catch (error) {
                console.error('Error checking for selected location:', error);
            }
        };

        // Check immediately on mount
        checkForSelectedLocation();

        // Also check every 500ms to catch when user returns from map
        const interval = setInterval(checkForSelectedLocation, 500);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    const loadRestaurantData = () => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                description: profile.description || '',
                phone: profile.phone || '',
                email: profile.email || '',
                address_line1: profile.address_line1 || '',
                address_line2: profile.address_line2 || '',
                city: profile.city || '',
                state: profile.state || '',
                postal_code: profile.postal_code || '',
                latitude: profile.latitude ? Number(profile.latitude) : 0,
                longitude: profile.longitude ? Number(profile.longitude) : 0,
                cuisine_type: profile.cuisine_type || '',
                avg_delivery_time: profile.avg_delivery_time?.toString() || '30',
                min_order_amount: profile.min_order_amount?.toString() || '100',
                delivery_fee: profile.delivery_fee?.toString() || '40',
                opening_time: profile.opening_time || '09:00',
                closing_time: profile.closing_time || '22:00',
                is_open: profile.is_open ?? true,
            });
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Restaurant name is required');
            return;
        }
        if (!formData.phone.trim()) {
            Alert.alert('Error', 'Phone number is required');
            return;
        }
        if (!formData.address_line1.trim()) {
            Alert.alert('Error', 'Address is required');
            return;
        }
        if (!formData.city.trim()) {
            Alert.alert('Error', 'City is required');
            return;
        }

        setSaving(true);
        try {
            const updateData = {
                name: formData.name,
                description: formData.description,
                phone: formData.phone,
                email: formData.email,
                address_line1: formData.address_line1,
                address_line2: formData.address_line2,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postal_code,
                latitude: formData.latitude,
                longitude: formData.longitude,
                cuisine_type: formData.cuisine_type,
                avg_delivery_time: parseInt(formData.avg_delivery_time),
                min_order_amount: parseFloat(formData.min_order_amount),
                delivery_fee: parseFloat(formData.delivery_fee),
                is_open: formData.is_open,
            };

            console.log('Updating restaurant with data:', updateData);
            const response = await restaurantProfileService.updateProfile(updateData);
            console.log('Update response:', response);

            // ApiResponse has code, message, message_id, data
            if (response.code === 200 && response.data) {
                await fetchProfile(); // Refresh profile data
                Alert.alert('Success', 'Restaurant details updated successfully!');
            } else {
                const errorMsg = response.message || 'Failed to update';
                console.error('Update failed:', errorMsg);
                throw new Error(errorMsg);
            }
        } catch (error: any) {
            console.error('Error updating restaurant:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
            });
            Alert.alert(
                'Error',
                error.message || 'Failed to update restaurant details. Please check your connection and try again.'
            );
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: string | boolean) => {
        setFormData({ ...formData, [field]: value });
    };

    if (!profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF6B35" />
                    <Text style={styles.loadingText}>Loading restaurant details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Restaurant Settings</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator size="small" color="#FF6B35" />
                    ) : (
                        <MaterialIcons name="check" size={24} color="#FF6B35" />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Status Card */}
                <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <View>
                            <Text style={styles.statusLabel}>Restaurant Status</Text>
                            <Text style={styles.statusValue}>
                                {formData.is_open ? '🟢 Open' : '🔴 Closed'}
                            </Text>
                        </View>
                        <Switch
                            value={formData.is_open}
                            onValueChange={(value) => updateField('is_open', value)}
                            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                            thumbColor={formData.is_open ? '#FFFFFF' : '#F3F4F6'}
                        />
                    </View>
                    <Text style={styles.statusHint}>
                        Toggle to open/close your restaurant for orders
                    </Text>
                </View>

                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Restaurant Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => updateField('name', text)}
                            placeholder="e.g., Taha's Spice Kitchen"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.description}
                            onChangeText={(text) => updateField('description', text)}
                            placeholder="Tell customers about your restaurant..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Cuisine Type *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.cuisine_type}
                            onChangeText={(text) => updateField('cuisine_type', text)}
                            placeholder="e.g., North Indian, Italian"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Phone Number *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(text) => updateField('phone', text)}
                            placeholder="+91 98765 43210"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(text) => updateField('email', text)}
                            placeholder="contact@restaurant.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Restaurant Address</Text>

                    {/* Map Picker Button */}
                    <TouchableOpacity
                        style={styles.mapPickerButton}
                        onPress={() => router.push('/map-picker')}
                    >
                        <MaterialIcons name="map" size={20} color="#FF6B35" />
                        <Text style={styles.mapPickerText}>📍 Pick Location on Map</Text>
                    </TouchableOpacity>

                    <View style={styles.field}>
                        <Text style={styles.label}>Address Line 1 *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.address_line1}
                            onChangeText={(text) => updateField('address_line1', text)}
                            placeholder="Street Address"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Address Line 2</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.address_line2}
                            onChangeText={(text) => updateField('address_line2', text)}
                            placeholder="Apartment, Suite, etc. (Optional)"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>City *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.city}
                                onChangeText={(text) => updateField('city', text)}
                                placeholder="City"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>State *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.state}
                                onChangeText={(text) => updateField('state', text)}
                                placeholder="State"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Postal Code *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.postal_code}
                            onChangeText={(text) => updateField('postal_code', text)}
                            placeholder="411001"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Operational Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Operational Details</Text>

                    <View style={styles.row}>
                        <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Opening Time</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.opening_time}
                                onChangeText={(text) => updateField('opening_time', text)}
                                placeholder="09:00"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Closing Time</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.closing_time}
                                onChangeText={(text) => updateField('closing_time', text)}
                                placeholder="22:00"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Average Delivery Time (minutes)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.avg_delivery_time}
                            onChangeText={(text) => updateField('avg_delivery_time', text)}
                            placeholder="30"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Minimum Order Amount (₹)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.min_order_amount}
                            onChangeText={(text) => updateField('min_order_amount', text)}
                            placeholder="100"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Delivery Fee (₹)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.delivery_fee}
                            onChangeText={(text) => updateField('delivery_fee', text)}
                            placeholder="40"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <MaterialIcons name="save" size={20} color="#FFF" />
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
        marginLeft: 16,
    },
    content: {
        flex: 1,
    },
    statusCard: {
        backgroundColor: '#FFF',
        marginTop: 16,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    statusValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    statusHint: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    section: {
        backgroundColor: '#FFF',
        marginTop: 16,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
        backgroundColor: '#FFF',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
    },
    mapPickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFF5F0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF6B35',
        marginBottom: 16,
        gap: 8,
    },
    mapPickerText: {
        color: '#FF6B35',
        fontSize: 14,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#FF6B35',
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
