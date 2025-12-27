import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/useAuthZustand';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const TODAY_DATA = {
  total: "1,250",
  balance: "450",
  orders: 12,
  hours: "8h 30m",
  distance: "42 km",
  breakdown: [
    { label: "Order Pay", amount: 850, color: '#3B82F6', icon: 'bike' },
    { label: "Surge Pay", amount: 150, color: '#F97316', icon: 'flash' },
    { label: "Target Pay", amount: 120, color: '#A855F7', icon: 'target' },
    { label: "Customer Tips", amount: 130, color: '#10B981', icon: 'heart' },
  ],
  trips: [
    { id: "ZM-8821", time: "8:45 PM", restaurant: "Pizza Hut", amount: 85, status: "Completed" },
    { id: "ZM-8820", time: "8:15 PM", restaurant: "Burger King", amount: 62, status: "Completed" },
  ]
};

const WEEKLY_DATA = {
  total: "8,450",
  balance: "450",
  orders: 84,
  hours: "52h 10m",
  distance: "315 km",
  breakdown: [
    { label: "Order Pay", amount: 5950, color: '#3B82F6', icon: 'bike' },
    { label: "Surge Pay", amount: 900, color: '#F97316', icon: 'flash' },
    { label: "Target Pay", amount: 800, color: '#A855F7', icon: 'target' },
    { label: "Customer Tips", amount: 800, color: '#10B981', icon: 'heart' },
  ],
  trips: [
    { id: "ZM-8815", time: "Yesterday", restaurant: "Weekly Incentive", amount: 500, status: "Bonus" },
    { id: "ZM-8814", time: "Yesterday", restaurant: "KFC", amount: 95, status: "Completed" },
  ]
};

export default function EarningsScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const [period, setPeriod] = useState<'today' | 'weekly'>('today');
  const [data, setData] = useState(TODAY_DATA);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setData(period === 'today' ? TODAY_DATA : WEEKLY_DATA);
  }, [period]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const colors = {
    bg: isDark ? '#0F0F0F' : '#F8FAFC',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1E293B',
    subtext: isDark ? '#94A3B8' : '#64748B',
    primary: '#4F46E5',
    border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.portfolioLabel, { color: colors.primary }]}>MY PORTFOLIO</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>EARNINGS</Text>
        </View>

        <View style={[styles.pillContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
          <TouchableOpacity 
            onPress={() => setPeriod('today')}
            style={[styles.pill, period === 'today' && styles.pillActive]}
          >
            <Text style={[styles.pillText, period === 'today' ? {color: '#FFF'} : {color: colors.subtext}]}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setPeriod('weekly')}
            style={[styles.pill, period === 'weekly' && styles.pillActive]}
          >
            <Text style={[styles.pillText, period === 'weekly' ? {color: '#FFF'} : {color: colors.subtext}]}>Week</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        
        {/* Main Balance Card */}
        <Surface style={[styles.mainCard, { backgroundColor: colors.primary }]} elevation={4}>
          <View style={styles.mainCardHeader}>
            <View>
              <Text style={styles.mainCardLabel}>REVENUE GROWTH</Text>
              <Text style={styles.mainCardAmount}>₹{data.total}</Text>
            </View>
            <MaterialCommunityIcons name="trending-up" size={28} color="white" style={styles.trendingIcon} />
          </View>
          
          <View style={styles.withdrawContainer}>
            <View>
              <Text style={styles.withdrawLabel}>AVAILABLE BALANCE</Text>
              <Text style={styles.withdrawAmount}>₹{data.balance}</Text>
            </View>
            <TouchableOpacity style={styles.withdrawBtn}>
              <Text style={styles.withdrawBtnText}>WITHDRAW</Text>
            </TouchableOpacity>
          </View>
        </Surface>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: 'bike', val: data.orders, label: 'Orders', color: '#3B82F6' },
            { icon: 'clock-outline', val: data.hours, label: 'Hours', color: '#F97316' },
            { icon: 'map-marker', val: data.distance, label: 'Distance', color: '#10B981' }
          ].map((stat, i) => (
            <Surface key={i} style={[styles.statItem, { backgroundColor: colors.card }]} elevation={1}>
              <View style={[styles.statIconBox, { backgroundColor: `${stat.color}15` }]}>
                <MaterialCommunityIcons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.val}</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>{stat.label}</Text>
            </Surface>
          ))}
        </View>

        {/* Payment Breakdown */}
        <Surface style={[styles.breakdownCard, { backgroundColor: colors.card }]} elevation={1}>
          <View style={styles.breakdownHeader}>
            <MaterialCommunityIcons name="wallet-outline" size={18} color={colors.primary} />
            <Text style={[styles.breakdownHeaderText, { color: colors.text }]}>PAYMENT BREAKDOWN</Text>
          </View>

          {data.breakdown.map((item, idx) => {
            const totalVal = parseInt(data.total.replace(',', ''));
            const percentage = (item.amount / totalVal) * 100;

            return (
              <View key={idx} style={styles.breakdownRow}>
                <View style={styles.breakdownRowTop}>
                  <Text style={[styles.breakdownLabel, { color: colors.text }]}>{item.label}</Text>
                  <Text style={[styles.breakdownAmount, { color: colors.text }]}>₹{item.amount}</Text>
                </View>
                <View style={[styles.progressBase, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }]}>
                  <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: item.color }]} />
                </View>
              </View>
            );
          })}
        </Surface>

        {/* Recent Trips */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>RECENT TRIPS</Text>
          <TouchableOpacity><Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>VIEW ALL</Text></TouchableOpacity>
        </View>

        {data.trips.map((trip, idx) => (
          <Surface key={idx} style={[styles.tripCard, { backgroundColor: colors.card }]} elevation={1}>
            <View style={styles.tripInfo}>
              <View style={[styles.tripIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }]}>
                <MaterialCommunityIcons name="bike" size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.tripRestaurant, { color: colors.text }]}>{trip.restaurant}</Text>
                <Text style={[styles.tripMeta, { color: colors.subtext }]}>{trip.time} • {trip.id}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.tripAmount, { color: trip.status === 'Bonus' ? '#F59E0B' : '#10B981' }]}>
                + ₹{trip.amount}
              </Text>
              <Text style={[styles.tripStatus, { color: colors.subtext }]}>{trip.status.toUpperCase()}</Text>
            </View>
          </Surface>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  portfolioLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  pillContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 20,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pillActive: {
    backgroundColor: '#4F46E5',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  mainCard: {
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
  },
  mainCardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  mainCardAmount: {
    color: 'white',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  trendingIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  withdrawContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  withdrawLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  withdrawAmount: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  withdrawBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  withdrawBtnText: {
    color: '#4F46E5',
    fontSize: 10,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBox: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  breakdownCard: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 24,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  breakdownHeaderText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  breakdownRow: {
    marginBottom: 16,
  },
  breakdownRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: '900',
  },
  progressBase: {
    height: 6,
    borderRadius: 3,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  tripCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tripIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripRestaurant: {
    fontSize: 14,
    fontWeight: '700',
  },
  tripMeta: {
    fontSize: 11,
    fontWeight: '600',
  },
  tripAmount: {
    fontSize: 14,
    fontWeight: '900',
  },
  tripStatus: {
    fontSize: 9,
    fontWeight: '800',
  }
});