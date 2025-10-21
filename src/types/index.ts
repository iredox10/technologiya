// Appwrite document base interface
export interface AppwriteDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
}

export interface Article extends AppwriteDocument {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: string;
  authorId: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  views: number;
  featured: boolean;
}

export interface Author extends AppwriteDocument {
  userId: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: 'admin' | 'author';
  status: 'active' | 'inactive';
  articleCount?: number;
}

export interface Category extends AppwriteDocument {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  articleCount?: number;
}

export interface Comment extends AppwriteDocument {
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  status: 'approved' | 'pending' | 'rejected';
}

export interface User extends AppwriteDocument {
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'author' | 'admin';
  bio?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Wayoyi',
    slug: 'wayoyi',
    description: 'Labarai game da sabbin wayoyi da na\'urorin hannu'
  },
  {
    id: '2',
    name: 'Manhajoji',
    slug: 'manhajoji',
    description: 'Sabbin manhajoji da yadda ake amfani da su'
  },
  {
    id: '3',
    name: 'Bita',
    slug: 'bita',
    description: 'Bita mai zurfi na na\'urorin fasaha'
  },
  {
    id: '4',
    name: 'Dabaru',
    slug: 'dabaru',
    description: 'Dabaru da shawarwari na amfani da fasaha'
  },
  {
    id: '5',
    name: 'Koyarwa',
    slug: 'koyarwa',
    description: 'Koyarwar yadda ake yin abubuwa'
  }
];
