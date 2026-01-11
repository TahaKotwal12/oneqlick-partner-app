import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  Checkbox,
  Divider,
  HelperText
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuthZustand';
import { useAuthStore } from '../../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isValidEmail, isValidPhone } from '../../utils/helpers';
import { UnifiedLoginInput } from '../../components/common';
import { GlobalStyles } from '../../styles/globalStyles';

interface LoginForm {
  identifier: string;
  password: string;
  rememberMe: boolean;
  identifierType: 'email' | 'phone' | 'unknown';
}

export default function LoginScreen() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    identifier: '',
    password: '',
    rememberMe: false,
    identifierType: 'unknown',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { googleSignIn } = useAuthStore();

  const router = useRouter();
  const { login } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!loginForm.identifier) {
      newErrors.identifier = 'Email or phone number is required';
    } else {
      // Auto-detect and validate based on input type
      if (loginForm.identifier.includes('@') || isValidEmail(loginForm.identifier)) {
        // Email validation
        if (!isValidEmail(loginForm.identifier)) {
          newErrors.identifier = 'Please enter a valid email address';
        }
      } else if (loginForm.identifier.startsWith('+') || /^[\d\s\-+()]+$/.test(loginForm.identifier)) {
        // Phone validation
        if (!isValidPhone(loginForm.identifier)) {
          newErrors.identifier = 'Please enter a valid phone number';
        }
      } else {
        newErrors.identifier = 'Please enter a valid email address or phone number';
      }
    }

    if (!loginForm.password) {
      newErrors.password = 'Password is required';
    } else if (loginForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(loginForm.identifier, loginForm.password);

      if (result?.success) {
        // Get user data from result
        const loginData: any = result;
        const user = loginData.data?.user || loginData.user;

        if (user) {
          // Validate user role before allowing access
          const { isRoleAllowed, getUnauthorizedRoleMessage } = await import('../../utils/roleValidator');

          if (!isRoleAllowed(user.role)) {
            // User is not a partner (restaurant owner or delivery partner) - deny access
            const { title, message } = getUnauthorizedRoleMessage(user.role);

            // Logout to clean up the session created by backend
            const { useAuthStore } = await import('../../store/authStore');
            await useAuthStore.getState().logout();

            Alert.alert(
              title,
              message,
              [{ text: 'OK' }]
            );

            // Don't navigate
            setIsLoading(false);
            return;
          }

          // User is a valid partner - save to store and proceed
          const { useAuthStore } = await import('../../store/authStore');
          useAuthStore.setState({
            user: user,
            isAuthenticated: true
          });
        }

        router.replace('/(tabs)');
      } else {
        const errorMessage = result?.error || 'Please check your email/phone and password and try again';

        // Check if the error is about email verification
        if (errorMessage.includes('verify your email') || errorMessage.includes('verification')) {
          Alert.alert(
            'Email Verification Required',
            'Please verify your email address before logging in. Check your email for verification instructions.',
            [
              {
                text: 'Check Email',
                onPress: () => {
                  // Navigate to OTP verification if we can determine the email
                  if (loginForm.identifierType === 'email') {
                    router.push({
                      pathname: '/(auth)/otp-verification',
                      params: {
                        email: loginForm.identifier,
                        type: 'email_verification'
                      }
                    });
                  }
                }
              },
              {
                text: 'Resend Verification',
                onPress: () => {
                  // TODO: Implement resend verification functionality
                  Alert.alert('Resend Verification', 'Please check your email for verification instructions or try signing up again.');
                }
              },
              { text: 'OK' }
            ]
          );
        } else {
          Alert.alert('Login Failed', errorMessage);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      const result = await googleSignIn();

      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setErrors({ general: result.error || 'Google sign-in failed' });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ general: 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };



  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    if (provider === 'google') {
      await handleGoogleSignIn();
    } else {
      Alert.alert(
        'Social Login',
        'Facebook login will be implemented soon!',
        [{ text: 'OK' }]
      );
    }
  };

  const getLoginButtonText = () => {
    return 'Sign In';
  };

  const updateLoginForm = (field: keyof LoginForm, value: string | boolean) => {
    setLoginForm(prev => {
      const newForm = { ...prev, [field]: value };

      // Auto-detect identifier type when identifier changes
      if (field === 'identifier' && typeof value === 'string') {
        if (value.includes('@') || isValidEmail(value)) {
          newForm.identifierType = 'email';
        } else if (value.startsWith('+') || /^[\d\s\-+()]+$/.test(value)) {
          newForm.identifierType = 'phone';
        } else {
          newForm.identifierType = 'unknown';
        }
      }

      return newForm;
    });

    // Clear error when user starts typing
    if (typeof value === 'string' && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };



  const renderLoginForm = () => (
    <View style={styles.formSection}>
      <UnifiedLoginInput
        value={loginForm.identifier}
        onChangeText={(value) => {
          updateLoginForm('identifier', value);
        }}
        label="Email or Phone Number"
        error={errors.identifier}
        returnKeyType="next"
      />

      <TextInput
        label="Password"
        value={loginForm.password}
        onChangeText={(value) => updateLoginForm('password', value)}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        error={!!errors.password}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={loginForm.rememberMe ? 'checked' : 'unchecked'}
          onPress={() => updateLoginForm('rememberMe', !loginForm.rememberMe)}
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={[GlobalStyles.layout.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[GlobalStyles.layout.container]}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[GlobalStyles.layout.containerPadded]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>oneQlick Partner</Text>
              <Text style={styles.tagline}>Partner Dashboard Login</Text>
            </View>
          </View>

          {/* Login Form */}
          <Surface style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Form Fields */}
            {renderLoginForm()}

            {/* Forgot Password */}
            <Button
              mode="text"
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPasswordButton}
              textColor="#4F46E5"
            >
              Forgot Password?
            </Button>

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              {getLoginButtonText()}
            </Button>

            {/* Social Login */}
            <View style={styles.socialLoginContainer}>
              <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
              </View>

              <View style={styles.socialButtons}>
                <Button
                  mode="outlined"
                  onPress={() => handleSocialLogin('google')}
                  style={styles.socialButton}
                  icon="google"
                  textColor="#DB4437"
                >
                  Google
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleSocialLogin('facebook')}
                  style={styles.socialButton}
                  icon="facebook"
                  textColor="#4267B2"
                >
                  Facebook
                </Button>
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <Button
                mode="text"
                onPress={() => router.push('/(auth)/signup')}
                style={styles.signupButton}
                textColor="#4F46E5"
              >
                Sign Up
              </Button>
            </View>
          </Surface>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
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
    padding: 24,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6B7280',
  },
  formSection: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rememberMeText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  socialLoginContainer: {
    marginBottom: 24,
  },
  dividerContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    width: '100%',
  },
  dividerText: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
    position: 'absolute',
    top: -10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderColor: '#E5E7EB',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#6B7280',
  },
  signupButton: {
    marginLeft: -8,
  },
});