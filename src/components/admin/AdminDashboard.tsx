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
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [articlesResult, categoriesResult, authorsResult] = await Promise.all([
        articleService.getArticles(1, 100),
        categoryService.getCategories(),
        authorService.getAuthors(),
      ]);

      const articles = (articlesResult.success && articlesResult.data) ? articlesResult.data.documents as unknown as Article[] : [];
      const categories = (categoriesResult.success && categoriesResult.data) ? categoriesResult.data.documents as unknown as Category[] : [];
      const authors = (authorsResult.success && authorsResult.data) ? authorsResult.data.documents as unknown as Author[] : [];

      const totalArticles = articles.length;
      const publishedArticles = articles.filter((a) => a.status === 'published').length;
      const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
      const featuredArticles = articles.filter((a) => a.featured).length;

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
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-widest">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-bold mt-2 text-green-600 dark:text-green-400">
                    {stat.change}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">Ayyuka Masu Sauri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <a href="/admin/articles/new" className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 transition-colors border border-blue-100 dark:border-blue-900/20">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
              <FiEdit />
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Rubuta Labari</span>
          </a>
          
          <a href="/admin/categories" className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 transition-colors border border-purple-100 dark:border-purple-900/20">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/20">
              <FiFileText />
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Kalmomi</span>
          </a>
          
          <a href="/admin/authors" className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 hover:bg-green-100 transition-colors border border-green-100 dark:border-green-900/20">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-green-600/20">
              <FiUsers />
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Marubuta</span>
          </a>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Labarai Na Baya-bayan Nan</h2>
          <a href="/admin/articles" className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">Duba Duka</a>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {recentArticles.map((article) => (
            <div key={article.id} className="p-5 sm:px-8 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{article.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 text-[9px] font-bold rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'}`}>
                      {article.status === 'published' ? 'AN BUGA' : 'DAFTARI'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><FiEye /> {article.views}</span>
                    <span className="flex items-center gap-1"><FiClock /> {article.date}</span>
                  </div>
                </div>
                <a href={`/admin/articles/edit/${article.id}`} className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 transition-colors">
                  Gyara
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
