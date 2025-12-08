// oneQlick/app/notifications.tsx (I18N and THEME-AWARE)

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import AppHeader from '../components/common/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext'; 
import { useLanguage } from '../contexts/LanguageContext'; 

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

const NotificationItem = ({ item, onPress, styles }: { item: Notification, onPress: (notification: Notification) => void, styles: any }) => {
    const iconMap = {
        order: 'shopping-cart',
        system: 'settings',
        alert: 'warning',
    };

    const iconColor = item.is_read ? styles.readIconColor.color : '#4F46E5';

    return (
        <TouchableOpacity 
            style={[styles.notificationItem, item.is_read && styles.readItem]}
            onPress={() => onPress(item)}
        >
            <MaterialIcons 
                name={iconMap[item.type] as keyof typeof MaterialIcons.glyphMap} 
                size={24} 
                color={iconColor} 
                style={styles.itemIcon} 
            />
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMessage} numberOfLines={1}>{item.message}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            {!item.is_read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
};

export default function NotificationsScreen() {
    const { theme } = useTheme();
    const { t } = useLanguage(); 
    
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

    const handleNotificationPress = (notification: Notification) => {
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

    const dynamicStyles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5' },
        content: { padding: 15 },
        sectionTitle: { 
            fontSize: 18, 
            fontWeight: 'bold', 
            marginBottom: 15, 
            color: theme === 'dark' ? '#BB86FC' : '#333' 
        },
        
        notificationItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: '#4F46E5',
            borderWidth: theme === 'dark' ? 1 : 0,
            borderColor: theme === 'dark' ? '#333' : 'transparent',
        },
        readItem: {
            borderLeftColor: theme === 'dark' ? '#555' : '#ccc',
            backgroundColor: theme === 'dark' ? '#1A1A1A' : '#f9f9f9',
        },
        readIconColor: { color: theme === 'dark' ? '#888' : '#ccc' },
        itemIcon: { marginRight: 15 },
        itemContent: { flex: 1 },
        itemTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme === 'dark' ? '#FFFFFF' : '#333',
        },
        itemMessage: {
            fontSize: 14,
            color: theme === 'dark' ? '#BBB' : '#555',
            marginTop: 2,
        },
        itemTime: {
            fontSize: 12,
            color: theme === 'dark' ? '#777' : '#999',
            marginTop: 4,
        },
        unreadDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#F44336',
            marginLeft: 10,
        },

        emptyText: {
            textAlign: 'center',
            color: theme === 'dark' ? '#777' : '#999',
            marginTop: 50,
        },

        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        },
        modalView: {
            width: '80%',
            backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white',
            borderRadius: 20,
            padding: 35,
            alignItems: 'flex-start',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4, 
            shadowRadius: 4,
            elevation: 10,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 15,
            color: theme === 'dark' ? '#BB86FC' : '#4F46E5',
        },
        modalBody: {
            fontSize: 16,
            marginBottom: 20,
            color: theme === 'dark' ? '#FFFFFF' : '#333',
        },
        modalTime: {
            fontSize: 12,
            color: theme === 'dark' ? '#777' : '#999',
            marginBottom: 15,
        },
        closeButton: {
            backgroundColor: theme === 'dark' ? '#444' : '#ccc',
            borderRadius: 10,
            padding: 10,
            elevation: 2,
            alignSelf: 'center',
            marginTop: 10,
        },
        closeButtonText: {
            color: theme === 'dark' ? '#DDD' : 'white',
            fontWeight: 'bold',
        },
    });

    return (
        <View style={dynamicStyles.container}>
            <AppHeader title={t("notifications")} showBack={true} /> 
            
            <ScrollView style={dynamicStyles.content}>
                <Text style={dynamicStyles.sectionTitle}>{t('unread')} ({notifications.filter(n => !n.is_read).length})</Text> 
                
                {notifications.map(notification => (
                    <NotificationItem 
                        key={notification.id} 
                        item={notification} 
                        onPress={handleNotificationPress} 
                        styles={dynamicStyles} 
                    />
                ))}

                {notifications.length === 0 && (
                    <Text style={dynamicStyles.emptyText}>{t('no_new_notifications')}</Text> 
                )}
            </ScrollView>

            {selectedNotification && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <Pressable style={dynamicStyles.modalOverlay} onPress={handleCloseModal}>
                        <View style={dynamicStyles.modalView}>
                            <Text style={dynamicStyles.modalTitle}>{selectedNotification.title}</Text>
                            <Text style={dynamicStyles.modalBody}>{selectedNotification.message}</Text>
                            <Text style={dynamicStyles.modalTime}>{selectedNotification.time}</Text>
                            <TouchableOpacity onPress={handleCloseModal} style={dynamicStyles.closeButton}>
                                <Text style={dynamicStyles.closeButtonText}>{t('close')}</Text> 
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>  
            )}
        </View>
    );
}
