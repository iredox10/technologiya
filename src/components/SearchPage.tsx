import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import ArticleCard from './ArticleCard';
import { searchArticles } from '../data/mockData';
import type { Article } from '../types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Get query from URL on mount
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, []);

  const performSearch = (searchQuery: string) => {
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const searchResults = searchArticles(searchQuery);
      setResults(searchResults);
      setIsSearching(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.pushState({}, '', url);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Search Header */}
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center tracking-tight">
          Nemo Labarai
        </h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nemo labari, taken, ko tag..."
              className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Goge"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary font-mono mt-4 w-full md:w-auto md:absolute md:right-2 md:top-2 md:mt-0 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors tracking-wide"
          >
            Nema
          </button>
        </form>
      </div>

      {/* Search Results */}
      <div className="max-w-6xl mx-auto">
        {isSearching ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Ana nema...</p>
          </div>
        ) : query && results.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="font-mono text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
                An samu <span className="stat-number tabular-nums">{results.length}</span> {results.length === 1 ? 'sakamako' : 'sakamakon'} don "{query}"
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Ba a sami wani abu ba
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ba mu sami wani labari da ya dace da neman ka na "{query}"
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Sake Gwadawa
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Fara Nema
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Shigar da kalmar bincike a sama don nemo labarai
            </p>
          </div>
        )}
      </div>

      {/* Search Tips */}
      {!query && (
        <div className="max-w-3xl mx-auto mt-16">
          <h3 className="font-mono text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 text-center tracking-wide">
            Shawarwarin Bincike
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Taken Labari
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nemo ta taken labari kamar "Samsung" ko "iPhone"
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Rukuni
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nemo rukuni kamar "Wayoyi" ko "Manhajoji"
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Tags
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nemo ta tags kamar "Android" ko "AI"
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
