import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api.service';
import { RecommendationResponse } from '../types';
import { STORAGE_KEYS } from '../config/constants';

interface PopularStore {
  name: string;
  icon: string;
  category: string;
}

interface NetworkBadge {
  label: string;
  color: string;
}

// Popular merchants for quick selection
const POPULAR_STORES: PopularStore[] = [
  { name: 'Whole Foods', icon: '🛒', category: 'Grocery' },
  { name: 'Costco', icon: '🏬', category: 'Wholesale' },
  { name: 'Target', icon: '🎯', category: 'Retail' },
  { name: 'Walmart', icon: '🛍️', category: 'Retail' },
  { name: 'Chipotle', icon: '🌯', category: 'Dining' },
  { name: 'Starbucks', icon: '☕', category: 'Coffee' },
  { name: 'Shell', icon: '⛽', category: 'Gas' },
  { name: 'Delta', icon: '✈️', category: 'Travel' },
  { name: 'Marriott', icon: '🏨', category: 'Hotel' },
  { name: 'Netflix', icon: '📺', category: 'Streaming' },
  { name: 'Amazon', icon: '📦', category: 'Online' },
  { name: 'Uber', icon: '🚗', category: 'Transit' },
];

export default function RecommendScreen() {
  const [merchantName, setMerchantName] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    loadCustomerInfo();
  }, []);

  const loadCustomerInfo = async () => {
    try {
      const name = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_NAME);
      setCustomerName(name || '');
    } catch (error) {
      console.error('Error loading customer info:', error);
    }
  };

  const handleQuickSelect = (storeName: string) => {
    setMerchantName(storeName);
    setRecommendation(null);
  };

  const handleFindCard = async () => {
    if (!merchantName.trim()) {
      Alert.alert('Missing Information', 'Please enter a store name');
      return;
    }

    setLoading(true);
    setRecommendation(null);

    try {
      const customerId = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
      if (!customerId) {
        Alert.alert('Error', 'Customer ID not found');
        return;
      }
      
      const requestData: any = {
        customer_id: customerId,
        merchant_name: merchantName.trim(),
        top_n: 3,
      };

      // Add purchase amount if provided
      if (purchaseAmount && parseFloat(purchaseAmount) > 0) {
        requestData.purchase_amount = parseFloat(purchaseAmount);
      }

      const result = await apiService.getRecommendation(requestData);
      setRecommendation(result);
    } catch (error: any) {
      console.error('Recommendation error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Unable to get recommendation. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMerchantName('');
    setPurchaseAmount('');
    setRecommendation(null);
  };

  const getNetworkBadge = (cardName: string): NetworkBadge => {
    if (cardName.includes('American Express')) return { label: 'Amex', color: '#006FCF' };
    if (cardName.includes('Chase')) return { label: 'Visa', color: '#1A1F71' };
    if (cardName.includes('Citi')) return { label: 'Mastercard', color: '#EB001B' };
    if (cardName.includes('Discover')) return { label: 'Discover', color: '#FF6000' };
    if (cardName.includes('Capital One')) {
      if (cardName.includes('Venture')) return { label: 'Visa', color: '#1A1F71' };
      return { label: 'Mastercard', color: '#EB001B' };
    }
    if (cardName.includes('Wells Fargo')) return { label: 'Visa', color: '#1A1F71' };
    return { label: 'Card', color: '#666' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.greeting}>
            {customerName ? `Hi, ${customerName.split(' ')[0]}! 👋` : 'Hi! 👋'}
          </Text>
          <Text variant="titleLarge" style={styles.title}>
            Find Your Best Card
          </Text>
        </View>

        <Card style={styles.searchCard}>
          <Card.Content>
            <TextInput
              label="Where are you shopping?"
              value={merchantName}
              onChangeText={setMerchantName}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Whole Foods, Target, Chipotle"
              left={<TextInput.Icon icon="store" />}
              disabled={loading}
            />

            <TextInput
              label="Purchase Amount (Optional)"
              value={purchaseAmount}
              onChangeText={setPurchaseAmount}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
              placeholder="e.g., 50.00"
              left={<TextInput.Icon icon="currency-usd" />}
              disabled={loading}
            />

            <Button
              mode="contained"
              onPress={handleFindCard}
              style={styles.findButton}
              contentStyle={styles.findButtonContent}
              loading={loading}
              disabled={loading || !merchantName.trim()}
            >
              Find Best Card
            </Button>
          </Card.Content>
        </Card>

        {!recommendation && !loading && (
          <>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Popular Stores
            </Text>
            <View style={styles.quickSelectGrid}>
              {POPULAR_STORES.map((store) => (
                <TouchableOpacity
                  key={store.name}
                  onPress={() => handleQuickSelect(store.name)}
                  style={styles.quickSelectItem}
                >
                  <Card style={styles.quickSelectCard}>
                    <Card.Content style={styles.quickSelectContent}>
                      <Text style={styles.quickSelectIcon}>{store.icon}</Text>
                      <Text variant="bodySmall" style={styles.quickSelectName}>
                        {store.name}
                      </Text>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.loadingText}>
              Finding your best card...
            </Text>
          </View>
        )}

        {recommendation && !loading && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text variant="titleLarge" style={styles.resultsTitle}>
                💳 Recommendations for {recommendation.merchant_name}
              </Text>
              <Button mode="text" onPress={handleReset}>
                New Search
              </Button>
            </View>

            {recommendation.categories_identified && recommendation.categories_identified.length > 0 && (
              <View style={styles.categoriesContainer}>
                {recommendation.categories_identified.map((cat, idx) => (
                  <Chip key={idx} compact style={styles.categoryChip}>
                    {cat}
                  </Chip>
                ))}
              </View>
            )}

            {recommendation.recommendations.map((rec, index) => {
              const network = getNetworkBadge(rec.card_name);
              return (
                <Card
                  key={rec.card_id}
                  style={[
                    styles.recommendationCard,
                    index === 0 && styles.bestCard,
                  ]}
                >
                  <Card.Content>
                    {index === 0 && (
                      <View style={styles.bestBadge}>
                        <Text style={styles.bestBadgeText}>🏆 BEST CHOICE</Text>
                      </View>
                    )}
                    
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleRow}>
                        <Text variant="titleMedium" style={styles.cardTitle}>
                          {rec.card_name}
                        </Text>
                        <Chip
                          compact
                          style={[styles.networkChip, { backgroundColor: network.color + '20' }]}
                          textStyle={{ color: network.color, fontSize: 10 }}
                        >
                          {network.label}
                        </Chip>
                      </View>
                    </View>

                    <View style={styles.rewardSection}>
                      <View style={styles.rewardMain}>
                        <Text variant="headlineMedium" style={styles.rewardRate}>
                          {rec.reward_rate}%
                        </Text>
                        {rec.estimated_reward && (
                          <Text variant="titleLarge" style={styles.rewardAmount}>
                            ${rec.estimated_reward.toFixed(2)}
                          </Text>
                        )}
                      </View>
                      <Text variant="bodyMedium" style={styles.reason}>
                        {rec.reward_details}
                      </Text>
                    </View>

                    {rec.comparison && (
                      <View style={styles.comparisonSection}>
                        <Text variant="bodySmall" style={styles.comparison}>
                          💡 {rec.comparison}
                        </Text>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
  },
  searchCard: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  findButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  findButtonContent: {
    paddingVertical: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  quickSelectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickSelectItem: {
    width: '30%',
  },
  quickSelectCard: {
    elevation: 1,
  },
  quickSelectContent: {
    alignItems: 'center',
    padding: 8,
  },
  quickSelectIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  quickSelectName: {
    textAlign: 'center',
    fontSize: 11,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#e3f2fd',
  },
  recommendationCard: {
    marginBottom: 16,
    elevation: 2,
  },
  bestCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  bestBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  bestBadgeText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  networkChip: {
    height: 20,
  },
  cardNumber: {
    color: '#666',
  },
  rewardSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  rewardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rewardRate: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  rewardAmount: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  reason: {
    color: '#666',
  },
  comparisonSection: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
  },
  comparison: {
    color: '#856404',
    lineHeight: 18,
  },
});

