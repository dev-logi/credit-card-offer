import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SelectCardsScreen from './src/screens/SelectCardsScreen';
import RecommendScreen from './src/screens/RecommendScreen';
import MyCardsScreen from './src/screens/MyCardsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f5f5f5',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Recommend" 
        component={RecommendScreen}
        options={{
          tabBarLabel: 'Find Card',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔍</Text>,
        }}
      />
      <Tab.Screen 
        name="MyCards" 
        component={MyCardsScreen}
        options={{
          tabBarLabel: 'My Cards',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💳</Text>,
        }}
      />
      <Tab.Screen 
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    checkRegistration();
  }, [forceUpdate]);

  const checkRegistration = async () => {
    try {
      const customerId = await AsyncStorage.getItem('customerId');
      setIsRegistered(!!customerId);
    } catch (error) {
      console.error('Error checking registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationComplete = async () => {
    try {
      console.log('✅ Registration complete - updating app state');
      setIsRegistered(true);
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error completing registration:', error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('🔓 Logout initiated at', new Date().toISOString());
      
      // Clear AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      console.log('📦 Clearing keys:', keys);
      await AsyncStorage.clear();
      console.log('✅ AsyncStorage cleared');
      
      // Verify it's cleared
      const remaining = await AsyncStorage.getAllKeys();
      console.log('📦 Remaining keys after clear:', remaining);
      
      // Update state
      setIsRegistered(false);
      setForceUpdate(prev => {
        const newValue = prev + 1;
        console.log('🔄 Force update:', prev, '→', newValue);
        return newValue;
      });
      
      console.log('✅ State reset to logged out');
      
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('✅ Logout complete');
      }, 100);
    } catch (error) {
      console.error('❌ Error during logout:', error);
      console.error('Stack:', error.stack);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isRegistered, handleLogout, handleRegistrationComplete }}>
      <NavigationContainer key={`nav-${forceUpdate}-${isRegistered ? 'in' : 'out'}`}>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isRegistered ? (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="SelectCards" component={SelectCardsScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen 
                name="SelectCards" 
                component={SelectCardsScreen}
                options={{ headerShown: true, title: 'Select Cards' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppContent />
    </PaperProvider>
  );
}

