// oneQlick/app/(tabs)/orders.tsx (I18N + THEME FIXED)

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '../../components/common/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { getRestaurantOrders } from '../../utils/mock';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

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
    onStatusChange,
    onOpenDetails,
    onOpenNotes,
    styles,
    t
}: {
    order: RestaurantOrder;
    onStatusChange: (id: string, newStatus: RestaurantOrder['status']) => void;
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
                        onPress={() => onStatusChange(order.id, 'Preparing')} styles={styles} />
                    <ActionButton title={t("reject")} color="#F44336"
                        onPress={() => onStatusChange(order.id, 'Rejected')} styles={styles} />
                </View>
            );
        } else if (order.status === 'Preparing') {
            return (
                <ActionButton title={t("mark_ready")} color="#007AFF"
                    onPress={() => onStatusChange(order.id, 'Ready')} styles={styles} />
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
    const [orders, setOrders] = useState<RestaurantOrder[]>([]);
    const { theme } = useTheme();
    const { t } = useLanguage();

    useEffect(() => {
        setOrders(getRestaurantOrders() as RestaurantOrder[]);
    }, []);

    const handleStatusChange = (id: string, newStatus: RestaurantOrder['status']) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        Alert.alert(t('status_updated'), `${t('order')} ${id} ${t('is_now')} ${t(newStatus.toLowerCase())}.`);
    };

    const handleOpenDetails = (id: string) => {
        router.push({ pathname: '/restaurant-order-details', params: { orderId: id } });
    };

    const handleOpenNotes = (id: string) => {
        router.push({ pathname: '/order-notes', params: { orderId: id } });
    };

    const newOrders = orders.filter(o => o.status === 'New');
    const activeOrders = orders.filter(o => o.status === 'Preparing' || o.status === 'Ready');
    const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Rejected');

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
        finalStatusText: { textAlign: 'center', fontSize: 15, fontWeight: '600', color: theme === 'dark' ? '#BBB' : '#777', padding: 5 }
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
                        onStatusChange={handleStatusChange}
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

            <ScrollView style={dynamicStyles.content}>
                {renderOrderList('new_orders_section', newOrders)}
                {renderOrderList('active_orders_section', activeOrders)}
                {renderOrderList('completed_orders_section', completedOrders)}

                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
}
