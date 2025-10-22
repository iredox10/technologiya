# Comment Section Appwrite Integration

## Overview
Integrated the comment section with Appwrite backend, replacing mock data with real-time database storage for article comments and replies.

## Implementation Date
October 22, 2025

## Changes Made

### 1. Comment Service (`src/lib/appwriteServices.ts`)

Created a new `CommentService` class with the following methods:

#### Core Methods
- **getComments(articleId)** - Fetch all approved comments for an article
- **getComment(commentId)** - Get a single comment by ID
- **createComment()** - Create a new comment or reply
- **updateComment()** - Update comment content
- **deleteComment()** - Delete a comment
- **voteComment()** - Update upvote/downvote counts
- **getReplies(parentId)** - Get all replies for a comment
- **moderateComment()** - Approve/reject comments (admin feature)

#### Features
- Automatic query filtering by `status: 'approved'`
- Ordering: Comments by newest first, replies by oldest first
- Parent-child relationship support via `parentId`
- Vote tracking with `upvotes` and `downvotes` fields

### 2. CommentSection Component (`src/components/CommentSection.tsx`)

#### Authentication Integration
```typescript
// Check authentication via Appwrite instead of localStorage
const userResult = await authService.getCurrentUser();
if (userResult.success && userResult.data) {
  setIsLoggedIn(true);
  setCurrentUser(userResult.data);
}
```

#### Load Comments from Database
```typescript
const loadComments = async () => {
  const result = await commentService.getComments(articleId);
  
  if (result.success && result.data) {
    const appwriteComments = result.data.documents as AppwriteComment[];
    
    // Transform and organize into parent/child structure
    // Build comments tree with replies nested
  }
};
```

#### Create Comment/Reply
```typescript
const handleSubmitComment = async (e) => {
  const result = await commentService.createComment(
    articleId,
    currentUser.$id,
    currentUser.name,
    newComment,
    undefined, // No parentId for top-level comments
    currentUser.prefs?.avatar
  );
  
  if (result.success) {
    // Add to UI and show success toast
  }
};
```

#### Vote Handling
```typescript
const handleVote = async (commentId, voteType) => {
  // Update UI optimistically
  setComments(prevComments => /* update logic */);
  
  // Sync to database
  await commentService.voteComment(commentId, upvotes, downvotes);
};
```

#### Features Added
- ✅ Real-time comment loading from Appwrite
- ✅ User authentication check via Appwrite session
- ✅ Create comments and replies
- ✅ Upvote/downvote functionality
- ✅ Nested replies support
- ✅ Loading states
- ✅ Error handling with Hausa toasts
- ✅ Login prompt for non-authenticated users
- ✅ User avatar from preferences

### 3. Database Schema

#### Comments Collection

| Field | Type | Description |
|-------|------|-------------|
| `$id` | string | Unique comment ID (auto) |
| `articleId` | string | Related article ID |
| `userId` | string | Author's user ID |
| `userName` | string | Author's display name |
| `userAvatar` | string | Author's avatar URL |
| `content` | text | Comment text content |
| `parentId` | string | Parent comment ID (empty for root) |
| `upvotes` | integer | Upvote count |
| `downvotes` | integer | Downvote count |
| `status` | enum | 'approved', 'pending', 'rejected' |
| `$createdAt` | datetime | Creation timestamp (auto) |
| `$updatedAt` | datetime | Update timestamp (auto) |

#### Indexes Recommended
```
- articleId (for filtering by article)
- status (for filtering approved comments)
- parentId (for fetching replies)
- userId (for user's comments)
```

#### Permissions
```
Read: Any
Create: Users
Update: Users (own comments only) or Admins
Delete: Users (own comments only) or Admins
```

## Environment Variables

Add to `.env`:
```env
PUBLIC_APPWRITE_COLLECTION_COMMENTS=your-comments-collection-id
```

## Data Flow

### Loading Comments
```
1. User visits article page
2. CommentSection component mounts
3. Check user authentication
4. Fetch comments from Appwrite
5. Transform to UI format
6. Organize into parent/child tree
7. Render comments with replies
```

### Creating Comment
```
1. User types comment
2. Click "Aika Sharhi" button
3. Validate user is logged in
4. Create comment in Appwrite
5. Get created comment with ID
6. Add to local state
7. Show success toast
8. Clear input field
```

### Voting
```
1. User clicks upvote/downvote
2. Check authentication
3. Update local state optimistically
4. Sync vote count to database
5. Handle errors if sync fails
```

## Features

### User Experience
- **Nested Replies**: Support for threaded conversations
- **Real-time Updates**: New comments appear immediately after creation
- **Vote Tracking**: Upvote and downvote with visual feedback
- **Loading States**: Spinner while fetching comments
- **Empty States**: Friendly message when no comments
- **Login Prompts**: Clear CTAs for non-authenticated users
- **Hausa Language**: All messages in Hausa

### Security
- **Authentication Required**: Must be logged in to comment/vote
- **User Attribution**: Comments linked to user accounts
- **Moderation Support**: Status field for approval workflow
- **Ownership**: Users can edit/delete own comments (future)

### Performance
- **Optimistic Updates**: UI updates before database confirmation
- **Efficient Queries**: Filter by articleId and status
- **Lazy Loading**: Comments loaded per article page
- **Limit**: Max 100 comments per article (adjustable)

## UI Components

### Comment Item
- User avatar (with fallback icon)
- User name
- Time ago (in Hausa)
- Comment content
- Upvote/downvote buttons with counts
- Reply button (for root comments)
- Reply form (when replying)

### New Comment Form
- User avatar
- Textarea for content
- Submit button ("Aika Sharhi")
- Shows only when logged in

### Login Prompt
- Modal overlay
- "Ana Buƙatar Shiga" (Login Required)
- Explanation text
- "Shiga Yanzu" (Login Now) button
- Cancel button

## Hausa Text Translations

| English | Hausa |
|---------|-------|
| Comments | Sharhi |
| Reply | Amsa |
| Send | Aika |
| Cancel | Soke |
| Login Required | Ana Buƙatar Shiga |
| Login Now | Shiga Yanzu |
| Loading comments... | Ana ɗaukar sharhi... |
| No comments yet | Babu sharhi tukuna |
| Be the first! | Ka zama na farko! |
| Write your comment... | Rubuta sharhinka... |
| Write your reply... | Rubuta amsarka... |
| X minutes ago | X minti da suka wuce |
| X hours ago | X awa da suka wuce |
| X days ago | X kwana da suka wuce |

## Error Handling

### Common Errors
1. **Network Failure**: "An samu kuskure wajen ɗaukar sharhi"
2. **Create Failed**: "An samu kuskure wajen aika sharhi"
3. **Vote Failed**: "An samu kuskure wajen ƙidayar ƙuri'a"

### Fallbacks
- Empty avatar → Blue circle with user icon
- Failed load → Shows empty state with retry option
- Failed create → Toast error, keeps user input

## Testing Checklist

### Basic Functionality
- [ ] Comments load on article page
- [ ] Can create new comment when logged in
- [ ] Can reply to existing comments
- [ ] Upvote/downvote buttons work
- [ ] Vote counts update correctly
- [ ] Login prompt shows for non-authenticated users

### User Experience
- [ ] Loading spinner appears while fetching
- [ ] Empty state shows when no comments
- [ ] Nested replies display correctly
- [ ] Time ago shows in Hausa
- [ ] User avatars display properly
- [ ] Forms clear after submission
- [ ] Toast notifications appear

### Edge Cases
- [ ] Handles network errors gracefully
- [ ] Works with no user avatar
- [ ] Handles very long comment text
- [ ] Multiple rapid votes don't break state
- [ ] Reply form cancels properly

## Future Enhancements

1. **Edit Comments**: Allow users to edit their own comments
2. **Delete Comments**: Soft delete with status change
3. **Vote Persistence**: Store user votes in separate collection
4. **Reactions**: Add emoji reactions beyond up/down votes
5. **Mentions**: Tag other users with @ mentions
6. **Notifications**: Notify users of replies to their comments
7. **Pagination**: Load more comments in batches
8. **Sort Options**: Sort by newest, oldest, most liked
9. **Report Spam**: Flag inappropriate comments
10. **Rich Text**: Support markdown or basic formatting

## Known Limitations

1. **Vote Tracking**: Current user's vote not persisted (shows null)
2. **Edit Feature**: Not yet implemented
3. **Delete Feature**: Not yet implemented
4. **Pagination**: All comments load at once (100 limit)
5. **Real-time Sync**: No websocket updates (refresh needed)

## Related Files

- `/src/components/CommentSection.tsx` - Main component
- `/src/lib/appwriteServices.ts` - Comment service
- `/src/types/index.ts` - Comment type definition
- `/src/pages/articles/[slug].astro` - Article page
- `/src/utils/toast.ts` - Toast notifications
