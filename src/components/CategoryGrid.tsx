import React from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../types';
import { FiArrowRight, FiSmartphone, FiCpu, FiCode, FiLayers, FiMonitor } from 'react-icons/fi';

interface CategoryGridProps {
    categories: Category[];
}

const getCategoryIcon = (slug: string) => {
    switch (slug) {
        case 'wayoyi': return <FiSmartphone className="w-8 h-8" />;
        case 'manhajoji': return <FiLayers className="w-8 h-8" />;
        case 'bita': return <FiMonitor className="w-8 h-8" />;
        case 'dabaru': return <FiCpu className="w-8 h-8" />;
        case 'koyarwa': return <FiCode className="w-8 h-8" />;
        default: return <FiLayers className="w-8 h-8" />;
    }
};

const getCategoryColor = (index: number) => {
    const colors = [
        'from-blue-500 to-cyan-400',
        'from-purple-500 to-pink-400',
        'from-orange-500 to-amber-400',
        'from-emerald-500 to-teal-400',
        'from-indigo-500 to-violet-400',
    ];
    return colors[index % colors.length];
};

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Bincika Rukunai
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Zaɓi ɗaya daga cikin rukunin da ke ƙasa don ganin labarai masu alaƙa
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {categories.map((category, index) => (
                    <motion.a
                        key={category.$id}
                        href={`/category/${category.slug}`}
                        whileHover={{ y: -5 }}
                        className="relative group overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl"
                    >
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getCategoryColor(index)} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            {getCategoryIcon(category.slug)}
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {category.name}
                        </h3>

                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            {category.articleCount || 0} Labarai
                        </span>

                        <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <span className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                                Shiga <FiArrowRight className="ml-1" />
                            </span>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
