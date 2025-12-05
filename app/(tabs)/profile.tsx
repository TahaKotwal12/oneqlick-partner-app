// oneQlick/app/(tabs)/profile.tsx (Profile Summary and Availability Toggle - Task 9)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity } from 'react-native';
import AppHeader from '../../components/common/AppHeader'; 
import { MaterialIcons } from '@expo/vector-icons';
// NOTE: Ensure getProfile() returns the expected mock structure
import { getProfile } from '../../utils/mock'; 

// *** Data Interfaces ***
interface UserProfile {
    name: string;
    role: string;
    earnings_today: number;
    trips_today: number;
    is_online: boolean; // Checklist: Toggle Online/Offline
}

// --- Helper Components ---

// Helper component for the summary metrics (Earnings/Trips)
const MetricCard = ({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) => (
    <View style={profileStyles.metricCard}>
        <MaterialIcons name={icon as 'attach-money'} size={28} color={color} />
        <Text style={profileStyles.metricValue}>{value}</Text>
        <Text style={profileStyles.metricTitle}>{title}</Text>
    </View>
);

// --- Main Component ---
export default function ProfileScreen() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Checklist: Use profile.json and load state
    useEffect(() => {
        try {
            // Ensure getProfile() returns the structure defined in UserProfile
            const mockProfile: UserProfile = getProfile();
            setProfile(mockProfile);
            setIsOnline(mockProfile.is_online);
        } catch (error) {
            console.error("Error loading profile mock data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Checklist: Toggle Online/Offline (local state simulation)
    const toggleAvailability = useCallback(() => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        
        // Simulates saving state for persistence (Acceptance: State persists)
        if (profile) {
            setProfile({ ...profile, is_online: newStatus });
        }
        
        Alert.alert("Status Updated", `You are now set to ${newStatus ? 'ONLINE' : 'OFFLINE'}.`);
    }, [isOnline, profile]);

    if (loading) {
        return <View style={styles.center}><Text>Loading Profile...</Text></View>;
    }
    
    if (!profile) {
        return <View style={styles.center}><Text>Profile Data Missing.</Text></View>;
    }

    const roleLabel = profile.role === 'restaurant_owner' ? 'Restaurant Partner' : 'Delivery Partner';
    const statusColor = isOnline ? '#4CAF50' : '#F44336';
    const statusText = isOnline ? 'ONLINE' : 'OFFLINE';

    return (
        <View style={styles.container}>
            <AppHeader title="My Profile" showBack={false} />
            <ScrollView style={styles.content}>
                
                {/* Profile Header */}
                <View style={profileStyles.headerCard}>
                    <MaterialIcons name="person-pin" size={50} color="#4F46E5" />
                    <Text style={profileStyles.partnerName}>{profile.name}</Text>
                    <Text style={profileStyles.partnerRole}>{roleLabel}</Text>
                </View>
                
                {/* Checklist: Toggle Online/Offline */}
                <View style={profileStyles.toggleContainer}>
                    <View>
                        <Text style={profileStyles.statusLabel}>Current Status</Text>
                        <Text style={[profileStyles.statusText, { color: statusColor }]}>
                            {statusText}
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#ccc", true: "#4CAF50" }}
                        thumbColor="#fff"
                        onValueChange={toggleAvailability}
                        value={isOnline}
                    />
                </View>

                {/* Checklist: Profile card with earnings + trips */}
                <Text style={profileStyles.sectionTitle}>Today's Performance</Text>
                <View style={profileStyles.metricsRow}>
                    <MetricCard 
                        title="Earnings" 
                        value={`$${profile.earnings_today.toFixed(2)}`} 
                        icon="attach-money" 
                        color="#4CAF50" 
                    />
                    <MetricCard 
                        title="Total Trips" 
                        value={profile.trips_today.toString()} 
                        icon="directions-bike" 
                        color="#2196F3" 
                    />
                </View>
                
                {/* Placeholder for settings/other links */}
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity 
                        style={profileStyles.linkItem}
                        // 🔑 ADDED: OnPress handler
                        onPress={() => Alert.alert("Navigation", "Settings screen coming soon!")} 
                    >
                        <MaterialIcons name="settings" size={24} color="#666" />
                        <Text style={profileStyles.linkText}>Settings</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#ccc" style={profileStyles.linkIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={profileStyles.linkItem}
                        // 🔑 ADDED: OnPress handler for Log Out
                        onPress={() => Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
                            { text: "Cancel" },
                            { text: "Log Out", style: 'destructive', onPress: () => console.log("User logged out.") }
                        ])} 
                    >
                        <MaterialIcons name="logout" size={24} color="#F44336" />
                        <Text style={profileStyles.linkText}>Log Out</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#ccc" style={profileStyles.linkIcon} />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

// --- Styles ---

const profileStyles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 15 },
    
    headerCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    partnerName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    partnerRole: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },

    // Toggle Section
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    statusLabel: {
        fontSize: 14,
        color: '#666',
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    
    // Metrics Section
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        alignItems: 'flex-start',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#333',
    },
    metricTitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },

    // Link List
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    linkText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 15,
        color: '#333',
    },
    linkIcon: {
        width: 24,
    }
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 15 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});