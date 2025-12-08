// oneQlick/app/restaurant-order-details.tsx (I18N and THEME-AWARE)

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text as RNText, 
    StyleSheet, 
    ScrollView, 
    Alert, 
    TextInput, 
    TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import AppHeader from '../components/common/AppHeader'; 
import { getRestaurantOrders } from '../utils/mock'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { useTheme } from '../contexts/ThemeContext'; 
import { useLanguage } from '../contexts/LanguageContext'; 

// *** Data Interfaces ***
interface OrderItem { name: string; qty: number; }
interface RestaurantOrder {
    id: string;
    status: string;
    total: number;
    customer: string;
    pickup_time: string;
    items: OrderItem[];
    notes: string; 
}

// --- Helper Components ---
const DetailRow = ({ icon, label, value, styles }: { icon: string, label: string, value: string, styles: any }) => (
    <View style={styles.detailRow}>
        <MaterialIcons name={icon as 'person'} size={20} color="#007AFF" style={{ marginRight: 10 }} />
        <RNText style={styles.detailLabel}>{label}: </RNText>
        <RNText style={styles.detailValue}>{value}</RNText>
    </View>
);

const ItemRow = ({ name, qty, styles }: OrderItem & { styles: any }) => (
    <View style={styles.itemRow}>
        <RNText style={styles.itemQty}>{qty}x</RNText>
        <RNText style={styles.itemName}>{name}</RNText>
    </View>
);

// --- Main Component ---
export default function RestaurantOrderDetailsScreen() {
    const params = useLocalSearchParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
    
    const { theme } = useTheme(); 
    const { t } = useLanguage(); 

    const [order, setOrder] = useState<RestaurantOrder | null>(null);
    const [localNotes, setLocalNotes] = useState(''); 
    const [status, setStatus] = useState(t('loading'));

    // 1. Fetch Order Details from Mock
    useEffect(() => {
        if (!orderId) {
            setStatus(t('error_no_order_id')); 
            return;
        }

        const allOrders: RestaurantOrder[] = getRestaurantOrders(); 
        const selectedOrder = allOrders.find(o => o.id === orderId); 

        if (selectedOrder) {
            setOrder(selectedOrder);
            setStatus(t(selectedOrder.status.toLowerCase())); 
            setLocalNotes(selectedOrder.notes || ''); 
        } else {
            setOrder(allOrders[0] || null);
            setStatus(allOrders[0]?.status ? t(allOrders[0].status.toLowerCase()) : t('error_order_not_found')); 
            setLocalNotes(allOrders[0]?.notes || '');
        }
    }, [orderId, t]);

    // 2. Handle Note Save (local session only)
    const handleSaveNotes = () => {
        if (order) {
            setOrder({ ...order, notes: localNotes });
            Alert.alert(t("notes_saved"), t("internal_notes_saved")); 
        }
    };
    
    // 🔑 Dynamic Styles Definition
    const dynamicStyles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5' },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        content: { padding: 15 },
        card: { 
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff', 
            borderRadius: 8, 
            padding: 15, 
            marginBottom: 15, 
            elevation: 2,
            borderWidth: theme === 'dark' ? 1 : 0,
            borderColor: theme === 'dark' ? '#333' : 'transparent',
        },
        notesCard: { padding: 0 },
        sectionTitle: { 
            fontSize: 16, 
            fontWeight: '700', 
            color: theme === 'dark' ? '#BB86FC' : '#333', 
            marginBottom: 10, 
            marginTop: 5 
        },
        
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

        detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
        detailLabel: { fontSize: 15, fontWeight: '600', color: theme === 'dark' ? '#FFFFFF' : '#333' },
        detailValue: { fontSize: 15, color: theme === 'dark' ? '#BBB' : '#666', flex: 1 },

        itemRow: { 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            paddingVertical: 8, 
            borderBottomWidth: 1, 
            borderBottomColor: theme === 'dark' ? '#292929' : '#fafafa' 
        },
        itemQty: { fontWeight: 'bold', width: 30, color: '#007AFF' },
        itemName: { flex: 1, color: theme === 'dark' ? '#FFFFFF' : '#333' },

        notesInput: {
            minHeight: 120,
            fontSize: 15,
            padding: 15,
            textAlignVertical: 'top',
            color: theme === 'dark' ? '#FFFFFF' : '#333',
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
            borderBottomWidth: 1,
            borderBottomColor: theme === 'dark' ? '#333' : '#eee',
        },
        noteActionRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 8,
        },
        saveHint: {
            fontSize: 12,
            color: theme === 'dark' ? '#777' : '#999',
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

    
    if (!order) {
        return (
            <View style={dynamicStyles.loadingContainer}>
                <RNText style={{ color: theme === 'dark' ? '#FFF' : '#333' }}>
                    {t('loading_order_details')}...
                </RNText>
            </View>
        );
    }

    return (
        <View style={dynamicStyles.container}>
            <AppHeader 
                title={`${t('order_hash')}${order.id}`} 
                showBack={true} 
            />
            
            <ScrollView style={dynamicStyles.content}>
                
                {/* Current Status */}
                <View style={dynamicStyles.statusBox}>
                    <RNText style={dynamicStyles.statusTitle}>{t('current_status')}:</RNText>
                    <RNText style={dynamicStyles.statusValue}>{status}</RNText>
                </View>

                {/* Customer & Order Summary */}
                <RNText style={dynamicStyles.sectionTitle}>{t('customer_order_summary')} 🧑</RNText> 
                <View style={dynamicStyles.card}>
                    <DetailRow icon="person" label={t("customer")} value={order.customer} styles={dynamicStyles} /> 
                    <DetailRow icon="access-time" label={t("pickup_time")} value={order.pickup_time} styles={dynamicStyles} /> 
                    
                    <DetailRow icon="payment" label={t("order_total")} value={`₹${order.total.toFixed(2)}`} styles={dynamicStyles} /> 
                </View>

                {/* Items list */}
                <RNText style={dynamicStyles.sectionTitle}>{t('order_items')} 🍔</RNText> 
                <View style={dynamicStyles.card}>
                    {order.items.map((item, index) => (
                        <ItemRow key={index} name={item.name} qty={item.qty} styles={dynamicStyles} />
                    ))}
                </View>

                {/* Internal Notes */}
                <RNText style={dynamicStyles.sectionTitle}>{t('internal_notes')} 📝</RNText> 
                <View style={[dynamicStyles.card, dynamicStyles.notesCard]}>
                    <TextInput
                        style={dynamicStyles.notesInput}
                        multiline
                        placeholder={t("notes_placeholder")} 
                        value={localNotes}
                        onChangeText={setLocalNotes}
                        onBlur={handleSaveNotes} 
                        placeholderTextColor={theme === 'dark' ? '#999' : '#aaa'}
                    />
                    <View style={dynamicStyles.noteActionRow}>
                        <RNText style={dynamicStyles.saveHint}>{t('notes_save_hint')}</RNText> 
                        <TouchableOpacity style={dynamicStyles.saveButton} onPress={handleSaveNotes}>
                             <RNText style={dynamicStyles.saveButtonText}>{t('save')}</RNText> 
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 50 }} />
                
            </ScrollView>
        </View>
    );
}
