// oneQlick/app/delivery-order-details.tsx (FIXED: Simplified Status Flow)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AppHeader from '../components/common/AppHeader'; 
import { getDeliveryOrders } from '../utils/mock'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import MapPlaceholderComponent from '../components/common/MapPlaceholder'; 


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
}

interface DetailRowProps {
    icon: keyof typeof MaterialIcons.glyphMap | string;
    label: string;
    value: string;
    address: string;
}

interface ItemRowProps {
    name: string;
    qty: number;
}

interface InfoRowProps {
    label: string;
    value: string;
    isTotal?: boolean;
}

// ----------------------------------------------------------------------

// --- Helper Components for Clean Code (DEFINED ONCE) ---

const ActionButton = ({ title, onPress, color }: ActionButtonProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.actionButton, { backgroundColor: color }]}>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
);

const DetailRow = ({ icon, label, value, address }: DetailRowProps) => (
    <View style={styles.detailRow}>
      <MaterialIcons name={icon as 'store'} size={24} color="#007AFF" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}: {value}</Text>
        <Text style={styles.detailAddress}>{address}</Text>
      </View>
    </View>
);
const ItemRow = ({ name, qty }: ItemRowProps) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemQty}>{qty}x</Text>
      <Text style={styles.itemName}>{name}</Text>
    </View>
);
const InfoRow = ({ label, value, isTotal = false }: InfoRowProps) => (
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

    // 1. Fetch Order Details from Mock
    useEffect(() => {
      const allOrders: DeliveryOrder[] = getDeliveryOrders(); 
      const selectedOrder = allOrders.find(o => o.id === orderId); 

      if (selectedOrder) {
        setOrder(selectedOrder);
        setStatus(selectedOrder.status);
      } else {
        setOrder(allOrders[0] || null); 
        setStatus(allOrders[0]?.status || 'Error: Order Not Found');
      }
    }, [orderId]);

    // 2. Action Logic (Acceptance: Actions update status locally.)
    const handleAction = (newStatus: string) => {
      setStatus(newStatus);
      Alert.alert("Status Updated", `Order ${orderId} is now: ${newStatus}`);
    };

    // 🔑 UPDATED: getActionButtons with SIMPLIFIED flow (Removed redundant step)
    const getActionButtons = () => {
        if (status === 'Ready for Pickup') {
            return (
                <ActionButton 
                    title="Accept Order" 
                    onPress={() => handleAction('Accepted')} 
                    color="#4CAF50" // Green
                />
            );
        } else if (status === 'Accepted' || status === 'Waiting for Pickup') {
            return (
                <ActionButton 
                    title="Arrived at Pickup" 
                    onPress={() => handleAction('Arrived at Pickup')} 
                    color="#FF9800" // Orange
                />
            );
        } else if (status === 'Arrived at Pickup') {
            return (
                <ActionButton 
                    title="Picked Up (Start Trip)" 
                    onPress={() => handleAction('In Transit')} // Directly moves to In Transit
                    color="#2196F3" // Blue
                />
            );
        } else if (status === 'In Transit') {
            return (
                <ActionButton 
                    title="Delivered" 
                    onPress={() => handleAction('Delivered')} 
                    color="#F44336" // Red/Final
                />
            );
        }
        return <Text style={styles.statusText}>Order Status: {status}</Text>;
    };


    if (!order) {
        return <View style={styles.loadingContainer}><Text>Loading Order Details...</Text></View>;
    }

    return (
        <View style={styles.container}>
            {/* Back arrow removed */}
            <AppHeader title={`Order #${order.id}`} showBack={false} /> 
            <ScrollView style={styles.content}>
                
                {/* 🔑 INTEGRATED: Use the new reusable Map Placeholder Component */}
                <MapPlaceholderComponent pickup={order.pickup} drop={order.drop} />
                
                {/* Current Status */}
                <View style={styles.statusBox}>
                    <Text style={styles.statusTitle}>Current Status:</Text>
                    <Text style={styles.statusValue}>{status}</Text>
                </View>

                {/* Checklist: Pickup + drop details. */}
                <Text style={styles.sectionTitle}>Route Details 🗺️</Text>
                <View style={styles.card}>
                    <DetailRow icon="store" label="Pickup" value={order.pickup.name} address={order.pickup.address} />
                    <View style={styles.separator} />
                    <DetailRow icon="location-pin" label="Drop-off" value={order.drop.name} address={order.drop.address} />
                </View>

                {/* Checklist: Items list. */}
                <Text style={styles.sectionTitle}>Order Items 📦</Text>
                <View style={styles.card}>
                    {order.items.map((item, index) => (
                        <ItemRow key={index} name={item.name} qty={item.qty} />
                    ))}
                </View>

                {/* Checklist: Payment type + amount. */}
                <Text style={styles.sectionTitle}>Payment Summary 💳</Text>
                <View style={styles.card}>
                    <InfoRow label="Payment Type" value={order.payment_type} />
                    <InfoRow label="Total Amount" value={`$${order.amount.toFixed(2)}`} isTotal={true} />
                </View>
                
            </ScrollView>

            {/* Checklist: Action buttons (Fixed for bottom safe area) */}
            <View style={[styles.actionBar, { paddingBottom: Math.max(15, insets.bottom) }]}>
                {getActionButtons()}
            </View>
        </View>
    );
};


// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 15 },
    card: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, elevation: 2 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 5 },
    separator: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
    
    // Status Box
    statusBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fffbe6', padding: 10, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ffecb3' },
    statusTitle: { fontSize: 14, color: '#333' },
    statusValue: { fontSize: 16, fontWeight: 'bold', color: '#ff9800' },

    // Detail Rows
    detailRow: { flexDirection: 'row', alignItems: 'flex-start' },
    detailLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
    detailAddress: { fontSize: 14, color: '#666', marginTop: 2 },

    // Item Rows
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    itemQty: { fontWeight: 'bold', width: 30, color: '#007AFF' },
    itemName: { flex: 1, color: '#333' },

    // Info Rows
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    infoLabel: { fontSize: 15, color: '#666' },
    infoValue: { fontSize: 15, fontWeight: '600', color: '#333' },
    totalRow: { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 10, paddingTop: 10 },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    totalValue: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },

    // Action Bar
    actionBar: { paddingHorizontal: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' }, 
    actionButton: { padding: 15, borderRadius: 8, alignItems: 'center' },
    actionButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    
    // Missing style for status text in fallback action button
    statusText: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center', padding: 5 }
});

export default DeliveryOrderDetailsScreen;