import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, Searchbar, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';
import { AddressSuggestion } from '../../addressFormData';

interface LocationSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showSuggestions: boolean;
  searchSuggestions: AddressSuggestion[];
  onSuggestionSelect: (suggestion: AddressSuggestion) => void;
}

export default function LocationSearch({
  searchQuery,
  onSearchChange,
  showSuggestions,
  searchSuggestions,
  onSuggestionSelect,
}: LocationSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.searchContainer}>
      <Text style={[GlobalStyles.typography.h6, styles.sectionTitle]}>Search for Location</Text>
      
      <Searchbar
        placeholder="Search for address, landmark, or area..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={[
          styles.searchBar,
          isFocused && styles.searchBarFocused
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        icon={() => (
          <MaterialIcons 
            name="search"
            size={DesignSystem.sizes.icon.sm}
            color={isFocused ? DesignSystem.colors.primary[500] : DesignSystem.colors.text.secondary}
          />
        )}
        inputStyle={styles.searchInput}
      />
      
      {/* Search suggestions */}
      {showSuggestions && searchSuggestions.length > 0 && (
        <Surface style={styles.suggestionsContainer}>
          <ScrollView 
            style={styles.suggestionsScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {searchSuggestions.map((suggestion, index) => (
              <Pressable
                key={suggestion.id}
                style={[
                  styles.suggestionItem,
                  index === searchSuggestions.length - 1 && styles.lastSuggestionItem
                ]}
                onPress={() => onSuggestionSelect(suggestion)}
              >
                <View style={styles.suggestionIconContainer}>
                  <MaterialIcons 
                    name="location-on" 
                    size={DesignSystem.sizes.icon.sm} 
                    color={DesignSystem.colors.primary[500]} 
                  />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={[GlobalStyles.typography.body1, styles.suggestionName]}>{suggestion.name}</Text>
                  <Text style={[GlobalStyles.typography.body2, styles.suggestionAddress]}>{suggestion.address}</Text>
                  {suggestion.distance && (
                    <Text style={[GlobalStyles.typography.caption, styles.suggestionDistance]}>
                      {suggestion.distance} km away
                    </Text>
                  )}
                </View>
                <MaterialIcons 
                  name="arrow-forward-ios" 
                  size={DesignSystem.sizes.icon.xs} 
                  color={DesignSystem.colors.text.secondary} 
                />
              </Pressable>
            ))}
          </ScrollView>
        </Surface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionTitle: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  searchBar: {
    backgroundColor: DesignSystem.colors.background.primary,
    elevation: 2,
    borderRadius: 25, // Curved border
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
  },
  searchBarFocused: {
    borderColor: DesignSystem.colors.primary[500],
    elevation: 4,
    shadowColor: DesignSystem.colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchInput: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.primary,
  },
  suggestionsContainer: {
    marginTop: DesignSystem.spacing.sm,
    borderRadius: 15, // Curved border for suggestions
    elevation: 8,
    shadowColor: DesignSystem.colors.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: DesignSystem.colors.background.primary,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
  },
  suggestionsScrollView: {
    maxHeight: 250,
  },
  suggestionItem: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.border.light,
    backgroundColor: DesignSystem.colors.background.primary,
  },
  lastSuggestionItem: {
    borderBottomWidth: 0,
  },
  suggestionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DesignSystem.colors.primary[50],
    ...GlobalStyles.layout.rowCenter,
    marginRight: DesignSystem.spacing.md,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  suggestionAddress: {
    color: DesignSystem.colors.text.secondary,
    marginBottom: 2,
    lineHeight: 18,
  },
  suggestionDistance: {
    color: DesignSystem.colors.text.secondary,
    fontSize: 12,
  },
});
