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
const DUMMY_MENU_DATA = {
    veg: {
        'North Indian': [
            { name: 'Paneer Butter Masala', price: '280', description: 'Cottage cheese in rich tomato gravy', category: 'North Indian', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200' },
            { name: 'Dal Makhani', price: '240', description: 'Black lentils cooked overnight with cream', category: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=200' },
            { name: 'Veg Pulao', price: '180', description: 'Basmati rice with mixed vegetables', category: 'Rice', image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=200' },
            { name: 'Palak Paneer', price: '260', description: 'Cottage cheese cubes in spinach gravy', category: 'North Indian', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200' },
            { name: 'Malai Kofta', price: '290', description: 'Fried dumplings in creamy cashew curry', category: 'North Indian', image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=200' }
        ],
        'South Indian': [
            { name: 'Masala Dosa', price: '120', description: 'Fermented crepe stuffed with potato masala', category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200' },
            { name: 'Idli Sambar', price: '80', description: 'Steamed rice cakes with lentil soup', category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200' },
            { name: 'Uttapam', price: '110', description: 'Thick pancake with onion and tomato toppings', category: 'South Indian', image: 'https://images.unsplash.com/photo-1630302720542-f54298158866?w=200' }
        ],
        'Chinese': [
            { name: 'Veg Hakka Noodles', price: '180', description: 'Stir fried noodles with fresh veggies', category: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200' },
            { name: 'Veg Manchurian', price: '200', description: 'Fried veg balls in spicy soya sauce', category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200' },
            { name: 'Chilli Paneer', price: '220', description: 'Spicy cottage cheese with capsicum', category: 'Chinese', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200' }
        ],
        'Italian': [
            { name: 'Margherita Pizza', price: '250', description: 'Classic cheese and tomato pizza', category: 'Italian', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200' },
            { name: 'White Sauce Pasta', price: '220', description: 'Penne pasta in creamy cheesy sauce', category: 'Italian', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200' },
            { name: 'Farmhouse Pizza', price: '300', description: 'Loaded with onion, capsicum, corn and mushroom', category: 'Italian', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=200' }
        ],
        'Starters': [
            { name: 'Paneer Tikka', price: '220', description: 'Grilled spiced cottage cheese chunks', category: 'Starters', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200' },
            { name: 'Hara Bhara Kebab', price: '180', description: 'Spiced patties made of spinach and peas', category: 'Starters', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=200' }
        ],
        'Desserts': [
            { name: 'Gulab Jamun', price: '80', description: 'Fried milk solids soaked in sugar syrup', category: 'Desserts', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=200' },
            { name: 'Rasmalai', price: '100', description: 'Cottage cheese balls in thickened milk', category: 'Desserts', image: 'https://images.unsplash.com/photo-1610427958994-3d922906b72a?w=200' }
        ],
        'Beverages': [
            { name: 'Sweet Lassi', price: '60', description: 'Traditional yogurt drink', category: 'Beverages', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=200' },
            { name: 'Mango Shake', price: '90', description: 'Fresh mango blended with milk', category: 'Beverages', image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=200' }
        ]
    },
    nonveg: {
        'North Indian': [
            { name: 'Chicken Curry', price: '300', description: 'Chicken cooked in home style gravy', category: 'North Indian', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200' },
            { name: 'Mutton Rogan Josh', price: '450', description: 'Aromatic lamb curry from Kashmir', category: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=200' }
        ],
        'Mughlai': [
            { name: 'Chicken Biryani', price: '350', description: 'Aromatic rice layered with spiced chicken', category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200' },
            { name: 'Butter Chicken', price: '320', description: 'Chicken in creamy tomato curry', category: 'Main Course', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200' },
            { name: 'Mutton Biryani', price: '400', description: 'Spiced rice with tender mutton pieces', category: 'Biryani', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=200' }
        ],
        'Chinese': [
            { name: 'Chicken Fried Rice', price: '250', description: 'Wok tossed rice with chicken and egg', category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f10842619?w=200' },
            { name: 'Chilli Chicken', price: '280', description: 'Batter fried chicken in spicy sauce', category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200' },
            { name: 'Chicken Hakka Noodles', price: '240', description: 'Noodles stir fried with chicken strips', category: 'Chinese', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=200' }
        ],
        'Italian': [
            { name: 'Pepperoni Pizza', price: '350', description: 'Classic pizza with pepperoni slices', category: 'Italian', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200' },
            { name: 'Chicken Pasta', price: '280', description: 'Pasta with grilled chicken in red sauce', category: 'Italian', image: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=200' },
            { name: 'BBQ Chicken Pizza', price: '380', description: 'Pizza topped with bbq chicken and onions', category: 'Italian', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200' }
        ],
        'Starters': [
            { name: 'Chicken Tikka', price: '280', description: 'Roasted marinated chicken chunks', category: 'Starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200' },
            { name: 'Fish Fry', price: '320', description: 'Crispy fried fish fillets', category: 'Starters', image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=200' },
            { name: 'Chicken Wings', price: '250', description: 'Spicy buffalo style chicken wings', category: 'Starters', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200' }
        ]
    }
};

interface NewItemFormData {
    name: string;
    price: string;
    description: string;
    category_id: string; 
    image_url?: string;
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
    
    // --- WIZARD STATE ---
    const [showWizard, setShowWizard] = useState(true);
    // 0: Select Type, 1: Select Cuisine, 2: Select Dish
    const [wizardStep, setWizardStep] = useState<0 | 1 | 2>(0); 
    const [wizardType, setWizardType] = useState<'veg' | 'nonveg'>('veg');
    const [wizardCuisine, setWizardCuisine] = useState<string>('');

    const [newModalFormData, setNewModalFormData] = useState<NewItemFormData>({ 
        name: '', 
        price: '0.00', 
        description: '',
        category_id: '',
        image_url: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            price: '0.00', 
            description: '',
            category_id: '',
            image_url: ''
        });
        setShowWizard(true);
        setWizardStep(0); 
        setIsAddModalVisible(true);
    };

    const closeAddModal = () => {
        setIsAddModalVisible(false);
    };

    // WIZARD NAVIGATION HANDLERS
    const handleTypeSelection = (type: 'veg' | 'nonveg') => {
        setWizardType(type);
        setWizardStep(1); // Go to Cuisine Selection
    };

    const handleCuisineSelection = (cuisine: string) => {
        setWizardCuisine(cuisine);
        setWizardStep(2); // Go to Dish Selection
    };

    const selectPredefinedDish = (dish: any) => {
        setNewModalFormData({
            name: dish.name,
            price: dish.price,
            description: dish.description,
            category_id: dish.category,
            image_url: dish.image 
        });
        setShowWizard(false); 
    };

    const selectCustomOption = (category?: string) => {
        setNewModalFormData({
            name: '',
            price: '',
            description: '',
            category_id: category || '', 
            image_url: ''
        });
        setShowWizard(false);
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
                image_url: image_url 
            };
            
            const response = await partnerAPI.restaurant.createMenuItem(newItemData); 
            
            if (response.success) {
                Alert.alert(t('success'), t('item_added_successfully'));
                
                // --- FIX: LOCAL UPDATE ONLY ---
                // Instead of calling fetchMenu(), we manually add the item to the list.
                // This prevents deleted items (that weren't deleted on server) from reappearing.
                const createdItem: ExtendedFoodItem = {
                    food_item_id: response.data?.food_item_id || Math.random().toString(), // Fallback ID if API doesn't return one
                    restaurant_id: 'current_user',
                    name: newName,
                    price: newPrice,
                    description: description,
                    category_id: newCategoryId,
                    is_available: true,
                    is_veg: true, // simplified for now
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
        wizardTypeContainer: { flexDirection: 'column', gap: 10, marginBottom: 20 },
        wizardTypeButton: { paddingVertical: 15, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', backgroundColor: theme === 'dark' ? '#292929' : '#fff' },
        wizardTypeActive: { backgroundColor: theme === 'dark' ? '#444' : '#fff', borderColor: DesignSystem.colors.primary[600] },
        wizardTypeText: { fontWeight: 'bold', color: theme === 'dark' ? '#AAA' : '#666', fontSize: 16 },
        wizardTypeTextActive: { color: DesignSystem.colors.primary[600] },
        cuisineScroll: { marginBottom: 20 },
        cuisineChip: { marginRight: 8, backgroundColor: theme === 'dark' ? '#292929' : '#f5f5f5' },
        cuisineChipSelected: { backgroundColor: DesignSystem.colors.primary[100] },
        dishesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
        dishCard: { width: '48%', backgroundColor: theme === 'dark' ? '#292929' : '#f9f9f9', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: theme === 'dark' ? '#333' : '#eee' },
        dishImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 8, backgroundColor: '#ddd' },
        dishName: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, color: theme === 'dark' ? '#FFF' : '#333' },
        dishPrice: { fontSize: 12, color: DesignSystem.colors.primary[600], fontWeight: 'bold' },
        otherOptionButton: { marginTop: 10, borderColor: DesignSystem.colors.primary[600], borderWidth: 1 },
        backToWizardButton: { marginBottom: 15, alignSelf: 'flex-start' },
        customImageContainer: { height: 150, backgroundColor: theme === 'dark' ? '#292929' : '#f0f0f0', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: theme === 'dark' ? '#444' : '#ddd', borderStyle: 'dashed', overflow: 'hidden' },
        customImageText: { color: theme === 'dark' ? '#888' : '#aaa', marginTop: 8 },
        addCustomCard: { width: '48%', backgroundColor: theme === 'dark' ? '#292929' : '#f0f8ff', borderRadius: 12, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: DesignSystem.colors.primary[200], borderStyle: 'dashed', minHeight: 150 },
        addCustomCardText: { color: DesignSystem.colors.primary[600], fontWeight: 'bold', marginTop: 8, textAlign: 'center', fontSize: 13 },
        cuisineCard: { width: '100%', padding: 15, marginBottom: 10, borderRadius: 10, backgroundColor: theme === 'dark' ? '#292929' : '#f9f9f9', borderWidth: 1, borderColor: theme === 'dark' ? '#444' : '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        cuisineCardText: { fontSize: 16, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333' }
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
                        <Text style={dynamicStyles.itemPrice}>₹{item.price.toFixed(2)}</Text>
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
                        {showWizard ? (
                            <>
                                {/* STEP 0: FOOD TYPE SELECTION */}
                                {wizardStep === 0 && (
                                    <>
                                        <Text style={dynamicStyles.modalTitle}>Select Food Type</Text>
                                        <View style={dynamicStyles.wizardTypeContainer}>
                                            <TouchableOpacity style={dynamicStyles.wizardTypeButton} onPress={() => handleTypeSelection('veg')}>
                                                <MaterialCommunityIcons name="leaf" size={24} color={DesignSystem.colors.success} style={{marginBottom: 8}} />
                                                <Text style={[dynamicStyles.wizardTypeText, {color: DesignSystem.colors.success}]}>PURE VEG</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={dynamicStyles.wizardTypeButton} onPress={() => handleTypeSelection('nonveg')}>
                                                <MaterialCommunityIcons name="food-drumstick" size={24} color={DesignSystem.colors.error} style={{marginBottom: 8}} />
                                                <Text style={[dynamicStyles.wizardTypeText, {color: DesignSystem.colors.error}]}>NON-VEG</Text>
                                            </TouchableOpacity>
                                            <Button mode="outlined" onPress={() => selectCustomOption()} style={dynamicStyles.otherOptionButton} icon="pencil-plus">Skip to Custom Order</Button>
                                        </View>
                                    </>
                                )}

                                {/* STEP 1: CUISINE SELECTION */}
                                {wizardStep === 1 && (
                                    <>
                                        <TouchableOpacity onPress={() => setWizardStep(0)} style={dynamicStyles.backToWizardButton}>
                                            <Text style={{ color: DesignSystem.colors.primary[600], fontWeight: 'bold' }}>← Back to Type Selection</Text>
                                        </TouchableOpacity>
                                        <Text style={dynamicStyles.modalTitle}>Select Cuisine</Text>
                                        <View style={{ marginBottom: 20 }}>
                                            {Object.keys(DUMMY_MENU_DATA[wizardType]).map((cuisine) => (
                                                <TouchableOpacity key={cuisine} style={dynamicStyles.cuisineCard} onPress={() => handleCuisineSelection(cuisine)}>
                                                    <Text style={dynamicStyles.cuisineCardText}>{cuisine}</Text>
                                                    <MaterialCommunityIcons name="chevron-right" size={24} color={DesignSystem.colors.primary[600]} />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </>
                                )}

                                {/* STEP 2: DISH SELECTION */}
                                {wizardStep === 2 && (
                                    <>
                                        <TouchableOpacity onPress={() => setWizardStep(1)} style={dynamicStyles.backToWizardButton}>
                                            <Text style={{ color: DesignSystem.colors.primary[600], fontWeight: 'bold' }}>← Back to Cuisines</Text>
                                        </TouchableOpacity>

                                        <Text style={[dynamicStyles.modalTitle, { fontSize: 16 }]}>{wizardCuisine} Dishes</Text>
                                        <View style={dynamicStyles.dishesGrid}>
                                            {/* @ts-ignore */}
                                            {DUMMY_MENU_DATA[wizardType][wizardCuisine]?.map((dish, index) => (
                                                <TouchableOpacity key={index} style={dynamicStyles.dishCard} onPress={() => selectPredefinedDish(dish)}>
                                                    <Image source={{ uri: dish.image }} style={dynamicStyles.dishImage} />
                                                    <Text style={dynamicStyles.dishName}>{dish.name}</Text>
                                                    <Text style={dynamicStyles.dishPrice}>₹{dish.price}</Text>
                                                </TouchableOpacity>
                                            ))}
                                            
                                            {/* ADD CUSTOM BUTTON IN EVERY CUISINE */}
                                            <TouchableOpacity style={dynamicStyles.addCustomCard} onPress={() => selectCustomOption(wizardCuisine)}>
                                                <MaterialCommunityIcons name="plus-circle-outline" size={32} color={DesignSystem.colors.primary[600]} />
                                                <Text style={dynamicStyles.addCustomCardText}>Add Custom {wizardCuisine} Item</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <TouchableOpacity onPress={() => { setShowWizard(true); setWizardStep(0); }} style={dynamicStyles.backToWizardButton}>
                                    <Text style={{ color: DesignSystem.colors.primary[600], fontWeight: 'bold' }}>← Start Over</Text>
                                </TouchableOpacity>
                                <Text style={dynamicStyles.modalTitle}>Add Item Details</Text>
                                <View style={dynamicStyles.customImageContainer}>
                                    {newModalFormData.image_url && newModalFormData.image_url.length > 5 ? (
                                        <Image source={{ uri: newModalFormData.image_url }} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="cover" />
                                    ) : (
                                        <>
                                            <MaterialCommunityIcons name="image" size={32} color={theme === 'dark' ? '#555' : '#ccc'} />
                                            <Text style={dynamicStyles.customImageText}>Preview will appear for valid URLs</Text>
                                        </>
                                    )}
                                </View>
                                <TextInput label="Image Link (URL)" placeholder="https://example.com/food.jpg" value={newModalFormData.image_url} onChangeText={(text) => setNewModalFormData(p => ({ ...p, image_url: text }))} mode="outlined" style={dynamicStyles.modalInput} autoCapitalize="none" />
                                <TextInput label={t('item_name')} value={newModalFormData.name} onChangeText={(name) => setNewModalFormData(p => ({ ...p, name }))} mode="outlined" style={dynamicStyles.modalInput} />
                                <TextInput label={t('price_currency')} value={newModalFormData.price} onChangeText={(price) => setNewModalFormData(p => ({ ...p, price }))} keyboardType="numeric" mode="outlined" style={dynamicStyles.modalInput} />
                                <TextInput label={t('category_id_label')} value={newModalFormData.category_id} onChangeText={(category_id) => setNewModalFormData(p => ({ ...p, category_id }))} mode="outlined" style={dynamicStyles.modalInput} />
                                <TextInput label={t('description_optional')} value={newModalFormData.description} onChangeText={(description) => setNewModalFormData(p => ({ ...p, description }))} mode="outlined" multiline numberOfLines={3} style={dynamicStyles.modalInput} />
                                <View style={dynamicStyles.modalActions}>
                                    <Button onPress={closeAddModal} mode="outlined" disabled={isSubmitting}>{t('cancel')}</Button>
                                    <Button onPress={handleAddSubmit} mode="contained" style={dynamicStyles.saveButton} loading={isSubmitting} disabled={isSubmitting}>{t('add_item')}</Button>
                                </View>
                            </>
                        )}
                    </ScrollView>
                </Modal>
            </Portal>
        </SafeAreaView>
    );
}