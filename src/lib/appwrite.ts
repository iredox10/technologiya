import { Client, Account, Databases, Storage, Query, ID } from 'appwrite';

// Helper function to safely get environment variables in both Vite and Node environments
const getEnv = (key: string, defaultValue: string = ''): string => {
  // Check import.meta.env (Vite/Astro)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // Check process.env (Node/Bun)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  return defaultValue;
};

// Appwrite Configuration
const endpoint = getEnv('PUBLIC_APPWRITE_ENDPOINT', 'https://cloud.appwrite.io/v1');
console.log('[Appwrite Config] Endpoint:', endpoint);

export const APPWRITE_CONFIG = {
  endpoint,
  projectId: getEnv('PUBLIC_APPWRITE_PROJECT_ID'),
  databaseId: getEnv('PUBLIC_APPWRITE_DATABASE_ID'),
  
  // Collection IDs
  collections: {
    articles: getEnv('PUBLIC_APPWRITE_COLLECTION_ARTICLES'),
    categories: getEnv('PUBLIC_APPWRITE_COLLECTION_CATEGORIES'),
    authors: getEnv('PUBLIC_APPWRITE_COLLECTION_AUTHORS'),
    comments: getEnv('PUBLIC_APPWRITE_COLLECTION_COMMENTS'),
    users: getEnv('PUBLIC_APPWRITE_COLLECTION_USERS'),
    settings: getEnv('PUBLIC_APPWRITE_COLLECTION_SETTINGS'),
  },
  
  // Storage Bucket IDs
  buckets: {
    articleImages: getEnv('PUBLIC_APPWRITE_BUCKET_ARTICLE_IMAGES'),
    authorAvatars: getEnv('PUBLIC_APPWRITE_BUCKET_AUTHOR_AVATARS'),
  },
};

// Create Appwrite Client
export const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

// Initialize Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export Query and ID utilities
export { Query, ID };

// Type definitions for our data models
export interface Article {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  views: number;
  featured: boolean;
}

export interface Category {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon?: string;
  articleCount: number;
}

export interface Author {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  role: 'admin' | 'author';
  status: 'active' | 'inactive';
  articleCount: number;
}

export interface Comment {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  status: 'approved' | 'pending' | 'rejected';
}

export interface User {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'author' | 'admin';
  bio?: string;
}
