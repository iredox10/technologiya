# 🔧 Fix Tags Attribute Error

## Problem
You're getting this error when creating articles:
```
AppwriteException: Invalid document structure: Attribute "tags" has invalid type. 
Value must be a valid string and no longer than 99999 chars
```

## Root Cause
The `tags` attribute in your Appwrite `articles` collection was created as:
- **Current Type**: String (single value)
- **Should Be**: String[] (Array of strings)

## ✅ Solution: Fix the Appwrite Collection

### Step 1: Go to Appwrite Console
1. Open https://cloud.appwrite.io
2. Go to your **technologiya** project
3. Navigate to **Databases** → Click database `68f4bc1500083bd17364`
4. Click on the **`articles`** collection

### Step 2: Delete the Wrong `tags` Attribute
1. Click on the **"Attributes"** tab
2. Find the `tags` attribute
3. Click the **trash icon** (🗑️) to delete it
4. Confirm deletion

### Step 3: Create the Correct `tags` Attribute
1. Click **"Create attribute"**
2. Select **"String"** type
3. Configure it as:
   - **Key**: `tags`
   - **Size**: `100` (per tag)
   - **Type**: Check the **"Array"** checkbox ✅ (IMPORTANT!)
   - **Array size** (min): `0`
   - **Array size** (max): `50`
   - **Required**: ❌ No (unchecked)
   - **Default**: Leave empty
4. Click **"Create"**

### Step 4: Test Again
Now try creating a new article - it should work! ✅

---

## 🚀 Alternative Quick Fix (If You Can't Change Appwrite)

If you absolutely cannot change the Appwrite attribute type, you can modify the code to send tags as a comma-separated string:

### Edit: `src/components/admin/ArticleEditor.tsx`

Find this line around line 205:
```typescript
tags: formData.tags.length > 0 ? formData.tags : [],
```

Replace it with:
```typescript
tags: formData.tags.join(','), // Convert array to comma-separated string
```

**Note**: This approach is NOT recommended because:
- You'll need to manually parse the string back to array when reading
- Array queries won't work properly
- It's harder to maintain

---

## 📝 Verification

After fixing, create a test article with tags like:
- `AI`
- `Technology`
- `Hausa`

The article should save without errors! ✅

