import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';

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

const theme = {
  colors: {
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
        name="FindCard" 
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

interface AppNavigatorProps {
  forceUpdate: number;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ forceUpdate }) => {
  const { isRegistered } = useAuth();

  return (
    <NavigationContainer key={`nav-${forceUpdate}-${isRegistered ? 'in' : 'out'}`}>
      <StatusBar style="auto" />
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
              options={{ headerShown: true, title: 'Select Cards' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { theme };

