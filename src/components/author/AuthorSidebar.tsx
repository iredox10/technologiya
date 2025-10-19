import { useState } from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiUser,
  FiMenu,
  FiX,
  FiEdit,
  FiPlusCircle,
  FiLogOut
} from 'react-icons/fi';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function AuthorSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock current author - will be replaced with Appwrite session data
  const currentAuthor = {
    name: 'Musa Ibrahim',
    email: 'musa@technologiya.com',
    avatar: 'https://ui-avatars.com/api/?name=Musa+Ibrahim&background=3B82F6&color=fff',
    articlesCount: 25,
  };

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/author', icon: FiHome },
    { name: 'Labaran Na', href: '/author/articles', icon: FiFileText, badge: currentAuthor.articlesCount },
    { name: 'Rubuta Sabon Labari', href: '/author/articles/new', icon: FiPlusCircle },
    { name: 'Bayanai Na', href: '/author/profile', icon: FiUser },
  ];

  const handleLogout = () => {
    // TODO: Implement Appwrite logout
    console.log('Logging out...');
    window.location.href = '/author/login';
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-6">
          <a href="/author" className="flex items-center space-x-2">
            <FiEdit className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Fira Code', monospace" }}>
              Marubucin
            </span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
            
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-600 text-white">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Author Profile Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={currentAuthor.avatar} 
              alt={currentAuthor.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentAuthor.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentAuthor.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Fita</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
