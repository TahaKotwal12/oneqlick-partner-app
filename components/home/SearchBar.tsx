import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearchPress: () => void;
  onVoiceSearchPress: () => void;
}

export default function SearchBar({ onSearchPress, onVoiceSearchPress }: SearchBarProps) {
  return (
    <Pressable onPress={onSearchPress}>
      <Surface style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#6B7280" />
        <Text style={styles.searchPlaceholder}>Search for restaurants and food...</Text>
        <Pressable style={styles.voiceSearchButton} onPress={onVoiceSearchPress}>
          <MaterialIcons name="mic" size={20} color="#4F46E5" />
        </Pressable>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    color: '#9CA3AF',
    fontSize: 16,
  },
  voiceSearchButton: {
    padding: 8,
  },
}); 