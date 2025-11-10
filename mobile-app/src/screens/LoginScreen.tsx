import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { apiService } from '../services/api.service';
import { supabase } from '../services/supabase.service';
import { useAuth } from '../hooks/useAuth';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { handleRegistrationComplete } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to log in');
      }

      // 2. Get customer ID from Supabase user
      const customerId = authData.user.id;
      const userName = authData.user.user_metadata?.name || 'User';
      
      // 3. Store customer info
      await AsyncStorage.setItem('customerId', customerId);
      await AsyncStorage.setItem('userName', userName);
      await AsyncStorage.setItem('userEmail', authData.user.email || email.trim().toLowerCase());
      
      // 4. Check if customer has cards
      const cards = await apiService.getCustomerCards(customerId);
      
      if (cards.length === 0) {
        // Customer exists but has no cards, send to card selection
        Alert.alert(
          'Welcome Back!',
          'Please add your credit cards to get started.',
          [{ text: 'OK' }]
        );
        navigation.navigate('SelectCards', { customerId, isFirstTime: true });
      } else {
        // Customer has cards, complete login
        await AsyncStorage.setItem('cardCount', cards.length.toString());
        Alert.alert('Welcome Back!', `Logged in as ${userName}`);
        handleRegistrationComplete?.();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Unable to log in. Please check your internet connection and try again.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before logging in.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Login Failed', errorMessage, [
        { text: 'Try Again', style: 'cancel' },
        { text: 'Register', onPress: () => navigation.navigate('Register') }
      ]);
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

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
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

