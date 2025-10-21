# 📚 Setup Appwrite Collections

You need to create 5 collections in Appwrite Console. Follow these steps:

---

## 🎯 Step 1: Go to Appwrite Console

1. Open https://cloud.appwrite.io
2. Click on your "technologiya" project
3. Go to **Databases** → Click your database (`68f4bc1500083bd17364`)

---

## 📝 Step 2: Create Collections

### Collection 1: `authors` (Already Created ✅)

You already created this! Just copy the Collection ID to `.env`:
```env
PUBLIC_APPWRITE_COLLECTION_AUTHORS="YOUR_AUTHORS_COLLECTION_ID"
```

---

### Collection 2: `articles`

1. Click **"Add Collection"**
2. Name: `articles`
3. Click **"Create"**
4. **Copy the Collection ID**

**Add these attributes:**

Click **"Attributes"** tab, then add each:

1. **String** - `title` - Size: `500` - Required: ✅
2. **String** - `slug` - Size: `500` - Required: ✅
3. **String** - `excerpt` - Size: `1000` - Required: ❌
4. **String** - `content` - Size: `100000` - Required: ✅
5. **URL** - `coverImage` - Required: ❌
6. **String** - `authorId` - Size: `255` - Required: ✅
7. **String** - `categoryId` - Size: `255` - Required: ✅
8. **String[]** (Array) - `tags` - Size: `100` - Array size: `50` - Required: ❌
9. **Enum** - `status` - Elements: `draft`, `published`, `archived` - Default: `draft` - Required: ✅
10. **DateTime** - `publishedAt` - Required: ❌
11. **Integer** - `views` - Min: `0` - Default: `0` - Required: ✅
12. **Boolean** - `featured` - Default: `false` - Required: ✅

**Permissions:**
- Go to **Settings** tab
- Add Role: **Any** → Check: **Read**

**Update `.env`:**
```env
PUBLIC_APPWRITE_COLLECTION_ARTICLES="PASTE_COLLECTION_ID_HERE"
```

---

### Collection 3: `categories`

1. Click **"Add Collection"**
2. Name: `categories`
3. Click **"Create"**
4. **Copy the Collection ID**

**Add these attributes:**

1. **String** - `name` - Size: `255` - Required: ✅
2. **String** - `slug` - Size: `255` - Required: ✅
3. **String** - `description` - Size: `1000` - Required: ❌
4. **String** - `color` - Size: `50` - Default: `#3B82F6` - Required: ✅
5. **String** - `icon` - Size: `100` - Required: ❌
6. **Integer** - `articleCount` - Min: `0` - Default: `0` - Required: ✅

**Permissions:**
- Add Role: **Any** → Check: **Read**

**Update `.env`:**
```env
PUBLIC_APPWRITE_COLLECTION_CATEGORIES="PASTE_COLLECTION_ID_HERE"
```

---

### Collection 4: `comments`

1. Click **"Add Collection"**
2. Name: `comments`
3. Click **"Create"**
4. **Copy the Collection ID**

**Add these attributes:**

1. **String** - `articleId` - Size: `255` - Required: ✅
2. **String** - `userId` - Size: `255` - Required: ✅
3. **String** - `userName` - Size: `255` - Required: ✅
4. **URL** - `userAvatar` - Required: ❌
5. **String** - `content` - Size: `5000` - Required: ✅
6. **String** - `parentId` - Size: `255` - Required: ❌
7. **Integer** - `upvotes` - Min: `0` - Default: `0` - Required: ✅
8. **Integer** - `downvotes` - Min: `0` - Default: `0` - Required: ✅
9. **Enum** - `status` - Elements: `approved`, `pending`, `rejected` - Default: `pending` - Required: ✅

**Permissions:**
- Add Role: **Any** → Check: **Read**

**Update `.env`:**
```env
PUBLIC_APPWRITE_COLLECTION_COMMENTS="PASTE_COLLECTION_ID_HERE"
```

---

### Collection 5: `users`

1. Click **"Add Collection"**
2. Name: `users`
3. Click **"Create"**
4. **Copy the Collection ID**

**Add these attributes:**

1. **String** - `name` - Size: `255` - Required: ✅
2. **Email** - `email` - Required: ✅
3. **URL** - `avatar` - Required: ❌
4. **Enum** - `role` - Elements: `user`, `author`, `admin` - Default: `user` - Required: ✅
5. **String** - `bio` - Size: `1000` - Required: ❌

**Permissions:**
- Add Role: **Any** → Check: **Read**

**Update `.env`:**
```env
PUBLIC_APPWRITE_COLLECTION_USERS="PASTE_COLLECTION_ID_HERE"
```

---

## ✅ Step 3: Update Your `.env` File

After creating all collections, your `.env` should look like:

```env
PUBLIC_HUGGINGFACE_API_KEY="hf_..."

# Appwrite Configuration
PUBLIC_APPWRITE_PROJECT_NAME = "technologiya"
PUBLIC_APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"
PUBLIC_APPWRITE_PROJECT_ID="68f4bbc30029d695034f"
PUBLIC_APPWRITE_DATABASE_ID="68f4bc1500083bd17364"

# Collection IDs (REPLACE WITH REAL IDs)
PUBLIC_APPWRITE_COLLECTION_ARTICLES="67f..."
PUBLIC_APPWRITE_COLLECTION_CATEGORIES="67f..."
PUBLIC_APPWRITE_COLLECTION_AUTHORS="67f..."
PUBLIC_APPWRITE_COLLECTION_COMMENTS="67f..."
PUBLIC_APPWRITE_COLLECTION_USERS="67f..."

# Storage Buckets
PUBLIC_APPWRITE_BUCKET_ARTICLE_IMAGES="68f4c32e0005299bcffb"
PUBLIC_APPWRITE_BUCKET_AUTHOR_AVATARS="68f4c3d8001dfea1cb95"
```

---

## 🚀 Step 4: Restart Dev Server

```bash
# Press Ctrl+C to stop
bun run dev
```

---

## 📊 Step 5: Test Dashboard

1. Go to `http://localhost:4321/login`
2. Login with: `admin@technologiya.com` / `Admin123!`
3. You should see the dashboard with real stats!

---

## 🎉 Done!

Once all collections are created and IDs are in `.env`, your dashboard will show:
- ✅ Total articles count
- ✅ Total categories count  
- ✅ Total authors count
- ✅ Total views
- ✅ Recent articles list

**Next:** You can start adding articles through the admin dashboard!
