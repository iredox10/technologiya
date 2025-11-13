import { FiClock, FiEye } from 'react-icons/fi';
import type { Article } from '../types';
import { formatHausaDate, getReadingTime } from '../utils/hausa';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const cardClass = featured
    ? 'group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full border border-gray-100 dark:border-gray-700'
    : 'group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full border border-gray-100 dark:border-gray-700';

  return (
    <article className={cardClass}>
      <a href={`/articles/${article.slug}`} className="block h-full flex flex-col">
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'h-52 sm:h-64 md:h-80' : 'h-44 sm:h-48'}`}>
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="category-badge inline-block px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full tracking-wider shadow-lg backdrop-blur-sm">
              {article.category?.name || 'Uncategorized'}
            </span>
          </div>

          {/* Featured Badge */}
          {article.featured && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
              <span className="category-badge inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-full tracking-wider shadow-lg backdrop-blur-sm animate-pulse">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Muhimmi
              </span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6">
          {/* Title */}
          <h3 className={`font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug ${
            featured ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg'
          }`}>
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Spacer to push meta to bottom */}
          <div className="flex-1"></div>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs text-gray-500 dark:text-gray-500 mb-3 sm:mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="meta-info flex items-center gap-1 tabular-nums">
                <FiClock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="text-xs">{formatHausaDate(article.publishedAt || article.$createdAt, 'relative')}</span>
              </span>
              
              {(article.views !== undefined && article.views !== null) && (
                <span className="stat-number flex items-center gap-1 tabular-nums">
                  <FiEye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="text-xs">{article.views.toLocaleString()}</span>
                </span>
              )}
            </div>

            <span className="meta-info font-semibold tabular-nums text-blue-600 dark:text-blue-400 text-xs">
              {getReadingTime(article.content)}
            </span>
          </div>

          {/* Author */}
          <div className="flex items-center pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
            {article.author?.avatar ? (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-400 dark:group-hover:ring-blue-600 transition-all"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                {(article.author?.name || 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="font-mono text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {article.author?.name || 'Unknown'}
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
