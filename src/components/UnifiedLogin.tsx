import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiEdit, FiShield, FiUsers } from 'react-icons/fi';
import { authService, authorService } from '../lib/appwriteServices';

export default function UnifiedLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Login with Appwrite
      const loginResult = await authService.login(email, password);
      
      if (!loginResult.success) {
        setError(loginResult.error || 'Imel ko kalmar sirri ba daidai ba ne');
        setIsLoading(false);
        return;
      }

      // 2. Get current user
      const userResult = await authService.getCurrentUser();
      
      if (!userResult.success || !userResult.data) {
        setError('An samu matsala wajen samun bayanan mai amfani');
        setIsLoading(false);
        return;
      }

      const userId = userResult.data.$id;

      // 3. Check if user is an author
      const authorResult = await authorService.getAuthorByUserId(userId);
      
      if (!authorResult.success || !authorResult.data) {
        // Not an author/admin - redirect to user login
        await authService.logout();
        setError('Ba kai admin ko marubuta ba ne. Don Allah yi amfani da shafin mai karanta.');
        setIsLoading(false);
        return;
      }

      const author = authorResult.data;

      // 4. Check if author is active
      if (author.status !== 'active') {
        await authService.logout();
        setError('Asusun ka ba aiki ba ne. Don Allah tuntubi admin.');
        setIsLoading(false);
        return;
      }

      // 5. Redirect based on role
      if (author.role === 'admin') {
        window.location.href = '/admin';
      } else if (author.role === 'author') {
        window.location.href = '/author';
      } else {
        await authService.logout();
        setError('Ba kai admin ko marubuta ba ne.');
        setIsLoading(false);
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setError('An samu matsala wajen shiga. Don Allah sake gwadawa.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl mb-4 shadow-lg">
            <FiEdit className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Fira Code', monospace" }}>
            Admin / Author
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Shiga zuwa sashin gudanarwa (Admin ko Marubuta kawai)
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adireshin Imel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@technologiya.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kalmar Sirri
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Ka tuna da ni
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  Ka manta kalmar sirri?
                </a>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ana shiga...
                </>
              ) : (
                'Shiga'
              )}
            </button>
          </form>

          {/* Info Message */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <FiShield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Shafin Admin & Marubuta
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Don Allah yi amfani da imel da kalmar sirrin da aka ba ku. Idan ba ku da asusu, don Allah tuntubi admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            ← Koma zuwa shafin
          </a>
        </div>

        {/* User Login Link */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Mai karanta ne kawai?{' '}
            <a href="/user-login" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Shiga kamar mai karanta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
