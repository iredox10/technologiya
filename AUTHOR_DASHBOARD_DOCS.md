# 📝 Author Dashboard Documentation

Complete author dashboard system where authors can write and manage their own articles.

## 🎯 Overview

The author dashboard is a separate portal from the admin panel, specifically designed for content creators to manage their articles without accessing administrative features.

### Key Differences: Author vs Admin

| Feature | Author Dashboard | Admin Dashboard |
|---------|-----------------|-----------------|
| **Access** | `/author` | `/admin` |
| **Color Theme** | Green (`#10B981`) | Blue (`#3B82F6`) |
| **Icon** | ✏️ Marubucin (Writer) | 🛠️ Admin |
| **Permissions** | Own articles only | All articles |
| **Can Manage** | Articles, Profile | Everything |
| **Can Delete** | Own articles | All content |

---

## 🚀 Getting Started

### Access Author Dashboard

**Login Page**: http://localhost:4321/author/login

**Demo Credentials**:
- Email: `musa@technologiya.com`
- Password: `author123`

### Author Routes

| Route | Description |
|-------|-------------|
| `/author/login` | Author login page |
| `/author` | Author dashboard |
| `/author/articles` | Author's articles list |
| `/author/articles/new` | Write new article |
| `/author/articles/edit/[id]` | Edit existing article |
| `/author/profile` | Edit profile and bio |

---

## 📁 File Structure

```
src/
├── layouts/
│   └── AuthorLayout.astro           # Author dashboard layout
│
├── pages/author/
│   ├── login.astro                  # Author login
│   ├── index.astro                  # Dashboard home
│   ├── profile.astro                # Profile editor
│   └── articles/
│       ├── index.astro              # Articles list
│       ├── new.astro                # Write new article
│       └── edit/[id].astro          # Edit article
│
└── components/author/
    ├── AuthorLogin.tsx              # Login form
    ├── AuthorSidebar.tsx            # Navigation sidebar
    ├── AuthorDashboard.tsx          # Dashboard overview
    ├── AuthorArticlesList.tsx       # Articles list
    └── AuthorProfile.tsx            # Profile editor
```

---

## 🎨 Features

### 1. **Author Login** (`/author/login`)

**Features**:
- Clean login form with green accent
- Show/hide password toggle
- Remember me checkbox
- Error handling
- Demo credentials displayed
- Link to admin login
- Link back to main site

**Demo Login**:
```
Email: musa@technologiya.com
Password: author123
```

### 2. **Author Dashboard** (`/author`)

**Welcome Banner**:
- Personalized greeting
- Green gradient background
- Motivational message

**Statistics Cards** (4 cards):
1. **Jimlar Labarai** (Total Articles) - Blue
2. **Jimlar Kallonin** (Total Views) - Green
3. **Daftari** (Drafts) - Yellow
4. **Wannan Wata** (This Month) - Purple

**Quick Actions** (3 buttons):
- Rubuta Sabon Labari (Write New Article)
- Duba Daftari (View Drafts)
- Gyara Bayani (Edit Profile)

**Recent Articles Table**:
- Last 4 articles
- Shows: Title, Status, Views, Date
- "Gyara" (Edit) button for each
- Link to view all articles

**Tips Section**:
- Writing tips in Hausa
- Blue info box
- Helpful advice for authors

### 3. **Articles List** (`/author/articles`)

**Header**:
- Page title and description
- "Rubuta Sabon Labari" button (green)

**Search & Filter**:
- Search by title
- Filter by status: All / Published / Draft
- Shows count for each filter

**Articles Table**:
- Columns: Title, Category, Status, Views, Date, Actions
- Status badges (green=published, yellow=draft)
- Edit and Delete buttons
- Empty state message

**Features**:
- Shows only author's own articles
- Real-time search
- Status filtering
- Results count

### 4. **Write Article** (`/author/articles/new`)

**Reuses Admin Components**:
- Same `ArticleEditor` component
- Same `RichTextEditor` (Tiptap)
- All rich text features available
- Preview mode included

**Form Fields**:
- Title (auto-generates slug)
- Slug (editable)
- Excerpt
- Content (rich text editor)
- Category selection
- Tags management
- Cover image URL

**Actions**:
- Save as Draft
- Publish Article
- Toggle Preview

### 5. **Edit Article** (`/author/articles/edit/[id]`)

**Features**:
- Pre-loads existing article data
- Same interface as new article
- Update button instead of Publish
- Can only edit own articles

### 6. **Profile Editor** (`/author/profile`)

**Profile Header Card**:
- Large avatar with camera button
- Name and role
- Join date
- Green gradient background

**Edit Form**:
- Name (with user icon)
- Email (with mail icon)
- Bio (textarea, 500 char limit)
- Avatar URL (with generate button)
- Avatar preview

**Avatar Options**:
1. Enter custom URL
2. Click "Ƙirƙira" (Generate) for auto-avatar

**Statistics Card**:
- Total articles
- Total views
- Draft count
- Grid layout

**Change Password**:
- Placeholder for Appwrite integration
- Disabled button

---

## 🎨 Design Elements

### Color Theme
- **Primary**: Green (`#10B981`)
- **Hover**: Green-700 (`#059669`)
- **Background**: Green-50/Green-900
- **Accent**: Green-600

### Typography
- **Headers**: Fira Code (monospace)
- **Body**: System fonts
- **Numbers**: Tabular nums

### Components
- Green accent throughout
- Consistent with main site
- Dark mode support
- Mobile responsive

---

## 🔐 Security & Permissions

### Current Implementation (Mock)
```typescript
// Mock current author
const currentAuthor = {
  name: 'Musa Ibrahim',
  email: 'musa@technologiya.com',
  articlesCount: 25,
};
```

### With Appwrite (Future)
```typescript
// Get current user session
const user = await account.get();

// Query only author's articles
const articles = await databases.listDocuments(
  DATABASE_ID,
  ARTICLES_COLLECTION,
  [
    Query.equal('authorId', user.$id),
    Query.orderDesc('publishedAt')
  ]
);
```

**Permissions**:
- Authors can only see/edit their own articles
- Cannot access admin features
- Cannot manage other authors
- Cannot delete categories
- Can only update own profile

---

## 📊 Data Flow

### Article Creation Flow
1. Author writes article at `/author/articles/new`
2. Fills form with title, content, category, etc.
3. Clicks "Adana Daftari" (Save Draft) or "Buga Labarin" (Publish)
4. Article saved with `authorId` = current user
5. Redirects to `/author/articles`

### Article Editing Flow
1. Author views article list at `/author/articles`
2. Clicks "Gyara" on article
3. Goes to `/author/articles/edit/[id]`
4. Makes changes
5. Clicks "Sabunta" (Update)
6. Article updated in database

### Profile Update Flow
1. Author goes to `/author/profile`
2. Changes name, bio, or avatar
3. Clicks "Ajiye Canje-canje" (Save Changes)
4. Profile updated in Appwrite
5. Success message shown

---

## 🧪 Testing Checklist

### Login (`/author/login`)
- [ ] Page loads without errors
- [ ] Enter demo credentials
- [ ] Show/hide password works
- [ ] Login redirects to dashboard
- [ ] Wrong credentials show error
- [ ] Link to admin login works
- [ ] Link to main site works

### Dashboard (`/author`)
- [ ] Welcome banner shows author name
- [ ] 4 stat cards display correctly
- [ ] Quick action buttons navigate correctly
- [ ] Recent articles table shows data
- [ ] Edit buttons work
- [ ] Tips section visible

### Articles List (`/author/articles`)
- [ ] All articles displayed
- [ ] Search filters articles
- [ ] Status filter works (All/Published/Draft)
- [ ] Edit button goes to edit page
- [ ] Delete button shows confirmation
- [ ] "New Article" button works
- [ ] Results count accurate

### Write Article (`/author/articles/new`)
- [ ] Form loads correctly
- [ ] Title auto-generates slug
- [ ] Rich text editor works
- [ ] All formatting buttons functional
- [ ] Tags can be added/removed
- [ ] Category dropdown populated
- [ ] Preview mode works
- [ ] Save as draft works
- [ ] Publish article works

### Edit Article (`/author/articles/edit/[id]`)
- [ ] Article data pre-loaded
- [ ] All fields editable
- [ ] Rich text content shows
- [ ] Update button visible
- [ ] Changes can be saved

### Profile (`/author/profile`)
- [ ] Profile header shows avatar
- [ ] Name and email editable
- [ ] Bio textarea works
- [ ] Avatar URL can be changed
- [ ] Generate button creates avatar
- [ ] Avatar preview updates
- [ ] Save button works
- [ ] Statistics cards show data

### Sidebar Navigation
- [ ] Logo visible
- [ ] All nav items work
- [ ] Active state highlights current page
- [ ] Badge shows article count
- [ ] User profile at bottom
- [ ] Logout button works
- [ ] Mobile menu toggles

---

## 🔄 Appwrite Integration Points

### Authentication
```typescript
// In AuthorLogin.tsx
import { account } from '../lib/appwrite';

const handleSubmit = async (e: React.FormEvent) => {
  const session = await account.createEmailSession(email, password);
  // Redirect to /author
};
```

### Fetch Author's Articles
```typescript
// In AuthorArticlesList.tsx
import { databases } from '../lib/appwrite';
import { Query } from 'appwrite';

const fetchArticles = async () => {
  const user = await account.get();
  const result = await databases.listDocuments(
    DATABASE_ID,
    ARTICLES_COLLECTION,
    [Query.equal('authorId', user.$id)]
  );
  setArticles(result.documents);
};
```

### Create/Update Article
```typescript
// In ArticleEditor.tsx
const handleSave = async (publish: boolean) => {
  const user = await account.get();
  
  if (isEditing) {
    await databases.updateDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION,
      articleId,
      { ...formData, status: publish ? 'published' : 'draft' }
    );
  } else {
    await databases.createDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION,
      ID.unique(),
      {
        ...formData,
        authorId: user.$id,
        status: publish ? 'published' : 'draft',
      }
    );
  }
};
```

### Update Profile
```typescript
// In AuthorProfile.tsx
const handleSubmit = async () => {
  const user = await account.get();
  await databases.updateDocument(
    DATABASE_ID,
    AUTHORS_COLLECTION,
    user.$id,
    profileData
  );
};
```

---

## 🎯 Next Steps

### 1. Test Author Dashboard
```bash
bun run dev
# Navigate to http://localhost:4321/author/login
# Use: musa@technologiya.com / author123
```

### 2. Test All Features
- Login as author
- View dashboard
- Browse articles
- Write new article
- Edit existing article
- Update profile
- Test mobile responsive

### 3. Prepare for Appwrite
- Set up Appwrite collections
- Add author authentication
- Implement article queries
- Add permissions system
- Set up file upload for images

---

## 📝 Summary

✅ **Complete Author Dashboard System**:
- 6 pages created
- 5 React components
- Separate login for authors
- Full article management
- Profile editor
- Statistics dashboard
- Green color theme
- Mobile responsive
- Dark mode support
- Ready for Appwrite integration

**Demo Access**:
- URL: http://localhost:4321/author/login
- Email: musa@technologiya.com
- Password: author123

---

## 🎊 Congratulations!

Your author dashboard is complete! Authors can now write and manage their articles independently from the admin panel.

**Current Status**: ✅ 100% Complete (Frontend)  
**Next Step**: Test thoroughly → Integrate with Appwrite
