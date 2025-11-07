import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text variant="bodyMedium" style={styles.featureText}>{text}</Text>
    </View>
  );
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="displayMedium" style={styles.title}>
          💳
        </Text>
        <Text variant="headlineLarge" style={styles.heading}>
          Smart Card Picker
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Never miss out on rewards again!
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Get personalized recommendations for which credit card to use at every purchase. Maximize your rewards effortlessly.
        </Text>
      </View>

      <View style={styles.features}>
        <FeatureItem 
          icon="✅" 
          text="Instant card recommendations" 
        />
        <FeatureItem 
          icon="💰" 
          text="Maximize your rewards" 
        />
        <FeatureItem 
          icon="🎯" 
          text="Never use the wrong card" 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Register')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Get Started
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('Login')}
          style={[styles.button, styles.loginButton]}
          contentStyle={styles.buttonContent}
        >
          Sign In
        </Button>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 80,
    marginBottom: 16,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  button: {
    borderRadius: 12,
    marginBottom: 12,
  },
  loginButton: {
    marginBottom: 0,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

