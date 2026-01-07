import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList, Switch,
  StyleSheet, ScrollView, Alert, Image
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuthZustand';
import { useRestaurantProfileStore } from '../../store/restaurantProfileStore';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
];

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { profile: restaurantProfile } = useRestaurantProfileStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const router = useRouter();

  const isRestaurantOwner = user?.role === 'restaurant_owner';

  // Load notification preferences
  useEffect(() => {
    const loadPrefs = async () => {
      const push = await AsyncStorage.getItem('pushNotifications');
      const email = await AsyncStorage.getItem('emailAlerts');
      setPushEnabled(push === 'true');
      setEmailEnabled(email === 'true');
    };
    loadPrefs();
  }, []);

  const handlePushToggle = async (value: boolean) => {
    setPushEnabled(value);
    await AsyncStorage.setItem('pushNotifications', value.toString());
  };

  const handleEmailToggle = async (value: boolean) => {
    setEmailEnabled(value);
    await AsyncStorage.setItem('emailAlerts', value.toString());
  };

  const selectLanguage = (lang: string) => {
    setLanguage(lang as any);
    setModalVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const userName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : restaurantProfile?.name || user?.email || 'User';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#F8F9FA',
    },
    header: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      paddingTop: 50,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333' : '#E0E0E0',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#FFFFFF' : '#333333',
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme === 'dark' ? '#AAA' : '#666',
    },
    profileSection: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      padding: 20,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#4F46E5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    profileInitial: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFF',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontWeight: '600',
      color: theme === 'dark' ? '#FFFFFF' : '#333',
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      color: theme === 'dark' ? '#AAA' : '#666',
      marginBottom: 2,
    },
    profileRole: {
      fontSize: 12,
      color: '#4F46E5',
      fontWeight: '500',
    },
    editButton: {
      padding: 8,
    },
    section: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme === 'dark' ? '#888' : '#666',
      paddingHorizontal: 20,
      paddingTop: 15,
      paddingBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#2A2A2A' : '#F0F0F0',
    },
    itemIcon: {
      width: 24,
      marginRight: 15,
    },
    itemText: {
      flex: 1,
      fontSize: 16,
      color: theme === 'dark' ? '#FFFFFF' : '#333333',
    },
    itemValue: {
      fontSize: 14,
      color: theme === 'dark' ? '#888' : '#666',
      marginRight: 8,
    },
    logoutButton: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      marginTop: 20,
      marginBottom: 40,
    },
    logoutItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
    logoutText: {
      flex: 1,
      fontSize: 16,
      color: '#EF4444',
      fontWeight: '500',
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      padding: 25,
      borderRadius: 16,
      width: '85%',
      maxHeight: '70%',
    },
    modalHeader: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#FFFFFF' : '#333333',
      marginBottom: 20,
      textAlign: 'center',
    },
    langItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333333' : '#F0F0F0',
    },
    langText: {
      fontSize: 16,
      color: theme === 'dark' ? '#FFFFFF' : '#333333',
    },
    closeButton: {
      marginTop: 20,
      paddingVertical: 12,
      backgroundColor: '#4F46E5',
      borderRadius: 8,
      alignItems: 'center',
    },
    closeText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Text style={styles.profileRole}>
              {isRestaurantOwner ? '🍽️ Restaurant Partner' : '🚴 Delivery Partner'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile')}>
            <MaterialIcons name="edit" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Restaurant Settings (Only for Restaurant Owners) */}
        {isRestaurantOwner && (
          <>
            <Text style={styles.sectionTitle}>Restaurant</Text>
            <View style={styles.section}>
              <TouchableOpacity style={styles.item} onPress={() => router.push('/restaurant/settings')}>
                <MaterialIcons name="restaurant" size={24} color="#FF6B35" style={styles.itemIcon} />
                <Text style={styles.itemText}>Restaurant Details</Text>
                <MaterialIcons name="chevron-right" size={24} color={theme === 'dark' ? '#666' : '#CCC'} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.item} onPress={() => router.push('/menu')}>
                <MaterialIcons name="restaurant-menu" size={24} color="#10B981" style={styles.itemIcon} />
                <Text style={styles.itemText}>Menu Management</Text>
                <MaterialIcons name="chevron-right" size={24} color={theme === 'dark' ? '#666' : '#CCC'} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.item}>
                <MaterialIcons name="schedule" size={24} color="#F59E0B" style={styles.itemIcon} />
                <Text style={styles.itemText}>Operating Hours</Text>
                <MaterialIcons name="chevron-right" size={24} color={theme === 'dark' ? '#666' : '#CCC'} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* App Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.item} onPress={() => setModalVisible(true)}>
            <MaterialIcons name="language" size={24} color="#6366F1" style={styles.itemIcon} />
            <Text style={styles.itemText}>Language</Text>
            <Text style={styles.itemValue}>
              {languages.find(l => l.code === language)?.name || 'English'}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={theme === 'dark' ? '#666' : '#CCC'} />
          </TouchableOpacity>

          <View style={styles.item}>
            <MaterialIcons name={theme === 'dark' ? 'dark-mode' : 'light-mode'} size={24} color="#8B5CF6" style={styles.itemIcon} />
            <Text style={styles.itemText}>Dark Mode</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
              thumbColor={theme === 'dark' ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.section}>
          <View style={styles.item}>
            <MaterialIcons name="notifications-active" size={24} color="#EF4444" style={styles.itemIcon} />
            <Text style={styles.itemText}>Push Notifications</Text>
            <Switch
              value={pushEnabled}
              onValueChange={handlePushToggle}
              trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
              thumbColor={pushEnabled ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>

          <View style={styles.item}>
            <MaterialIcons name="email" size={24} color="#3B82F6" style={styles.itemIcon} />
            <Text style={styles.itemText}>Email Alerts</Text>
            <Switch
              value={emailEnabled}
              onValueChange={handleEmailToggle}
              trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
              thumbColor={emailEnabled ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Support & Legal */}
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.item}>
            <MaterialIcons name="help-outline" size={24} color="#10B981" style={styles.itemIcon} />
            <Text style={styles.itemText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme === 'dark' ? '#666' : '#CCC'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <MaterialIcons name="description" size={24} color="#F59E0B" style={styles.itemIcon} />
            <Text style={styles.itemText}>Terms & Conditions</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme === 'dark' ? '#666' : '#CCC'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <MaterialIcons name="privacy-tip" size={24} color="#8B5CF6" style={styles.itemIcon} />
            <Text style={styles.itemText}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color={theme === 'dark' ? '#666' : '#CCC'} />
          </TouchableOpacity>

          <View style={[styles.item, { borderBottomWidth: 0 }]}>
            <MaterialIcons name="info-outline" size={24} color="#6B7280" style={styles.itemIcon} />
            <Text style={styles.itemText}>App Version</Text>
            <Text style={styles.itemValue}>1.0.0</Text>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutButton}>
          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#EF4444" style={styles.itemIcon} />
            <Text style={styles.logoutText}>Logout</Text>
            <MaterialIcons name="chevron-right" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Language</Text>

            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.langItem}
                  onPress={() => selectLanguage(item.code)}
                >
                  <Text style={styles.langText}>{item.name}</Text>
                  <MaterialIcons
                    name={language === item.code ? "check-circle" : "radio-button-unchecked"}
                    size={22}
                    color="#4F46E5"
                  />
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}
