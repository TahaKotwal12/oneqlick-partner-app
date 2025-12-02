import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

export default function LoadingScreen({
  message = 'Loading...',
  showLogo = true,
  size = 'large',
  color = '#4F46E5',
}: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      {showLogo && (
        <View style={styles.logoContainer}>
          <MaterialIcons name="restaurant" size={48} color={color} />
        </View>
      )}
      
      <ActivityIndicator size={size} color={color} style={styles.spinner} />
      
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
