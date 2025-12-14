import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import { theme } from '../config/theme';
import { BlurView } from 'expo-blur';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SelectCardsScreen from '../screens/SelectCardsScreen';
import RecommendScreen from '../screens/RecommendScreen';
import MyCardsScreen from '../screens/MyCardsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Types
import { RootStackParamList, MainTabsParamList } from '../types/navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f172a', // Slate 900
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="FindCard"
        component={RecommendScreen}
        options={{
          tabBarLabel: 'Find Card',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: 24, color }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="MyCards"
        component={MyCardsScreen}
        options={{
          tabBarLabel: 'My Cards',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: 24, color }}>💳</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

interface AppNavigatorProps {
  forceUpdate: number;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ forceUpdate }) => {
  const { isRegistered } = useAuth();

  return (
    <NavigationContainer key={`nav-${forceUpdate}-${isRegistered ? 'in' : 'out'}`} theme={{
      dark: true,
      colors: {
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: 'rgba(255, 255, 255, 0.1)',
        notification: theme.colors.secondary,
      }
    }}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isRegistered ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="SelectCards" component={SelectCardsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="SelectCards"
              component={SelectCardsScreen}
              options={{
                headerShown: true,
                title: 'Select Cards',
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.text,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
