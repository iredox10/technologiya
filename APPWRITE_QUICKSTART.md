# Appwrite Quick Start Guide

## ⚡ Get Started in 5 Minutes

### 1. Create Appwrite Account
Visit https://cloud.appwrite.io and sign up (it's free!)

### 2. Create Project
```
1. Click "Create Project"
2. Name: "technologiya"
3. Copy the Project ID
```

### 3. Add Platform
```
1. Go to Settings → Platforms
2. Add Web Platform
3. Add hostname: "localhost" or "*" for development
```

### 4. Create Database & Collections
```bash
# Use the Appwrite Console UI to create:
- Database: "technologiya_db"
- Collections: articles, categories, authors, comments, users
- Follow the schema in APPWRITE_SETUP.md
```

Or use this automated script (coming soon):
```bash
bun run setup:appwrite
```

### 5. Create Storage Buckets
```
1. Go to Storage
2. Create bucket: "article-images"
   - Max size: 10MB
   - Extensions: jpg, jpeg, png, webp, gif

3. Create bucket: "author-avatars"
   - Max size: 5MB
   - Extensions: jpg, jpeg, png, webp
```

### 6. Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your IDs:
PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
PUBLIC_APPWRITE_PROJECT_ID=your_project_id
PUBLIC_APPWRITE_DATABASE_ID=your_database_id
PUBLIC_APPWRITE_COLLECTION_ARTICLES=articles_collection_id
PUBLIC_APPWRITE_COLLECTION_CATEGORIES=categories_collection_id
PUBLIC_APPWRITE_COLLECTION_AUTHORS=authors_collection_id
PUBLIC_APPWRITE_COLLECTION_COMMENTS=comments_collection_id
PUBLIC_APPWRITE_COLLECTION_USERS=users_collection_id
PUBLIC_APPWRITE_BUCKET_ARTICLE_IMAGES=article_images_bucket_id
PUBLIC_APPWRITE_BUCKET_AUTHOR_AVATARS=author_avatars_bucket_id
```

### 7. Create Admin Account

#### Option A: Using Appwrite Console
```
1. Go to Auth → Users
2. Create new user
3. Email: admin@technologiya.com
4. Password: (set a strong password)
5. Go to Databases → authors collection
6. Create document:
   {
     "userId": "the_user_id_from_step_2",
     "name": "Admin",
     "email": "admin@technologiya.com",
     "bio": "Site Administrator",
     "avatar": "https://ui-avatars.com/api/?name=Admin",
     "role": "admin",
     "status": "active",
     "articleCount": 0
   }
```

#### Option B: Using API (Coming Soon)
```bash
bun run create:admin
```

### 8. Seed Sample Data (Optional)
```bash
# Create sample categories and articles
bun run seed:data
```

### 9. Start Development Server
```bash
bun run dev
```

### 10. Test the Integration
```
1. Open http://localhost:4321/login
2. Login with admin@technologiya.com
3. You should be redirected to /admin dashboard
4. Try creating a new article!
```

---

## 🎯 Next Steps

### Create Your First Article
1. Go to `/admin/articles/new`
2. Fill in title, content, select category
3. Upload a cover image
4. Click "Publish"

### Add More Authors
1. Go to `/admin/authors`
2. Click "Add Author"
3. Create Appwrite user first
4. Link user ID to author profile

### Customize Categories
1. Go to `/admin/categories`
2. Add categories for your content
3. Assign colors and icons

---

## 🔧 Troubleshooting

### Can't login?
- Check if Auth is enabled in Appwrite Console
- Verify email/password match
- Check browser console for errors

### Collections not found?
- Verify all collection IDs in `.env`
- Make sure database ID is correct
- Check if collections are created in Appwrite

### Permission errors?
- Set collection permissions to allow Read/Write for authenticated users
- Verify bucket permissions for file uploads

### Still stuck?
- Check the full documentation in `APPWRITE_SETUP.md`
- Review Appwrite docs: https://appwrite.io/docs
- Join Appwrite Discord: https://appwrite.io/discord

---

## 📚 Resources

- **Full Setup Guide**: `APPWRITE_SETUP.md`
- **Database Schema**: See APPWRITE_SETUP.md → Database Schema
- **API Reference**: `src/lib/appwriteServices.ts`
- **Appwrite Docs**: https://appwrite.io/docs
- **Appwrite Console**: https://cloud.appwrite.io

---

## ✅ Checklist

- [ ] Created Appwrite account
- [ ] Created project and added platform
- [ ] Created database and all collections
- [ ] Created storage buckets
- [ ] Set up environment variables
- [ ] Created admin user and author document
- [ ] Tested login functionality
- [ ] Created first article
- [ ] Verified file uploads work

---

**Need help?** Check `APPWRITE_SETUP.md` for detailed instructions!
