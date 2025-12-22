import { useState, useEffect } from 'react';
import { 
  FiMenu, FiX, FiSun, FiMoon, FiSearch, FiUser, FiLogOut, FiChevronDown, 
  FiHome, FiSmartphone, FiLayers, FiMonitor, FiCpu, FiWifi, FiInfo, FiMail 
} from 'react-icons/fi';
import { authService } from '../lib/appwriteServices';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface NavLink {
  name: string;
  href: string;
  icon?: any; // React Icon component
}

interface User {
  name: string;
  email: string;
  id: string;
  avatar?: string;
}

const navLinks: NavLink[] = [
  { name: 'Gida', href: '/', icon: FiHome },
  { name: 'Wayoyi', href: '/category/wayoyi', icon: FiSmartphone },
  { name: 'Manhajoji', href: '/category/manhajoji', icon: FiLayers },
  { name: 'Bita', href: '/category/bita', icon: FiMonitor },
  { name: 'Dabaru', href: '/category/dabaru', icon: FiCpu },
  { name: 'Koyarwa', href: '/category/koyarwa', icon: FiWifi },
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
        const appwriteUser = result.data;
        const userData: User = {
          id: appwriteUser.$id,
          name: appwriteUser.name,
          email: appwriteUser.email,
          avatar: appwriteUser.prefs?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${appwriteUser.name}`
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
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-800/50 py-3 transition-all duration-300"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo Area */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-blue-600 transition-all duration-300">
                T
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight font-display text-gray-900 dark:text-white transition-colors duration-300">
                Technologiya
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-gray-100/50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 hover:shadow-sm"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.location.href = '/search'}
                className="p-2.5 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gray-100/50 dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                  >
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                    <FiChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
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
                  className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                >
                  Shiga
                </a>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden"> {/* Higher z-index than header */}
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-950 shadow-2xl p-6 overflow-y-auto animate-slide-in-right border-l border-gray-200 dark:border-gray-800">
            
            {/* Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <a href="/" className="inline-flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">T</div>
                <span className="text-xl font-bold text-gray-900 dark:text-white font-display">Technologiya</span>
              </a>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* User Profile / Login */}
            {user ? (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6 flex items-center gap-4">
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-blue-500" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Shiga don samun cikakken damar amfani</p>
                <a href="/user-login" className="inline-block w-full py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">
                  Shiga / Ƙirƙiri Asusun
                </a>
              </div>
            )}

            {/* Nav Links */}
            <div className="space-y-2 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon className="w-5 h-5 text-blue-500" />}
                    {link.name}
                  </a>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2">
              {user && ( // Only show if user is logged in
                <>
                  <a 
                    href="/profile" 
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="w-5 h-5 text-purple-500" /> Bayanai Na
                  </a>
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FiLogOut className="w-5 h-5" /> Fita
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
