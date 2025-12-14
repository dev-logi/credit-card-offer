import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, TextInput, ActivityIndicator, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api.service';
import { getCurrentLocation } from '../services/location.service';
import { RecommendationResponse, NearbyMerchant } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { ModernButton } from '../components/ModernButton';
import { theme } from '../config/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface PopularStore {
  name: string;
  icon: string;
  category: string;
}

interface NetworkBadge {
  label: string;
  color: string;
}

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
  const [nearbyStores, setNearbyStores] = useState<PopularStore[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadCustomerInfo();
    loadNearbyStores();
  }, []);

  const loadCustomerInfo = async () => {
    try {
      const name = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_NAME);
      setCustomerName(name || '');
    } catch (error) {
      console.error('Error loading customer info:', error);
    }
  };

  const loadNearbyStores = async (searchText?: string) => {
    setLoadingNearby(true);
    setIsSearching(!!searchText);
    try {
      const location = await getCurrentLocation();

      if (location) {
        const response = await apiService.getNearbyMerchants(
          location.latitude,
          location.longitude,
          5000,
          searchText || undefined
        );

        if (response.merchants && response.merchants.length > 0) {
          const stores: PopularStore[] = response.merchants.map((merchant: NearbyMerchant) => ({
            name: merchant.name,
            icon: merchant.icon,
            category: merchant.category.charAt(0).toUpperCase() + merchant.category.slice(1),
          }));
          setNearbyStores(stores);
        } else if (searchText) {
          setNearbyStores([]);
        }
      }
    } catch (error) {
      console.error('Error loading nearby stores:', error);
      if (!searchText) {
        setNearbyStores([]);
      }
    } finally {
      setLoadingNearby(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      loadNearbyStores(searchQuery.trim());
    } else {
      loadNearbyStores();
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    loadNearbyStores();
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
    if (cardName.includes('American Express')) return { label: 'Amex', color: '#3b82f6' };
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
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingLabel}>Good Morning,</Text>
              <Text variant="headlineMedium" style={styles.greetingName}>
                {customerName ? `${customerName.split(' ')[0]} 👋` : 'Guest 👋'}
              </Text>
            </View>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${customerName || 'Guest'}` }}
                style={styles.avatar}
              />
            </View>
          </View>

          <GlassCard style={styles.searchCard}>
            <View style={styles.searchContent}>
              <View style={styles.inputRow}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  value={merchantName}
                  onChangeText={setMerchantName}
                  placeholder="Where are you shopping?"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  style={styles.searchInput}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor={theme.colors.text}
                  disabled={loading}
                />
              </View>
              {merchantName.length > 0 && (
                <ModernButton
                  title="Find Best Card"
                  onPress={handleFindCard}
                  loading={loading}
                  style={styles.findButton}
                />
              )}
            </View>
          </GlassCard>

          {!recommendation && !loading && (
            <>
              {/* Nearby Places Section */}
              <View style={styles.nearbyHeader}>
                <Text style={styles.sectionTitle}>NEARBY PLACES</Text>
                <TouchableOpacity onPress={() => loadNearbyStores()}>
                  <Text style={styles.refreshText}>🔄 Refresh</Text>
                </TouchableOpacity>
              </View>
              
              <GlassCard style={styles.searchBarCard}>
                <View style={styles.searchBarRow}>
                  <Text style={styles.searchBarIcon}>📍</Text>
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search nearby places..."
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    style={styles.searchInputSmall}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={theme.colors.text}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    right={
                      searchQuery ? (
                        <TextInput.Icon
                          icon="close"
                          onPress={handleClearSearch}
                          color="rgba(255, 255, 255, 0.7)"
                        />
                      ) : (
                        <TextInput.Icon
                          icon="magnify"
                          onPress={handleSearch}
                          color="rgba(255, 255, 255, 0.7)"
                        />
                      )
                    }
                  />
                </View>
              </GlassCard>

              {loadingNearby ? (
                <View style={styles.loadingNearby}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={styles.loadingNearbyText}>Finding nearby places...</Text>
                </View>
              ) : nearbyStores.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickSelectScroll}>
                  {nearbyStores.map((store) => (
                    <TouchableOpacity
                      key={store.name}
                      onPress={() => handleQuickSelect(store.name)}
                      style={styles.quickSelectItem}
                    >
                      <GlassCard style={styles.quickSelectCard}>
                        <Text style={styles.quickSelectIcon}>{store.icon}</Text>
                      </GlassCard>
                      <Text style={styles.quickSelectName}>{store.name}</Text>
                      <Text style={styles.quickSelectCategory}>{store.category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyNearby}>
                  <Text style={styles.emptyNearbyText}>
                    {isSearching ? 'No places found nearby' : 'Enable location to see nearby places'}
                  </Text>
                </View>
              )}

              <Text style={styles.sectionTitle}>POPULAR MERCHANTS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickSelectScroll}>
                {POPULAR_STORES.map((store) => (
                  <TouchableOpacity
                    key={store.name}
                    onPress={() => handleQuickSelect(store.name)}
                    style={styles.quickSelectItem}
                  >
                    <GlassCard style={styles.quickSelectCard}>
                      <Text style={styles.quickSelectIcon}>{store.icon}</Text>
                    </GlassCard>
                    <Text style={styles.quickSelectName}>{store.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Finding your best card...</Text>
            </View>
          )}

          {recommendation && !loading && (
            <View style={styles.resultsContainer}>
              <View style={styles.resultsHeader}>
                <Text variant="titleLarge" style={styles.resultsTitle}>
                  Best for "{recommendation.merchant_name}"
                </Text>
                <TouchableOpacity onPress={handleReset}>
                  <Text style={styles.resetText}>New Search</Text>
                </TouchableOpacity>
              </View>

              {recommendation.recommendations.map((rec, index) => {
                const network = getNetworkBadge(rec.card_name);
                const isBest = index === 0;

                return (
                  <GlassCard
                    key={rec.card_id}
                    style={[
                      styles.recommendationCard,
                      isBest && styles.bestCard,
                    ]}
                  >
                    <View style={styles.cardContent}>
                      {isBest && (
                        <View style={styles.bestBadge}>
                          <Text style={styles.bestBadgeText}>🏆 BEST CHOICE</Text>
                        </View>
                      )}

                      <View style={styles.cardHeader}>
                        <View style={styles.cardInfo}>
                          <Text variant="titleMedium" style={styles.cardName}>
                            {rec.card_name}
                          </Text>
                          <Text style={styles.cardLastFour}>•••• 0000</Text>
                        </View>
                        <View style={styles.networkBadge}>
                          <Text style={[styles.networkText, { color: network.color }]}>{network.label}</Text>
                        </View>
                      </View>

                      <View style={styles.rewardRow}>
                        <View style={styles.rewardInfo}>
                          <Text style={styles.rewardRate}>{rec.reward_rate}%</Text>
                          <Text style={styles.rewardLabel}>Cash Back</Text>
                        </View>
                        <View style={styles.rewardDetails}>
                          <Text style={styles.reasonText}>{rec.reward_details}</Text>
                        </View>
                      </View>
                    </View>
                  </GlassCard>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greetingLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  greetingName: {
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  searchCard: {
    marginBottom: 32,
    borderRadius: 24,
  },
  searchContent: {
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
    marginLeft: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 40,
    fontSize: 16,
  },
  findButton: {
    marginTop: 16,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
  },
  quickSelectScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickSelectItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  quickSelectCard: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  quickSelectIcon: {
    fontSize: 24,
  },
  quickSelectName: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
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
    fontWeight: 'bold',
    color: theme.colors.text,
    fontSize: 18,
  },
  resetText: {
    color: theme.colors.primary,
  },
  recommendationCard: {
    marginBottom: 16,
    borderRadius: 20,
  },
  bestCard: {
    borderColor: 'rgba(234, 179, 8, 0.5)', // Yellow border
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
  },
  cardContent: {
    padding: 20,
  },
  bestBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  bestBadgeText: {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontWeight: 'bold',
    color: theme.colors.text,
    fontSize: 18,
    marginBottom: 4,
  },
  cardLastFour: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
  networkBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  networkText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardInfo: {
    marginRight: 24,
  },
  rewardRate: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ade80', // Green 400
  },
  rewardLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  rewardDetails: {
    flex: 1,
  },
  reasonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
  nearbyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  searchBarCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  searchBarIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInputSmall: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 36,
    fontSize: 14,
  },
  loadingNearby: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingNearbyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 8,
    fontSize: 12,
  },
  emptyNearby: {
    padding: 20,
    alignItems: 'center',
  },
  emptyNearbyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    textAlign: 'center',
  },
  quickSelectCategory: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
});
