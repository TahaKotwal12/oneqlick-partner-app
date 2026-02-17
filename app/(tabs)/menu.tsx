import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, LayoutAnimation, Platform, UIManager, TouchableOpacity, Image } from 'react-native';
import { Text, FAB, Switch, ActivityIndicator, Surface, Searchbar, Chip, Modal, Portal, TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DesignSystem } from '../../constants/designSystem';
import { partnerAPI } from '../../services/partnerService';
import { FoodItem } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- DUMMY DATA ---

interface NewItemFormData {
    name: string;
    price: string;
    description: string;
    category_id: string;
    image_url?: string;
    is_veg: boolean;
}

interface ExtendedFoodItem extends FoodItem {
    image_url?: string;
}

export default function MenuScreen() {
    const { theme } = useTheme();
    const { t } = useLanguage();

    const [menuItems, setMenuItems] = useState<ExtendedFoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // EDIT ITEM STATE
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<ExtendedFoodItem | null>(null);
    const [editModalFormData, setEditModalFormData] = useState({ name: '', price: '0.00', image_url: '' });

    // ADD ITEM STATE
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newModalFormData, setNewModalFormData] = useState<NewItemFormData>({
        name: '',
        price: '',
        description: '',
        category_id: '',
        image_url: '',
        is_veg: true
    });

    // --- CATEGORIES STATE ---
    const [categories, setCategories] = useState<{ category_id: string; name: string }[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    // --- API CALLS ---
    const fetchMenu = async () => {
        try {
            const response = await partnerAPI.restaurant.getMenu();
            if (response.success && response.data) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setMenuItems(response.data);
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

    // Fetch categories on mount
    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await partnerAPI.restaurant.getCategories();
            if (response.success && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
        fetchCategories();
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
                Alert.alert(t('error'), response.error || t('failed_update_status'));
            }
        } catch (error) {
            Alert.alert(t('error'), t('unexpected_error'));
        } finally {
            setTogglingId(null);
        }
    };

    // --- HANDLERS ---
    const openEditModal = (item: ExtendedFoodItem) => {
        setEditingItem(item);
        setEditModalFormData({
            name: item.name,
            price: item.price.toFixed(2),
            image_url: item.image_url || ''
        });
        setIsEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditingItem(null);
        setIsEditModalVisible(false);
    };

    const handleEditSubmit = () => {
        if (!editingItem) return;
        const newName = editModalFormData.name.trim();
        const newPrice = parseFloat(editModalFormData.price);

        if (!newName || isNaN(newPrice) || newPrice < 0) {
            Alert.alert(t('invalid_input'), t('valid_name_price_required'));
            return;
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setMenuItems(prev => prev.map(item =>
            item.food_item_id === editingItem.food_item_id
                ? { ...item, name: newName, price: newPrice, image_url: editModalFormData.image_url }
                : item
        ));
        closeEditModal();
    };

    // --- DELETE ITEM HANDLER ---
    const handleDeleteItem = (item: ExtendedFoodItem) => {
        Alert.alert(
            "Delete Item",
            `Are you sure you want to delete "${item.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // 1. Optimistic Update (Remove from UI immediately)
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setMenuItems(prev => prev.filter(i => i.food_item_id !== item.food_item_id));

                            // 2. Actual API Call
                            if (partnerAPI.restaurant.deleteMenuItem) {
                                await partnerAPI.restaurant.deleteMenuItem(item.food_item_id);
                            }
                        } catch (error) {
                            console.error("Delete failed", error);
                            // Only fetch menu if it failed, to restore item
                            fetchMenu();
                            Alert.alert("Error", "Could not delete item from server");
                        }
                    }
                }
            ]
        );
    };

    const openAddModal = () => {
        setNewModalFormData({
            name: '',
            price: '',
            description: '',
            category_id: categories.length > 0 ? categories[0].category_id : '',
            image_url: '',
            is_veg: true
        });
        setIsAddModalVisible(true);
    };

    const closeAddModal = () => {
        setIsAddModalVisible(false);
    };


    const handleAddSubmit = async () => {
        if (isSubmitting) return;
        const { name, price, description, category_id, image_url } = newModalFormData;
        const newName = name.trim();
        const newPrice = parseFloat(price);
        const newCategoryId = category_id.trim();

        if (!newName || isNaN(newPrice) || newPrice <= 0 || !newCategoryId) {
            Alert.alert(t('invalid_input'), t('valid_details_required'));
            return;
        }

        setIsSubmitting(true);
        try {
            const newItemData = {
                name: newName,
                price: newPrice,
                description,
                category_id: newCategoryId,
                image_url: image_url,
                is_veg: newModalFormData.is_veg
            };

            const response = await partnerAPI.restaurant.createMenuItem(newItemData);

            if (response.success) {
                Alert.alert(t('success'), t('item_added_successfully'));

                // --- FIX: LOCAL UPDATE & UNIQUE KEY GENERATION ---
                // We create a unique ID by combining the response ID (or random) with a timestamp
                // to prevent the "same key" error if the API returns duplicate IDs.
                const uniqueId = response.data?.food_item_id
                    ? `${response.data.food_item_id}_${Date.now()}`
                    : Date.now().toString();

                const createdItem: ExtendedFoodItem = {
                    food_item_id: uniqueId,
                    name: newName,
                    price: newPrice,
                    description: description,
                    category_id: newCategoryId,
                    is_available: true,
                    is_veg: newModalFormData.is_veg,
                    image: image_url || '',
                    image_url: image_url,
                    is_popular: false
                };

                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setMenuItems(prev => [...prev, createdItem]);

                closeAddModal();
            } else {
                Alert.alert(t('error'), response.error || t('failed_add_item'));
            }
        } catch (error) {
            console.error('Error adding new menu item:', error);
            Alert.alert(t('error'), t('unexpected_error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- STYLES ---
    const dynamicStyles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme === 'dark' ? '#121212' : DesignSystem.colors.background.primary },
        header: { padding: 20, paddingBottom: 16, backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white', borderBottomWidth: 1, borderBottomColor: theme === 'dark' ? '#333' : DesignSystem.colors.border.light },
        title: { fontSize: 24, fontWeight: 'bold', color: theme === 'dark' ? '#FFFFFF' : DesignSystem.colors.text.primary, marginBottom: 16 },
        searchBar: { backgroundColor: theme === 'dark' ? '#292929' : DesignSystem.colors.neutral[100], elevation: 0, borderRadius: 12 },
        searchInput: { fontSize: 14, color: theme === 'dark' ? '#FFFFFF' : DesignSystem.colors.text.primary },
        content: { padding: 16, paddingBottom: 100, flexGrow: 1 },
        centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
        emptyState: { padding: 40, alignItems: 'center', borderRadius: 16, backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white', width: '100%', maxWidth: 340 },
        emptyTitle: { fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#FFFFFF' : DesignSystem.colors.text.primary, marginTop: 16, marginBottom: 8 },
        emptySubtitle: { fontSize: 14, color: theme === 'dark' ? '#AAA' : DesignSystem.colors.text.secondary, textAlign: 'center' },
        statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
        statCard: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white', alignItems: 'center' },
        statValue: { fontSize: 24, fontWeight: 'bold', color: DesignSystem.colors.primary[600], marginBottom: 4 },
        statLabel: { fontSize: 12, color: theme === 'dark' ? '#AAA' : DesignSystem.colors.text.secondary, textAlign: 'center' },
        categorySection: { marginBottom: 16 },
        categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white', borderRadius: 12, marginBottom: 8 },
        categoryTitleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
        categoryTitle: { fontSize: 16, fontWeight: 'bold', color: theme === 'dark' ? '#FFFFFF' : DesignSystem.colors.text.primary, flex: 1 },
        categoryBadge: { backgroundColor: theme === 'dark' ? DesignSystem.colors.primary[900] : DesignSystem.colors.primary[100], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
        categoryCount: { fontSize: 12, fontWeight: 'bold', color: theme === 'dark' ? DesignSystem.colors.primary[400] : DesignSystem.colors.primary[700] },
        categoryItems: { gap: 8 },
        menuItem: { backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white', borderRadius: 12, overflow: 'hidden' },
        itemContent: { flexDirection: 'row', padding: 16, alignItems: 'center' },
        itemListImage: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#eee', marginRight: 16 },
        itemInfo: { flex: 1, marginRight: 12 },
        itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
        editButtonContainer: { marginRight: 12, padding: 4, flexDirection: 'row', gap: 12 },
        itemName: { fontSize: 16, fontWeight: 'bold', color: theme === 'dark' ? '#FFFFFF' : DesignSystem.colors.text.primary, flex: 1 },
        itemDescription: { fontSize: 13, color: theme === 'dark' ? '#AAA' : DesignSystem.colors.text.secondary, marginBottom: 8, lineHeight: 18 },
        itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
        itemPrice: { fontSize: 16, fontWeight: 'bold', color: DesignSystem.colors.primary[600] },
        popularChip: { backgroundColor: theme === 'dark' ? DesignSystem.colors.accent[900] : DesignSystem.colors.accent[100], height: 24 },
        popularText: { fontSize: 11, color: theme === 'dark' ? DesignSystem.colors.accent[400] : DesignSystem.colors.accent[700], fontWeight: 'bold' },
        itemActions: { justifyContent: 'center', alignItems: 'flex-end' },
        switchContainer: { alignItems: 'flex-end', gap: 4 },
        statusLabel: { fontSize: 11, color: theme === 'dark' ? '#777' : DesignSystem.colors.text.disabled, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
        statusLabelActive: { color: DesignSystem.colors.success },
        fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: DesignSystem.colors.primary[600], borderRadius: 16 },
        modalContent: { backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white', padding: 20, margin: 20, borderRadius: 12, maxHeight: '90%' },
        modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: theme === 'dark' ? '#FFFFFF' : DesignSystem.colors.text.primary },
        modalInput: { marginBottom: 15, backgroundColor: theme === 'dark' ? '#292929' : 'white' },
        modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 10 },
        saveButton: { minWidth: 120 },
        customImageContainer: { height: 150, backgroundColor: theme === 'dark' ? '#292929' : '#f0f0f0', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: theme === 'dark' ? '#444' : '#ddd', borderStyle: 'dashed', overflow: 'hidden' },
        customImageText: { color: theme === 'dark' ? '#888' : '#aaa', marginTop: 8 },
    });

    // --- DATA TRANSFORMATION LOGIC ---
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

    const groupedItems = menuItems.reduce((acc: Record<string, ExtendedFoodItem[]>, item) => {
        const category = item.category_id || t('uncategorized');
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    const filteredGroupedItems = Object.entries(groupedItems).reduce((acc: Record<string, ExtendedFoodItem[]>, [category, items]) => {
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredItems.length > 0) {
            acc[category] = filteredItems;
        }
        return acc;
    }, {});

    // --- RENDER FUNCTIONS ---
    const renderMenuItem = (item: ExtendedFoodItem) => (
        <Surface key={item.food_item_id} style={dynamicStyles.menuItem} elevation={1}>
            <View style={dynamicStyles.itemContent}>
                {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={dynamicStyles.itemListImage} />
                ) : (
                    <View style={dynamicStyles.itemListImage}>
                        <MaterialCommunityIcons name="food" size={30} color="#ccc" style={{ alignSelf: 'center', marginTop: 20 }} />
                    </View>
                )}
                <View style={dynamicStyles.itemInfo}>
                    <View style={dynamicStyles.itemHeader}>
                        {/* Action Buttons Group */}
                        <View style={dynamicStyles.editButtonContainer}>
                            <TouchableOpacity onPress={() => openEditModal(item)}>
                                <MaterialCommunityIcons name="pencil" size={20} color={DesignSystem.colors.primary[600]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteItem(item)}>
                                <MaterialCommunityIcons name="trash-can-outline" size={20} color={DesignSystem.colors.error} />
                            </TouchableOpacity>
                        </View>
                        <Text style={dynamicStyles.itemName} numberOfLines={1}>{item.name}</Text>
                    </View>
                    {item.description && <Text style={dynamicStyles.itemDescription} numberOfLines={2}>{item.description}</Text>}
                    <View style={dynamicStyles.itemMeta}>
                        <Text style={dynamicStyles.itemPrice}>₹{Number(item.price || 0).toFixed(2)}</Text>
                        {item.is_popular && <Chip icon="star" style={dynamicStyles.popularChip} textStyle={dynamicStyles.popularText} compact>{t('popular')}</Chip>}
                    </View>
                </View>
                <View style={dynamicStyles.itemActions}>
                    {togglingId === item.food_item_id ? (
                        <ActivityIndicator size={24} color={DesignSystem.colors.primary[500]} />
                    ) : (
                        <View style={dynamicStyles.switchContainer}>
                            <Text style={[dynamicStyles.statusLabel, item.is_available && dynamicStyles.statusLabelActive]}>{item.is_available ? t('available') : t('unavailable')}</Text>
                            <Switch value={item.is_available} onValueChange={() => handleToggleAvailability(item.food_item_id, item.is_available)} color={DesignSystem.colors.primary[600]} />
                        </View>
                    )}
                </View>
            </View>
        </Surface>
    );

    const renderCategory = ([category, items]: [string, ExtendedFoodItem[]]) => {
        const isExpanded = expandedCategories.has(category);
        const availableCount = items.filter(item => item.is_available).length;
        return (
            <View key={category} style={dynamicStyles.categorySection}>
                <Surface style={dynamicStyles.categoryHeader} elevation={0}>
                    <View style={dynamicStyles.categoryTitleContainer}>
                        <MaterialCommunityIcons name="food" size={20} color={DesignSystem.colors.primary[600]} />
                        <Text style={dynamicStyles.categoryTitle}>{category}</Text>
                        <View style={dynamicStyles.categoryBadge}>
                            <Text style={dynamicStyles.categoryCount}>{availableCount}/{items.length}</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={theme === 'dark' ? '#AAA' : DesignSystem.colors.text.secondary} onPress={() => toggleCategory(category)} />
                </Surface>
                {isExpanded && <View style={dynamicStyles.categoryItems}>{items.map(renderMenuItem)}</View>}
            </View>
        );
    };

    // --- MAIN RENDER ---
    return (
        <SafeAreaView style={dynamicStyles.container}>
            <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.title}>{t('menu_management')}</Text>
                <Searchbar placeholder={t('search_menu_items')} onChangeText={setSearchQuery} value={searchQuery} style={dynamicStyles.searchBar} inputStyle={dynamicStyles.searchInput} iconColor={DesignSystem.colors.primary[600]} />
            </View>
            <ScrollView contentContainerStyle={dynamicStyles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme === 'dark' ? '#FFFFFF' : DesignSystem.colors.primary[500]} colors={[DesignSystem.colors.primary[500]]} />}>
                {loading && !refreshing ? (
                    <View style={dynamicStyles.centerState}><ActivityIndicator size={40} color={DesignSystem.colors.primary[500]} /></View>
                ) : Object.keys(filteredGroupedItems).length > 0 ? (
                    <>
                        <View style={dynamicStyles.statsRow}>
                            <Surface style={dynamicStyles.statCard} elevation={1}><Text style={dynamicStyles.statValue}>{menuItems.length}</Text><Text style={dynamicStyles.statLabel}>{t('total_items')}</Text></Surface>
                            <Surface style={dynamicStyles.statCard} elevation={1}><Text style={dynamicStyles.statValue}>{menuItems.filter(item => item.is_available).length}</Text><Text style={dynamicStyles.statLabel}>{t('available')}</Text></Surface>
                            <Surface style={dynamicStyles.statCard} elevation={1}><Text style={dynamicStyles.statValue}>{Object.keys(groupedItems).length}</Text><Text style={dynamicStyles.statLabel}>{t('categories')}</Text></Surface>
                        </View>
                        {Object.entries(filteredGroupedItems).map(renderCategory)}
                    </>
                ) : (
                    <View style={dynamicStyles.centerState}>
                        <Surface style={dynamicStyles.emptyState} elevation={1}>
                            <MaterialCommunityIcons name="food-off" size={64} color={theme === 'dark' ? DesignSystem.colors.neutral[500] : DesignSystem.colors.neutral[300]} />
                            <Text style={dynamicStyles.emptyTitle}>{searchQuery ? t('no_items_found') : t('no_menu_items')}</Text>
                            <Text style={dynamicStyles.emptySubtitle}>{searchQuery ? t('try_different_search') : t('add_items_to_manage_menu')}</Text>
                        </Surface>
                    </View>
                )}
            </ScrollView>
            <FAB icon="plus" style={dynamicStyles.fab} onPress={openAddModal} label={t('add_item')} color="white" />

            {/* EDIT MODAL */}
            <Portal>
                <Modal visible={isEditModalVisible} onDismiss={closeEditModal} contentContainerStyle={dynamicStyles.modalContent}>
                    <Text style={dynamicStyles.modalTitle}>{t('edit_menu_item')}</Text>
                    <View style={dynamicStyles.customImageContainer}>
                        {editModalFormData.image_url && editModalFormData.image_url.length > 5 ? (
                            <Image source={{ uri: editModalFormData.image_url }} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="cover" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="image" size={32} color={theme === 'dark' ? '#555' : '#ccc'} />
                                <Text style={dynamicStyles.customImageText}>Preview will appear for valid URLs</Text>
                            </>
                        )}
                    </View>
                    <TextInput label="Image Link (URL)" placeholder="https://example.com/food.jpg" value={editModalFormData.image_url} onChangeText={(text) => setEditModalFormData(p => ({ ...p, image_url: text }))} mode="outlined" style={dynamicStyles.modalInput} autoCapitalize="none" />
                    <TextInput label={t('item_name')} value={editModalFormData.name} onChangeText={(name) => setEditModalFormData(p => ({ ...p, name }))} mode="outlined" style={dynamicStyles.modalInput} />
                    <TextInput label={t('price_currency')} value={editModalFormData.price} onChangeText={(price) => setEditModalFormData(p => ({ ...p, price }))} keyboardType="numeric" mode="outlined" style={dynamicStyles.modalInput} />
                    <View style={dynamicStyles.modalActions}>
                        <Button onPress={closeEditModal} mode="outlined">{t('cancel')}</Button>
                        <Button onPress={handleEditSubmit} mode="contained" style={dynamicStyles.saveButton}>{t('save_changes')}</Button>
                    </View>
                </Modal>
            </Portal>

            {/* ADD MODAL - UPDATED 3-STEP WIZARD */}
            <Portal>
                <Modal visible={isAddModalVisible} onDismiss={closeAddModal} contentContainerStyle={dynamicStyles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <>
                            <Text style={dynamicStyles.modalTitle}>Add New Item</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: 10, backgroundColor: theme === 'dark' ? '#292929' : '#f5f5f5', borderRadius: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons
                                        name={newModalFormData.is_veg ? "leaf" : "food-drumstick"}
                                        size={24}
                                        color={newModalFormData.is_veg ? DesignSystem.colors.success : DesignSystem.colors.error}
                                    />
                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333' }}>
                                        {newModalFormData.is_veg ? "Pure Veg" : "Non-Veg"}
                                    </Text>
                                </View>
                                <Switch
                                    value={newModalFormData.is_veg}
                                    onValueChange={(val) => setNewModalFormData(p => ({ ...p, is_veg: val }))}
                                    trackColor={{ false: '#767577', true: DesignSystem.colors.success }}
                                />
                            </View>

                            <TextInput
                                label={t('item_name')}
                                placeholder="e.g. Paneer Butter Masala"
                                value={newModalFormData.name}
                                onChangeText={(name) => setNewModalFormData(p => ({ ...p, name }))}
                                mode="outlined"
                                style={dynamicStyles.modalInput}
                            />

                            <TextInput
                                label={t('price_currency')}
                                placeholder="0.00"
                                value={newModalFormData.price}
                                onChangeText={(price) => setNewModalFormData(p => ({ ...p, price }))}
                                keyboardType="numeric"
                                mode="outlined"
                                style={dynamicStyles.modalInput}
                            />

                            <Text style={{ marginBottom: 8, fontWeight: 'bold', fontSize: 13, color: theme === 'dark' ? '#aaa' : '#666' }}>Category</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                                {categories.map((cat) => (
                                    <Chip
                                        key={cat.category_id}
                                        selected={newModalFormData.category_id === cat.category_id}
                                        onPress={() => setNewModalFormData(p => ({ ...p, category_id: cat.category_id }))}
                                        style={{ marginRight: 8, backgroundColor: newModalFormData.category_id === cat.category_id ? DesignSystem.colors.primary[100] : (theme === 'dark' ? '#292929' : '#f0f0f0') }}
                                        textStyle={{ color: newModalFormData.category_id === cat.category_id ? DesignSystem.colors.primary[600] : (theme === 'dark' ? '#fff' : '#333') }}
                                    >
                                        {cat.name}
                                    </Chip>
                                ))}
                            </ScrollView>

                            <TextInput
                                label={t('description_optional')}
                                placeholder="Short description of the dish"
                                value={newModalFormData.description}
                                onChangeText={(description) => setNewModalFormData(p => ({ ...p, description }))}
                                mode="outlined"
                                multiline
                                numberOfLines={2}
                                style={dynamicStyles.modalInput}
                            />

                            <TextInput
                                label="Image URL (Optional)"
                                placeholder="https://example.com/image.jpg"
                                value={newModalFormData.image_url}
                                onChangeText={(image_url) => setNewModalFormData(p => ({ ...p, image_url }))}
                                mode="outlined"
                                style={dynamicStyles.modalInput}
                                autoCapitalize="none"
                            />

                            <View style={dynamicStyles.modalActions}>
                                <Button onPress={closeAddModal} mode="outlined" disabled={isSubmitting}>{t('cancel')}</Button>
                                <Button onPress={handleAddSubmit} mode="contained" style={dynamicStyles.saveButton} loading={isSubmitting} disabled={isSubmitting}>{t('add_item')}</Button>
                            </View>
                        </>
                    </ScrollView>
                </Modal>
            </Portal>
        </SafeAreaView>
    );
}