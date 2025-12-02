import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert, BackHandler, TouchableOpacity, Modal, Platform } from 'react-native';
import { TextInput, Button, Surface, Text, HelperText, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { isValidEmail } from '../../utils/helpers';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProfileScreen() {
  const { user, updateProfile, isLoading, clearError } = useAuthStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    date_of_birth: user?.date_of_birth || '',
    gender: user?.gender || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const genderOptions = [
    { label: 'Select Gender', value: '' },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      // Navigate back to profile screen
      router.back();
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.gender && !['male', 'female', 'other'].includes(formData.gender.toLowerCase())) {
      newErrors.gender = 'Please select a valid gender option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!passwordData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters';
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    clearError();
    // Prepare update data, only include fields that have values
    const updateData: any = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    // Only add optional fields if they have values
    if (formData.date_of_birth.trim()) {
      updateData.date_of_birth = formData.date_of_birth.trim();
    }
    
    if (formData.gender.trim() && ['male', 'female', 'other'].includes(formData.gender.trim().toLowerCase())) {
      updateData.gender = formData.gender.trim().toLowerCase();
    }

    // Sending profile update

    const result = await updateProfile(updateData);

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) return;

    clearError();
    // Note: Password change should use a separate endpoint
    // For now, we'll show an alert that this feature is coming soon
    Alert.alert('Coming Soon', 'Password change feature will be implemented soon!');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updatePasswordData = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      updateFormData('date_of_birth', formattedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Form Section */}
        <Surface style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <TextInput
            label="First Name"
            value={formData.first_name}
            onChangeText={(value) => updateFormData('first_name', value)}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
            error={!!errors.first_name}
          />
          <HelperText type="error" visible={!!errors.first_name}>
            {errors.first_name}
          </HelperText>

          <TextInput
            label="Last Name"
            value={formData.last_name}
            onChangeText={(value) => updateFormData('last_name', value)}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
            error={!!errors.last_name}
          />
          <HelperText type="error" visible={!!errors.last_name}>
            {errors.last_name}
          </HelperText>

          <TextInput
            label="Email Address"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
            error={!!errors.email}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            error={!!errors.phone}
          />
          <HelperText type="error" visible={!!errors.phone}>
            {errors.phone}
          </HelperText>

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              label="Date of Birth (Optional)"
              value={formData.date_of_birth}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="calendar" />}
              editable={false}
              placeholder="Tap to select date"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowGenderMenu(true)}>
            <TextInput
              label="Gender (Optional)"
              value={genderOptions.find(option => option.value === formData.gender)?.label || ''}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="gender-male-female" />}
              right={<TextInput.Icon icon="chevron-down" />}
              editable={false}
              placeholder="Select gender"
            />
          </TouchableOpacity>

          <Modal
            visible={showGenderMenu}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowGenderMenu(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowGenderMenu(false)}
            >
              <View style={styles.modalContent}>
                <Surface style={styles.dropdownContainer}>
                  <Text style={styles.dropdownTitle}>Select Gender</Text>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        updateFormData('gender', option.value);
                        setShowGenderMenu(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </Surface>
              </View>
            </TouchableOpacity>
          </Modal>
          <HelperText type="error" visible={!!errors.gender}>
            {errors.gender}
          </HelperText>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date_of_birth ? new Date(formData.date_of_birth) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              themeVariant="light"
              accentColor="#4F46E5"
              textColor="#4F46E5"
            />
          )}

          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading}
            style={styles.saveButton}
            contentStyle={styles.buttonContent}
          >
            Save Changes
          </Button>
        </Surface>

        {/* Password Change Section */}
        {/* <Surface style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <Button
            mode="outlined"
            onPress={() => setShowPasswordChange(!showPasswordChange)}
            style={styles.passwordButton}
            icon="lock"
          >
            {showPasswordChange ? 'Hide Password Change' : 'Change Password'}
          </Button>

          {showPasswordChange && (
            <>
              <Divider style={styles.divider} />
              
              <TextInput
                label="Current Password"
                value={passwordData.current_password}
                onChangeText={(value) => updatePasswordData('current_password', value)}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                error={!!errors.current_password}
              />
              <HelperText type="error" visible={!!errors.current_password}>
                {errors.current_password}
              </HelperText>

              <TextInput
                label="New Password"
                value={passwordData.new_password}
                onChangeText={(value) => updatePasswordData('new_password', value)}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                error={!!errors.new_password}
              />
              <HelperText type="error" visible={!!errors.new_password}>
                {errors.new_password}
              </HelperText>

              <TextInput
                label="Confirm New Password"
                value={passwordData.confirm_password}
                onChangeText={(value) => updatePasswordData('confirm_password', value)}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                error={!!errors.confirm_password}
              />
              <HelperText type="error" visible={!!errors.confirm_password}>
                {errors.confirm_password}
              </HelperText>

              <Button
                mode="contained"
                onPress={handlePasswordChange}
                loading={isLoading}
                disabled={isLoading}
                style={styles.passwordSaveButton}
                contentStyle={styles.buttonContent}
              >
                Change Password
              </Button>
            </>
          )}
        </Surface> */}

        {/* Danger Zone */}
        <Surface style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
          <Text style={styles.dangerZoneSubtitle}>
            These actions cannot be undone
          </Text>
          
          <Button
            mode="outlined"
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive', 
                    onPress: () => {
                      Alert.alert('Coming Soon', 'Account deletion feature will be implemented soon!');
                    }
                  }
                ]
              );
            }}
            style={styles.deleteButton}
            textColor="#EF4444"
            icon="delete-forever"
          >
            Delete Account
          </Button>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    margin: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  dangerZone: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ffebee',
    backgroundColor: '#fff5f5',
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  dangerZoneSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  deleteButton: {
    borderColor: '#EF4444',
  },
  addressInput: {
    height: 100, // Adjust height for multiline text input
  },
  passwordButton: {
    borderColor: '#4F46E5',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  passwordSaveButton: {
    backgroundColor: '#4F46E5',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 300,
  },
  dropdownContainer: {
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
}); 