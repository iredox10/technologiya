# Setup Comments Collection in Appwrite

## Step 1: Create Collection

1. Go to your Appwrite Console
2. Navigate to Databases → Select your database
3. Click "Add Collection"
4. Name: `comments`
5. Click "Create"

## Step 2: Add Attributes

Add the following attributes to the collection:

### String Attributes

| Attribute Name | Type | Size | Required | Default |
|----------------|------|------|----------|---------|
| `articleId` | String | 255 | Yes | - |
| `userId` | String | 255 | Yes | - |
| `userName` | String | 255 | Yes | - |
| `userAvatar` | String | 500 | No | - |
| `parentId` | String | 255 | No | - |
| `status` | Enum | - | Yes | approved |

**Status Enum Values**: `approved`, `pending`, `rejected`

### Text Attribute

| Attribute Name | Type | Size | Required |
|----------------|------|------|----------|
| `content` | Text | 10000 | Yes |

### Integer Attributes

| Attribute Name | Type | Min | Max | Required | Default |
|----------------|------|-----|-----|----------|---------|
| `upvotes` | Integer | 0 | - | Yes | 0 |
| `downvotes` | Integer | 0 | - | Yes | 0 |

## Step 3: Create Indexes

For better query performance, create these indexes:

1. **Index Name**: `idx_articleId`
   - Type: Key
   - Attributes: `articleId`
   - Order: ASC

2. **Index Name**: `idx_status`
   - Type: Key
   - Attributes: `status`
   - Order: ASC

3. **Index Name**: `idx_parentId`
   - Type: Key
   - Attributes: `parentId`
   - Order: ASC

4. **Index Name**: `idx_userId`
   - Type: Key
   - Attributes: `userId`
   - Order: ASC

## Step 4: Set Permissions

### Read Access
- **Role**: Any
- **Permission**: Read

### Create Access
- **Role**: Users
- **Permission**: Create

### Update Access
- **Role**: Users
- **Permission**: Update
- **Note**: Add logic to ensure users can only update their own comments

### Delete Access
- **Role**: Users
- **Permission**: Delete
- **Note**: Add logic to ensure users can only delete their own comments

### Admin Access (Optional)
- **Role**: Admin (create a label)
- **Permissions**: All (Read, Create, Update, Delete)

## Step 5: Update Environment Variables

Add the collection ID to your `.env` file:

```env
PUBLIC_APPWRITE_COLLECTION_COMMENTS=your_collection_id_here
```

Replace `your_collection_id_here` with the actual Collection ID from Appwrite.

## Step 6: Verify Setup

Run this test in your browser console on an article page:

```javascript
// Test fetching comments
const { commentService } = await import('./src/lib/appwriteServices');
const result = await commentService.getComments('test-article-id');
console.log('Comments:', result);
```

## Collection Schema Summary

```
comments {
  $id: string (auto)
  $createdAt: datetime (auto)
  $updatedAt: datetime (auto)
  $permissions: array (auto)
  
  articleId: string (required)
  userId: string (required)
  userName: string (required)
  userAvatar: string (optional)
  content: text (required, max 10000)
  parentId: string (optional) // Empty for root comments
  upvotes: integer (required, default: 0)
  downvotes: integer (required, default: 0)
  status: enum (required, default: 'approved')
    - approved
    - pending
    - rejected
}
```

## Example Document

```json
{
  "$id": "64f5a1b2c3d4e5f6g7h8i9j0",
  "$createdAt": "2025-10-22T10:30:00.000Z",
  "$updatedAt": "2025-10-22T10:30:00.000Z",
  "articleId": "article-123",
  "userId": "user-456",
  "userName": "Ali Usman",
  "userAvatar": "https://example.com/avatar.jpg",
  "content": "Labari mai ban sha'awa sosai!",
  "parentId": "",
  "upvotes": 5,
  "downvotes": 1,
  "status": "approved"
}
```

## Troubleshooting

### Comments not loading
- Check collection ID in `.env`
- Verify permissions are set correctly
- Check browser console for errors
- Ensure articles exist in database

### Cannot create comments
- Verify user is logged in
- Check Create permission is set for Users
- Ensure all required fields are provided
- Check browser console for validation errors

### Replies not showing
- Verify `parentId` is set correctly
- Check `getReplies()` query is working
- Ensure replies have `status: 'approved'`

## Security Best Practices

1. **Sanitize Input**: Always sanitize comment content before displaying
2. **Rate Limiting**: Implement rate limiting for comment creation
3. **Moderation**: Use status field for moderation workflow
4. **User Verification**: Verify user owns comment before update/delete
5. **Content Length**: Enforce max length on client and server
6. **XSS Protection**: Escape HTML in comment content

## Next Steps

After setup:
1. Test creating a comment on an article
2. Test replying to a comment
3. Test upvoting/downvoting
4. Verify comments persist after page reload
5. Test with multiple users
