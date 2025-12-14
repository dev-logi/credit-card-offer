import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Alert, TouchableOpacity, Animated } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Swipeable } from 'react-native-gesture-handler';
import { apiService } from '../services/api.service';
import { AVAILABLE_CARDS, getCardById } from '../data/availableCards';
import { MainTabsParamList, CreditCard, AvailableCard } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { theme } from '../config/theme';
import { LinearGradient } from 'expo-linear-gradient';

type MyCardsScreenNavigationProp = NativeStackNavigationProp<MainTabsParamList, 'MyCards'>;

interface MyCardsScreenProps {
  navigation: MyCardsScreenNavigationProp;
}

export default function MyCardsScreen({ navigation }: MyCardsScreenProps) {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCards();
    });
    return unsubscribe;
  }, [navigation]);

  const loadCards = async () => {
    try {
      const customerId = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
      if (customerId) {
        const response = await apiService.getCustomerCards(customerId);
        setCards(response);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCards();
  };

  const getCardGradient = (issuer: string): readonly [string, string, ...string[]] => {
    if (issuer.includes('American Express')) return ['#006FCF', '#004080'];
    if (issuer.includes('Chase')) return ['#1A1F71', '#0D1040'];
    if (issuer.includes('Citi')) return ['#004A98', '#002D5C'];
    if (issuer.includes('Discover')) return ['#FF6000', '#CC4D00'];
    if (issuer.includes('Capital One')) return ['#D03027', '#9B231C'];
    return ['#475569', '#334155'];
  };

  const handleDeleteCard = async (card: CreditCard) => {
    Alert.alert(
      'Delete Card',
      `Are you sure you want to remove ${card.card_name} from your wallet?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const customerId = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
              if (customerId) {
                await apiService.deleteCard(customerId, card.id);
                const updatedCards = cards.filter(c => c.id !== card.id);
                await AsyncStorage.setItem('cardCount', updatedCards.length.toString());
                setCards(updatedCards);
              }
            } catch (error) {
              console.error('Error deleting card:', error);
              Alert.alert('Error', 'Failed to delete card. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (card: CreditCard) => (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteButtonContainer}
        onPress={() => handleDeleteCard(card)}
      >
        <Animated.View
          style={[
            styles.deleteButton,
            { transform: [{ translateX: trans }] },
          ]}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            My Wallet
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {cards.length} card{cards.length !== 1 ? 's' : ''} added
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
          }
        >
          {cards.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>💳</Text>
              </View>
              <Text variant="titleLarge" style={styles.emptyTitle}>
                No Cards Yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Add your credit cards to get personalized recommendations
              </Text>
            </View>
          ) : (
            <View style={styles.cardStack}>
              {cards.map((card, index) => {
                const gradientColors = getCardGradient(card.issuer);

                return (
                  <Swipeable
                    key={card.id}
                    renderRightActions={renderRightActions(card)}
                    overshootRight={false}
                  >
                    <View style={[styles.cardContainer, { zIndex: cards.length - index }]}>
                      <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                      >
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardIssuer}>{card.issuer.toUpperCase()}</Text>
                          <Text style={styles.cardName}>{card.card_name}</Text>
                        </View>

                        <View style={styles.cardBody}>
                          <View style={styles.chip} />
                          <Text style={styles.cardNumber}>•••• •••• •••• {card.last_four}</Text>
                        </View>

                        <View style={styles.cardFooter}>
                          <View>
                            <Text style={styles.cardLabel}>CARDHOLDER</Text>
                            <Text style={styles.cardValue}>LOGESH</Text>
                          </View>
                          <View>
                            <Text style={styles.cardLabel}>REWARDS</Text>
                            <Text style={styles.cardValue}>{card.base_reward_rate}%</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  </Swipeable>
                );
              })}
            </View>
          )}
        </ScrollView>

        <FAB
          icon="plus"
          style={styles.fab}
          color="white"
          onPress={async () => {
            const customerId = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
            if (customerId) {
              navigation.navigate('SelectCards' as any, { customerId, isFirstTime: false });
            }
          }}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  cardStack: {
    marginTop: 10,
  },
  cardContainer: {
    marginBottom: -80, // Negative margin for stack effect
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    height: 200,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIssuer: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  cardName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
    maxWidth: '60%',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  chip: {
    width: 40,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardNumber: {
    color: 'white',
    fontSize: 18,
    letterSpacing: 2,
    fontFamily: 'Courier', // Monospace font if available
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginBottom: 2,
  },
  cardValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
  },
  deleteButtonContainer: {
    width: 80,
    height: 200,
    marginBottom: -80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 24,
  },
});
