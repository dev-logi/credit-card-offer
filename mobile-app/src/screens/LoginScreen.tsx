import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { apiService } from '../services/api.service';
import { useAuth } from '../hooks/useAuth';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleRegistrationComplete } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      // Lookup customer by email
      const customer = await apiService.getCustomerByEmail(email.toLowerCase().trim());
      
      // Store customer info
      await AsyncStorage.setItem('customerId', customer.id);
      await AsyncStorage.setItem('userName', customer.name);
      await AsyncStorage.setItem('userEmail', customer.email);
      
      // Check if customer has cards
      const cards = await apiService.getCustomerCards(customer.id);
      
      if (cards.length === 0) {
        // Customer exists but has no cards, send to card selection
        Alert.alert(
          'Welcome Back!',
          'Please add your credit cards to get started.',
          [{ text: 'OK' }]
        );
        navigation.navigate('SelectCards', { customerId: customer.id, isFirstTime: true });
      } else {
        // Customer has cards, complete login
        await AsyncStorage.setItem('cardCount', cards.length.toString());
        Alert.alert('Welcome Back!', `Logged in as ${customer.name}`);
        handleRegistrationComplete?.();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 404) {
        Alert.alert(
          'Account Not Found',
          'No account found with this email. Please register first.',
          [
            { text: 'Register', onPress: () => navigation.navigate('Register') },
            { text: 'Try Again', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert(
          'Login Failed',
          error.response?.data?.detail || 'Unable to log in. Please check your internet connection and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.emoji}>
          👋
        </Text>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome Back!
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign in to access your account
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          style={styles.input}
          disabled={loading}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <View style={styles.registerContainer}>
          <Text variant="bodyMedium" style={styles.registerText}>
            Don't have an account?{' '}
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
            compact
          >
            Register
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  input: {
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    color: '#666',
  },
});

