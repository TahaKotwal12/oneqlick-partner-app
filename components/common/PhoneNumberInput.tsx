import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput as RNTextInput,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { TextInput, HelperText, Searchbar, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { countryCodes, CountryCode, defaultCountry } from '../../utils/countryCodes';

interface PhoneNumberInputProps {
  value: string;
  onChangeText: (phoneNumber: string, countryCode: CountryCode) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  style?: any;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'next' | 'search' | 'send' | 'go';
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function PhoneNumberInput({
  value,
  onChangeText,
  error,
  label = 'Phone Number',
  placeholder = 'Enter phone number',
  style,
  onSubmitEditing,
  returnKeyType = 'next',
  disabled = false,
}: PhoneNumberInputProps) {
  // Parse initial value to extract country code and phone number
  const parseInitialValue = (fullPhone: string) => {
    // Try to find a matching country code
    for (const country of countryCodes) {
      if (fullPhone.startsWith(country.dialCode)) {
        const phoneWithoutCode = fullPhone.substring(country.dialCode.length).replace(/\D/g, '');
        return { country, phoneNumber: phoneWithoutCode };
      }
    }
    
    // Default to the default country if no match found
    const cleanedPhone = fullPhone.replace(/\D/g, '');
    return { country: defaultCountry, phoneNumber: cleanedPhone };
  };

  const { country: initialCountry, phoneNumber: initialPhone } = parseInitialValue(value);
  
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(initialCountry);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const phoneInputRef = useRef<RNTextInput>(null);

  const filteredCountries = countryCodes.filter(
    country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
  );

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setModalVisible(false);
    setSearchQuery('');
    
    // Update the full phone number with new country code
    const fullNumber = `${country.dialCode} ${phoneNumber}`;
    onChangeText(fullNumber, country);
    
    // Focus back on phone input
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 100);
  };

  const handlePhoneNumberChange = (text: string) => {
    // Remove all non-digit characters
    const cleanedNumber = text.replace(/\D/g, '');
    
    // Limit to max length for the selected country
    const limitedNumber = cleanedNumber.slice(0, selectedCountry.maxLength);
    
    setPhoneNumber(limitedNumber);
    
    // Format the number for display
    const formattedNumber = formatPhoneNumber(limitedNumber, selectedCountry);
    const fullNumber = `${selectedCountry.dialCode} ${formattedNumber}`;
    
    onChangeText(fullNumber, selectedCountry);
  };

  const formatPhoneNumber = (number: string, country: CountryCode): string => {
    // Add country-specific formatting here if needed
    // For now, just return the number as is
    // You can implement specific formatting patterns for each country
    
    // Example for India: Format as XXXXX XXXXX
    if (country.code === 'IN' && number.length > 5) {
      return `${number.slice(0, 5)} ${number.slice(5)}`;
    }
    
    // Example for US/Canada: Format as XXX-XXX-XXXX
    if ((country.code === 'US' || country.code === 'CA') && number.length > 6) {
      return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`;
    }
    
    return number;
  };

  const renderCountryItem = ({ item }: { item: CountryCode }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleCountrySelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.dialCode}>{item.dialCode}</Text>
      </View>
      {selectedCountry.code === item.code && (
        <MaterialIcons name="check" size={20} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.countrySelector, disabled && styles.disabledSelector]}
          onPress={() => !disabled && setModalVisible(true)}
          activeOpacity={disabled ? 1 : 0.7}
          disabled={disabled}
        >
          <Text style={styles.selectedFlag}>{selectedCountry.flag}</Text>
          <Text style={styles.selectedDialCode}>{selectedCountry.dialCode}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={disabled ? "#ccc" : "#666"} />
        </TouchableOpacity>
        
        <TextInput
          ref={phoneInputRef}
          mode="outlined"
          label={label}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder={placeholder}
          keyboardType="phone-pad"
          style={styles.phoneInput}
          error={!!error}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          maxLength={selectedCountry.maxLength}
          disabled={disabled}
        />
      </View>
      
      {error && (
        <HelperText type="error" visible={!!error} style={styles.errorText}>
          {error}
        </HelperText>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Searchbar
              placeholder="Search country..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              iconColor="#666"
              inputStyle={styles.searchInput}
            />
            
            <FlatList
              data={filteredCountries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </Surface>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#F8FAFC',
  },
  disabledSelector: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  selectedFlag: {
    fontSize: 24,
    marginRight: 8,
  },
  selectedDialCode: {
    fontSize: 16,
    color: '#1F2937',
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  errorText: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '80%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
    elevation: 0,
    backgroundColor: '#F8FAFC',
  },
  searchInput: {
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  flag: {
    fontSize: 28,
    marginRight: 16,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  dialCode: {
    fontSize: 14,
    color: '#6B7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
}); 