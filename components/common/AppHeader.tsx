// oneQlick/components/common/AppHeader.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from 'expo-router'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

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

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} style={styles.button}>
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.right}>
          {rightAction && (
            <TouchableOpacity onPress={rightAction.onPress} style={styles.button}>
              <MaterialIcons name={rightAction.iconName} size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', 
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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

export default AppHeader;