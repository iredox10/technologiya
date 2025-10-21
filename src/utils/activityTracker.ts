// Activity Tracker - Auto logout after inactivity
import { authService } from '../lib/appwriteServices';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const STORAGE_KEY = 'lastActivityTime';

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Updates the last activity timestamp
 */
export function updateActivity() {
  const now = Date.now();
  localStorage.setItem(STORAGE_KEY, now.toString());
  resetInactivityTimer();
}

/**
 * Gets the last activity timestamp
 */
export function getLastActivityTime(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : Date.now();
}

/**
 * Checks if the user has been inactive for too long
 */
export function checkInactivity(): boolean {
  const lastActivity = getLastActivityTime();
  const now = Date.now();
  const timeSinceLastActivity = now - lastActivity;
  
  return timeSinceLastActivity >= INACTIVITY_TIMEOUT;
}

/**
 * Logs out the user due to inactivity
 */
async function handleInactivityLogout() {
  console.log('User inactive for 10 minutes, logging out...');
  
  // Clear activity data
  localStorage.removeItem(STORAGE_KEY);
  
  // Logout from Appwrite
  await authService.logout();
  
  // Redirect to login page
  const currentPath = window.location.pathname;
  const isAdminPath = currentPath.startsWith('/admin');
  const isAuthorPath = currentPath.startsWith('/author');
  
  if (isAdminPath) {
    window.location.href = '/admin/login?timeout=true';
  } else if (isAuthorPath) {
    window.location.href = '/author/login?timeout=true';
  } else {
    window.location.href = '/login?timeout=true';
  }
}

/**
 * Resets the inactivity timer
 */
function resetInactivityTimer() {
  // Clear existing timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  
  // Set new timer
  inactivityTimer = setTimeout(() => {
    handleInactivityLogout();
  }, INACTIVITY_TIMEOUT);
}

/**
 * Starts tracking user activity
 */
export function startActivityTracking() {
  // Initialize activity timestamp
  updateActivity();
  
  // Track user activity events
  const events = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
  ];
  
  events.forEach((event) => {
    document.addEventListener(event, updateActivity, true);
  });
  
  // Check for inactivity on page load/visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Check if inactive when user returns to tab
      if (checkInactivity()) {
        handleInactivityLogout();
      } else {
        updateActivity();
      }
    }
  });
  
  // Check for inactivity across tabs (storage event)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      // Another tab updated activity, reset our timer
      resetInactivityTimer();
    }
  });
  
  // Start the initial inactivity timer
  resetInactivityTimer();
}

/**
 * Stops tracking user activity
 */
export function stopActivityTracking() {
  // Clear the timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
  
  // Remove event listeners
  const events = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
  ];
  
  events.forEach((event) => {
    document.removeEventListener(event, updateActivity, true);
  });
  
  // Clear activity data
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Gets remaining time before auto-logout (in seconds)
 */
export function getRemainingTime(): number {
  const lastActivity = getLastActivityTime();
  const now = Date.now();
  const elapsed = now - lastActivity;
  const remaining = INACTIVITY_TIMEOUT - elapsed;
  
  return Math.max(0, Math.floor(remaining / 1000));
}
