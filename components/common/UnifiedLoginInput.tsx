import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { isValidEmail } from '../../utils/helpers';
import { CountryCode } from '../../utils/countryCodes';

interface UnifiedLoginInputProps {
  value: string;
  onChangeText: (value: string, country?: CountryCode | null) => void;
  label?: string;
  error?: string;
  returnKeyType?: 'done' | 'next' | 'search' | 'send' | 'go' | 'default';
  onSubmitEditing?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

type InputType = 'email' | 'phone' | 'unknown';

export const UnifiedLoginInput: React.FC<UnifiedLoginInputProps> = ({
  value,
  onChangeText,
  label = "Email or Phone Number",
  error,
  returnKeyType = 'next',
  onSubmitEditing,
  disabled = false,
  autoFocus = false,
}) => {
  const [inputType, setInputType] = useState<InputType>('unknown');

  // Auto-detect input type based on value
  useEffect(() => {
    if (!value) {
      setInputType('unknown');
      return;
    }

    // Check if it looks like an email
    if (value.includes('@') || isValidEmail(value)) {
      setInputType('email');
    }
    // Check if it looks like a phone number
    else if (/^[\d\s\-+()]+$/.test(value) && value.replace(/\D/g, '').length >= 7) {
      setInputType('phone');
    }
    // If it starts with +, assume it's a phone number
    else if (value.startsWith('+')) {
      setInputType('phone');
    }
    // Default to unknown for short inputs
    else if (value.length < 3) {
      setInputType('unknown');
    }
    // If it has letters and no @, it's probably not an email
    else if (/[a-zA-Z]/.test(value) && !value.includes('@')) {
      setInputType('unknown');
    }
    // If it's all digits or has some formatting, assume phone
    else if (/^[\d\s\-+().]+$/.test(value)) {
      setInputType('phone');
    }
  }, [value]);

  const handleTextChange = (text: string) => {
    onChangeText(text);
  };

  const getInputIcon = () => {
    switch (inputType) {
      case 'email':
        return 'email';
      case 'phone':
        return 'phone';
      default:
        return 'account';
    }
  };

  const getKeyboardType = () => {
    switch (inputType) {
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case 'email':
        return 'Enter your email address';
      case 'phone':
        return 'Enter your phone number';
      default:
        return 'Enter email or phone number';
    }
  };

  const getHelperText = () => {
    if (error) return error;
    
    switch (inputType) {
      case 'email':
        return 'We\'ll send you a verification code';
      case 'phone':
        return 'We\'ll send you a verification code via SMS';
      default:
        return 'Enter your email address or phone number';
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={handleTextChange}
        mode="outlined"
        keyboardType={getKeyboardType()}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        left={<TextInput.Icon icon={getInputIcon()} />}
        error={!!error}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={getPlaceholder()}
      />
      <HelperText 
        type={error ? "error" : "info"} 
        visible={!!value || !!error}
        style={styles.helperText}
      >
        {getHelperText()}
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  helperText: {
    marginTop: 4,
  },
});
