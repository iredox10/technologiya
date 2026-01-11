/**
 * Manual Test Script for Auto-Logout Feature
 * 
 * This script helps test the auto-logout functionality.
 * Open browser console and paste this script to test.
 */

// Import the activity tracker functions
import { 
  startActivityTracking, 
  stopActivityTracking, 
  getRemainingTime,
  updateActivity,
  checkInactivity 
} from './src/utils/activityTracker';

// Test Configuration
const TEST_CONFIG = {
  // Set to 30 seconds for quick testing (change INACTIVITY_TIMEOUT in activityTracker.ts)
  quickTestTimeout: 30 * 1000, // 30 seconds
  normalTimeout: 10 * 60 * 1000, // 10 minutes
};

// Test 1: Check if tracking is active
function test1_IsTrackingActive() {
  console.log('🧪 Test 1: Checking if tracking is active...');
  const remaining = getRemainingTime();
  if (remaining > 0) {
    console.log('✅ PASS: Tracking is active');
    console.log(`⏰ Time remaining: ${remaining} seconds (${Math.floor(remaining / 60)} minutes)`);
    return true;
  } else {
    console.log('❌ FAIL: Tracking is not active or already expired');
    return false;
  }
}

// Test 2: Check if activity updates timer
function test2_ActivityUpdatesTimer() {
  console.log('🧪 Test 2: Testing if activity resets timer...');
  const before = getRemainingTime();
  console.log(`⏰ Before activity: ${before} seconds`);
  
  // Wait 2 seconds, then trigger activity
  setTimeout(() => {
    updateActivity();
    const after = getRemainingTime();
    console.log(`⏰ After activity: ${after} seconds`);
    
    if (after > before) {
      console.log('✅ PASS: Timer was reset by activity');
      return true;
    } else {
      console.log('❌ FAIL: Timer was not reset');
      return false;
    }
  }, 2000);
}

// Test 3: Check localStorage
function test3_CheckLocalStorage() {
  console.log('🧪 Test 3: Checking localStorage...');
  const lastActivity = localStorage.getItem('lastActivityTime');
  
  if (lastActivity) {
    const timestamp = parseInt(lastActivity, 10);
    const now = Date.now();
    const diff = now - timestamp;
    
    console.log('✅ PASS: localStorage key exists');
    console.log(`📅 Last activity: ${new Date(timestamp).toLocaleString()}`);
    console.log(`⏱️  Time since last activity: ${Math.floor(diff / 1000)} seconds`);
    return true;
  } else {
    console.log('❌ FAIL: localStorage key not found');
    return false;
  }
}

// Test 4: Test inactivity check
function test4_InactivityCheck() {
  console.log('🧪 Test 4: Testing inactivity check...');
  const isInactive = checkInactivity();
  
  if (isInactive) {
    console.log('⚠️  User is currently inactive (will be logged out soon)');
  } else {
    console.log('✅ User is active');
  }
  
  return true;
}

// Test 5: Countdown display
function test5_CountdownDisplay() {
  console.log('🧪 Test 5: Starting countdown display...');
  console.log('⏰ Monitoring time remaining (updates every 5 seconds)...');
  
  let count = 0;
  const interval = setInterval(() => {
    const remaining = getRemainingTime();
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    console.log(`⏰ Time remaining: ${minutes}m ${seconds}s`);
    
    count++;
    if (count >= 12 || remaining <= 0) { // Stop after 60 seconds or if expired
      clearInterval(interval);
      console.log('✅ Countdown test complete');
    }
  }, 5000);
  
  return true;
}

// Run all tests
function runAllTests() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   AUTO-LOGOUT FEATURE TEST SUITE              ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  
  const results = {
    test1: test1_IsTrackingActive(),
    test3: test3_CheckLocalStorage(),
    test4: test4_InactivityCheck(),
  };
  
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('Running delayed tests...');
  console.log('═══════════════════════════════════════════════');
  
  test2_ActivityUpdatesTimer();
  test5_CountdownDisplay();
  
  console.log('');
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   INTERACTIVE TESTS                           ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log('Try these manual tests:');
  console.log('1. Move your mouse → Check if timer resets');
  console.log('2. Type something → Check if timer resets');
  console.log('3. Scroll the page → Check if timer resets');
  console.log('4. Wait 10 minutes without activity → Auto logout should occur');
  console.log('5. Open another tab → Activity in one tab should sync to others');
  console.log('');
  console.log('Use getRemainingTime() in console to check remaining time anytime');
}

// Quick test for development (30-second timeout)
function quickTest() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   QUICK TEST MODE (30 seconds)                ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log('⚠️  IMPORTANT: Change INACTIVITY_TIMEOUT to 30000 (30 seconds)');
  console.log('    in src/utils/activityTracker.ts before running this test');
  console.log('');
  console.log('1. Stop moving mouse/keyboard');
  console.log('2. Wait 30 seconds');
  console.log('3. You should be automatically logged out');
  console.log('');
  console.log('Starting countdown...');
  
  let countdown = 30;
  const interval = setInterval(() => {
    if (countdown > 0) {
      console.log(`⏰ ${countdown} seconds until auto-logout...`);
      countdown--;
    } else {
      clearInterval(interval);
      console.log('🔴 Auto-logout should happen now!');
    }
  }, 1000);
}

// Export test functions for console use
(window as any).autoLogoutTests = {
  runAll: runAllTests,
  quick: quickTest,
  test1: test1_IsTrackingActive,
  test2: test2_ActivityUpdatesTimer,
  test3: test3_CheckLocalStorage,
  test4: test4_InactivityCheck,
  test5: test5_CountdownDisplay,
  getRemainingTime: getRemainingTime,
};

console.log('');
console.log('╔════════════════════════════════════════════════╗');
console.log('║   AUTO-LOGOUT TEST UTILITIES LOADED           ║');
console.log('╚════════════════════════════════════════════════╝');
console.log('');
console.log('Available commands in console:');
console.log('  autoLogoutTests.runAll()          - Run all tests');
console.log('  autoLogoutTests.quick()           - Quick 30-second test');
console.log('  autoLogoutTests.getRemainingTime() - Check remaining time');
console.log('  autoLogoutTests.test1()            - Test if tracking active');
console.log('  autoLogoutTests.test3()            - Test localStorage');
console.log('');
console.log('Run: autoLogoutTests.runAll() to start testing');
console.log('');
