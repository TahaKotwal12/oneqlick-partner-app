// oneQlick/app/(tabs)/menu.tsx (Menu Management Screen - Task 7)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { getMenuItems } from '../../utils/mock'; 

// *** Data Interfaces (Should match menu_items.json structure) ***
interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    is_available: boolean; // Checklist: Toggle availability
}

// --- Helper Component: Menu Item Row ---
const MenuItemRow = ({ item, onToggleAvailability, onEdit }: { 
    item: MenuItem, 
    onToggleAvailability: (id: string, isAvailable: boolean) => void,
    onEdit: (item: MenuItem) => void
}) => (
    <View style={menuStyles.card}>
        <View style={menuStyles.infoContainer}>
            <Text style={menuStyles.itemName}>{item.name}</Text>
            <Text style={menuStyles.itemPrice}>${item.price.toFixed(2)}</Text>
            <Text style={menuStyles.itemDescription} numberOfLines={2}>{item.description}</Text>
        </View>

        <View style={menuStyles.actionsContainer}>
            <Text style={menuStyles.availabilityLabel}>
                {item.is_available ? 'Available' : 'Unavailable'}
            </Text>
            
            {/* Checklist: Toggle availability */}
            <Switch
                trackColor={{ false: "#767577", true: "#4CAF50" }}
                thumbColor={item.is_available ? "#f4f3f4" : "#f4f3f4"}
                onValueChange={() => onToggleAvailability(item.id, !item.is_available)}
                value={item.is_available}
                style={menuStyles.switch}
            />

            {/* Checklist: Edit modal trigger */}
            <TouchableOpacity 
                onPress={() => onEdit(item)}
                style={menuStyles.editButton}
            >
                <MaterialIcons name="edit" size={20} color="#007AFF" />
            </TouchableOpacity>
        </View>
    </View>
);

// --- Main Component ---
export default function MenuManagementScreen() {
    // FIX: Initialize state with an empty array of the correct interface type
    const [menu, setMenu] = useState<MenuItem[]>([]); 
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Load initial data
    useEffect(() => {
        // Ensure getMenuItems() is implemented in utils/mock.ts
        setMenu(getMenuItems() as MenuItem[]);
    }, []);

    // Checklist: Toggle availability (updates local state)
    const handleToggleAvailability = useCallback((id: string, isAvailable: boolean) => {
        setMenu(prevMenu => 
            prevMenu.map(item => 
                item.id === id ? { ...item, is_available: isAvailable } : item
            )
        );
        Alert.alert("Status Updated", `${menu.find(i => i.id === id)?.name} is now ${isAvailable ? 'Available' : 'Unavailable'}.`);
    }, [menu]);

    // Checklist: Edit modal (opens modal)
    const handleEditItem = useCallback((item: MenuItem) => {
        setSelectedItem(item);
        setIsEditModalVisible(true);
    }, []);

    // Placeholder for saving the edited item from the modal
    const handleSaveEdit = useCallback((editedItem: MenuItem) => {
        setMenu(prevMenu => 
            prevMenu.map(item => 
                item.id === editedItem.id ? editedItem : item
            )
        );
        setIsEditModalVisible(false);
        setSelectedItem(null);
        Alert.alert("Success", `${editedItem.name} updated successfully.`);
    }, []);

    const EditItemModal = () => {
        if (!selectedItem || !isEditModalVisible) return null;

        // In a real app, this would be a sophisticated modal form.
        return (
            <View style={menuStyles.modalOverlay}>
                <View style={menuStyles.modalContent}>
                    <Text style={menuStyles.modalTitle}>Editing: {selectedItem.name}</Text>
                    {/* Placeholder for form inputs */}
                    <Text style={menuStyles.modalPlaceholder}>
                        [Form Inputs Go Here to edit Name, Price, Description]
                    </Text>
                    
                    <View style={menuStyles.modalButtons}>
                        <TouchableOpacity onPress={() => setIsEditModalVisible(false)} style={[menuStyles.modalButton, { backgroundColor: '#ccc' }]}>
                            <Text style={{ color: '#000' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSaveEdit(selectedItem)} style={[menuStyles.modalButton, { backgroundColor: '#4CAF50' }]}>
                            <Text style={{ color: '#fff' }}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <AppHeader title="Menu Management 📝" showBack={false} />
            <ScrollView style={styles.content}>
                
                <Text style={styles.sectionTitle}>Total Items ({menu.length})</Text>
                
                {/* Checklist: List menu_items.json */}
                {menu.map(item => (
                    <MenuItemRow 
                        key={item.id} 
                        item={item} 
                        onToggleAvailability={handleToggleAvailability}
                        onEdit={handleEditItem}
                    />
                ))}

                <View style={{ height: 50 }} />
            </ScrollView>
            
            <EditItemModal />
        </View>
    );
}

// --- Styles ---

const menuStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    infoContainer: {
        flex: 3,
        paddingRight: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginVertical: 4,
    },
    itemDescription: {
        fontSize: 12,
        color: '#777',
    },
    actionsContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    availabilityLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginRight: 8,
        color: '#777',
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    editButton: {
        padding: 8,
        marginLeft: 10,
    },
    // Modal Styles (simplified for mock implementation)
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalPlaceholder: {
        fontSize: 14,
        color: '#999',
        height: 60,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '100%',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    }
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 15 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 10 },
});