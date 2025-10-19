# User Authentication System Documentation

## Overview
The Technologiya platform now has **three separate authentication systems**:

1. **Admin Authentication** - For site administrators
2. **Author Authentication** - For content creators
3. **User Authentication** - For regular readers/commenters

## 🎯 Authentication Routes

### Admin/Author Login (`/login`)
- **URL**: http://localhost:4321/login
- **Component**: `UnifiedLogin.tsx`
- **Purpose**: Admin and author staff login only
- **Features**:
  - Role-based auto-detection and redirect
  - Admin → `/admin` dashboard
  - Author → `/author` dashboard
  - Demo credentials provided

### User Login (`/user-login`)
- **URL**: http://localhost:4321/user-login
- **Component**: `UserLogin.tsx`
- **Purpose**: Regular users (readers/commenters)
- **Features**:
  - Email/password authentication
  - Social OAuth login (Google, Facebook, X/Twitter)
  - Sign up / Sign in toggle
  - Redirects to homepage after login

## 🔐 Authentication Methods

### For Regular Users

#### Email/Password
```typescript
// Sign Up
{
  name: "User Name",
  email: "user@example.com",
  password: "password123"
}

// Login
{
  email: "user@example.com",
  password: "password123"
}
```

#### Social OAuth
- **Google** - `handleSocialLogin('google')`
- **Facebook** - `handleSocialLogin('facebook')`
- **Twitter/X** - `handleSocialLogin('twitter')`

TODO: Implement Appwrite OAuth providers

## 📦 User Data Structure

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedDate?: string;
}
```

**Storage**: `localStorage.getItem('user')`

## 🎨 User Features

### 1. User Profile (`/profile`)
- Edit name and bio
- Change avatar (auto-generated)
- View statistics:
  - Total comments
  - Total upvotes received
  - Saved articles (coming soon)
- View comment history

### 2. Comment System Integration
- **Guest Users**: Shown login prompt when trying to comment
- **Logged In Users**: Can comment, reply, upvote, downvote
- User avatar displayed next to comments
- "Login Required" modal with redirect to `/user-login`

### 3. Header Integration
- **Guest State**: Shows "Shiga" (Login) button → `/user-login`
- **Logged In State**: Shows user avatar + dropdown menu
  - Profile link → `/profile`
  - Logout button
- Mobile responsive menu

## 🔄 User Session Management

### Login Flow
1. User enters credentials or clicks social login
2. Validate with backend (TODO: Appwrite)
3. Store user data in `localStorage`
4. Redirect to homepage or previous page

### Logout Flow
1. User clicks logout button
2. Remove `user` from localStorage
3. Reload page to reset state

### Session Check
```typescript
useEffect(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const userData = JSON.parse(userStr);
    setUser(userData);
  }
}, []);
```

## 🎨 UI Components

### UserLogin Component
**Location**: `/src/components/UserLogin.tsx`

**Features**:
- Social login buttons (Google, Facebook, X)
- Email/password form
- Sign up / Sign in toggle
- Show/hide password
- Remember me checkbox
- Link to admin/author login

**Hausa Labels**:
- "Ƙirƙiri Asusu" - Create Account
- "Shiga" - Login
- "Adireshin Imel" - Email Address
- "Kalmar Sirri" - Password
- "Ka tuna da ni" - Remember me

### UserProfile Component
**Location**: `/src/components/UserProfile.tsx`

**Features**:
- View/edit profile information
- Avatar management with auto-generator
- Statistics dashboard
- Comment history with links to articles
- Two tabs: Profile & Comments

### Header Component Updates
**Location**: `/src/components/Header.tsx`

**New Features**:
- User state detection
- User menu dropdown (desktop)
- User info section (mobile)
- Avatar display
- Logout functionality

### CommentSection Updates
**Location**: `/src/components/CommentSection.tsx`

**Changes**:
- Check `localStorage` for user session
- Show login prompt for guests
- Links changed from `/login` to `/user-login`
- User avatar integration

## 🔧 Implementation TODO

### Phase 1: Appwrite Integration
```typescript
// Authentication
import { Account, Client, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('YOUR_ENDPOINT')
  .setProject('YOUR_PROJECT_ID');

const account = new Account(client);

// Email/Password Sign Up
const user = await account.create(
  ID.unique(),
  email,
  password,
  name
);

// Email/Password Login
const session = await account.createEmailSession(email, password);

// OAuth Login
await account.createOAuth2Session(
  'google', // or 'facebook', 'twitter'
  'http://localhost:4321/', // success redirect
  'http://localhost:4321/user-login' // failure redirect
);

// Get Current User
const user = await account.get();

// Logout
await account.deleteSession('current');
```

### Phase 2: Database Integration
```typescript
// User Profile Collection
{
  userId: string;
  bio: string;
  avatar: string;
  joinedDate: Date;
  totalComments: number;
  totalUpvotes: number;
}

// Comments Collection
{
  id: string;
  userId: string;
  articleId: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  parentId?: string; // for replies
}
```

### Phase 3: Security
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add rate limiting
- [ ] Add CSRF protection
- [ ] Implement session timeout
- [ ] Add 2FA option

## 🎯 User Journey

### New User
1. Visits article → clicks comment
2. Sees "Login Required" modal
3. Clicks "Shiga Yanzu" → `/user-login`
4. Chooses social login or email/password
5. Signs up with details
6. Redirected to homepage (logged in)
7. Can now comment, upvote, save articles

### Returning User
1. Visits site → sees "Shiga" button in header
2. Clicks → `/user-login`
3. Logs in with saved credentials
4. Header shows avatar + name
5. Can access profile, comment, etc.

## 📱 Mobile Responsive

### Mobile Menu
- Shows user avatar + name at top
- Profile link
- Logout button
- Collapsible navigation

### Mobile Login
- Full-width social buttons
- Touch-friendly input fields
- Proper keyboard handling

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Main actions
- **Success**: Green (#10B981) - Upvotes
- **Danger**: Red (#EF4444) - Downvotes
- **Purple**: (#9333EA) - Social login accents

### Typography
- **Headings**: Fira Code (monospace)
- **Body**: System fonts
- **Language**: Hausa

## 🔒 Security Best Practices

1. **Password Requirements** (TODO):
   - Minimum 8 characters
   - At least one uppercase
   - At least one number

2. **Session Management**:
   - Store minimal data in localStorage
   - Use httpOnly cookies for tokens (Appwrite)
   - Implement session timeout

3. **OAuth Security**:
   - Use state parameter
   - Verify redirect URLs
   - Handle token refresh

## 🌐 Internationalization

Currently in **Hausa**. To add more languages:

```typescript
const translations = {
  ha: {
    login: 'Shiga',
    signup: 'Ƙirƙiri Asusu',
    email: 'Adireshin Imel',
    password: 'Kalmar Sirri'
  },
  en: {
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email Address',
    password: 'Password'
  }
};
```

## 📊 Analytics (Future)

Track user engagement:
- Comments per user
- Most active commenters
- Login method usage
- User retention
- Article engagement

## 🚀 Testing

### Manual Testing Checklist
- [ ] Sign up with email/password
- [ ] Login with email/password
- [ ] Test social login buttons
- [ ] Edit profile
- [ ] Generate new avatar
- [ ] Post comment
- [ ] Upvote/downvote
- [ ] Reply to comment
- [ ] View profile
- [ ] Logout
- [ ] Guest comment prompt

### Demo Flow
```bash
# Start server
bun run dev

# Visit http://localhost:4321/user-login
# Sign up with:
# - Name: Ahmed Musa
# - Email: ahmed@test.com
# - Password: password123

# Go to any article
# Post a comment
# Check profile at /profile
# Logout
```

## 🔗 Related Files

### Components
- `/src/components/UserLogin.tsx` - User authentication page
- `/src/components/UserProfile.tsx` - User profile management
- `/src/components/Header.tsx` - Site header with user menu
- `/src/components/CommentSection.tsx` - Comment system
- `/src/components/UnifiedLogin.tsx` - Admin/author login

### Pages
- `/src/pages/user-login.astro` - User login route
- `/src/pages/profile.astro` - User profile route
- `/src/pages/login.astro` - Admin/author login route

### Layouts
- `/src/layouts/MainLayout.astro` - Main site layout

## 📞 Support

For questions about the authentication system:
1. Check this documentation
2. Review the code comments
3. Test with demo credentials
4. Check browser console for errors

---

**Version**: 1.0
**Last Updated**: October 19, 2025
**Status**: ✅ UI Complete | ⏳ Appwrite Integration Pending
