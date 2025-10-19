import { FiFileText, FiEye, FiTrendingUp, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';

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
  // Mock current author data - will be replaced with Appwrite
  const authorStats = {
    totalArticles: 25,
    totalViews: 45832,
    draftArticles: 3,
    publishedThisMonth: 5,
  };

  const recentArticles: Article[] = [
    {
      id: '1',
      title: 'Yadda AI ke Canza Rayuwarmu',
      status: 'published',
      views: 2847,
      publishedAt: '2025-10-15',
    },
    {
      id: '2',
      title: 'Wayoyin Dijital a Najeriya',
      status: 'published',
      views: 1923,
      publishedAt: '2025-10-12',
    },
    {
      id: '3',
      title: 'Tsarin Sadarwa ta 5G',
      status: 'draft',
      views: 0,
      publishedAt: '2025-10-10',
    },
    {
      id: '4',
      title: 'Kimiyyar Kwamfuta da Manhajoji',
      status: 'published',
      views: 3421,
      publishedAt: '2025-10-08',
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Sannu, Musa Ibrahim!</h2>
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
              {recentArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                      {new Date(article.publishedAt).toLocaleDateString('ha-NG')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <a
                      href={`/author/articles/edit/${article.id}`}
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                    >
                      Gyara
                    </a>
                  </td>
                </tr>
              ))}
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
