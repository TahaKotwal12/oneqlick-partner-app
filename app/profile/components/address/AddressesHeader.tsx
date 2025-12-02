import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';

interface AddressesHeaderProps {
  onHelpPress: () => void;
}

export default function AddressesHeader({ onHelpPress }: AddressesHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <IconButton
          icon={() => (
            <MaterialIcons 
              name="arrow-back" 
              size={DesignSystem.sizes.icon.md} 
              color={DesignSystem.colors.text.primary} 
            />
          )}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text style={[GlobalStyles.typography.h4, styles.headerTitle]}>Saved Addresses</Text>
      </View>
      <IconButton
        icon={() => (
          <MaterialIcons 
            name="help-outline" 
            size={DesignSystem.sizes.icon.md} 
            color={DesignSystem.colors.text.secondary} 
          />
        )}
        onPress={onHelpPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...GlobalStyles.layout.rowSpaceBetween,
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.background.primary,
    ...DesignSystem.shadows.sm,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.border.light,
  },
  headerLeft: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
  },
  backButton: {
    margin: 0,
    marginRight: DesignSystem.spacing.xs,
  },
  headerTitle: {
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
});
