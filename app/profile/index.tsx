import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Share,
  BackHandler,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  Switch,
  Chip,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import {
  userProfile,
  profileSections,
} from './profileData';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user, isLoading } = useAuthStore();

  // State management
  const [locationServices, setLocationServices] = useState(true);
  const [appNotifications, setAppNotifications] = useState(false);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      // Navigate to home tab from profile screen
      router.push('/(tabs)');
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [router]);


  const handleSectionPress = (section: any) => {
    switch (section.type) {
      case 'navigation':
        if (section.route) {
          // Handle different routes
          if (section.route === '/profile/addresses') {
            router.push('/profile/addresses');
          } else if (section.route === '/profile/favorites') {
            router.push('/(tabs)');
          } else {
            // Default navigation
            router.push(section.route);
          }
        }
        break;

      case 'action':
        if (section.id === 'rate-app') {
          handleRateApp();
        } else if (section.id === 'share-app') {
          handleShareApp();
        }
        break;

    }
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate App',
      'Would you like to rate oneQlick on the app store?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Rate Now',
          onPress: () => {
            // App store rating feature - placeholder implementation
            Alert.alert('Thank You!', 'Rating feature coming soon!');
          }
        },
      ]
    );
  };

  const handleShareApp = () => {
    Share.share({
      message: 'Check out oneQlick - the best food delivery app! Download now.',
      title: 'oneQlick Food Delivery',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout().then(() => {
              // Navigate to login screen after successful logout
              router.replace('/(auth)/login');
            }).catch((error) => {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            });
          }
        },
      ]
    );
  };

  const renderProfileHeader = () => {
    // Use actual user data or fallback to static data
    const displayUser = user || userProfile;
    const userName = 'first_name' in displayUser && 'last_name' in displayUser && displayUser.first_name && displayUser.last_name
      ? `${displayUser.first_name} ${displayUser.last_name}`
      : 'name' in displayUser ? displayUser.name : 'User';

    // Get first letter of user's name for avatar
    const userInitial = userName.charAt(0).toUpperCase();

    return (
      <View style={styles.profileHeader}>
        {/* User info - Zomato style design */}
        <View style={styles.userInfo}>
          {/* Circular Avatar with Initial */}
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>{userInitial}</Text>
          </View>

          {/* User Details */}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{displayUser.email || 'No email'}</Text>
            <Text style={styles.userPhone}>{displayUser.phone || 'No phone'}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProfileSection = (section: any) => (
    <Pressable
      key={section.id}
      style={styles.sectionItem}
      onPress={() => handleSectionPress(section)}
    >
      <Surface style={styles.sectionSurface}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <MaterialIcons name={section.icon} size={24} color="#6B7280" />
          </View>

          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.subtitle && (
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
            )}
            {section.description && (
              <Text style={styles.sectionDescription}>{section.description}</Text>
            )}
          </View>

          <View style={styles.sectionActions}>
            {section.badge && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.badgeChip} compact>
                {section.badge}
              </Chip>
            )}

            {section.type === 'toggle' && (
              <Switch
                value={section.value as boolean}
                onValueChange={(value) => {
                  // Handle toggle changes
                  switch (section.id) {
                    case 'app-notifications':
                      setAppNotifications(value);
                      break;
                    case 'location-services':
                      setLocationServices(value);
                      break;
                  }
                }}
                color="#4F46E5"
              />
            )}

            {section.type === 'select' && (
              <Text style={styles.selectValue}>{section.value}</Text>
            )}

            {(section.type === 'navigation' || section.type === 'action') && (
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            )}
          </View>
        </View>
      </Surface>
    </Pressable>
  );

  const renderAppInfo = () => (
    <View style={styles.appInfo}>
      <Text style={styles.appInfoText}>App Version 1.0.0</Text>
      <Text style={styles.appInfoText}>© 2024 oneQlick. All rights reserved.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        {renderProfileHeader()}

        {/* Profile Sections */}
        <View style={styles.content}>
          {/* My Account Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>My Account</Text>
            {profileSections
              .filter(section => ['personal-info', 'saved-addresses'].includes(section.id))
              .map(renderProfileSection)}
          </View>

          {/* Orders & History Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Orders & History</Text>
            {profileSections
              .filter(section => ['order-history'].includes(section.id))
              .map(renderProfileSection)}
          </View>

          {/* Notifications Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Notifications</Text>
            {profileSections
              .filter(section => ['app-notifications'].includes(section.id))
              .map(renderProfileSection)}
          </View>

          {/* Support Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Support</Text>
            {profileSections
              .filter(section => ['contact-us', 'rate-app'].includes(section.id))
              .map(renderProfileSection)}
          </View>

          {/* Settings Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Settings</Text>
            {profileSections
              .filter(section => ['location-services'].includes(section.id))
              .map(renderProfileSection)}
          </View>

          {/* App Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>App</Text>
            <Pressable
              style={styles.sectionItem}
              onPress={handleShareApp}
            >
              <Surface style={styles.sectionSurface}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIcon}>
                    <MaterialIcons name="share" size={24} color="#6B7280" />
                  </View>

                  <View style={styles.sectionContent}>
                    <Text style={styles.sectionTitle}>Share App</Text>
                    <Text style={styles.sectionSubtitle}>Share oneQlick with friends & family</Text>
                  </View>

                  <View style={styles.sectionActions}>
                    <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                  </View>
                </View>
              </Surface>
            </Pressable>
          </View>

          {/* App Info */}
          {renderAppInfo()}

          {/* Logout Button */}
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="logout"
            style={styles.logoutButton}
            textColor="#EF4444"
            buttonColor="transparent"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },

  // Profile Header Styles - Zomato Style Design
  profileHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
    elevation: 1,
    borderRadius: 0,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
  },

  content: {
    padding: 20,
    paddingTop: 0,
  },
  sectionGroup: {
    marginBottom: 20,
  },
  sectionGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  sectionItem: {
    marginBottom: 10,
  },
  sectionSurface: {
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 10,
  },
  sectionIcon: {
    width: 40,
    alignItems: 'center',
  },
  sectionContent: {
    flex: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  badgeChip: {
    backgroundColor: '#4F46E5',
  },
  selectValue: {
    fontSize: 14,
    color: '#6B7280',
  },

  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  logoutButton: {
    borderColor: '#EF4444',
  },
});