import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, FAB, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiService } from '../services/api.service';
import { AVAILABLE_CARDS, getCardById } from '../data/availableCards';
import { MainTabsParamList, CreditCard, AvailableCard } from '../types';
import { STORAGE_KEYS } from '../config/constants';

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

  // Reload cards when screen comes into focus
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

  const getCardDetails = (cardName: string): AvailableCard | null => {
    // Try to match with available cards
    for (const availableCard of AVAILABLE_CARDS) {
      if (availableCard.name === cardName) {
        return availableCard;
      }
    }
    return null;
  };

  const getNetworkColor = (issuer: string): string => {
    if (issuer.includes('American Express')) return '#006FCF';
    if (issuer.includes('Chase')) return '#1A1F71';
    if (issuer.includes('Citi')) return '#EB001B';
    if (issuer.includes('Discover')) return '#FF6000';
    if (issuer.includes('Capital One')) return '#004977';
    if (issuer.includes('Wells Fargo')) return '#D71E28';
    return '#666';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          My Cards
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {cards.length} card{cards.length !== 1 ? 's' : ''} in your wallet
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {cards.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text variant="titleLarge" style={styles.emptyTitle}>
              No Cards Yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Add your credit cards to get personalized recommendations
            </Text>
          </View>
        ) : (
          <View style={styles.cardList}>
            {cards.map((card) => {
              const cardColor = getNetworkColor(card.issuer);
              const cardInfo = getCardDetails(card.card_name);
              
              return (
                <Card key={card.id} style={styles.card}>
                  <View style={[styles.cardAccent, { backgroundColor: cardColor }]} />
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardIcon}>💳</Text>
                      <View style={styles.cardInfo}>
                        <Text variant="titleMedium" style={styles.cardName}>
                          {card.card_name}
                        </Text>
                        <Text variant="bodySmall" style={styles.issuer}>
                          {card.issuer}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardDetails}>
                      <Chip icon="credit-card" compact style={styles.chip}>
                        •••• {card.last_four}
                      </Chip>
                      <Chip icon="percent" compact style={styles.chip}>
                        {card.base_reward_rate}% base rewards
                      </Chip>
                    </View>

                    {cardInfo?.description && (
                      <Text variant="bodySmall" style={styles.highlights}>
                        🎯 {cardInfo.description}
                      </Text>
                    )}
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        label="Add Card"
        style={styles.fab}
        onPress={async () => {
          const customerId = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
          if (customerId) {
            navigation.navigate('SelectCards' as any, { customerId, isFirstTime: false });
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  cardList: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  cardAccent: {
    height: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontWeight: '600',
  },
  issuer: {
    color: '#666',
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#f0f0f0',
  },
  highlights: {
    color: '#666',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

