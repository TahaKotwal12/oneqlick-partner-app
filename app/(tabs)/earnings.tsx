import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDeliveryOrderStore } from '../../store/deliveryOrderStore';

export default function EarningsScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const { earnings, isLoading, fetchEarnings } = useDeliveryOrderStore();
  const [period, setPeriod] = useState<'today' | 'week'>('today');

  const apiPeriod = useMemo(() => (period === 'today' ? 'today' : 'week'), [period]);

  useEffect(() => {
    fetchEarnings(apiPeriod);
  }, [apiPeriod, fetchEarnings]);

  const onRefresh = async () => {
    await fetchEarnings(apiPeriod);
  };

  const colors = {
    bg: isDark ? '#0F0F0F' : '#F8FAFC',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1E293B',
    subtext: isDark ? '#94A3B8' : '#64748B',
    primary: '#4F46E5',
    success: '#10B981',
  };

  const totalEarnings = Number(earnings?.total_earnings || 0);
  const completed = Number(earnings?.completed_deliveries || 0);
  const avg = Number(earnings?.avg_per_delivery || 0);
  const distance = Number(earnings?.total_distance_km || 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('earnings') || 'Earnings'}
        </Text>

        <View style={styles.pillContainer}>
          <TouchableOpacity
            onPress={() => setPeriod('today')}
            style={[styles.pill, period === 'today' && styles.pillActive]}
          >
            <Text style={[styles.pillText, { color: period === 'today' ? '#FFF' : colors.subtext }]}>
              {t('today') || 'Today'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPeriod('week')}
            style={[styles.pill, period === 'week' && styles.pillActive]}
          >
            <Text style={[styles.pillText, { color: period === 'week' ? '#FFF' : colors.subtext }]}>
              {t('week') || 'Week'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={!!isLoading} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <Surface style={[styles.mainCard, { backgroundColor: colors.primary }]} elevation={3}>
          <Text style={styles.mainCardLabel}>{(t('total_earnings') || 'Total earnings').toUpperCase()}</Text>
          <Text style={styles.mainCardAmount}>₹{totalEarnings.toFixed(0)}</Text>
          <View style={styles.mainCardRow}>
            <View style={styles.mainCardStat}>
              <Text style={styles.mainCardStatLabel}>{t('completed') || 'Completed'}</Text>
              <Text style={styles.mainCardStatValue}>{completed}</Text>
            </View>
            <View style={styles.mainCardStat}>
              <Text style={styles.mainCardStatLabel}>{t('avg_per_delivery') || 'Avg / delivery'}</Text>
              <Text style={styles.mainCardStatValue}>₹{avg.toFixed(0)}</Text>
            </View>
            <View style={styles.mainCardStat}>
              <Text style={styles.mainCardStatLabel}>{t('distance') || 'Distance'}</Text>
              <Text style={styles.mainCardStatValue}>{distance.toFixed(1)} km</Text>
            </View>
          </View>
        </Surface>

        <Surface style={[styles.tipCard, { backgroundColor: colors.card }]} elevation={1}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <MaterialCommunityIcons name="information-outline" size={18} color={colors.success} />
            <Text style={{ color: colors.subtext }}>
              {t('earnings_note') || 'Earnings are calculated from delivered orders (delivery fee).'}
            </Text>
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  pillContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    fontWeight: '800',
  },
  mainCard: {
    borderRadius: 18,
    padding: 16,
  },
  mainCardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  mainCardAmount: {
    color: 'white',
    fontSize: 40,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 10,
  },
  mainCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  mainCardStat: {
    flex: 1,
  },
  mainCardStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  mainCardStatValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
  },
  tipCard: {
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
  },
});
