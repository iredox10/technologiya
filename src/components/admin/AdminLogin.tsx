import { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiEdit, FiAlertCircle } from 'react-icons/fi';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeoutMessage, setTimeoutMessage] = useState(false);

  useEffect(() => {
    // Check if redirected due to timeout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('timeout') === 'true') {
      setTimeoutMessage(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // TODO: Implement Appwrite authentication
    console.log('Login attempt:', { email, password });

    // Mock login for now
    setTimeout(() => {
      if (email === 'admin@technologiya.com' && password === 'admin123') {
        // Successful login - redirect to admin dashboard
        window.location.href = '/admin';
      } else {
        setError('Imel ko kalmar sirri ba daidai ba ne');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030712] relative overflow-hidden px-4 py-12">
      
      {/* Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/30">
            <FiEdit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">
            Admin Panel
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Shiga zuwa sashin gudanarwa
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10">
          {/* Timeout Warning */}
          {timeoutMessage && (
            <div className="mb-6 bg-yellow-50/80 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start">
                <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-1">
                    An fitar da kai saboda rashin aiki
                  </h3>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed">
                    An fitar da kai saboda ba ka yi wani aiki na tsawon mintuna 10. Don aminci, ka sake shiga don ci gaba.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Adireshin Imel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@technologiya.com"
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Kalmar Sirri
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
              <label className="flex items-center cursor-pointer">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Ka tuna da ni
                </span>
              </label>
              <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Ka manta kalmar sirri?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 py-2 px-4 rounded-lg inline-block">
              <strong>Demo:</strong> admin@technologiya.com / admin123
            </p>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-8">
          <a href="/" className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors">
            ← Koma zuwa shafin
          </a>
        </div>
      </div>
    </div>
  );
}
