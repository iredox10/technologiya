import { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiFolder, 
  FiUsers, 
  FiSettings,
  FiMenu,
  FiX,
  FiEdit,
  FiPlusCircle,
  FiLogOut
} from 'react-icons/fi';
import { authService, authorService } from '../../lib/appwriteServices';
import type { Author } from '../../types';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isChecking, setIsChecking] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<Author | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResult = await authService.getCurrentUser();
        
        if (!userResult.success || !userResult.data) {
          window.location.href = '/login';
          return;
        }

        // Check if user is an admin
        const authorResult = await authorService.getAuthorByUserId(userResult.data.$id);
        
        if (!authorResult.success || !authorResult.data) {
          window.location.href = '/login';
          return;
        }

        const author = authorResult.data as any;
        
        // Redirect if not admin or not active
        if (author.role !== 'admin' || author.status !== 'active') {
          window.location.href = author.role === 'author' ? '/author' : '/login';
          return;
        }

        setCurrentAdmin(author);
        setIsChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, []);

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Labarai', href: '/admin/articles', icon: FiFileText, badge: 12 },
    { name: 'Rubutun Sabon Labari', href: '/admin/articles/new', icon: FiPlusCircle },
    { name: 'Kalmomi', href: '/admin/categories', icon: FiFolder },
    { name: 'Marubuta', href: '/admin/authors', icon: FiUsers },
    { name: 'Saitunan', href: '/admin/settings', icon: FiSettings },
  ];

  const handleNavClick = (href: string) => {
    const section = href.split('/').pop() || 'dashboard';
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/login';
    }
  };

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

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
          <a href="/admin" className="flex items-center space-x-2">
            <FiEdit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Fira Code', monospace" }}>
              Admin
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
                onClick={() => handleNavClick(item.href)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-3">
            {currentAdmin?.avatar ? (
              <img
                src={currentAdmin.avatar}
                alt={currentAdmin.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {currentAdmin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentAdmin?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentAdmin?.email || 'admin@technologiya.com'}
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
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
