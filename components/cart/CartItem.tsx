import React from 'react';
import { View, StyleSheet, Image, Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CartItemProps {
  item: any;
  onQuantityChange: (itemId: string, increment: boolean) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  if (!item || !item.foodItem) {
    return null;
  }

  const totalPrice = (item.foodItem.price || 0) * (item.quantity || 1);
  const addOnsTotal = (item.addOns || []).reduce((sum: number, addOn: any) => sum + (addOn?.price || 0), 0);
  const itemTotal = totalPrice + addOnsTotal;

  return (
    <View style={styles.cartItem}>
      {/* Food Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.foodItem.image }} 
          style={styles.foodImage}
          defaultSource={require('../../assets/icon.png')}
        />
        
        {/* Veg/Non-veg Indicator */}
        <View style={[
          styles.vegIndicator,
          { backgroundColor: item.foodItem.isVeg ? '#4CAF50' : '#F44336' }
        ]}>
          <MaterialCommunityIcons 
            name={item.foodItem.isVeg ? 'leaf' : 'food-drumstick'} 
            size={10} 
            color="#fff" 
          />
        </View>
      </View>

      {/* Food Details */}
      <View style={styles.foodDetails}>
        <View style={styles.headerRow}>
          <Text style={styles.foodName} numberOfLines={2}>
            {item.foodItem.name || 'Food Item'}
          </Text>
          
          <Pressable style={styles.removeButton} onPress={() => onRemove(item.id)}>
            <MaterialCommunityIcons name="close" size={16} color="#F44336" />
          </Pressable>
        </View>
        
        {item.foodItem.description && (
          <Text style={styles.foodDescription} numberOfLines={1}>
            {item.foodItem.description}
          </Text>
        )}

        {/* Add-ons */}
        {item.addOns && item.addOns.length > 0 && (
          <View style={styles.addOnsContainer}>
            <Text style={styles.addOnsLabel}>Add-ons:</Text>
            {item.addOns.map((addOn: any, index: number) => (
              <View key={index} style={styles.addOnItem}>
                <MaterialCommunityIcons name="plus-circle" size={12} color="#4F46E5" />
                <Text style={styles.addOnText}>
                  {addOn.name} (+₹{addOn.price})
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Price and Quantity Row */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.foodPrice}>₹{item.foodItem.price || 0}</Text>
            {item.foodItem.originalPrice && item.foodItem.originalPrice > item.foodItem.price && (
              <Text style={styles.originalPrice}>₹{item.foodItem.originalPrice}</Text>
            )}
          </View>

          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <Pressable
              style={styles.quantityButton}
              onPress={() => onQuantityChange(item.id, false)}
            >
              <MaterialCommunityIcons name="minus" size={16} color="#4F46E5" />
            </Pressable>
            
            <Text style={styles.quantityText}>
              {item.quantity || 1}
            </Text>
            
            <Pressable
              style={styles.quantityButton}
              onPress={() => onQuantityChange(item.id, true)}
            >
              <MaterialCommunityIcons name="plus" size={16} color="#4F46E5" />
            </Pressable>
          </View>
        </View>

        {/* Item Total */}
        <View style={styles.itemTotalContainer}>
          <Text style={styles.itemTotalLabel}>Item Total:</Text>
          <Text style={styles.itemTotalPrice}>₹{itemTotal.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  vegIndicator: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  foodDetails: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    lineHeight: 20,
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: '#FFF5F5',
    padding: 6,
    borderRadius: 12,
  },
  foodDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  addOnsContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addOnsLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addOnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  addOnText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  itemTotalLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
});
