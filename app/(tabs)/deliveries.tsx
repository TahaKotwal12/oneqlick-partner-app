import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    Switch,
    ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDeliveryOrderStore } from '../../store/deliveryOrderStore';
import { DeliveryOrder } from '../../services/deliveryOrderService';

export default function DeliveryDashboardScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();

    // Store
    const {
        availableOrders,
        activeDeliveries,
        earnings,
        isOnline,
        isLoading,
        fetchAvailableOrders,
        fetchActiveDeliveries,
        fetchEarnings,
        toggleOnlineStatus,
        setCurrentLocation,
        acceptDelivery,
        refreshAll,
    } = useDeliveryOrderStore();

    // Local state
    const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');
    const [refreshing, setRefreshing] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        if (isOnline) {
            fetchAvailableOrders();
        }
        fetchActiveDeliveries();
        fetchEarnings();
    }, [isOnline]);

    // Handle refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshAll();
        setRefreshing(false);
    };

    // Handle toggle online status
    const handleToggleOnline = async () => {
        if (!isOnline) {
            // Request location permission before going online
            setLocationLoading(true);
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    setLocationLoading(false);
                    Alert.alert(
                        'Location Permission Required',
                        'Please enable location permission to go online and receive delivery requests.'
                    );
                    return;
                }

                // Get current location
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

                // Store location
                setCurrentLocation(location.coords.latitude, location.coords.longitude);

                // Go online
                toggleOnlineStatus();
                setLocationLoading(false);
            } catch (error) {
                setLocationLoading(false);
                Alert.alert(
                    'Location Error',
                    'Failed to get your location. Please enable location services and try again.'
                );
            }
        } else {
            Alert.alert(
                'Go Offline',
                'You will stop receiving new delivery requests',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Go Offline', onPress: toggleOnlineStatus },
                ]
            );
        }
    };

    // Handle accept delivery
    const handleAcceptDelivery = async (orderId: string) => {
        const result = await acceptDelivery(orderId);

        if (result.success) {
            Alert.alert('Success', 'Delivery accepted! Navigate to restaurant to pick up the order.');
            setActiveTab('active');
        } else {
            Alert.alert('Error', result.error || 'Failed to accept delivery');
        }
    };

    const isDark = theme === 'dark';

    // Render stats card
    const renderStatCard = (
        icon: string,
        label: string,
        value: string,
        color: string
    ) => (
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
                <MaterialCommunityIcons name={icon as any} size={24} color={color} />
            </View>
            <Text style={[styles.statValue, { color: isDark ? '#FFF' : '#000' }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#AAA' : '#666' }]}>{label}</Text>
        </View>
    );

    // Render order card
    const renderOrderCard = ({ item }: { item: DeliveryOrder }) => (
        <TouchableOpacity
            style={[styles.orderCard, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
            onPress={() => router.push({ pathname: '/delivery-order-details', params: { orderId: item.order_id } })}
        >
            {/* Restaurant Info */}
            <View style={styles.cardHeader}>
                <View style={styles.restaurantInfo}>
                    <MaterialCommunityIcons name="store" size={20} color="#FF6B35" />
                    <Text style={[styles.restaurantName, { color: isDark ? '#FFF' : '#000' }]}>
                        {item.restaurant?.name || 'Restaurant'}
                    </Text>
                </View>
                <Text style={[styles.distance, { color: isDark ? '#AAA' : '#666' }]}>
                    {item.distance_km?.toFixed(1) || '0'} km
                </Text>
            </View>

            {/* Pickup & Drop */}
            <View style={styles.locationSection}>
                <View style={styles.locationRow}>
                    <MaterialCommunityIcons name="map-marker" size={16} color="#4CAF50" />
                    <Text style={[styles.locationText, { color: isDark ? '#CCC' : '#333' }]} numberOfLines={1}>
                        {item.restaurant?.address || 'Pickup location'}
                    </Text>
                </View>
                <View style={styles.locationRow}>
                    <MaterialCommunityIcons name="map-marker" size={16} color="#F44336" />
                    <Text style={[styles.locationText, { color: isDark ? '#CCC' : '#333' }]} numberOfLines={1}>
                        {item.delivery_address?.address_line1 || 'Drop location'}
                    </Text>
                </View>
            </View>

            {/* Payment & Earnings */}
            <View style={styles.cardFooter}>
                <View style={styles.paymentInfo}>
                    <MaterialCommunityIcons
                        name={item.payment_method === 'cash' ? 'cash' : 'credit-card'}
                        size={16}
                        color={isDark ? '#AAA' : '#666'}
                    />
                    <Text style={[styles.paymentText, { color: isDark ? '#AAA' : '#666' }]}>
                        {item.payment_method === 'cash' ? 'COD' : 'Online'}
                    </Text>
                </View>
                <Text style={styles.earningsText}>₹{(item.delivery_fee || 0).toFixed(0)}</Text>
            </View>

            {/* Accept Button (only for available orders) */}
            {activeTab === 'available' && (
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleAcceptDelivery(item.order_id);
                    }}
                >
                    <MaterialIcons name="check-circle" size={20} color="#fff" />
                    <Text style={styles.acceptButtonText}>Accept Delivery</Text>
                </TouchableOpacity>
            )}

            {/* Status Badge (for active orders) */}
            {activeTab === 'active' && (
                <View style={[styles.statusBadge, { backgroundColor: '#2196F3' }]}>
                    <Text style={styles.statusText}>
                        {item.order_status === 'picked_up' ? 'Going to Customer' : 'Going to Restaurant'}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const displayOrders = activeTab === 'available' ? availableOrders : activeDeliveries;

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                <View style={styles.headerTop}>
                    <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#000' }]}>Deliveries</Text>
                    <MaterialCommunityIcons name="bell-outline" size={24} color={isDark ? '#FFF' : '#000'} />
                </View>

                {/* Online/Offline Toggle */}
                <View style={styles.onlineToggle}>
                    <View style={styles.toggleLeft}>
                        <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#999' }]} />
                        <Text style={[styles.statusText2, { color: isDark ? '#FFF' : '#000' }]}>
                            {locationLoading ? 'Getting location...' : isOnline ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                    <Switch
                        value={isOnline}
                        onValueChange={handleToggleOnline}
                        disabled={locationLoading}
                        trackColor={{ false: '#767577', true: '#4CAF50' }}
                        thumbColor={isOnline ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* Stats Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.statsContainer}
                contentContainerStyle={styles.statsContent}
            >
                {renderStatCard('cash', "Today's Earnings", `₹${earnings?.today_earnings || 0}`, '#4CAF50')}
                {renderStatCard('check-circle', 'Completed', `${earnings?.completed_today || 0}`, '#2196F3')}
                {renderStatCard('bike-fast', 'Active', `${activeDeliveries.length}`, '#FF9800')}
                {renderStatCard('star', 'Rating', '4.8', '#FFD700')}
            </ScrollView>

            {/* Tabs */}
            <View style={[styles.tabsContainer, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'available' && styles.activeTab]}
                    onPress={() => setActiveTab('available')}
                >
                    <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
                        Available ({availableOrders.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
                        Active ({activeDeliveries.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
                    onPress={() => setActiveTab('completed')}
                >
                    <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Orders List */}
            <FlatList
                data={displayOrders}
                renderItem={renderOrderCard}
                keyExtractor={(item) => item.order_id}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons
                            name={activeTab === 'available' ? 'package-variant' : 'bike-fast'}
                            size={64}
                            color="#CCC"
                        />
                        <Text style={[styles.emptyText, { color: isDark ? '#AAA' : '#999' }]}>
                            {activeTab === 'available'
                                ? isOnline
                                    ? 'No orders available right now'
                                    : 'Go online to see available orders'
                                : 'No active deliveries'}
                        </Text>
                        {!isOnline && activeTab === 'available' && (
                            <TouchableOpacity style={styles.goOnlineButton} onPress={handleToggleOnline}>
                                <Text style={styles.goOnlineButtonText}>Go Online</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    onlineToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    statusText2: {
        fontSize: 16,
        fontWeight: '600',
    },
    statsContainer: {
        maxHeight: 120,
    },
    statsContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    statCard: {
        padding: 16,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#FF6B35',
    },
    tabText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#FF6B35',
        fontWeight: '700',
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    distance: {
        fontSize: 14,
    },
    locationSection: {
        gap: 8,
        marginBottom: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationText: {
        fontSize: 14,
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    paymentText: {
        fontSize: 14,
    },
    earningsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    acceptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    acceptButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    statusBadge: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center',
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    goOnlineButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginTop: 16,
    },
    goOnlineButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});