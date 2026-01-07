// oneQlick/app/(tabs)/profile.tsx (REAL DATA VERSION)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '../../components/common/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/useAuthZustand';
import { useRestaurantProfileStore } from '../../store/restaurantProfileStore';

// *** Interfaces ***
interface UserProfile {
  name: string;
  role: string;
  earnings_today: number;
  trips_today: number;
  is_online: boolean;
}

// *** Metric Card Component ***
const MetricCard = ({
  title,
  value,
  icon,
  color,
  styleSet,
}: {
  title: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  styleSet: any;
}) => (
  <View style={styleSet.metricCard}>
    <MaterialIcons name={icon} size={28} color={color} />
    <Text style={styleSet.metricValue}>{value}</Text>
    <Text style={styleSet.metricTitle}>{title}</Text>
  </View>
);

// *** Main Component ***
export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user, logout: authLogout } = useAuth();
  const { profile: restaurantProfile, fetchProfile } = useRestaurantProfileStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Profile from real user data
  useEffect(() => {
    console.log('ProfileScreen (tabs) - User:', user);
    console.log('ProfileScreen (tabs) - Restaurant Profile:', restaurantProfile);

    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch restaurant profile if restaurant owner
    if (user.role === 'restaurant_owner' && !restaurantProfile) {
      console.log('ProfileScreen (tabs) - Fetching restaurant profile...');
      fetchProfile().catch((error) => {
        console.log('ProfileScreen (tabs) - Error fetching profile:', error);
        // If 404, redirect to onboarding
        if (error.message && error.message.includes('Not Found')) {
          console.log('ProfileScreen (tabs) - No restaurant found, redirecting to onboarding...');
          router.replace('/restaurant/onboarding');
          return;
        }
      });
    }

    // Build profile from user data
    const userName = user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : restaurantProfile?.name || user.email || 'User';

    setProfile({
      name: restaurantProfile?.name || userName,
      role: user.role || 'user',
      earnings_today: 0, // TODO: Get from API
      trips_today: 0, // TODO: Get from API
      is_online: restaurantProfile?.is_open || false,
    });

    setIsOnline(restaurantProfile?.is_open || false);
    setLoading(false);
  }, [user, restaurantProfile]);

  // Toggle Online Status
  const toggleAvailability = useCallback(() => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    if (profile) {
      setProfile({ ...profile, is_online: newStatus });
    }

    Alert.alert(
      t("status_updated"),
      `${t("you_are_now_set_to")} ${newStatus ? t("online").toUpperCase() : t("offline").toUpperCase()
      }.`
    );
  }, [isOnline, profile, t]);

  // Dynamic THEME styles
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#121212" : "#f5f5f5",
    },
    content: { padding: 15 },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
    },
    loadingText: {
      color: theme === "dark" ? "#FFF" : "#333",
    },

    headerCard: {
      backgroundColor: theme === "dark" ? "#1E1E1E" : "#fff",
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      marginBottom: 20,
      borderWidth: theme === "dark" ? 1 : 0,
      borderColor: theme === "dark" ? "#333" : "transparent",
    },
    partnerName: {
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 10,
      color: theme === "dark" ? "#FFFFFF" : "#333",
    },
    partnerRole: {
      fontSize: 14,
      color: theme === "dark" ? "#AAA" : "#777",
      marginTop: 4,
    },

    toggleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#1E1E1E" : "#fff",
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      borderWidth: theme === "dark" ? 1 : 0,
      borderColor: theme === "dark" ? "#333" : "transparent",
    },
    statusLabel: {
      fontSize: 14,
      color: theme === "dark" ? "#BBB" : "#666",
    },
    statusText: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 4,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme === "dark" ? "#BB86FC" : "#333",
      marginBottom: 10,
    },

    metricsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    metricCard: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1E1E1E" : "#fff",
      borderRadius: 10,
      padding: 15,
      alignItems: "flex-start",
      borderWidth: theme === "dark" ? 1 : 0,
      borderColor: theme === "dark" ? "#333" : "transparent",
    },
    metricValue: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 5,
      color: theme === "dark" ? "#FFFFFF" : "#333",
    },
    metricTitle: {
      fontSize: 12,
      color: theme === "dark" ? "#AAA" : "#777",
      marginTop: 2,
    },

    linkItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#1E1E1E" : "#fff",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: theme === "dark" ? 1 : 0,
      borderColor: theme === "dark" ? "#333" : "transparent",
    },
    linkText: {
      flex: 1,
      fontSize: 16,
      marginLeft: 15,
      color: theme === "dark" ? "#FFFFFF" : "#333",
    },
    linkIcon: {
      width: 24,
    },
    linkIconColor: {
      color: theme === "dark" ? "#AAA" : "#666",
    },
  });

  if (loading) {
    return (
      <View style={dynamicStyles.center}>
        <Text style={dynamicStyles.loadingText}>{t("loading_profile")}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={dynamicStyles.center}>
        <Text style={dynamicStyles.loadingText}>{t("profile_data_missing")}</Text>
      </View>
    );
  }

  const roleKey =
    profile.role === "restaurant_owner"
      ? "restaurant_partner"
      : "delivery_partner";

  const roleLabel = t(roleKey);
  const statusColor = isOnline ? "#4CAF50" : "#F44336";
  const statusText = isOnline
    ? t("online").toUpperCase()
    : t("offline").toUpperCase();

  return (
    <View style={dynamicStyles.container}>
      <AppHeader title={t("my_profile")} showBack={false} />

      <ScrollView style={dynamicStyles.content}>
        {/* Header */}
        <View style={dynamicStyles.headerCard}>
          <MaterialIcons name="person-pin" size={50} color="#4F46E5" />
          <Text style={dynamicStyles.partnerName}>{profile.name}</Text>
          <Text style={dynamicStyles.partnerRole}>{roleLabel}</Text>
        </View>

        {/* Online / Offline Toggle */}
        <View style={dynamicStyles.toggleContainer}>
          <View>
            <Text style={dynamicStyles.statusLabel}>{t("current_status")}</Text>
            <Text style={[dynamicStyles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>

          <Switch
            trackColor={{
              false: theme === "dark" ? "#555" : "#ccc",
              true: "#4CAF50",
            }}
            thumbColor={theme === "dark" ? "#F8F8F8" : "#fff"}
            onValueChange={toggleAvailability}
            value={isOnline}
          />
        </View>

        {/* Metrics */}
        <Text style={dynamicStyles.sectionTitle}>
          {t("todays_performance")}
        </Text>

        <View style={dynamicStyles.metricsRow}>
          {profile.role === 'restaurant_owner' ? (
            // Restaurant Owner Metrics
            <>
              <MetricCard
                title={t("orders_today") || "Orders Today"}
                value={profile.trips_today.toString()}
                icon="receipt"
                color="#FF6B35"
                styleSet={dynamicStyles}
              />

              <MetricCard
                title={t("revenue") || "Revenue"}
                value={`₹${profile.earnings_today.toFixed(2)}`}
                icon="attach-money"
                color="#4CAF50"
                styleSet={dynamicStyles}
              />
            </>
          ) : (
            // Delivery Partner Metrics
            <>
              <MetricCard
                title={t("earnings")}
                value={`₹${profile.earnings_today.toFixed(2)}`}
                icon="attach-money"
                color="#4CAF50"
                styleSet={dynamicStyles}
              />

              <MetricCard
                title={t("total_trips")}
                value={profile.trips_today.toString()}
                icon="directions-bike"
                color="#2196F3"
                styleSet={dynamicStyles}
              />
            </>
          )}
        </View>

        {/* Links */}
        <View style={{ marginTop: 20 }}>
          {/* Restaurant Settings - Only for Restaurant Owners */}
          {profile.role === 'restaurant_owner' && (
            <TouchableOpacity
              style={dynamicStyles.linkItem}
              onPress={() => router.push('/restaurant/settings')}
            >
              <MaterialIcons name="restaurant" size={24} color="#FF6B35" />
              <Text style={dynamicStyles.linkText}>{t("restaurant_settings") || "Restaurant Settings"}</Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={theme === "dark" ? "#444" : "#ccc"}
              />
            </TouchableOpacity>
          )}

          {/* Logout */}
          <TouchableOpacity
            style={dynamicStyles.linkItem}
            onPress={() =>
              Alert.alert(t("confirm_logout"), t("sure_log_out"), [
                { text: t("cancel"), style: "cancel" },
                {
                  text: t("log_out"),
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await authLogout();
                      router.replace('/(auth)/login');
                    } catch (error) {
                      console.error('Logout error:', error);
                      Alert.alert('Error', 'Failed to logout');
                    }
                  },
                },
              ])
            }
          >
            <MaterialIcons name="logout" size={24} color="#F44336" />
            <Text style={dynamicStyles.linkText}>{t("log_out")}</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme === "dark" ? "#444" : "#ccc"}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
