import { useState, useEffect } from 'react';
import { FiSave, FiEye, FiUpload, FiX } from 'react-icons/fi';
import RichTextEditor from './RichTextEditor';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: { name: string; slug: string };
  tags: string[];
  coverImage: string;
  status: 'draft' | 'published';
  author: { name: string };
}

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  status: 'draft' | 'published';
  author: string;
}

interface ArticleEditorProps {
  article?: Article;
  isEditing?: boolean;
}

export default function ArticleEditor({ article, isEditing = false }: ArticleEditorProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    coverImage: '',
    status: 'draft',
    author: 'Musa Ibrahim',
  });

  // Load article data if editing
  useEffect(() => {
    if (article && isEditing) {
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category.name,
        tags: article.tags,
        coverImage: article.coverImage,
        status: article.status,
        author: article.author.name,
      });
    }
  }, [article, isEditing]);

  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Wayoyi',
    'AI & Machine Learning',
    'Hanyoyin Sadarwa',
    'Kimiyya & Fasaha',
    'Manhajoji',
    'Amfani da Intanet',
  ];

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSave = async (publish: boolean) => {
    setIsSaving(true);
    
    // Validation
    if (!formData.title || !formData.content || !formData.category) {
      alert('Da fatan za a cika dukkan filayen masu mahimmanci');
      setIsSaving(false);
      return;
    }

    const dataToSave = {
      ...formData,
      status: publish ? 'published' : 'draft',
    };

    console.log('Saving article:', dataToSave);
    
    // Will implement Appwrite save later
    setTimeout(() => {
      setIsSaving(false);
      alert(publish ? 'An buga labarin!' : 'An adana a matsayin daftari!');
      // Redirect to articles list
      // window.location.href = '/admin/articles';
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditing ? 'Gyara Labarin' : 'Rubuta Sabon Labari'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditing ? 'Canza bayanin labarin' : 'Rubuta sabon labari mai ban sha\'awa'}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors space-x-2"
          >
            <FiEye className="w-4 h-4" />
            <span>{showPreview ? 'Gyara' : 'Duba Samfurin'}</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors space-x-2 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>Adana Daftari</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>{isSaving ? 'Ana adanawa...' : (isEditing ? 'Sabunta' : 'Buga Labarin')}</span>
          </button>
        </div>
      </div>

      {!showPreview ? (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Taken Labarin *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Rubuta taken labarin..."
              className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Slug */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="labarin-slug"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Taƙaitaccen Bayani *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Rubuta taƙaitaccen bayani game da labarin..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Abun Ciki *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Fara rubuta labarin a nan..."
            />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kalma *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Zaɓi kalma...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alamomi
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Rubuta alama..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddTag}
                  type="button"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  Ƙara
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    <span>#{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      type="button"
                      className="hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hoton Murfin
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors space-x-2"
              >
                <FiUpload className="w-4 h-4" />
                <span>Loda Hoto</span>
              </button>
            </div>
            {formData.coverImage && (
              <div className="mt-4">
                <img
                  src={formData.coverImage}
                  alt="Preview"
                  className="max-w-sm rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Category Badge */}
            {formData.category && (
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-full">
                  {formData.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {formData.title || 'Taken Labarin'}
            </h1>

            {/* Excerpt */}
            {formData.excerpt && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {formData.excerpt}
              </p>
            )}

            {/* Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Cover Image */}
            {formData.coverImage && (
              <div className="mb-8">
                <img
                  src={formData.coverImage}
                  alt={formData.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formData.content || '<p>Babu abun ciki...</p>' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
