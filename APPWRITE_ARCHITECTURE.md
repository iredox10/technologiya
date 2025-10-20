# Appwrite Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGIYA CMS                            │
│                     (Astro + React)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │   Auth     │  │  Article   │  │  Category  │  │ Storage  │ │
│  │  Service   │  │  Service   │  │  Service   │  │ Service  │ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
│                                                                  │
│  ┌────────────┐  ┌────────────┐                                │
│  │  Author    │  │  Comment   │                                │
│  │  Service   │  │  Service   │                                │
│  └────────────┘  └────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                   APPWRITE SDK                                   │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │  Account   │  │ Databases  │  │  Storage   │               │
│  └────────────┘  └────────────┘  └────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                      ┌───────▼───────┐
                      │               │
              ┌───────┴───────┐       │
              │ APPWRITE CLOUD│       │
              │               │       │
              │  ┌─────────┐  │       │
              │  │ Database│  │       │
              │  │         │  │       │
              │  │ ┌─────┐ │  │       │
              │  │ │Auth │ │  │       │
              │  │ └─────┘ │  │       │
              │  │ ┌─────┐ │  │       │
              │  │ │Store│ │  │       │
              │  │ └─────┘ │  │       │
              │  └─────────┘  │       │
              └───────────────┘       │
                                      │
                                      │
              ┌───────────────────────▼
              │   COLLECTIONS
              │
              │  📦 Articles
              │  📦 Categories
              │  📦 Authors
              │  📦 Comments
              │  📦 Users
              │
              └───────────────────────
```

## Data Flow

### Authentication Flow
```
User Input (email/password)
        │
        ▼
UnifiedLogin Component
        │
        ▼
authService.login()
        │
        ▼
Appwrite Account.createSession()
        │
        ▼
Session Created
        │
        ├──▶ authService.getUserRole()
        │           │
        │           ▼
        │    Check Authors Collection
        │           │
        │           ├──▶ Admin → /admin
        │           ├──▶ Author → /author
        │           └──▶ User → /profile
        │
        └──▶ Store Session (automatic)
```

### Article Creation Flow
```
ArticleEditor Component
        │
        ▼
User fills form + uploads image
        │
        ▼
handleSubmit()
        │
        ├──▶ storageService.uploadFile()
        │           │
        │           ▼
        │    Appwrite Storage API
        │           │
        │           ▼
        │    Returns File ID & URL
        │
        └──▶ articleService.createArticle()
                    │
                    ▼
            Appwrite Databases API
                    │
                    ▼
            Article saved to collection
                    │
                    ▼
            Returns article document
                    │
                    ▼
            Redirect to articles list
```

### Article Listing Flow
```
ArticlesList Component
        │
        ▼
useEffect() on mount
        │
        ▼
articleService.getArticles(page, limit, filters)
        │
        ▼
Appwrite Databases.listDocuments()
        │
        ▼
Returns paginated results
        │
        ▼
setState(articles)
        │
        ▼
Render article cards
```

## Component Integration Map

### Admin Dashboard
```
/admin
  │
  ├─ AdminDashboard.tsx ──────▶ articleService.getArticles()
  │                       ──────▶ categoryService.getCategories()
  │                       ──────▶ authorService.getAuthors()
  │
  ├─ ArticlesList.tsx ─────────▶ articleService.getArticles()
  │                         ────▶ articleService.deleteArticle()
  │
  ├─ ArticleEditor.tsx ────────▶ articleService.createArticle()
  │                         ────▶ articleService.updateArticle()
  │                         ────▶ storageService.uploadFile()
  │
  ├─ CategoriesManager.tsx ────▶ categoryService (CRUD)
  │
  └─ AuthorsManager.tsx ───────▶ authorService (CRUD)
```

### Author Dashboard
```
/author
  │
  ├─ AuthorDashboard.tsx ──────▶ articleService.getArticlesByAuthor()
  │
  ├─ AuthorArticlesList.tsx ───▶ articleService.getArticlesByAuthor()
  │                         ────▶ articleService.deleteArticle()
  │
  ├─ ArticleEditor.tsx ────────▶ articleService.createArticle()
  │                         ────▶ articleService.updateArticle()
  │
  └─ AuthorProfile.tsx ────────▶ authorService.updateAuthor()
                             ────▶ storageService.uploadFile()
```

### Public Pages
```
/
  │
  ├─ index.astro ──────────────▶ articleService.getArticles()
  │
  ├─ /articles/[slug].astro ──▶ articleService.getArticleBySlug()
  │                          ──▶ articleService.incrementViews()
  │
  ├─ /category/[slug].astro ──▶ articleService.getArticlesByCategory()
  │
  └─ /search.astro ────────────▶ articleService.searchArticles()
```

## Security Model

```
┌────────────────────────────────────┐
│         USER ROLES                 │
├────────────────────────────────────┤
│                                    │
│  👑 ADMIN                          │
│  ├─ Full access to all features   │
│  ├─ Manage all articles            │
│  ├─ Manage categories              │
│  ├─ Manage authors                 │
│  └─ Site settings                  │
│                                    │
│  ✍️ AUTHOR                         │
│  ├─ Manage own articles            │
│  ├─ View categories                │
│  ├─ Edit profile                   │
│  └─ Upload images                  │
│                                    │
│  👤 USER                           │
│  ├─ Read articles                  │
│  ├─ Comment on articles            │
│  ├─ Vote on comments               │
│  └─ Manage profile                 │
│                                    │
└────────────────────────────────────┘
```

## Permission Matrix

| Action | Guest | User | Author | Admin |
|--------|-------|------|--------|-------|
| View Articles | ✅ | ✅ | ✅ | ✅ |
| Comment | ❌ | ✅ | ✅ | ✅ |
| Create Article | ❌ | ❌ | ✅ | ✅ |
| Edit Own Article | ❌ | ❌ | ✅ | ✅ |
| Edit Any Article | ❌ | ❌ | ❌ | ✅ |
| Manage Categories | ❌ | ❌ | ❌ | ✅ |
| Manage Authors | ❌ | ❌ | ❌ | ✅ |
| Site Settings | ❌ | ❌ | ❌ | ✅ |

## API Endpoints Summary

### Authentication
- `account.createEmailPasswordSession()` - Login
- `account.create()` - Register
- `account.get()` - Get current user
- `account.deleteSession()` - Logout

### Articles
- `databases.listDocuments()` - List articles
- `databases.getDocument()` - Get single article
- `databases.createDocument()` - Create article
- `databases.updateDocument()` - Update article
- `databases.deleteDocument()` - Delete article

### Categories
- `databases.listDocuments()` - List categories
- `databases.getDocument()` - Get single category
- `databases.createDocument()` - Create category
- `databases.updateDocument()` - Update category
- `databases.deleteDocument()` - Delete category

### Storage
- `storage.createFile()` - Upload file
- `storage.getFilePreview()` - Get preview URL
- `storage.getFileView()` - Get view URL
- `storage.deleteFile()` - Delete file

## Environment Configuration

```env
┌──────────────────────────────────────┐
│  REQUIRED ENVIRONMENT VARIABLES      │
├──────────────────────────────────────┤
│                                      │
│  PUBLIC_APPWRITE_ENDPOINT            │
│  PUBLIC_APPWRITE_PROJECT_ID          │
│  PUBLIC_APPWRITE_DATABASE_ID         │
│                                      │
│  Collection IDs:                     │
│  ├─ PUBLIC_APPWRITE_COLLECTION_      │
│  │  ARTICLES                         │
│  ├─ PUBLIC_APPWRITE_COLLECTION_      │
│  │  CATEGORIES                       │
│  ├─ PUBLIC_APPWRITE_COLLECTION_      │
│  │  AUTHORS                          │
│  ├─ PUBLIC_APPWRITE_COLLECTION_      │
│  │  COMMENTS                         │
│  └─ PUBLIC_APPWRITE_COLLECTION_      │
│     USERS                            │
│                                      │
│  Bucket IDs:                         │
│  ├─ PUBLIC_APPWRITE_BUCKET_          │
│  │  ARTICLE_IMAGES                   │
│  └─ PUBLIC_APPWRITE_BUCKET_          │
│     AUTHOR_AVATARS                   │
│                                      │
└──────────────────────────────────────┘
```

## Technology Stack

```
Frontend:
├─ Astro (SSR Framework)
├─ React (UI Components)
├─ TailwindCSS (Styling)
└─ TypeScript (Type Safety)

Backend Services:
└─ Appwrite (BaaS)
    ├─ Authentication
    ├─ Databases
    ├─ Storage
    └─ Real-time (future)

Development:
├─ Bun (Package Manager)
├─ Vite (Build Tool)
└─ ESLint (Code Quality)
```

---

**Ready to integrate!** Follow the integration guides to connect components to Appwrite services.
