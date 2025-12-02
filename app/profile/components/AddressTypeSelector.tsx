import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Text,
  Menu,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {
  addressTypes,
  getAddressTypeIcon,
  getAddressTypeColor,
  getAddressTypeName,
} from '../addressData';

interface AddressTypeSelectorProps {
  selectedType: 'home' | 'office' | 'other';
  onTypeChange: (type: 'home' | 'office' | 'other') => void;
}

export default function AddressTypeSelector({ selectedType, onTypeChange }: AddressTypeSelectorProps) {
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Address Type</Text>
      <Menu
        visible={showTypeMenu}
        onDismiss={() => setShowTypeMenu(false)}
        anchor={
          <Pressable
            style={styles.typeSelector}
            onPress={() => setShowTypeMenu(true)}
          >
            <MaterialIcons 
              name={getAddressTypeIcon(selectedType)}
              size={24} 
              color={getAddressTypeColor(selectedType)} 
            />
            <Text style={styles.typeSelectorText}>
              {getAddressTypeName(selectedType)}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
          </Pressable>
        }
      >
        {addressTypes.map((type) => (
          <Menu.Item
            key={type.id}
            onPress={() => {
              onTypeChange(type.id as 'home' | 'office' | 'other');
              setShowTypeMenu(false);
            }}
            title={type.name}
            leadingIcon={() => (
              <MaterialIcons
                name={type.icon}
                size={20}
                color={type.color}
              />
            )}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  typeSelectorText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
});
