import { useState, useEffect } from 'react';
import { FiFileText, FiEye, FiTrendingUp, FiClock, FiEdit2, FiTrash2, FiLoader, FiChevronRight, FiUser } from 'react-icons/fi';
import { articleService, authService, authorService } from '../../lib/appwriteServices';
import type { Article as AppwriteArticle } from '../../types';
import { showErrorToast } from '../../utils/toast';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function AuthorDashboard() {
  const [loading, setLoading] = useState(true);
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
      const userResult = await authService.getCurrentUser();
      if (!userResult.success || !userResult.data) {
        window.location.href = '/author/login';
        return;
      }

      const authorResult = await authorService.getAuthorByUserId(userResult.data.$id);
      if (authorResult.success && authorResult.data) {
        const author = authorResult.data;
        setAuthorName(author.name);

        const articlesResult = await articleService.getArticlesByAuthor(author.$id, 1, 1000);
        if (articlesResult.success && articlesResult.data) {
          const articles = articlesResult.data.documents as unknown as AppwriteArticle[];
          
          setAuthorStats({
            totalArticles: articles.length,
            totalViews: articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0),
            draftArticles: articles.filter((a: any) => a.status === 'draft').length,
            publishedThisMonth: articles.filter((a: any) => {
              if (a.status !== 'published' || !a.publishedAt) return false;
              const d = new Date(a.publishedAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length,
          });

          setRecentArticles([...articles].sort((a, b) => new Date(b.$createdAt || 0).getTime() - new Date(a.$createdAt || 0).getTime()).slice(0, 4));
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats: StatCard[] = [
    { title: 'Jimlar Labarai', value: authorStats.totalArticles, icon: FiFileText, color: 'blue' },
    { title: 'Jimlar Kallo', value: authorStats.totalViews.toLocaleString(), icon: FiEye, color: 'green' },
    { title: 'Daftari', value: authorStats.draftArticles, icon: FiClock, color: 'yellow' },
    { title: 'Wannan Wata', value: authorStats.publishedThisMonth, icon: FiTrendingUp, color: 'purple' },
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
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Welcome Message */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 rounded-[2rem] p-6 sm:p-10 text-white shadow-2xl shadow-green-600/20">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black mb-3 leading-tight tracking-tight uppercase italic">Sannu, {authorName}!</h2>
          <p className="text-green-50 text-sm sm:text-lg max-w-xl font-medium opacity-90">
            Barka da zuwa zuwa shafinka na rubutu. Ka ci gaba da rubutu labaran ban sha'awa don haɓaka fasahar Hausa!
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Labarai Na Baya-bayan nan</h3>
          <a href="/author/articles" className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1 uppercase tracking-widest">
            Duba Duka <FiChevronRight />
          </a>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {recentArticles.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Babu labarai tukunna</div>
          ) : (
            recentArticles.map((article) => (
              <div key={article.$id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate text-base">{article.title}</h4>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-widest ${article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {article.status === 'published' ? 'Buga' : 'Daftari'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><FiEye /> {article.views || 0}</span>
                    <span>{new Date(article.$createdAt).toLocaleDateString('ha-NG')}</span>
                  </div>
                </div>
                <a href={`/author/articles/edit/${article.$id}`} className="px-5 py-2 text-xs font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-600 hover:text-white transition-all text-center">Gyara</a>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/author/articles/new" className="flex items-center justify-center gap-3 p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-green-500 transition-all group">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform"><FiEdit2 /></div>
          <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm">Rubuta Sabon Labari</span>
        </a>
        <a href="/author/profile" className="flex items-center justify-center gap-3 p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all group">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><FiUser /></div>
          <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm">Gyara Bayanai Na</span>
        </a>
      </div>
    </div>
  );
}
