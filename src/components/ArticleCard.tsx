import { FiClock, FiEye, FiArrowUpRight } from 'react-icons/fi';
import type { Article } from '../types';
import { formatHausaDate, getReadingTime } from '../utils/hausa';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <article className={`group relative flex flex-col h-full overflow-hidden rounded-xl border bg-white dark:bg-gray-900 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] ${
      featured 
        ? 'border-blue-100 dark:border-gray-700 md:col-span-2 lg:col-span-1' 
        : 'border-gray-100 dark:border-gray-800'
    }`}>
      <a href={`/articles/${article.slug}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${featured ? 'h-56 sm:h-64' : 'h-48'}`}>
          {/* Image */}
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-mono font-medium text-white bg-black/50 backdrop-blur-md border border-white/10 rounded flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${
                article.category?.slug === 'labarai' ? 'bg-red-500' :
                article.category?.slug === 'sharhi' ? 'bg-blue-500' :
                'bg-purple-500'
              }`}></span>
              {article.category?.name || 'SAURAN'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Meta Top */}
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5" />
              {formatHausaDate(article.publishedAt || article.$createdAt, 'relative')}
            </span>
            <span className="text-blue-600 dark:text-blue-400">{getReadingTime(article.content)}</span>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors ${
            featured ? 'text-xl sm:text-2xl' : 'text-lg'
          }`}>
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            {/* Author */}
            <div className="flex items-center gap-2">
              {article.author?.avatar ? (
                <img src={article.author.avatar} alt="" className="w-6 h-6 rounded-full ring-1 ring-gray-200 dark:ring-gray-700" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600" />
              )}
              <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400">
                {article.author?.name || 'Marubuci'}
              </span>
            </div>

            {/* Arrow Icon */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-purple-900/30 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-all">
              <FiArrowUpRight className="w-4 h-4 transform group-hover:rotate-45 transition-transform" />
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}