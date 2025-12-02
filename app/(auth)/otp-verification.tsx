import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  BackHandler
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  ActivityIndicator
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { GlobalStyles } from '../../styles/globalStyles';
import { OTPInput } from '../../components/common';

const OTP_LENGTH = 6;

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { verifyOTP, sendOTP, otpResendAttempts, maxOtpResendAttempts, resetOtpResendAttempts, initializeOtpAttempts } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [lockoutCooldown, setLockoutCooldown] = useState(0);

  // Animation values
  const successScaleAnimation = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  const phoneNumber = params.phoneNumber as string;
  const email = params.email as string;
  const type = params.type as string || 'phone_verification';

  const target = email || phoneNumber;
  const targetType = email ? 'email' : 'phone';

  // Function to start lockout cooldown timer
  const startLockoutCooldown = (seconds: number) => {
    setLockoutCooldown(seconds);
    const timer = setInterval(() => {
      setLockoutCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return timer;
  };

  useEffect(() => {
    // Start resend cooldown
    setResendCooldown(30);
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Initialize OTP resend attempts based on current state
    // If this is email verification from signup, we know 1 OTP was already sent
    if (type === 'email_verification' && email) {
      // Initialize with 1 attempt since signup already sent an OTP
      initializeOtpAttempts(1, 3);
    }

    return () => clearInterval(timer);
  }, [type, email, initializeOtpAttempts]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (type === 'email_verification') {
        router.back();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [type]);

  const handlePaste = async () => {
    try {
      // This would require expo-clipboard or similar library
      // For now, we'll just show a message
      Alert.alert('Paste', 'Paste functionality would be implemented here');
    } catch (error) {
      // Failed to read clipboard
    }
  };

  const handleVerifyOTP = async (otpString: string) => {
    if (otpString.length !== OTP_LENGTH) return;

    setIsLoading(true);
    setError('');

    try {
      // Call the real OTP verification API
      const result = await verifyOTP(
        otpString,
        phoneNumber,
        email,
        type as 'phone_verification' | 'email_verification' | 'password_reset'
      );

      if (result.success) {
        await handleVerificationSuccess();
      } else {
        throw new Error(result.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      handleVerificationError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    setIsVerificationSuccess(true);

    // Reset OTP resend attempts on successful verification
    resetOtpResendAttempts();

    // Success animations
    Animated.sequence([
      Animated.timing(successScaleAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(checkmarkOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    setTimeout(() => {
      if (type === 'email_verification') {
        // Directly navigate to login screen
        router.replace('/(auth)/login');
      } else {
        router.replace('/(tabs)');
      }
    }, 2000);
  };

  const handleVerificationError = (errorMessage: string) => {
    setError(errorMessage);
    setOtp(new Array(OTP_LENGTH).fill(''));

    // Shake animation could be added here
    Alert.alert('Verification Failed', errorMessage);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;


    // Check if user has exceeded resend attempts
    if (otpResendAttempts >= maxOtpResendAttempts) {
      Alert.alert(
        'Resend Limit Reached',
        `You have reached the maximum number of OTP resend attempts. Please try again later.`,
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await sendOTP(
        phoneNumber,
        email,
        type as 'phone_verification' | 'email_verification' | 'password_reset'
      );

      if (result.success) {
        // Reset cooldown and start new timer
        setResendCooldown(30);
        const timer = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        const remainingAttempts = result.remainingAttempts || 0;
        const maxAttempts = result.maxAttempts || 3;

        Alert.alert(
          'OTP Sent',
          `A new OTP has been sent to your ${targetType}.${remainingAttempts > 0 ? ` You have ${remainingAttempts} attempts remaining.` : ''}`
        );
      } else {
        // Check if it's a rate limiting error
        if (result.error?.includes('Too many OTP requests') || result.error?.includes('429')) {
          // Extract lockout time from error message
          const timeMatch = result.error.match(/(\d+)m (\d+)s/);
          if (timeMatch) {
            const minutes = parseInt(timeMatch[1]);
            const seconds = parseInt(timeMatch[2]);
            const totalSeconds = minutes * 60 + seconds;

            // Start lockout cooldown timer
            startLockoutCooldown(totalSeconds);

            Alert.alert(
              'Resend Limit Reached',
              `You have reached the maximum number of OTP resend attempts. Please wait ${minutes}m ${seconds}s before trying again.`,
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert(
              'Resend Limit Reached',
              `You have reached the maximum number of OTP resend attempts. Please try again later.`,
              [{ text: 'OK' }]
            );
          }
        } else {
          Alert.alert('Error', result.error || 'Failed to resend OTP');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'email_verification':
        return 'Verify Email';
      case 'phone_verification':
        return 'Verify Phone';
      case 'password_reset':
        return 'Reset Password';
      default:
        return 'Verify OTP';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'email_verification':
        return 'We\'ve sent a verification code to your email address';
      case 'phone_verification':
        return 'We\'ve sent a verification code to your phone number';
      case 'password_reset':
        return 'We\'ve sent a verification code to reset your password';
      default:
        return 'Enter the verification code we sent you';
    }
  };

  if (isVerificationSuccess) {
    return (
      <SafeAreaView style={[GlobalStyles.layout.container, styles.successContainer]}>
        <View style={styles.successContent}>
          <Animated.View
            style={[
              styles.successIcon,
              { transform: [{ scale: successScaleAnimation }] }
            ]}
          >
            <Text style={styles.successIconText}>✓</Text>
          </Animated.View>

          <Animated.Text
            style={[
              styles.successText,
              { opacity: checkmarkOpacity }
            ]}
          >
            Verification Successful!
          </Animated.Text>

          <Text style={styles.successSubtext}>
            {type === 'email_verification'
              ? 'Your email has been verified successfully'
              : 'Your phone number has been verified successfully'
            }
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[GlobalStyles.layout.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[GlobalStyles.layout.container]}
      >
        <ScrollView
          contentContainerStyle={[GlobalStyles.layout.containerPadded]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>oneQlick</Text>
            </View>
          </View>

          {/* OTP Form */}
          <Surface style={styles.formContainer}>
            <Text style={styles.title}>{getTitle()}</Text>
            <Text style={styles.subtitle}>{getSubtitle()}</Text>

            <Text style={styles.targetText}>
              {targetType === 'email' ? '📧' : '📱'} {target}
            </Text>

            <View style={styles.otpContainer}>
              <OTPInput
                value={otp}
                onChangeText={setOtp}
                onComplete={handleVerifyOTP}
                error={error}
              />

              {error ? (
                <HelperText type="error" visible={!!error}>
                  {error}
                </HelperText>
              ) : null}
            </View>

            {/* Resend OTP */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code?
              </Text>
              <Button
                mode="text"
                onPress={handleResendOTP}
                disabled={isLoading || resendCooldown > 0 || otpResendAttempts >= maxOtpResendAttempts || lockoutCooldown > 0}
                textColor={otpResendAttempts >= maxOtpResendAttempts || lockoutCooldown > 0 ? "#999" : "#4F46E5"}
                loading={isLoading}
              >
                {lockoutCooldown > 0
                  ? `Wait ${Math.floor(lockoutCooldown / 60)}m ${lockoutCooldown % 60}s`
                  : otpResendAttempts >= maxOtpResendAttempts
                    ? `Resend limit reached`
                    : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : `Resend (${maxOtpResendAttempts - otpResendAttempts} left)`
                }
              </Button>
            </View>

            {/* Paste OTP */}
            <Button
              mode="outlined"
              onPress={handlePaste}
              style={styles.pasteButton}
              textColor="#666"
            >
              Paste OTP
            </Button>

            {/* Verify Button */}
            <Button
              mode="contained"
              onPress={() => handleVerifyOTP(otp.join(''))}
              disabled={otp.join('').length !== OTP_LENGTH || isLoading}
              loading={isLoading}
              style={styles.verifyButton}
              contentStyle={styles.buttonContent}
            >
              Verify {type === 'email_verification' ? 'Email' : 'OTP'}
            </Button>

            {/* Back to Login */}
            {type === 'email_verification' && (
              <Button
                mode="text"
                onPress={() => router.back()}
                style={styles.backButton}
                textColor="#666"
              >
                Back to Sign Up
              </Button>
            )}
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
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  targetText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
    fontWeight: '500',
  },
  otpContainer: {
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  pasteButton: {
    marginBottom: 16,
    borderColor: '#ddd',
  },
  verifyButton: {
    backgroundColor: '#4F46E5',
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  backButton: {
    alignSelf: 'center',
  },
});
