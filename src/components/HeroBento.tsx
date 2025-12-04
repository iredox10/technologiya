import React from 'react';
import { motion } from 'framer-motion';
import type { Article } from '../types';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import { formatHausaDate } from '../utils/hausa';

interface HeroBentoProps {
    articles: Article[];
}

const HeroBento: React.FC<HeroBentoProps> = ({ articles }) => {
    if (!articles || articles.length === 0) return null;

    const mainArticle = articles[0];
    const secondaryArticles = articles.slice(1, 4);

    return (
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-auto lg:h-[600px]">
                {/* Main Feature - Spans 8 columns */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-8 relative group overflow-hidden rounded-3xl shadow-2xl h-[400px] lg:h-full"
                >
                    <a href={`/articles/${mainArticle.slug}`} className="block h-full w-full">
                        <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/30 transition-colors duration-500 z-10" />
                        <img
                            src={mainArticle.coverImage}
                            alt={mainArticle.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                            {mainArticle.category && (
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-white uppercase bg-blue-600 rounded-full">
                                    {mainArticle.category.name}
                                </span>
                            )}
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                                {mainArticle.title}
                            </h1>
                            <div className="flex items-center text-gray-300 text-sm sm:text-base gap-4">
                                {mainArticle.author && (
                                    <div className="flex items-center gap-2">
                                        {mainArticle.author.avatar && (
                                            <img src={mainArticle.author.avatar} alt={mainArticle.author.name} className="w-6 h-6 rounded-full" />
                                        )}
                                        <span>{mainArticle.author.name}</span>
                                    </div>
                                )}
                                <span className="flex items-center gap-1">
                                    <FiClock />
                                    {formatHausaDate(mainArticle.publishedAt || mainArticle.$createdAt, 'relative')}
                                </span>
                            </div>
                        </div>
                    </a>
                </motion.div>

                {/* Secondary Grid - Spans 4 columns */}
                <div className="lg:col-span-4 grid grid-rows-3 gap-4 sm:gap-6 h-full">
                    {secondaryArticles.map((article, index) => (
                        <motion.div
                            key={article.$id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800 h-[180px] lg:h-auto"
                        >
                            <a href={`/articles/${article.slug}`} className="flex h-full">
                                <div className="w-1/3 relative overflow-hidden">
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="w-2/3 p-4 flex flex-col justify-center">
                                    {article.category && (
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase">
                                            {article.category.name}
                                        </span>
                                    )}
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {article.title}
                                    </h3>
                                    <div className="mt-auto flex items-center text-xs text-gray-500 dark:text-gray-400">
                                        <FiClock className="mr-1" />
                                        {formatHausaDate(article.publishedAt || article.$createdAt, 'relative')}
                                    </div>
                                </div>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroBento;
