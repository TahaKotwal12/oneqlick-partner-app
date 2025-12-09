import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AppHeader from '../components/common/AppHeader';
import { getDeliveryOrders } from '../utils/mock';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapPlaceholderComponent from '../components/common/MapPlaceholder';
import { useTheme } from '../contexts/ThemeContext';
// 👇 I18N IMPORT
import { useLanguage } from '../contexts/LanguageContext';


// *** FIX 1: Define the required TypeScript Interfaces (Blueprints) ***
interface LocationDetail {
    name: string;
    address: string;
}

interface OrderItem {
    name: string;
    qty: number;
}

interface DeliveryOrder {
    id: string;
    status: string;
    amount: number;
    pickup: LocationDetail;
    drop: LocationDetail;
    items: OrderItem[];
    payment_type: string;
}

// *** Helper Component Type Definitions ***
interface ActionButtonProps {
    title: string;
    onPress: () => void;
    color: string;
    styles: any;
}

interface DetailRowProps {
    icon: keyof typeof MaterialIcons.glyphMap | string;
    label: string;
    value: string;
    address: string;
    styles: any;
}

interface ItemRowProps {
    name: string;
    qty: number;
    styles: any;
}

interface InfoRowProps {
    label: string;
    value: string;
    isTotal?: boolean;
    styles: any;
}

// ----------------------------------------------------------------------

// --- Helper Components for Clean Code (DEFINED ONCE) ---

const ActionButton = ({ title, onPress, color, styles }: ActionButtonProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.actionButton, { backgroundColor: color }]}>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
);

const DetailRow = ({ icon, label, value, address, styles }: DetailRowProps) => (
    <View style={styles.detailRow}>
      <MaterialIcons name={icon as 'store'} size={24} color="#007AFF" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}: {value}</Text>
        <Text style={styles.detailAddress}>{address}</Text>
      </View>
    </View>
);
const ItemRow = ({ name, qty, styles }: ItemRowProps) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemQty}>{qty}x</Text>
      <Text style={styles.itemName}>{name}</Text>
    </View>
);
const InfoRow = ({ label, value, isTotal = false, styles }: InfoRowProps) => (
    <View style={[styles.infoRow, isTotal && styles.totalRow]}>
      <Text style={[styles.infoLabel, isTotal && styles.totalLabel]}>{label}</Text>
      <Text style={[styles.infoValue, isTotal && styles.totalValue]}>{value}</Text>
    </View>
);


const DeliveryOrderDetailsScreen = () => {
    const params = useLocalSearchParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
   
    const insets = useSafeAreaInsets();
   
    const [order, setOrder] = useState<DeliveryOrder | null>(null);
    const [status, setStatus] = useState('Loading...');

    // 👇 Get theme context
    const { theme } = useTheme();
    // 👇 Get language context
    const { t } = useLanguage();

    // 1. Fetch Order Details from Mock
    useEffect(() => {
      const allOrders: DeliveryOrder[] = getDeliveryOrders();
      const selectedOrder = allOrders.find(o => o.id === orderId);

      if (selectedOrder) {
        setOrder(selectedOrder);
        // 🔑 Translate status for display
        setStatus(t(selectedOrder.status.toLowerCase().replace(/\s/g, '_')));
      } else {
        setOrder(allOrders[0] || null);
        setStatus(t('error_order_not_found'));
      }
    }, [orderId, t]);

    // 2. Action Logic (Acceptance: Actions update status locally.)
    const handleAction = (newStatusKey: string) => {
        const newStatus = t(newStatusKey);
        setStatus(newStatus);
        Alert.alert(t("status_updated"), `${t("order_hash")}${orderId} ${t("is_now")}: ${newStatus}`);
    };

    // 🔑 Styles are now defined inside the component to access 'theme'
    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5'
        },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        content: { padding: 20 },
        card: {
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
            borderRadius: 8,
            padding: 15,
            marginBottom: 15,
            elevation: 2
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme === 'dark' ? '#BB86FC' : '#333',
            marginBottom: 10,
            marginTop: 5
        },
        separator: { height: 1, backgroundColor: theme === 'dark' ? '#333' : '#eee', marginVertical: 10 },
       
        // Status Box
        statusBox: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#333300' : '#fffbe6',
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#555500' : '#ffecb3'
        },
        statusTitle: { fontSize: 14, color: theme === 'dark' ? '#CCC' : '#333' },
        statusValue: { fontSize: 16, fontWeight: 'bold', color: '#ff9800' },

        // Detail Rows
        detailRow: { flexDirection: 'row', alignItems: 'flex-start' },
        detailLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme === 'dark' ? '#FFF' : '#333'
        },
        detailAddress: {
            fontSize: 14,
            color: theme === 'dark' ? '#AAA' : '#666',
            marginTop: 2
        },

        // Item Rows
        itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
        itemQty: { fontWeight: 'bold', width: 30, color: '#007AFF' },
        itemName: { flex: 1, color: theme === 'dark' ? '#FFF' : '#333' },

        // Info Rows
        infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
        infoLabel: { fontSize: 15, color: theme === 'dark' ? '#AAA' : '#666' },
        infoValue: { fontSize: 15, fontWeight: '600', color: theme === 'dark' ? '#FFF' : '#333' },
        totalRow: { borderTopWidth: 1, borderTopColor: theme === 'dark' ? '#333' : '#eee', marginTop: 10, paddingTop: 10 },
        totalLabel: { fontSize: 16, fontWeight: 'bold', color: theme === 'dark' ? '#FFF' : '#000' },
        totalValue: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },

        // Action Bar
        actionBar: {
            paddingHorizontal: 15,
            paddingTop: 15,
            borderTopWidth: 1,
            borderTopColor: theme === 'dark' ? '#333' : '#eee',
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff'
        },
        actionButton: { padding: 15, borderRadius: 8, alignItems: 'center' },
        actionButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
       
        statusText: { fontSize: 16, fontWeight: 'bold', color: theme === 'dark' ? '#FFF' : '#333', textAlign: 'center', padding: 5 }
    });


    // 🔑 UPDATED: getActionButtons to use translation keys
    const getActionButtons = () => {
        if (status === t('ready_for_pickup')) {
            return (
                <ActionButton
                    title={t("accept")}
                    onPress={() => handleAction('accepted')}
                    color="#4CAF50" // Green
                    styles={dynamicStyles}
                />
            );
        } else if (status === t('accepted')) {
            // Note: The mock flow had "Waiting for Pickup" but the status translation logic uses 'accepted' or 'in_transit'
            return (
                <ActionButton
                    title={t("mark_ready")} // Reusing mark_ready for driver's arrival at pickup point
                    onPress={() => handleAction('in_transit')} // Simplified to In Transit for now
                    color="#FF9800" // Orange
                    styles={dynamicStyles}
                />
            );
        } else if (status === t('in_transit')) {
            return (
                <ActionButton
                    title={t("delivered")}
                    onPress={() => handleAction('delivered')}
                    color="#F44336" // Red/Final
                    styles={dynamicStyles}
                />
            );
        }
        return <Text style={dynamicStyles.statusText}>{t('status')}: {status}</Text>;
    };


    if (!order) {
        return (
            <View style={dynamicStyles.loadingContainer}>
                <Text style={{ color: theme === 'dark' ? '#FFF' : '#333' }}>
                    {t('loading_order_details')}
                </Text>
            </View>
        );
    }

    return (
        <View style={dynamicStyles.container}>
            <AppHeader title={`${t('order_hash')}${order.id}`} showBack={true} />
            <ScrollView style={dynamicStyles.content}>
               
                {/* 🔑 INTEGRATED: Use the new reusable Map Placeholder Component */}
                <MapPlaceholderComponent pickup={order.pickup} drop={order.drop} />
               
                {/* Current Status */}
                <View style={dynamicStyles.statusBox}>
                    <Text style={dynamicStyles.statusTitle}>{t('current_status')}:</Text>
                    <Text style={dynamicStyles.statusValue}>{status}</Text>
                </View>

                {/* Checklist: Pickup + drop details. */}
                <Text style={dynamicStyles.sectionTitle}>{t('route_details')} 🗺️</Text>
                <View style={dynamicStyles.card}>
                    <DetailRow icon="store" label={t("pickup")} value={order.pickup.name} address={order.pickup.address} styles={dynamicStyles} />
                    <View style={dynamicStyles.separator} />
                    <DetailRow icon="location-pin" label={t("drop")} value={order.drop.name} address={order.drop.address} styles={dynamicStyles} />
                </View>

                {/* Checklist: Items list. */}
                <Text style={dynamicStyles.sectionTitle}>{t('order_items')} 📦</Text>
                <View style={dynamicStyles.card}>
                    {order.items.map((item, index) => (
                        <ItemRow key={index} name={item.name} qty={item.qty} styles={dynamicStyles} />
                    ))}
                </View>

                {/* Checklist: Payment type + amount. */}
                <Text style={dynamicStyles.sectionTitle}>{t('payment_summary')} 💳</Text>
                <View style={dynamicStyles.card}>
                    <InfoRow label={t("payment_type")} value={t(order.payment_type.toLowerCase().replace(/\s/g, '_'))} styles={dynamicStyles} />
                    <InfoRow label={t("order_total")} value={`₹${order.amount.toFixed(2)}`} isTotal={true} styles={dynamicStyles} />
                </View>
               
            </ScrollView>

            {/* Checklist: Action buttons (Fixed for bottom safe area) */}
            <View style={[dynamicStyles.actionBar, { paddingBottom: Math.max(15, insets.bottom) }]}>
                {getActionButtons()}
            </View>
        </View>
    );
};

export default DeliveryOrderDetailsScreen;