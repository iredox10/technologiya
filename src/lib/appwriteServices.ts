import { account, databases, storage, APPWRITE_CONFIG, Query, ID } from './appwrite';
import type { Article, Category, Author, Comment, User } from './appwrite';

const isAppwriteConfigured = () => {
  return APPWRITE_CONFIG.projectId && APPWRITE_CONFIG.projectId !== 'your_project_id_here';
};

// ============================================
// AUTHENTICATION SERVICE
// ============================================

export class AuthService {
  // Login with email and password
  async login(email: string, password: string) {
    try {
      // Debug logging
      console.log('🔐 Login attempt:', {
        email: email,
        emailLength: email.length,
        passwordLength: password.length,
        hasEmail: !!email,
        hasPassword: !!password,
        endpoint: APPWRITE_CONFIG.endpoint,
        projectId: APPWRITE_CONFIG.projectId
      });

      const session = await account.createEmailPasswordSession(email, password);
      
      console.log('✅ Login successful! Session:', session);
      return { success: true, data: session };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        type: error.type,
        response: error.response
      });
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

  // OAuth Login
  async loginWithOAuth(provider: 'google' | 'facebook' | 'twitter') {
    try {
      // Get the current URL for redirect
      const successUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:4321/';
      const failureUrl = typeof window !== 'undefined' ? `${window.location.origin}/user-login?error=oauth` : 'http://localhost:4321/user-login?error=oauth';

      // Create OAuth2 session
      await account.createOAuth2Session(
        provider as any,
        successUrl,
        failureUrl
      );

      return { success: true };
    } catch (error: any) {
      console.error('OAuth login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user preferences
  async updatePreferences(prefs: Record<string, any>) {
    try {
      const result = await account.updatePrefs(prefs);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Update preferences error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user name
  async updateName(name: string) {
    try {
      const result = await account.updateName(name);
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Update name error:', error);
      return { success: false, error: error.message };
    }
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
    if (!isAppwriteConfigured()) {
      console.warn('Appwrite not configured. Returning empty articles list.');
      return { success: true, data: { documents: [], total: 0 } };
    }

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

// Simple in-memory cache
const memoryCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper to get from cache
function getFromCache(key: string) {
  const cached = memoryCache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

// Helper to set cache
function setCache(key: string, data: any) {
  memoryCache[key] = { data, timestamp: Date.now() };
}

// ============================================
// CATEGORY SERVICE
// ============================================

export class CategoryService {
  private collectionId = APPWRITE_CONFIG.collections.categories;
  private databaseId = APPWRITE_CONFIG.databaseId;

  async getCategories() {
    if (!isAppwriteConfigured()) {
      console.warn('Appwrite not configured. Returning empty categories list.');
      return { success: true, data: { documents: [], total: 0 } };
    }

    const cacheKey = 'all_categories';
    const cached = getFromCache(cacheKey);
    if (cached) return { success: true, data: cached };

    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.orderAsc('name')]
      );
      setCache(cacheKey, response);
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get categories error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCategory(categoryId: string) {
    const cacheKey = `category_${categoryId}`;
    const cached = getFromCache(cacheKey);
    if (cached) return { success: true, data: cached };

    try {
      const category = await databases.getDocument(
        this.databaseId,
        this.collectionId,
        categoryId
      );
      setCache(cacheKey, category);
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
    const cacheKey = 'all_authors';
    const cached = getFromCache(cacheKey);
    if (cached) return { success: true, data: cached };

    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.orderAsc('name')]
      );
      setCache(cacheKey, response);
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get authors error:', error);
      return { success: false, error: error.message };
    }
  }

  async getAuthor(authorId: string) {
    const cacheKey = `author_${authorId}`;
    const cached = getFromCache(cacheKey);
    if (cached) return { success: true, data: cached };

    try {
      const author = await databases.getDocument(
        this.databaseId,
        this.collectionId,
        authorId
      );
      setCache(cacheKey, author);
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

// ============================================
// SETTINGS SERVICE
// ============================================

export class SettingsService {
  // Get all settings
  async getAllSettings() {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.settings
      );
      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Get settings error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get settings by category
  async getSettingsByCategory(category: string) {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.settings,
        [Query.equal('category', category)]
      );
      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Get settings by category error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get setting by key
  async getSettingByKey(settingKey: string) {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.settings,
        [Query.equal('settingKey', settingKey)]
      );
      if (response.documents.length > 0) {
        return { success: true, data: response.documents[0] };
      }
      return { success: false, error: 'Setting not found' };
    } catch (error: any) {
      console.error('Get setting by key error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create or update setting
  async upsertSetting(settingKey: string, settingValue: string, category: string) {
    try {
      // Check if setting exists
      const existing = await this.getSettingByKey(settingKey);
      
      if (existing.success && existing.data) {
        // Update existing
        const updated = await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.settings,
          existing.data.$id,
          { settingKey, settingValue, category }
        );
        return { success: true, data: updated };
      } else {
        // Create new
        const created = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.settings,
          ID.unique(),
          { settingKey, settingValue, category }
        );
        return { success: true, data: created };
      }
    } catch (error: any) {
      console.error('Upsert setting error:', error);
      return { success: false, error: error.message };
    }
  }

  // Batch update settings
  async batchUpdateSettings(settings: { settingKey: string; settingValue: string; category: string }[]) {
    try {
      const promises = settings.map(setting => 
        this.upsertSetting(setting.settingKey, setting.settingValue, setting.category)
      );
      const results = await Promise.all(promises);
      const success = results.every(r => r.success);
      return { success, data: results };
    } catch (error: any) {
      console.error('Batch update settings error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete setting
  async deleteSetting(settingId: string) {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.settings,
        settingId
      );
      return { success: true };
    } catch (error: any) {
      console.error('Delete setting error:', error);
      return { success: false, error: error.message };
    }
  }
}

// ============================================
// COMMENT SERVICE
// ============================================

export class CommentService {
  // Get comments for an article
  async getComments(articleId: string) {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.comments,
        [
          Query.equal('articleId', articleId),
          Query.equal('status', 'approved'),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get comments error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get comment by ID
  async getComment(commentId: string) {
    try {
      const comment = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.comments,
        commentId
      );
      return { success: true, data: comment };
    } catch (error: any) {
      console.error('Get comment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create comment
  async createComment(articleId: string, userId: string, userName: string, content: string, parentId?: string, userAvatar?: string) {
    try {
      const comment = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.comments,
        ID.unique(),
        {
          articleId,
          userId,
          userName,
          userAvatar: userAvatar || '',
          content,
          parentId: parentId || '',
          upvotes: 0,
          downvotes: 0,
          status: 'approved' // Auto-approve for now, can add moderation later
        }
      );
      return { success: true, data: comment };
    } catch (error: any) {
      console.error('Create comment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update comment
  async updateComment(commentId: string, content: string) {
    try {
      const updated = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.comments,
        commentId,
        { content }
      );
      return { success: true, data: updated };
    } catch (error: any) {
      console.error('Update comment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete comment
  async deleteComment(commentId: string) {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.comments,
        commentId
      );
      return { success: true };
    } catch (error: any) {
      console.error('Delete comment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Vote on comment (upvote/downvote)
  async voteComment(commentId: string, upvotes: number, downvotes: number) {
    try {
      const updated = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.comments,
        commentId,
        { upvotes, downvotes }
      );
      return { success: true, data: updated };
    } catch (error: any) {
      console.error('Vote comment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get replies for a comment
  async getReplies(parentId: string) {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.comments,
        [
          Query.equal('parentId', parentId),
          Query.equal('status', 'approved'),
          Query.orderAsc('$createdAt')
        ]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get replies error:', error);
      return { success: false, error: error.message };
    }
  }

  // Moderate comment (approve/reject)
  async moderateComment(commentId: string, status: 'approved' | 'pending' | 'rejected') {
    try {
      const updated = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.comments,
        commentId,
        { status }
      );
      return { success: true, data: updated };
    } catch (error: any) {
      console.error('Moderate comment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get comments by user ID
  async getUserComments(userId: string, limit = 50) {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.comments,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get user comments error:', error);
      return { success: false, error: error.message };
    }
  }
}

// ============================================
// USER SERVICE
// ============================================

export class UserService {
  private databaseId = APPWRITE_CONFIG.databaseId;
  private collectionId = APPWRITE_CONFIG.collections.users;

  // Get all users with pagination
  async getUsers(page = 1, limit = 25) {
    try {
      const offset = (page - 1) * limit;
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('$createdAt')
        ]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Get users error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user by ID
  async getUser(userId: string) {
    try {
      const user = await databases.getDocument(
        this.databaseId,
        this.collectionId,
        userId
      );
      return { success: true, data: user };
    } catch (error: any) {
      console.error('Get user error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user statistics
  async getUserStats(userId: string) {
    try {
      // Get comments count
      const commentsResponse = await databases.listDocuments(
        this.databaseId,
        APPWRITE_CONFIG.collections.comments,
        [Query.equal('userId', userId)]
      );

      return {
        success: true,
        data: {
          commentsCount: commentsResponse.total || 0,
          joinedDate: commentsResponse.documents[0]?.$createdAt,
        }
      };
    } catch (error: any) {
      console.error('Get user stats error:', error);
      return { success: false, error: error.message };
    }
  }

  // Search users
  async searchUsers(searchTerm: string, page = 1, limit = 25) {
    try {
      const offset = (page - 1) * limit;
      const response = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.search('name', searchTerm),
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('$createdAt')
        ]
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Search users error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user
  async updateUser(userId: string, data: Partial<User>) {
    try {
      const updated = await databases.updateDocument(
        this.databaseId,
        this.collectionId,
        userId,
        data
      );
      return { success: true, data: updated };
    } catch (error: any) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete user
  async deleteUser(userId: string) {
    try {
      await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        userId
      );
      return { success: true };
    } catch (error: any) {
      console.error('Delete user error:', error);
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
export const commentService = new CommentService();
export const userService = new UserService();
export const settingsService = new SettingsService();
