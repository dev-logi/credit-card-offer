import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { GradientBackground } from '../components/GradientBackground';
import { ModernButton } from '../components/ModernButton';
import { theme } from '../config/theme';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💳</Text>
          </View>

          <Text variant="displayMedium" style={styles.heading}>
            Smart Card Picker
          </Text>

          <Text variant="bodyLarge" style={styles.description}>
            Maximize your rewards at every purchase. Never guess which card to use again.
          </Text>
        </View>

        <View style={styles.footer}>
          <ModernButton
            title="Get Started"
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
          />
          <ModernButton
            title="Sign In"
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 40,
  },
  heading: {
    color: theme.colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
  footer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});
