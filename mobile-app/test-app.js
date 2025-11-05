// Quick validation test for the mobile app
console.log('🧪 Testing mobile app components...\n');

// Test imports
try {
  console.log('✅ Testing App.js...');
  require('./App.js');
  console.log('   ✓ App.js loaded successfully\n');
} catch (error) {
  console.error('❌ App.js failed:', error.message);
  process.exit(1);
}

try {
  console.log('✅ Testing API service...');
  const { apiService } = require('./src/config/api.js');
  console.log('   ✓ API service loaded');
  console.log('   ✓ Methods:', Object.keys(apiService).join(', '));
  console.log();
} catch (error) {
  console.error('❌ API service failed:', error.message);
  process.exit(1);
}

try {
  console.log('✅ Testing available cards data...');
  const { AVAILABLE_CARDS } = require('./src/data/availableCards.js');
  console.log(`   ✓ ${AVAILABLE_CARDS.length} cards loaded`);
  console.log(`   ✓ Sample cards: ${AVAILABLE_CARDS.slice(0, 3).map(c => c.issuer).join(', ')}`);
  console.log();
} catch (error) {
  console.error('❌ Available cards data failed:', error.message);
  process.exit(1);
}

const screens = [
  './src/screens/WelcomeScreen.js',
  './src/screens/RegisterScreen.js',
  './src/screens/SelectCardsScreen.js',
  './src/screens/RecommendScreen.js',
  './src/screens/MyCardsScreen.js',
  './src/screens/ProfileScreen.js',
];

console.log('✅ Testing screens...');
screens.forEach(screen => {
  try {
    require(screen);
    console.log(`   ✓ ${screen.split('/').pop()}`);
  } catch (error) {
    console.error(`   ❌ ${screen.split('/').pop()} failed:`, error.message);
    process.exit(1);
  }
});

console.log('\n🎉 All tests passed! The mobile app is ready to run.');
console.log('\n📱 To start the app, run:');
console.log('   npm start\n');
console.log('Then press:');
console.log('   • i for iOS Simulator');
console.log('   • a for Android Emulator');
console.log('   • or scan QR code with Expo Go app\n');


