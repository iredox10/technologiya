# Comment System Documentation

## Overview
Complete comment system with upvoting, downvoting, and nested replies for article pages.

## Features

### ✅ Core Features
- **Comment Creation**: Users can write and post comments
- **Nested Replies**: Reply to any comment (one level deep)
- **Upvote/Downvote**: Vote on comments and replies
- **Real-time Updates**: Dynamic vote counting
- **Login Required**: Authentication check before actions
- **Time Display**: Shows how long ago comments were posted
- **User Avatars**: Profile pictures with fallback
- **Comment Count**: Total count including replies

### 🎨 UI Features
- **Dark Mode Support**: Full dark theme compatibility
- **Responsive Design**: Mobile-friendly layout
- **Empty States**: Helpful messages when no comments
- **Login Prompt Modal**: Beautiful modal for non-logged users
- **Reply Form**: Inline reply form with cancel option
- **Vote Highlighting**: Visual feedback for user votes

## Component Structure

### File Location
```
/src/components/CommentSection.tsx
```

### Usage in Article Page
```astro
---
import CommentSection from '../../components/CommentSection';
---

<CommentSection articleId={article.id} client:load />
```

## Data Structure

### Comment Interface
```typescript
interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    email: string;
  };
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  userVote?: 'up' | 'down' | null;
}
```

## Key Functions

### 1. **handleVote**
```typescript
handleVote(commentId: string, voteType: 'up' | 'down', isReply: boolean, parentId?: string)
```
- Checks if user is logged in
- Toggles vote (clicking same vote removes it)
- Updates vote counts dynamically
- Handles both comments and replies

### 2. **handleSubmitComment**
```typescript
handleSubmitComment(e: React.FormEvent)
```
- Validates user login
- Creates new comment
- Adds to comments list
- Clears form

### 3. **handleSubmitReply**
```typescript
handleSubmitReply(parentId: string)
```
- Validates user login
- Creates nested reply
- Adds to parent comment's replies
- Closes reply form

### 4. **formatTimeAgo**
```typescript
formatTimeAgo(date: string)
```
- Converts ISO date to Hausa relative time
- Returns: "5 minti da suka wuce", "2 awa da suka wuce", etc.

## UI Components

### Section Header
```tsx
<h2>Sharhi ({totalCommentCount})</h2>
<p>Raba ra'ayinka game da wannan labari</p>
```

### Login Prompt Modal
```tsx
{showLoginPrompt && (
  <div className="fixed inset-0 bg-black/50">
    {/* Modal content */}
  </div>
)}
```

### Comment Form (Logged In)
```tsx
<form onSubmit={handleSubmitComment}>
  <textarea placeholder="Rubuta sharhinka..." />
  <button>Aika Sharhi</button>
</form>
```

### Comment Form (Not Logged In)
```tsx
<div className="bg-blue-50 border border-blue-200">
  <p>Ka shiga don yin sharhi</p>
  <a href="/login">Shiga Yanzu</a>
</div>
```

### Comment Item
```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg">
  {/* Author info */}
  {/* Comment content */}
  {/* Vote buttons */}
  {/* Reply button */}
  {/* Reply form (if active) */}
  {/* Nested replies */}
</div>
```

## Mock Data

### Sample Comments
```typescript
{
  id: '1',
  author: {
    name: 'Ali Usman',
    email: 'ali@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali'
  },
  content: 'Labari mai ban sha\'awa sosai!',
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  upvotes: 12,
  downvotes: 2,
  replies: [...]
}
```

## Appwrite Integration (TODO)

### Required Collections

#### 1. **Comments Collection**
```
Database: production
Collection: comments
```

**Fields:**
- `articleId` (string) - Reference to article
- `authorId` (string) - User ID
- `authorName` (string) - User display name
- `authorAvatar` (string, optional) - Avatar URL
- `content` (text) - Comment text
- `upvotes` (integer, default: 0)
- `downvotes` (integer, default: 0)
- `parentId` (string, optional) - For replies
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Indexes:**
- `articleId` (ascending)
- `parentId` (ascending)
- `createdAt` (descending)

**Permissions:**
- Read: Role:all
- Create: Role:users
- Update: Document owner
- Delete: Document owner

#### 2. **Comment Votes Collection**
```
Database: production
Collection: comment_votes
```

**Fields:**
- `commentId` (string) - Reference to comment
- `userId` (string) - User who voted
- `voteType` (string) - "up" or "down"
- `createdAt` (datetime)

**Indexes:**
- `commentId` (ascending)
- `userId` (ascending)
- Unique: `commentId` + `userId`

**Permissions:**
- Read: Role:all
- Create: Role:users
- Update: Document owner
- Delete: Document owner

### Implementation Functions

#### Load Comments
```typescript
const loadComments = async (articleId: string) => {
  const { documents } = await databases.listDocuments(
    'production',
    'comments',
    [
      Query.equal('articleId', articleId),
      Query.isNull('parentId'), // Top-level comments only
      Query.orderDesc('createdAt'),
      Query.limit(50)
    ]
  );

  // Load replies for each comment
  for (const comment of documents) {
    const { documents: replies } = await databases.listDocuments(
      'production',
      'comments',
      [
        Query.equal('parentId', comment.$id),
        Query.orderAsc('createdAt')
      ]
    );
    comment.replies = replies;
  }

  return documents;
};
```

#### Create Comment
```typescript
const createComment = async (articleId: string, content: string) => {
  const user = await account.get();
  
  const comment = await databases.createDocument(
    'production',
    'comments',
    ID.unique(),
    {
      articleId,
      authorId: user.$id,
      authorName: user.name,
      authorAvatar: user.prefs?.avatar,
      content,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  return comment;
};
```

#### Create Reply
```typescript
const createReply = async (parentId: string, articleId: string, content: string) => {
  const user = await account.get();
  
  const reply = await databases.createDocument(
    'production',
    'comments',
    ID.unique(),
    {
      articleId,
      parentId,
      authorId: user.$id,
      authorName: user.name,
      authorAvatar: user.prefs?.avatar,
      content,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  return reply;
};
```

#### Vote on Comment
```typescript
const voteComment = async (commentId: string, voteType: 'up' | 'down') => {
  const user = await account.get();
  
  try {
    // Check for existing vote
    const { documents } = await databases.listDocuments(
      'production',
      'comment_votes',
      [
        Query.equal('commentId', commentId),
        Query.equal('userId', user.$id)
      ]
    );

    if (documents.length > 0) {
      const existingVote = documents[0];
      
      if (existingVote.voteType === voteType) {
        // Remove vote
        await databases.deleteDocument(
          'production',
          'comment_votes',
          existingVote.$id
        );
        
        // Update comment count
        const comment = await databases.getDocument('production', 'comments', commentId);
        await databases.updateDocument(
          'production',
          'comments',
          commentId,
          {
            [voteType === 'up' ? 'upvotes' : 'downvotes']: 
              comment[voteType === 'up' ? 'upvotes' : 'downvotes'] - 1
          }
        );
      } else {
        // Change vote
        await databases.updateDocument(
          'production',
          'comment_votes',
          existingVote.$id,
          { voteType }
        );
        
        // Update comment counts
        const comment = await databases.getDocument('production', 'comments', commentId);
        const oldType = existingVote.voteType;
        await databases.updateDocument(
          'production',
          'comments',
          commentId,
          {
            [oldType === 'up' ? 'upvotes' : 'downvotes']: 
              comment[oldType === 'up' ? 'upvotes' : 'downvotes'] - 1,
            [voteType === 'up' ? 'upvotes' : 'downvotes']: 
              comment[voteType === 'up' ? 'upvotes' : 'downvotes'] + 1
          }
        );
      }
    } else {
      // New vote
      await databases.createDocument(
        'production',
        'comment_votes',
        ID.unique(),
        {
          commentId,
          userId: user.$id,
          voteType,
          createdAt: new Date().toISOString()
        }
      );
      
      // Update comment count
      const comment = await databases.getDocument('production', 'comments', commentId);
      await databases.updateDocument(
        'production',
        'comments',
        commentId,
        {
          [voteType === 'up' ? 'upvotes' : 'downvotes']: 
            comment[voteType === 'up' ? 'upvotes' : 'downvotes'] + 1
        }
      );
    }
  } catch (error) {
    console.error('Error voting:', error);
    throw error;
  }
};
```

#### Check User Vote
```typescript
const getUserVote = async (commentId: string) => {
  try {
    const user = await account.get();
    const { documents } = await databases.listDocuments(
      'production',
      'comment_votes',
      [
        Query.equal('commentId', commentId),
        Query.equal('userId', user.$id)
      ]
    );

    return documents[0]?.voteType || null;
  } catch {
    return null;
  }
};
```

## Styling Classes

### Comment Container
```css
.comment-item {
  @apply bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700;
}
```

### Vote Button (Active)
```css
.vote-active-up {
  @apply bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400;
}

.vote-active-down {
  @apply bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400;
}
```

### Reply Indent
```css
.reply-indent {
  @apply ml-8 md:ml-12;
}
```

## Hausa Translations

| English | Hausa |
|---------|-------|
| Comments | Sharhi |
| Reply | Amsa |
| Upvote | Amincewarr |
| Downvote | Rashin Amincewa |
| Post Comment | Aika Sharhi |
| Write your comment | Rubuta sharhinka |
| Write your reply | Rubuta amsarka |
| minutes ago | minti da suka wuce |
| hours ago | awa da suka wuce |
| days ago | kwana da suka wuce |
| Login Required | Ana Buƙatar Shiga |
| Login to comment | Ka shiga don yin sharhi |
| Login Now | Shiga Yanzu |
| Cancel | Soke |
| Send | Aika |
| No comments yet | Babu sharhi tukuna |
| Be the first | Ka zama na farko |
| Share your thoughts | Raba ra'ayinka |

## Testing Checklist

### UI Testing
- [ ] Comment form appears for logged-in users
- [ ] Login prompt shows for non-logged users
- [ ] Comments display with correct author info
- [ ] Vote buttons work and update counts
- [ ] Vote highlighting (green for up, red for down)
- [ ] Reply form toggles correctly
- [ ] Nested replies display with indent
- [ ] Time ago format is correct
- [ ] Empty state shows when no comments
- [ ] Comment count updates correctly
- [ ] Dark mode styling works
- [ ] Mobile responsive layout

### Functionality Testing
- [ ] Submit new comment
- [ ] Submit reply to comment
- [ ] Upvote comment
- [ ] Downvote comment
- [ ] Remove vote (click same vote)
- [ ] Change vote (up to down, down to up)
- [ ] Cancel reply form
- [ ] Login modal opens for non-logged users
- [ ] Login redirect works
- [ ] Comment count includes replies

## Future Enhancements

### Phase 1 (Essential)
- [ ] Edit own comments
- [ ] Delete own comments
- [ ] Report inappropriate comments
- [ ] Pagination for comments
- [ ] Load more replies

### Phase 2 (Nice to Have)
- [ ] Sort comments (newest, oldest, most voted)
- [ ] Rich text formatting in comments
- [ ] Mention users (@username)
- [ ] Email notifications for replies
- [ ] Comment search

### Phase 3 (Advanced)
- [ ] Nested reply threads (multi-level)
- [ ] Emoji reactions
- [ ] Comment reactions (👍 ❤️ 😂)
- [ ] Pin important comments
- [ ] Comment moderation dashboard
- [ ] Spam detection
- [ ] User reputation system

## Support

For issues or questions about the comment system:
1. Check this documentation
2. Review mock data structure
3. Test with demo accounts
4. Implement Appwrite integration

## Demo Accounts

**Logged Out**: See login prompt
**Logged In** (Future): Use unified login at `/login`
- Admin: admin@technologiya.com / admin123
- Author: musa@technologiya.com / author123
