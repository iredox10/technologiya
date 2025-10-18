export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: Category;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  views?: number;
  status?: 'draft' | 'published';
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
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
