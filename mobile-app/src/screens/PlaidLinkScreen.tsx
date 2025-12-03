import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { apiService } from '../services/api.service';
import { PlaidService } from '../services/plaid.service';

type PlaidLinkScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlaidLink'>;
type PlaidLinkScreenRouteProp = RouteProp<RootStackParamList, 'PlaidLink'>;

interface PlaidLinkScreenProps {
  navigation: PlaidLinkScreenNavigationProp;
  route: PlaidLinkScreenRouteProp;
}

export default function PlaidLinkScreen({ route, navigation }: PlaidLinkScreenProps) {
  const { customerId } = route.params;
  const [loading, setLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    loadLinkToken();
  }, []);

  const loadLinkToken = async () => {
    setLoading(true);
    try {
      const token = await PlaidService.createLinkToken(customerId);
      setLinkToken(token);
      // TODO: Open Plaid Link SDK with the token
      // This will be implemented once react-native-plaid-link-sdk is properly configured
      Alert.alert(
        'Plaid Integration',
        'Plaid Link SDK will open here once API keys are configured. Link token received successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Error creating link token:', error);
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Failed to initialize Plaid Link. Please try again.',
        [
          { text: 'Cancel', onPress: () => navigation.goBack() },
          { text: 'Retry', onPress: loadLinkToken }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidSuccess = async (publicToken: string, metadata: any) => {
    setLoading(true);
    try {
      const itemId = metadata.item_id;
      const accountId = metadata.accounts?.[0]?.id;

      await apiService.linkPlaidCard(customerId, publicToken, itemId, accountId);

      Alert.alert(
        'Success! ✅',
        'Your card has been linked successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to SelectCards screen which will refresh the card list
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error linking Plaid card:', error);
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Failed to link card. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidExit = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Link Your Card
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Securely connect your credit card using Plaid
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text variant="bodyMedium" style={styles.loadingText}>
              {linkToken ? 'Opening Plaid Link...' : 'Initializing...'}
            </Text>
          </View>
        ) : (
          <View style={styles.infoContainer}>
            <Text variant="bodyMedium" style={styles.infoText}>
              Plaid Link will open to securely connect your bank account and retrieve your credit card information.
            </Text>
            <Button
              mode="contained"
              onPress={loadLinkToken}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Start Linking
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 20,
    color: '#666',
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    minWidth: 200,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

