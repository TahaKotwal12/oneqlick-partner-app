// oneQlick/app/(tabs)/orders.tsx (I18N + THEME FIXED)

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '../../components/common/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRestaurantOrderStore } from '../../store/restaurantOrderStore';

// *** Data Interfaces ***
interface RestaurantOrder {
    id: string;
    status: 'New' | 'Preparing' | 'Ready' | 'Rejected' | 'Delivered';
    total: number;
    customer: string;
    pickup_time: string;
    items: { name: string, qty: number }[];
    notes?: string;
}

// Action Button
const ActionButton = ({ title, onPress, color, styles }: {
    title: string;
    onPress: () => void;
    color: string;
    styles: any;
}) => (
    <TouchableOpacity onPress={onPress} style={[styles.actionButton, { backgroundColor: color }]}>
        <RNText style={styles.actionButtonText}>{title}</RNText>
    </TouchableOpacity>
);

// Order Card
const OrderCard = ({
    order,
    onAccept,
    onReject,
    onStatusChange,
    onOpenDetails,
    onOpenNotes,
    styles,
    t
}: {
    order: RestaurantOrder;
    onAccept?: (id: string) => void;
    onReject?: (id: string) => void;
    onStatusChange?: (id: string) => void;
    onOpenDetails: (id: string) => void;
    onOpenNotes: (id: string) => void;
    styles: any;
    t: (key: string) => string;
}) => {

    const getStatusChipStyle = (status: string) => {
        switch (status) {
            case 'New': return { backgroundColor: '#FF9800', color: '#fff' };
            case 'Preparing': return { backgroundColor: '#2196F3', color: '#fff' };
            case 'Ready': return { backgroundColor: '#4CAF50', color: '#fff' };
            case 'Rejected': return { backgroundColor: '#F44336', color: '#fff' };
            case 'Delivered': return { backgroundColor: '#000000', color: '#fff' };
            default: return { backgroundColor: '#9E9E9E', color: '#fff' };
        }
    };

    const statusStyle = getStatusChipStyle(order.status);
    const translatedStatus = t(order.status.toLowerCase());

    const renderActions = () => {
        if (order.status === 'New') {
            return (
                <View style={styles.actionsRow}>
                    <ActionButton title={t("accept")} color="#4CAF50"
                        onPress={() => onAccept?.(order.id)} styles={styles} />
                    <ActionButton title={t("reject")} color="#F44336"
                        onPress={() => onReject?.(order.id)} styles={styles} />
                </View>
            );
        } else if (order.status === 'Preparing') {
            return (
                <ActionButton title={t("mark_ready")} color="#007AFF"
                    onPress={() => onStatusChange?.(order.id)} styles={styles} />
            );
        } else if (order.status === 'Ready') {
            return (
                <RNText style={styles.readyText}>{t('waiting_driver_pickup')}</RNText>
            );
        }
        return (
            <RNText style={styles.finalStatusText}>{t('status')}: {translatedStatus}</RNText>
        );
    };

    return (
        <TouchableOpacity style={styles.card} onPress={() => onOpenDetails(order.id)}>
            <View style={styles.header}>
                <RNText style={styles.orderId}>{t('order_hash')}{order.id}</RNText>

                <View style={styles.headerActions}>

                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation();
                            onOpenNotes(order.id);
                        }}
                        style={styles.notesButton}
                    >
                        <MaterialIcons name="chat-bubble-outline" size={20} color={styles.notesIconColor.color} />
                    </TouchableOpacity>

                    <View style={[styles.statusChip, { backgroundColor: statusStyle.backgroundColor }]}>
                        <RNText style={[styles.statusChipText, { color: statusStyle.color }]}>
                            {translatedStatus}
                        </RNText>
                    </View>
                </View>
            </View>

            <View style={styles.detailRow}>
                <RNText style={styles.label}>{t('customer')}:</RNText>
                <RNText style={styles.value}>{order.customer}</RNText>
            </View>

            <View style={styles.detailRow}>
                <RNText style={styles.label}>{t('pickup_time')}:</RNText>
                <RNText style={styles.value}>{order.pickup_time}</RNText>
            </View>

            <View style={styles.detailRow}>
                <RNText style={styles.label}>{t('total')}:</RNText>
                <RNText style={styles.totalValue}>₹{order.total.toFixed(2)}</RNText>
            </View>

            <View style={styles.itemsContainer}>
                <RNText style={styles.itemsTitle}>{t('items')}:</RNText>
                {order.items.map((item, index) => (
                    <RNText key={index} style={styles.itemText}>
                        {item.qty}x {item.name}
                    </RNText>
                ))}
            </View>

            <View style={styles.actionsContainer}>{renderActions()}</View>
        </TouchableOpacity>
    );
};

// MAIN SCREEN
export default function OrderManagementScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();

    // Restaurant Order Store
    const {
        pendingOrders,
        activeOrders,
        orderHistory,
        isLoading,
        error,
        fetchPendingOrders,
        fetchActiveOrders,
        fetchOrderHistory,
        acceptOrder,
        rejectOrder,
        updateOrderStatus,
        refreshAllOrders,
    } = useRestaurantOrderStore();

    // Local state
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

    // Handle refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshAllOrders();
        setRefreshing(false);
    };

    // Handle accept order
    const handleAcceptOrder = (orderId: string) => {
        setSelectedOrderId(orderId);
        setPrepTime('30');
        setShowAcceptModal(true);
    };

    const confirmAcceptOrder = async () => {
        if (!selectedOrderId) return;

        const prepTimeNum = parseInt(prepTime);
        if (isNaN(prepTimeNum) || prepTimeNum < 5 || prepTimeNum > 120) {
            Alert.alert(t('error'), 'Please enter a valid preparation time (5-120 minutes)');
            return;
        }

        const result = await acceptOrder(selectedOrderId, prepTimeNum);
        setShowAcceptModal(false);

        if (result.success) {
            Alert.alert(t('success'), t('order_accepted'));
            await refreshAllOrders();
        } else {
            Alert.alert(t('error'), result.error || 'Failed to accept order');
        }
    };

    // Handle reject order
    const handleRejectOrder = (orderId: string) => {
        setSelectedOrderId(orderId);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const confirmRejectOrder = async () => {
        if (!selectedOrderId || !rejectReason.trim()) {
            Alert.alert(t('error'), 'Please provide a rejection reason');
            return;
        }

        const result = await rejectOrder(selectedOrderId, rejectReason);
        setShowRejectModal(false);

        if (result.success) {
            Alert.alert(t('success'), t('order_rejected'));
            await refreshAllOrders();
        } else {
            Alert.alert(t('error'), result.error || 'Failed to reject order');
        }
    };

    // Handle status change
    const handleStatusChange = async (orderId: string, newStatus: 'preparing' | 'ready_for_pickup') => {
        const result = await updateOrderStatus(orderId, newStatus);

        if (result.success) {
            Alert.alert(t('success'), t('status_updated'));
            await refreshAllOrders();
        } else {
            Alert.alert(t('error'), result.error || 'Failed to update status');
        }
    };

    // Navigation handlers
    const handleOpenDetails = (id: string) => {
        router.push({ pathname: '/restaurant-order-details', params: { orderId: id } });
    };

    const handleOpenNotes = (id: string) => {
        router.push({ pathname: '/order-notes', params: { orderId: id } });
    };

    // Map backend orders to UI format
    const mapToUIOrder = (order: any): RestaurantOrder => ({
        id: order.order_id,
        status: order.order_status === 'pending' ? 'New' :
            order.order_status === 'confirmed' || order.order_status === 'preparing' ? 'Preparing' :
                order.order_status === 'ready_for_pickup' ? 'Ready' :
                    order.order_status === 'delivered' ? 'Delivered' : 'Rejected',
        total: order.total_amount,
        customer: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'Customer',
        pickup_time: order.estimated_delivery_time ? new Date(order.estimated_delivery_time).toLocaleTimeString() : 'TBD',
        items: (order.items || []).map((item: any) => ({
            name: item.food_item_name || 'Item',
            qty: item.quantity
        })),
        notes: order.special_instructions
    });

    const newOrders = pendingOrders.map(mapToUIOrder);
    const activeOrdersMapped = activeOrders.map(mapToUIOrder);
    const completedOrdersMapped = orderHistory.map(mapToUIOrder);

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5'
        },
        content: { padding: 15 },

        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme === 'dark' ? '#BB86FC' : '#333',
            marginBottom: 10,
            marginTop: 10
        },

        emptyText: {
            textAlign: 'center',
            color: theme === 'dark' ? '#AAA' : '#999',
            paddingVertical: 15,
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
            borderRadius: 8,
            marginBottom: 15,
        },

        card: {
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
            elevation: 3,
            borderWidth: theme === 'dark' ? 1 : 0,
            borderColor: theme === 'dark' ? '#333' : 'transparent',
        },

        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
        headerActions: { flexDirection: 'row', alignItems: 'center' },
        notesButton: { padding: 5, marginRight: 10 },
        notesIconColor: { color: theme === 'dark' ? '#BBB' : '#777' },

        orderId: { fontSize: 18, fontWeight: '900', color: theme === 'dark' ? '#FFF' : '#333' },

        statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
        statusChipText: { fontSize: 12, fontWeight: 'bold' },

        detailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 3,
            borderBottomWidth: 1,
            borderBottomColor: theme === 'dark' ? '#292929' : '#fafafa',
        },

        label: { fontSize: 14, color: theme === 'dark' ? '#BBB' : '#777' },
        value: { fontSize: 14, fontWeight: '600', color: theme === 'dark' ? '#FFF' : '#333' },

        totalValue: { fontSize: 16, fontWeight: '800', color: '#4CAF50' },

        itemsContainer: { marginTop: 10, paddingTop: 5, borderTopWidth: 1, borderTopColor: theme === 'dark' ? '#333' : '#eee' },
        itemsTitle: { fontSize: 14, fontWeight: '700', marginBottom: 5, color: theme === 'dark' ? '#FFF' : '#333' },
        itemText: { fontSize: 13, color: theme === 'dark' ? '#AAA' : '#666', marginLeft: 5 },

        actionsContainer: { marginTop: 15 },
        actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },

        actionButton: {
            paddingVertical: 10,
            borderRadius: 8,
            flex: 1,
            marginHorizontal: 5,
            alignItems: 'center',
        },
        actionButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

        readyText: { textAlign: 'center', fontSize: 15, fontWeight: '600', color: '#FF9800', padding: 5 },
        finalStatusText: { textAlign: 'center', fontSize: 15, fontWeight: '600', color: theme === 'dark' ? '#BBB' : '#777', padding: 5 },

        // Modal styles
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
            borderRadius: 15,
            padding: 20,
            width: '85%',
            maxWidth: 400,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme === 'dark' ? '#FFF' : '#333',
            marginBottom: 15,
            textAlign: 'center',
        },
        modalLabel: {
            fontSize: 14,
            color: theme === 'dark' ? '#BBB' : '#666',
            marginBottom: 10,
        },
        prepTimeButtons: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 15,
        },
        prepTimeButton: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#555' : '#ddd',
            backgroundColor: theme === 'dark' ? '#2A2A2A' : '#f5f5f5',
        },
        prepTimeButtonActive: {
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
        },
        prepTimeButtonText: {
            fontSize: 14,
            color: theme === 'dark' ? '#FFF' : '#333',
        },
        prepTimeButtonTextActive: {
            color: '#fff',
            fontWeight: 'bold',
        },
        reasonButtons: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 15,
        },
        reasonButton: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#555' : '#ddd',
            backgroundColor: theme === 'dark' ? '#2A2A2A' : '#f5f5f5',
        },
        reasonButtonActive: {
            backgroundColor: '#F44336',
            borderColor: '#F44336',
        },
        reasonButtonText: {
            fontSize: 14,
            color: theme === 'dark' ? '#FFF' : '#333',
        },
        reasonButtonTextActive: {
            color: '#fff',
            fontWeight: 'bold',
        },
        input: {
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#555' : '#ddd',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: theme === 'dark' ? '#FFF' : '#333',
            backgroundColor: theme === 'dark' ? '#2A2A2A' : '#fff',
            marginBottom: 15,
        },
        textArea: {
            height: 80,
            textAlignVertical: 'top',
        },
        modalButtons: {
            flexDirection: 'row',
            gap: 10,
        },
        modalButton: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
        },
        cancelButton: {
            backgroundColor: theme === 'dark' ? '#444' : '#e0e0e0',
        },
        confirmButton: {
            backgroundColor: '#4CAF50',
        },
        cancelButtonText: {
            color: theme === 'dark' ? '#FFF' : '#666',
            fontSize: 16,
            fontWeight: 'bold',
        },
        confirmButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    const renderOrderList = (titleKey: string, list: RestaurantOrder[]) => (
        <View>
            <RNText style={dynamicStyles.sectionTitle}>
                {t(titleKey)} ({list.length})
            </RNText>

            {list.length === 0 ? (
                <RNText style={dynamicStyles.emptyText}>
                    {t('no')} {t(titleKey)?.toLowerCase?.() ?? ""}
                </RNText>
            ) : (
                list.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onAccept={handleAcceptOrder}
                        onReject={handleRejectOrder}
                        onStatusChange={(id) => handleStatusChange(id, 'ready_for_pickup')}
                        onOpenDetails={handleOpenDetails}
                        onOpenNotes={handleOpenNotes}
                        styles={dynamicStyles}
                        t={t}
                    />
                ))
            )}
        </View>
    );

    return (
        <View style={dynamicStyles.container}>
            <AppHeader title={t("order_management")} showBack={false} />

            <ScrollView
                style={dynamicStyles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {renderOrderList('new_orders_section', newOrders)}
                {renderOrderList('active_orders_section', activeOrdersMapped)}
                {renderOrderList('completed_orders_section', completedOrdersMapped)}

                <View style={{ height: 50 }} />
            </ScrollView>

            {/* Accept Order Modal */}
            <Modal
                visible={showAcceptModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAcceptModal(false)}
            >
                <View style={dynamicStyles.modalOverlay}>
                    <View style={dynamicStyles.modalContent}>
                        <RNText style={dynamicStyles.modalTitle}>{t('accept_order')}</RNText>
                        <RNText style={dynamicStyles.modalLabel}>{t('preparation_time')} (minutes):</RNText>

                        <View style={dynamicStyles.prepTimeButtons}>
                            {['15', '20', '30', '45'].map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        dynamicStyles.prepTimeButton,
                                        prepTime === time && dynamicStyles.prepTimeButtonActive
                                    ]}
                                    onPress={() => setPrepTime(time)}
                                >
                                    <RNText style={[
                                        dynamicStyles.prepTimeButtonText,
                                        prepTime === time && dynamicStyles.prepTimeButtonTextActive
                                    ]}>{time} min</RNText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={dynamicStyles.input}
                            value={prepTime}
                            onChangeText={setPrepTime}
                            keyboardType="numeric"
                            placeholder="Custom time"
                            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
                        />

                        <View style={dynamicStyles.modalButtons}>
                            <TouchableOpacity
                                style={[dynamicStyles.modalButton, dynamicStyles.cancelButton]}
                                onPress={() => setShowAcceptModal(false)}
                            >
                                <RNText style={dynamicStyles.cancelButtonText}>{t('cancel')}</RNText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[dynamicStyles.modalButton, dynamicStyles.confirmButton]}
                                onPress={confirmAcceptOrder}
                            >
                                <RNText style={dynamicStyles.confirmButtonText}>{t('confirm')}</RNText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Reject Order Modal */}
            <Modal
                visible={showRejectModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowRejectModal(false)}
            >
                <View style={dynamicStyles.modalOverlay}>
                    <View style={dynamicStyles.modalContent}>
                        <RNText style={dynamicStyles.modalTitle}>{t('reject_order')}</RNText>
                        <RNText style={dynamicStyles.modalLabel}>{t('rejection_reason')}:</RNText>

                        <View style={dynamicStyles.reasonButtons}>
                            {['Out of stock', 'Too busy', 'Closing soon', 'Other'].map((reason) => (
                                <TouchableOpacity
                                    key={reason}
                                    style={[
                                        dynamicStyles.reasonButton,
                                        rejectReason === reason && dynamicStyles.reasonButtonActive
                                    ]}
                                    onPress={() => setRejectReason(reason)}
                                >
                                    <RNText style={[
                                        dynamicStyles.reasonButtonText,
                                        rejectReason === reason && dynamicStyles.reasonButtonTextActive
                                    ]}>{reason}</RNText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={[dynamicStyles.input, dynamicStyles.textArea]}
                            value={rejectReason}
                            onChangeText={setRejectReason}
                            placeholder="Enter custom reason"
                            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={dynamicStyles.modalButtons}>
                            <TouchableOpacity
                                style={[dynamicStyles.modalButton, dynamicStyles.cancelButton]}
                                onPress={() => setShowRejectModal(false)}
                            >
                                <RNText style={dynamicStyles.cancelButtonText}>{t('cancel')}</RNText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[dynamicStyles.modalButton, dynamicStyles.confirmButton, { backgroundColor: '#F44336' }]}
                                onPress={confirmRejectOrder}
                            >
                                <RNText style={dynamicStyles.confirmButtonText}>{t('confirm')}</RNText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
