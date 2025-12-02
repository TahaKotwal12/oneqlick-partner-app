import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Switch, LayoutAnimation, Platform, UIManager, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, Card, ActivityIndicator, Badge, Avatar, IconButton, Divider, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../styles/globalStyles';
import { DesignSystem } from '../../constants/designSystem';
import { partnerAPI } from '../../services/partnerService';
import { Order } from '../../types';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DeliveriesScreen() {
    const [requests, setRequests] = useState<Order[]>([]);
    const [activeDelivery, setActiveDelivery] = useState<Order | null>(null);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchRequests = async () => {
        if (!isOnline) return;
        try {
            const response = await partnerAPI.delivery.getRequests();
            if (response.success && response.data) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRequests();
        }, [isOnline])
    );

    const handleToggleOnline = async (value: boolean) => {
        try {
            if (value) {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Location permission is required to go online.');
                    return;
                }
            }

            const response = await partnerAPI.delivery.toggleAvailability(value);
            if (response.success) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setIsOnline(value);
                if (value) {
                    fetchRequests();
                } else {
                    setRequests([]);
                }
            } else {
                Alert.alert('Error', response.error || 'Failed to update status');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        }
    };

    const handleAcceptRequest = async (orderId: string) => {
        setProcessingId(orderId);
        try {
            const response = await partnerAPI.delivery.acceptRequest(orderId);
            if (response.success) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setActiveDelivery(response.data);
                setRequests(prev => prev.filter(req => req.order_id !== orderId));
            } else {
                Alert.alert('Error', response.error || 'Failed to accept delivery');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setProcessingId(null);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        if (!activeDelivery) return;
        setProcessingId(activeDelivery.order_id);
        try {
            const response = await partnerAPI.delivery.updateDeliveryStatus(activeDelivery.order_id, status);
            if (response.success) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                if (status === 'delivered') {
                    setActiveDelivery(null);
                    Alert.alert('Great Job!', 'Delivery completed successfully.');
                    fetchRequests();
                } else {
                    setActiveDelivery(response.data);
                }
            } else {
                Alert.alert('Error', response.error || 'Failed to update status');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setProcessingId(null);
        }
    };

    const renderRequestCard = (order: Order) => (
        <Surface key={order.order_id} style={styles.requestCard} elevation={2}>
            <View style={styles.cardHeader}>
                <View style={styles.restaurantInfo}>
                    <Avatar.Icon size={40} icon="store" style={styles.storeIcon} color="white" />
                    <View style={styles.headerText}>
                        <Text style={styles.restaurantName} numberOfLines={1}>{order.restaurant_name || 'Unknown Restaurant'}</Text>
                        <Text style={styles.orderId}>#{order.order_number}</Text>
                    </View>
                </View>
                <View style={styles.earningsBadge}>
                    <Text style={styles.earningsText}>${(order.total_amount * 0.15).toFixed(2)}</Text>
                </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.routeContainer}>
                <View style={styles.routeRow}>
                    <MaterialCommunityIcons name="map-marker" size={20} color={DesignSystem.colors.text.secondary} />
                    <Text style={styles.addressText} numberOfLines={1}>{order.restaurant_address || 'Restaurant Address'}</Text>
                </View>
                <View style={styles.routeConnector}>
                    <View style={styles.dottedLine} />
                </View>
                <View style={styles.routeRow}>
                    <MaterialCommunityIcons name="home-map-marker" size={20} color={DesignSystem.colors.primary[600]} />
                    <Text style={styles.addressText} numberOfLines={1}>
                        {typeof order.delivery_address === 'string' ? order.delivery_address : order.delivery_address.address}
                    </Text>
                </View>
            </View>

            <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="shopping-outline" size={16} color={DesignSystem.colors.text.secondary} />
                    <Text style={styles.metaText}>{order.items?.length || 1} Items</Text>
                </View>
                <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="map-clock-outline" size={16} color={DesignSystem.colors.text.secondary} />
                    <Text style={styles.metaText}>2.5 km • 15 mins</Text>
                </View>
            </View>

            <Button
                mode="contained"
                onPress={() => handleAcceptRequest(order.order_id)}
                loading={processingId === order.order_id}
                disabled={!!processingId}
                style={styles.acceptButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
            >
                Accept Delivery
            </Button>
        </Surface>
    );

    const renderActiveDelivery = () => {
        if (!activeDelivery) return null;

        const isPickedUp = activeDelivery.order_status === 'picked_up' || activeDelivery.order_status === 'out_for_delivery';
        const progress = isPickedUp ? 0.8 : 0.4;

        return (
            <Surface style={styles.activeCard} elevation={4}>
                <View style={styles.activeHeader}>
                    <View>
                        <Text style={styles.activeTitle}>Current Delivery</Text>
                        <Text style={styles.activeSubtitle}>Order #{activeDelivery.order_number}</Text>
                    </View>
                    <Badge style={styles.statusBadge} size={28}>{activeDelivery.order_status.replace('_', ' ')}</Badge>
                </View>

                <View style={styles.progressContainer}>
                    <ProgressBar progress={progress} color={DesignSystem.colors.primary[500]} style={styles.progressBar} />
                    <View style={styles.progressLabels}>
                        <Text style={[styles.progressLabel, { color: DesignSystem.colors.primary[600] }]}>Pickup</Text>
                        <Text style={[styles.progressLabel, isPickedUp && { color: DesignSystem.colors.primary[600] }]}>Drop-off</Text>
                    </View>
                </View>

                <View style={styles.activeDetails}>
                    <View style={styles.detailRow}>
                        <Avatar.Icon size={36} icon="store" style={styles.detailIcon} />
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Restaurant</Text>
                            <Text style={styles.detailValue}>{activeDelivery.restaurant_name}</Text>
                            <Text style={styles.detailSub}>{activeDelivery.restaurant_address}</Text>
                        </View>
                        <IconButton icon="phone" mode="contained-tonal" size={20} onPress={() => { }} />
                    </View>

                    <View style={styles.detailConnector} />

                    <View style={styles.detailRow}>
                        <Avatar.Icon size={36} icon="account" style={[styles.detailIcon, { backgroundColor: DesignSystem.colors.secondary[100] }]} color={DesignSystem.colors.secondary[700]} />
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Customer</Text>
                            <Text style={styles.detailValue}>
                                {typeof activeDelivery.delivery_address === 'string' ? activeDelivery.delivery_address : activeDelivery.delivery_address.address}
                            </Text>
                        </View>
                        <IconButton icon="phone" mode="contained-tonal" size={20} onPress={() => { }} />
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    {!isPickedUp ? (
                        <Button
                            mode="contained"
                            onPress={() => handleUpdateStatus('picked_up')}
                            loading={processingId === activeDelivery.order_id}
                            style={styles.mainActionButton}
                            contentStyle={styles.actionButtonContent}
                        >
                            Confirm Pickup
                        </Button>
                    ) : (
                        <Button
                            mode="contained"
                            onPress={() => handleUpdateStatus('delivered')}
                            loading={processingId === activeDelivery.order_id}
                            style={[styles.mainActionButton, { backgroundColor: DesignSystem.colors.success }]}
                            contentStyle={styles.actionButtonContent}
                        >
                            Complete Delivery
                        </Button>
                    )}

                    <Button
                        mode="outlined"
                        icon="navigation"
                        onPress={() => { }}
                        style={styles.secondaryActionButton}
                    >
                        Navigate
                    </Button>
                </View>
            </Surface>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Deliveries</Text>
                    <Text style={styles.headerSubtitle}>{isOnline ? 'You are Online' : 'You are Offline'}</Text>
                </View>
                <View style={styles.toggleContainer}>
                    <Switch
                        value={isOnline}
                        onValueChange={handleToggleOnline}
                        trackColor={{ false: DesignSystem.colors.neutral[300], true: DesignSystem.colors.primary[300] }}
                        thumbColor={isOnline ? DesignSystem.colors.primary[600] : '#f4f3f4'}
                    />
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRequests(); }} enabled={isOnline} colors={[DesignSystem.colors.primary[500]]} />
                }
            >
                {activeDelivery ? (
                    renderActiveDelivery()
                ) : !isOnline ? (
                    <View style={styles.centerState}>
                        <Surface style={styles.offlineCard} elevation={1}>
                            <Avatar.Icon size={80} icon="bike" style={styles.offlineIcon} color={DesignSystem.colors.primary[600]} />
                            <Text style={styles.stateTitle}>Go Online to Start</Text>
                            <Text style={styles.stateSubtitle}>You're currently offline. Go online to start receiving delivery requests nearby.</Text>
                            <Button mode="contained" onPress={() => handleToggleOnline(true)} style={styles.goOnlineButton}>
                                Go Online Now
                            </Button>
                        </Surface>
                    </View>
                ) : requests.length > 0 ? (
                    <View style={styles.requestsList}>
                        <Text style={styles.sectionTitle}>New Requests ({requests.length})</Text>
                        {requests.map(renderRequestCard)}
                    </View>
                ) : (
                    <View style={styles.centerState}>
                        <ActivityIndicator size={40} color={DesignSystem.colors.primary[500]} style={styles.loader} />
                        <Text style={styles.stateTitle}>Scanning for Requests...</Text>
                        <Text style={styles.stateSubtitle}>Stay put! We're looking for orders near you.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignSystem.colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: DesignSystem.colors.border.light,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: DesignSystem.colors.text.secondary,
        marginTop: 2,
    },
    toggleContainer: {
        transform: [{ scale: 1.1 }],
    },
    content: {
        flexGrow: 1,
        padding: 16,
    },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
    },
    offlineCard: {
        padding: 32,
        borderRadius: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
    },
    offlineIcon: {
        backgroundColor: DesignSystem.colors.primary[50],
        marginBottom: 24,
    },
    stateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    stateSubtitle: {
        fontSize: 14,
        color: DesignSystem.colors.text.secondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    goOnlineButton: {
        width: '100%',
        backgroundColor: DesignSystem.colors.primary[600],
        borderRadius: 12,
    },
    loader: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        marginBottom: 16,
        marginLeft: 4,
    },
    requestsList: {
        paddingBottom: 20,
    },
    requestCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: DesignSystem.colors.primary[50],
    },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    storeIcon: {
        backgroundColor: DesignSystem.colors.primary[300],
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
    },
    orderId: {
        fontSize: 12,
        color: DesignSystem.colors.text.secondary,
    },
    earningsBadge: {
        backgroundColor: DesignSystem.colors.success,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    earningsText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    divider: {
        backgroundColor: DesignSystem.colors.border.light,
    },
    routeContainer: {
        padding: 16,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    addressText: {
        marginLeft: 12,
        fontSize: 14,
        color: DesignSystem.colors.text.primary,
        flex: 1,
    },
    routeConnector: {
        marginLeft: 9,
        height: 24,
        borderLeftWidth: 2,
        borderLeftColor: DesignSystem.colors.border.medium,
        borderStyle: 'dotted',
        marginVertical: 2,
    },
    dottedLine: {
        // Custom dotted line implementation if needed
    },
    metaInfo: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: DesignSystem.colors.neutral[100],
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    metaText: {
        fontSize: 12,
        color: DesignSystem.colors.text.secondary,
        marginLeft: 6,
    },
    acceptButton: {
        margin: 16,
        marginTop: 0,
        backgroundColor: DesignSystem.colors.primary[600],
        borderRadius: 12,
    },
    buttonContent: {
        height: 48,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    activeCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    activeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    activeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
    },
    activeSubtitle: {
        fontSize: 14,
        color: DesignSystem.colors.text.secondary,
        marginTop: 2,
    },
    statusBadge: {
        backgroundColor: DesignSystem.colors.primary[100],
        color: DesignSystem.colors.primary[700],
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: DesignSystem.colors.neutral[200],
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    progressLabel: {
        fontSize: 12,
        color: DesignSystem.colors.text.disabled,
        fontWeight: '600',
    },
    activeDetails: {
        marginBottom: 24,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIcon: {
        backgroundColor: DesignSystem.colors.primary[100],
    },
    detailTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: DesignSystem.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        marginTop: 2,
    },
    detailSub: {
        fontSize: 13,
        color: DesignSystem.colors.text.secondary,
        marginTop: 2,
    },
    detailConnector: {
        height: 24,
        marginLeft: 18,
        borderLeftWidth: 2,
        borderLeftColor: DesignSystem.colors.border.medium,
        marginVertical: 4,
    },
    actionButtons: {
        gap: 12,
    },
    mainActionButton: {
        backgroundColor: DesignSystem.colors.primary[600],
        borderRadius: 12,
    },
    secondaryActionButton: {
        borderColor: DesignSystem.colors.primary[600],
        borderRadius: 12,
    },
    actionButtonContent: {
        height: 52,
    },
});
