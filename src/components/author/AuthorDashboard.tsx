import { useState, useEffect } from 'react';
import { FiFileText, FiEye, FiTrendingUp, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { articleService, authService, authorService } from '../../lib/appwriteServices';
import type { Article as AppwriteArticle } from '../../types';
import { showErrorToast } from '../../utils/toast';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Article {
  id: string;
  title: string;
  status: 'draft' | 'published';
  views: number;
  publishedAt: string;
}

export default function AuthorDashboard() {
  const [loading, setLoading] = useState(true);
  const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState('Marubucin');
  const [authorStats, setAuthorStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    draftArticles: 0,
    publishedThisMonth: 0,
  });
  const [recentArticles, setRecentArticles] = useState<AppwriteArticle[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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
      setAuthorName(author.name);

      // Fetch all articles by this author
      const articlesResult = await articleService.getArticlesByAuthor(author.$id, 1, 1000); // Get all articles
      
      if (articlesResult.success && articlesResult.data) {
        const articles = articlesResult.data.documents as unknown as AppwriteArticle[];
        
        // Calculate stats
        const totalArticles = articles.length;
        const totalViews = articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0);
        const draftArticles = articles.filter((a: any) => a.status === 'draft').length;
        
        // Published this month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const publishedThisMonth = articles.filter((a: any) => {
          if (a.status !== 'published' || !a.publishedAt) return false;
          const publishedDate = new Date(a.publishedAt);
          return publishedDate >= firstDayOfMonth;
        }).length;

        setAuthorStats({
          totalArticles,
          totalViews,
          draftArticles,
          publishedThisMonth,
        });

        // Get recent articles (last 4)
        const sorted = [...articles].sort((a, b) => {
          const dateA = new Date(a.$createdAt || 0).getTime();
          const dateB = new Date(b.$createdAt || 0).getTime();
          return dateB - dateA;
        });
        setRecentArticles(sorted.slice(0, 4));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showErrorToast('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats: StatCard[] = [
    {
      title: 'Jimlar Labarai',
      value: authorStats.totalArticles,
      icon: FiFileText,
      color: 'blue',
    },
    {
      title: 'Jimlar Kallonin',
      value: authorStats.totalViews.toLocaleString(),
      icon: FiEye,
      color: 'green',
    },
    {
      title: 'Daftari',
      value: authorStats.draftArticles,
      icon: FiClock,
      color: 'yellow',
    },
    {
      title: 'Wannan Wata',
      value: authorStats.publishedThisMonth,
      icon: FiTrendingUp,
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Sannu, {authorName}!</h2>
        <p className="text-green-100">
          Barka da zuwa zuwa shafinka na rubutu. Ka ci gaba da rubutu labaran ban sha'awa!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Ayyuka Masu Sauri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/author/articles/new"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FiEdit2 className="w-5 h-5" />
            <span>Rubuta Sabon Labari</span>
          </a>
          <a
            href="/author/articles?status=draft"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            <FiClock className="w-5 h-5" />
            <span>Duba Daftari</span>
          </a>
          <a
            href="/author/profile"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            <FiEdit2 className="w-5 h-5" />
            <span>Gyara Bayani</span>
          </a>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Labarai Na Kwanan Nan
            </h3>
            <a
              href="/author/articles"
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Duba Duka →
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Taken
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
              {recentArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Ba ka da wani labari tukuna. Fara rubutu yanzu!
                    </p>
                    <a
                      href="/author/articles/new"
                      className="inline-block mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Rubuta Sabon Labari
                    </a>
                  </td>
                </tr>
              ) : (
                recentArticles.map((article) => (
                  <tr key={article.$id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {article.title}
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
                      <div className="text-sm text-gray-900 dark:text-white tabular-nums">
                        {article.views > 0 ? article.views.toLocaleString() : '-'}
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <a
                        href={`/author/articles/edit/${article.$id}`}
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      >
                        Gyara
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
          💡 Shawarwari don Marubuta
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• Rubuta taken labari mai jan hankali da ma'ana</li>
          <li>• Yi amfani da hotuna masu kyau don labaran ku</li>
          <li>• Rarraba labaran ku a koyaushe bayan an buga</li>
          <li>• Amsa sharhin masu karatu don ƙara haɗin kai</li>
        </ul>
      </div>
    </div>
  );
}
