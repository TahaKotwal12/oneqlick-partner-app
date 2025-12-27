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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useTheme } from '../../contexts/ThemeContext'; 
import { useLanguage } from '../../contexts/LanguageContext';

// --- TypeScript Interfaces ---
interface LocationDetail { name: string; address: string; }
interface DeliveryOrder {
    id: string;
    status: string;
    amount: number;
    pickup: LocationDetail;
    drop: LocationDetail;
    payment_type: string;
}
interface UserProfile { id: string; name: string; is_online: boolean; }

// --- Sub-Component: Stats Card ---
const StatCard = ({ label, value, icon, color, theme }: any) => (
    <View style={[
        styles.statCard, 
        { 
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', 
            borderColor: theme === 'dark' ? '#333' : '#F0F0F0' 
        }
    ]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
        <RNText style={[styles.statValue, { color: theme === 'dark' ? '#FFF' : '#000' }]}>{value}</RNText>
        <RNText style={styles.statLabel}>{label.toUpperCase()}</RNText>
    </View>
);

// --- Helper Component: Order List Item ---
const OrderListItem = ({ item, onOpen, theme, t }: { item: DeliveryOrder, onOpen: (id: string) => void, theme: string, t: any }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Ready for Pickup': return { color: '#F59E0B', bg: '#FEF3C7' };
            case 'In Transit': return { color: '#3B82F6', bg: '#DBEAFE' };
            case 'Accepted': return { color: '#10B981', bg: '#D1FAE5' };
            default: return { color: '#6B7280', bg: '#F3F4F6' };
        }
    };

    const cfg = getStatusConfig(item.status);
    const translatedStatus = t(item.status.toLowerCase().replace(/\s/g, '_'));

    return (
        <TouchableOpacity 
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFF', borderColor: theme === 'dark' ? '#333' : '#EEE' }]} 
            onPress={() => onOpen(item.id)}
        >
            <View style={styles.cardHeader}>
                <View style={styles.orderIdContainer}>
                    <RNText style={styles.labelSmall}>{t('order_id')}</RNText>
                    <RNText style={[styles.orderIdText, { color: theme === 'dark' ? '#FFF' : '#000' }]}>{item.id}</RNText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <RNText style={styles.amountText}>₹{item.amount.toFixed(2)}</RNText>
                    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                        <RNText style={[styles.statusBadgeText, { color: cfg.color }]}>{translatedStatus}</RNText>
                    </View>
                </View>
            </View>

            <View style={styles.timelineContainer}>
                <View style={styles.timelineLine} />
                <View style={styles.timelinePoint}>
                    <View style={[styles.dot, { backgroundColor: '#6366F1' }]} />
                    <View style={styles.addressInfo}>
                        <RNText style={styles.labelSmall}>{t('pickup')}</RNText>
                        <RNText style={[styles.addressText, { color: theme === 'dark' ? '#DDD' : '#333' }]}>{item.pickup.name}</RNText>
                    </View>
                </View>
                <View style={[styles.timelinePoint, { marginTop: 15 }]}>
                    <View style={[styles.dot, { backgroundColor: '#F43F5E' }]} />
                    <View style={styles.addressInfo}>
                        <RNText style={styles.labelSmall}>{t('drop')}</RNText>
                        <RNText style={[styles.addressText, { color: theme === 'dark' ? '#DDD' : '#333' }]}>{item.drop.name}</RNText>
                    </View>
                </View>
            </View>

            <View style={[styles.cardFooter, { borderTopColor: theme === 'dark' ? '#333' : '#F5F5F5' }]}>
                <RNText style={styles.paymentMethod}>{t(item.payment_type.toLowerCase())}</RNText>
                <View style={styles.openBtn}>
                    <RNText style={styles.openBtnText}>{t('open')}</RNText>
                    <Ionicons name="chevron-forward" size={14} color="#FFF" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function DeliveryDashboardScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [orders, setOrders] = useState<DeliveryOrder[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const mockProfile = getProfile();
        setProfile(mockProfile);
        setIsOnline(mockProfile.is_online);
        setOrders(getDeliveryOrders());
    }, []);

    const toggleAvailability = () => {
        setIsOnline(!isOnline);
        Alert.alert(t("status_change"), `${t("switched_to")} ${!isOnline ? t('online') : t('offline')}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#0F0F0F' : '#F9FAFB' }]}>
            <AppHeader title={t("deliveries")} rightAction={{ iconName: 'notifications', onPress: () => router.push('/notifications') }} />
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.profileCard, { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFF' }]}>
                    <View style={styles.profileRow}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={28} color="#FFF" />
                            <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? '#10B981' : '#F43F5E' }]} />
                        </View>
                        <View>
                            <RNText style={styles.welcomeText}>{t('welcome_delivery_partner')}</RNText>
                            <RNText style={[styles.nameText, { color: theme === 'dark' ? '#FFF' : '#000' }]}>{profile?.name || "Partner"}</RNText>
                        </View>
                    </View>
                    
                    <View style={[styles.toggleBar, { backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F3F4F6' }]}>
                        <RNText style={[styles.toggleText, { color: isOnline ? '#10B981' : '#F43F5E' }]}>
                            {(isOnline ? t('online') : t('offline')).toUpperCase()}
                        </RNText>
                        <Switch value={isOnline} onValueChange={toggleAvailability} trackColor={{ false: '#767577', true: '#10B981' }} />
                    </View>
                </View>

                <View style={styles.statsGrid}>
                    <StatCard theme={theme} label="Earnings" value="₹1,240" icon="trending-up" color="#10B981" />
                    <StatCard theme={theme} label="Success" value="100%" icon="shield-check" color="#6366F1" />
                    <StatCard theme={theme} label="Rating" value="4.8" icon="star" color="#F59E0B" />
                </View>

                <View style={styles.sectionHeader}>
                    <RNText style={styles.sectionTitle}>{t('active_requests').toUpperCase()}</RNText>
                    <View style={styles.countBadge}><RNText style={styles.countText}>{orders.length}</RNText></View>
                </View>

                <FlatList
                    data={orders}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <OrderListItem 
                            item={item} 
                            theme={theme} 
                            t={t} 
                            onOpen={(id) => router.push({ pathname: '/delivery-order-details', params: { orderId: id } })} 
                        />
                    )}
                    ListEmptyComponent={<RNText style={styles.emptyText}>{t('no_active_requests')}</RNText>}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 }, // Fixed 'pb' to 'paddingBottom'
    profileCard: { borderRadius: 24, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    avatarContainer: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    onlineIndicator: { position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: '#FFF' },
    welcomeText: { fontSize: 10, fontWeight: '800', color: '#6366F1', letterSpacing: 1 },
    nameText: { fontSize: 20, fontWeight: '900' },
    toggleBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16 },
    toggleText: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    statCard: { width: '31%', padding: 12, borderRadius: 20, alignItems: 'center', borderWidth: 1 },
    statValue: { fontSize: 14, fontWeight: '800', marginVertical: 4 },
    statLabel: { fontSize: 8, fontWeight: '700', color: '#999' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 11, fontWeight: '800', color: '#999', letterSpacing: 2, marginRight: 8 },
    countBadge: { backgroundColor: '#6366F1', paddingHorizontal: 6, borderRadius: 6 },
    countText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    card: { borderRadius: 28, padding: 20, marginBottom: 16, borderWidth: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    
    // Fixed: Added missing orderIdContainer
    orderIdContainer: {
        flex: 1,
    },
    
    labelSmall: { fontSize: 9, fontWeight: '800', color: '#AAA', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
    orderIdText: { fontSize: 16, fontWeight: '900' },
    amountText: { fontSize: 18, fontWeight: '900', color: '#10B981' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
    statusBadgeText: { fontSize: 10, fontWeight: '800' },
    timelineContainer: { paddingLeft: 12, marginBottom: 20 },
    timelineLine: { position: 'absolute', left: 4, top: 10, bottom: 10, width: 1, backgroundColor: '#EEE', borderStyle: 'dashed' },
    timelinePoint: { flexDirection: 'row', alignItems: 'flex-start' },
    dot: { width: 9, height: 9, borderRadius: 4.5, marginTop: 4, marginRight: 15 },
    addressInfo: { flex: 1 },
    addressText: { fontSize: 13, fontWeight: '700' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTopWidth: 1 },
    paymentMethod: { fontSize: 10, fontWeight: '800', color: '#999', textTransform: 'uppercase' },
    openBtn: { backgroundColor: '#18181B', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
    openBtnText: { color: '#FFF', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginRight: 4 },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontWeight: '700' }
});