# Author Field Auto-Selection Feature

## Overview
Implemented automatic author selection and field locking in the ArticleEditor component when used by authors (not admins). This ensures authors can only create/edit articles under their own name, while admins retain the ability to select any author.

## Implementation Date
October 22, 2025

## Changes Made

### 1. ArticleEditor Component (`src/components/admin/ArticleEditor.tsx`)

#### Added New Props
- `isAuthorMode?: boolean` - Flag to indicate if the editor is being used by an author

#### Added New State Variables
- `currentAuthorId: string` - Stores the logged-in author's ID
- `currentAuthorName: string` - Stores the logged-in author's name for display

#### Auto-Selection Logic
When `isAuthorMode={true}`:
1. On component mount, fetches the current logged-in user via `authService.getCurrentUser()`
2. Finds the corresponding author record by matching `userId` field
3. Auto-populates `formData.authorId` with the author's ID
4. Stores the author's name for display purposes

#### Conditional Rendering
The author field now renders differently based on mode:

**Author Mode** (isAuthorMode=true):
```jsx
<div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-400">
  {currentAuthorName || 'Ana ɗaukar...'}
</div>
```
- Shows author name as read-only text
- Disabled styling (gray background)
- No dropdown interaction

**Admin Mode** (isAuthorMode=false or undefined):
```jsx
<select value={formData.authorId} onChange={...}>
  <option value="">Zaɓi marubucin...</option>
  {authors.map(author => ...)}
</select>
```
- Shows full dropdown of all authors
- Fully editable
- Standard admin functionality

### 2. Author New Article Page (`src/pages/author/articles/new.astro`)

**Before:**
```astro
<ArticleEditor client:load />
```

**After:**
```astro
<ArticleEditor isAuthorMode={true} client:load />
```

### 3. Author Edit Article Page (`src/pages/author/articles/edit/[id].astro`)

**Before:**
```astro
<ArticleEditor articleId={id} isEditing={true} client:load />
```

**After:**
```astro
<ArticleEditor articleId={id} isEditing={true} isAuthorMode={true} client:load />
```

## Technical Details

### Author Detection Flow
1. Component checks `isAuthorMode` prop
2. If true, calls `authService.getCurrentUser()` which returns:
   ```typescript
   { success: boolean, data: User }
   ```
3. Extracts `user.$id` from the response
4. Searches `authors` array for matching `userId` field
5. Sets `currentAuthorId`, `currentAuthorName`, and `formData.authorId`

### Admin Pages (Unchanged)
The admin article pages still use the editor without the `isAuthorMode` prop:
- `/src/pages/admin/articles/new.astro` - No change needed
- `/src/pages/admin/articles/edit/[id].astro` - No change needed

This maintains full dropdown functionality for admin users.

## User Experience

### For Authors
- **Creating New Article**: Author field is automatically filled with their name (read-only)
- **Editing Article**: Author field shows the article's author (read-only if it's their article)
- **Visual Feedback**: Grayed-out field clearly indicates it cannot be changed
- **Hausa Text**: "Ana ɗaukar..." (Loading...) shown while fetching author info

### For Admins
- **No Change**: Full dropdown remains available
- **Can Select Any Author**: Maintains administrative flexibility
- **Same UI**: No visual changes to admin interface

## Security Considerations

1. **Client-Side Prevention**: The disabled field prevents UI-level changes
2. **Server-Side Validation**: Backend should verify author permissions before saving
3. **Role-Based Access**: Relies on proper authentication and role assignment

## Testing Checklist

- [ ] Author can create new article with auto-selected name
- [ ] Author field is disabled (not editable) in author mode
- [ ] Author name displays correctly in author mode
- [ ] Admin still sees full dropdown in admin panel
- [ ] Admin can select any author in admin panel
- [ ] Editing existing article preserves author in author mode
- [ ] Error handling works if author detection fails

## Hausa Language Support

The feature maintains full Hausa language support:
- Error messages use Hausa text
- Loading state shows "Ana ɗaukar..." (Loading...)
- Field label remains "Marubucin *" (Author *)

## Future Enhancements

1. Add backend validation to ensure authors can only modify their own articles
2. Add permission checks before allowing article edits
3. Consider hiding the author field entirely in author mode (currently shows as disabled)
4. Add audit logging when author field is locked/unlocked

## Related Files

- `/src/components/admin/ArticleEditor.tsx` - Main component
- `/src/pages/author/articles/new.astro` - Author new article page
- `/src/pages/author/articles/edit/[id].astro` - Author edit article page
- `/src/lib/appwriteServices.ts` - Contains authService
- `/src/types/index.ts` - Author interface definition
