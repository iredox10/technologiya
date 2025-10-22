import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { FaGoogle, FaFacebook, FaXTwitter } from 'react-icons/fa6';
import { authService } from '../lib/appwriteServices';
import { showSuccessToast, showErrorToast } from '../utils/toast';

export default function UserLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up new user
        if (!name.trim()) {
          setError('Da fatan za a shigar da suna');
          setIsLoading(false);
          return;
        }

        if (password.length < 8) {
          setError('Kalmar sirri ta kamata ta zama aƙalla haruffa 8');
          setIsLoading(false);
          return;
        }

        const result = await authService.register(email, password, name);
        
        if (result.success) {
          showSuccessToast('An yi rajista cikin nasara!');
          // Redirect to home page after short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          setError(result.error || 'An sami kuskure wajen yin rajista');
          showErrorToast(result.error || 'An sami kuskure wajen yin rajista');
          setIsLoading(false);
        }
      } else {
        // Login existing user
        const result = await authService.login(email, password);
        
        if (result.success) {
          showSuccessToast('An shiga cikin nasara!');
          // Redirect to home page after short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          setError('Imel ko kalmar sirri ba daidai ba ne');
          showErrorToast('Imel ko kalmar sirri ba daidai ba ne');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError('An sami kuskure. Da fatan za a sake gwadawa.');
      showErrorToast('An sami kuskure. Da fatan za a sake gwadawa.');
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authService.loginWithOAuth(provider);
      
      if (!result.success) {
        setError(`An sami kuskure wajen shiga da ${provider}`);
        showErrorToast(`An sami kuskure wajen shiga da ${provider}`);
        setIsLoading(false);
      }
      // If successful, the user will be redirected by Appwrite OAuth
    } catch (err: any) {
      console.error('Social login error:', err);
      setError('An sami kuskure. Da fatan za a sake gwadawa.');
      showErrorToast('An sami kuskure. Da fatan za a sake gwadawa.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Fira Code', monospace" }}>
            {isSignUp ? 'Ƙirƙiri Asusu' : 'Shiga'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignUp ? 'Yi rajista don yin sharhi da ƙarin abubuwa' : 'Shiga don yin sharhi da ƙarin abubuwa'}
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
              Shiga da Google
            </button>

            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaFacebook className="w-5 h-5 text-blue-600" />
              Shiga da Facebook
            </button>

            <button
              onClick={() => handleSocialLogin('twitter')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaXTwitter className="w-5 h-5 text-gray-900 dark:text-white" />
              Shiga da X (Twitter)
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Ko
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Suna
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Sunan ka"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            )}

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
                  placeholder="email@example.com"
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

            {/* Remember Me & Forgot Password (Login Only) */}
            {!isSignUp && (
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
            )}

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
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? 'Ana ƙirƙiri...' : 'Ana shiga...'}
                </>
              ) : (
                isSignUp ? 'Ƙirƙiri Asusu' : 'Shiga'
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              {isSignUp ? (
                <>
                  Ka riga ka yi rajista?{' '}
                  <span className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Shiga
                  </span>
                </>
              ) : (
                <>
                  Ba ka da asusu?{' '}
                  <span className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Ƙirƙiri asusu
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            ← Koma zuwa shafin
          </a>
        </div>

        {/* Admin/Author Login Link */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Ka Admin ko Marubuta ne?{' '}
            <a href="/login" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Shiga Admin/Author Panel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
