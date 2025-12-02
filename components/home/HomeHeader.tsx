import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Text, Surface, Badge } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotificationStore } from '../../store/notificationStore';

interface HomeHeaderProps {
  userLocation: string;
  onLocationPress: () => void;
  hasLocation?: boolean;
}

export default function HomeHeader({ userLocation, onLocationPress, hasLocation = false }: HomeHeaderProps) {
  const router = useRouter();
  const { unreadCount } = useNotificationStore();

  return (
    <Surface style={styles.header}>
      <View style={styles.headerContent}>
          {/* Location Section */}
          <Pressable 
            style={({ pressed }) => [
              styles.locationSection,
              pressed && styles.locationSectionPressed
            ]}
            onPress={() => {
              Alert.alert(
                'Update Location',
                'Get your precise location for accurate delivery and nearby restaurant suggestions.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Detect My Location', onPress: onLocationPress },
                  { text: 'Enter Manually', onPress: () => {
                    router.push('/profile/addresses?mode=select');
                  }}
                ]
              );
            }}
          >
            <View style={styles.locationIcon}>
              <MaterialIcons 
                name="location-on" 
                size={20} 
                color="#4F46E5" 
              />
              {hasLocation && (
                <View style={styles.locationIndicator} />
              )}
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.deliveryText}>Deliver to</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {userLocation}
              </Text>
            </View>
          </Pressable>

          {/* Header Actions */}
          <View style={styles.headerActions}>
            {/* Notifications Button */}
            <Pressable
              onPress={() => router.push('/notifications')}
              style={styles.notificationButton}
            >
              <MaterialIcons name="notifications" size={24} color="#4F46E5" />
              {unreadCount > 0 && (
                <Badge style={styles.notificationBadge} size={18}>
                  {unreadCount}
                </Badge>
              )}
            </Pressable>
          </View>
        </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  locationSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationSectionPressed: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  locationIcon: {
    marginRight: 8,
    position: 'relative',
  },
  locationIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1,
    borderColor: 'white',
  },
  locationInfo: {
    flex: 1,
    marginRight: 8,
  },
  deliveryText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },


  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#4F46E5',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 