import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';
import { articleService, authService, authorService } from '../../lib/appwriteServices';
import type { Article as AppwriteArticle } from '../../types';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

interface Article {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published';
  views: number;
  publishedAt: string;
}

export default function AuthorArticlesList() {
  const [loading, setLoading] = useState(true);
  const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);
  const [articles, setArticles] = useState<AppwriteArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<AppwriteArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);

      // Get current user
      const userResult = await authService.getCurrentUser();
      if (!userResult.success || !userResult.data) {
        showErrorToast('Please login first');
        window.location.href = '/author/login';
        return;
      }

      // Get author profile
      const authorResult = await authorService.getAuthorByUserId(userResult.data.$id);
      if (!authorResult.success || !authorResult.data) {
        showErrorToast('Author profile not found');
        return;
      }

      const author = authorResult.data;
      setCurrentAuthorId(author.$id);

      // Fetch articles by this author
      const articlesResult = await articleService.getArticlesByAuthor(author.$id, 1, 1000); // Get all articles
      
      if (articlesResult.success && articlesResult.data) {
        setArticles(articlesResult.data.documents as unknown as AppwriteArticle[]);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      showErrorToast('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (article: AppwriteArticle) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;

    try {
      setIsDeleting(true);
      const result = await articleService.deleteArticle(articleToDelete.$id!);
      
      if (result.success) {
        showSuccessToast('An share labarin!');
        setIsDeleteModalOpen(false);
        setArticleToDelete(null);
        // Reload articles
        loadArticles();
      } else {
        showErrorToast('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      showErrorToast('Error deleting article');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    all: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    draft: articles.filter((a) => a.status === 'draft').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Labaran Na
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sarrafa dukkan labaran da ka rubuta
          </p>
        </div>
        <a
          href="/author/articles/new"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Rubuta Sabon Labari</span>
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Nemo labari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Duka ({stats.all})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'published'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              An buga ({stats.published})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Daftari ({stats.draft})
            </button>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Taken
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kalma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Matsayi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kallonin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ranar
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ayyuka
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'Babu sakamakon bincike' : 'Ba ka da wani labari tukuna'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.$id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {article.categoryId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          article.status === 'published'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {article.status === 'published' ? 'An buga' : 'Daftari'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white tabular-nums">
                        <FiEye className="w-4 h-4 text-gray-400" />
                        <span>{article.views > 0 ? article.views.toLocaleString() : '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                        {article.publishedAt 
                          ? new Date(article.publishedAt).toLocaleDateString('ha-NG')
                          : new Date(article.$createdAt || '').toLocaleDateString('ha-NG')
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <a
                          href={`/author/articles/edit/${article.$id}`}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                          title="Gyara"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteClick(article)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                          title="Share"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {filteredArticles.length > 0 && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Yana nuna {filteredArticles.length} daga cikin {articles.length} labarai
        </div>
      )}
    </div>

    {/* Delete Confirmation Modal */}
    {isMounted && isDeleteModalOpen && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Tabbatar da Share
          </h3>
          
          {articleToDelete && (
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Kana tabbatar da share wannan labarin?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  {articleToDelete.title}
                </p>
                {articleToDelete.excerpt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {articleToDelete.excerpt}
                  </p>
                )}
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-4">
                ⚠️ Wannan aikin ba za a iya mayarwa ba
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={cancelDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Soke
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Ana sharewa...</span>
                </>
              ) : (
                <span>E, Share</span>
              )}
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
