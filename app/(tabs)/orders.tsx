import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    Modal,
    TextInput,
    ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRestaurantOrderStore } from '../../store/restaurantOrderStore';

interface RestaurantOrder {
    id: string;
    status: 'New' | 'Preparing' | 'Ready' | 'Rejected' | 'Delivered';
    total: number;
    customer: string;
    pickup_time: string;
    items: { name: string; qty: number }[];
    notes?: string;
}

export default function OrderManagementScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();

    // Store
    const {
        pendingOrders,
        activeOrders,
        orderHistory,
        isLoading,
        fetchPendingOrders,
        fetchActiveOrders,
        fetchOrderHistory,
        acceptOrder,
        rejectOrder,
        updateOrderStatus,
        refreshAllOrders,
    } = useRestaurantOrderStore();

    // Local state
    const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'history'>('pending');
    const [refreshing, setRefreshing] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [prepTime, setPrepTime] = useState('30');
    const [rejectReason, setRejectReason] = useState('');

    // Fetch orders on mount
    useEffect(() => {
        fetchPendingOrders();
        fetchActiveOrders();
        fetchOrderHistory(1, 20);
    }, []);

    // Map backend orders to UI format
    const mapToUIOrder = (order: any): RestaurantOrder => ({
        id: order.order_id || '',
        status:
            order.order_status === 'pending'
                ? 'New'
                : order.order_status === 'confirmed' || order.order_status === 'preparing'
                    ? 'Preparing'
                    : order.order_status === 'ready_for_pickup'
                        ? 'Ready'
                        : order.order_status === 'delivered'
                            ? 'Delivered'
                            : 'Rejected',
        total: order.total_amount || 0,
        customer: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'Customer',
        pickup_time: order.estimated_delivery_time
            ? new Date(order.estimated_delivery_time).toLocaleTimeString()
            : 'TBD',
        items: (order.items || []).map((item: any) => ({
            name: item.food_item_name || 'Item',
            qty: item.quantity || 0,
        })),
        notes: order.order_status || '', // Store backend status here to determine button
    });

    const displayOrders =
        activeTab === 'pending'
            ? pendingOrders.map(mapToUIOrder)
            : activeTab === 'active'
                ? activeOrders.map(mapToUIOrder)
                : orderHistory.map(mapToUIOrder);

    // Handlers
    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshAllOrders();
        setRefreshing(false);
    };

    const handleAcceptOrder = (orderId: string) => {
        setSelectedOrderId(orderId);
        setPrepTime('30');
        setShowAcceptModal(true);
    };

    const confirmAcceptOrder = async () => {
        if (!selectedOrderId) return;

        const prepTimeNum = parseInt(prepTime);
        if (isNaN(prepTimeNum) || prepTimeNum < 5 || prepTimeNum > 120) {
            Alert.alert('Error', 'Please enter a valid preparation time (5-120 minutes)');
            return;
        }

        const result = await acceptOrder(selectedOrderId, prepTimeNum);
        setShowAcceptModal(false);

        if (result.success) {
            Alert.alert('Success', 'Order accepted successfully');
            await refreshAllOrders();
        } else {
            Alert.alert('Error', result.error || 'Failed to accept order');
        }
    };

    const handleRejectOrder = (orderId: string) => {
        setSelectedOrderId(orderId);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const confirmRejectOrder = async () => {
        if (!selectedOrderId || !rejectReason.trim()) {
            Alert.alert('Error', 'Please provide a rejection reason');
            return;
        }

        const result = await rejectOrder(selectedOrderId, rejectReason);
        setShowRejectModal(false);

        if (result.success) {
            Alert.alert('Success', 'Order rejected');
            await refreshAllOrders();
        } else {
            Alert.alert('Error', result.error || 'Failed to reject order');
        }
    };

    const handleStartPreparing = async (orderId: string) => {
        const result = await updateOrderStatus(orderId, 'preparing');

        if (result.success) {
            Alert.alert('Success', 'Order is now being prepared');
            await refreshAllOrders();
        } else {
            Alert.alert('Error', result.error || 'Failed to start preparing');
        }
    };

    const handleMarkReady = async (orderId: string) => {
        const result = await updateOrderStatus(orderId, 'ready_for_pickup');

        if (result.success) {
            Alert.alert('Success', 'Order marked as ready');
            await refreshAllOrders();
        } else {
            Alert.alert('Error', result.error || 'Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New':
                return '#FF9800';
            case 'Preparing':
                return '#2196F3';
            case 'Ready':
                return '#4CAF50';
            case 'Delivered':
                return '#000';
            case 'Rejected':
                return '#F44336';
            default:
                return '#999';
        }
    };

    const isDark = theme === 'dark';

    const renderOrderCard = ({ item }: { item: RestaurantOrder }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
            onPress={() => router.push({ pathname: '/restaurant-order-details', params: { orderId: item.id } })}
        >
            {/* Header */}
            <View style={styles.cardHeader}>
                <Text style={[styles.orderId, { color: isDark ? '#FFF' : '#000' }]}>#{item.id.slice(0, 8)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            {/* Customer Info */}
            <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account" size={16} color={isDark ? '#BBB' : '#666'} />
                <Text style={[styles.infoText, { color: isDark ? '#CCC' : '#333' }]}>{item.customer}</Text>
            </View>

            {/* Pickup Time */}
            <View style={styles.infoRow}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={isDark ? '#BBB' : '#666'} />
                <Text style={[styles.infoText, { color: isDark ? '#CCC' : '#333' }]}>{item.pickup_time}</Text>
            </View>

            {/* Items */}
            <View style={styles.itemsSection}>
                {item.items.slice(0, 2).map((orderItem, idx) => (
                    <Text key={idx} style={[styles.itemText, { color: isDark ? '#AAA' : '#666' }]}>
                        • {orderItem.qty}x {orderItem.name}
                    </Text>
                ))}
                {item.items.length > 2 && (
                    <Text style={[styles.itemText, { color: isDark ? '#AAA' : '#666' }]}>
                        +{item.items.length - 2} more items
                    </Text>
                )}
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: isDark ? '#BBB' : '#666' }]}>Total:</Text>
                <Text style={styles.totalAmount}>₹{(item.total || 0).toFixed(2)}</Text>
            </View>

            {/* Actions */}
            {item.status === 'New' && (
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleRejectOrder(item.id);
                        }}
                    >
                        <MaterialIcons name="close" size={18} color="#fff" />
                        <Text style={styles.actionBtnText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.acceptBtn]}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleAcceptOrder(item.id);
                        }}
                    >
                        <MaterialIcons name="check" size={18} color="#fff" />
                        <Text style={styles.actionBtnText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Confirmed status - needs to start preparing */}
            {item.status === 'Preparing' && item.notes === 'confirmed' && (
                <TouchableOpacity
                    style={[styles.actionBtn, styles.preparingBtn]}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleStartPreparing(item.id);
                    }}
                >
                    <MaterialIcons name="restaurant" size={18} color="#fff" />
                    <Text style={styles.actionBtnText}>Start Preparing</Text>
                </TouchableOpacity>
            )}

            {/* Preparing status - can mark as ready */}
            {item.status === 'Preparing' && item.notes === 'preparing' && (
                <TouchableOpacity
                    style={[styles.actionBtn, styles.readyBtn]}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleMarkReady(item.id);
                    }}
                >
                    <MaterialIcons name="done-all" size={18} color="#fff" />
                    <Text style={styles.actionBtnText}>Mark Ready</Text>
                </TouchableOpacity>
            )}

            {/* Ready status - waiting for pickup */}
            {item.status === 'Ready' && (
                <View style={styles.readyBadge}>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#4CAF50" />
                    <Text style={[styles.readyText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                        Ready for Pickup
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#000' }]}>Orders</Text>
            </View>

            {/* Tabs */}
            <View style={[styles.tabsContainer, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
                    onPress={() => setActiveTab('pending')}
                >
                    <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                        Pending ({pendingOrders.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
                        Active ({activeOrders.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                    onPress={() => setActiveTab('history')}
                >
                    <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
                </TouchableOpacity>
            </View>

            {/* Orders List */}
            <FlatList
                data={displayOrders}
                renderItem={renderOrderCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-outline" size={64} color="#CCC" />
                        <Text style={[styles.emptyText, { color: isDark ? '#AAA' : '#999' }]}>No orders found</Text>
                    </View>
                }
            />

            {/* Accept Modal */}
            <Modal visible={showAcceptModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#000' }]}>Accept Order</Text>
                        <Text style={[styles.modalLabel, { color: isDark ? '#BBB' : '#666' }]}>Preparation Time (minutes)</Text>

                        <View style={styles.prepTimeButtons}>
                            {['15', '20', '30', '45'].map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.prepTimeBtn,
                                        { borderColor: isDark ? '#555' : '#DDD', backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
                                        prepTime === time && styles.prepTimeBtnActive,
                                    ]}
                                    onPress={() => setPrepTime(time)}
                                >
                                    <Text
                                        style={[
                                            styles.prepTimeBtnText,
                                            { color: isDark ? '#FFF' : '#333' },
                                            prepTime === time && styles.prepTimeBtnTextActive,
                                        ]}
                                    >
                                        {time} min
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={[
                                styles.input,
                                { borderColor: isDark ? '#555' : '#DDD', backgroundColor: isDark ? '#2A2A2A' : '#fff', color: isDark ? '#FFF' : '#000' },
                            ]}
                            value={prepTime}
                            onChangeText={setPrepTime}
                            keyboardType="numeric"
                            placeholder="Custom time"
                            placeholderTextColor={isDark ? '#888' : '#999'}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: isDark ? '#444' : '#E0E0E0' }]}
                                onPress={() => setShowAcceptModal(false)}
                            >
                                <Text style={{ color: isDark ? '#FFF' : '#666', fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#4CAF50' }]} onPress={confirmAcceptOrder}>
                                <Text style={{ color: '#fff', fontWeight: '600' }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Reject Modal */}
            <Modal visible={showRejectModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#000' }]}>Reject Order</Text>
                        <Text style={[styles.modalLabel, { color: isDark ? '#BBB' : '#666' }]}>Rejection Reason</Text>

                        <View style={styles.reasonButtons}>
                            {['Out of stock', 'Too busy', 'Closing soon', 'Other'].map((reason) => (
                                <TouchableOpacity
                                    key={reason}
                                    style={[
                                        styles.reasonBtn,
                                        { borderColor: isDark ? '#555' : '#DDD', backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
                                        rejectReason === reason && styles.reasonBtnActive,
                                    ]}
                                    onPress={() => setRejectReason(reason)}
                                >
                                    <Text
                                        style={[
                                            styles.reasonBtnText,
                                            { color: isDark ? '#FFF' : '#333' },
                                            rejectReason === reason && styles.reasonBtnTextActive,
                                        ]}
                                    >
                                        {reason}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={[
                                styles.input,
                                styles.textArea,
                                { borderColor: isDark ? '#555' : '#DDD', backgroundColor: isDark ? '#2A2A2A' : '#fff', color: isDark ? '#FFF' : '#000' },
                            ]}
                            value={rejectReason}
                            onChangeText={setRejectReason}
                            placeholder="Enter custom reason"
                            placeholderTextColor={isDark ? '#888' : '#999'}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: isDark ? '#444' : '#E0E0E0' }]}
                                onPress={() => setShowRejectModal(false)}
                            >
                                <Text style={{ color: isDark ? '#FFF' : '#666', fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#F44336' }]} onPress={confirmRejectOrder}>
                                <Text style={{ color: '#fff', fontWeight: '600' }}>Confirm</Text>
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
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
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
    card: {
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
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    infoText: {
        fontSize: 14,
    },
    itemsSection: {
        marginVertical: 8,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    itemText: {
        fontSize: 13,
        marginBottom: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    totalLabel: {
        fontSize: 14,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    acceptBtn: {
        backgroundColor: '#4CAF50',
    },
    rejectBtn: {
        backgroundColor: '#F44336',
    },
    readyBtn: {
        backgroundColor: '#2196F3',
    },
    preparingBtn: {
        backgroundColor: '#FF9800',
    },
    actionBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    readyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 8,
    },
    readyText: {
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
        marginBottom: 16,
        textAlign: 'center',
    },
    modalLabel: {
        fontSize: 14,
        marginBottom: 12,
    },
    prepTimeButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    prepTimeBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
    prepTimeBtnActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    prepTimeBtnText: {
        fontSize: 14,
    },
    prepTimeBtnTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    reasonButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    reasonBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
    reasonBtnActive: {
        backgroundColor: '#F44336',
        borderColor: '#F44336',
    },
    reasonBtnText: {
        fontSize: 14,
    },
    reasonBtnTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});
