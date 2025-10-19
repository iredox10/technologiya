import { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

interface Article {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published';
  views: number;
  publishedAt: string;
}

export default function AuthorArticlesList() {
  // Mock articles for current author - will be replaced with Appwrite query
  const [articles] = useState<Article[]>([
    {
      id: '1',
      title: 'Yadda AI ke Canza Rayuwarmu',
      category: 'AI & Machine Learning',
      status: 'published',
      views: 2847,
      publishedAt: '2025-10-15',
    },
    {
      id: '2',
      title: 'Wayoyin Dijital a Najeriya',
      category: 'Wayoyi',
      status: 'published',
      views: 1923,
      publishedAt: '2025-10-12',
    },
    {
      id: '3',
      title: 'Tsarin Sadarwa ta 5G',
      category: 'Hanyoyin Sadarwa',
      status: 'draft',
      views: 0,
      publishedAt: '2025-10-10',
    },
    {
      id: '4',
      title: 'Kimiyyar Kwamfuta da Manhajoji',
      category: 'Manhajoji',
      status: 'published',
      views: 3421,
      publishedAt: '2025-10-08',
    },
    {
      id: '5',
      title: 'Amfani da Python don Nazarin Bayanai',
      category: 'Manhajoji',
      status: 'published',
      views: 2156,
      publishedAt: '2025-10-05',
    },
    {
      id: '6',
      title: 'Gidan Yanar Gizo mai Sauri',
      category: 'Hanyoyin Sadarwa',
      status: 'draft',
      views: 0,
      publishedAt: '2025-10-03',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Kana tabbatar da share wannan labarin?')) {
      // TODO: Implement Appwrite delete
      console.log('Deleting article:', id);
      alert('An share labarin!');
    }
  };

  const stats = {
    all: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    draft: articles.filter((a) => a.status === 'draft').length,
  };

  return (
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
                  <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {article.category}
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
                        {new Date(article.publishedAt).toLocaleDateString('ha-NG')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <a
                          href={`/author/articles/edit/${article.id}`}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                          title="Gyara"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(article.id)}
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
  );
}
