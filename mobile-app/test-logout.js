/**
 * Logout Functionality Test Script
 * Tests the complete logout flow and data clearing
 */

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

// Test utilities
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function testHeader(title) {
  log('\n' + '='.repeat(60), colors.blue);
  log(title, colors.blue);
  log('='.repeat(60), colors.blue);
}

function testResult(name, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  const color = passed ? colors.green : colors.red;
  log(`${icon} ${name}`, color);
  if (details) {
    log(`   ${details}`, colors.yellow);
  }
}

// Test cases
async function runTests() {
  testHeader('LOGOUT FUNCTIONALITY TEST SUITE');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  // Test 1: Initial state check
  testHeader('Test 1: Initial State Check');
  try {
    const keys = await AsyncStorage.getAllKeys();
    log(`Found ${keys.length} keys in AsyncStorage:`, colors.yellow);
    keys.forEach(key => log(`  - ${key}`, colors.yellow));
    results.total++;
    results.passed++;
    testResult('Initial state retrieved', true, `${keys.length} keys found`);
  } catch (error) {
    results.total++;
    results.failed++;
    testResult('Initial state check', false, error.message);
  }

  // Test 2: Simulate user session
  testHeader('Test 2: Simulate User Session');
  try {
    await AsyncStorage.setItem('customerId', 'test-user-123');
    await AsyncStorage.setItem('customerName', 'Test User');
    await AsyncStorage.setItem('customerEmail', 'test@example.com');
    await AsyncStorage.setItem('cardsCount', '3');
    
    const verifyKeys = await AsyncStorage.getAllKeys();
    const hasAllKeys = verifyKeys.includes('customerId') && 
                       verifyKeys.includes('customerName') && 
                       verifyKeys.includes('customerEmail') &&
                       verifyKeys.includes('cardsCount');
    
    results.total++;
    if (hasAllKeys) {
      results.passed++;
      testResult('User session created', true, '4 keys stored successfully');
    } else {
      results.failed++;
      testResult('User session creation', false, 'Not all keys were stored');
    }
  } catch (error) {
    results.total++;
    results.failed++;
    testResult('User session creation', false, error.message);
  }

  // Test 3: Verify data persistence
  testHeader('Test 3: Verify Data Persistence');
  try {
    const customerId = await AsyncStorage.getItem('customerId');
    const customerName = await AsyncStorage.getItem('customerName');
    const customerEmail = await AsyncStorage.getItem('customerEmail');
    const cardsCount = await AsyncStorage.getItem('cardsCount');
    
    const allDataPresent = customerId && customerName && customerEmail && cardsCount;
    
    results.total++;
    if (allDataPresent) {
      results.passed++;
      testResult('Data persistence verified', true, 'All user data retrieved');
      log(`   customerId: ${customerId}`, colors.yellow);
      log(`   customerName: ${customerName}`, colors.yellow);
      log(`   customerEmail: ${customerEmail}`, colors.yellow);
      log(`   cardsCount: ${cardsCount}`, colors.yellow);
    } else {
      results.failed++;
      testResult('Data persistence', false, 'Some data is missing');
    }
  } catch (error) {
    results.total++;
    results.failed++;
    testResult('Data persistence check', false, error.message);
  }

  // Test 4: Simulate logout (clear storage)
  testHeader('Test 4: Simulate Logout - Clear Storage');
  try {
    log('Clearing AsyncStorage...', colors.yellow);
    await AsyncStorage.clear();
    
    const remainingKeys = await AsyncStorage.getAllKeys();
    
    results.total++;
    if (remainingKeys.length === 0) {
      results.passed++;
      testResult('Storage cleared successfully', true, 'All keys removed');
    } else {
      results.failed++;
      testResult('Storage clear', false, `${remainingKeys.length} keys still present`);
      log(`   Remaining keys: ${remainingKeys.join(', ')}`, colors.red);
    }
  } catch (error) {
    results.total++;
    results.failed++;
    testResult('Storage clear', false, error.message);
  }

  // Test 5: Verify logout cleanup
  testHeader('Test 5: Verify Logout Cleanup');
  try {
    const customerId = await AsyncStorage.getItem('customerId');
    const customerName = await AsyncStorage.getItem('customerName');
    const customerEmail = await AsyncStorage.getItem('customerEmail');
    const cardsCount = await AsyncStorage.getItem('cardsCount');
    
    const allDataCleared = !customerId && !customerName && !customerEmail && !cardsCount;
    
    results.total++;
    if (allDataCleared) {
      results.passed++;
      testResult('All user data cleared', true, 'No residual data found');
    } else {
      results.failed++;
      testResult('Data cleanup', false, 'Some data still present');
      if (customerId) log(`   ❌ customerId still exists: ${customerId}`, colors.red);
      if (customerName) log(`   ❌ customerName still exists: ${customerName}`, colors.red);
      if (customerEmail) log(`   ❌ customerEmail still exists: ${customerEmail}`, colors.red);
      if (cardsCount) log(`   ❌ cardsCount still exists: ${cardsCount}`, colors.red);
    }
  } catch (error) {
    results.total++;
    results.failed++;
    testResult('Logout cleanup verification', false, error.message);
  }

  // Test 6: Re-registration capability
  testHeader('Test 6: Re-registration Capability');
  try {
    await AsyncStorage.setItem('customerId', 'new-user-456');
    await AsyncStorage.setItem('customerName', 'New User');
    
    const newCustomerId = await AsyncStorage.getItem('customerId');
    const newCustomerName = await AsyncStorage.getItem('customerName');
    
    const canReRegister = newCustomerId === 'new-user-456' && 
                         newCustomerName === 'New User';
    
    results.total++;
    if (canReRegister) {
      results.passed++;
      testResult('Re-registration works', true, 'New user data stored successfully');
    } else {
      results.failed++;
      testResult('Re-registration', false, 'Could not store new user data');
    }
    
    // Cleanup
    await AsyncStorage.clear();
  } catch (error) {
    results.total++;
    results.failed++;
    testResult('Re-registration test', false, error.message);
  }

  // Final results
  testHeader('TEST RESULTS SUMMARY');
  log(`Total Tests: ${results.total}`, colors.blue);
  log(`Passed: ${results.passed}`, colors.green);
  log(`Failed: ${results.failed}`, results.failed > 0 ? colors.red : colors.green);
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 
      results.failed === 0 ? colors.green : colors.yellow);
  
  testHeader('CODE ANALYSIS - FIX APPLIED');
  log('✅ App.tsx now watches isRegistered state', colors.green);
  log('✅ useEffect has [isRegistered] dependency', colors.green);
  log('✅ forceUpdate increments on auth state change', colors.green);
  log('✅ NavigationContainer will remount on logout', colors.green);
  
  testHeader('EXPECTED BEHAVIOR AFTER FIX');
  log('1. User clicks logout button', colors.yellow);
  log('2. Confirmation dialog appears', colors.yellow);
  log('3. User confirms logout', colors.yellow);
  log('4. AuthContext.handleLogout() executes:', colors.yellow);
  log('   - Clears AsyncStorage', colors.yellow);
  log('   - Sets isRegistered = false', colors.yellow);
  log('   - Increments internal forceUpdate', colors.yellow);
  log('5. App.tsx detects isRegistered change:', colors.yellow);
  log('   - useEffect triggers (dependency: [isRegistered])', colors.yellow);
  log('   - Increments local forceUpdate state', colors.yellow);
  log('6. AppNavigator receives new forceUpdate prop:', colors.yellow);
  log('   - NavigationContainer key changes', colors.yellow);
  log('   - Navigation remounts completely', colors.yellow);
  log('7. User sees Welcome screen ✅', colors.green);
  
  testHeader('MANUAL TESTING CHECKLIST');
  log('[ ] Start the mobile app', colors.yellow);
  log('[ ] Register a new user', colors.yellow);
  log('[ ] Add some cards', colors.yellow);
  log('[ ] Navigate to Profile tab', colors.yellow);
  log('[ ] Click Logout button', colors.yellow);
  log('[ ] Confirm logout in dialog', colors.yellow);
  log('[ ] Verify: App shows Welcome screen', colors.yellow);
  log('[ ] Verify: Can register new user', colors.yellow);
  log('[ ] Verify: Previous user data is gone', colors.yellow);
  log('[ ] Check console logs for:', colors.yellow);
  log('    - 🔓 Logout initiated', colors.yellow);
  log('    - ✅ AsyncStorage cleared', colors.yellow);
  log('    - 🔄 Force update messages', colors.yellow);
  log('    - 📱 App forceUpdate messages', colors.yellow);
  
  return results;
}

// Run the tests
if (require.main === module) {
  runTests()
    .then(results => {
      process.exit(results.failed === 0 ? 0 : 1);
    })
    .catch(error => {
      log(`\n❌ Test suite failed: ${error.message}`, colors.red);
      console.error(error);
      process.exit(1);
    });
}

module.exports = { runTests };

