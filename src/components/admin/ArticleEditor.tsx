import { useState, useEffect } from 'react';
import { FiSave, FiEye, FiUpload, FiX } from 'react-icons/fi';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { articleService, categoryService, authorService, storageService, authService } from '../../lib/appwriteServices';
import type { Article, Category, Author } from '../../types';
import RichTextEditor from './RichTextEditor';
import { marked } from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  authorId: string;
  tags: string[];
  coverImage: string;
  coverImageFile: File | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
}

interface ArticleEditorProps {
  articleId?: string;
  isEditing?: boolean;
  isAuthorMode?: boolean; // Flag to indicate if used by author
}

export default function ArticleEditor({ articleId, isEditing = false, isAuthorMode = false }: ArticleEditorProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    authorId: '',
    tags: [],
    coverImage: '',
    coverImageFile: null,
    status: 'draft',
    featured: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentAuthorId, setCurrentAuthorId] = useState<string>('');
  const [currentAuthorName, setCurrentAuthorName] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');

  // Fetch categories and authors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResult, authorsResult] = await Promise.all([
          categoryService.getCategories(),
          authorService.getAuthors()
        ]);

        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data.documents as unknown as Category[]);
        }

        if (authorsResult.success && authorsResult.data) {
          const authorsData = authorsResult.data.documents as unknown as Author[];
          setAuthors(authorsData);

          // If in author mode, auto-select current author
          if (isAuthorMode && !isEditing) {
            try {
              const userResult = await authService.getCurrentUser();
              if (userResult.success && userResult.data) {
                const author = authorsData.find(a => a.userId === userResult.data.$id);
                if (author) {
                  setCurrentAuthorId(author.$id);
                  setCurrentAuthorName(author.name);
                  setFormData(prev => ({ ...prev, authorId: author.$id }));
                }
              }
            } catch (error) {
              console.error('Error loading current author:', error);
            }
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        showErrorToast('An samu kuskure wajen ɗaukar bayanai');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthorMode, isEditing]);

  // Load article data if editing
  useEffect(() => {
    if (articleId && isEditing) {
      const fetchArticle = async () => {
        try {
          const result = await articleService.getArticle(articleId);
          
          if (result.success && result.data) {
            const article = result.data as unknown as Article;
            setFormData({
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              content: article.content,
              categoryId: article.categoryId,
              authorId: article.authorId,
              tags: article.tags || [],
              coverImage: article.coverImage || '',
              coverImageFile: null,
              status: article.status,
              featured: article.featured || false,
            });

            // If in author mode, set author name for display
            if (isAuthorMode && authors.length > 0) {
              const author = authors.find(a => a.$id === article.authorId);
              if (author) {
                setCurrentAuthorName(author.name);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching article:', error);
          showErrorToast('An samu kuskure wajen ɗaukar labarin');
        }
      };

      fetchArticle();
    }
  }, [articleId, isEditing, isAuthorMode, authors]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showErrorToast('Da fatan za a zaɓi hoton kawai');
        return;
      }
      
      // Validate file size (max 10MB for article images)
      if (file.size > 10 * 1024 * 1024) {
        showErrorToast('Hoton ya yi girma da yawa. Matsakaicin girman shine 10MB');
        return;
      }

      setFormData({
        ...formData,
        coverImageFile: file,
        coverImage: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async (publish: boolean) => {
    setIsSaving(true);
    
    // Validation
    if (!formData.title || !formData.content || !formData.categoryId || !formData.authorId) {
      showErrorToast('Da fatan za a cika dukkan filayen masu mahimmanci');
      setIsSaving(false);
      return;
    }

    try {
      let coverImageUrl = formData.coverImage;
      
      // Upload cover image if a new file is provided
      if (formData.coverImageFile) {
        const bucketId = import.meta.env.PUBLIC_APPWRITE_BUCKET_ARTICLE_IMAGES;
        const uploadResult = await storageService.uploadFile(bucketId, formData.coverImageFile);
        
        if (uploadResult.success && uploadResult.data) {
          // Get the file preview URL
          coverImageUrl = storageService.getFilePreview(bucketId, uploadResult.data.$id, 800, 400);
        } else {
          console.error('Failed to upload cover image:', uploadResult.error);
          showErrorToast('An samu kuskure wajen loda hoton');
          setIsSaving(false);
          return;
        }
      }

      // Handle content based on editor mode
      let contentToSave = formData.content;
      if (editorMode === 'markdown') {
        contentToSave = marked(formData.content);
      }

      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: contentToSave,
        categoryId: formData.categoryId,
        authorId: formData.authorId,
        tags: formData.tags.length > 0 ? formData.tags : [], // Send empty array if no tags
        coverImage: coverImageUrl || '', // Ensure it's a string, not undefined
        status: publish ? ('published' as const) : ('draft' as const),
        featured: formData.featured,
        views: 0,
      };

      if (isEditing && articleId) {
        // Update existing article
        const result = await articleService.updateArticle(articleId, articleData);
        
        if (result.success) {
          showSuccessToast(publish ? 'An buga labarin!' : 'An sabunta daftarin!');
          setTimeout(() => {
            window.location.href = '/admin/articles';
          }, 1500);
        } else {
          showErrorToast('An samu kuskure wajen sabunta labarin: ' + result.error);
        }
      } else {
        // Create new article
        const result = await articleService.createArticle(articleData);
        
        if (result.success) {
          showSuccessToast(publish ? 'An buga labarin!' : 'An adana a matsayin daftari!');
          setTimeout(() => {
            window.location.href = '/admin/articles';
          }, 1500);
        } else {
          showErrorToast('An samu kuskure wajen ƙara labarin: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Error saving article:', error);
      showErrorToast('An samu kuskure wajen adana labarin');
    } finally {
      setIsSaving(false);
    }
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Abun Ciki *
              </label>
              <button
                type="button"
                onClick={() => setEditorMode(editorMode === 'rich' ? 'markdown' : 'rich')}
                className="text-sm text-blue-600 hover:underline"
              >
                Switch to {editorMode === 'rich' ? 'Markdown' : 'Rich Text'} Editor
              </button>
            </div>
            {editorMode === 'rich' ? (
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Fara rubuta labarin a nan..."
              />
            ) : (
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Fara rubuta labarin a nan... (Markdown supported)"
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kalma *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Zaɓi kalma...</option>
                {categories.map((cat) => (
                  <option key={cat.$id} value={cat.$id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Marubucin *
              </label>
              {isAuthorMode ? (
                <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-400">
                  {currentAuthorName || 'Ana ɗaukar...'}
                </div>
              ) : (
                <select
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Zaɓi marubucin...</option>
                  {authors.map((author) => (
                    <option key={author.$id} value={author.$id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Tags Section */}
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

          {/* Cover Image */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hoton Murfin
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <FiUpload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Danna don zaɓar hoto ko ja shi nan
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PNG, JPG, WEBP har zuwa 10MB
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.coverImage && (
                <div className="relative">
                  <img
                    src={formData.coverImage}
                    alt="Preview"
                    className="w-full max-h-96 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: '', coverImageFile: null })}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Featured Article Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Labari Mai Muhimmanci
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Nuna wannan labarin a babban shafi
                </p>
              </div>
            </label>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Category Badge */}
            {formData.categoryId && categories.find(c => c.$id === formData.categoryId) && (
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-full">
                  {categories.find(c => c.$id === formData.categoryId)?.name}
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
              dangerouslySetInnerHTML={{ __html: editorMode === 'markdown' ? marked(formData.content) : formData.content || '<p>Babu abun ciki...</p>' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}