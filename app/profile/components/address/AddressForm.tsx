import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';
import { AddressFormData, FormValidation } from '../../addressFormData';

interface AddressFormProps {
  formData: AddressFormData;
  validation: FormValidation;
  onInputChange: (field: keyof AddressFormData, value: string | boolean) => void;
}

export default function AddressForm({
  formData,
  validation,
  onInputChange,
}: AddressFormProps) {
  return (
    <View style={styles.formContainer}>
      <Text style={[GlobalStyles.typography.h6, styles.sectionTitle]}>Address Details</Text>

      {/* Title */}
      <View style={styles.formSection}>
        <Text style={[GlobalStyles.typography.body2, styles.formLabel]}>Address Title *</Text>
        <TextInput
          mode="outlined"
          value={formData.title}
          onChangeText={(text) => onInputChange('title', text)}
          placeholder="e.g., Home, Office, etc."
          style={[styles.textInput, !validation.title && formData.title && styles.errorInput]}
          error={!validation.title && formData.title !== ''}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
        />
        {!validation.title && formData.title && (
          <Text style={styles.errorText}>Address title is required</Text>
        )}
      </View>

      {/* Full Name */}
      <View style={styles.formSection}>
        <Text style={[GlobalStyles.typography.body2, styles.formLabel]}>Full Name *</Text>
        <TextInput
          mode="outlined"
          value={formData.full_name}
          onChangeText={(text) => onInputChange('full_name', text)}
          placeholder="e.g., John Doe"
          style={[styles.textInput, !validation.full_name && formData.full_name && styles.errorInput]}
          error={!validation.full_name && formData.full_name !== ''}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
        />
        {!validation.full_name && formData.full_name && (
          <Text style={styles.errorText}>Full name is required</Text>
        )}
      </View>

      {/* Phone Number */}
      <View style={styles.formSection}>
        <Text style={[GlobalStyles.typography.body2, styles.formLabel]}>Phone Number *</Text>
        <TextInput
          mode="outlined"
          value={formData.phone_number}
          onChangeText={(text) => onInputChange('phone_number', text)}
          placeholder="e.g., +91 98765-43210"
          keyboardType="phone-pad"
          style={[styles.textInput, !validation.phone_number && formData.phone_number && styles.errorInput]}
          error={!validation.phone_number && formData.phone_number !== ''}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
        />
        {!validation.phone_number && formData.phone_number && (
          <Text style={styles.errorText}>Please enter a valid phone number</Text>
        )}
      </View>

      {/* Address Line 1 */}
      <View style={styles.formSection}>
        <Text style={[GlobalStyles.typography.body2, styles.formLabel]}>Address Line 1 *</Text>
        <TextInput
          mode="outlined"
          value={formData.address_line1}
          onChangeText={(text) => onInputChange('address_line1', text)}
          placeholder="e.g., 123, Apartment 4B, MG Road"
          style={[styles.textInput, !validation.address_line1 && formData.address_line1 && styles.errorInput]}
          error={!validation.address_line1 && formData.address_line1 !== ''}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
        />
        {!validation.address_line1 && formData.address_line1 && (
          <Text style={styles.errorText}>Address line 1 is required</Text>
        )}
      </View>

      {/* Address Line 2 */}
      <View style={styles.formSection}>
        <Text style={[GlobalStyles.typography.body2, styles.formLabel]}>Address Line 2 (Optional)</Text>
        <TextInput
          mode="outlined"
          value={formData.address_line2}
          onChangeText={(text) => onInputChange('address_line2', text)}
          placeholder="e.g., MG Road, Civil Lines"
          style={styles.textInput}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
        />
      </View>

      {/* Landmark */}
      <View style={styles.formSection}>
        <Text style={[GlobalStyles.typography.body2, styles.formLabel]}>Landmark (Optional)</Text>
        <TextInput
          mode="outlined"
          value={formData.landmark}
          onChangeText={(text) => onInputChange('landmark', text)}
          placeholder="e.g., Near Temple, Opposite Bank"
          style={styles.textInput}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
        />
      </View>

      {/* City */}
      <View style={styles.formSection}>
        <Text style={[GlobalStyles.typography.body2, styles.formLabel]}>City *</Text>
        <TextInput
          mode="outlined"
          value={formData.city}
          onChangeText={(text) => onInputChange('city', text)}
          placeholder="Enter city"
          style={[styles.textInput, !validation.city && formData.city && styles.errorInput]}
          error={!validation.city && formData.city !== ''}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
        />
        {!validation.city && formData.city && (
          <Text style={styles.errorText}>City is required</Text>
        )}
      </View>

      {/* State */}
      <View style={styles.formSection}>
        <Text style={[GlobalStyles.typography.body2, styles.formLabel]}>State *</Text>
        <TextInput
          mode="outlined"
          value={formData.state}
          onChangeText={(text) => onInputChange('state', text)}
          placeholder="State will be auto-filled"
          style={[styles.textInput, !validation.state && formData.state && styles.errorInput]}
          error={!validation.state && formData.state !== ''}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
          editable={false}
        />
        {!validation.state && formData.state && (
          <Text style={styles.errorText}>State is required</Text>
        )}
      </View>

      {/* Postal Code */}
      <View style={styles.formSection}>
        <Text style={[GlobalStyles.typography.body2, styles.formLabel]}>Postal Code *</Text>
        <TextInput
          mode="outlined"
          value={formData.postal_code}
          onChangeText={(text) => onInputChange('postal_code', text)}
          placeholder="e.g., 249201"
          keyboardType="numeric"
          maxLength={6}
          style={[styles.textInput, !validation.postal_code && formData.postal_code && styles.errorInput]}
          error={!validation.postal_code && formData.postal_code !== ''}
          outlineColor={DesignSystem.colors.border.light}
          activeOutlineColor={DesignSystem.colors.primary[500]}
        />
        {!validation.postal_code && formData.postal_code && (
          <Text style={styles.errorText}>Please enter a valid 6-digit postal code</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionTitle: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  formSection: {
    marginBottom: DesignSystem.spacing.md,
  },
  formLabel: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  textInput: {
    backgroundColor: DesignSystem.colors.background.primary,
  },
  errorInput: {
    borderColor: DesignSystem.colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: DesignSystem.colors.error,
    fontSize: DesignSystem.typography.fontSize.xs,
    marginTop: DesignSystem.spacing.xs,
    marginLeft: DesignSystem.spacing.xs,
  },
});
