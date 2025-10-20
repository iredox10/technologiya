# Appwrite Integration Documentation

## Overview
This document explains how to set up and integrate Appwrite into the Technologiya CMS.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Appwrite Setup](#appwrite-setup)
3. [Database Schema](#database-schema)
4. [Environment Variables](#environment-variables)
5. [Authentication Flow](#authentication-flow)
6. [Usage Examples](#usage-examples)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Appwrite Account (sign up at https://cloud.appwrite.io)
- Node.js 18+ and Bun installed
- Basic understanding of Appwrite concepts (databases, collections, authentication)

---

## Appwrite Setup

### Step 1: Create a New Project

1. Log in to your Appwrite Console
2. Click "Create Project"
3. Name your project: `technologiya`
4. Copy the **Project ID** - you'll need this later

### Step 2: Configure Platform

1. Go to **Settings** → **Platforms**
2. Click "Add Platform" → "Web"
3. Add your hostname (e.g., `localhost`, `technologiya.com`)
4. Add `*` for development (wildcards)

### Step 3: Enable Authentication

1. Go to **Auth** section
2. Enable **Email/Password** authentication
3. Enable **OAuth2 Providers** (Google, Facebook, Twitter) for user login
4. Set session length as desired (default: 365 days)

### Step 4: Create Database

1. Go to **Databases** section
2. Click "Create Database"
3. Name it: `technologiya_db`
4. Copy the **Database ID**

### Step 5: Create Collections

Create the following collections with their attributes:

#### **Articles Collection** (`articles`)

| Attribute | Type | Size | Required | Array | Default |
|-----------|------|------|----------|-------|---------|
| title | String | 255 | Yes | No | - |
| slug | String | 255 | Yes | No | - |
| excerpt | String | 500 | Yes | No | - |
| content | String | 50000 | Yes | No | - |
| coverImage | URL | 2000 | Yes | No | - |
| authorId | String | 255 | Yes | No | - |
| categoryId | String | 255 | Yes | No | - |
| tags | String | 50 | No | Yes | [] |
| status | Enum | - | Yes | No | draft |
| publishedAt | DateTime | - | No | No | - |
| views | Integer | - | Yes | No | 0 |
| featured | Boolean | - | Yes | No | false |

**Enum values for `status`:** `draft`, `published`, `archived`

**Indexes:**
- `slug` (unique)
- `authorId` (key)
- `categoryId` (key)
- `status` (key)
- `publishedAt` (key)
- `views` (key)

**Permissions:**
- Read: Role:all
- Create: Role:member
- Update: Role:member
- Delete: Role:member

---

#### **Categories Collection** (`categories`)

| Attribute | Type | Size | Required | Array | Default |
|-----------|------|------|----------|-------|---------|
| name | String | 100 | Yes | No | - |
| slug | String | 100 | Yes | No | - |
| description | String | 500 | No | No | - |
| color | String | 20 | Yes | No | #3B82F6 |
| icon | String | 50 | No | No | - |
| articleCount | Integer | - | Yes | No | 0 |

**Indexes:**
- `slug` (unique)
- `name` (key)

**Permissions:**
- Read: Role:all
- Create: Role:member
- Update: Role:member
- Delete: Role:member

---

#### **Authors Collection** (`authors`)

| Attribute | Type | Size | Required | Array | Default |
|-----------|------|------|----------|-------|---------|
| userId | String | 255 | Yes | No | - |
| name | String | 100 | Yes | No | - |
| email | Email | 255 | Yes | No | - |
| bio | String | 1000 | No | No | - |
| avatar | URL | 2000 | No | No | - |
| role | Enum | - | Yes | No | author |
| status | Enum | - | Yes | No | active |
| articleCount | Integer | - | Yes | No | 0 |

**Enum values for `role`:** `admin`, `author`  
**Enum values for `status`:** `active`, `inactive`

**Indexes:**
- `userId` (unique)
- `email` (unique)
- `role` (key)
- `status` (key)

**Permissions:**
- Read: Role:all
- Create: Role:member
- Update: Role:member
- Delete: Role:member

---

#### **Comments Collection** (`comments`)

| Attribute | Type | Size | Required | Array | Default |
|-----------|------|------|----------|-------|---------|
| articleId | String | 255 | Yes | No | - |
| userId | String | 255 | Yes | No | - |
| userName | String | 100 | Yes | No | - |
| userAvatar | URL | 2000 | No | No | - |
| content | String | 2000 | Yes | No | - |
| parentId | String | 255 | No | No | - |
| upvotes | Integer | - | Yes | No | 0 |
| downvotes | Integer | - | Yes | No | 0 |
| status | Enum | - | Yes | No | pending |

**Enum values for `status`:** `approved`, `pending`, `rejected`

**Indexes:**
- `articleId` (key)
- `userId` (key)
- `parentId` (key)
- `status` (key)

**Permissions:**
- Read: Role:all
- Create: Role:member
- Update: Role:member
- Delete: Role:member

---

#### **Users Collection** (`users`)

| Attribute | Type | Size | Required | Array | Default |
|-----------|------|------|----------|-------|---------|
| name | String | 100 | Yes | No | - |
| email | Email | 255 | Yes | No | - |
| avatar | URL | 2000 | No | No | - |
| role | Enum | - | Yes | No | user |
| bio | String | 500 | No | No | - |

**Enum values for `role`:** `user`, `author`, `admin`

**Indexes:**
- `email` (unique)
- `role` (key)

**Permissions:**
- Read: Role:all
- Create: Role:member
- Update: Role:member
- Delete: Role:member

---

### Step 6: Create Storage Buckets

1. Go to **Storage** section
2. Create two buckets:

#### **Article Images Bucket** (`article-images`)
- File size limit: 10MB
- Allowed file extensions: `jpg`, `jpeg`, `png`, `webp`, `gif`
- Enable compression: Yes
- Permissions: Read: Role:all, Create/Update/Delete: Role:member

#### **Author Avatars Bucket** (`author-avatars`)
- File size limit: 5MB
- Allowed file extensions: `jpg`, `jpeg`, `png`, `webp`
- Enable compression: Yes
- Permissions: Read: Role:all, Create/Update/Delete: Role:member

---

## Environment Variables

Create a `.env` file in your project root:

```env
PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here

PUBLIC_APPWRITE_COLLECTION_ARTICLES=articles_collection_id
PUBLIC_APPWRITE_COLLECTION_CATEGORIES=categories_collection_id
PUBLIC_APPWRITE_COLLECTION_AUTHORS=authors_collection_id
PUBLIC_APPWRITE_COLLECTION_COMMENTS=comments_collection_id
PUBLIC_APPWRITE_COLLECTION_USERS=users_collection_id

PUBLIC_APPWRITE_BUCKET_ARTICLE_IMAGES=article_images_bucket_id
PUBLIC_APPWRITE_BUCKET_AUTHOR_AVATARS=author_avatars_bucket_id

HUGGINGFACEAPIKEY=your_huggingface_api_key
```

Replace the placeholder values with your actual IDs from Appwrite Console.

---

## Authentication Flow

### Admin/Author Login Flow

1. User enters email and password
2. `authService.login()` creates a session
3. `authService.getUserRole()` checks if user is admin/author
4. Redirect to appropriate dashboard based on role
5. Store session (handled automatically by Appwrite)

### User Login Flow (Social OAuth)

1. User clicks social login button (Google/Facebook/Twitter)
2. Redirected to OAuth provider
3. After approval, redirected back with session
4. User document created automatically in users collection
5. User can now comment and interact

### Protected Routes

Both admin and author dashboards check authentication on load:

```typescript
const result = await authService.isAuthenticated();
if (!result) {
  window.location.href = '/login';
}
```

---

## Usage Examples

### Admin Login Component

```typescript
import { authService, authorService } from '../lib/appwriteServices';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Login
  const loginResult = await authService.login(email, password);
  
  if (loginResult.success) {
    // Get user info
    const userResult = await authService.getCurrentUser();
    
    if (userResult.success) {
      // Check if user is admin/author
      const authorResult = await authorService.getAuthorByUserId(userResult.data.$id);
      
      if (authorResult.success) {
        const author = authorResult.data;
        
        if (author.role === 'admin') {
          window.location.href = '/admin';
        } else if (author.role === 'author') {
          window.location.href = '/author';
        }
      } else {
        setError('Access denied. Admin or author account required.');
      }
    }
  } else {
    setError(loginResult.error);
  }
};
```

### Creating an Article

```typescript
import { articleService, storageService, APPWRITE_CONFIG } from '../lib/appwriteServices';

const handlePublish = async () => {
  // 1. Upload cover image if provided
  let coverImageUrl = '';
  
  if (coverImageFile) {
    const uploadResult = await storageService.uploadFile(
      APPWRITE_CONFIG.buckets.articleImages,
      coverImageFile
    );
    
    if (uploadResult.success) {
      coverImageUrl = storageService.getFileView(
        APPWRITE_CONFIG.buckets.articleImages,
        uploadResult.data.$id
      );
    }
  }
  
  // 2. Create article
  const articleData = {
    title,
    slug: generateSlug(title),
    excerpt,
    content,
    coverImage: coverImageUrl,
    authorId: currentAuthor.$id,
    categoryId: selectedCategory,
    tags,
    status: 'published',
    publishedAt: new Date().toISOString(),
    views: 0,
    featured: false
  };
  
  const result = await articleService.createArticle(articleData);
  
  if (result.success) {
    console.log('Article published!', result.data);
    // Redirect or show success message
  }
};
```

### Fetching Articles

```typescript
import { articleService } from '../lib/appwriteServices';

// Get all published articles
const getPublishedArticles = async () => {
  const result = await articleService.getArticles(1, 10, [
    Query.equal('status', 'published')
  ]);
  
  if (result.success) {
    setArticles(result.data.documents);
  }
};

// Get articles by category
const getArticlesByCategory = async (categoryId: string) => {
  const result = await articleService.getArticlesByCategory(categoryId);
  
  if (result.success) {
    setArticles(result.data.documents);
  }
};

// Search articles
const searchArticles = async (query: string) => {
  const result = await articleService.searchArticles(query);
  
  if (result.success) {
    setArticles(result.data.documents);
  }
};
```

---

## Troubleshooting

### Common Issues

**1. "Invalid credentials" error**
- Check if email/password auth is enabled in Appwrite Console
- Verify the user account exists
- Ensure password meets minimum requirements (8+ characters)

**2. "Collection not found" error**
- Verify collection IDs in `.env` match Appwrite Console
- Ensure database ID is correct
- Check if collections are created properly

**3. "Unauthorized" error**
- Check collection permissions (Read/Write access)
- Verify user is authenticated (`authService.isAuthenticated()`)
- Ensure session hasn't expired

**4. "File upload failed" error**
- Check file size limits in bucket settings
- Verify file type is allowed
- Ensure bucket permissions allow file creation

**5. Rate limit exceeded**
- Appwrite Cloud has rate limits based on your plan
- Consider caching frequently accessed data
- Upgrade to higher plan if needed

### Debug Mode

Enable console logging to see detailed error messages:

```typescript
// In appwriteServices.ts, errors are logged to console
console.error('Operation error:', error);
```

---

## Next Steps

1. **Set up demo admin account:**
   - Create an admin user in Appwrite Auth
   - Add corresponding author document with `role: 'admin'`

2. **Seed initial data:**
   - Create a few categories
   - Add sample articles
   - Set up author profiles

3. **Test the integration:**
   - Login as admin
   - Create/edit/delete articles
   - Upload images
   - Manage categories

4. **Production deployment:**
   - Update environment variables with production values
   - Configure proper permissions
   - Set up backups
   - Monitor usage

---

## Support

For issues with Appwrite:
- Official Docs: https://appwrite.io/docs
- Discord Community: https://appwrite.io/discord
- GitHub Issues: https://github.com/appwrite/appwrite

For Technologiya CMS issues:
- Check the documentation
- Review error logs in console
- Ensure all environment variables are set correctly
