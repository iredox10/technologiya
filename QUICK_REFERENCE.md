# Quick Reference - Appwrite Integration

## 🚀 Quick Commands

### Development
```bash
# Start dev server
bun run dev

# Create admin user
bun run create-admin.ts

# Build for production
bun run build
```

## 🔑 Environment Variables (Required)

```env
# Appwrite Configuration
PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here

# Collections
PUBLIC_APPWRITE_COLLECTION_ARTICLES=collection_id
PUBLIC_APPWRITE_COLLECTION_CATEGORIES=collection_id
PUBLIC_APPWRITE_COLLECTION_AUTHORS=collection_id
PUBLIC_APPWRITE_COLLECTION_COMMENTS=collection_id
PUBLIC_APPWRITE_COLLECTION_USERS=collection_id
PUBLIC_APPWRITE_COLLECTION_SETTINGS=collection_id

# Storage Buckets
PUBLIC_APPWRITE_BUCKET_ARTICLE_IMAGES=bucket_id
PUBLIC_APPWRITE_BUCKET_AUTHOR_AVATARS=bucket_id
```

## 📂 Key Files

### Services
- `/src/lib/appwrite.ts` - Appwrite config & client
- `/src/lib/appwriteServices.ts` - All CRUD services
- `/src/utils/toast.ts` - Toast notifications

### Admin Components
- `/src/components/admin/AdminDashboard.tsx`
- `/src/components/admin/ArticleEditor.tsx`
- `/src/components/admin/ArticlesList.tsx`
- `/src/components/admin/CategoriesManager.tsx`
- `/src/components/admin/AuthorsManager.tsx`
- `/src/components/admin/SettingsPanel.tsx`
- `/src/components/admin/AdminSidebar.tsx`

### Author Components
- `/src/components/author/AuthorDashboard.tsx`
- `/src/components/author/AuthorArticlesList.tsx`
- `/src/components/author/AuthorProfile.tsx`
- `/src/components/author/AuthorSidebar.tsx`

## 🔧 Common Tasks

### Adding a New Admin User
```typescript
// Edit create-admin.ts with new credentials
const adminData = {
  email: 'admin@example.com',
  password: 'SecurePassword123!',
  name: 'Admin Name'
};

// Then run:
bun run create-admin.ts
```

### Uploading Files
```typescript
import { storageService } from '../../lib/appwriteServices';

// Upload file
const result = await storageService.uploadFile('bucket-id', file);

// Get file URL
const url = storageService.getFileView('bucket-id', fileId);
```

### Showing Toast Notifications
```typescript
import { showSuccessToast, showErrorToast } from '../../utils/toast';

showSuccessToast('Operation successful!');
showErrorToast('Something went wrong');
```

### Fetching Data
```typescript
import { articleService } from '../../lib/appwriteServices';

// Get all articles
const result = await articleService.getAllArticles(page, limit);

// Get by author
const result = await articleService.getArticlesByAuthor(authorId, page, limit);

// Get single article
const result = await articleService.getArticle(articleId);
```

## 🐛 Common Issues & Solutions

### Issue: "Collection not found"
**Solution**: Check that collection IDs in `.env` match Appwrite Console

### Issue: "Permission denied"
**Solution**: 
1. Check Appwrite Console permissions for collection
2. Ensure user is logged in
3. Verify user has correct role (admin/author)

### Issue: "File too large"
**Solution**: Check file size before upload (max 10MB for articles, 2MB for avatars)

### Issue: "Tags attribute error"
**Solution**: See `FIX_TAGS_ATTRIBUTE.md` - delete String attribute, create String[] (Array)

### Issue: "Settings not loading"
**Solution**: 
1. Create settings collection (see `SETUP_SETTINGS_COLLECTION.md`)
2. Add collection ID to `.env`
3. Restart dev server

## 📱 URLs

### Admin Panel
- Dashboard: `/admin`
- Articles: `/admin/articles`
- New Article: `/admin/articles/new`
- Edit Article: `/admin/articles/edit/[id]`
- Categories: `/admin/categories`
- Authors: `/admin/authors`
- Settings: `/admin/settings`
- Login: `/admin/login`

### Author Panel
- Dashboard: `/author`
- Articles: `/author/articles`
- New Article: `/author/articles/new`
- Edit Article: `/author/articles/edit/[id]`
- Profile: `/author/profile`
- Login: `/author/login`

## 🎨 Toast Colors

```typescript
showSuccessToast('Message')  // Green
showErrorToast('Message')    // Red
showWarningToast('Message')  // Orange
showInfoToast('Message')     // Blue
```

## 🔐 Authentication Flow

```
1. User enters credentials
2. authService.login(email, password)
3. Session created in Appwrite
4. User data fetched from authors collection
5. Role and status checked
6. Redirect to dashboard or show error
```

## 📊 Dashboard Stats Calculation

```typescript
// Total articles
articles.length

// Total views
articles.reduce((sum, a) => sum + (a.views || 0), 0)

// Drafts
articles.filter(a => a.status === 'draft').length

// Published this month
articles.filter(a => {
  if (a.status !== 'published') return false;
  const date = new Date(a.publishedAt);
  return date >= new Date(year, month, 1);
}).length
```

## 🎯 Quick Testing Steps

1. **Login**: Go to `/admin` or `/author`
2. **Dashboard**: Check if stats load correctly
3. **Create Article**: Click "New Article", fill form, upload image
4. **Edit Article**: Click edit on any article, modify, save
5. **Delete Article**: Click delete, confirm in modal
6. **Profile**: Update name, bio, avatar
7. **Settings**: Change site settings, save
8. **Logout**: Click logout button

## 💡 Pro Tips

1. **Always check browser console** for error messages
2. **Use toast notifications** for user feedback
3. **Add loading states** to async operations
4. **Validate file uploads** before sending to Appwrite
5. **Handle errors gracefully** with try-catch blocks
6. **Use TypeScript** for type safety
7. **Test on mobile devices** for responsive design

## 📞 Need Help?

1. Check documentation files in project root
2. Review `appwriteServices.ts` for service methods
3. Check Appwrite Console for data and permissions
4. Review component code for examples
5. Check browser console for error details

---

**Quick Setup**: .env → Collections → Admin User → Test  
**Remember**: Restart dev server after changing .env files!
