# Setup Settings Collection in Appwrite

Follow these steps to create the Settings collection in Appwrite Console.

## 1. Create Settings Collection

1. Go to Appwrite Console → Your Project → Databases
2. Select your database
3. Click "Create Collection"
4. Name it: `settings`
5. Copy the Collection ID and add it to your `.env` file as `PUBLIC_APPWRITE_COLLECTION_SETTINGS`

## 2. Add Attributes

Create the following attributes:

### Attribute 1: settingKey
- **Type**: String
- **Size**: 100
- **Required**: Yes
- **Array**: No
- **Default**: None

### Attribute 2: settingValue
- **Type**: String
- **Size**: 5000
- **Required**: Yes
- **Array**: No
- **Default**: None

### Attribute 3: category
- **Type**: String
- **Size**: 50
- **Required**: Yes
- **Array**: No
- **Default**: None
- **Allowed Values**: site, seo, users, email, security

## 3. Set Permissions

### Collection Permissions:
- **Read**: Any (or Role: all users)
- **Create**: Role: admin
- **Update**: Role: admin
- **Delete**: Role: admin

### Document Permissions:
- Use collection-level permissions

## 4. Create Indexes (Optional but Recommended)

### Index 1: settingKey_index
- **Type**: Key
- **Attributes**: settingKey
- **Order**: ASC

### Index 2: category_index
- **Type**: Key
- **Attributes**: category
- **Order**: ASC

## 5. Update Environment Variables

Add this to your `.env` file:

```env
PUBLIC_APPWRITE_COLLECTION_SETTINGS=your_settings_collection_id_here
```

## 6. Test the Integration

1. Go to Admin Dashboard → Settings
2. Modify some settings (site name, description, etc.)
3. Click "Ajiye Canje-canje" (Save Changes)
4. Check Appwrite Console to verify documents were created
5. Refresh the page to verify settings are loaded from Appwrite

## Settings Structure

The settings are stored as key-value pairs with categories:

### Site Settings (category: 'site')
- siteName
- siteDescription
- siteUrl
- contactEmail
- language
- timezone

### SEO Settings (category: 'seo')
- metaTitle
- metaDescription
- metaKeywords
- ogImage
- twitterHandle

### User Settings (category: 'users')
- enableRegistration (boolean as string)
- requireEmailVerification (boolean as string)
- allowComments (boolean as string)
- moderateComments (boolean as string)

## Notes

- Boolean values are stored as strings ('true' or 'false')
- Settings are automatically created if they don't exist (upsert logic)
- Default values are used if settings are not found in the database
- The system will show a toast notification when settings are loaded or saved
