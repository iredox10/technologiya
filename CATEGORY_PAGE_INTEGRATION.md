# Category Page Appwrite Integration

## Overview
Integrated the category page with Appwrite backend to dynamically fetch and display articles filtered by category, replacing static mock data with real database queries.

## Implementation Date
October 22, 2025

## Changes Made

### Updated File: `src/pages/category/[slug].astro`

## Implementation Details

### 1. Static Path Generation

**Before** (Mock Data):
```typescript
export function getStaticPaths() {
  return CATEGORIES.map((category) => ({
    params: { slug: category.slug },
    props: { category },
  }));
}
```

**After** (Appwrite):
```typescript
export async function getStaticPaths() {
  const categoriesResult = await categoryService.getCategories();
  const categories = categoriesResult.data.documents as Category[];
  
  return categories.map((category) => ({
    params: { slug: category.slug },
    props: { categoryId: category.$id, categorySlug: category.slug },
  }));
}
```

### 2. Category Data Fetching

Implemented dual-mode loading for better compatibility:

**Static Build Mode**:
```typescript
if (categoryId) {
  const categoryResult = await categoryService.getCategory(categoryId);
  category = categoryResult.data as Category;
}
```

**Dev Mode** (when props not available):
```typescript
else {
  const categoriesResult = await categoryService.getCategories();
  const cats = categoriesResult.data.documents as Category[];
  category = cats.find(c => c.slug === slug);
}
```

### 3. Article Filtering by Category

```typescript
// Fetch all articles
const articlesResult = await articleService.getArticles();
const allArticles = articlesResult.data.documents as Article[];

// Filter by category and published status
const categoryArticles = allArticles.filter(a => 
  a.categoryId === category.$id && 
  a.status === 'published'
);
```

### 4. Article Enrichment

Each article is enriched with full category and author data:

```typescript
enrichedArticles = await Promise.all(
  categoryArticles.map(async (article) => {
    const [categoryResult, authorResult] = await Promise.all([
      categoryService.getCategory(article.categoryId),
      authorService.getAuthor(article.authorId)
    ]);
    
    return {
      ...article,
      category: categoryResult.data,
      author: authorResult.data,
    };
  })
);
```

### 5. Related Categories

Fetches all categories except the current one:

```typescript
const allCategoriesResult = await categoryService.getCategories();
allCategories = allCategoriesResult.data.documents
  .filter(c => c.slug !== category.slug);
```

## Features

### Category Header
- **Category Name**: Displayed from database
- **Description**: Optional description text
- **Article Count**: Dynamic count of articles in category
- **Badge**: "Rukuni" (Category) label

### Articles Grid
- **Filtered Display**: Only shows articles in the selected category
- **Published Only**: Filters out draft/archived articles
- **Enriched Data**: Full category and author information
- **Responsive Grid**: 1/2/3 columns on mobile/tablet/desktop

### Browse Other Categories
- **Dynamic List**: All categories except current
- **Icons**: Category icons displayed if available
- **Article Counts**: Shows number of articles per category
- **Interactive Cards**: Hover effects and scaling

### Empty State
- Shows when no articles in category
- Hausa message: "Babu labarai a wannan rukuni a halin yanzu."

## Data Flow

```
1. User visits /category/wayoyi
2. getStaticPaths generates routes for all categories
3. Fetch category details by ID or slug
4. Fetch all articles from database
5. Filter articles by categoryId and status='published'
6. Enrich each article with category/author data
7. Fetch other categories for recommendations
8. Render page with enriched data
```

## Performance Optimizations

### 1. Parallel Fetching
Uses `Promise.all()` for concurrent requests:
```typescript
const [categoryResult, authorResult] = await Promise.all([...]);
```

### 2. Static Generation
Pre-renders all category pages at build time for fast loading

### 3. Efficient Filtering
Filters articles in memory after single database query

### 4. Fallback Values
Provides defaults when data is missing:
```typescript
category = foundCategory || { 
  name: 'Unknown', 
  slug: slug, 
  description: '' 
};
```

## UI Components Updated

### Category Header Section
```astro
<header class="mb-12 text-center">
  <div class="inline-block px-4 py-2 bg-blue-600 text-white rounded-full">
    Rukuni
  </div>
  <h1>{category.name}</h1>
  <p>{category.description}</p>
  <div>{enrichedArticles.length} labarai</div>
</header>
```

### Articles Grid
```astro
{enrichedArticles.length > 0 ? (
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {enrichedArticles.map((article) => (
      <ArticleCard article={article} client:visible />
    ))}
  </div>
) : (
  <div class="text-center py-16">
    <p>Babu labarai a wannan rukuni a halin yanzu.</p>
  </div>
)}
```

### Related Categories
```astro
<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
  {allCategories.map((cat) => (
    <a href={`/category/${cat.slug}`}>
      {cat.icon && <div>{cat.icon}</div>}
      <h3>{cat.name}</h3>
      {cat.articleCount && <p>{cat.articleCount} labari</p>}
    </a>
  ))}
</div>
```

## Database Queries

### Fetch Categories
```typescript
categoryService.getCategories()
// Returns all categories with metadata
```

### Fetch Category by ID
```typescript
categoryService.getCategory(categoryId)
// Returns single category details
```

### Fetch Articles
```typescript
articleService.getArticles()
// Returns all articles (filtered client-side)
```

**Note**: For better performance with large datasets, consider adding server-side filtering:
```typescript
// Future enhancement
articleService.getArticlesByCategory(categoryId)
```

## Hausa Language Support

| English | Hausa |
|---------|-------|
| Category | Rukuni |
| Browse Other Categories | Duba Sauran Rukunin |
| articles | labarai |
| article | labari |
| No articles in this category yet | Babu labarai a wannan rukuni a halin yanzu |

## SEO Enhancements

### Dynamic Meta Tags
```astro
<MainLayout
  title={`${category.name} - Technologiya`}
  description={category.description || `Duk labaran ${category.name} a Technologiya`}
>
```

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Descriptive section tags
- Accessible link labels

## Error Handling

### Missing Category
```typescript
if (!categoriesResult.success || !categoriesResult.data) {
  return []; // Returns empty array, shows 404
}
```

### Missing Articles
```typescript
if (articlesResult.success && articlesResult.data) {
  // Process articles
} else {
  enrichedArticles = []; // Shows empty state
}
```

### Fallback Values
All missing data has sensible defaults to prevent crashes

## Testing Checklist

### Functionality
- [ ] Category pages load correctly
- [ ] Articles filtered by category
- [ ] Only published articles shown
- [ ] Article count displays correctly
- [ ] Empty state shows when no articles
- [ ] Related categories display
- [ ] Category icons show if available

### Data Integrity
- [ ] Category name from database
- [ ] Category description displays
- [ ] Article enrichment works
- [ ] Author data loads correctly
- [ ] Category data loads correctly

### Navigation
- [ ] Links to articles work
- [ ] Links to other categories work
- [ ] Breadcrumbs functional
- [ ] Back button works

### Responsive Design
- [ ] Mobile view (1 column)
- [ ] Tablet view (2 columns)
- [ ] Desktop view (3 columns)
- [ ] Related categories grid responsive

## Future Enhancements

1. **Server-side Filtering**: Add Appwrite query to filter by category
   ```typescript
   Query.equal('categoryId', categoryId)
   ```

2. **Pagination**: Add pagination for categories with many articles

3. **Sort Options**: Allow sorting by date, popularity, etc.

4. **Category Breadcrumbs**: Add breadcrumb navigation

5. **Category Stats**: Show view counts, engagement metrics

6. **Subcategories**: Support nested category hierarchies

7. **Featured Articles**: Highlight featured articles in category

8. **Filter by Tags**: Add tag filtering within category

9. **Search in Category**: Category-specific search

10. **RSS Feed**: Per-category RSS feeds

## Related Files

- `/src/pages/category/[slug].astro` - Category page
- `/src/lib/appwriteServices.ts` - Category and article services
- `/src/components/ArticleCard.tsx` - Article card component
- `/src/types/index.ts` - Type definitions
- `/src/pages/index.astro` - Home page (also uses categories)

## Migration Notes

### Removed Dependencies
```typescript
// Before
import { getArticlesByCategory } from '../../data/mockData';
import { CATEGORIES } from '../../types';

// After
import { articleService, categoryService, authorService } from '../../lib/appwriteServices';
import type { Article, Category, Author } from '../../types';
```

### Breaking Changes
- None for end users
- Developers must have Appwrite configured
- Categories must exist in database

## Performance Metrics

### Build Time
- Static generation for all category pages
- Pre-fetches and enriches all data
- Creates optimized HTML

### Runtime
- Instant page loads (static)
- No API calls for initial render
- Client-side hydration for interactive components

### Optimization Opportunities
1. Cache enriched articles
2. Implement incremental static regeneration (ISR)
3. Add category-specific filtering at database level
4. Lazy load related categories
