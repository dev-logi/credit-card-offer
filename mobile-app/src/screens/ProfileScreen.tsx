import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api.service';
import { MainTabsParamList } from '../types';
import { STORAGE_KEYS } from '../config/constants';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { handleLogout } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [cardsCount, setCardsCount] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  // Reload profile when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProfile = async () => {
    try {
      const name = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_NAME);
      const email = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_EMAIL);
      const customerId = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
      
      setCustomerName(name || '');
      setCustomerEmail(email || '');
      
      // Fetch actual card count from API
      if (customerId) {
        try {
          const cards = await apiService.getCustomerCards(customerId);
          setCardsCount(cards.length);
          // Update AsyncStorage with actual count
          await AsyncStorage.setItem(STORAGE_KEYS.CARDS_COUNT, cards.length.toString());
        } catch (error) {
          console.error('Error fetching cards count:', error);
          // Fall back to stored count if API fails
          const count = await AsyncStorage.getItem(STORAGE_KEYS.CARDS_COUNT);
          setCardsCount(parseInt(count || '0'));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const onLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>
              {customerName ? customerName.charAt(0).toUpperCase() : '👤'}
            </Text>
          </View>
          <Text variant="headlineSmall" style={styles.name}>
            {customerName}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {customerEmail}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text variant="headlineMedium" style={styles.statNumber}>
              {cardsCount}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Cards
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text variant="headlineMedium" style={styles.statNumber}>
              ✨
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Active
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Account
          </Text>
          <List.Item
            title="Personal Information"
            description="View and edit your profile"
            left={props => <List.Icon {...props} icon="account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="My Cards"
            description={`${cardsCount} card${cardsCount !== 1 ? 's' : ''} in wallet`}
            left={props => <List.Icon {...props} icon="credit-card" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('MyCards')}
          />
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Preferences
          </Text>
          <List.Item
            title="Notifications"
            description="Manage notification settings"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Privacy"
            description="Control your data"
            left={props => <List.Icon {...props} icon="shield-check" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            About
          </Text>
          <List.Item
            title="Help & Support"
            description="Get help with the app"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-lock" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
        </View>

        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={onLogoutPress}
            style={styles.logoutButton}
            textColor="#d32f2f"
          >
            Logout
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.footer}>
          Smart Card Picker © 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6200ee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    gap: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: 'bold',
    color: '#666',
  },
  logoutContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  logoutButton: {
    borderColor: '#d32f2f',
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 24,
  },
});

