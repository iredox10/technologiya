import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiSearch, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { authService } from '../lib/appwriteServices';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface NavLink {
  name: string;
  href: string;
  icon?: any;
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
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
    loadCurrentUser();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    html.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    setIsDark(newTheme === 'dark');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setShowUserMenu(false);
      showSuccessToast('An fita cikin nasara');
      setTimeout(() => window.location.href = '/', 1000);
    } catch (error) {
      showErrorToast('An sami kuskure wajen fita');
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo Area */}
            <a href="/" className="flex items-center gap-2 group">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${scrolled ? 'bg-blue-600' : 'bg-white/20 backdrop-blur-sm'}`}>
                T
              </div>
              <span className={`text-xl sm:text-2xl font-bold tracking-tight font-display transition-colors duration-300 ${
                scrolled ? 'text-gray-900 dark:text-white' : 'text-white drop-shadow-md'
              }`}>
                Technologiya
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    scrolled 
                      ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600' 
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.location.href = '/search'}
                className={`p-2.5 rounded-full transition-all duration-200 ${
                  scrolled 
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <FiSearch className="w-5 h-5" />
              </button>

              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all duration-200 ${
                  scrolled 
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-white/30" />
                    <FiChevronDown className={`w-4 h-4 transition-transform ${scrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white'}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in-up">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <a href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors">
                          <FiUser /> Bayanai Na
                        </a>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <FiLogOut /> Fita
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a 
                  href="/user-login"
                  className={`hidden sm:inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    scrolled 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-white text-blue-900 hover:bg-blue-50'
                  }`}
                >
                  Shiga
                </a>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                }`}
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-blue-600 font-display">Technologiya</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
               {!user && (
                 <a href="/user-login" className="block w-full py-3 text-center rounded-xl bg-blue-600 text-white font-bold mb-4">
                   Shiga
                 </a>
               )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}