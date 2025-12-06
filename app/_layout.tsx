import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native'; // **Added: View for background styling**
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/common';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'; // **Modified: Imported useTheme**
import { LanguageProvider } from '../contexts/LanguageContext';

// Helper component to apply theme-based styling
function RootLayoutContent() {
  const { theme } = useTheme();
  
  // Define background color based on theme
  const backgroundColor = theme === 'dark' ? '#121212' : '#FFFFFF';
  // Define status bar style based on theme
  const statusBarStyle = theme === 'dark' ? 'light' : 'dark';

  return (
    // Wrap the entire app content in a View to apply the background color
    <View style={{ flex: 1, backgroundColor }}>
      <PaperProvider>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style={statusBarStyle} />
        </SafeAreaProvider>
      </PaperProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <LanguageProvider>
            {/* The new helper component handles the theme-based view and StatusBar */}
            <RootLayoutContent />
          </LanguageProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}