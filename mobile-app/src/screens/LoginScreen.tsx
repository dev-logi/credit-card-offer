import React, { useState } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CreditCard } from '../types';
import { apiService } from '../services/api.service';
import { supabase } from '../services/supabase.service';
import { useAuth } from '../hooks/useAuth';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { ModernButton } from '../components/ModernButton';
import { theme } from '../config/theme';

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

      const customerId = authData.user.id;
      const userName = authData.user.user_metadata?.name || 'User';
      const userEmail = authData.user.email || email.trim().toLowerCase();

      await AsyncStorage.setItem('customerId', customerId);
      await AsyncStorage.setItem('userName', userName);
      await AsyncStorage.setItem('userEmail', userEmail);

      let cards: CreditCard[] = [];
      try {
        cards = await apiService.getCustomerCards(customerId);
      } catch (cardError: any) {
        if (cardError.response?.status === 404) {
          try {
            await apiService.createCustomer({
              id: customerId,
              name: userName,
              email: userEmail,
            });
            cards = await apiService.getCustomerCards(customerId);
          } catch (createError: any) {
            // Handle race condition or error
            if (createError.response?.status === 400) {
              cards = await apiService.getCustomerCards(customerId);
            }
          }
        }
      }

      if (cards.length === 0) {
        Alert.alert(
          'Welcome Back!',
          'Please add your credit cards to get started.',
          [{ text: 'OK' }]
        );
        navigation.navigate('SelectCards', { customerId, isFirstTime: true });
      } else {
        await AsyncStorage.setItem('cardCount', cards.length.toString());
        handleRegistrationComplete?.();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.emoji}>👋</Text>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome Back!
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Sign in to access your account
            </Text>
          </View>

          <GlassCard style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="john@example.com"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                textColor={theme.colors.text}
                disabled={loading}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    color="rgba(255, 255, 255, 0.7)"
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                textColor={theme.colors.text}
                disabled={loading}
              />
            </View>
          </GlassCard>

          <ModernButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  formCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  inputContainer: {
    padding: 16,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'transparent',
    height: 40,
    fontSize: 16,
    paddingHorizontal: 0,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  button: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  registerLink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
