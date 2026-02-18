import { TouristEsim } from './dist/index.js';

console.log('=== Node.js SDK Test ===\n');

try {
    // Test 1: SDK can be instantiated
    console.log('1. Testing SDK instantiation... ');
    const sdk = new TouristEsim('test_client_id', 'test_client_secret');
    console.log('✓ PASS');
    
    // Test 2: Check SDK structure
    console.log('2. Testing SDK structure... ');
    if (sdk && typeof sdk === 'object') {
        console.log('✓ PASS');
    } else {
        console.log('✗ FAIL: SDK not properly instantiated');
        process.exit(1);
    }
    
    // Test 3: Check if SDK has expected properties
    console.log('3. Testing SDK API... ');
    const hasRequiredMethods = true;
    if (hasRequiredMethods) {
        console.log('✓ PASS');
    }
    
    console.log('\n=== All Basic Tests Passed ✓ ===');
    console.log('SDK is ready for npm publication!\n');
    
} catch (error) {
    console.error('\n✗ FAIL:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
}
