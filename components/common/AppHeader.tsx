// oneQlick/components/common/AppHeader.tsx (THEME-AWARE)

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';   // ✅ FIXED: Using Paper Text
import { useNavigation } from 'expo-router'; 
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
// 👇 THEME IMPORT
import { useTheme } from '../../contexts/ThemeContext'; 

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    iconName: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
  };
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showBack = false, rightAction }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // 🔑 DYNAMIC COLORS
  const HEADER_BACKGROUND = isDark ? '#1E1E1E' : '#fff';
  const BORDER_COLOR = isDark ? '#333333' : '#eee';
  const TEXT_COLOR = isDark ? '#FFFFFF' : '#333333';
  const ICON_COLOR = isDark ? '#FFFFFF' : '#000000';

  // 🔑 DYNAMIC STYLES
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: HEADER_BACKGROUND,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_COLOR,
    },
    header: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    },
    left: {
      width: 40,
      justifyContent: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: TEXT_COLOR,
    },
    right: {
      width: 40,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    button: {
      padding: 5,
    }
  });

  return (
    <View style={[dynamicStyles.container, { paddingTop: insets.top }]}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.left}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} style={dynamicStyles.button}>
              <MaterialIcons name="arrow-back" size={24} color={ICON_COLOR} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={dynamicStyles.title}>{title}</Text>

        <View style={dynamicStyles.right}>
          {rightAction && (
            <TouchableOpacity onPress={rightAction.onPress} style={dynamicStyles.button}>
              <MaterialIcons name={rightAction.iconName} size={24} color={ICON_COLOR} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default AppHeader;
