import { FiClock, FiEye } from 'react-icons/fi';
import type { Article } from '../types';
import { formatHausaDate, getReadingTime } from '../utils/hausa';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const cardClass = featured
    ? 'group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 h-full'
    : 'group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 h-full';

  return (
    <article className={cardClass}>
      <a href={`/articles/${article.slug}`} className="block h-full">
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'h-64 md:h-80' : 'h-48'}`}>
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="category-badge inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full tracking-wider">
              {article.category.name}
            </span>
          </div>

          {/* Featured Badge */}
          {article.featured && (
            <div className="absolute top-4 right-4">
              <span className="category-badge inline-block px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full tracking-wider">
                Muhimmi
              </span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className={`font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="meta-info flex items-center space-x-1 tabular-nums">
                <FiClock className="w-3.5 h-3.5" />
                <span>{formatHausaDate(article.publishedAt, 'relative')}</span>
              </span>
              
              {article.views && (
                <span className="stat-number flex items-center space-x-1 tabular-nums">
                  <FiEye className="w-3.5 h-3.5" />
                  <span>{article.views.toLocaleString()}</span>
                </span>
              )}
            </div>

            <span className="meta-info font-medium tabular-nums">
              {getReadingTime(article.content)}
            </span>
          </div>

          {/* Author */}
          <div className="flex items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {article.author.avatar && (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
              {article.author.name}
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
