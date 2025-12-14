import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { apiService } from '../services/api.service';
import { AVAILABLE_CARDS, groupCardsByIssuer } from '../data/availableCards';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList, AvailableCard } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { ModernButton } from '../components/ModernButton';
import { theme } from '../config/theme';
import { LinearGradient } from 'expo-linear-gradient';

type SelectCardsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectCards'>;
type SelectCardsScreenRouteProp = RouteProp<RootStackParamList, 'SelectCards'>;

interface SelectCardsScreenProps {
  navigation: SelectCardsScreenNavigationProp;
  route: SelectCardsScreenRouteProp;
}

export default function SelectCardsScreen({ route, navigation }: SelectCardsScreenProps) {
  const { customerId, isFirstTime } = route.params;
  const { handleRegistrationComplete } = useAuth();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCards = AVAILABLE_CARDS.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCards = groupCardsByIssuer();

  const toggleCard = (cardId: string) => {
    setSelectedCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleContinue = async () => {
    if (selectedCards.length === 0) {
      Alert.alert('No Cards Selected', 'Please select at least one credit card to continue.');
      return;
    }

    setLoading(true);
    try {
      // First, get existing cards to avoid duplicates
      const existingCards = await apiService.getCustomerCards(customerId);
      const existingCardIds = new Set(existingCards.map(c => c.id));

      // Add each selected card to the customer's account
      for (const cardId of selectedCards) {
        const cardInfo = AVAILABLE_CARDS.find(c => c.id === cardId);
        if (!cardInfo) {
          console.warn(`Card info not found for ID: ${cardId}`);
          continue;
        }

        const cardDbId = `${customerId}_${cardId}`;
        
        // Skip if card already exists
        if (existingCardIds.has(cardDbId)) {
          console.log(`Card ${cardInfo.name} already exists, skipping...`);
          continue;
        }

        console.log(`Adding card: ${cardInfo.name} (${cardInfo.issuer})`);
        await apiService.addCard(customerId, {
          id: cardDbId,
          card_name: cardInfo.name,
          issuer: cardInfo.issuer,
          last_four: '0000', // Placeholder
          base_reward_rate: 1.0, // Will be set by backend based on card type
        });
      }

      // Fetch actual total card count from API
      const allCards = await apiService.getCustomerCards(customerId);
      const totalCount = allCards.length;
      await AsyncStorage.setItem(STORAGE_KEYS.CARDS_COUNT, totalCount.toString());

      if (isFirstTime) {
        await handleRegistrationComplete();
        Alert.alert(
          'Setup Complete! 🎉',
          `You've added ${totalCount} card${totalCount > 1 ? 's' : ''} to your wallet. Let's find the best card for your next purchase!`,
          [{ text: 'Start Using' }]
        );
      } else {
        Alert.alert(
          'Cards Added! ✅',
          `Successfully added ${selectedCards.length} card${selectedCards.length > 1 ? 's' : ''}. You now have ${totalCount} card${totalCount > 1 ? 's' : ''} in your wallet.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      console.error('Error adding cards:', error);
      Alert.alert('Error', 'Failed to add cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCardGradient = (issuer: string): readonly [string, string, ...string[]] => {
    if (issuer.includes('American Express')) return ['#006FCF', '#004080'];
    if (issuer.includes('Chase')) return ['#1A1F71', '#0D1040'];
    if (issuer.includes('Citi')) return ['#004A98', '#002D5C'];
    if (issuer.includes('Discover')) return ['#FF6000', '#CC4D00'];
    if (issuer.includes('Capital One')) return ['#D03027', '#9B231C'];
    return ['#475569', '#334155'];
  };

  const renderCardItem = (card: AvailableCard) => {
    const isSelected = selectedCards.includes(card.id);
    const gradientColors = getCardGradient(card.issuer);

    return (
      <TouchableOpacity
        key={card.id}
        onPress={() => toggleCard(card.id)}
        activeOpacity={0.9}
        style={styles.cardItem}
      >
        <GlassCard style={[styles.card, isSelected && styles.cardSelected]}>
          <View style={styles.cardContent}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardPreview}
            />
            <View style={styles.cardInfo}>
              <Text variant="titleMedium" style={styles.cardName} numberOfLines={1}>
                {card.name}
              </Text>
              <Text variant="bodySmall" style={styles.cardIssuer}>
                {card.issuer}
              </Text>
              <Text variant="bodySmall" style={styles.cardDesc} numberOfLines={1}>
                {card.description}
              </Text>
            </View>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {isFirstTime ? 'Select Your Cards' : 'Add More Cards'}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {isFirstTime
              ? 'Tap the cards you currently own'
              : 'Select additional cards to add'
            }
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search cards..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            iconColor="rgba(255, 255, 255, 0.7)"
          />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {searchQuery ? (
            <View style={styles.cardList}>
              {filteredCards.map(renderCardItem)}
            </View>
          ) : (
            Object.entries(groupedCards).map(([issuer, cards]) => (
              <View key={issuer} style={styles.issuerGroup}>
                <Text variant="titleMedium" style={styles.issuerName}>
                  {issuer}
                </Text>
                {cards.map(renderCardItem)}
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.footer}>
          <ModernButton
            title={isFirstTime ? `Continue (${selectedCards.length})` : `Add ${selectedCards.length} Cards`}
            onPress={handleContinue}
            disabled={selectedCards.length === 0 || loading}
            loading={loading}
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
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    elevation: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  issuerGroup: {
    marginBottom: 24,
  },
  issuerName: {
    paddingHorizontal: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  cardList: {
    paddingBottom: 16,
  },
  cardItem: {
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardPreview: {
    width: 60,
    height: 38,
    borderRadius: 6,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  cardIssuer: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  cardDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Gradient background for footer to fade out content behind it
  },
  button: {
    width: '100%',
  },
});
