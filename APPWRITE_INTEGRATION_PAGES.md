# Appwrite Integration for Home and Article Pages

## Overview
Integrated Appwrite backend services to fetch real data for the home page and article detail pages, replacing mock data with live database queries.

## Implementation Date
October 22, 2025

## Changes Made

### 1. Home Page (`src/pages/index.astro`)

#### Data Fetching
- **Articles**: Fetched from `articleService.getArticles()`
  - Filtered to show only `status === 'published'` articles
  - Featured articles: First 3 articles with `featured === true`
  - Latest articles: 6 most recent articles sorted by `$createdAt`

- **Categories**: Fetched from `categoryService.getCategories()`
  - Displays first 5 categories dynamically
  - Shows category icon (with fallback to 📁)
  - Displays article count per category

#### Data Enrichment
Created `enrichArticle()` function to add nested category and author data:
```typescript
async function enrichArticle(article: Article) {
  const [categoryResult, authorResult] = await Promise.all([
    categoryService.getCategory(article.categoryId),
    authorService.getAuthor(article.authorId)
  ]);
  
  return {
    ...article,
    category: categoryResult.data || { name: 'Uncategorized', slug: 'uncategorized' },
    author: authorResult.data || { name: 'Unknown', avatar: '' },
  };
}
```

**Why Enrichment?**
- ArticleCard component expects `article.category.name` and `article.author.name`
- Appwrite Article type only stores `categoryId` and `authorId`
- Enrichment adds full category and author objects for rendering

#### Features
- ✅ Dynamic featured articles section
- ✅ Latest articles grid
- ✅ Dynamic category quick links with article counts
- ✅ Real-time data from Appwrite database
- ✅ Graceful fallbacks for missing data

### 2. Article Detail Page (`src/pages/articles/[slug].astro`)

#### Static Path Generation
Updated `getStaticPaths()` to fetch all articles from Appwrite:
```typescript
export async function getStaticPaths() {
  const articlesResult = await articleService.getArticles();
  const articles = articlesResult.data.documents as unknown as Article[];
  
  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { articleId: article.$id },
  }));
}
```

#### Data Fetching
- **Article**: Fetched by ID using `articleService.getArticle(articleId)`
- **Category**: Fetched using `categoryService.getCategory(article.categoryId)`
- **Author**: Fetched using `authorService.getAuthor(article.authorId)`
- **Related Articles**: Filtered by same `categoryId`, excluding current article

#### Related Articles Logic
```typescript
const rawRelatedArticles = allArticles
  .filter(a => 
    a.categoryId === article.categoryId && 
    a.$id !== article.$id &&
    a.status === 'published'
  )
  .slice(0, 3);

// Enrich each related article with category and author data
enrichedRelatedArticles = await Promise.all(
  rawRelatedArticles.map(enrichArticle)
);
```

#### Replaced References
Changed all mock data references to use fetched data:

| Old (Mock Data) | New (Appwrite) |
|----------------|----------------|
| `article.category.name` | `category.name` |
| `article.category.slug` | `category.slug` |
| `article.author.name` | `author.name` |
| `article.author.avatar` | `author.avatar` |
| `article.author.bio` | `author.bio` |
| `article.id` | `article.$id` |
| `article.publishedAt` | `article.publishedAt \|\| article.$createdAt` |

#### Features
- ✅ Dynamic article content from database
- ✅ Real category and author information
- ✅ Related articles based on category
- ✅ Proper date handling (publishedAt or createdAt)
- ✅ 404 redirect if article not found
- ✅ Share functionality with real URLs

### 3. Removed Dependencies

#### Before
```typescript
import { mockArticles, getFeaturedArticles, getArticleBySlug } from '../data/mockData';
```

#### After
```typescript
import { articleService, categoryService, authorService } from '../lib/appwriteServices';
import type { Article, Category, Author } from '../types';
```

## Data Flow

### Home Page
```
1. Fetch all articles from Appwrite
2. Filter published articles
3. Separate featured and latest
4. Enrich with category/author data
5. Fetch categories
6. Render components
```

### Article Page
```
1. Generate static paths from all articles
2. Fetch specific article by ID
3. Fetch category data
4. Fetch author data
5. Fetch related articles (same category)
6. Enrich related articles
7. Render article with all data
```

## Performance Considerations

### Optimization Strategies
1. **Parallel Fetching**: Used `Promise.all()` for concurrent requests
   ```typescript
   const [categoryResult, authorResult] = await Promise.all([...]);
   ```

2. **Static Generation**: Articles pre-rendered at build time
   ```typescript
   export async function getStaticPaths() { ... }
   ```

3. **Filtered Queries**: Only fetch published articles
   ```typescript
   .filter(article => article.status === 'published')
   ```

4. **Pagination Ready**: Slice results for manageable sets
   ```typescript
   .slice(0, 6) // Latest 6 articles
   .slice(0, 3) // Top 3 related
   ```

### Potential Improvements
- Add caching for category/author data
- Implement pagination for article lists
- Add loading states for client-side fetches
- Consider incremental static regeneration (ISR)

## Error Handling

### Graceful Degradation
```typescript
// Category fallback
const category = categoryResult.success && categoryResult.data 
  ? categoryResult.data 
  : { name: 'Uncategorized', slug: 'uncategorized' };

// Author fallback
const author = authorResult.success && authorResult.data
  ? authorResult.data
  : { name: 'Unknown Author', bio: '', avatar: '' };

// 404 redirect for missing articles
if (!articleResult.success || !articleResult.data) {
  return Astro.redirect('/404');
}
```

## Testing Checklist

### Home Page
- [ ] Featured articles display correctly
- [ ] Latest articles show in correct order
- [ ] Categories render dynamically with icons
- [ ] Article counts display per category
- [ ] Empty states handled gracefully
- [ ] All links navigate correctly

### Article Detail Page
- [ ] Article content renders properly
- [ ] Category badge displays correct category
- [ ] Author information shows correctly
- [ ] Author bio appears when available
- [ ] Related articles show (same category)
- [ ] Share buttons have correct URLs
- [ ] 404 redirect works for invalid slugs
- [ ] Comments section loads with correct articleId
- [ ] Text-to-speech uses correct articleId

## Database Requirements

### Collections Needed
1. **Articles Collection**
   - Fields: title, slug, excerpt, content, coverImage, categoryId, authorId, tags, status, featured, publishedAt

2. **Categories Collection**
   - Fields: name, slug, description, color, icon, articleCount

3. **Authors Collection**
   - Fields: userId, name, email, bio, avatar, role, status

### Indexes Recommended
- Articles: `status` (for filtering published)
- Articles: `categoryId` (for related articles)
- Articles: `featured` (for featured section)
- Articles: `$createdAt` (for sorting latest)

## Environment Variables

Required in `.env`:
```env
PUBLIC_APPWRITE_ENDPOINT=your-endpoint
PUBLIC_APPWRITE_PROJECT_ID=your-project-id
PUBLIC_APPWRITE_DATABASE_ID=your-database-id
PUBLIC_APPWRITE_COLLECTION_ARTICLES=your-articles-collection-id
PUBLIC_APPWRITE_COLLECTION_CATEGORIES=your-categories-collection-id
PUBLIC_APPWRITE_COLLECTION_AUTHORS=your-authors-collection-id
```

## Migration Notes

### From Mock to Real Data
1. ✅ Removed `mockData.ts` imports
2. ✅ Added Appwrite service imports
3. ✅ Implemented data enrichment for nested objects
4. ✅ Updated all property accesses (`.id` → `.$id`)
5. ✅ Added error handling and fallbacks
6. ✅ Maintained Hausa language support

### Breaking Changes
- None for end users
- Developers must have Appwrite configured
- Build requires database connection

## Future Enhancements

1. **Search Integration**: Add full-text search with Appwrite
2. **Pagination**: Implement infinite scroll or page numbers
3. **Caching**: Add client-side caching for categories/authors
4. **Real-time**: Use Appwrite subscriptions for live updates
5. **Analytics**: Track article views in database
6. **Bookmarks**: Allow users to save favorite articles

## Related Files

- `/src/pages/index.astro` - Home page
- `/src/pages/articles/[slug].astro` - Article detail page
- `/src/components/ArticleCard.tsx` - Article card component
- `/src/lib/appwriteServices.ts` - Appwrite API services
- `/src/types/index.ts` - TypeScript type definitions
