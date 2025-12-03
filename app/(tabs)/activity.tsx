// oneQlick/app/(tabs)/activity.tsx (Restaurant Dashboard Screen)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { getRestaurantOrders, getMenuItems } from '../../utils/mock'; 

// *** Data Interfaces ***
interface RestaurantOrder {
    id: string;
    status: string;
    total: number;
    customer: string;
    pickup_time: string;
    items: { name: string, qty: number }[];
}

interface MenuItem {
    id: string;
    name: string;
    price: number;
    is_available: boolean;
}

// --- Helper Components ---

const SummaryTile = ({ title, value, icon }: { title: string, value: string, icon: keyof typeof MaterialIcons.glyphMap }) => (
    <View style={styles.summaryTile}>
        <MaterialIcons name={icon} size={24} color="#007AFF" />
        <Text style={styles.tileValue}>{value}</Text>
        <Text style={styles.tileTitle}>{title}</Text>
    </View>
);

const QuickActionButton = ({ title, icon, onPress }: { title: string, icon: keyof typeof MaterialIcons.glyphMap, onPress: () => void }) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
        <MaterialIcons name={icon} size={28} color="#4CAF50" />
        <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
);

const OrderPreviewItem = ({ order }: { order: RestaurantOrder }) => (
    <TouchableOpacity style={styles.orderPreview} onPress={() => Alert.alert('Order View', `Maps to details for Order #${order.id}`)}>
        <View style={{ flex: 1 }}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.customerText}>Customer: {order.customer}</Text>
        </View>
        <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
        <Text style={styles.orderStatus}>{order.status}</Text>
    </TouchableOpacity>
);


export default function ActivityScreen() {
    const [orders, setOrders] = useState<RestaurantOrder[]>([]);
    const [menu, setMenu] = useState<MenuItem[]>([]);

    useEffect(() => {
        // Load mock data
        setOrders(getRestaurantOrders() as RestaurantOrder[]);
        setMenu(getMenuItems() as MenuItem[]);
    }, []);

    // Calculate Summary Tiles Data
    const newOrdersCount = orders.filter(o => o.status === 'New').length;
    const itemsAvailable = menu.filter(m => m.is_available).length;
    const totalOrders = orders.length;

    const handleQuickAction = (action: string) => {
        Alert.alert("Action", `Performing Quick Action: ${action}`);
    };

    return (
        <View style={styles.container}>
            {/* 🍽️ Icon added to the header title */}
            <AppHeader title="Restaurant Activity 🍽️" showBack={false} /> 
            <ScrollView style={styles.content}>

                {/* Checklist: Summary Tiles */}
                <Text style={styles.sectionTitle}>Today's Summary</Text>
                <View style={styles.summaryContainer}>
                    <SummaryTile title="New Orders" value={newOrdersCount.toString()} icon="receipt" />
                    <SummaryTile title="Total Orders" value={totalOrders.toString()} icon="list-alt" />
                    <SummaryTile title="Menu Items" value={itemsAvailable.toString()} icon="restaurant-menu" />
                </View>

                {/* Checklist: Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsContainer}>
                    <QuickActionButton 
                        title="Manage Menu" 
                        icon="edit" 
                        onPress={() => handleQuickAction('Menu Management')} 
                    />
                    <QuickActionButton 
                        title="Go Offline" 
                        icon="offline-bolt" 
                        onPress={() => handleQuickAction('Go Offline')} 
                    />
                </View>

                {/* Checklist: Order List Preview */}
                <Text style={styles.sectionTitle}>Recent Orders (First 3)</Text>
                <View style={styles.orderListContainer}>
                    {orders.slice(0, 3).map((order) => (
                        <OrderPreviewItem key={order.id} order={order} />
                    ))}
                    {orders.length > 3 && (
                        <TouchableOpacity style={styles.viewAllButton} onPress={() => handleQuickAction('View All Orders')}>
                            <Text style={styles.viewAllText}>View All Orders ({orders.length})</Text>
                            <MaterialIcons name="arrow-forward" size={16} color="#007AFF" />
                        </TouchableOpacity>
                    )}
                    {orders.length === 0 && (
                        <Text style={styles.emptyText}>No recent orders to display.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 15 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 10 },
    
    // Summary Tiles
    summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    summaryTile: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 15, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    tileValue: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 5 },
    tileTitle: { fontSize: 12, color: '#777', textAlign: 'center' },

    // Quick Actions
    quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 15 },
    quickActionButton: { alignItems: 'center', padding: 10, flex: 1 },
    quickActionText: { fontSize: 12, marginTop: 5, color: '#4CAF50', fontWeight: '600' },

    // Order List Preview
    orderListContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 20 },
    orderPreview: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    orderId: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    customerText: { fontSize: 12, color: '#777' },
    orderTotal: { fontSize: 14, fontWeight: '700', color: '#007AFF', marginLeft: 10 },
    orderStatus: { fontSize: 12, fontWeight: '600', color: '#FF9800', paddingHorizontal: 8 },
    viewAllButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, marginTop: 5 },
    viewAllText: { color: '#007AFF', fontWeight: '600', marginRight: 5 },
    emptyText: { textAlign: 'center', color: '#999', padding: 10 }
});