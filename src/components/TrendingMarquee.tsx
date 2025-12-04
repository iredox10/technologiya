import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';

interface TrendingMarqueeProps {
    items: string[];
}

const TrendingMarquee: React.FC<TrendingMarqueeProps> = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="w-full bg-blue-600 dark:bg-blue-900 text-white py-3 overflow-hidden relative flex items-center">
            <div className="absolute left-0 z-10 bg-blue-700 dark:bg-blue-950 px-4 py-1 h-full flex items-center shadow-lg">
                <span className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <FiTrendingUp /> Trending
                </span>
            </div>

            <div className="flex overflow-hidden ml-32 mask-linear-fade">
                <motion.div
                    className="flex gap-8 whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear"
                    }}
                >
                    {[...items, ...items, ...items].map((item, index) => (
                        <span key={index} className="text-sm font-medium flex items-center gap-8">
                            {item}
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300/50"></span>
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default TrendingMarquee;
