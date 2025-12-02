import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  Clipboard,
} from 'react-native';
import { TextInput, HelperText, Button } from 'react-native-paper';

const { width } = Dimensions.get('window');
const OTP_LENGTH = 6;

interface OTPInputProps {
  value: string[];
  onChangeText: (otp: string[]) => void;
  onComplete?: (otp: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChangeText,
  onComplete,
  error,
  disabled = false,
  autoFocus = true,
}) => {
  const [otp, setOtp] = useState<string[]>(value || new Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<any[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 500);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (error) {
      // Shake animation on error
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
    }
  }, [error]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChangeText(newOtp);

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === OTP_LENGTH) {
      onComplete?.(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      const pastedOTP = clipboardContent.replace(/\D/g, '').slice(0, OTP_LENGTH);
      
      if (pastedOTP.length === OTP_LENGTH) {
        const newOtp = [...otp];
        for (let i = 0; i < OTP_LENGTH; i++) {
          newOtp[i] = pastedOTP[i];
        }
        setOtp(newOtp);
        onChangeText(newOtp);
        
        // Focus last input
        inputRefs.current[OTP_LENGTH - 1]?.focus();
        
        // Auto-verify if complete
        if (pastedOTP.length === OTP_LENGTH) {
          onComplete?.(pastedOTP);
        }
      }
    } catch (error) {
      console.log('Failed to read clipboard');
    }
  };

  const renderOTPInputs = () => {
    return (
      <Animated.View 
        style={[
          styles.otpContainer,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref: any) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpInput,
              digit && styles.otpInputFilled,
              error && styles.otpInputError
            ]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
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
              } else {
                Keyboard.dismiss();
              }
            }}
            blurOnSubmit={false}
            disabled={disabled}
          />
        ))}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderOTPInputs()}
      
      {error && (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      )}

      {/* Paste Button */}
      <Button
        mode="text"
        onPress={handlePaste}
        style={styles.pasteButton}
        textColor="#4F46E5"
        icon="content-paste"
        disabled={disabled}
      >
        Paste OTP
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: (width - 80) / OTP_LENGTH,
    height: 60,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'white',
    color: '#1F2937',
  },
  otpInputFilled: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  otpInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  pasteButton: {
    marginBottom: 10,
  },
});

export default OTPInput;

