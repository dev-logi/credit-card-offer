import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiService } from '../services/api.service';
import { supabase } from '../services/supabase.service';
import { RootStackParamList } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { ModernButton } from '../components/ModernButton';
import { theme } from '../config/theme';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // 2. Use Supabase user ID as customer ID
      const customerId = authData.user.id;

      // 3. Create customer in our FastAPI backend
      await apiService.createCustomer({
        id: customerId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });

      // 4. Save to local storage
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMER_ID, customerId);
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMER_NAME, name.trim());
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMER_EMAIL, email.trim().toLowerCase());

      // 5. Navigate to card selection
      navigation.navigate('SelectCards', { customerId, isFirstTime: true });
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Unable to create account. Please try again.';

      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Registration Failed', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Create Account
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Start maximizing your rewards today.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="John Doe"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  style={styles.input}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor={theme.colors.text}
                  disabled={loading}
                />
              </GlassCard>
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
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
              </GlassCard>
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
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
              </GlassCard>
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>
            </View>

            <ModernButton
              title="Continue"
              onPress={handleRegister}
              style={styles.button}
              loading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  form: {
    gap: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 14,
  },
  inputCard: {
    borderRadius: 16,
  },
  input: {
    backgroundColor: 'transparent',
    height: 56,
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 24,
  },
});
