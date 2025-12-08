import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, Surface, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../styles/globalStyles';
import { partnerAPI } from '../../services/partnerService';
import { useAuth } from '../../hooks/useAuthZustand';
import { useTheme } from '../../contexts/ThemeContext'; 
import { useLanguage } from '../../contexts/LanguageContext'; // 👈 I18N IMPORT


export default function EarningsScreen() {
    const { user } = useAuth();
    const { theme } = useTheme(); 
    const { t } = useLanguage(); // 👈 USE LANGUAGE HOOK
    
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

    const dynamicStyles = StyleSheet.create({
        header: {
            padding: 20,
            backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white',
            elevation: 2,
            borderBottomWidth: theme === 'dark' ? 1 : 0,
            borderBottomColor: theme === 'dark' ? '#333' : 'transparent',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 16,
            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
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
            backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white',
            elevation: 2,
        },
        amount: {
            fontSize: 36,
            fontWeight: 'bold',
            color: '#4F46E5',
            marginVertical: 8,
        },
        subtitle: {
            color: theme === 'dark' ? '#AAA' : '#6B7280',
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
            backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white',
            elevation: 1,
            borderWidth: theme === 'dark' ? 1 : 0,
            borderColor: theme === 'dark' ? '#333' : 'transparent',
        },
        statLabel: {
            color: theme === 'dark' ? '#AAA' : '#6B7280',
            fontSize: 14,
            marginBottom: 4,
        },
        statValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 12,
            color: theme === 'dark' ? '#BB86FC' : '#1F2937',
        },
        emptyState: {
            padding: 24,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            backgroundColor: theme === 'dark' ? '#292929' : '#F3F4F6',
            borderWidth: theme === 'dark' ? 1 : 0,
            borderColor: theme === 'dark' ? '#444' : 'transparent',
        },
        emptyText: {
            color: theme === 'dark' ? '#BBB' : '#6B7280',
        },
    });


    const themedTitleStyle = { color: theme === 'dark' ? '#FFFFFF' : '#1F2937' };


    return (
        <SafeAreaView style={GlobalStyles.layout.container}>
            <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.title}>{t('earnings')}</Text> 
                <SegmentedButtons
                    value={period}
                    onValueChange={value => setPeriod(value as any)}
                    buttons={[
                        { value: 'today', label: t('today') },           
                        { value: 'week', label: t('this_week') },       
                        { value: 'month', label: t('this_month') },     
                    ]}
                    style={dynamicStyles.periodSelector}
                />
            </View>

            <ScrollView
                contentContainerStyle={dynamicStyles.content}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor={theme === 'dark' ? '#FFFFFF' : '#4F46E5'}
                    />
                }
            >
                {loading && !refreshing ? (
                    <ActivityIndicator style={dynamicStyles.loader} size="large" color="#4F46E5" />
                ) : earnings ? (
                    <>
                        <Card style={dynamicStyles.card}>
                            <Card.Content>
                                <Title style={themedTitleStyle}>{t('total_earnings')}</Title> 
                                <Paragraph style={dynamicStyles.amount}>${earnings.total_amount || '0.00'}</Paragraph>
                                <Paragraph style={dynamicStyles.subtitle}>
                                    {earnings.total_orders || 0} {user?.role === 'restaurant_owner' ? t('orders') : t('deliveries_label')} 
                                </Paragraph>
                            </Card.Content>
                        </Card>

                        <View style={dynamicStyles.statsContainer}>
                            <Surface style={dynamicStyles.statBox}>
                                <Text style={dynamicStyles.statLabel}>{t('tips')}</Text> 
                                <Text style={dynamicStyles.statValue}>${earnings.tips || '0.00'}</Text>
                            </Surface>
                            <Surface style={dynamicStyles.statBox}>
                                <Text style={dynamicStyles.statLabel}>{t('bonus')}</Text> 
                                <Text style={dynamicStyles.statValue}>${earnings.bonus || '0.00'}</Text>
                            </Surface>
                        </View>

                        <Title style={dynamicStyles.sectionTitle}>{t('recent_activity')}</Title> 
                        <Surface style={dynamicStyles.emptyState}>
                            <Text style={dynamicStyles.emptyText}>{t('no_recent_activity')}</Text> 
                        </Surface>
                    </>
                ) : (
                    <Surface style={dynamicStyles.emptyState}>
                        <Text style={dynamicStyles.emptyText}>{t('no_earnings_data')}</Text> 
                    </Surface>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}