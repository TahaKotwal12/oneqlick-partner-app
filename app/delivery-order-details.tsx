import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    Linking,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../components/common/AppHeader';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useDeliveryOrderStore } from '../store/deliveryOrderStore';

export default function DeliveryOrderDetailsScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const { theme } = useTheme();
    const { t } = useLanguage();

    // Store
    const {
        selectedOrder,
        fetchOrderDetails,
        markPickedUp,
        completeDelivery,
        isLoading,
    } = useDeliveryOrderStore();

    // Local state
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [otpInputs, setOtpInputs] = useState<any[]>([]);

    // Fetch order details
    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        }
    }, [orderId]);

    const isDark = theme === 'dark';
    const order = selectedOrder;

    if (!order) {
        return (
            <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <AppHeader title="Order Details" showBack />
                <View style={styles.loadingContainer}>
                    <Text style={{ color: isDark ? '#FFF' : '#000' }}>Loading order details...</Text>
                </View>
            </View>
        );
    }

    // Handle mark picked up
    const handleMarkPickedUp = async () => {
        Alert.alert(
            'Confirm Pickup',
            'Have you picked up the order from the restaurant?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        const result = await markPickedUp(order.order_id);
                        if (result.success) {
                            Alert.alert('Success', 'Order marked as picked up. Navigate to customer location.');
                        } else {
                            Alert.alert('Error', result.error || 'Failed to mark as picked up');
                        }
                    },
                },
            ]
        );
    };

    // Handle complete delivery
    const handleCompleteDelivery = () => {
        setShowOTPModal(true);
        setOtp(['', '', '', '']);
    };

    // Handle OTP input
    const handleOTPChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            otpInputs[index + 1]?.focus();
        }
    };

    // Verify OTP and complete delivery
    const verifyAndComplete = async () => {
        const otpString = otp.join('');

        if (otpString.length !== 4) {
            Alert.alert('Error', 'Please enter 4-digit OTP');
            return;
        }

        const result = await completeDelivery(order.order_id, otpString);

        if (result.success) {
            setShowOTPModal(false);
            Alert.alert(
                'Delivery Completed!',
                `You earned ₹${order.delivery_fee}`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } else {
            Alert.alert('Error', result.error || 'Invalid OTP. Please try again.');
        }
    };

    // Handle call
    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    // Handle navigate
    const handleNavigate = (lat: number, lng: number, label: string) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };

    // Get status color
    const getStatusColor = () => {
        switch (order.order_status) {
            case 'ready_for_pickup':
                return '#FF9800';
            case 'picked_up':
                return '#2196F3';
            case 'delivered':
                return '#4CAF50';
            default:
                return '#999';
        }
    };

    // Get action button
    const getActionButton = () => {
        if (order.order_status === 'ready_for_pickup') {
            return (
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF9800' }]} onPress={handleMarkPickedUp}>
                    <MaterialIcons name="check-circle" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Mark Picked Up</Text>
                </TouchableOpacity>
            );
        }

        if (order.order_status === 'picked_up') {
            return (
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]} onPress={handleCompleteDelivery}>
                    <MaterialIcons name="done-all" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Complete Delivery</Text>
                </TouchableOpacity>
            );
        }

        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <AppHeader title={`Order #${order.order_number?.slice(-6)}`} showBack />

            <ScrollView style={styles.content}>
                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                    <Text style={styles.statusText}>
                        {order.order_status === 'ready_for_pickup' && 'Ready for Pickup'}
                        {order.order_status === 'picked_up' && 'Going to Customer'}
                        {order.order_status === 'delivered' && 'Delivered'}
                    </Text>
                </View>

                {/* Restaurant Section */}
                <View style={[styles.section, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="store" size={24} color="#FF6B35" />
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Pickup Location</Text>
                    </View>

                    <Text style={[styles.locationName, { color: isDark ? '#FFF' : '#000' }]}>
                        {order.restaurant?.name}
                    </Text>
                    <Text style={[styles.locationAddress, { color: isDark ? '#AAA' : '#666' }]}>
                        {order.restaurant?.address}
                    </Text>

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.smallButton, { backgroundColor: '#4CAF50' }]}
                            onPress={() => handleCall(order.restaurant?.phone || '')}
                        >
                            <MaterialIcons name="call" size={18} color="#fff" />
                            <Text style={styles.smallButtonText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.smallButton, { backgroundColor: '#2196F3' }]}
                            onPress={() =>
                                handleNavigate(
                                    order.restaurant?.latitude || 0,
                                    order.restaurant?.longitude || 0,
                                    'Restaurant'
                                )
                            }
                        >
                            <MaterialIcons name="navigation" size={18} color="#fff" />
                            <Text style={styles.smallButtonText}>Navigate</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Items Section */}
                <View style={[styles.section, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="food" size={24} color="#FF6B35" />
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Order Items</Text>
                    </View>

                    {order.items?.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={[styles.itemName, { color: isDark ? '#CCC' : '#333' }]}>
                                {item.quantity}x {item.food_item_name}
                            </Text>
                            <Text style={[styles.itemPrice, { color: isDark ? '#AAA' : '#666' }]}>
                                ₹{item.total_price}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Customer Section */}
                <View style={[styles.section, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="account" size={24} color="#FF6B35" />
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Delivery Location</Text>
                    </View>

                    <Text style={[styles.locationName, { color: isDark ? '#FFF' : '#000' }]}>
                        {order.customer?.first_name} {order.customer?.last_name}
                    </Text>
                    <Text style={[styles.locationAddress, { color: isDark ? '#AAA' : '#666' }]}>
                        {order.delivery_address?.address_line1}
                        {order.delivery_address?.address_line2 && `, ${order.delivery_address.address_line2}`}
                    </Text>
                    <Text style={[styles.locationAddress, { color: isDark ? '#AAA' : '#666' }]}>
                        {order.delivery_address?.city}, {order.delivery_address?.state} - {order.delivery_address?.postal_code}
                    </Text>

                    {order.special_instructions && (
                        <View style={styles.instructionsBox}>
                            <MaterialCommunityIcons name="information" size={16} color="#2196F3" />
                            <Text style={[styles.instructionsText, { color: isDark ? '#CCC' : '#333' }]}>
                                {order.special_instructions}
                            </Text>
                        </View>
                    )}

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.smallButton, { backgroundColor: '#4CAF50' }]}
                            onPress={() => handleCall(order.customer?.phone || '')}
                        >
                            <MaterialIcons name="call" size={18} color="#fff" />
                            <Text style={styles.smallButtonText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.smallButton, { backgroundColor: '#2196F3' }]}
                            onPress={() =>
                                handleNavigate(
                                    order.delivery_address?.latitude || 0,
                                    order.delivery_address?.longitude || 0,
                                    'Customer'
                                )
                            }
                        >
                            <MaterialIcons name="navigation" size={18} color="#fff" />
                            <Text style={styles.smallButtonText}>Navigate</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Payment Section */}
                <View style={[styles.section, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="cash" size={24} color="#FF6B35" />
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Payment Details</Text>
                    </View>

                    <View style={styles.paymentRow}>
                        <Text style={[styles.paymentLabel, { color: isDark ? '#AAA' : '#666' }]}>Subtotal</Text>
                        <Text style={[styles.paymentValue, { color: isDark ? '#FFF' : '#000' }]}>
                            ₹{order.subtotal?.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={[styles.paymentLabel, { color: isDark ? '#AAA' : '#666' }]}>Delivery Fee</Text>
                        <Text style={[styles.paymentValue, { color: isDark ? '#FFF' : '#000' }]}>
                            ₹{order.delivery_fee?.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={[styles.paymentLabel, { color: isDark ? '#AAA' : '#666' }]}>Tax</Text>
                        <Text style={[styles.paymentValue, { color: isDark ? '#FFF' : '#000' }]}>
                            ₹{order.tax_amount?.toFixed(2)}
                        </Text>
                    </View>
                    <View style={[styles.paymentRow, styles.totalRow]}>
                        <Text style={[styles.totalLabel, { color: isDark ? '#FFF' : '#000' }]}>Total</Text>
                        <Text style={styles.totalValue}>₹{order.total_amount?.toFixed(2)}</Text>
                    </View>

                    <View style={styles.paymentMethodBox}>
                        <MaterialCommunityIcons
                            name={order.payment_method === 'cash' ? 'cash' : 'credit-card'}
                            size={20}
                            color={isDark ? '#FFF' : '#000'}
                        />
                        <Text style={[styles.paymentMethodText, { color: isDark ? '#FFF' : '#000' }]}>
                            {order.payment_method === 'cash' ? 'Cash on Delivery' : 'Online Payment'}
                        </Text>
                    </View>

                    {order.payment_method === 'cash' && (
                        <View style={styles.codAlert}>
                            <MaterialCommunityIcons name="alert-circle" size={20} color="#FF9800" />
                            <Text style={styles.codAlertText}>Collect ₹{order.total_amount?.toFixed(2)} from customer</Text>
                        </View>
                    )}
                </View>

                {/* Earnings Section */}
                <View style={[styles.earningsBox, { backgroundColor: '#4CAF50' }]}>
                    <Text style={styles.earningsLabel}>Your Earnings</Text>
                    <Text style={styles.earningsValue}>₹{order.delivery_fee?.toFixed(0)}</Text>
                </View>

                {/* Action Button */}
                {getActionButton()}

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* OTP Modal */}
            <Modal visible={showOTPModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#000' }]}>Enter Delivery OTP</Text>
                        <Text style={[styles.modalSubtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            Ask customer for 4-digit OTP
                        </Text>

                        <View style={styles.otpContainer}>
                            {[0, 1, 2, 3].map((index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => { if (ref) otpInputs[index] = ref; }}
                                    style={[
                                        styles.otpInput,
                                        {
                                            borderColor: isDark ? '#555' : '#DDD',
                                            backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                                            color: isDark ? '#FFF' : '#000',
                                        },
                                    ]}
                                    value={otp[index]}
                                    onChangeText={(value) => handleOTPChange(value, index)}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    selectTextOnFocus
                                />
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: isDark ? '#444' : '#E0E0E0' }]}
                                onPress={() => setShowOTPModal(false)}
                            >
                                <Text style={{ color: isDark ? '#FFF' : '#666', fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
                                onPress={verifyAndComplete}
                            >
                                <Text style={{ color: '#fff', fontWeight: '600' }}>Verify & Deliver</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        margin: 16,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    statusText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 14,
        lineHeight: 20,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    smallButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    smallButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    itemName: {
        fontSize: 14,
        flex: 1,
    },
    itemPrice: {
        fontSize: 14,
    },
    instructionsBox: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        padding: 12,
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
    },
    instructionsText: {
        fontSize: 14,
        flex: 1,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    paymentLabel: {
        fontSize: 14,
    },
    paymentValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    totalRow: {
        borderTopWidth: 2,
        borderTopColor: '#E0E0E0',
        marginTop: 8,
        paddingTop: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    paymentMethodBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        padding: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
    },
    paymentMethodText: {
        fontSize: 14,
        fontWeight: '600',
    },
    codAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        padding: 12,
        backgroundColor: '#FFF3E0',
        borderRadius: 8,
    },
    codAlertText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F57C00',
    },
    earningsBox: {
        margin: 16,
        marginTop: 0,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    earningsLabel: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 4,
    },
    earningsValue: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        marginTop: 0,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 16,
        padding: 24,
        width: '85%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 24,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 8,
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});