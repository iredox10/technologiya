# Auto-Logout Feature for Admin & Author Panels

## Overview

The auto-logout feature automatically logs out inactive administrators and authors after **10 minutes** of inactivity. This security feature helps protect sensitive content management areas from unauthorized access when users leave their workstations unattended.

## How It Works

### Activity Tracking

The system tracks user activity through the following events:
- Mouse movements (`mousemove`)
- Mouse clicks (`mousedown`, `click`)
- Keyboard input (`keypress`)
- Scrolling (`scroll`)
- Touch events (`touchstart`)

Any of these actions will reset the inactivity timer back to 10 minutes.

### Implementation Details

1. **Activity Tracker Utility** (`src/utils/activityTracker.ts`)
   - Monitors user activity across the entire page
   - Stores the last activity timestamp in localStorage
   - Sets a 10-minute countdown timer
   - Automatically logs out when timer expires
   - Syncs activity across multiple tabs (if user is active in another tab, it resets the timer)

2. **Layout Integration**
   - `AdminLayout.astro` - Includes ActivityTracker for all admin pages
   - `AuthorLayout.astro` - Includes ActivityTracker for all author pages
   - ActivityTracker components are mounted with `client:load` directive

3. **Login Page Updates**
   - `AdminLogin.tsx` - Shows timeout warning when redirected after auto-logout
   - `AuthorLogin.tsx` - Shows timeout warning when redirected after auto-logout
   - URL parameter `?timeout=true` triggers the warning message

## Features

### ✅ Automatic Logout After 10 Minutes
- User is automatically logged out if inactive for 10 minutes
- Activity is tracked through mouse, keyboard, scroll, and touch events

### ✅ Cross-Tab Synchronization
- Activity in one browser tab updates the timer in all tabs
- If you're active in Tab A, Tab B won't log you out

### ✅ Visibility Change Detection
- When returning to a tab after it was hidden, checks if timeout occurred
- Immediately logs out if inactivity period exceeded while tab was hidden

### ✅ User-Friendly Notifications
- Shows warning message on login page after auto-logout
- Message explains the reason for logout (in Hausa)
- Redirects appropriately:
  - Admin users → `/admin/login?timeout=true`
  - Author users → `/author/login?timeout=true`

### ✅ Clean Logout Process
- Clears activity data from localStorage
- Logs out from Appwrite session
- Redirects to appropriate login page

## Files Modified/Created

### New Files
1. **`src/utils/activityTracker.ts`**
   - Core activity tracking logic
   - Exported functions: `startActivityTracking()`, `stopActivityTracking()`, `updateActivity()`, `getRemainingTime()`

2. **`src/components/admin/ActivityTracker.tsx`**
   - React component wrapper for admin pages
   - Starts tracking on mount, stops on unmount

3. **`src/components/author/ActivityTracker.tsx`**
   - React component wrapper for author pages
   - Starts tracking on mount, stops on unmount

### Modified Files
1. **`src/layouts/AdminLayout.astro`**
   - Added `<ActivityTracker client:load />` component

2. **`src/layouts/AuthorLayout.astro`**
   - Added `<ActivityTracker client:load />` component

3. **`src/components/admin/AdminLogin.tsx`**
   - Added timeout message display
   - Checks for `?timeout=true` URL parameter
   - Shows warning with FiAlertCircle icon

4. **`src/components/author/AuthorLogin.tsx`**
   - Added timeout message display
   - Checks for `?timeout=true` URL parameter
   - Shows warning with FiAlertCircle icon

## Configuration

### Adjusting Timeout Duration

To change the inactivity timeout from 10 minutes to a different duration, edit the constant in `src/utils/activityTracker.ts`:

```typescript
// Change this value (in milliseconds)
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

// Examples:
// 5 minutes:  5 * 60 * 1000
// 15 minutes: 15 * 60 * 1000
// 30 minutes: 30 * 60 * 1000
```

### Events Tracked

To add or remove tracked events, edit the `events` array in `src/utils/activityTracker.ts`:

```typescript
const events = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
];
```

## User Experience

### When Active
- Users work normally without interruption
- Timer resets with each interaction
- No visible indication of the timer (silent tracking)

### When Timeout Occurs
1. Automatic logout happens in the background
2. User is redirected to login page
3. Yellow warning banner appears with message (in Hausa):
   - **Title:** "An fitar da kai saboda rashin aiki"
   - **Message:** "An fitar da kai saboda ba ka yi wani aiki na tsawon mintuna 10. Don aminci, ka sake shiga don ci gaba."
   - **Translation:** "You were logged out due to inactivity. You were logged out because you were inactive for 10 minutes. For security, please log in again to continue."

### Warning Message UI
```
┌─────────────────────────────────────────────────┐
│ ⚠️  An fitar da kai saboda rashin aiki          │
│                                                  │
│ An fitar da kai saboda ba ka yi wani aiki na   │
│ tsawon mintuna 10. Don aminci, ka sake shiga    │
│ don ci gaba.                                     │
└─────────────────────────────────────────────────┘
```

## Technical Details

### localStorage Key
- **Key:** `lastActivityTime`
- **Value:** Unix timestamp (milliseconds) of last activity
- **Cleared on:** Logout or timeout

### Timer Management
- Single timeout instance per page
- Cleared and reset on each activity event
- Prevents memory leaks through proper cleanup

### Multi-Tab Behavior
- Uses `storage` event listener to sync across tabs
- When one tab updates activity, other tabs reset their timers
- Ensures consistent timeout across all open tabs

## Security Benefits

1. **Protects Against Unauthorized Access**
   - Prevents unauthorized users from accessing admin/author panel if user walks away

2. **Session Management**
   - Automatically terminates inactive sessions
   - Reduces risk of session hijacking

3. **Compliance**
   - Helps meet security best practices for content management systems
   - Demonstrates attention to security in production environments

## Testing

### Manual Testing Checklist

- [ ] **Basic Timeout Test**
  - Login to admin panel
  - Don't interact for 10 minutes
  - Verify automatic logout and redirect to login page
  - Verify warning message appears

- [ ] **Activity Reset Test**
  - Login to admin panel
  - Wait 9 minutes
  - Move mouse or type something
  - Wait another 9 minutes
  - Move mouse again
  - Verify you're still logged in after 18 minutes total

- [ ] **Cross-Tab Test**
  - Open admin panel in Tab A
  - Open another admin page in Tab B
  - Be active only in Tab A
  - Verify Tab B doesn't log out

- [ ] **Visibility Change Test**
  - Login to admin panel
  - Switch to another tab for 11 minutes
  - Return to admin tab
  - Verify immediate logout and redirect

- [ ] **Author Panel Test**
  - Repeat all above tests in author panel
  - Verify redirects to `/author/login?timeout=true`

### Debugging

To check remaining time before logout (for debugging):

```typescript
import { getRemainingTime } from './utils/activityTracker';

// Get remaining seconds before auto-logout
const remainingSeconds = getRemainingTime();
console.log(`Time remaining: ${remainingSeconds} seconds`);
```

## Future Enhancements

### Potential Features
1. **Countdown Warning**
   - Show a warning modal 1 minute before logout
   - Allow user to extend session

2. **Configurable Timeout**
   - Allow admins to set timeout duration in settings panel
   - Store preference per user

3. **Activity Heatmap**
   - Track when admins/authors are most active
   - Analytics for system usage patterns

4. **Session Extension**
   - "Keep me logged in" button in warning modal
   - Extends session by another 10 minutes

5. **Idle Warning Toast**
   - Small notification after 8 minutes: "You'll be logged out in 2 minutes due to inactivity"

## Troubleshooting

### Issue: User Gets Logged Out While Actively Working

**Possible Causes:**
- Events not being captured properly
- JavaScript errors preventing activity tracking
- Browser privacy settings blocking localStorage

**Solution:**
- Check browser console for errors
- Verify localStorage is enabled
- Test with different browser or incognito mode

### Issue: Timer Not Resetting Across Tabs

**Possible Causes:**
- localStorage event not firing
- Different browser contexts

**Solution:**
- Verify both tabs are from same origin
- Check if browser blocks cross-tab communication
- Test in different browser

### Issue: Activity Tracker Not Starting

**Possible Causes:**
- Component not mounting with `client:load`
- Import path errors

**Solution:**
- Verify `client:load` directive in layout files
- Check browser console for import errors
- Ensure activityTracker.ts has no syntax errors

## Summary

The auto-logout feature provides essential security for the Technologiya CMS by automatically logging out inactive administrators and authors after 10 minutes. It works seamlessly across multiple tabs, provides clear user feedback, and can be easily configured to meet different security requirements.

**Key Points:**
- ✅ 10-minute inactivity timeout
- ✅ Tracks mouse, keyboard, scroll, and touch events
- ✅ Syncs across multiple browser tabs
- ✅ Shows friendly warning message in Hausa
- ✅ Separate implementation for admin and author panels
- ✅ Clean logout with session termination
- ✅ Easy to configure and customize

This feature is now **production-ready** and integrated into both admin and author panels! 🎉
