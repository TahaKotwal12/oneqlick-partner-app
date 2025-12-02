import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Checkbox,
  HelperText,
  Avatar,
  SegmentedButtons,
  RadioButton
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuthZustand';
import { useAuthStore } from '../../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  isValidEmail,
} from '../../utils/helpers';
import { PhoneNumberInput } from '../../components/common';
import { CountryCode } from '../../utils/countryCodes';
import * as ImagePicker from 'expo-image-picker';

type UserRole = 'restaurant_owner' | 'delivery_partner';

interface SignupForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  profilePicture?: string;

  // Partner specific fields
  role: UserRole;
  restaurantName?: string;
  cuisineType?: string;
  fssaiLicense?: string;
  vehicleType?: string;
  licenseNumber?: string;
}


export default function SignupScreen() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    role: 'restaurant_owner',
    vehicleType: 'motorcycle'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { signup } = useAuth();
  const { resetOtpResendAttempts } = useAuthStore();
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset OTP resend attempts when component mounts
  useEffect(() => {
    resetOtpResendAttempts();
  }, [resetOtpResendAttempts]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // First name validation
    if (!signupForm.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!signupForm.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Phone validation
    if (!signupForm.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (signupForm.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    // Email validation
    if (!signupForm.email) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(signupForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!signupForm.password) {
      newErrors.password = 'Password is required';
    } else if (signupForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role specific validation
    if (signupForm.role === 'restaurant_owner') {
      if (!signupForm.restaurantName?.trim()) {
        newErrors.restaurantName = 'Restaurant name is required';
      }
      if (!signupForm.cuisineType?.trim()) {
        newErrors.cuisineType = 'Cuisine type is required';
      }
    } else {
      if (!signupForm.licenseNumber?.trim()) {
        newErrors.licenseNumber = 'Driving license number is required';
      }
    }

    // Terms validation
    if (!signupForm.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = async () => {
    if (!validateForm()) return;

    if (isSignupLoading) return;

    try {
      setIsSignupLoading(true);
      setErrors({});

      const additionalData = signupForm.role === 'restaurant_owner'
        ? {
          restaurant_name: signupForm.restaurantName,
          cuisine_type: signupForm.cuisineType,
          fssai_license: signupForm.fssaiLicense
        }
        : {
          vehicle_type: signupForm.vehicleType,
          license_number: signupForm.licenseNumber
        };

      // Call the actual signup API
      const result = await signup({
        first_name: signupForm.firstName.trim(),
        last_name: signupForm.lastName.trim(),
        email: signupForm.email.trim(),
        phone: signupForm.phone.trim(),
        password: signupForm.password,
        role: signupForm.role,
        additional_data: additionalData
      });

      if (result.success) {
        // Directly navigate to OTP verification screen
        router.push({
          pathname: '/(auth)/otp-verification',
          params: {
            email: signupForm.email.trim(),
            type: 'email_verification'
          }
        });
      } else {
        Alert.alert('Error', result.error || 'Failed to create account. Please try again.');
      }

    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsSignupLoading(false);
    }
  };

  const pickProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSignupForm(prev => ({ ...prev, profilePicture: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const updateForm = (field: keyof SignupForm, value: any) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const renderSignupForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Partner Registration</Text>
      <Text style={styles.formDescription}>Join oneQlick as a partner</Text>

      <SegmentedButtons
        value={signupForm.role}
        onValueChange={value => updateForm('role', value)}
        buttons={[
          {
            value: 'restaurant_owner',
            label: 'Restaurant',
            icon: 'store',
          },
          {
            value: 'delivery_partner',
            label: 'Delivery',
            icon: 'bike',
          },
        ]}
        style={styles.roleSelector}
      />

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        {signupForm.profilePicture ? (
          <Avatar.Image
            size={80}
            source={{ uri: signupForm.profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <Avatar.Text
            size={80}
            label={signupForm.firstName ? signupForm.firstName.charAt(0) : (signupForm.role === 'restaurant_owner' ? 'R' : 'D')}
            style={styles.profilePicture}
            color="white"
            labelStyle={{ fontSize: 32, fontWeight: 'bold' }}
          />
        )}
        <Button
          mode="outlined"
          onPress={pickProfilePicture}
          style={styles.changePhotoButton}
          icon="camera"
        >
          {signupForm.profilePicture ? 'Change Photo' : 'Add Photo'}
        </Button>
      </View>

      {/* Common Fields */}
      <TextInput
        label="First Name"
        value={signupForm.firstName}
        onChangeText={(value) => updateForm('firstName', value)}
        mode="outlined"
        style={styles.input}
        error={!!errors.firstName}
      />
      <HelperText type="error" visible={!!errors.firstName}>{errors.firstName}</HelperText>

      <TextInput
        label="Last Name"
        value={signupForm.lastName}
        onChangeText={(value) => updateForm('lastName', value)}
        mode="outlined"
        style={styles.input}
        error={!!errors.lastName}
      />
      <HelperText type="error" visible={!!errors.lastName}>{errors.lastName}</HelperText>

      <PhoneNumberInput
        value={signupForm.phone}
        onChangeText={(phone, country) => {
          updateForm('phone', phone);
          setSelectedCountry(country);
        }}
        label="Phone Number"
        error={errors.phone}
      />

      <TextInput
        label="Email Address"
        value={signupForm.email}
        onChangeText={(value) => updateForm('email', value)}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        error={!!errors.email}
      />
      <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

      {/* Role Specific Fields */}
      {signupForm.role === 'restaurant_owner' ? (
        <>
          <Text style={styles.sectionTitle}>Restaurant Details</Text>
          <TextInput
            label="Restaurant Name"
            value={signupForm.restaurantName}
            onChangeText={(value) => updateForm('restaurantName', value)}
            mode="outlined"
            style={styles.input}
            error={!!errors.restaurantName}
          />
          <HelperText type="error" visible={!!errors.restaurantName}>{errors.restaurantName}</HelperText>

          <TextInput
            label="Cuisine Type (e.g. Italian, Indian)"
            value={signupForm.cuisineType}
            onChangeText={(value) => updateForm('cuisineType', value)}
            mode="outlined"
            style={styles.input}
            error={!!errors.cuisineType}
          />
          <HelperText type="error" visible={!!errors.cuisineType}>{errors.cuisineType}</HelperText>

          <TextInput
            label="FSSAI License (Optional)"
            value={signupForm.fssaiLicense}
            onChangeText={(value) => updateForm('fssaiLicense', value)}
            mode="outlined"
            style={styles.input}
          />
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <View style={styles.radioGroup}>
            <Text>Vehicle Type:</Text>
            <RadioButton.Group onValueChange={value => updateForm('vehicleType', value)} value={signupForm.vehicleType || 'motorcycle'}>
              <View style={styles.radioItem}>
                <RadioButton value="bicycle" />
                <Text>Bicycle</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="motorcycle" />
                <Text>Motorcycle</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="car" />
                <Text>Car</Text>
              </View>
            </RadioButton.Group>
          </View>

          <TextInput
            label="Driving License Number"
            value={signupForm.licenseNumber}
            onChangeText={(value) => updateForm('licenseNumber', value)}
            mode="outlined"
            style={styles.input}
            error={!!errors.licenseNumber}
          />
          <HelperText type="error" visible={!!errors.licenseNumber}>{errors.licenseNumber}</HelperText>
        </>
      )}

      {/* Password */}
      <TextInput
        label="Password"
        value={signupForm.password}
        onChangeText={(value) => updateForm('password', value)}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
        error={!!errors.password}
      />
      <HelperText type="error" visible={!!errors.password}>{errors.password}</HelperText>

      <TextInput
        label="Confirm Password"
        value={signupForm.confirmPassword}
        onChangeText={(value) => updateForm('confirmPassword', value)}
        mode="outlined"
        secureTextEntry={!showConfirmPassword}
        style={styles.input}
        right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
        error={!!errors.confirmPassword}
      />
      <HelperText type="error" visible={!!errors.confirmPassword}>{errors.confirmPassword}</HelperText>

      {/* Terms */}
      <View style={styles.termsContainer}>
        <Checkbox
          status={signupForm.termsAccepted ? 'checked' : 'unchecked'}
          onPress={() => updateForm('termsAccepted', !signupForm.termsAccepted)}
        />
        <Text style={styles.termsText}>
          I agree to the Terms & Conditions and Privacy Policy
        </Text>
      </View>
      <HelperText type="error" visible={!!errors.termsAccepted}>{errors.termsAccepted}</HelperText>

      <Button
        mode="contained"
        onPress={handleSignupSubmit}
        loading={isSignupLoading}
        disabled={isSignupLoading}
        style={styles.signupButton}
        contentStyle={styles.buttonContent}
      >
        {isSignupLoading ? 'Creating Account...' : 'Create Partner Account'}
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>oneQlick Partner</Text>
              <Text style={styles.tagline}>Grow your business with us</Text>
            </View>
          </View>

          {renderSignupForm()}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Button
              mode="text"
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginButton}
              textColor="#4F46E5"
            >
              Sign In
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
  },
  formDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6B7280',
  },
  roleSelector: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#374151',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicture: {
    marginBottom: 16,
  },
  changePhotoButton: {
    borderColor: '#4F46E5',
  },
  input: {
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    marginTop: 16,
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  signupButton: {
    backgroundColor: '#4F46E5',
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#6B7280',
  },
  loginButton: {
    marginLeft: -8,
  },
});