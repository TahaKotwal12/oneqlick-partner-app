// oneQlick/app/(tabs)/activity.tsx (I18N and THEME-AWARE)

import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert 
} from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { getRestaurantOrders, getMenuItems } from '../../utils/mock'; 
import { useRouter } from 'expo-router'; 
import { useTheme } from '../../contexts/ThemeContext'; 
import { useLanguage } from '../../contexts/LanguageContext'; // 👈 I18N IMPORT

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

const SummaryTile = ({ title, value, icon, styles }: { title: string, value: string, icon: string, styles: any }) => (
    <View style={styles.summaryTile}>
        <MaterialIcons name={icon as any} size={24} color="#007AFF" />
        <Text style={styles.tileValue}>{value}</Text>
        <Text style={styles.tileTitle}>{title}</Text>
    </View>
);

const QuickActionButton = ({ title, icon, onPress, styles }: { title: string, icon: string, onPress: () => void, styles: any }) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
        <MaterialIcons name={icon as any} size={28} color="#4CAF50" />
        <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
);

const OrderPreviewItem = ({ order, onOpenDetails, styles, t }: { order: RestaurantOrder, onOpenDetails: (id: string) => void, styles: any, t: (key: string) => string }) => (
    <TouchableOpacity 
        style={styles.orderPreview} 
        onPress={() => onOpenDetails(order.id)}
    >
        <View style={{ flex: 1 }}>
            <Text style={styles.orderId}>{t('order_hash')}{order.id}</Text>
            <Text style={styles.customerText}>{t('customer')}: {order.customer}</Text>
        </View>

        <Text style={styles.orderTotal}>₹{order.total.toFixed(2)}</Text>

        <Text style={styles.orderStatus}>{t(order.status.toLowerCase())}</Text>
    </TouchableOpacity>
);

export default function ActivityScreen() {
    const router = useRouter(); 
    const { theme } = useTheme(); 
    const { t } = useLanguage(); // 👈 USE LANGUAGE HOOK

    const [orders, setOrders] = useState<RestaurantOrder[]>([]);
    const [menu, setMenu] = useState<MenuItem[]>([]);

    useEffect(() => {
        setOrders(getRestaurantOrders() as RestaurantOrder[]);
        setMenu(getMenuItems() as MenuItem[]);
    }, []);
    
    const handleOpenOrderDetails = (id: string) => {
        Alert.alert(t("order_details"), `${t("opening_details_for")} ${t('order_id')}: ${id}`);
    };
    
    const newOrdersCount = orders.filter(o => o.status === 'New').length;
    const itemsAvailable = menu.filter(m => m.is_available).length;
    const totalOrders = orders.length;
    
    const handleQuickAction = (actionKey: string) => {
        const actionTitle = t(actionKey); 
        Alert.alert(t("action"), `${t("performing_action")}: ${actionTitle}`);
    };

    const handleOpenNotifications = () => {
        router.push('/notifications'); 
    };

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
        summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
        summaryTile: { 
            flex: 1, 
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff', 
            borderRadius: 8, 
            padding: 15, 
            marginHorizontal: 5, 
            alignItems: 'center', 
            justifyContent: 'center', 
            shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 
        },
        tileValue: { 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: theme === 'dark' ? '#FFFFFF' : '#333', 
            marginTop: 5 
        },
        tileTitle: { 
            fontSize: 12, 
            color: theme === 'dark' ? '#AAA' : '#777', 
            textAlign: 'center' 
        },
        quickActionsContainer: { 
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            paddingVertical: 10, 
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff', 
            borderRadius: 8, 
            marginBottom: 15 
        },
        quickActionButton: { alignItems: 'center', padding: 10, flex: 1 },
        quickActionText: { fontSize: 12, marginTop: 5, color: '#4CAF50', fontWeight: '600' }, 
        orderListContainer: { 
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff', 
            borderRadius: 8, 
            padding: 10, 
            marginBottom: 20 
        },
        orderPreview: { 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingVertical: 10, 
            borderBottomWidth: 1, 
            borderBottomColor: theme === 'dark' ? '#333' : '#eee' 
        },
        orderId: { 
            fontSize: 14, 
            fontWeight: 'bold', 
            color: theme === 'dark' ? '#FFF' : '#333' 
        },
        customerText: { 
            fontSize: 12, 
            color: theme === 'dark' ? '#AAA' : '#777' 
        },
        orderTotal: { 
            fontSize: 14, 
            fontWeight: '700', 
            color: '#007AFF', 
            marginLeft: 10 
        },
        orderStatus: { fontSize: 12, fontWeight: '600', color: '#FF9800', paddingHorizontal: 8 }, 
        viewAllButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, marginTop: 5 },
        viewAllText: { color: '#007AFF', fontWeight: '600', marginRight: 5 },
        emptyText: { textAlign: 'center', color: theme === 'dark' ? '#777' : '#999', padding: 10 }
    });

    return (
        <View style={dynamicStyles.container}>
            <AppHeader 
                title={t("restaurant_activity")} 
                showBack={false} 
                rightAction={{ 
                    iconName: 'notifications', 
                    onPress: handleOpenNotifications 
                }}
            /> 
            <ScrollView style={dynamicStyles.content}>

                <Text style={dynamicStyles.sectionTitle}>{t('todays_summary').toUpperCase()}</Text>
                <View style={dynamicStyles.summaryContainer}>
                    <SummaryTile title={t("new_orders")} value={newOrdersCount.toString()} icon="receipt" styles={dynamicStyles} />
                    <SummaryTile title={t("total_orders")} value={totalOrders.toString()} icon="list" styles={dynamicStyles} />
                    <SummaryTile title={t("menu_items")} value={itemsAvailable.toString()} icon="restaurant-menu" styles={dynamicStyles} />
                </View>

                <Text style={dynamicStyles.sectionTitle}>{t('quick_actions').toUpperCase()}</Text>
                <View style={dynamicStyles.quickActionsContainer}>
                    <QuickActionButton 
                        title={t("manage_menu")} 
                        icon="edit" 
                        onPress={() => handleQuickAction('manage_menu')} 
                        styles={dynamicStyles}
                    />
                    <QuickActionButton 
                        title={t("go_offline")} 
                        icon="power-settings-new" // ✅ replaced invalid icon
                        onPress={() => handleQuickAction('go_offline')} 
                        styles={dynamicStyles}
                    />
                </View>

                <Text style={dynamicStyles.sectionTitle}>{t('recent_orders_preview').toUpperCase()}</Text>
                <View style={dynamicStyles.orderListContainer}>
                    {orders.slice(0, 3).map((order) => (
                        <OrderPreviewItem 
                            key={order.id} 
                            order={order} 
                            onOpenDetails={handleOpenOrderDetails}
                            styles={dynamicStyles}
                            t={t}
                        />
                    ))}
                    {orders.length > 3 && (
                        <TouchableOpacity style={dynamicStyles.viewAllButton} onPress={() => handleQuickAction('view_all_orders')}>
                            <Text style={dynamicStyles.viewAllText}>{t('view_all_orders')} ({orders.length})</Text>
                            <MaterialIcons name="arrow-forward" size={16} color="#007AFF" />
                        </TouchableOpacity>
                    )}
                    {orders.length === 0 && (
                        <Text style={dynamicStyles.emptyText}>{t('no_recent_orders')}</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
