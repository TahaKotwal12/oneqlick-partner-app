import React, { useEffect, useMemo, useState } from 'react';
import { View, Text as RNText, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../components/common/AppHeader';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useRestaurantOrderStore } from '../store/restaurantOrderStore';

const DetailRow = ({
  icon,
  label,
  value,
  styles,
}: {
  icon: string;
  label: string;
  value: string;
  styles: any;
}) => (
  <View style={styles.detailRow}>
    <MaterialIcons name={icon as any} size={20} color="#007AFF" style={{ marginRight: 10 }} />
    <RNText style={styles.detailLabel}>{label}: </RNText>
    <RNText style={styles.detailValue}>{value}</RNText>
  </View>
);

export default function RestaurantOrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

  const { theme } = useTheme();
  const { t } = useLanguage();

  const { selectedOrder, fetchOrderDetails, isLoading, error } = useRestaurantOrderStore();

  const [localNotes, setLocalNotes] = useState('');
  const notesKey = useMemo(() => (orderId ? `restaurant_order_notes_${orderId}` : null), [orderId]);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderDetails(orderId);
  }, [orderId, fetchOrderDetails]);

  useEffect(() => {
    (async () => {
      if (!notesKey) return;
      const saved = await AsyncStorage.getItem(notesKey);
      if (saved !== null) setLocalNotes(saved);
    })();
  }, [notesKey]);

  const handleSaveNotes = async () => {
    if (!notesKey) return;
    await AsyncStorage.setItem(notesKey, localNotes);
    Alert.alert(t('notes_saved'), t('internal_notes_saved'));
  };

  const isDark = theme === 'dark';

  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? '#121212' : '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    content: { padding: 15 },
    card: {
      backgroundColor: isDark ? '#1E1E1E' : '#fff',
      borderRadius: 8,
      padding: 15,
      marginBottom: 15,
      elevation: 2,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? '#333' : 'transparent',
    },
    notesCard: { padding: 0 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#BB86FC' : '#333',
      marginBottom: 10,
      marginTop: 5,
    },
    statusBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#333300' : '#fffbe6',
      padding: 10,
      borderRadius: 8,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: isDark ? '#555500' : '#ffecb3',
    },
    statusTitle: { fontSize: 14, color: isDark ? '#CCC' : '#333' },
    statusValue: { fontSize: 16, fontWeight: 'bold', color: '#ff9800' },
    detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
    detailLabel: { fontSize: 15, fontWeight: '600', color: isDark ? '#FFFFFF' : '#333' },
    detailValue: { fontSize: 15, color: isDark ? '#BBB' : '#666', flex: 1 },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#292929' : '#fafafa',
      gap: 12,
    },
    itemQty: { fontWeight: 'bold', width: 30, color: '#007AFF' },
    itemName: { flex: 1, color: isDark ? '#FFFFFF' : '#333' },
    notesInput: {
      minHeight: 120,
      fontSize: 15,
      padding: 15,
      textAlignVertical: 'top',
      color: isDark ? '#FFFFFF' : '#333',
      backgroundColor: isDark ? '#1E1E1E' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#eee',
    },
    noteActionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 8,
    },
    saveHint: {
      fontSize: 12,
      color: isDark ? '#777' : '#999',
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
    },
    notesLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-end',
      marginTop: 8,
    },
    notesLinkText: {
      color: '#4F46E5',
      fontWeight: '700',
    },
  });

  if (!orderId) {
    return (
      <View style={dynamicStyles.container}>
        <AppHeader title={t('order_details')} showBack />
        <View style={dynamicStyles.loadingContainer}>
          <RNText style={{ color: isDark ? '#FFF' : '#333' }}>{t('error_no_order_id')}</RNText>
        </View>
      </View>
    );
  }

  if (isLoading && !selectedOrder) {
    return (
      <View style={dynamicStyles.container}>
        <AppHeader title={t('order_details')} showBack />
        <View style={dynamicStyles.loadingContainer}>
          <RNText style={{ color: isDark ? '#FFF' : '#333' }}>{t('loading_order_details')}...</RNText>
        </View>
      </View>
    );
  }

  if (!selectedOrder) {
    return (
      <View style={dynamicStyles.container}>
        <AppHeader title={t('order_details')} showBack />
        <View style={dynamicStyles.loadingContainer}>
          <RNText style={{ color: isDark ? '#FFF' : '#333' }}>
            {error || t('error_order_not_found')}
          </RNText>
        </View>
      </View>
    );
  }

  const order = selectedOrder;
  const displayStatus = order.order_status ? t(String(order.order_status).toLowerCase()) : t('unknown');
  const customerName = order.customer
    ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
    : t('customer');

  return (
    <View style={dynamicStyles.container}>
      <AppHeader title={`${t('order_hash')}${order.order_number || order.order_id}`} showBack />

      <ScrollView style={dynamicStyles.content}>
        <View style={dynamicStyles.statusBox}>
          <RNText style={dynamicStyles.statusTitle}>{t('current_status')}:</RNText>
          <RNText style={dynamicStyles.statusValue}>{displayStatus}</RNText>
        </View>

        <RNText style={dynamicStyles.sectionTitle}>{t('customer_order_summary')}</RNText>
        <View style={dynamicStyles.card}>
          <DetailRow icon="person" label={t('customer')} value={customerName} styles={dynamicStyles} />
          <DetailRow icon="call" label={t('phone')} value={order.customer?.phone || '—'} styles={dynamicStyles} />
          <DetailRow
            icon="access-time"
            label={t('pickup_time')}
            value={
              order.estimated_delivery_time
                ? new Date(order.estimated_delivery_time).toLocaleTimeString()
                : '—'
            }
            styles={dynamicStyles}
          />
          <DetailRow
            icon="payment"
            label={t('order_total')}
            value={`₹${Number(order.total_amount || 0).toFixed(2)}`}
            styles={dynamicStyles}
          />
        </View>

        <RNText style={dynamicStyles.sectionTitle}>{t('order_items')}</RNText>
        <View style={dynamicStyles.card}>
          {(order.items || []).map((item: any, idx: number) => (
            <View key={item.order_item_id || `${item.food_item_id || 'item'}_${idx}`} style={dynamicStyles.itemRow}>
              <RNText style={dynamicStyles.itemQty}>{item.quantity || 0}x</RNText>
              <RNText style={dynamicStyles.itemName}>{item.food_item_name || item.name || t('item')}</RNText>
              <RNText style={{ color: isDark ? '#AAA' : '#666' }}>
                ₹{Number(item.total_price || 0).toFixed(0)}
              </RNText>
            </View>
          ))}
        </View>

        <RNText style={dynamicStyles.sectionTitle}>{t('internal_notes')}</RNText>
        <View style={[dynamicStyles.card, dynamicStyles.notesCard]}>
          <TextInput
            style={dynamicStyles.notesInput}
            multiline
            placeholder={t('notes_placeholder')}
            value={localNotes}
            onChangeText={setLocalNotes}
            onBlur={handleSaveNotes}
            placeholderTextColor={isDark ? '#999' : '#aaa'}
          />
          <View style={dynamicStyles.noteActionRow}>
            <RNText style={dynamicStyles.saveHint}>{t('notes_save_hint')}</RNText>
            <TouchableOpacity style={dynamicStyles.saveButton} onPress={handleSaveNotes}>
              <RNText style={dynamicStyles.saveButtonText}>{t('save')}</RNText>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={dynamicStyles.notesLink}
          onPress={() => router.push({ pathname: '/order-notes', params: { orderId } })}
        >
          <MaterialIcons name="chat" size={18} color="#4F46E5" />
          <RNText style={dynamicStyles.notesLinkText}>{t('notes')}</RNText>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}