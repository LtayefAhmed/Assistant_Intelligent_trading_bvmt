import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/i18n';
import { useState, useEffect } from 'react';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-all duration-200 z-10"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-amber-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 opacity-10 absolute inset-0 transform -translate-y-4">
            404
          </div>
          <div className="relative">
            <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              4
            </span>
            <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              0
            </span>
            <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              4
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative mb-12">
          {/* Animated Background Elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-200 dark:bg-blue-900 rounded-full opacity-30 animate-pulse delay-75"></div>
          <div className="absolute top-4 -right-8 w-8 h-8 bg-blue-200 dark:bg-blue-900 rounded-full opacity-40 animate-pulse delay-150"></div>
          <div className="absolute -bottom-8 left-12 w-10 h-10 bg-orange-200 dark:bg-orange-900 rounded-full opacity-25 animate-pulse delay-100"></div>
          
          <div className="relative z-10">
            {/* Animated Illustration */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="w-24 h-24 border-4 border-gray-300 dark:border-gray-600 rounded-full mx-auto"></div>
              <div className="w-8 h-12 bg-gray-300 dark:bg-gray-600 transform rotate-45 absolute bottom-4 right-6 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <div className="absolute bottom-6 w-12 h-1 bg-blue-400 dark:bg-blue-300 rounded-full"></div>
              </div>
            </div>

            {/* Title and Description */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('notFound.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
              {t('notFound.description')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            {t('notFound.buttons.home')}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('notFound.buttons.back')}
          </button>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {t('notFound.help.title')}
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-400 dark:text-gray-500">
            <span>{t('notFound.help.checkUrl')}</span>
            <span>{t('notFound.help.contactSupport')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;