// oneQlick/app/(tabs)/deliveries.tsx (I18N and THEME-AWARE)

import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    FlatList, 
    ScrollView, 
    TouchableOpacity, 
    Switch, 
    Alert,
    Text as RNText
} from 'react-native';

import { useRouter } from 'expo-router'; 
import AppHeader from '../../components/common/AppHeader'; 
import { getDeliveryOrders, getProfile } from '../../utils/mock'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { useTheme } from '../../contexts/ThemeContext'; 
import { useLanguage } from '../../contexts/LanguageContext'; // 👈 I18N IMPORT


// *** Define TypeScript Interfaces ***
interface LocationDetail { name: string; address: string; }
interface OrderItem { name: string; qty: number; }
interface DeliveryOrder {
    id: string;
    status: string;
    amount: number;
    pickup: LocationDetail;
    drop: LocationDetail;
    items: OrderItem[];
    payment_type: string;
}
interface UserProfile { id: string; name: string; is_online: boolean; }

// --- Helper Component: Availability Toggle ---
const AvailabilityToggle = ({
    partnerName,
    isOnline,
    toggleOnline,
    styles,
    t
}: { partnerName: string, isOnline: boolean, toggleOnline: () => void, styles: any, t: (key: string) => string }) => (
    <View style={styles.toggleContainer}>
        <RNText style={styles.partnerName}>{t('welcome_delivery_partner')}: {partnerName}</RNText>
        <View style={styles.toggleRow}>
            <RNText style={[styles.statusText, { color: isOnline ? '#4CAF50' : '#F44336' }]}>
                {t('you_are')} {isOnline ? t('online') : t('offline')}
            </RNText>
            <Switch
                trackColor={{ false: styles.switchTrackFalse.color, true: "#4CAF50" }}
                thumbColor={styles.switchThumb.color}
                ios_backgroundColor={styles.switchIOSBackground.color}
                onValueChange={toggleOnline}
                value={isOnline}
            />
        </View>
    </View>
);

// --- Helper Component: Order List Item ---
const OrderListItem = ({ item, onOpen, styles, t }: { item: DeliveryOrder, onOpen: (id: string) => void, styles: any, t: (key: string) => string }) => {
    
    const getStatusChipStyle = (status: string) => {
        switch (status) {
            case 'Ready for Pickup': return { backgroundColor: '#FFC107', color: '#000' };
            case 'In Transit': return { backgroundColor: '#2196F3', color: '#fff' };
            case 'Accepted': return { backgroundColor: '#4CAF50', color: '#fff' };
            default: return { backgroundColor: '#9E9E9E', color: '#fff' };
        }
    };

    const statusStyle = getStatusChipStyle(item.status);
    const translatedStatus = t(item.status.toLowerCase().replace(/\s/g, '_')); 
    const translatedPayment = t(item.payment_type.toLowerCase().replace(/\s/g, '_'));

    return (
        <TouchableOpacity style={styles.listItem} onPress={() => onOpen(item.id)}>
            <View style={styles.row}>
                <RNText style={styles.orderId}>{t('order_id')}: {item.id}</RNText>
                <RNText style={styles.amountText}>₹{item.amount.toFixed(2)} ({translatedPayment})</RNText>
            </View>

            <View style={styles.addressRow}>
                <MaterialIcons name="store" size={16} color={styles.iconColor.color} />
                <RNText style={styles.addressLine}> {t('pickup')}: {item.pickup.name}</RNText>
            </View>

            <View style={styles.addressRow}>
                <MaterialIcons name="pin-drop" size={16} color={styles.iconColor.color} />
                <RNText style={styles.addressLine}> {t('drop')}: {item.drop.name}</RNText>
            </View>

            <View style={[styles.row, { marginTop: 10 }]}>
                <View style={[styles.statusChip, { backgroundColor: statusStyle.backgroundColor }]}>
                    <RNText style={[styles.statusChipText, { color: statusStyle.color }]}>{translatedStatus}</RNText>
                </View>

                <TouchableOpacity onPress={() => onOpen(item.id)} style={styles.openButton}>
                    <RNText style={styles.openButtonText}>{t('open')}</RNText>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

// --- Main Dashboard Component ---
export default function DeliveryDashboardScreen() {
    const router = useRouter();
    const { theme } = useTheme(); 
    const { t } = useLanguage(); 

    const [orders, setOrders] = useState<DeliveryOrder[]>([]);
    const [profile, setProfile] = useState<UserProfile | {}>({});
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const mockProfile: UserProfile = getProfile();
        setProfile(mockProfile);
        setIsOnline(mockProfile.is_online);

        const mockOrders = getDeliveryOrders();
        setOrders(mockOrders);
    }, []);

    const toggleAvailability = () => {
        const newState = !isOnline;
        setIsOnline(newState);
        Alert.alert(t("status_change"), `${t("switched_to")} ${newState ? t('online') : t('offline')}`);
    };

    const handleOpenNotifications = () => {
        router.push('/notifications');
    };

    const handleOpenDetails = (id: string) => {
        router.push({
            pathname: '/delivery-order-details',
            params: { orderId: id },
        });
    };

    const partnerName = (profile as UserProfile)?.name || t('delivery_partner_default'); 

    // 🔑 Dynamic Styles
    const dynamicStyles = StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5' 
        },
        content: { padding: 10 },
        toggleContainer: { 
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff', 
            padding: 15, 
            borderRadius: 8, 
            marginBottom: 10, 
            marginTop: 5 
        },
        toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        partnerName: { 
            fontSize: 18, 
            fontWeight: 'bold', 
            marginBottom: 5,
            color: theme === 'dark' ? '#FFFFFF' : '#000' 
        },
        statusText: { fontWeight: '600', fontSize: 16 },
        listTitle: { 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginBottom: 10, 
            marginTop: 5, 
            paddingHorizontal: 5,
            color: theme === 'dark' ? '#CCCCCC' : '#000' 
        },
        listItem: { 
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff', 
            padding: 15, 
            borderRadius: 8, 
            marginBottom: 10, 
            elevation: 1 
        },
        row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        orderId: { 
            fontSize: 16, 
            fontWeight: 'bold',
            color: theme === 'dark' ? '#FFF' : '#000' 
        },
        addressRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
        addressLine: { 
            fontSize: 14, 
            color: theme === 'dark' ? '#AAA' : '#555', 
            marginLeft: 5 
        },
        amountText: { fontSize: 16, fontWeight: '700', color: '#4CAF50' }, 
        statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
        statusChipText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
        openButton: { backgroundColor: '#4F46E5', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 5 },
        openButtonText: { color: '#fff', fontWeight: 'bold' },
        emptyText: { textAlign: 'center', marginTop: 20, color: theme === 'dark' ? '#777' : '#999' },
        switchTrackFalse: { color: theme === 'dark' ? '#9E9E9E' : '#767577' },
        switchThumb: { color: theme === 'dark' ? '#FFFFFF' : '#f4f3f4' },
        switchIOSBackground: { color: theme === 'dark' ? '#555' : '#3e3e3e' },
        iconColor: { color: theme === 'dark' ? '#BBB' : '#777' } 
    });

    return (
        <View style={dynamicStyles.container}>
            <AppHeader
                title={t("deliveries")}
                rightAction={{
                    iconName: 'notifications',
                    onPress: handleOpenNotifications
                }}
            />

            <ScrollView style={dynamicStyles.content}>
                <AvailabilityToggle
                    partnerName={partnerName}
                    isOnline={isOnline}
                    toggleOnline={toggleAvailability}
                    styles={dynamicStyles}
                    t={t}
                />

                <RNText style={dynamicStyles.listTitle}>{t('active_requests')} ({orders.length})</RNText>

                <FlatList
                    data={orders}
                    renderItem={({ item }) => (
                        <OrderListItem 
                            item={item} 
                            onOpen={handleOpenDetails} 
                            styles={dynamicStyles} 
                            t={t} 
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <RNText style={dynamicStyles.emptyText}>{t('no_active_requests')}</RNText>
                    }
                />
            </ScrollView>
        </View>
    );
}
