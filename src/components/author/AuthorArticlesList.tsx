import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus, FiLoader, FiX } from 'react-icons/fi';
import { articleService, authService, authorService } from '../../lib/appwriteServices';
import type { Article as AppwriteArticle } from '../../types';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    published: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    draft: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  };
  return (
    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-600'}`}>
      {status === 'published' ? 'An buga' : 'Daftari'}
    </span>
  );
};

export default function AuthorArticlesList() {
  const [loading, setLoading] = useState(true);
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
      const userResult = await authService.getCurrentUser();
      if (!userResult.success || !userResult.data) {
        window.location.href = '/author/login';
        return;
      }

      const authorResult = await authorService.getAuthorByUserId(userResult.data.$id);
      if (authorResult.success && authorResult.data) {
        const articlesResult = await articleService.getArticlesByAuthor(authorResult.data.$id, 1, 1000);
        if (articlesResult.success && articlesResult.data) {
          setArticles(articlesResult.data.documents as unknown as AppwriteArticle[]);
        }
      }
    } catch (error) {
      console.error('Error loading articles:', error);
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
    setIsDeleting(true);
    try {
      const result = await articleService.deleteArticle(articleToDelete.$id!);
      if (result.success) {
        showSuccessToast('An share labarin!');
        setIsDeleteModalOpen(false);
        loadArticles();
      }
    } catch (error) {
      showErrorToast('Error deleting article');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Labaran Na</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sarrafa dukkan labaran da ka rubuta</p>
        </div>
        <a href="/author/articles/new" className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 active:scale-95 space-x-2">
          <FiPlus />
          <span>Sabon Labari</span>
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Nemo labari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-2">
          {['all', 'published', 'draft'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                statusFilter === f ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {f === 'all' ? 'Duka' : f === 'published' ? 'Buga' : 'Daftari'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr className="text-left text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Taken</th>
                <th className="px-6 py-4">Matsayi</th>
                <th className="px-6 py-4 text-center">Kallo</th>
                <th className="px-6 py-4 text-right">Ayyuka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredArticles.map((article) => (
                <tr key={article.$id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{article.title}</td>
                  <td className="px-6 py-4"><StatusBadge status={article.status} /></td>
                  <td className="px-6 py-4 text-center font-mono text-sm">{article.views || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={`/author/articles/edit/${article.$id}`} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"><FiEdit2 /></a>
                      <button onClick={() => handleDeleteClick(article)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-700">
          {filteredArticles.map((article) => (
            <div key={article.$id} className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{article.title}</h3>
                <StatusBadge status={article.status} />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500"><FiEye /> {article.views || 0} views</div>
                <div className="flex gap-2">
                  <a href={`/author/articles/edit/${article.$id}`} className="p-2 text-green-600 border border-green-100 dark:border-green-900/30 rounded-lg"><FiEdit2 /></a>
                  <button onClick={() => handleDeleteClick(article)} className="p-2 text-red-600 border border-red-100 dark:border-red-900/30 rounded-lg"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="p-12 text-center text-gray-500">Babu labari a wannan rukunin</div>
        )}
      </div>

      {/* Modal */}
      {isMounted && isDeleteModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Goge Labari</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Shin kana tabbatar kana son share wannan labarin? Ba za a iya dawo da shi ba.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">Soke</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest bg-red-600 text-white rounded-xl shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50">
                {isDeleting ? 'Ana sharewa...' : 'E, Share'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
