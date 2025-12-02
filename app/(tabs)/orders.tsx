import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text, Surface, Button, Chip, Card, ActivityIndicator, Badge, Divider, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../styles/globalStyles';
import { DesignSystem } from '../../constants/designSystem';
import { partnerAPI } from '../../services/partnerService';
import { Order } from '../../types';
import { useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type OrderStatusFilter = 'pending' | 'preparing' | 'ready' | 'completed';

const STATUS_CONFIG = {
    pending: { color: DesignSystem.colors.warning, icon: 'clock-outline', label: 'New' },
    preparing: { color: DesignSystem.colors.info, icon: 'chef-hat', label: 'Preparing' },
    ready: { color: DesignSystem.colors.success, icon: 'check-circle', label: 'Ready' },
    completed: { color: DesignSystem.colors.neutral[500], icon: 'check-all', label: 'Completed' },
};

export default function OrdersScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<OrderStatusFilter>('pending');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const response = await partnerAPI.restaurant.getOrders(activeFilter);
            if (response.success && response.data) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setOrders(response.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchOrders();
        }, [activeFilter])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setProcessingId(orderId);
        try {
            const response = await partnerAPI.restaurant.updateOrderStatus(orderId, newStatus);
            if (response.success) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                fetchOrders();
            } else {
                Alert.alert('Error', response.error || 'Failed to update order status');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setProcessingId(null);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const orderTime = new Date(dateString);
        const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / 60000);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return orderTime.toLocaleDateString();
    };

    const renderOrderItem = (order: Order) => {
        const statusConfig = STATUS_CONFIG[activeFilter];

        return (
            <Surface key={order.order_id} style={styles.orderCard} elevation={2}>
                <View style={[styles.statusBar, { backgroundColor: statusConfig.color }]} />

                <View style={styles.cardContent}>
                    <View style={styles.orderHeader}>
                        <View style={styles.orderInfo}>
                            <Text style={styles.orderId}>#{order.order_number}</Text>
                            <Text style={styles.timeAgo}>{getTimeAgo(order.created_at)}</Text>
                        </View>
                        <Badge
                            style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}
                            size={28}
                        >
                            <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                {statusConfig.label}
                            </Text>
                        </Badge>
                    </View>

                    <View style={styles.itemsSection}>
                        <View style={styles.itemsHeader}>
                            <MaterialCommunityIcons name="food" size={16} color={DesignSystem.colors.text.secondary} />
                            <Text style={styles.itemsCount}>{order.items?.length || 0} Items</Text>
                        </View>

                        {order.items && order.items.length > 0 && (
                            <View style={styles.itemsList}>
                                {order.items.slice(0, 3).map((item, index) => (
                                    <View key={index} style={styles.itemRow}>
                                        <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                    </View>
                                ))}
                                {order.items.length > 3 && (
                                    <Text style={styles.moreItems}>+{order.items.length - 3} more</Text>
                                )}
                            </View>
                        )}
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.footer}>
                        <View style={styles.totalSection}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>${order.total_amount.toFixed(2)}</Text>
                        </View>

                        <View style={styles.actions}>
                            {activeFilter === 'pending' && (
                                <>
                                    <Button
                                        mode="outlined"
                                        onPress={() => handleStatusUpdate(order.order_id, 'cancelled')}
                                        disabled={!!processingId}
                                        textColor={DesignSystem.colors.error}
                                        style={styles.rejectButton}
                                        compact
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={() => handleStatusUpdate(order.order_id, 'preparing')}
                                        loading={processingId === order.order_id}
                                        disabled={!!processingId}
                                        style={styles.acceptButton}
                                        contentStyle={styles.actionButtonContent}
                                    >
                                        Accept
                                    </Button>
                                </>
                            )}

                            {activeFilter === 'preparing' && (
                                <Button
                                    mode="contained"
                                    onPress={() => handleStatusUpdate(order.order_id, 'ready')}
                                    loading={processingId === order.order_id}
                                    disabled={!!processingId}
                                    style={styles.primaryButton}
                                    contentStyle={styles.actionButtonContent}
                                    icon="check"
                                >
                                    Mark Ready
                                </Button>
                            )}

                            {activeFilter === 'ready' && (
                                <Button
                                    mode="contained"
                                    onPress={() => handleStatusUpdate(order.order_id, 'picked_up')}
                                    loading={processingId === order.order_id}
                                    disabled={!!processingId}
                                    style={styles.primaryButton}
                                    contentStyle={styles.actionButtonContent}
                                    icon="hand-okay"
                                >
                                    Handed Over
                                </Button>
                            )}
                        </View>
                    </View>
                </View>
            </Surface>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Orders</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    <View style={styles.filterContainer}>
                        {(Object.keys(STATUS_CONFIG) as OrderStatusFilter[]).map((status) => (
                            <Chip
                                key={status}
                                selected={activeFilter === status}
                                onPress={() => setActiveFilter(status)}
                                style={[
                                    styles.chip,
                                    activeFilter === status && { backgroundColor: DesignSystem.colors.primary[600] }
                                ]}
                                textStyle={[
                                    styles.chipText,
                                    activeFilter === status && { color: 'white' }
                                ]}
                                showSelectedOverlay={false}
                            >
                                {STATUS_CONFIG[status].label}
                            </Chip>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[DesignSystem.colors.primary[500]]}
                    />
                }
            >
                {loading && !refreshing ? (
                    <View style={styles.centerState}>
                        <ActivityIndicator size={40} color={DesignSystem.colors.primary[500]} />
                    </View>
                ) : orders.length > 0 ? (
                    <>
                        <Text style={styles.sectionTitle}>
                            {STATUS_CONFIG[activeFilter].label} Orders ({orders.length})
                        </Text>
                        {orders.map(renderOrderItem)}
                    </>
                ) : (
                    <View style={styles.centerState}>
                        <Surface style={styles.emptyState} elevation={1}>
                            <MaterialCommunityIcons
                                name={STATUS_CONFIG[activeFilter].icon}
                                size={64}
                                color={DesignSystem.colors.neutral[300]}
                            />
                            <Text style={styles.emptyTitle}>No {activeFilter} orders</Text>
                            <Text style={styles.emptySubtitle}>
                                {activeFilter === 'pending'
                                    ? 'New orders will appear here'
                                    : `You don't have any ${activeFilter} orders right now`}
                            </Text>
                        </Surface>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignSystem.colors.background.primary,
    },
    header: {
        padding: 20,
        paddingBottom: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: DesignSystem.colors.border.light,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        marginBottom: 16,
    },
    filterScroll: {
        flexGrow: 0,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingBottom: 8,
    },
    chip: {
        marginRight: 8,
        backgroundColor: DesignSystem.colors.neutral[100],
    },
    chipText: {
        fontWeight: '600',
    },
    content: {
        padding: 16,
        flexGrow: 1,
    },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: 'white',
        width: '100%',
        maxWidth: 340,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: DesignSystem.colors.text.secondary,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        marginBottom: 16,
        marginLeft: 4,
    },
    orderCard: {
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    statusBar: {
        height: 4,
    },
    cardContent: {
        padding: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    orderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        marginBottom: 4,
    },
    timeAgo: {
        fontSize: 13,
        color: DesignSystem.colors.text.secondary,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    itemsSection: {
        marginBottom: 16,
    },
    itemsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemsCount: {
        fontSize: 14,
        fontWeight: '600',
        color: DesignSystem.colors.text.secondary,
        marginLeft: 6,
    },
    itemsList: {
        backgroundColor: DesignSystem.colors.neutral[50],
        borderRadius: 8,
        padding: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    itemQuantity: {
        fontSize: 14,
        fontWeight: 'bold',
        color: DesignSystem.colors.primary[600],
        width: 32,
    },
    itemName: {
        fontSize: 14,
        color: DesignSystem.colors.text.primary,
        flex: 1,
    },
    moreItems: {
        fontSize: 13,
        color: DesignSystem.colors.text.secondary,
        fontStyle: 'italic',
        marginTop: 4,
    },
    divider: {
        backgroundColor: DesignSystem.colors.border.light,
        marginVertical: 16,
    },
    footer: {
        gap: 16,
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 14,
        color: DesignSystem.colors.text.secondary,
        fontWeight: '500',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    acceptButton: {
        flex: 2,
        backgroundColor: DesignSystem.colors.primary[600],
        borderRadius: 10,
    },
    rejectButton: {
        flex: 1,
        borderColor: DesignSystem.colors.error,
        borderRadius: 10,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: DesignSystem.colors.primary[600],
        borderRadius: 10,
    },
    actionButtonContent: {
        height: 44,
    },
});
