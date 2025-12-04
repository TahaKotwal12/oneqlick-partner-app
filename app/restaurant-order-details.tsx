// oneQlick/app/restaurant-order-details.tsx (Restaurant Order Details Screen - Task 8)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import AppHeader from '../components/common/AppHeader'; 
import { getRestaurantOrders } from '../utils/mock'; 
import { MaterialIcons } from '@expo/vector-icons'; 

// *** Data Interfaces ***
interface OrderItem {
    name: string;
    qty: number;
}

interface RestaurantOrder {
    id: string;
    status: string;
    total: number;
    customer: string;
    pickup_time: string;
    items: OrderItem[];
    notes: string; // Existing note field
}

// --- Helper Components ---

const DetailRow = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
    <View style={styles.detailRow}>
        <MaterialIcons name={icon as 'person'} size={20} color="#007AFF" style={{ marginRight: 10 }} />
        <Text style={styles.detailLabel}>{label}: </Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const ItemRow = ({ name, qty }: OrderItem) => (
    <View style={styles.itemRow}>
        <Text style={styles.itemQty}>{qty}x</Text>
        <Text style={styles.itemName}>{name}</Text>
    </View>
);

// --- Main Component ---
export default function RestaurantOrderDetailsScreen() {
    const params = useLocalSearchParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
    
    const [order, setOrder] = useState<RestaurantOrder | null>(null);
    const [localNotes, setLocalNotes] = useState(''); // Checklist: Add note (local save)
    const [status, setStatus] = useState('Loading...');

    // 1. Fetch Order Details from Mock
    useEffect(() => {
        if (!orderId) {
            setStatus('Error: No Order ID Provided');
            return;
        }

        const allOrders: RestaurantOrder[] = getRestaurantOrders(); 
        const selectedOrder = allOrders.find(o => o.id === orderId); 

        if (selectedOrder) {
            setOrder(selectedOrder);
            setStatus(selectedOrder.status);
            setLocalNotes(selectedOrder.notes || ''); 
        } else {
            setOrder(allOrders[0] || null);
            setStatus(allOrders[0]?.status || 'Error: Order Not Found');
            setLocalNotes(allOrders[0]?.notes || '');
        }
    }, [orderId]);

    // 2. Checklist: Add note (local save) - Persists for the session
    const handleSaveNotes = () => {
        if (order) {
            setOrder({ ...order, notes: localNotes });
            Alert.alert("Notes Saved", "Internal notes updated successfully for this session.");
        }
    };
    
    if (!order) {
        return <View style={styles.loadingContainer}><Text>Loading Order Details...</Text></View>;
    }

    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <AppHeader 
                title={`Order #${order.id}`} 
                showBack={true} 
            />
            
            <ScrollView style={styles.content}>
                
                {/* Current Status */}
                <View style={styles.statusBox}>
                    <Text style={styles.statusTitle}>Current Status:</Text>
                    <Text style={styles.statusValue}>{status}</Text>
                </View>

                {/* Checklist: Show items, totals, customer, pickup time. */}
                <Text style={styles.sectionTitle}>Customer & Order Summary 🧑</Text>
                <View style={styles.card}>
                    <DetailRow icon="person" label="Customer" value={order.customer} />
                    <DetailRow icon="access-time" label="Pickup Time" value={order.pickup_time} />
                    <DetailRow icon="payment" label="Order Total" value={`$${order.total.toFixed(2)}`} />
                </View>

                {/* Checklist: Items list. */}
                <Text style={styles.sectionTitle}>Order Items 🍔</Text>
                <View style={styles.card}>
                    {order.items.map((item, index) => (
                        <ItemRow key={index} name={item.name} qty={item.qty} />
                    ))}
                </View>

                {/* Checklist: Add note (local save) */}
                <Text style={styles.sectionTitle}>Internal Notes 📝</Text>
                <View style={[styles.card, styles.notesCard]}>
                    <TextInput
                        style={styles.notesInput}
                        multiline
                        placeholder="Add internal notes or customer requests here..."
                        value={localNotes}
                        onChangeText={setLocalNotes}
                        onBlur={handleSaveNotes} 
                        placeholderTextColor="#aaa"
                    />
                    <View style={styles.noteActionRow}>
                        <Text style={styles.saveHint}>Notes save automatically when you leave the field or press Save.</Text>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNotes}>
                             <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 50 }} />
                
            </ScrollView>
        </View>
    );
}

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 15 },
    card: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, elevation: 2 },
    notesCard: { padding: 0 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 5 },
    
    // Status Box
    statusBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fffbe6', padding: 10, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ffecb3' },
    statusTitle: { fontSize: 14, color: '#333' },
    statusValue: { fontSize: 16, fontWeight: 'bold', color: '#ff9800' },

    // Detail Rows
    detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
    detailLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
    detailValue: { fontSize: 15, color: '#666', flex: 1 },

    // Item Rows
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#fafafa' },
    itemQty: { fontWeight: 'bold', width: 30, color: '#007AFF' },
    itemName: { flex: 1, color: '#333' },

    // Notes Input & Save Action
    notesInput: {
        minHeight: 120,
        fontSize: 15,
        padding: 15,
        textAlignVertical: 'top',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    noteActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
    },
    saveHint: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    saveButton: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    }
});