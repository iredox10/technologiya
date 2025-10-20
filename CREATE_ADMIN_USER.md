# 👤 Creating Your First Admin User

**Quick Guide** - 5 minutes

---

## Step 1: Create Collections in Appwrite

Before creating users, you need to create the database collections first.

### Open Appwrite Console
1. Go to https://cloud.appwrite.io
2. Open your "technologiya" project
3. Click on **"Databases"** in left sidebar
4. Click on your database (or create one if you haven't)

### Create Authors Collection

Click **"Add Collection"** and:
- **Collection ID**: Leave auto-generated (or use custom)
- **Collection Name**: `authors`
- Click **"Create"**

### Add Attributes to Authors Collection

Click on the `authors` collection, then go to **"Attributes"** tab:

1. Click **"Add Attribute"** → **"String"**
   - Key: `userId`
   - Size: `255`
   - Required: ✅ Yes
   - Click "Create"

2. Click **"Add Attribute"** → **"String"**
   - Key: `name`
   - Size: `255`
   - Required: ✅ Yes

3. Click **"Add Attribute"** → **"Email"**
   - Key: `email`
   - Required: ✅ Yes

4. Click **"Add Attribute"** → **"String"**
   - Key: `bio`
   - Size: `1000`
   - Required: ❌ No

5. Click **"Add Attribute"** → **"URL"**
   - Key: `avatar`
   - Required: ❌ No

6. Click **"Add Attribute"** → **"Enum"**
   - Key: `role`
   - Elements: `admin`, `author`
   - Required: ✅ Yes
   - Default: `author`

7. Click **"Add Attribute"** → **"Enum"**
   - Key: `status`
   - Elements: `active`, `inactive`
   - Required: ✅ Yes
   - Default: `active`

8. Click **"Add Attribute"** → **"Integer"**
   - Key: `articleCount`
   - Required: ✅ Yes
   - Default: `0`

### Set Permissions

Still in the `authors` collection, go to **"Settings"** tab:

Under **"Permissions"**:
- Remove all default permissions
- Click **"Add Role"**
- Select **"Any"**
- Check: ✅ Read
- Click **"Update"**

This allows anyone to read author info (needed for public display).

---

## Step 2: Update .env File

Copy the collection ID:
1. In the authors collection, look at the URL or collection details
2. Copy the Collection ID (looks like: `68f4c5a8002d1b9e7f3a`)
3. Update your `.env` file:

```env
PUBLIC_APPWRITE_COLLECTION_AUTHORS="68f4c5a8002d1b9e7f3a"
```

Replace with your actual ID!

---

## Step 3: Create Authentication User

### In Appwrite Console:
1. Click **"Auth"** in left sidebar
2. Click **"Create User"** button
3. Fill in the form:
   - **Email**: `admin@technologiya.com` (or your email)
   - **Password**: Create a strong password
   - **Name**: `Admin User`
4. Click **"Create"**
5. **⚠️ IMPORTANT**: Copy the **User ID** (starts with numbers/letters like `68f4c5a8`)

---

## Step 4: Create Author Document

### Link the auth user to author document:
1. Go back to **"Databases"** → your database → `authors` collection
2. Click **"Add Document"**
3. Fill in:
   ```
   userId: [paste the User ID from Step 3]
   name: "Admin User"
   email: "admin@technologiya.com"
   bio: "Main Administrator of Technologiya"
   avatar: "https://ui-avatars.com/api/?name=Admin+User"
   role: "admin"
   status: "active"
   articleCount: 0
   ```
4. Click **"Create"**

---

## Step 5: Test Login

### Start your dev server:
```bash
bun run dev
```

### Test login:
1. Go to `http://localhost:4321/login`
2. Enter:
   - Email: `admin@technologiya.com`
   - Password: [your password from Step 3]
3. Click **"Shiga"** (Login)
4. You should be redirected to `/admin`

---

## ✅ Success Checklist

- [ ] Authors collection created with all 8 attributes
- [ ] Collection ID copied to `.env` file
- [ ] Auth user created in Appwrite
- [ ] User ID copied
- [ ] Author document created with correct userId
- [ ] Role set to "admin"
- [ ] Status set to "active"
- [ ] Login successful
- [ ] Redirected to admin dashboard

---

## 🐛 Troubleshooting

### "Cannot read properties of undefined"
**Fix**: Make sure `.env` has the correct collection ID for authors

### "Author not found"
**Fix**: Check that author document's `userId` matches the Auth user's ID exactly

### "Asusun ka ba aiki ba ne" (Account not active)
**Fix**: Edit author document and set `status: "active"`

### "Ba kai admin ko marubuta ba ne" (Not admin/author)
**Fix**: Edit author document and set `role: "admin"` (not "Admin" - lowercase!)

### Login redirects back to login
**Check**:
1. Author document exists
2. `userId` in document matches Auth user ID
3. `role` is "admin" or "author" (lowercase)
4. `status` is "active" (lowercase)

---

## 📝 Creating Additional Users

### For Author Account (not admin):
Follow same steps but in Step 4, set:
```
role: "author"  (instead of "admin")
```

### For Multiple Admins:
Repeat all steps with different email addresses.

---

## 🎯 Next Steps

Once login is working:
1. ✅ Test logout (click "Fita" button)
2. ✅ Create an author account to test author dashboard
3. ✅ Proceed to Phase 2: Database Integration

---

**Need Help?** Check `PHASE1_AUTH_COMPLETE.md` for detailed troubleshooting.
