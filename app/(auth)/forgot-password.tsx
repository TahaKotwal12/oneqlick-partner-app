import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, Chip, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhoneNumberInput } from '../../components/common';
import { CountryCode } from '../../utils/countryCodes';
import { isValidEmail, isValidPhoneWithCountry } from '../../utils/helpers';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { useAuthStore } from '../../store/authStore';

type ResetMethod = 'email' | 'phone';

interface ForgotPasswordForm {
  identifier: string;
  method: ResetMethod;
}

interface OTPForm {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const { width } = Dimensions.get('window');
const OTP_LENGTH = 6;
const MODAL_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function ForgotPasswordScreen() {
  const [form, setForm] = useState<ForgotPasswordForm>({
    identifier: '',
    method: 'email'
  });
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpForm, setOtpForm] = useState<OTPForm>({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [otpErrors, setOtpErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(MODAL_TIMEOUT);
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  
  const router = useRouter();
  const inputRefs = useRef<any[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const modalScaleAnimation = useRef(new Animated.Value(0)).current;
  const { forgotPassword, verifyResetOTP, resetPassword } = useAuthStore();

  // Timer for OTP modal expiration
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (showOTPModal && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            setShowOTPModal(false);
            setOtpForm({ otp: '', newPassword: '', confirmPassword: '' });
            setOtpErrors({});
            Alert.alert('Session Expired', 'The OTP session has expired. Please request a new OTP.');
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [showOTPModal, timeRemaining]);

  // Modal animation
  useEffect(() => {
    if (showOTPModal) {
      Animated.spring(modalScaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(modalScaleAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showOTPModal]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.identifier) {
      newErrors.identifier = `${form.method === 'email' ? 'Email' : 'Phone number'} is required`;
    } else if (form.method === 'email' && !isValidEmail(form.identifier)) {
      newErrors.identifier = 'Please enter a valid email address';
    } else if (form.method === 'phone' && selectedCountry && !isValidPhoneWithCountry(form.identifier, selectedCountry.dialCode, selectedCountry.maxLength)) {
      newErrors.identifier = `Please enter a valid ${selectedCountry.name} phone number`;
    }

    setError(newErrors.identifier || '');
    return Object.keys(newErrors).length === 0;
  };

  const validateOTPForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!otpForm.otp) {
      newErrors.otp = 'OTP is required';
    } else if (otpForm.otp.length !== OTP_LENGTH) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    if (!otpForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (otpForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(otpForm.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!otpForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (otpForm.newPassword !== otpForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setOtpErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerificationCode = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Only support email for now (phone support can be added later)
      if (form.method !== 'email') {
        setError('Phone number reset is not supported yet. Please use email.');
        return;
      }

      const result = await forgotPassword(form.identifier);
      
      if (result.success) {
        setMessage(`Verification code sent to your ${form.method}`);
        setShowOTPModal(true);
        setTimeRemaining(MODAL_TIMEOUT);
      } else {
        setError(result.error || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('Failed to send verification code:', err);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (value: string, index: number) => {
    const newOtp = [...otpForm.otp.split('')];
    newOtp[index] = value;
    setOtpForm(prev => ({ ...prev, otp: newOtp.join('') }));
    
    // Clear error when user types
    if (otpErrors.otp) {
      setOtpErrors(prev => ({ ...prev, otp: '' }));
    }

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otpForm.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResetPassword = async () => {
    if (!validateOTPForm()) return;

    setIsOTPLoading(true);

    try {
      // First verify the OTP
      const verifyResult = await verifyResetOTP(otpForm.otp, form.identifier);
      
      if (!verifyResult.success) {
        throw new Error(verifyResult.error || 'Invalid OTP. Please try again.');
      }

      // Then reset the password
      const resetResult = await resetPassword(otpForm.otp, form.identifier, otpForm.newPassword);
      
      if (resetResult.success) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully. You can now login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowOTPModal(false);
                router.replace('/(auth)/login');
              }
            }
          ]
        );
      } else {
        throw new Error(resetResult.error || 'Password reset failed. Please try again.');
      }
    } catch (err) {
      handleOTPError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setIsOTPLoading(false);
    }
  };

  const handleOTPError = (errorMessage: string) => {
    setOtpErrors(prev => ({ ...prev, otp: errorMessage }));
    
    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Clear OTP on error
    setOtpForm(prev => ({ ...prev, otp: '' }));
    
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  };

  const updateForm = (field: keyof ForgotPasswordForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (typeof value === 'string' && error) {
      setError('');
    }
  };

  const updateOTPForm = (field: keyof OTPForm, value: string) => {
    setOtpForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (otpErrors[field]) {
      setOtpErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (password.length < 6) return { strength: 'Weak', color: DesignSystem.colors.error };
    if (password.length < 8) return { strength: 'Fair', color: DesignSystem.colors.warning };
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 'Strong', color: DesignSystem.colors.success };
    return { strength: 'Good', color: DesignSystem.colors.info };
  };

  const renderMethodTabs = () => (
    <View style={styles.methodTabs}>
      <Chip
        mode={form.method === 'email' ? 'flat' : 'outlined'}
        onPress={() => updateForm('method', 'email')}
        style={[styles.methodTab, form.method === 'email' && styles.activeMethodTab]}
        textStyle={form.method === 'email' ? styles.activeMethodText : styles.methodText}
      >
        Email
      </Chip>
      <Chip
        mode={form.method === 'phone' ? 'flat' : 'outlined'}
        onPress={() => updateForm('method', 'phone')}
        style={[styles.methodTab, form.method === 'phone' && styles.activeMethodTab]}
        textStyle={form.method === 'phone' ? styles.activeMethodText : styles.methodText}
      >
        Phone
      </Chip>
    </View>
  );

  const renderOTPInputs = () => {
    const otpArray = otpForm.otp.split('').concat(Array(OTP_LENGTH - otpForm.otp.length).fill(''));
    
    return (
      <Animated.View 
        style={[
          styles.otpContainer,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        {otpArray.map((digit, index) => (
          <TextInput
            key={`otp-input-${index}-${digit}`}
            ref={(ref: any) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpInput,
              digit && styles.otpInputFilled,
              otpErrors.otp && styles.otpInputError
            ]}
            contentStyle={{
              textAlign: 'center',
              textAlignVertical: 'center',
            }}
            value={digit}
            onChangeText={(value) => handleOTPChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            returnKeyType={index === OTP_LENGTH - 1 ? 'done' : 'next'}
            onSubmitEditing={() => {
              if (index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
              }
            }}
          />
        ))}
      </Animated.View>
    );
  };

  const renderOTPModal = () => {
    if (!showOTPModal) return null;

    const passwordStrength = getPasswordStrength(otpForm.newPassword);

    return (
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ scale: modalScaleAnimation }] }
          ]}
        >
          <Surface style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Text style={styles.modalSubtitle}>
                Enter the verification code sent to your {form.method}
              </Text>
              <Text style={styles.timerText}>
                Session expires in: {formatTime(timeRemaining)}
              </Text>
            </View>

            <View style={styles.modalBody}>
              {/* OTP Input */}
              <View style={styles.otpSection}>
                <Text style={styles.otpLabel}>Verification Code</Text>
                {renderOTPInputs()}
                {Boolean(otpErrors.otp) && (
                  <HelperText type="error" visible={Boolean(otpErrors.otp)}>
                    {otpErrors.otp}
                  </HelperText>
                )}
              </View>

              {/* New Password */}
              <TextInput
                label="New Password"
                value={otpForm.newPassword}
                onChangeText={(value) => updateOTPForm('newPassword', value)}
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
                error={!!otpErrors.newPassword}
              />
              {Boolean(otpErrors.newPassword) && (
                <HelperText type="error" visible={Boolean(otpErrors.newPassword)}>
                  {otpErrors.newPassword}
                </HelperText>
              )}

              {/* Password Strength Indicator */}
              {Boolean(otpForm.newPassword) && (
                <View style={styles.passwordStrengthContainer}>
                  <Text style={styles.passwordStrengthLabel}>Password Strength:</Text>
                  <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.strength}
                  </Text>
                </View>
              )}

              {/* Confirm Password */}
              <TextInput
                label="Confirm New Password"
                value={otpForm.confirmPassword}
                onChangeText={(value) => updateOTPForm('confirmPassword', value)}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon 
                    icon={showConfirmPassword ? 'eye-off' : 'eye'} 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                error={!!otpErrors.confirmPassword}
              />
              {Boolean(otpErrors.confirmPassword) && (
                <HelperText type="error" visible={Boolean(otpErrors.confirmPassword)}>
                  {otpErrors.confirmPassword}
                </HelperText>
              )}

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <Button
                  mode="contained"
                  onPress={handleResetPassword}
                  loading={isOTPLoading}
                  disabled={isOTPLoading}
                  style={styles.resetButton}
                  contentStyle={styles.buttonContent}
                >
                  Reset Password
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => {
                    setShowOTPModal(false);
                    setOtpForm({ otp: '', newPassword: '', confirmPassword: '' });
                    setOtpErrors({});
                  }}
                  style={styles.cancelButton}
                  contentStyle={styles.buttonContent}
                >
                  Cancel
                </Button>
              </View>

              {/* Help Text */}
              <View style={styles.helpContainer}>
                <Text style={styles.helpText}>
                  💡 Check your email for the verification code
                </Text>
              </View>
            </View>
          </Surface>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[GlobalStyles.layout.container]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>oneQlick</Text>
          <Text style={styles.tagline}>Reset your password</Text>
        </View>

        <Surface style={styles.formContainer}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your {form.method} and we'll send you a verification code to reset your password.
          </Text>

          {/* Method Selection Tabs */}
          {renderMethodTabs()}

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}

          {/* Input Field */}
          {form.method === 'phone' ? (
            <PhoneNumberInput
              value={form.identifier}
              onChangeText={(phone, country) => {
                updateForm('identifier', phone);
                setSelectedCountry(country);
              }}
              label="Phone Number"
              error={error}
              returnKeyType="done"
            />
          ) : (
            <>
              <TextInput
                label="Email Address"
                value={form.identifier}
                onChangeText={(value) => updateForm('identifier', value)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
                error={!!error}
              />
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            </>
          )}

          <Button
            mode="contained"
            onPress={handleSendVerificationCode}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Send Verification Code
          </Button>

          <Button
            mode="text"
            onPress={() => router.replace('/(auth)/login')}
            style={styles.textButton}
          >
            Back to Login
          </Button>
        </Surface>
      </View>

      {/* OTP Modal */}
      {renderOTPModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background.primary,
  },
  content: {
    flex: 1,
    padding: DesignSystem.spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: DesignSystem.spacing['2xl'],
  },
  logo: {
    fontSize: DesignSystem.typography.fontSize['4xl'],
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.primary[500],
    marginBottom: DesignSystem.spacing.sm,
  },
  tagline: {
    fontSize: DesignSystem.typography.fontSize.base,
    color: DesignSystem.colors.text.secondary,
    textAlign: 'center',
  },
  formContainer: {
    padding: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.borderRadius.xl,
    ...DesignSystem.shadows.md,
  },
  title: {
    fontSize: DesignSystem.typography.fontSize['2xl'],
    fontWeight: DesignSystem.typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.sm,
    color: DesignSystem.colors.text.primary,
  },
  subtitle: {
    fontSize: DesignSystem.typography.fontSize.base,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.lg,
    color: DesignSystem.colors.text.secondary,
    lineHeight: DesignSystem.typography.lineHeight.normal * DesignSystem.typography.fontSize.base,
  },
  methodTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: DesignSystem.spacing.lg,
    gap: DesignSystem.spacing.sm,
  },
  methodTab: {
    marginHorizontal: DesignSystem.spacing.xs,
  },
  activeMethodTab: {
    backgroundColor: DesignSystem.colors.primary[500],
  },
  methodText: {
    color: DesignSystem.colors.text.secondary,
  },
  activeMethodText: {
    color: DesignSystem.colors.text.inverse,
  },
  input: {
    marginBottom: DesignSystem.spacing.sm,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: DesignSystem.spacing.sm,
    marginBottom: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.primary[500],
  },
  buttonContent: {
    paddingVertical: DesignSystem.spacing.sm,
  },
  textButton: {
    marginBottom: DesignSystem.spacing.md,
  },
  error: {
    color: DesignSystem.colors.error,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.md,
    fontSize: DesignSystem.typography.fontSize.sm,
  },
  message: {
    color: DesignSystem.colors.success,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.md,
    fontSize: DesignSystem.typography.fontSize.sm,
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: DesignSystem.colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: DesignSystem.zIndex.modal,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalContent: {
    borderRadius: DesignSystem.borderRadius.xl,
    ...DesignSystem.shadows.lg,
  },
  modalHeader: {
    padding: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing.md,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: DesignSystem.typography.fontSize.xl,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: DesignSystem.typography.fontSize.sm,
    color: DesignSystem.colors.text.secondary,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  timerText: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.warning,
    textAlign: 'center',
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  modalBody: {
    padding: DesignSystem.spacing.lg,
    paddingTop: 0,
  },
  otpSection: {
    marginBottom: DesignSystem.spacing.lg,
  },
  otpLabel: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.md,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.sm,
  },
  otpInput: {
    width: (width - 120) / OTP_LENGTH,
    height: 56,
    borderWidth: 2,
    borderColor: DesignSystem.colors.border.light,
    borderRadius: DesignSystem.borderRadius.md,
    fontSize: DesignSystem.typography.fontSize['2xl'],
    fontWeight: DesignSystem.typography.fontWeight.bold,
    backgroundColor: DesignSystem.colors.background.primary,
    color: DesignSystem.colors.text.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInputFilled: {
    borderColor: DesignSystem.colors.primary[500],
    backgroundColor: DesignSystem.colors.primary[50],
  },
  otpInputError: {
    borderColor: DesignSystem.colors.error,
    backgroundColor: DesignSystem.colors.error + '10',
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: DesignSystem.spacing.xs,
    marginBottom: DesignSystem.spacing.sm,
  },
  passwordStrengthLabel: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.text.secondary,
  },
  passwordStrengthText: {
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  modalActions: {
    gap: DesignSystem.spacing.md,
    marginTop: DesignSystem.spacing.lg,
  },
  resetButton: {
    backgroundColor: DesignSystem.colors.primary[500],
  },
  cancelButton: {
    borderColor: DesignSystem.colors.primary[500],
  },
  helpContainer: {
    alignItems: 'center',
    marginTop: DesignSystem.spacing.lg,
  },
  helpText: {
    fontSize: DesignSystem.typography.fontSize.xs,
    color: DesignSystem.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 