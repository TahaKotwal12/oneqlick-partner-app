import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotificationStore, Notification } from '../store/notificationStore';

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead: markAllAsReadAction,
    getUnreadCount 
  } = useNotificationStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when notifications change
  useEffect(() => {
    // Ensure notifications is a valid array
    if (Array.isArray(notifications)) {
      setForceUpdate(prev => prev + 1);
    }
  }, [notifications]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
      setForceUpdate(prev => prev + 1); // Force re-render
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const handleMarkAllAsRead = () => {
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark All Read',
          onPress: () => {
            markAllAsReadAction();
            // Force re-render after a small delay to ensure state is updated
            setTimeout(() => {
              setForceUpdate(prev => prev + 1);
            }, 100);
          }
        }
      ]
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'truck-delivery';
      case 'offer':
        return 'sale';
      case 'promotion':
        return 'gift';
      case 'restaurant':
        return 'storefront';
      case 'system':
        return 'information';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return '#4CAF50';
      case 'offer':
        return '#FF9800';
      case 'promotion':
        return '#2196F3';
      case 'restaurant':
        return '#9C27B0';
      case 'system':
        return '#607D8B';
      default:
        return '#666';
    }
  };

  const getNotificationTypeText = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'Order Update';
      case 'offer':
        return 'Special Offer';
      case 'promotion':
        return 'Promotion';
      case 'restaurant':
        return 'New Restaurant';
      case 'system':
        return 'System Update';
      default:
        return 'Notification';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#FF5722';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const getFilteredNotifications = () => {
    if (!notifications || notifications.length === 0) {
      return [];
    }
    switch (selectedFilter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      // case 'order':
        // return notifications.filter(n => n.type === 'order');
      // case 'offer':
        // return notifications.filter(n => n.type === 'offer');
      default:
        return notifications;
    }
  };

  const renderFilterButton = (filter: typeof selectedFilter, label: string, icon: string) => (
    <Pressable
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <MaterialCommunityIcons 
        name={icon as any} 
        size={16} 
        color={selectedFilter === filter ? '#fff' : '#666'} 
      />
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </Pressable>
  );

  const renderNotification = (notification: Notification) => {
    // Defensive check to ensure notification has required properties
    if (!notification || !notification.id || !notification.title) {
      return null;
    }
    
    return (
    <Pressable
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadCard
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      {/* Priority Indicator */}
      {notification.priority && (
        <View style={[
          styles.priorityIndicator,
          { backgroundColor: getPriorityColor(notification.priority) }
        ]} />
      )}

      {/* Main Content */}
      <View style={styles.cardContent}>
        {/* Icon */}
        <View style={[
          styles.iconContainer,
          { backgroundColor: getNotificationColor(notification.type) + '20' }
        ]}>
          <MaterialCommunityIcons
            name={getNotificationIcon(notification.type) as any}
              size={24}
              color={getNotificationColor(notification.type)}
            />
          </View>
          
        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Header Row */}
          <View style={styles.headerRow}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {notification.title}
              </Text>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </View>
          
          {/* Type Badge */}
          <View style={[
            styles.typeBadge,
                  { backgroundColor: getNotificationColor(notification.type) }
          ]}>
            <Text style={styles.typeText}>
                {getNotificationTypeText(notification.type)}
            </Text>
            </View>
            
          {/* Message */}
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
            
          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            <Text style={styles.timestamp}>
              {notification.timestamp}
            </Text>
            {notification.actionUrl && (
              <View style={styles.actionHint}>
                <Text style={styles.actionText}>Tap to view</Text>
                <MaterialCommunityIcons name="chevron-right" size={14} color="#4F46E5" />
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
    );
  };

  // Make filteredNotifications reactive to store changes
  const filteredNotifications = useMemo(() => {
    const filtered = getFilteredNotifications();
    // Ensure we return a valid array
    return Array.isArray(filtered) ? filtered : [];
  }, [notifications, selectedFilter, forceUpdate]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable 
            style={styles.backButton}
          onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1a1a1a" />
          </Pressable>
          <View>
        <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.unreadCountText}>
                {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <Pressable style={styles.markAllButton} onPress={handleMarkAllAsRead}>
              <MaterialCommunityIcons name="check-all" size={18} color="#4F46E5" />
              <Text style={styles.markAllText}>Mark all read</Text>
            </Pressable>
          )}
        </View>
      </View>
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {renderFilterButton('all', 'All', 'view-list')}
          {renderFilterButton('unread', 'Unread', 'bell-ring')}
          {/* {renderFilterButton('order', 'Orders', 'truck-delivery')} */}
          {/* {renderFilterButton('offer', 'Offers', 'sale')} */}
        </ScrollView>
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotifications.length > 0 ? (
          <View style={styles.notificationsList}>
            {filteredNotifications.map(renderNotification)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="bell-sleep" size={48} color="#ccc" />
            </View>
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'all' ? 'No Notifications' : `No ${selectedFilter} notifications`}
            </Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'all' 
                ? "You're all caught up! Check back later for new updates."
                : `No ${selectedFilter} notifications found. Try a different filter.`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  unreadCountText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  markAllText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterButton: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  notificationsList: {
    padding: 16,
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
    overflow: 'hidden',
  },
  unreadCard: {
    backgroundColor: '#FAFBFC',
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    lineHeight: 22,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginLeft: 8,
    marginTop: 6,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  actionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

