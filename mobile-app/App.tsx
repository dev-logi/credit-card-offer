import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/config/theme';

const theme_config = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...theme.colors,
  },
};

function AppContent() {
  const { isLoading, isRegistered } = useAuth();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force navigation remount when auth state changes
  React.useEffect(() => {
    console.log('🔄 Auth state changed, isRegistered:', isRegistered);
    setForceUpdate(prev => {
      const newValue = prev + 1;
      console.log('📱 App forceUpdate:', prev, '→', newValue);
      return newValue;
    });
  }, [isRegistered]); // Now watches isRegistered changes

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <AppNavigator forceUpdate={forceUpdate} />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme_config}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

