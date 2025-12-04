// oneQlick/app/(tabs)/orders.tsx (UPDATED for Navigation to Details Screen - Task 8 Link)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
// 🔑 ADDED: useRouter for navigation
import { useRouter } from 'expo-router'; 
import AppHeader from '../../components/common/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { getRestaurantOrders } from '../../utils/mock'; 

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

// --- Helper Components ---

// Component for the Order Action Buttons
const ActionButton = ({ title, onPress, color }: { title: string, onPress: () => void, color: string }) => (
    <TouchableOpacity 
        onPress={onPress} 
        style={[orderStyles.actionButton, { backgroundColor: color }]}
    >
        <Text style={orderStyles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
);

// Component for a single Order Card with Actions
// 🔑 UPDATED: Added onOpenDetails prop
const OrderCard = ({ order, onStatusChange, onOpenDetails }: { 
    order: RestaurantOrder, 
    onStatusChange: (id: string, newStatus: RestaurantOrder['status']) => void,
    onOpenDetails: (id: string) => void // Handler to open the detail screen
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
    const renderActions = () => {
        if (order.status === 'New') {
            return (
                <View style={orderStyles.actionsRow}>
                    <ActionButton title="Accept" color="#4CAF50" onPress={() => onStatusChange(order.id, 'Preparing')} />
                    <ActionButton title="Reject" color="#F44336" onPress={() => onStatusChange(order.id, 'Rejected')} />
                </View>
            );
        } else if (order.status === 'Preparing') {
            return (
                <ActionButton title="Mark Ready" color="#007AFF" onPress={() => onStatusChange(order.id, 'Ready')} />
            );
        } else if (order.status === 'Ready') {
            return (<Text style={orderStyles.readyText}>Waiting for Driver Pickup...</Text>);
        }
        return <Text style={orderStyles.finalStatusText}>Status: {order.status}</Text>;
    };

    return (
        <TouchableOpacity 
            style={orderStyles.card} 
            // 🔑 ADDED: Navigation action on card press
            onPress={() => onOpenDetails(order.id)} 
        >
            <View style={orderStyles.header}>
                <Text style={orderStyles.orderId}>Order #{order.id}</Text>
                <View style={[orderStyles.statusChip, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Text style={[orderStyles.statusChipText, { color: statusStyle.color }]}>{order.status}</Text>
                </View>
            </View>

            <View style={orderStyles.detailRow}>
                <Text style={orderStyles.label}>Customer:</Text>
                <Text style={orderStyles.value}>{order.customer}</Text>
            </View>
            <View style={orderStyles.detailRow}>
                <Text style={orderStyles.label}>Pickup Time:</Text>
                <Text style={orderStyles.value}>{order.pickup_time}</Text>
            </View>
            <View style={orderStyles.detailRow}>
                <Text style={orderStyles.label}>Total:</Text>
                <Text style={orderStyles.totalValue}>${order.total.toFixed(2)}</Text>
            </View>

            <View style={orderStyles.itemsContainer}>
                <Text style={orderStyles.itemsTitle}>Items:</Text>
                {order.items.map((item, index) => (
                    <Text key={index} style={orderStyles.itemText}>{item.qty}x {item.name}</Text>
                ))}
            </View>
            
            <View style={orderStyles.actionsContainer}>
                {renderActions()}
            </View>
        </TouchableOpacity>
    );
};


// --- Main Component ---
export default function OrderManagementScreen() {
    // 🔑 ADDED: Initialize router
    const router = useRouter(); 
    const [orders, setOrders] = useState<RestaurantOrder[]>([]);

    useEffect(() => {
        setOrders(getRestaurantOrders() as RestaurantOrder[]);
    }, []);

    const handleStatusChange = (id: string, newStatus: RestaurantOrder['status']) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === id ? { ...order, status: newStatus } : order
            )
        );
        Alert.alert("Status Updated", `Order ${id} is now ${newStatus}.`);
    };

    // 🔑 ADDED: Navigation handler function
    const handleOpenDetails = (id: string) => {
        router.push({
            // Path to the new details screen created in Task 8
            pathname: '/restaurant-order-details', 
            params: { orderId: id },
        });
    };

    const newOrders = orders.filter(o => o.status === 'New');
    const activeOrders = orders.filter(o => o.status === 'Preparing' || o.status === 'Ready');
    const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Rejected');

    // 🔑 UPDATED: renderOrderList now passes the click handler
    const renderOrderList = (title: string, list: RestaurantOrder[], onOpenDetails: (id: string) => void) => (
        <View>
            <Text style={styles.sectionTitle}>{title} ({list.length})</Text>
            {list.length === 0 ? (
                <Text style={styles.emptyText}>No {title.toLowerCase()}.</Text>
            ) : (
                list.map(order => (
                    <OrderCard 
                        key={order.id} 
                        order={order} 
                        onStatusChange={handleStatusChange} 
                        onOpenDetails={onOpenDetails} // PASSED
                    />
                ))
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader title="Order Management 🛎️" showBack={false} />
            <ScrollView style={styles.content}>
                
                {/* 🔑 UPDATED: Passing handleOpenDetails to renderOrderList */}
                {renderOrderList('New Orders', newOrders, handleOpenDetails)}
                {renderOrderList('Active Orders', activeOrders, handleOpenDetails)}
                {renderOrderList('Completed Orders', completedOrders, handleOpenDetails)}

                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
}

// --- Styles ---

const orderStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderId: {
        fontSize: 18,
        fontWeight: '900',
        color: '#333',
    },
    statusChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
    },
    statusChipText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#fafafa',
    },
    label: {
        fontSize: 14,
        color: '#777',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#4CAF50', // Green for money
    },
    itemsContainer: {
        marginTop: 10,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    itemsTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 5,
        color: '#333',
    },
    itemText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 5,
    },
    actionsContainer: {
        marginTop: 15,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        paddingVertical: 10,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    readyText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        color: '#FF9800',
        padding: 5
    },
    finalStatusText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        color: '#777',
        padding: 5
    }
});

const styles = StyleSheet.create({ 
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 15 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 10 },
    emptyText: { textAlign: 'center', color: '#999', paddingVertical: 15, backgroundColor: '#fff', borderRadius: 8, marginBottom: 15 }
});