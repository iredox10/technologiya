import { account, databases, storage, APPWRITE_CONFIG, Query, ID } from './appwrite';
import type { Article, Category, Author, Comment, User } from './appwrite';

// ============================================
// AUTHENTICATION SERVICE
// ============================================

export class AuthService {
  // Login with email and password
  async login(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return { success: true, data: session };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register new user
  async register(email: string, password: string, name: string) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      // Automatically login after registration
      await this.login(email, password);
      return { success: true, data: user };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current logged-in user
  async getCurrentUser() {
    try {
      const user = await account.get();
      return { success: true, data: user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Logout
  async logout() {
    try {
      await account.deleteSession('current');
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const result = await this.getCurrentUser();
    return result.success;
  }

  // Get user role from database
  async getUserRole(userId: string): Promise<'admin' | 'author' | 'user' | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.authors,
        [Query.equal('userId', userId)]
      );
      
      if (response.documents.length > 0) {
        return response.documents[0].role as 'admin' | 'author';
      }
      
      // Check in users collection
      const userResponse = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.users,
        [Query.equal('$id', userId)]
      );
      
      if (userResponse.documents.length > 0) {
        return userResponse.documents[0].role as 'user';
      }
      
      return null;
    } catch (error) {
      console.error('Get user role error:', error);
      return null;
    }
  }
}

// ============================================
// ARTICLE SERVICE
// ============================================

export class ArticleService {
  private collectionId = APPWRITE_CONFIG.collections.articles;
  private databaseId = APPWRITE_CONFIG.databaseId;

  // Get all articles with pagination
  async getArticles(page = 1, limit = 10, filters?: any[]) {
    try {
      const offset = (page - 1) * limit;
      const queries = [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc('$createdAt'),
        ...(filters || [])
      ];

      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        queries
      );

      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get articles error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get single article by ID
  async getArticle(articleId: string) {
    try {
      const article = await databases.getDocument(
        this.databaseId,
        this.collectionId,
        articleId
      );
      return { success: true, data: article };
    } catch (error: any) {
      console.error('Get article error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get article by slug
  async getArticleBySlug(slug: string) {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return { success: false, error: 'Article not found' };
      }

      return { success: true, data: response.documents[0] };
    } catch (error: any) {
      console.error('Get article by slug error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create new article
  async createArticle(article: Omit<Article, '$id' | '$createdAt' | '$updatedAt'>) {
    try {
      const newArticle = await databases.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        article
      );
      return { success: true, data: newArticle };
    } catch (error: any) {
      console.error('Create article error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update article
  async updateArticle(articleId: string, updates: Partial<Article>) {
    try {
      const updatedArticle = await databases.updateDocument(
        this.databaseId,
        this.collectionId,
        articleId,
        updates
      );
      return { success: true, data: updatedArticle };
    } catch (error: any) {
      console.error('Update article error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete article
  async deleteArticle(articleId: string) {
    try {
      await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        articleId
      );
      return { success: true };
    } catch (error: any) {
      console.error('Delete article error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get articles by author
  async getArticlesByAuthor(authorId: string, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('authorId', authorId),
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('$createdAt')
        ]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get articles by author error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get articles by category
  async getArticlesByCategory(categoryId: string, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('categoryId', categoryId),
          Query.equal('status', 'published'),
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('publishedAt')
        ]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get articles by category error:', error);
      return { success: false, error: error.message };
    }
  }

  // Search articles
  async searchArticles(searchTerm: string, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.search('title', searchTerm),
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('$createdAt')
        ]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Search articles error:', error);
      return { success: false, error: error.message };
    }
  }

  // Increment article views
  async incrementViews(articleId: string, currentViews: number) {
    try {
      await databases.updateDocument(
        this.databaseId,
        this.collectionId,
        articleId,
        { views: currentViews + 1 }
      );
      return { success: true };
    } catch (error: any) {
      console.error('Increment views error:', error);
      return { success: false, error: error.message };
    }
  }
}

// ============================================
// CATEGORY SERVICE
// ============================================

export class CategoryService {
  private collectionId = APPWRITE_CONFIG.collections.categories;
  private databaseId = APPWRITE_CONFIG.databaseId;

  async getCategories() {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.orderAsc('name')]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get categories error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCategory(categoryId: string) {
    try {
      const category = await databases.getDocument(
        this.databaseId,
        this.collectionId,
        categoryId
      );
      return { success: true, data: category };
    } catch (error: any) {
      console.error('Get category error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCategoryBySlug(slug: string) {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return { success: false, error: 'Category not found' };
      }

      return { success: true, data: response.documents[0] };
    } catch (error: any) {
      console.error('Get category by slug error:', error);
      return { success: false, error: error.message };
    }
  }

  async createCategory(category: Omit<Category, '$id' | '$createdAt' | '$updatedAt'>) {
    try {
      const newCategory = await databases.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        category
      );
      return { success: true, data: newCategory };
    } catch (error: any) {
      console.error('Create category error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateCategory(categoryId: string, updates: Partial<Category>) {
    try {
      const updatedCategory = await databases.updateDocument(
        this.databaseId,
        this.collectionId,
        categoryId,
        updates
      );
      return { success: true, data: updatedCategory };
    } catch (error: any) {
      console.error('Update category error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteCategory(categoryId: string) {
    try {
      await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        categoryId
      );
      return { success: true };
    } catch (error: any) {
      console.error('Delete category error:', error);
      return { success: false, error: error.message };
    }
  }
}

// ============================================
// AUTHOR SERVICE
// ============================================

export class AuthorService {
  private collectionId = APPWRITE_CONFIG.collections.authors;
  private databaseId = APPWRITE_CONFIG.databaseId;

  async getAuthors() {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.orderAsc('name')]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get authors error:', error);
      return { success: false, error: error.message };
    }
  }

  async getAuthor(authorId: string) {
    try {
      const author = await databases.getDocument(
        this.databaseId,
        this.collectionId,
        authorId
      );
      return { success: true, data: author };
    } catch (error: any) {
      console.error('Get author error:', error);
      return { success: false, error: error.message };
    }
  }

  async getAuthorByUserId(userId: string) {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal('userId', userId), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return { success: false, error: 'Author not found' };
      }

      return { success: true, data: response.documents[0] };
    } catch (error: any) {
      console.error('Get author by user ID error:', error);
      return { success: false, error: error.message };
    }
  }

  async createAuthor(author: Omit<Author, '$id' | '$createdAt' | '$updatedAt'>) {
    try {
      const newAuthor = await databases.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        author
      );
      return { success: true, data: newAuthor };
    } catch (error: any) {
      console.error('Create author error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateAuthor(authorId: string, updates: Partial<Author>) {
    try {
      const updatedAuthor = await databases.updateDocument(
        this.databaseId,
        this.collectionId,
        authorId,
        updates
      );
      return { success: true, data: updatedAuthor };
    } catch (error: any) {
      console.error('Update author error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteAuthor(authorId: string) {
    try {
      await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        authorId
      );
      return { success: true };
    } catch (error: any) {
      console.error('Delete author error:', error);
      return { success: false, error: error.message };
    }
  }
}

// ============================================
// STORAGE SERVICE
// ============================================

export class StorageService {
  // Upload file to storage
  async uploadFile(bucketId: string, file: File, fileId?: string) {
    try {
      const uploadedFile = await storage.createFile(
        bucketId,
        fileId || ID.unique(),
        file
      );
      return { success: true, data: uploadedFile };
    } catch (error: any) {
      console.error('Upload file error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get file preview URL
  getFilePreview(bucketId: string, fileId: string, width = 800, height = 600) {
    return storage.getFilePreview(bucketId, fileId, width, height);
  }

  // Get file view URL
  getFileView(bucketId: string, fileId: string) {
    return storage.getFileView(bucketId, fileId);
  }

  // Delete file
  async deleteFile(bucketId: string, fileId: string) {
    try {
      await storage.deleteFile(bucketId, fileId);
      return { success: true };
    } catch (error: any) {
      console.error('Delete file error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export service instances
export const authService = new AuthService();
export const articleService = new ArticleService();
export const categoryService = new CategoryService();
export const authorService = new AuthorService();
export const storageService = new StorageService();
