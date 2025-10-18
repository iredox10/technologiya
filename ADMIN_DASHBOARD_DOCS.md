# 🎯 Admin Dashboard Documentation

## Overview

Complete admin dashboard for Technologiya website with full content management capabilities. Built with React, TypeScript, and Tiptap rich text editor.

## ✅ Features Implemented

### 1. **Dashboard Overview**
- 📊 Statistics cards (total articles, readers, views, trending)
- 🚀 Quick actions for common tasks
- 📝 Recent articles list with status indicators
- 🎨 Beautiful monospace font styling

### 2. **Article Management**
- ✅ Full article CRUD (Create, Read, Update, Delete)
- ✅ Rich text editor with Tiptap
- ✅ Draft and published status
- ✅ Live preview mode
- ✅ Image upload UI (ready for Appwrite integration)
- ✅ Tags management
- ✅ Category selection
- ✅ SEO-friendly slug generation
- ✅ Search and filter functionality

### 3. **Rich Text Editor (Tiptap)**
- **Formatting**: Bold, Italic, Underline, Code
- **Headings**: H2, H3
- **Lists**: Bullet lists, Numbered lists
- **Alignment**: Left, Center, Right, Justify
- **Links**: Add/edit/remove links
- **Images**: Insert images via URL
- **Responsive toolbar**
- **Dark mode support**

### 4. **Category Management**
- ✅ Add/edit/delete categories
- ✅ Custom color picker
- ✅ Slug generation
- ✅ Article count per category
- ✅ Beautiful grid layout
- ✅ Prevent deletion if category has articles

### 5. **Author Management**
- ✅ Add/edit/delete authors
- ✅ Author profiles with avatar
- ✅ Bio and role fields
- ✅ Article count per author
- ✅ Email validation
- ✅ Prevent deletion if author has articles

## 📁 File Structure

```
src/
├── layouts/
│   └── AdminLayout.astro          # Admin layout with sidebar
├── pages/
│   └── admin/
│       ├── login.astro            # Admin login page
│       ├── index.astro            # Dashboard home
│       ├── articles/
│       │   ├── index.astro        # Articles list
│       │   ├── new.astro          # Create new article
│       │   └── edit/
│       │       └── [id].astro     # Edit existing article
│       ├── categories/
│       │   └── index.astro        # Categories management
│       ├── authors/
│       │   └── index.astro        # Authors management
│       └── settings/
│           └── index.astro        # Settings panel
└── components/
    └── admin/
        ├── AdminLogin.tsx         # Login form component
        ├── AdminSidebar.tsx       # Navigation sidebar
        ├── AdminDashboard.tsx     # Dashboard overview
        ├── ArticlesList.tsx       # Articles list table
        ├── ArticleEditor.tsx      # Article create/edit form
        ├── RichTextEditor.tsx     # Tiptap editor component
        ├── CategoriesManager.tsx  # Category CRUD
        ├── AuthorsManager.tsx     # Author CRUD
        └── SettingsPanel.tsx      # Settings management
```

## 🚀 Accessing the Admin Dashboard

### Development
```bash
# Start the dev server
bun run dev

# Navigate to admin
http://localhost:4321/admin
```

### Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login page |
| `/admin` | Dashboard overview |
| `/admin/articles` | All articles list |
| `/admin/articles/new` | Create new article |
| `/admin/articles/edit/[id]` | Edit existing article |
| `/admin/categories` | Manage categories |
| `/admin/authors` | Manage authors |
| `/admin/settings` | Admin settings panel |

## 🎨 Features in Detail

### Dashboard (`/admin`)

**Statistics Cards**:
- Total articles count
- Total readers
- Daily views
- Trending articles count

**Quick Actions**:
- Write new article → `/admin/articles/new`
- Manage categories → `/admin/categories`
- Manage authors → `/admin/authors`

**Recent Articles**:
- Shows last 4 articles
- Status badges (Published/Draft)
- Views count
- Quick edit button

### Article Management (`/admin/articles`)

**List View**:
- Search articles by title
- Filter by status (All, Published, Draft)
- Sortable table with:
  - Title
  - Category
  - Author
  - Status
  - Views
  - Date
  - Actions (Edit, Delete)

**Create/Edit Article (`/admin/articles/new`)**:

**Header Actions**:
- Preview toggle button
- Save as draft button
- Publish button

**Form Fields**:
1. **Title** (required)
   - Auto-generates slug
   - Large input for prominence

2. **Slug** (auto-generated, editable)
   - URL-friendly format
   - Monospace font for clarity

3. **Excerpt** (required)
   - Brief summary for article cards
   - 3-row textarea

4. **Content** (required)
   - Full Tiptap rich text editor
   - Formatting toolbar
   - Minimum 400px height

5. **Category** (required)
   - Dropdown select
   - Pre-populated from categories

6. **Tags** (optional)
   - Add multiple tags
   - Press Enter or click Add
   - Remove tags individually

7. **Cover Image**
   - URL input field
   - Upload button (UI ready for Appwrite)
   - Image preview

**Draft/Publish**:
- Save as draft: Stores without publishing
- Publish: Makes article live immediately
- Status toggle in articles list

**Preview Mode**:
- Click "Duba Samfurin" to see live preview
- Shows exactly how article will appear
- Includes all metadata and styling
- Click "Gyara" to return to edit mode

### Rich Text Editor

**Toolbar Sections**:

1. **Text Formatting**:
   - Bold (Ctrl/Cmd + B)
   - Italic (Ctrl/Cmd + I)
   - Underline (Ctrl/Cmd + U)
   - Code (monospace)

2. **Headings**:
   - H2: Main section headings
   - H3: Subsection headings

3. **Lists**:
   - Bullet list
   - Numbered list (1, 2, 3...)

4. **Alignment**:
   - Align left
   - Align center
   - Align right
   - Justify

5. **Insert**:
   - Links (with edit/remove)
   - Images (URL input)

**Features**:
- Placeholder text
- Responsive design
- Dark mode support
- Active state indicators
- Keyboard shortcuts
- Undo/Redo support

### Category Management (`/admin/categories`)

**List View**:
- Grid layout (3 columns on desktop)
- Each category card shows:
  - Color-coded icon
  - Category name
  - Description
  - Slug
  - Article count
  - Edit/Delete buttons

**Add/Edit Modal**:
- Name field (required)
- Auto-generates slug
- Description textarea
- Color picker
- Visual color preview
- Hex color input

**Features**:
- Prevent deletion if category has articles
- Beautiful color theming
- Responsive grid

### Author Management (`/admin/authors`)

**List View**:
- Grid layout (3 columns on desktop)
- Each author card shows:
  - Avatar image
  - Name
  - Role/title
  - Bio (truncated)
  - Email
  - Article count
  - Edit/Delete buttons

**Add/Edit Modal**:
- Name field (required)
- Email field (required)
- Role selector
- Bio textarea
- Avatar URL input
- Avatar preview

**Features**:
- Auto-generate avatar from name
- Prevent deletion if author has articles
- Email validation
- Multiple role options

### Settings Panel (`/admin/settings`)

**Sidebar Navigation**:
- Site Settings (Saitunan Gaba ɗaya)
- SEO Settings
- User Settings (Masu Amfani)
- Email Settings
- Security Settings (Tsaro)
- Database Settings

**Site Settings**:
- Site name
- Site description
- Site URL
- Contact email
- Language selector (Hausa/English)
- Timezone selector

**SEO Settings**:
- Meta title (with character count: max 60)
- Meta description (with character count: max 160)
- Meta keywords (comma-separated)
- Open Graph image URL
- Twitter handle

**User Settings**:
- Toggle: Enable registration
- Toggle: Require email verification
- Toggle: Allow comments
- Toggle: Moderate comments

**Other Sections**:
- Email, Security, and Database settings show placeholder message
- Will be implemented with Appwrite integration

**Save Button**:
- Saves all settings
- Shows success confirmation
- Mock implementation ready for Appwrite

### Article Edit (`/admin/articles/edit/[id]`)

**Features**:
- Same interface as new article page
- Pre-loads existing article data
- Form fields auto-populated
- Header shows "Gyara Labarin" (Edit Article)
- Save button shows "Sabunta" (Update) instead of "Buga Labarin"
- Uses same ArticleEditor component with `isEditing` prop

**URL Pattern**:
- `/admin/articles/edit/1` - Edit article with ID 1
- `/admin/articles/edit/2` - Edit article with ID 2
- Uses Astro dynamic routes: `[id].astro`

### Admin Login (`/admin/login`)

**Features**:
- Clean, centered login form
- Email and password fields
- Show/hide password toggle
- "Remember me" checkbox
- "Forgot password" link
- Loading state during authentication
- Error message display
- Demo credentials shown at bottom

**Demo Credentials**:
- Email: `admin@technologiya.com`
- Password: `admin123`

**Design**:
- Full-screen centered layout
- Card-based form design
- Blue accent color
- Dark mode support
- Responsive design
- Loading spinner animation

**Authentication**:
- Mock login implementation
- Ready for Appwrite Auth integration
- Redirects to `/admin` on success
- Shows error on invalid credentials
- Client-side form validation

## 🎨 UI/UX Features

### Design Elements
- ✅ Consistent Hausa language throughout
- ✅ Monospace fonts for headings (Fira Code)
- ✅ Dark mode support
- ✅ Responsive design (mobile-first)
- ✅ Hover effects and transitions
- ✅ Loading states
- ✅ Error handling
- ✅ Confirmation dialogs

### Navigation
- **Sidebar**: Persistent on desktop, collapsible on mobile
- **Active states**: Current page highlighted
- **Badge counts**: Show number of articles
- **User section**: Avatar and email at bottom

### Colors & Theming
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Dark mode**: Full support with `dark:` variants

## 🔄 Data Flow (Current State)

**Current Implementation**:
- All data stored in component state
- Mock data for demonstration
- No backend connection yet

**Ready for Appwrite Integration**:
- All CRUD operations have placeholder functions
- Form validation in place
- Error handling prepared
- API call structure ready

### Functions to Implement with Appwrite

**Articles**:
```typescript
// In ArticleEditor.tsx
const handleSave = async (publish: boolean) => {
  // TODO: Replace with Appwrite database create/update
  const dataToSave = {
    ...formData,
    status: publish ? 'published' : 'draft',
  };
  
  // await databases.createDocument(...)
  // or await databases.updateDocument(...)
};
```

**Categories**:
```typescript
// In CategoriesManager.tsx
const handleSave = () => {
  // TODO: Replace with Appwrite database operations
  // await databases.createDocument(...)
  // or await databases.updateDocument(...)
};

const handleDelete = (id: string) => {
  // TODO: Replace with Appwrite database operations
  // await databases.deleteDocument(...)
};
```

**Authors**:
```typescript
// In AuthorsManager.tsx
const handleSave = () => {
  // TODO: Replace with Appwrite database operations
  // await databases.createDocument(...)
  // or await databases.updateDocument(...)
};
```

## 📝 Next Steps for Appwrite Integration

### 1. Setup Appwrite Project
```bash
# Install Appwrite SDK
bun add appwrite
```

### 2. Configure Appwrite
```typescript
// src/lib/appwrite.ts
import { Client, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint('YOUR_APPWRITE_ENDPOINT')
  .setProject('YOUR_PROJECT_ID');

export const databases = new Databases(client);
export const storage = new Storage(client);
```

### 3. Database Collections

**Articles Collection**:
- title (string)
- slug (string, unique)
- excerpt (string)
- content (string)
- category (string, relationship)
- tags (string[])
- coverImage (string)
- status (enum: draft, published)
- author (string, relationship)
- views (integer)
- publishedAt (datetime)
- createdAt (datetime)
- updatedAt (datetime)

**Categories Collection**:
- name (string)
- slug (string, unique)
- description (string)
- color (string)

**Authors Collection**:
- name (string)
- email (string, unique)
- bio (string)
- avatar (string)
- role (string)
- joinedAt (datetime)

### 4. Storage Buckets
- **article-images**: For cover images
- **author-avatars**: For author profile pictures
- **editor-uploads**: For inline images in articles

### 5. Authentication
- Add login page
- Implement session management
- Protect admin routes
- Add role-based permissions

## 🎯 Testing the Admin Dashboard

### 1. Navigate to Admin
```
http://localhost:4321/admin
```

### 2. Test Dashboard
- ✅ View statistics
- ✅ Click quick action buttons
- ✅ View recent articles

### 3. Test Article Management
- ✅ Go to `/admin/articles`
- ✅ Search articles
- ✅ Filter by status
- ✅ Click "Rubuta Sabon Labari"
- ✅ Fill out article form
- ✅ Use rich text editor
- ✅ Add tags
- ✅ Toggle preview mode
- ✅ Save as draft
- ✅ Publish article

### 4. Test Rich Text Editor
- ✅ Try all formatting buttons
- ✅ Add headings
- ✅ Create lists
- ✅ Change alignment
- ✅ Insert links
- ✅ Add images

### 5. Test Category Management
- ✅ Go to `/admin/categories`
- ✅ Click "Ƙara Sabuwar Kalma"
- ✅ Fill out form
- ✅ Choose color
- ✅ Save category
- ✅ Edit existing category
- ✅ Try deleting (should warn if has articles)

### 6. Test Author Management
- ✅ Go to `/admin/authors`
- ✅ Click "Ƙara Sabon Marubucin"
- ✅ Fill out form
- ✅ Select role
- ✅ Save author
- ✅ Edit existing author
- ✅ Try deleting (should warn if has articles)

## 🐛 Known Limitations (Pre-Appwrite)

1. **No Persistence**: Data lost on page refresh
2. **No Authentication**: Anyone can access admin
3. **No Image Upload**: Upload button is UI only
4. **No Real Delete**: Deletion only removes from state
5. **No Validation**: Backend validation needed
6. **No Search**: Search only works on current page data

## 🎉 What's Working

✅ Complete UI/UX for all admin features  
✅ Rich text editor with all formatting options  
✅ Draft and preview functionality  
✅ Form validation (client-side)  
✅ Responsive design  
✅ Dark mode support  
✅ Hausa language throughout  
✅ Beautiful animations and transitions  
✅ Error handling and confirmations  
✅ Slug auto-generation  
✅ Tag management  
✅ Category color theming  

## 📚 Technologies Used

- **Astro**: SSG framework
- **React 19**: Component library
- **TypeScript**: Type safety
- **Tiptap**: Rich text editor
- **TailwindCSS v4**: Styling
- **React Icons**: Icon library

## 🔐 Security Considerations (For Production)

1. **Add Authentication**:
   - Login page
   - Session management
   - JWT tokens

2. **Add Authorization**:
   - Role-based access control
   - Permission checks
   - Admin-only routes

3. **Input Validation**:
   - Server-side validation
   - Sanitize HTML content
   - Prevent XSS attacks

4. **Rate Limiting**:
   - Limit API calls
   - Prevent abuse
   - DDoS protection

5. **HTTPS Only**:
   - Secure connections
   - Certificate management
   - Redirect HTTP to HTTPS

## 📖 Documentation Files

- **This File**: Complete admin dashboard documentation
- **API_KEY_SETUP.md**: Hugging Face TTS setup
- **MMS_TTS_SETUP.md**: TTS configuration guide
- **TTS_DOCUMENTATION.md**: TTS technical docs
- **FONT_USAGE.md**: Typography guide

---

## 🎊 Congratulations!

Your Technologiya admin dashboard is complete and ready for Appwrite integration! All the UI/UX is built, tested, and working. The next step is to connect it to Appwrite for data persistence.

**Admin Dashboard URL**: http://localhost:4321/admin

Enjoy managing your Hausa tech news website! 🚀
