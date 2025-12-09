// oneQlick/app/(tabs)/earnings.tsx

import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/useAuthZustand';

// --- Mock Data ---
const TODAY_DATA = {
  total: "1,250",
  balance: "450",
  orders: 12,
  hours: "8h 30m",
  distance: "42 km",
  breakdown: [
    { label: "Order Pay", amount: 850 },
    { label: "Surge Pay", amount: 150 },
    { label: "Target Pay", amount: 120 },
    { label: "Customer Tips", amount: 130 },
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
    { label: "Order Pay", amount: 5950 },
    { label: "Surge Pay", amount: 900 },
    { label: "Target Pay", amount: 800 },
    { label: "Customer Tips", amount: 800 },
  ],
  trips: [
    { id: "ZM-8815", time: "Yesterday", restaurant: "Weekly Incentive", amount: 500, status: "Bonus" },
    { id: "ZM-8814", time: "Yesterday", restaurant: "KFC", amount: 95, status: "Completed" },
  ]
};

export default function EarningsScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
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

  const cardStyle = {
    backgroundColor: isDark ? '#1E1E1E' : '#ffffff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#131313' : '#f5f5f5' }}>
      
      {/* Header */}
      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: isDark ? '#fff' : '#000' }}>
          {t('earnings')}
        </Text>

        <View style={{ flexDirection: 'row', gap: 20 }}>
          <TouchableOpacity onPress={() => setPeriod('today')}>
            <Text style={{ 
              color: period === 'today' ? '#4F46E5' : '#888',
              fontWeight: '600'
            }}>{t('today')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setPeriod('weekly')}>
            <Text style={{ 
              color: period === 'weekly' ? '#4F46E5' : '#888',
              fontWeight: '600'
            }}>{t('this_week')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        {/* Total Earnings */}
        <Card style={cardStyle}>
          <Card.Content>
            <Text style={{ fontSize: 14, color: '#888' }}>Total Earnings</Text>
            <Text style={{ fontSize: 34, fontWeight: '800', color: '#4F46E5' }}>₹{data.total}</Text>
            <Text style={{ fontSize: 14, color: '#888' }}>Balance: ₹{data.balance}</Text>
          </Card.Content>
        </Card>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          
          <Surface style={{
            flex: 1, margin: 5, padding: 16, borderRadius: 14,
            backgroundColor: isDark ? '#1b1b1b' : '#fafafa', alignItems: 'center'
          }}>
            <MaterialCommunityIcons name="bike" size={30} color="#4F46E5" />
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{data.orders}</Text>
            <Text style={{ fontSize: 12, color: '#888' }}>Orders</Text>
          </Surface>

          <Surface style={{
            flex: 1, margin: 5, padding: 16, borderRadius: 14,
            backgroundColor: isDark ? '#1b1b1b' : '#fafafa', alignItems: 'center'
          }}>
            <MaterialCommunityIcons name="clock-outline" size={30} color="#f97316" />
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{data.hours}</Text>
            <Text style={{ fontSize: 12, color: '#888' }}>Login Hrs</Text>
          </Surface>

          <Surface style={{
            flex: 1, margin: 5, padding: 16, borderRadius: 14,
            backgroundColor: isDark ? '#1b1b1b' : '#fafafa', alignItems: 'center'
          }}>
            <MaterialCommunityIcons name="map-marker" size={30} color="#a855f7" />
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{data.distance}</Text>
            <Text style={{ fontSize: 12, color: '#888' }}>Distance</Text>
          </Surface>

        </View>

        {/* Earnings Breakdown */}
        <Card style={cardStyle}>
          <Card.Content>
            {data.breakdown.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text>{item.label}</Text>
                <Text>₹{item.amount}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Trips */}
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Trips & Adjustments</Text>

        {data.trips.map((trip, index) => (
          <Card key={index} style={cardStyle}>
            <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontWeight: '700' }}>{trip.restaurant}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>{trip.time} • {trip.id}</Text>
              </View>

              <Text style={{
                color: trip.status === 'Bonus' ? '#f59e0b' : '#16a34a',
                fontWeight: '700'
              }}>
                + ₹{trip.amount}
              </Text>
            </Card.Content>
          </Card>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
