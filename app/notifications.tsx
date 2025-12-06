// oneQlick/app/notifications.tsx (Notifications Center - Task 12)

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import AppHeader from '../components/common/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';

// --- Mock Data ---
interface Notification {
    id: string;
    type: 'order' | 'system' | 'alert';
    title: string;
    message: string;
    time: string;
    is_read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', type: 'order', title: 'New Order Received', message: 'Order #RO-155 is waiting for your acceptance.', time: '5m ago', is_read: false },
    { id: 'n2', type: 'alert', title: 'Low Inventory Warning', message: 'Butter Chicken stock is running low.', time: '2h ago', is_read: false },
    { id: 'n3', type: 'system', title: 'Update Available', message: 'New app features are available. Please update.', time: '1d ago', is_read: true },
    { id: 'n4', type: 'order', title: 'Pickup Confirmed', message: 'Driver Alex has picked up Order #RO-142.', time: '2d ago', is_read: true },
];

// --- Helper Components ---

const NotificationItem = ({ item, onPress }: { item: Notification, onPress: (notification: Notification) => void }) => {
    const iconMap = {
        order: 'shopping-cart',
        system: 'settings',
        alert: 'warning',
    };
    const iconColor = item.is_read ? '#ccc' : '#4F46E5';

    return (
        <TouchableOpacity 
            style={[styles.notificationItem, item.is_read && styles.readItem]}
            onPress={() => onPress(item)}
        >
            <MaterialIcons name={iconMap[item.type] as 'shopping-cart'} size={24} color={iconColor} style={styles.itemIcon} />
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMessage} numberOfLines={1}>{item.message}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            {!item.is_read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
};

// --- Main Component ---
export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

    // Checklist: Tap opens modal
    const handleNotificationPress = (notification: Notification) => {
        // Mark notification as read (locally)
        setNotifications(prev => prev.map(n => 
            n.id === notification.id ? { ...n, is_read: true } : n
        ));
        
        setSelectedNotification(notification);
        setModalVisible(true);
    };
    
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedNotification(null);
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Notifications" showBack={true} />
            
            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Unread ({notifications.filter(n => !n.is_read).length})</Text>
                
                {notifications.map(notification => (
                    <NotificationItem 
                        key={notification.id} 
                        item={notification} 
                        onPress={handleNotificationPress} 
                    />
                ))}

                {notifications.length === 0 && (
                    <Text style={styles.emptyText}>No new notifications.</Text>
                )}
            </ScrollView>

            {/* Notification Detail Modal */}
            {selectedNotification && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                            <Text style={styles.modalBody}>{selectedNotification.message}</Text>
                            <Text style={styles.modalTime}>{selectedNotification.time}</Text>
                            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    
    // Item Styles
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#4F46E5',
    },
    readItem: {
        borderLeftColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    itemIcon: {
        marginRight: 15,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemMessage: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
    itemTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#F44336',
        marginLeft: 10,
    },

    // Empty State
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 50,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#4F46E5',
    },
    modalBody: {
        fontSize: 16,
        marginBottom: 20,
        color: '#333',
    },
    modalTime: {
        fontSize: 12,
        color: '#999',
        marginBottom: 15,
    },
    closeButton: {
        backgroundColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        alignSelf: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});