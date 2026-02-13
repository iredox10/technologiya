import { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiUser,
  FiMenu,
  FiX,
  FiEdit,
  FiPlusCircle,
  FiLogOut,
  FiCpu
} from 'react-icons/fi';
import { authService, authorService } from '../../lib/appwriteServices';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function AuthorSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [currentAuthor, setCurrentAuthor] = useState({
    name: '',
    email: '',
    avatar: '',
    articlesCount: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResult = await authService.getCurrentUser();
        if (!userResult.success || !userResult.data) {
          window.location.href = '/login';
          return;
        }

        const authorResult = await authorService.getAuthorByUserId(userResult.data.$id);
        if (!authorResult.success || !authorResult.data) {
          window.location.href = '/login';
          return;
        }

        const author = authorResult.data;
        if (author.status !== 'active' || (author.role !== 'author' && author.role !== 'admin')) {
          window.location.href = '/login';
          return;
        }

        setCurrentAuthor({
          name: author.name,
          email: author.email,
          avatar: author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=3B82F6&color=fff`,
          articlesCount: author.articleCount || 0,
        });

        setIsChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, []);

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/author', icon: FiHome },
    { name: 'AI Writer', href: '/author/ai-writer', icon: FiCpu },
    { name: 'Labaran Na', href: '/author/articles', icon: FiFileText, badge: currentAuthor.articlesCount },
    { name: 'Rubuta Sabon Labari', href: '/author/articles/new', icon: FiPlusCircle },
    { name: 'Bayanai Na', href: '/author/profile', icon: FiUser },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      window.location.href = '/login';
    }
  };

  if (isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-[60] p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm active:scale-90"
      >
        {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#030712] border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-800/50">
          <a href="/author" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">M</div>
            <span className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">Marubucin</span>
          </a>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive ? 'bg-green-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/20">{item.badge}</span>}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 mb-3">
            <img src={currentAuthor.avatar} alt="" className="w-9 h-9 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{currentAuthor.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{currentAuthor.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
            <FiLogOut />
            <span>Fita</span>
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
    </>
  );
}
