# Appwrite Integration Checklist

## ✅ Setup Phase (Complete these first)

### 1. Appwrite Account Setup
- [ ] Create account at https://cloud.appwrite.io
- [ ] Verify email address
- [ ] Complete profile setup

### 2. Project Creation
- [ ] Create new project named "technologiya"
- [ ] Copy Project ID
- [ ] Add web platform with hostname

### 3. Authentication Setup
- [ ] Enable Email/Password authentication
- [ ] Configure session settings
- [ ] (Optional) Enable OAuth providers for user login

### 4. Database Creation
- [ ] Create database named "technologiya_db"
- [ ] Copy Database ID
- [ ] Set appropriate permissions

### 5. Collections Setup

#### Articles Collection
- [ ] Create collection with ID "articles"
- [ ] Add all 12 attributes (see APPWRITE_SETUP.md)
- [ ] Set status enum values
- [ ] Create indexes (slug, authorId, categoryId, status, publishedAt, views)
- [ ] Set permissions (Read: all, Write: members)

#### Categories Collection
- [ ] Create collection with ID "categories"
- [ ] Add all 6 attributes
- [ ] Create indexes (slug, name)
- [ ] Set permissions

#### Authors Collection
- [ ] Create collection with ID "authors"
- [ ] Add all 8 attributes
- [ ] Set role and status enum values
- [ ] Create indexes (userId, email, role, status)
- [ ] Set permissions

#### Comments Collection
- [ ] Create collection with ID "comments"
- [ ] Add all 10 attributes
- [ ] Set status enum values
- [ ] Create indexes (articleId, userId, parentId, status)
- [ ] Set permissions

#### Users Collection
- [ ] Create collection with ID "users"
- [ ] Add all 5 attributes
- [ ] Set role enum values
- [ ] Create indexes (email, role)
- [ ] Set permissions

### 6. Storage Buckets

#### Article Images Bucket
- [ ] Create bucket with ID "article-images"
- [ ] Set max file size to 10MB
- [ ] Allow extensions: jpg, jpeg, png, webp, gif
- [ ] Enable compression
- [ ] Set permissions (Read: all, Write: members)

#### Author Avatars Bucket
- [ ] Create bucket with ID "author-avatars"
- [ ] Set max file size to 5MB
- [ ] Allow extensions: jpg, jpeg, png, webp
- [ ] Enable compression
- [ ] Set permissions (Read: all, Write: members)

### 7. Environment Configuration
- [ ] Copy .env.example to .env
- [ ] Add Appwrite endpoint
- [ ] Add Project ID
- [ ] Add Database ID
- [ ] Add all Collection IDs
- [ ] Add all Bucket IDs
- [ ] Add Hugging Face API key

### 8. Admin Account Setup
- [ ] Create admin user in Appwrite Auth
- [ ] Copy the user ID
- [ ] Create author document with:
  - userId: (the copied user ID)
  - role: "admin"
  - status: "active"
  - email, name, bio, avatar
  - articleCount: 0

### 9. Test Connection
- [ ] Start dev server: `bun run dev`
- [ ] Check console for Appwrite connection
- [ ] Verify no configuration errors

---

## 🔌 Integration Phase (Implement in this order)

### Phase 1: Authentication (START HERE)

#### UnifiedLogin Component
- [ ] Import authService and authorService
- [ ] Replace mock login with authService.login()
- [ ] Add getUserRole() to check admin/author
- [ ] Redirect based on role
- [ ] Add proper error handling
- [ ] Test login flow

#### AdminLogin Component  
- [ ] Remove old mock login code
- [ ] Point to /login instead (unified login)
- [ ] OR integrate authService directly

#### AuthorLogin Component
- [ ] Remove old mock login code
- [ ] Point to /login instead (unified login)
- [ ] OR integrate authService directly

#### Logout Functionality
- [ ] Update AdminSidebar logout to use authService.logout()
- [ ] Update AuthorSidebar logout to use authService.logout()
- [ ] Clear local state on logout
- [ ] Redirect to /login

#### Protected Routes
- [ ] Add auth check to admin layout
- [ ] Add auth check to author layout
- [ ] Redirect to /login if not authenticated
- [ ] Check user role matches route

### Phase 2: Admin Dashboard

#### ArticlesList Component
- [ ] Import articleService
- [ ] Replace mockArticles with articleService.getArticles()
- [ ] Implement pagination
- [ ] Implement search with articleService.searchArticles()
- [ ] Implement status filter
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test CRUD operations

#### ArticleEditor Component
- [ ] Import articleService and storageService
- [ ] Add image upload functionality
- [ ] Replace mock save with articleService.createArticle()
- [ ] Handle article updates with articleService.updateArticle()
- [ ] Generate slug from title
- [ ] Add validation
- [ ] Test create and edit flows

#### CategoriesManager Component
- [ ] Import categoryService
- [ ] Fetch categories with categoryService.getCategories()
- [ ] Implement create category
- [ ] Implement edit category
- [ ] Implement delete category
- [ ] Add loading and error states

#### AuthorsManager Component
- [ ] Import authorService
- [ ] Fetch authors with authorService.getAuthors()
- [ ] Implement create author
- [ ] Link to Appwrite user ID
- [ ] Implement edit author
- [ ] Implement delete author (with warning)
- [ ] Add validation

#### AdminDashboard Component
- [ ] Fetch real statistics
- [ ] Get total articles count
- [ ] Get total views sum
- [ ] Get categories count
- [ ] Get authors count
- [ ] Display recent articles from Appwrite

### Phase 3: Author Dashboard

#### AuthorDashboard Component
- [ ] Get current author ID
- [ ] Fetch author's articles only
- [ ] Display author statistics
- [ ] Show recent activity

#### AuthorArticlesList Component
- [ ] Filter articles by current author
- [ ] Use articleService.getArticlesByAuthor()
- [ ] Implement search within author's articles
- [ ] Add status filter

#### AuthorProfile Component
- [ ] Import authorService and storageService
- [ ] Fetch current author data
- [ ] Implement profile update
- [ ] Add avatar upload
- [ ] Update author statistics

### Phase 4: Public Pages

#### Homepage (index.astro)
- [ ] Fetch published articles
- [ ] Filter by status: "published"
- [ ] Order by publishedAt
- [ ] Implement pagination
- [ ] Show featured articles

#### Article Detail ([slug].astro)
- [ ] Fetch article by slug
- [ ] Increment view count on load
- [ ] Fetch related articles
- [ ] Display author info from authors collection

#### Category Page ([slug].astro)
- [ ] Fetch category by slug
- [ ] Get articles by category
- [ ] Implement pagination
- [ ] Show category details

#### Search Page
- [ ] Implement search with articleService.searchArticles()
- [ ] Add filters (category, date range)
- [ ] Pagination
- [ ] Display results count

### Phase 5: Comments System

#### CommentSection Component
- [ ] Create comment service (if not exists)
- [ ] Fetch comments for article
- [ ] Implement add comment
- [ ] Implement reply to comment
- [ ] Implement voting
- [ ] Check user authentication
- [ ] Add moderation status

#### Comment Moderation (Admin)
- [ ] List all comments
- [ ] Approve/reject comments
- [ ] Delete comments
- [ ] Filter by status

### Phase 6: User System

#### UserLogin Component
- [ ] Integrate Appwrite OAuth
- [ ] Handle Google login
- [ ] Handle Facebook login
- [ ] Handle Twitter login
- [ ] Create user document on registration
- [ ] Set default role to "user"

#### UserProfile Component
- [ ] Fetch user data
- [ ] Update profile
- [ ] Upload avatar
- [ ] Change password (if email/password auth)

---

## 🧪 Testing Checklist

### Authentication Tests
- [ ] Admin can login
- [ ] Author can login
- [ ] Invalid credentials show error
- [ ] Logout works correctly
- [ ] Session persists on refresh
- [ ] Protected routes redirect when not authenticated

### Article Tests
- [ ] Create new article with image
- [ ] Edit existing article
- [ ] Delete article
- [ ] Search articles
- [ ] Filter by category
- [ ] Filter by status
- [ ] Pagination works
- [ ] View count increments

### Category Tests
- [ ] Create category
- [ ] Edit category
- [ ] Delete category
- [ ] Articles show correct category

### Author Tests
- [ ] Create author profile
- [ ] Edit author
- [ ] Authors can only see their articles
- [ ] Admin can see all articles

### File Upload Tests
- [ ] Upload article cover image
- [ ] Upload author avatar
- [ ] Image preview shows correctly
- [ ] File size limits work
- [ ] File type restrictions work

### Comment Tests
- [ ] User can post comment
- [ ] User can reply to comment
- [ ] Voting works
- [ ] Moderation works

---

## 📊 Post-Integration Tasks

### Data Migration
- [ ] Import existing articles (if any)
- [ ] Import categories
- [ ] Set up author profiles
- [ ] Migrate images to Appwrite Storage

### Optimization
- [ ] Implement caching for frequently accessed data
- [ ] Add image optimization
- [ ] Set up CDN for Appwrite Storage (if needed)
- [ ] Optimize database queries

### Monitoring
- [ ] Set up error logging
- [ ] Monitor API usage
- [ ] Track performance metrics
- [ ] Set up alerts for errors

### Documentation
- [ ] Document custom Appwrite functions (if any)
- [ ] Update README with setup instructions
- [ ] Create admin user guide
- [ ] Create author user guide

---

## 🎉 Launch Checklist

### Pre-Launch
- [ ] All features tested
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] Security reviewed

### Launch
- [ ] Update environment to production
- [ ] Configure production Appwrite project
- [ ] Set up proper permissions
- [ ] Enable rate limiting if needed
- [ ] Deploy application
- [ ] Monitor for errors

### Post-Launch
- [ ] Monitor system health
- [ ] Gather user feedback
- [ ] Fix any issues
- [ ] Plan future enhancements

---

## 📞 Need Help?

- **Documentation**: Check APPWRITE_SETUP.md and APPWRITE_QUICKSTART.md
- **Appwrite Docs**: https://appwrite.io/docs
- **Appwrite Discord**: https://appwrite.io/discord
- **GitHub Issues**: File issues on GitHub

---

**Progress**: ☐ Not Started | ⏳ In Progress | ✅ Complete

**Current Status**: Setup Phase Complete ✅ | Integration Phase Ready to Start ⏳
