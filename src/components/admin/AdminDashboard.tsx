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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 font-mono uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white font-display">
                    {stat.value}
                  </p>
                  <p className={`text-xs font-medium mt-3 inline-flex items-center ${stat.trend === 'up' ? 'text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full' : 'text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Icon className="w-7 h-7" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-display">
          Ayyuka Masu Sauri
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a
            href="/admin/articles/new"
            className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
               <FiEdit className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              Rubuta Sabon Labari
            </span>
          </a>
          
          <a
            href="/admin/categories"
            className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
               <FiFileText className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              Sarrafa Kalmomi
            </span>
          </a>
          
          <a
            href="/admin/authors"
            className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border border-green-100 dark:border-green-900/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
               <FiUsers className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              Sarrafa Marubuta
            </span>
          </a>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
            Labarai Na Baya-bayan Nan
          </h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {recentArticles.map((article) => (
            <div
              key={article.id}
              className="px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                      {article.title}
                    </h3>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                      }`}
                    >
                      {article.status === 'published' ? 'AN BUGA' : 'DAFTARI'}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-mono">
                    <span className="flex items-center gap-2">
                      <FiEye className="w-4 h-4" />
                      <span>{article.views.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span>{article.date}</span>
                    </span>
                  </div>
                </div>
                <a
                  href={`/admin/articles/edit/${article.id}`}
                  className="ml-6 px-5 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors"
                >
                  Gyara
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50 dark:bg-gray-900/30">
          <a
            href="/admin/articles"
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
          >
            Duba Duka Labarai 
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
