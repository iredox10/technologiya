# Deployment Checklist - Technologiya Blog

## 🚀 Pre-Deployment Checklist

### 1. Appwrite Setup ✅

#### Create Collections
- [ ] **articles** collection created
  - [ ] All attributes added (title, slug, excerpt, content, coverImage, authorId, categoryId, tags, status, publishedAt, views, featured)
  - [ ] Indexes created (slug, authorId, categoryId, status, featured, publishedAt)
  - [ ] Permissions set (Read: Any, Create/Update/Delete: Role-based)

- [ ] **categories** collection created
  - [ ] Attributes: name, slug, description, color, icon, articleCount
  - [ ] Index on slug
  - [ ] Permissions configured

- [ ] **authors** collection created
  - [ ] Attributes: userId, name, email, bio, avatar, role, status, articleCount
  - [ ] Index on userId and email
  - [ ] Permissions configured

- [ ] **settings** collection created
  - [ ] Attributes: settingKey, settingValue, category
  - [ ] Indexes on settingKey and category
  - [ ] Permissions: Read: Any, Write: Admin

- [ ] **users** collection created (optional for comments)
- [ ] **comments** collection created (optional)

#### Create Storage Buckets
- [ ] **article-images** bucket created
  - [ ] Max file size: 10MB
  - [ ] Allowed file types: image/*
  - [ ] Permissions: Read: Any, Create/Delete: Authenticated

- [ ] **author-avatars** bucket created
  - [ ] Max file size: 2MB
  - [ ] Allowed file types: image/*
  - [ ] Permissions: Read: Any, Create/Delete: Authenticated

#### Update Environment Variables
```env
# Copy collection IDs from Appwrite Console
PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
PUBLIC_APPWRITE_PROJECT_ID=your_project_id
PUBLIC_APPWRITE_DATABASE_ID=your_database_id

PUBLIC_APPWRITE_COLLECTION_ARTICLES=actual_collection_id
PUBLIC_APPWRITE_COLLECTION_CATEGORIES=actual_collection_id
PUBLIC_APPWRITE_COLLECTION_AUTHORS=actual_collection_id
PUBLIC_APPWRITE_COLLECTION_COMMENTS=actual_collection_id
PUBLIC_APPWRITE_COLLECTION_USERS=actual_collection_id
PUBLIC_APPWRITE_COLLECTION_SETTINGS=actual_collection_id

PUBLIC_APPWRITE_BUCKET_ARTICLE_IMAGES=actual_bucket_id
PUBLIC_APPWRITE_BUCKET_AUTHOR_AVATARS=actual_bucket_id
```

### 2. Initial Data Setup

#### Create Admin User
```bash
# Edit create-admin.ts with your admin credentials
bun run create-admin.ts
```

- [ ] Admin user created successfully
- [ ] Can login at `/admin/login`
- [ ] Admin dashboard loads

#### Create Initial Categories
Go to Admin Panel → Categories, create:
- [ ] AI & Machine Learning
- [ ] Wayoyi (Phones)
- [ ] Hanyoyin Sadarwa (Networking)
- [ ] Manhajoji (Programming)
- [ ] Kimiyya (Science)

#### Create Test Author (Optional)
Go to Admin Panel → Authors, create:
- [ ] Test author account
- [ ] Can login at `/author/login`
- [ ] Author dashboard loads

### 3. Testing Phase

#### Admin Panel Tests
- [ ] Login works at `/admin/login`
- [ ] Dashboard displays real stats
- [ ] Can create new article with image upload
- [ ] Can edit existing article
- [ ] Can delete article (with confirmation)
- [ ] Can create/edit/delete categories
- [ ] Can create/edit/delete authors
- [ ] Settings save and persist
- [ ] Sidebar shows admin data
- [ ] Logout works

#### Author Panel Tests
- [ ] Login works at `/author/login`
- [ ] Dashboard shows author-specific stats
- [ ] Recent articles display correctly
- [ ] Can view all articles list
- [ ] Search works
- [ ] Status filter works (all/published/draft)
- [ ] Can create new article
- [ ] Can edit own article
- [ ] Can delete own article (with confirmation)
- [ ] Profile loads correctly
- [ ] Profile update works
- [ ] Avatar upload works
- [ ] Sidebar shows author data
- [ ] Logout works

#### Frontend Tests
- [ ] Homepage loads
- [ ] Articles display from Appwrite
- [ ] Category pages work
- [ ] Article detail pages work
- [ ] Search functionality works
- [ ] Mobile responsive
- [ ] Dark mode works

### 4. Security Checks

#### Authentication
- [ ] Cannot access admin panel without login
- [ ] Cannot access author panel without login
- [ ] Proper redirects to login pages
- [ ] Session persists across page refreshes
- [ ] Logout clears session

#### Authorization
- [ ] Authors can only see/edit their own articles
- [ ] Admins can see/edit all articles
- [ ] Role checks work (admin vs author)
- [ ] Status checks work (active vs inactive)

#### File Uploads
- [ ] File type validation works
- [ ] File size validation works
- [ ] Files upload to correct buckets
- [ ] Uploaded files are accessible

### 5. Performance Checks

- [ ] Pages load quickly (< 3s)
- [ ] Images lazy load
- [ ] Dashboard stats calculate efficiently
- [ ] No console errors
- [ ] No memory leaks

### 6. Browser Compatibility

Test in:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (Chrome, Safari)

### 7. Build & Deployment

#### Local Build Test
```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

- [ ] Build completes without errors
- [ ] Preview works correctly
- [ ] All routes accessible
- [ ] Static assets load

#### Environment Variables for Production
- [ ] Copy all `PUBLIC_APPWRITE_*` variables to production
- [ ] Verify Appwrite endpoint is correct
- [ ] Verify all collection IDs are correct
- [ ] Verify all bucket IDs are correct

#### Deploy to Hosting Platform

**For Vercel:**
```bash
vercel --prod
```

**For Netlify:**
```bash
netlify deploy --prod
```

- [ ] Deployment successful
- [ ] Environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

### 8. Post-Deployment Verification

- [ ] Production site loads
- [ ] Admin login works
- [ ] Author login works
- [ ] Can create articles in production
- [ ] Images upload correctly
- [ ] Settings persist
- [ ] No console errors in production

### 9. Monitoring Setup

- [ ] Analytics configured (Google Analytics, Plausible, etc.)
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Uptime monitoring (optional)
- [ ] Performance monitoring (optional)

### 10. Documentation

- [ ] README.md updated with setup instructions
- [ ] Environment variables documented
- [ ] Admin credentials stored securely
- [ ] Deployment process documented

---

## 🐛 Common Issues & Solutions

### Issue: Collections not found
**Solution**: 
1. Verify collection IDs in `.env` match Appwrite Console
2. Restart dev server after changing `.env`
3. Check Appwrite project ID is correct

### Issue: Permission denied
**Solution**:
1. Check collection permissions in Appwrite Console
2. Ensure user has correct role (admin/author)
3. Verify user status is "active"

### Issue: Images not uploading
**Solution**:
1. Check bucket permissions
2. Verify file size and type
3. Check browser console for errors
4. Ensure bucket IDs in `.env` are correct

### Issue: Settings not loading
**Solution**:
1. Create settings collection (see `SETUP_SETTINGS_COLLECTION.md`)
2. Add collection ID to `.env`
3. Restart server

### Issue: Build fails
**Solution**:
1. Check for TypeScript errors
2. Ensure all imports are correct
3. Check that all environment variables are set
4. Clear `.astro` cache and rebuild

---

## 📞 Support Resources

- **Appwrite Docs**: https://appwrite.io/docs
- **Astro Docs**: https://docs.astro.build
- **Project Documentation**: See all `*.md` files in project root

---

## ✅ Final Checklist

Before going live:
- [ ] All tests passed
- [ ] Admin account created
- [ ] Initial categories created
- [ ] At least one test article created
- [ ] Production environment variables set
- [ ] Build successful
- [ ] Deployment successful
- [ ] Post-deployment tests passed
- [ ] Monitoring configured
- [ ] Documentation complete

---

**Ready to deploy!** 🚀

Once everything is checked, your Hausa tech blog is production-ready!

**Barka da aiki! (Good job!)** 🎉
