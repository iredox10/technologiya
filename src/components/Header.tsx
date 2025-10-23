import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { authService } from '../lib/appwriteServices';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface NavLink {
  name: string;
  href: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  avatar?: string;
}

const navLinks: NavLink[] = [
  { name: 'Gida', href: '/' },
  { name: 'Wayoyi', href: '/category/wayoyi' },
  { name: 'Manhajoji', href: '/category/manhajoji' },
  { name: 'Bita', href: '/category/bita' },
  { name: 'Dabaru', href: '/category/dabaru' },
  { name: 'Koyarwa', href: '/category/koyarwa' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Initialize theme and user on mount
  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
    
    // Check if user is logged in via Appwrite
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const result = await authService.getCurrentUser();
      if (result.success && result.data) {
        const userData: User = {
          id: result.data.$id,
          name: result.data.name,
          email: result.data.email,
          avatar: result.data.prefs?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.data.name}`
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await authService.logout();
      
      if (result.success) {
        setUser(null);
        setShowUserMenu(false);
        showSuccessToast('An fita cikin nasara');
        // Redirect to home page
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        showErrorToast('An sami kuskure wajen fita');
      }
    } catch (error) {
      console.error('Logout error:', error);
      showErrorToast('An sami kuskure wajen fita');
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <div className="brand-name text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                Technologiya
              </div>
            </a>
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors tracking-wide"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <a
                href="/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
              >
                Shiga
              </a>
              <a href="/search" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Nemo">
                <FiSearch className="w-5 h-5" />
              </a>
              <div className="p-2">
                <FiMoon className="w-5 h-5" />
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="brand-name text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
              Technologiya
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* User Menu or Login Button */}
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiUser className="w-4 h-4 mr-2" />
                      Bayanai Na
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Fita
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/user-login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
              >
                Shiga
              </a>
            )}

            {/* Search Button */}
            <a
              href="/search"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Nemo"
            >
              <FiSearch className="w-5 h-5" />
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Canza yanayi"
            >
              {isDark ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              {/* Mobile User Section */}
              {user ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <a
                    href="/profile"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition-colors"
                  >
                    <FiUser className="w-4 h-4 mr-2" />
                    Bayanai Na
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium py-2 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4 mr-2" />
                    Fita
                  </button>
                </div>
              ) : (
                <a
                  href="/user-login"
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium py-2 px-4 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors"
                >
                  Shiga
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
