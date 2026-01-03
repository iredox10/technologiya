import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiEye, FiFilter, FiLoader, FiX } from 'react-icons/fi';
import { articleService } from '../../lib/appwriteServices';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import type { Article } from '../../types';

// Helper components for the list
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  };
  const labels = { published: 'An Buga', draft: 'Daftari', archived: 'Adanawa' };
  
  return (
    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[status as keyof typeof styles] || styles.archived}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
};

const ActionButtons = ({ articleId, onDelete }: { articleId: string, onDelete: () => void }) => (
  <div className="flex items-center gap-1">
    <a
      href={`/admin/articles/edit/${articleId}`}
      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
      title="Gyara"
    >
      <FiEdit className="w-4 h-4" />
    </a>
    <button
      onClick={onDelete}
      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      title="Share"
    >
      <FiTrash2 className="w-4 h-4" />
    </button>
  </div>
);

export default function ArticlesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setIsMounted(true);
    fetchArticles();
  }, [currentPage, filterStatus]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const result = await articleService.getArticles(currentPage, pageSize);
      
      if (result.success && result.data) {
        let fetchedArticles = result.data.documents as unknown as Article[];
        
        // Filter by status if not 'all'
        if (filterStatus !== 'all') {
          fetchedArticles = fetchedArticles.filter(
            (article) => article.status === filterStatus
          );
        }
        
        setArticles(fetchedArticles);
        setTotalPages(Math.ceil(result.data.total / pageSize));
      } else {
        console.error('Failed to fetch articles:', result.error);
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchArticles();
      return;
    }

    setIsLoading(true);
    try {
      const result = await articleService.searchArticles(searchQuery);
      
      if (result.success && result.data) {
        let searchResults = result.data.documents as unknown as Article[];
        
        // Filter by status if not 'all'
        if (filterStatus !== 'all') {
          searchResults = searchResults.filter(
            (article) => article.status === filterStatus
          );
        }
        
        setArticles(searchResults);
      } else {
        console.error('Failed to search articles:', result.error);
        setArticles([]);
      }
    } catch (error) {
      console.error('Error searching articles:', error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const article = articles.find((a) => a.$id === id);
    if (article) {
      setArticleToDelete(article);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;

    setIsDeleting(true);
    try {
      const result = await articleService.deleteArticle(articleToDelete.$id);
      
      if (result.success) {
        // Refresh the list after deletion
        fetchArticles();
        showSuccessToast('An share labarin cikin nasara!');
        setIsDeleteModalOpen(false);
        setArticleToDelete(null);
      } else {
        showErrorToast('An samu kuskure wajen share labarin: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      showErrorToast('An samu kuskure wajen share labarin');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Yanzu haka';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minti${minutes !== 1 ? 'n' : ''} da suka wuce`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} awa${hours !== 1 ? 'nni' : ''} da suka wuce`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} rana${days !== 1 ? 'ku' : ''} da suka wuce`;
    } else {
      return date.toLocaleDateString('ha-NG');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Duk Labarai
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {articles.length} labari{articles.length !== 1 ? 'n' : ''}
          </p>
        </div>
        <a
          href="/admin/articles/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Rubuta Sabon Labari</span>
        </a>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Nema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Bincika
        </button>
        <div className="flex items-center space-x-2">
          <FiFilter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Duka</option>
            <option value="published">An Buga</option>
            <option value="draft">Daftari</option>
            <option value="archived">Adanawa</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Articles Table/List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Taken</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kalma</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Yanayi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kallon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kwanan Wata</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ayyuka</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {articles.map((article) => (
                    <tr key={article.$id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{article.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{article.categoryId || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={article.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                          <FiEye className="w-4 h-4" />
                          <span>{article.views?.toLocaleString() || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(article.publishedAt || article.$createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <ActionButtons articleId={article.$id} onDelete={() => handleDelete(article.$id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {articles.map((article) => (
                <div key={article.$id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <StatusBadge status={article.status} />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <span>{article.categoryId || 'General'}</span>
                      <span className="flex items-center gap-1">
                        <FiEye className="w-3 h-3" />
                        {article.views || 0}
                      </span>
                    </div>
                    <span>{formatDate(article.publishedAt || article.$createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <ActionButtons articleId={article.$id} onDelete={() => handleDelete(article.$id)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Ba a sami labari da ya dace da binciken ba.' : 'Babu labarai a halin yanzu.'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Baya
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Shafi {currentPage} na {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Gaba
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {isMounted && isDeleteModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto bg-gray-900 bg-opacity-75"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}
          onClick={cancelDelete}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div 
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Tabbatar da Share
                  </h3>
                  <button
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <FiTrash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
                      Shin kana tabbatar da share wannan labarin?
                    </p>
                    {articleToDelete && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {articleToDelete.title}
                        </p>
                        {articleToDelete.excerpt && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {articleToDelete.excerpt}
                          </p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Ba za a iya mayar da wannan aikin ba. Wannan zai share labarin daga tsarin gudanarwa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Soke
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Ana sharewa...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      <span>Tabbatar da Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
