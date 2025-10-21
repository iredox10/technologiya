import { useState, useEffect } from 'react';
import { FiFileText, FiUsers, FiEye, FiTrendingUp, FiEdit, FiClock, FiLoader } from 'react-icons/fi';
import { articleService, categoryService, authorService } from '../../lib/appwriteServices';
import type { Article, Category, Author } from '../../types';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

interface RecentArticle {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  date: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Jimlar Labarai',
      value: '0',
      change: '-',
      trend: 'up',
      icon: FiFileText,
    },
    {
      title: 'Jimlar Kalmomi',
      value: '0',
      change: '-',
      trend: 'up',
      icon: FiUsers,
    },
    {
      title: 'Marubuta',
      value: '0',
      change: '-',
      trend: 'up',
      icon: FiEye,
    },
    {
      title: 'Bugaggu',
      value: '0',
      change: '-',
      trend: 'up',
      icon: FiTrendingUp,
    },
  ]);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [articlesResult, categoriesResult, authorsResult] = await Promise.all([
        articleService.getArticles(1, 100),
        categoryService.getCategories(),
        authorService.getAuthors(),
      ]);

      // Extract data with proper type assertions
      const articles = (articlesResult.success && articlesResult.data) ? articlesResult.data.documents as unknown as Article[] : [];
      const categories = (categoriesResult.success && categoriesResult.data) ? categoriesResult.data.documents as unknown as Category[] : [];
      const authors = (authorsResult.success && authorsResult.data) ? authorsResult.data.documents as unknown as Author[] : [];

      // Calculate stats
      const totalArticles = articles.length;
      const publishedArticles = articles.filter((a) => a.status === 'published').length;
      const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
      const featuredArticles = articles.filter((a) => a.featured).length;

      // Update stats
      setStats([
        {
          title: 'Jimlar Labarai',
          value: totalArticles.toString(),
          change: publishedArticles > 0 ? `${publishedArticles} bugaggu` : '-',
          trend: 'up',
          icon: FiFileText,
        },
        {
          title: 'Jimlar Kalmomi',
          value: categories.length.toString(),
          change: '-',
          trend: 'up',
          icon: FiUsers,
        },
        {
          title: 'Marubuta',
          value: authors.length.toString(),
          change: '-',
          trend: 'up',
          icon: FiEye,
        },
        {
          title: 'Kallon Labarai',
          value: totalViews.toLocaleString(),
          change: `${featuredArticles} masu ɗaci`,
          trend: 'up',
          icon: FiTrendingUp,
        },
      ]);

      // Get recent articles (last 5)
      const recent = articles
        .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())
        .slice(0, 5)
        .map((article) => {
          const createdDate = new Date(article.$createdAt);
          const now = new Date();
          const diffMs = now.getTime() - createdDate.getTime();
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          
          let dateStr = '';
          if (diffHours < 1) {
            dateStr = 'Yanzu haka';
          } else if (diffHours < 24) {
            dateStr = `${diffHours} ${diffHours === 1 ? 'awa' : 'awanni'} da suka wuce`;
          } else {
            dateStr = `${diffDays} ${diffDays === 1 ? 'rana' : 'ranaku'} da suka wuce`;
          }

          return {
            id: article.$id,
            title: article.title,
            status: article.status,
            views: article.views || 0,
            date: dateStr,
          };
        });

      setRecentArticles(recent);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Ana loda bayanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Fira Code', monospace" }}>
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-2 ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Ayyuka Masu Sauri
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/admin/articles/new"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <FiEdit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Rubuta Sabon Labari
            </span>
          </a>
          
          <a
            href="/admin/categories"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <FiFileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Sarrafa Kalmomi
            </span>
          </a>
          
          <a
            href="/admin/authors"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <FiUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">
              Sarrafa Marubuta
            </span>
          </a>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Labarai Na Baya-bayan Nan
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentArticles.map((article) => (
            <div
              key={article.id}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {article.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}
                    >
                      {article.status === 'published' ? 'An Buga' : 'Daftari'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <FiEye className="w-4 h-4" />
                      <span className="font-mono">{article.views.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{article.date}</span>
                    </span>
                  </div>
                </div>
                <a
                  href={`/admin/articles/edit/${article.id}`}
                  className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  Gyara
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/admin/articles"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Duba Duka Labarai →
          </a>
        </div>
      </div>
    </div>
  );
}
