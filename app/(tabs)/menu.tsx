import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text, FAB, List, Switch, ActivityIndicator, Surface, Searchbar, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../styles/globalStyles';
import { DesignSystem } from '../../constants/designSystem';
import { partnerAPI } from '../../services/partnerService';
import { FoodItem } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MenuScreen() {
    const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const fetchMenu = async () => {
        try {
            const response = await partnerAPI.restaurant.getMenu();
            if (response.success && response.data) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setMenuItems(response.data);
                // Auto-expand first category
                if (response.data.length > 0) {
                    const firstCategory = response.data[0].category_id;
                    setExpandedCategories(new Set([firstCategory]));
                }
            }
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMenu();
    };

    const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
        setTogglingId(itemId);
        try {
            const response = await partnerAPI.restaurant.updateMenuItemStatus(itemId, !currentStatus);
            if (response.success) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setMenuItems(prev => prev.map(item =>
                    item.food_item_id === itemId ? { ...item, is_available: !currentStatus } : item
                ));
            } else {
                Alert.alert('Error', response.error || 'Failed to update item status');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setTogglingId(null);
        }
    };

    const toggleCategory = (category: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    // Group items by category
    const groupedItems = menuItems.reduce((acc, item) => {
        const category = item.category_id || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, FoodItem[]>);

    // Filter items based on search
    const filteredGroupedItems = Object.entries(groupedItems).reduce((acc, [category, items]) => {
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredItems.length > 0) {
            acc[category] = filteredItems;
        }
        return acc;
    }, {} as Record<string, FoodItem[]>);

    const renderMenuItem = (item: FoodItem) => (
        <Surface key={item.food_item_id} style={styles.menuItem} elevation={1}>
            <View style={styles.itemContent}>
                <View style={styles.itemInfo}>
                    <View style={styles.itemHeader}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        {item.is_veg && (
                            <View style={styles.vegBadge}>
                                <View style={styles.vegDot} />
                            </View>
                        )}
                    </View>
                    {item.description && (
                        <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
                    )}
                    <View style={styles.itemMeta}>
                        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                        {item.is_popular && (
                            <Chip
                                icon="star"
                                style={styles.popularChip}
                                textStyle={styles.popularText}
                                compact
                            >
                                Popular
                            </Chip>
                        )}
                    </View>
                </View>

                <View style={styles.itemActions}>
                    {togglingId === item.food_item_id ? (
                        <ActivityIndicator size={24} color={DesignSystem.colors.primary[500]} />
                    ) : (
                        <View style={styles.switchContainer}>
                            <Text style={[styles.statusLabel, item.is_available && styles.statusLabelActive]}>
                                {item.is_available ? 'Available' : 'Unavailable'}
                            </Text>
                            <Switch
                                value={item.is_available}
                                onValueChange={() => handleToggleAvailability(item.food_item_id, item.is_available)}
                                color={DesignSystem.colors.primary[600]}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Surface>
    );

    const renderCategory = ([category, items]: [string, FoodItem[]]) => {
        const isExpanded = expandedCategories.has(category);
        const availableCount = items.filter(item => item.is_available).length;

        return (
            <View key={category} style={styles.categorySection}>
                <Surface style={styles.categoryHeader} elevation={0}>
                    <View style={styles.categoryTitleContainer}>
                        <MaterialCommunityIcons
                            name="food"
                            size={20}
                            color={DesignSystem.colors.primary[600]}
                        />
                        <Text style={styles.categoryTitle}>{category}</Text>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryCount}>{availableCount}/{items.length}</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={DesignSystem.colors.text.secondary}
                        onPress={() => toggleCategory(category)}
                    />
                </Surface>

                {isExpanded && (
                    <View style={styles.categoryItems}>
                        {items.map(renderMenuItem)}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Menu Management</Text>
                <Searchbar
                    placeholder="Search menu items..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor={DesignSystem.colors.primary[600]}
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[DesignSystem.colors.primary[500]]}
                    />
                }
            >
                {loading && !refreshing ? (
                    <View style={styles.centerState}>
                        <ActivityIndicator size={40} color={DesignSystem.colors.primary[500]} />
                    </View>
                ) : Object.keys(filteredGroupedItems).length > 0 ? (
                    <>
                        <View style={styles.statsRow}>
                            <Surface style={styles.statCard} elevation={1}>
                                <Text style={styles.statValue}>{menuItems.length}</Text>
                                <Text style={styles.statLabel}>Total Items</Text>
                            </Surface>
                            <Surface style={styles.statCard} elevation={1}>
                                <Text style={styles.statValue}>
                                    {menuItems.filter(item => item.is_available).length}
                                </Text>
                                <Text style={styles.statLabel}>Available</Text>
                            </Surface>
                            <Surface style={styles.statCard} elevation={1}>
                                <Text style={styles.statValue}>{Object.keys(groupedItems).length}</Text>
                                <Text style={styles.statLabel}>Categories</Text>
                            </Surface>
                        </View>

                        {Object.entries(filteredGroupedItems).map(renderCategory)}
                    </>
                ) : (
                    <View style={styles.centerState}>
                        <Surface style={styles.emptyState} elevation={1}>
                            <MaterialCommunityIcons
                                name="food-off"
                                size={64}
                                color={DesignSystem.colors.neutral[300]}
                            />
                            <Text style={styles.emptyTitle}>
                                {searchQuery ? 'No items found' : 'No menu items'}
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery
                                    ? 'Try a different search term'
                                    : 'Add items to start managing your menu'}
                            </Text>
                        </Surface>
                    </View>
                )}
            </ScrollView>

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => Alert.alert('Coming Soon', 'Add item feature will be available soon!')}
                label="Add Item"
                color="white"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignSystem.colors.background.primary,
    },
    header: {
        padding: 20,
        paddingBottom: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: DesignSystem.colors.border.light,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        marginBottom: 16,
    },
    searchBar: {
        backgroundColor: DesignSystem.colors.neutral[100],
        elevation: 0,
        borderRadius: 12,
    },
    searchInput: {
        fontSize: 14,
    },
    content: {
        padding: 16,
        paddingBottom: 100,
        flexGrow: 1,
    },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: 'white',
        width: '100%',
        maxWidth: 340,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: DesignSystem.colors.text.secondary,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: DesignSystem.colors.primary[600],
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: DesignSystem.colors.text.secondary,
        textAlign: 'center',
    },
    categorySection: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 8,
    },
    categoryTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        flex: 1,
    },
    categoryBadge: {
        backgroundColor: DesignSystem.colors.primary[100],
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: DesignSystem.colors.primary[700],
    },
    categoryItems: {
        gap: 8,
    },
    menuItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    itemContent: {
        flexDirection: 'row',
        padding: 16,
    },
    itemInfo: {
        flex: 1,
        marginRight: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DesignSystem.colors.text.primary,
        flex: 1,
    },
    vegBadge: {
        width: 18,
        height: 18,
        borderWidth: 1.5,
        borderColor: DesignSystem.colors.success,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: DesignSystem.colors.success,
    },
    itemDescription: {
        fontSize: 13,
        color: DesignSystem.colors.text.secondary,
        marginBottom: 8,
        lineHeight: 18,
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DesignSystem.colors.primary[600],
    },
    popularChip: {
        backgroundColor: DesignSystem.colors.accent[100],
        height: 24,
    },
    popularText: {
        fontSize: 11,
        color: DesignSystem.colors.accent[700],
        fontWeight: 'bold',
    },
    itemActions: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    switchContainer: {
        alignItems: 'flex-end',
        gap: 4,
    },
    statusLabel: {
        fontSize: 11,
        color: DesignSystem.colors.text.disabled,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusLabelActive: {
        color: DesignSystem.colors.success,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: DesignSystem.colors.primary[600],
        borderRadius: 16,
    },
});
