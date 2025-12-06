// oneQlick/app/(tabs)/deliveries.tsx (FIXED: Text Component Error in Availability Toggle)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Switch, Alert, Text as RNText } from 'react-native'; // 🔑 ADDED RNText alias
import { useRouter } from 'expo-router'; 
import AppHeader from '../../components/common/AppHeader'; 
import { getDeliveryOrders, getProfile } from '../../utils/mock'; 
import { MaterialIcons } from '@expo/vector-icons'; 

// *** Define TypeScript Interfaces ***
// ... (Interfaces remain the same) ...
interface LocationDetail {
    name: string;
    address: string;
}

interface OrderItem {
    name: string;
    qty: number;
}

interface DeliveryOrder {
    id: string; // Used by keyExtractor
    status: string;
    amount: number;
    pickup: LocationDetail;
    drop: LocationDetail;
    items: OrderItem[];
    payment_type: string;
}

interface UserProfile {
    id: string;
    name: string;
    is_online: boolean;
}
// ----------------------------------------------------------------------


// --- Helper Component: Availability Toggle (Types Applied) ---
const AvailabilityToggle = ({ partnerName, isOnline, toggleOnline }: { partnerName: string, isOnline: boolean, toggleOnline: () => void }) => (
    <View style={styles.toggleContainer}>
    <Text style={styles.partnerName}>{partnerName}</Text>
    <View style={styles.toggleRow}>
        <Text style={[styles.statusText, { color: isOnline ? '#4CAF50' : '#F44336' }]}>
        You are {isOnline ? 'Online' : 'Offline'}
        </Text>
        <Switch
        trackColor={{ false: "#767577", true: "#4CAF50" }}
        thumbColor={isOnline ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleOnline}
        value={isOnline}
        />
    </View>
    </View>
);

// --- Helper Component: Order List Item (Types Applied) ---
const OrderListItem = ({ item, onOpen }: { item: DeliveryOrder, onOpen: (id: string) => void }) => {
    const getStatusChipStyle = (status: string) => {
    switch (status) {
        case 'Ready for Pickup': return { backgroundColor: '#FFC107', color: '#000' };
        case 'In Transit': return { backgroundColor: '#2196F3', color: '#fff' };
        case 'Accepted': return { backgroundColor: '#4CAF50', color: '#fff' };   
        default: return { backgroundColor: '#9E9E9E', color: '#fff' };
    }
    };
    
    const statusStyle = getStatusChipStyle(item.status);

    return (
    <TouchableOpacity style={styles.listItem} onPress={() => onOpen(item.id)}>
        <View style={styles.row}>
        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text style={styles.amountText}>₹{item.amount.toFixed(2)}</Text> {/* Assuming INR for delivery */}
        </View>
        
        <View style={styles.addressRow}>
        <MaterialIcons name="store" size={16} color="#777" />
        <Text style={styles.addressLine}> Pickup: {item.pickup.name}</Text>
        </View>
        <View style={styles.addressRow}>
        <MaterialIcons name="pin-drop" size={16} color="#777" />
        <Text style={styles.addressLine}> Drop: {item.drop.name}</Text>
        </View>
        
        <View style={[styles.row, { marginTop: 10 }]}>
        <View style={[styles.statusChip, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusChipText, { color: statusStyle.color }]}>{item.status}</Text>
        </View>
        <TouchableOpacity onPress={() => onOpen(item.id)} style={styles.openButton}>
            <Text style={styles.openButtonText}>Open</Text>
        </TouchableOpacity>
        </View>
    </TouchableOpacity>
    );
};


// --- Main Dashboard Component ---
export default function DeliveryDashboardScreen() {
    const router = useRouter(); 

    // Apply type hint for states
    const [orders, setOrders] = useState<DeliveryOrder[]>([]); 
    const [profile, setProfile] = useState<UserProfile | {}>({});
    const [isOnline, setIsOnline] = useState(true);

    // Acceptance: List loads from mock
    useEffect(() => {
        const mockProfile: UserProfile = getProfile(); 
        setProfile(mockProfile);
        setIsOnline(mockProfile.is_online);
        
        const mockOrders = getDeliveryOrders();
        setOrders(mockOrders);
    }, []);
    
    const toggleAvailability = () => {
        setIsOnline(prev => !prev);
        Alert.alert("Status Change", `Switched to ${!isOnline ? 'Online' : 'Offline'}`);
    };
    
    // 🔑 ADDED: Navigation handler for Notifications
    const handleOpenNotifications = () => {
        router.push('/notifications'); // Navigates to the file located at app/notifications.tsx
    };

    const handleOpenDetails = (id: string) => { 
        // FIX: Added '/' to the pathname to reference the route from the root of the app.
        router.push({
            pathname: '/delivery-order-details', // <-- FIX APPLIED HERE
            params: { orderId: id },
        });
    };
    
    const partnerName = (profile as UserProfile)?.name || 'Delivery Partner';

    return (
        <View style={styles.container}>
        <AppHeader
            title="Deliveries"
            rightAction={{ 
                iconName: 'notifications', 
                onPress: handleOpenNotifications // This connects the bell icon
            }}
        />
        
        <ScrollView style={styles.content}>
            <AvailabilityToggle 
                partnerName={partnerName}
                isOnline={isOnline}
                toggleOnline={toggleAvailability}
            />
            
            <Text style={styles.listTitle}>Active Requests ({orders.length})</Text>
            
            <FlatList
            data={orders}
            renderItem={({ item }) => (
                <OrderListItem item={item} onOpen={handleOpenDetails} />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} 
            ListEmptyComponent={<Text style={styles.emptyText}>No active requests right now.</Text>}
            />
        </ScrollView>
        </View>
    );
}

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 10 },
    toggleContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, marginTop: 5 },
    toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    partnerName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    statusText: { fontWeight: '600', fontSize: 16 },
    listTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 5, paddingHorizontal: 5 },
    listItem: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderId: { fontSize: 16, fontWeight: 'bold' },
    addressRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
    addressLine: { fontSize: 14, color: '#555', marginLeft: 5 },
    amountText: { fontSize: 16, fontWeight: '700', color: '#4CAF50' },
    statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
    statusChipText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
    openButton: { backgroundColor: '#4F46E5', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 5 },
    openButtonText: { color: '#fff', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});

