import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';

interface RecentSearchesProps {
  searches: string[];
  onSearchPress: (search: string) => void;
  onClearAll: () => void;
}

export default function RecentSearches({ searches, onSearchPress, onClearAll }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <Pressable onPress={onClearAll} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear All</Text>
        </Pressable>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {searches.map((search, index) => (
          <Pressable
            key={index}
            style={styles.searchChip}
            onPress={() => onSearchPress(search)}
          >
            <MaterialCommunityIcons 
              name="history" 
              size={DesignSystem.sizes.icon.xs} 
              color={DesignSystem.colors.text.secondary} 
            />
            <Text style={styles.searchText}>{search}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.md,
  },
  header: {
    ...GlobalStyles.layout.rowSpaceBetween,
    marginBottom: DesignSystem.spacing.sm,
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    color: DesignSystem.colors.text.primary,
  },
  clearButton: {
    paddingVertical: DesignSystem.spacing.xs,
    paddingHorizontal: DesignSystem.spacing.sm,
  },
  clearText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.primary[500],
  },
  scrollContent: {
    paddingRight: DesignSystem.spacing.md,
  },
  searchChip: {
    ...GlobalStyles.layout.row,
    backgroundColor: DesignSystem.colors.background.primary,
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.full,
    marginRight: DesignSystem.spacing.sm,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
    gap: DesignSystem.spacing.xs,
    ...DesignSystem.shadows.sm,
  },
  searchText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    color: DesignSystem.colors.text.primary,
  },
});
