import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Chip, Searchbar, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../config/api';
import { AVAILABLE_CARDS, groupCardsByIssuer } from '../data/availableCards';
import { useAuth } from '../../App';

export default function SelectCardsScreen({ route, navigation }) {
  const { customerId, isFirstTime } = route.params;
  const { handleRegistrationComplete } = useAuth();
  const [selectedCards, setSelectedCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCards = AVAILABLE_CARDS.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCards = groupCardsByIssuer();

  const toggleCard = (cardId) => {
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
      // Add each selected card to the customer's account
      for (const cardId of selectedCards) {
        const cardInfo = AVAILABLE_CARDS.find(c => c.id === cardId);
        await apiService.addCard(customerId, {
          id: `${customerId}_${cardId}`,
          card_name: cardInfo.name,
          issuer: cardInfo.issuer,
          last_four: '0000', // Placeholder
          base_reward_rate: 1.0, // Will be set by backend based on card type
        });
      }

      // Fetch actual total card count from API
      const allCards = await apiService.getCustomerCards(customerId);
      const totalCount = allCards.length;
      await AsyncStorage.setItem('cardsCount', totalCount.toString());
      console.log(`✅ Total cards now: ${totalCount}`);

      if (isFirstTime) {
        // Complete registration - update app state to show main tabs
        console.log('✅ Cards added successfully - completing registration');
        await handleRegistrationComplete();
        // Show success message (navigation will happen automatically)
        Alert.alert(
          'Setup Complete! 🎉',
          `You've added ${totalCount} card${totalCount > 1 ? 's' : ''} to your wallet. Let's find the best card for your next purchase!`,
          [{ text: 'Start Using' }]
        );
      } else {
        // Going back to My Cards screen after adding cards
        console.log(`✅ ${selectedCards.length} card(s) added - total now: ${totalCount}`);
        Alert.alert(
          'Cards Added! ✅',
          `Successfully added ${selectedCards.length} card${selectedCards.length > 1 ? 's' : ''}. You now have ${totalCount} card${totalCount > 1 ? 's' : ''} in your wallet.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error adding cards:', error);
      
      // Check if it's a 404 error (customer doesn't exist)
      if (error.response?.status === 404) {
        Alert.alert(
          '🚨 Customer Not Found',
          'Your customer ID is invalid (database was reset).\n\n' +
          '📋 TO FIX:\n' +
          '1. Press F12 to open Console\n' +
          '2. Run: localStorage.clear(); location.reload();\n' +
          '3. Register fresh account\n\n' +
          'This will take 30 seconds and fix the issue!',
          [
            {
              text: 'Clear Storage Now',
              onPress: () => {
                AsyncStorage.clear();
                Alert.alert('Storage Cleared', 'Please refresh the page (Cmd+R or Ctrl+R)');
              }
            },
            { text: 'OK' }
          ]
        );
      } else {
        Alert.alert(
          'Error',
          `Failed to add cards: ${error.message}\n\nPlease try again or check console for details.`,
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderCardItem = (card) => {
    const isSelected = selectedCards.includes(card.id);
    
    return (
      <TouchableOpacity
        key={card.id}
        onPress={() => toggleCard(card.id)}
        style={styles.cardItem}
      >
        <Card style={[styles.card, isSelected && styles.cardSelected]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <View style={styles.cardInfo}>
                <Text variant="titleMedium" style={styles.cardName}>
                  {card.name}
                </Text>
                <Text variant="bodySmall" style={styles.cardIssuer}>
                  {card.issuer}
                </Text>
              </View>
              {isSelected && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <View style={styles.cardDetails}>
              <Chip icon="information" compact style={styles.chip}>
                {card.annualFee === 0 ? 'No Annual Fee' : `$${card.annualFee}/year`}
              </Chip>
              <Text variant="bodySmall" style={styles.highlights}>
                {card.highlights}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {isFirstTime ? 'Select Your Cards' : 'Add More Cards'}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {isFirstTime 
            ? 'Choose the credit cards you own'
            : 'Select additional cards to add'
          }
        </Text>
        {selectedCards.length > 0 && (
          <Chip style={styles.selectionChip}>
            {selectedCards.length} card{selectedCards.length > 1 ? 's' : ''} selected
          </Chip>
        )}
      </View>

      <Searchbar
        placeholder="Search cards..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView style={styles.scrollView}>
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
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={selectedCards.length === 0 || loading}
          loading={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {isFirstTime ? 'Continue' : 'Add Cards'}
        </Button>
        {!isFirstTime && (
          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    marginBottom: 8,
  },
  selectionChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  searchBar: {
    marginHorizontal: 16,
    marginVertical: 12,
    elevation: 0,
  },
  scrollView: {
    flex: 1,
  },
  issuerGroup: {
    marginBottom: 24,
  },
  issuerName: {
    paddingHorizontal: 24,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  cardList: {
    paddingBottom: 16,
  },
  cardItem: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    elevation: 1,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontWeight: '600',
  },
  cardIssuer: {
    color: '#666',
  },
  checkmark: {
    fontSize: 24,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  cardDetails: {
    gap: 8,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  highlights: {
    color: '#666',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
});

