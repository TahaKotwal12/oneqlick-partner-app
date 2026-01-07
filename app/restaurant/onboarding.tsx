import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { restaurantProfileService } from '../../services/restaurantProfileService';
import { useRestaurantProfileStore } from '../../store/restaurantProfileStore';

export default function RestaurantOnboardingScreen() {
    const router = useRouter();
    const { fetchProfile } = useRestaurantProfileStore();
    const [loading, setLoading] = useState(false);

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
        cuisine_type: '',
        avg_delivery_time: '30',
        min_order_amount: '100',
        delivery_fee: '40',
        opening_time: '09:00',
        closing_time: '22:00',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.address_line1.trim()) newErrors.address_line1 = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.postal_code.trim()) newErrors.postal_code = 'Postal code is required';
        if (!formData.cuisine_type.trim()) newErrors.cuisine_type = 'Cuisine type is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            // Call API to create restaurant
            const response = await restaurantProfileService.createRestaurant({
                name: formData.name,
                description: formData.description,
                phone: formData.phone,
                email: formData.email,
                address_line1: formData.address_line1,
                address_line2: formData.address_line2,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postal_code,
                cuisine_type: formData.cuisine_type,
                avg_delivery_time: parseInt(formData.avg_delivery_time),
                min_order_amount: parseFloat(formData.min_order_amount),
                delivery_fee: parseFloat(formData.delivery_fee),
            });

            console.log('Restaurant created:', response);

            // Refresh profile data
            await fetchProfile();

            Alert.alert(
                'Success!',
                'Your restaurant has been created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(tabs)/orders'),
                    },
                ]
            );
        } catch (error: any) {
            console.error('Error creating restaurant:', error);
            Alert.alert('Error', error.message || 'Failed to create restaurant');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="restaurant" size={48} color="#FF6B35" />
                <Text style={styles.title}>Setup Your Restaurant</Text>
                <Text style={styles.subtitle}>
                    Let's get your restaurant profile ready to start receiving orders
                </Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Restaurant Name *</Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            value={formData.name}
                            onChangeText={(text) => updateField('name', text)}
                            placeholder="e.g., Taha's Spice Kitchen"
                            placeholderTextColor="#9CA3AF"
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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
                            style={[styles.input, errors.cuisine_type && styles.inputError]}
                            value={formData.cuisine_type}
                            onChangeText={(text) => updateField('cuisine_type', text)}
                            placeholder="e.g., North Indian, Italian, Chinese"
                            placeholderTextColor="#9CA3AF"
                        />
                        {errors.cuisine_type && <Text style={styles.errorText}>{errors.cuisine_type}</Text>}
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Phone Number *</Text>
                        <TextInput
                            style={[styles.input, errors.phone && styles.inputError]}
                            value={formData.phone}
                            onChangeText={(text) => updateField('phone', text)}
                            placeholder="+91 98765 43210"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                        />
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Email *</Text>
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            value={formData.email}
                            onChangeText={(text) => updateField('email', text)}
                            placeholder="contact@restaurant.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>
                </View>

                {/* Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Restaurant Address</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Address Line 1 *</Text>
                        <TextInput
                            style={[styles.input, errors.address_line1 && styles.inputError]}
                            value={formData.address_line1}
                            onChangeText={(text) => updateField('address_line1', text)}
                            placeholder="Street Address"
                            placeholderTextColor="#9CA3AF"
                        />
                        {errors.address_line1 && <Text style={styles.errorText}>{errors.address_line1}</Text>}
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
                                style={[styles.input, errors.city && styles.inputError]}
                                value={formData.city}
                                onChangeText={(text) => updateField('city', text)}
                                placeholder="City"
                                placeholderTextColor="#9CA3AF"
                            />
                            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                        </View>

                        <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>State *</Text>
                            <TextInput
                                style={[styles.input, errors.state && styles.inputError]}
                                value={formData.state}
                                onChangeText={(text) => updateField('state', text)}
                                placeholder="State"
                                placeholderTextColor="#9CA3AF"
                            />
                            {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Postal Code *</Text>
                        <TextInput
                            style={[styles.input, errors.postal_code && styles.inputError]}
                            value={formData.postal_code}
                            onChangeText={(text) => updateField('postal_code', text)}
                            placeholder="411001"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                        {errors.postal_code && <Text style={styles.errorText}>{errors.postal_code}</Text>}
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

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.submitButtonText}>Create Restaurant</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
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
    header: {
        backgroundColor: '#FFF',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: '#FFF',
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
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
    inputError: {
        borderColor: '#EF4444',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
    },
    submitButton: {
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
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
