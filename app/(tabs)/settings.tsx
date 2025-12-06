import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, Modal, FlatList, Switch, 
  StyleSheet, Animated 
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const router = useRouter();

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#F8F9FA',
      paddingHorizontal: 20,
      paddingTop: 40, // Updated for cleaner UI
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 25,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333333' : '#E0E0E0',
    },
    backButton: {
      marginRight: 15,
    },
    headerText: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#FFFFFF' : '#333333',
      flex: 1,
    },
    headerIcon: {
      marginLeft: 10,
    },
    section: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme === 'dark' ? '#CCCCCC' : '#666666',
      marginBottom: 15,
      letterSpacing: 0.5,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333333' : '#F0F0F0',
    },
    itemText: {
      flex: 1,
      fontSize: 16,
      color: theme === 'dark' ? '#FFFFFF' : '#333333',
      marginLeft: 15,
    },
    itemIcon: {
      color: '#007BFF',
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
      elevation: 8,
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
      backgroundColor: '#007BFF',
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('settings')}</Text>
        <Ionicons name="settings-outline" size={24} color="#007BFF" style={styles.headerIcon} />
      </View>

      {/* Language Section */}
      <Animated.View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('language').toUpperCase()}</Text>
        <TouchableOpacity style={styles.item} onPress={() => setModalVisible(true)}>
          <Ionicons name="language" size={20} style={styles.itemIcon} />
          <Text style={styles.itemText}>{t('language')}</Text>
          <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </Animated.View>

      {/* Theme Section */}
      <Animated.View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('theme').toUpperCase()}</Text>
        <View style={styles.item}>
          <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={20} style={styles.itemIcon} />
          <Text style={styles.itemText}>{t('theme')}</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#007BFF' }}
            thumbColor={theme === 'dark' ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </Animated.View>

      {/* Notifications */}
      <Animated.View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('notifications').toUpperCase()}</Text>

        <View style={styles.item}>
          <Ionicons name="notifications" size={20} style={styles.itemIcon} />
          <Text style={styles.itemText}>{t('push')}</Text>
          <Switch
            value={pushEnabled}
            onValueChange={handlePushToggle}
            trackColor={{ false: '#767577', true: '#007BFF' }}
            thumbColor={pushEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.item}>
          <Ionicons name="mail" size={20} style={styles.itemIcon} />
          <Text style={styles.itemText}>{t('email')}</Text>
          <Switch
            value={emailEnabled}
            onValueChange={handleEmailToggle}
            trackColor={{ false: '#767577', true: '#007BFF' }}
            thumbColor={emailEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </Animated.View>

      {/* Language Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{t('selectLang')}</Text>

            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.langItem} 
                  onPress={() => selectLanguage(item.code)}
                >
                  <Text style={styles.langText}>{item.name}</Text>
                  <Ionicons
                    name={language === item.code ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color="#007BFF"
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
