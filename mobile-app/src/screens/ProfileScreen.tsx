import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api.service';
import { MainTabsParamList } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { ModernButton } from '../components/ModernButton';
import { theme } from '../config/theme';

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

      if (customerId) {
        try {
          const cards = await apiService.getCustomerCards(customerId);
          setCardsCount(cards.length);
          await AsyncStorage.setItem(STORAGE_KEYS.CARDS_COUNT, cards.length.toString());
        } catch (error) {
          console.error('Error fetching cards count:', error);
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

  const MenuItem = ({ title, description, icon, onPress, showDivider = true }: any) => (
    <>
      <TouchableOpacity onPress={onPress} style={styles.menuItem}>
        <View style={styles.menuIconContainer}>
          <Text style={styles.menuIcon}>{icon}</Text>
        </View>
        <View style={styles.menuContent}>
          <Text variant="bodyLarge" style={styles.menuTitle}>{title}</Text>
          {description && (
            <Text variant="bodySmall" style={styles.menuDescription}>{description}</Text>
          )}
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${customerName || 'Guest'}` }}
                style={styles.avatar}
              />
            </View>
            <Text variant="headlineSmall" style={styles.name}>
              {customerName}
            </Text>
            <Text variant="bodyMedium" style={styles.email}>
              {customerEmail}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <GlassCard style={styles.statBox}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {cardsCount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Cards
              </Text>
            </GlassCard>
            <GlassCard style={styles.statBox}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                ✨
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Premium
              </Text>
            </GlassCard>
          </View>

          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            <MenuItem
              title="Personal Information"
              description="View and edit your profile"
              icon="👤"
              onPress={() => { }}
            />
            <MenuItem
              title="My Cards"
              description={`${cardsCount} card${cardsCount !== 1 ? 's' : ''} in wallet`}
              icon="💳"
              onPress={() => navigation.navigate('MyCards')}
              showDivider={false}
            />
          </GlassCard>

          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
            <MenuItem
              title="Notifications"
              description="Manage notification settings"
              icon="🔔"
              onPress={() => { }}
            />
            <MenuItem
              title="Privacy"
              description="Control your data"
              icon="🛡️"
              onPress={() => { }}
              showDivider={false}
            />
          </GlassCard>

          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>ABOUT</Text>
            <MenuItem
              title="Help & Support"
              icon="❓"
              onPress={() => { }}
            />
            <MenuItem
              title="Terms of Service"
              icon="📄"
              onPress={() => { }}
            />
            <MenuItem
              title="Privacy Policy"
              icon="🔒"
              onPress={() => { }}
              showDivider={false}
            />
          </GlassCard>

          <ModernButton
            title="Logout"
            onPress={onLogoutPress}
            mode="outlined"
            style={styles.logoutButton}
            textStyle={styles.logoutText}
          />

          <Text variant="bodySmall" style={styles.footer}>
            Smart Card Picker v1.0.0
          </Text>
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
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  email: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  statNumber: {
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  menuDescription: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  chevron: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 72,
  },
  logoutButton: {
    marginTop: 8,
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  logoutText: {
    color: theme.colors.error,
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: 32,
  },
});
