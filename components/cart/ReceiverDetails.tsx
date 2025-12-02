import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Text,
  Surface,
  TextInput,
  IconButton,
  Button,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { Address } from '../../app/profile/addressData';

interface ReceiverDetailsProps {
  selectedAddress: Address;
  receiverName: string;
  receiverPhone: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onEditAddress: () => void;
}

export default function ReceiverDetails({
  selectedAddress,
  receiverName,
  receiverPhone,
  onNameChange,
  onPhoneChange,
  onEditAddress,
}: ReceiverDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!receiverName.trim() || !receiverPhone.trim()) {
      return;
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderAddressInfo = () => (
    <View style={styles.addressInfo}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeSection}>
          <View style={[
            styles.typeIconContainer,
            { backgroundColor: selectedAddress.address_type === 'home' ? DesignSystem.colors.primary[500] : DesignSystem.colors.info }
          ]}>
            <MaterialCommunityIcons
              name={selectedAddress.address_type === 'home' ? 'home' : 'office-building'}
              size={16}
              color="white"
            />
          </View>
          <View style={styles.addressTypeInfo}>
            <Text style={styles.addressTypeName}>
              {selectedAddress.title}
            </Text>
            <Text style={styles.addressTypeLabel}>
              {selectedAddress.address_type === 'home' ? 'Home' : 'Office'}
            </Text>
          </View>
        </View>
        
        <IconButton
          icon="pencil"
          size={20}
          iconColor={DesignSystem.colors.primary[500]}
          onPress={onEditAddress}
        />
      </View>
      
      <View style={styles.addressContent}>
        <Text style={styles.addressText}>
          {selectedAddress.address_line1}, {selectedAddress.address_line2 || ''}
        </Text>
        <Text style={styles.addressText}>
          {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
        </Text>
        {selectedAddress.landmark && (
          <Text style={styles.landmarkText}>
            Near {selectedAddress.landmark}
          </Text>
        )}
      </View>
    </View>
  );

  const renderReceiverForm = () => (
    <View style={styles.receiverForm}>
      <Text style={styles.formTitle}>Receiver Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          mode="outlined"
          value={receiverName}
          onChangeText={onNameChange}
          placeholder="Enter receiver's name"
          style={styles.textInput}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
          left={<TextInput.Icon icon="account" />}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          mode="outlined"
          value={receiverPhone}
          onChangeText={onPhoneChange}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          style={styles.textInput}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
          left={<TextInput.Icon icon="phone" />}
        />
      </View>
      
      <View style={styles.formActions}>
        <Button
          mode="outlined"
          onPress={handleCancel}
          style={styles.cancelButton}
          textColor={DesignSystem.colors.text.secondary}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          buttonColor={DesignSystem.colors.primary[500]}
          disabled={!receiverName.trim() || !receiverPhone.trim()}
        >
          Save
        </Button>
      </View>
    </View>
  );

  const renderReceiverInfo = () => (
    <View style={styles.receiverInfo}>
      <View style={styles.receiverHeader}>
        <Text style={styles.receiverTitle}>Receiver Details</Text>
        <IconButton
          icon="pencil"
          size={20}
          iconColor={DesignSystem.colors.primary[500]}
          onPress={() => setIsEditing(true)}
        />
      </View>
      
      <View style={styles.receiverContent}>
        <View style={styles.receiverItem}>
          <MaterialCommunityIcons
            name="account"
            size={20}
            color={DesignSystem.colors.text.secondary}
          />
          <Text style={styles.receiverText}>{receiverName}</Text>
        </View>
        
        <View style={styles.receiverItem}>
          <MaterialCommunityIcons
            name="phone"
            size={20}
            color={DesignSystem.colors.text.secondary}
          />
          <Text style={styles.receiverText}>{receiverPhone}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Surface style={styles.container}>
      {renderAddressInfo()}
      
      {isEditing ? renderReceiverForm() : renderReceiverInfo()}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: DesignSystem.borderRadius.lg,
    ...DesignSystem.shadows.sm,
    marginBottom: DesignSystem.spacing.md,
  },
  
  // Address Info
  addressInfo: {
    padding: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.border.light,
  },
  addressHeader: {
    ...GlobalStyles.layout.rowSpaceBetween,
    marginBottom: DesignSystem.spacing.sm,
  },
  addressTypeSection: {
    ...GlobalStyles.layout.row,
    flex: 1,
  },
  typeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    ...GlobalStyles.layout.rowCenter,
    marginRight: DesignSystem.spacing.sm,
  },
  addressTypeInfo: {
    flex: 1,
  },
  addressTypeName: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
  },
  addressTypeLabel: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    marginTop: 2,
  },
  addressContent: {
    marginTop: DesignSystem.spacing.sm,
  },
  addressText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    lineHeight: DesignSystem.typography.fontSize.sm * DesignSystem.typography.lineHeight.normal,
    marginBottom: 2,
  },
  landmarkText: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.text.secondary,
    fontStyle: 'italic',
    marginTop: DesignSystem.spacing.xs,
  },
  
  // Receiver Form
  receiverForm: {
    padding: DesignSystem.spacing.md,
  },
  formTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.md,
  },
  inputContainer: {
    marginBottom: DesignSystem.spacing.md,
  },
  inputLabel: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
  },
  textInput: {
    backgroundColor: DesignSystem.colors.background.primary,
  },
  formActions: {
    ...GlobalStyles.layout.row,
    gap: DesignSystem.spacing.sm,
    marginTop: DesignSystem.spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderColor: DesignSystem.colors.border.medium,
  },
  saveButton: {
    flex: 1,
  },
  
  // Receiver Info
  receiverInfo: {
    padding: DesignSystem.spacing.md,
  },
  receiverHeader: {
    ...GlobalStyles.layout.rowSpaceBetween,
    marginBottom: DesignSystem.spacing.sm,
  },
  receiverTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
  },
  receiverContent: {
    gap: DesignSystem.spacing.sm,
  },
  receiverItem: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  receiverText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
});
