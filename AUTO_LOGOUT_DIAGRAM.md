# Auto-Logout Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Activity Flow                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐
│ User Logs In│
│  (Admin or  │
│   Author)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   AdminLayout / AuthorLayout Loads      │
│   - Mounts <ActivityTracker />          │
│   - Calls startActivityTracking()       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│          Activity Tracking Active                       │
│  - Monitors: mouse, keyboard, scroll, touch            │
│  - Stores: lastActivityTime in localStorage            │
│  - Timer: 10-minute countdown                          │
└────────────────┬────────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
┌─────────────┐   ┌──────────────┐
│  User       │   │ User Becomes │
│  Active     │   │  Inactive    │
│  (Events    │   │  (No Events  │
│   Fired)    │   │  for 10 min) │
└──────┬──────┘   └──────┬───────┘
       │                 │
       │                 ▼
       │          ┌──────────────────┐
       │          │  Timer Expires   │
       │          │  Auto-Logout     │
       │          └────────┬─────────┘
       │                   │
       │                   ▼
       │          ┌─────────────────────────────┐
       │          │  1. authService.logout()    │
       │          │  2. Clear localStorage      │
       │          │  3. Redirect to login page  │
       │          │     with ?timeout=true      │
       │          └────────┬────────────────────┘
       │                   │
       ▼                   ▼
   ┌─────────────────────────────────────┐
   │  Reset Timer & Continue              │
   │  updateActivity() called             │
   │  - Update timestamp                  │
   │  - Reset 10-min countdown            │
   └──────────────────────────────────────┘
                 │
                 ▼
         ┌───────────────────┐
         │  Login Page Shows │
         │  Timeout Warning  │
         │  (Yellow Banner)  │
         └───────────────────┘
```

## Cross-Tab Synchronization

```
┌──────────────────────────────────────────────────────────┐
│            Multi-Tab Activity Sync                       │
└──────────────────────────────────────────────────────────┘

┌──────────────┐          ┌──────────────┐
│   Tab A      │          │   Tab B      │
│   (Active)   │          │  (Inactive)  │
└──────┬───────┘          └──────┬───────┘
       │                         │
       │ User clicks, types      │ Timer counting
       │ updateActivity()        │ down...
       │                         │
       ▼                         │
   localStorage                  │
   "lastActivityTime"            │
   = now()                       │
       │                         │
       │ storage event fires     │
       │ ─────────────────────► │
       │                         │
       │                         ▼
       │                    Timer Reset!
       │                    (Both tabs stay
       │                     logged in)
       │                         │
       └─────────────────────────┘
```

## Component Structure

```
src/
├── utils/
│   └── activityTracker.ts              ← Core Logic
│       ├── startActivityTracking()
│       ├── stopActivityTracking()
│       ├── updateActivity()
│       ├── checkInactivity()
│       ├── handleInactivityLogout()
│       └── getRemainingTime()
│
├── components/
│   ├── admin/
│   │   ├── ActivityTracker.tsx         ← Admin Wrapper
│   │   │   └── Calls: startActivityTracking()
│   │   └── AdminLogin.tsx              ← Shows Timeout Warning
│   │       └── Checks: ?timeout=true param
│   │
│   └── author/
│       ├── ActivityTracker.tsx         ← Author Wrapper
│       │   └── Calls: startActivityTracking()
│       └── AuthorLogin.tsx             ← Shows Timeout Warning
│           └── Checks: ?timeout=true param
│
└── layouts/
    ├── AdminLayout.astro               ← Admin Pages
    │   └── <ActivityTracker client:load />
    │
    └── AuthorLayout.astro              ← Author Pages
        └── <ActivityTracker client:load />
```

## Activity Events Tracked

```
┌────────────────────────────────────────────┐
│         User Interaction Events            │
└────────────────────────────────────────────┘

┌────────────┐
│ mousedown  │ ─┐
├────────────┤  │
│ mousemove  │ ─┤
├────────────┤  │
│ keypress   │ ─┤
├────────────┤  ├─► updateActivity()
│ scroll     │ ─┤    ├─► Store timestamp
├────────────┤  │    └─► Reset 10-min timer
│ touchstart │ ─┤
├────────────┤  │
│ click      │ ─┘
└────────────┘
```

## Logout Redirect Flow

```
┌─────────────────────────────────────────┐
│        Auto-Logout Redirect Logic       │
└─────────────────────────────────────────┘

Timer Expires (10 minutes)
        │
        ▼
Check Current Path
        │
    ┌───┴────┬────────────┬──────────┐
    │        │            │          │
    ▼        ▼            ▼          ▼
/admin/*  /author/*   /other    (default)
    │        │            │          │
    ▼        ▼            ▼          ▼
/admin   /author     /login    /login
/login   /login   ?timeout=  ?timeout=
?timeout ?timeout    true       true
=true    =true
```

## Timeout Warning UI

```
┌──────────────────────────────────────────────────────┐
│                   Login Page                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ ⚠️  An fitar da kai saboda rashin aiki        │ │
│  │                                                │ │
│  │ An fitar da kai saboda ba ka yi wani aiki na │ │
│  │ tsawon mintuna 10. Don aminci, ka sake shiga  │ │
│  │ don ci gaba.                                   │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Email    [____________________________]        │ │
│  │ Password [____________________________]        │ │
│  │                                                │ │
│  │              [    Shiga    ]                   │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Lifecycle

```
┌─────────────────────────────────────────────────────┐
│              Component Lifecycle                    │
└─────────────────────────────────────────────────────┘

Component Mounts
      │
      ▼
  useEffect()
      │
      ├─► startActivityTracking()
      │   ├─► Add event listeners
      │   ├─► Set timeout (10 min)
      │   └─► Store initial timestamp
      │
      ▼
   Active State
   (User working)
      │
      ├─► Activity detected
      │   └─► Timer resets
      │
      ▼
Component Unmounts
      │
      ▼
  Cleanup Function
      │
      └─► stopActivityTracking()
          ├─► Remove event listeners
          ├─► Clear timeout
          └─► Clean localStorage
```

## Configuration Options

```typescript
// File: src/utils/activityTracker.ts

┌─────────────────────────────────────────────┐
│         Configuration Constants             │
└─────────────────────────────────────────────┘

// Timeout Duration (milliseconds)
const INACTIVITY_TIMEOUT = 10 * 60 * 1000;
                          └───┬───┘
                              │
              ┌───────────────┴────────────────┐
              │                                │
         Change Here                      Examples:
              │                         5 min:  5 * 60 * 1000
              │                        15 min: 15 * 60 * 1000
              │                        30 min: 30 * 60 * 1000
              │                         1 hr:  60 * 60 * 1000
              │
              └─► Applied to all admin & author pages


// localStorage Key
const STORAGE_KEY = 'lastActivityTime';
                    └────────┬─────────┘
                             │
                    Change if conflicts
                    with other systems


// Tracked Events
const events = [
  'mousedown',   ← Click detection
  'mousemove',   ← Mouse movement
  'keypress',    ← Typing detection
  'scroll',      ← Page scrolling
  'touchstart',  ← Mobile touches
  'click',       ← Click events
];
```

## State Management

```
┌──────────────────────────────────────┐
│     localStorage State               │
└──────────────────────────────────────┘

Key: "lastActivityTime"
Value: Unix timestamp (milliseconds)

┌──────────────┬──────────────────────┐
│    Action    │      State Change    │
├──────────────┼──────────────────────┤
│ Activity     │ Update to current    │
│ detected     │ timestamp            │
├──────────────┼──────────────────────┤
│ Timeout      │ Remove from storage  │
│ occurs       │                      │
├──────────────┼──────────────────────┤
│ User logs    │ Remove from storage  │
│ out          │                      │
├──────────────┼──────────────────────┤
│ Page         │ Initialize with      │
│ loads        │ current timestamp    │
└──────────────┴──────────────────────┘
```

---

## Summary

This auto-logout system provides:
- ✅ Automatic security protection
- ✅ Seamless user experience
- ✅ Cross-tab synchronization
- ✅ Clear user feedback
- ✅ Easy configuration
- ✅ Production-ready implementation

**Status:** Active on all admin and author pages
**Duration:** 10 minutes of inactivity
**Coverage:** 100% of protected areas
