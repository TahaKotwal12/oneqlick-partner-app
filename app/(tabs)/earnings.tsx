import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, Surface, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../styles/globalStyles';
import { partnerAPI } from '../../services/partnerService';
import { useAuth } from '../../hooks/useAuthZustand';

export default function EarningsScreen() {
    const { user } = useAuth();
    const [earnings, setEarnings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

    const fetchEarnings = async () => {
        try {
            const api = user?.role === 'restaurant_owner'
                ? partnerAPI.restaurant.getEarnings
                : partnerAPI.delivery.getEarnings;

            const response = await api(period);
            if (response.success && response.data) {
                setEarnings(response.data);
            }
        } catch (error) {
            console.error('Error fetching earnings:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, [period]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchEarnings();
    };

    return (
        <SafeAreaView style={GlobalStyles.layout.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Earnings</Text>
                <SegmentedButtons
                    value={period}
                    onValueChange={value => setPeriod(value as any)}
                    buttons={[
                        { value: 'today', label: 'Today' },
                        { value: 'week', label: 'This Week' },
                        { value: 'month', label: 'This Month' },
                    ]}
                    style={styles.periodSelector}
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading && !refreshing ? (
                    <ActivityIndicator style={styles.loader} size="large" color="#4F46E5" />
                ) : earnings ? (
                    <>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title>Total Earnings</Title>
                                <Paragraph style={styles.amount}>${earnings.total_amount || '0.00'}</Paragraph>
                                <Paragraph style={styles.subtitle}>
                                    {earnings.total_orders || 0} {user?.role === 'restaurant_owner' ? 'Orders' : 'Deliveries'}
                                </Paragraph>
                            </Card.Content>
                        </Card>

                        <View style={styles.statsContainer}>
                            <Surface style={styles.statBox}>
                                <Text style={styles.statLabel}>Tips</Text>
                                <Text style={styles.statValue}>${earnings.tips || '0.00'}</Text>
                            </Surface>
                            <Surface style={styles.statBox}>
                                <Text style={styles.statLabel}>Bonus</Text>
                                <Text style={styles.statValue}>${earnings.bonus || '0.00'}</Text>
                            </Surface>
                        </View>

                        {/* Recent Transactions Placeholder */}
                        <Title style={styles.sectionTitle}>Recent Activity</Title>
                        {/* List of recent transactions would go here */}
                        <Surface style={styles.emptyState}>
                            <Text style={styles.emptyText}>No recent activity</Text>
                        </Surface>
                    </>
                ) : (
                    <Surface style={styles.emptyState}>
                        <Text style={styles.emptyText}>No earnings data available</Text>
                    </Surface>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        backgroundColor: 'white',
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    periodSelector: {
        marginBottom: 8,
    },
    content: {
        padding: 20,
    },
    loader: {
        marginTop: 40,
    },
    card: {
        marginBottom: 20,
        backgroundColor: 'white',
        elevation: 2,
    },
    amount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4F46E5',
        marginVertical: 8,
    },
    subtitle: {
        color: '#6B7280',
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'white',
        elevation: 1,
        alignItems: 'center',
    },
    statLabel: {
        color: '#6B7280',
        fontSize: 14,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#1F2937',
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    emptyText: {
        color: '#6B7280',
    },
});
