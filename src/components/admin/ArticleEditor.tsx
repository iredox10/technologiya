import { useState, useEffect } from 'react';
import { FiSave, FiEye, FiUpload, FiX, FiClock, FiCalendar } from 'react-icons/fi';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { articleService, categoryService, authorService, storageService, authService } from '../../lib/appwriteServices';
import type { Article, Category, Author } from '../../types';
import RichTextEditor from './RichTextEditor';
import { marked } from 'marked';
import { formatHausaDate, getReadingTime } from '../../utils/hausa';

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

  const [shareToSocial, setShareToSocial] = useState(true);
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
          // Get the file preview URL (1200x630 for better social sharing)
          coverImageUrl = storageService.getFilePreview(bucketId, uploadResult.data.$id, 1200, 630);
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
        contentToSave = await (marked as any).parse(formData.content);
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
          
          if (publish && shareToSocial) {
            try {
              await fetch('/api/share-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: formData.title,
                  excerpt: formData.excerpt,
                  slug: formData.slug,
                  image: coverImageUrl,
                  platforms: ['telegram', 'whatsapp']
                })
              });
            } catch (err) {
              console.error('Share error:', err);
            }
          }

          setTimeout(() => {
            window.location.href = isAuthorMode ? '/author/articles' : '/admin/articles';
          }, 1500);
        } else {
          showErrorToast('An samu kuskure wajen sabunta labarin: ' + result.error);
        }
      } else {
        // Create new article
        const result = await articleService.createArticle(articleData);
        
        if (result.success) {
          showSuccessToast(publish ? 'An buga labarin!' : 'An adana a matsayin daftari!');
          
          if (publish && shareToSocial) {
            try {
              await fetch('/api/share-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: formData.title,
                  excerpt: formData.excerpt,
                  slug: formData.slug,
                  image: coverImageUrl,
                  platforms: ['telegram', 'whatsapp']
                })
              });
            } catch (err) {
              console.error('Share error:', err);
            }
          }

          setTimeout(() => {
            window.location.href = isAuthorMode ? '/author/articles' : '/admin/articles';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors space-x-2"
          >
            <FiEye className="w-4 h-4" />
            <span>{showPreview ? 'Gyara' : 'Duba Samfurin'}</span>
          </button>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors space-x-2 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>Daftari</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50 shadow-lg shadow-blue-600/20"
          >
            <FiSave className="w-4 h-4" />
            <span>{isSaving ? 'Ana adanawa...' : (isEditing ? 'Sabunta' : 'Buga')}</span>
          </button>
        </div>
      </div>

      {!showPreview ? (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Title & Slug */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
              Taken Labarin *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Rubuta taken labarin..."
              className="w-full px-4 py-3 text-xl sm:text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-widest">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="labarin-slug"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
              Taƙaitaccen Bayani *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Rubuta taƙaitaccen bayani game da labarin..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Abun Ciki *
              </label>
              <button
                type="button"
                onClick={() => setEditorMode(editorMode === 'rich' ? 'markdown' : 'rich')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                Koma {editorMode === 'rich' ? 'Markdown' : 'Rich Text'}
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Rukuni *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Zaɓi rukuni...</option>
                {categories.map((cat) => (
                  <option key={cat.$id} value={cat.$id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Marubucin *
              </label>
              {isAuthorMode ? (
                <div className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium">
                  {currentAuthorName || 'Ana ɗaukar...'}
                </div>
              ) : (
                <select
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
              Alamomi (Tags)
            </label>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Rubuta alama..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={handleAddTag}
                type="button"
                className="px-6 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg"
              >
                Ƙara
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800"
                >
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900 dark:hover:text-white">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
              Hoton Murfin *
            </label>
            <div className="space-y-4">
              {!formData.coverImage ? (
                <label className="cursor-pointer group block">
                  <div className="flex flex-col items-center justify-center px-4 py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-900/50">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4 transition-transform group-hover:scale-110">
                      <FiUpload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Danna don zaɓar hoto</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP har zuwa 10MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              ) : (
                <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={formData.coverImage}
                    alt="Preview"
                    className="w-full max-h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <label className="p-3 bg-white text-gray-900 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-xl">
                      <FiUpload className="w-6 h-6" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    <button
                      onClick={() => setFormData({ ...formData, coverImage: '', coverImageFile: null })}
                      className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm space-y-6">
            <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Labari Mai Muhimmanci</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nuna wannan labarin a babban shafi (Bento Grid)</p>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={shareToSocial}
                  onChange={(e) => setShareToSocial(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Raba a Social Media</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Zai raba labarin kai tsaye a Telegram & WhatsApp idan ka buga shi</p>
              </div>
            </label>
          </div>
        </div>
      ) : (
        /* Preview Mode - Matches [slug].astro structure */
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
          <article className="min-h-screen bg-white dark:bg-[#030712]">
            
            {/* Hero Header */}
            <header className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex items-end overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 z-0 bg-gray-900">
                {formData.coverImage ? (
                  <img 
                    src={formData.coverImage} 
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                    <span className="text-sm">Babu Hoton Murfi</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent opacity-90"></div>
              </div>

              <div className="w-full px-4 sm:px-8 pb-12 sm:pb-16 pt-24 relative z-10">
                {/* Category & Date */}
                <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
                  {formData.categoryId && (
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                      {categories.find(c => c.$id === formData.categoryId)?.name || 'Rukuni'}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-gray-300 text-xs font-mono font-bold uppercase tracking-wider">
                    <FiCalendar className="w-3 h-3" />
                    {formatHausaDate(new Date(), 'full')}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight font-display drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  {formData.title || 'Taken Labarin'}
                </h1>

                {/* Author & Meta */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const author = authors.find(a => a.$id === formData.authorId);
                      return (
                        <>
                          <img 
                            src={author?.avatar || `https://ui-avatars.com/api/?name=${author?.name || 'Author'}`} 
                            alt={author?.name || 'Author'}
                            className="w-12 h-12 rounded-full border-2 border-white/20"
                          />
                          <div>
                            <p className="text-white font-bold text-sm">{author?.name || 'Sunan Marubuci'}</p>
                            <p className="text-gray-400 text-xs">Marubuci</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-300 font-mono">
                    <span className="flex items-center gap-2" title="Lokacin Karatu">
                      <FiClock className="w-4 h-4 text-blue-400" />
                      {getReadingTime(formData.content || '')}
                    </span>
                    <span className="flex items-center gap-2" title="Kallon">
                      <FiEye className="w-4 h-4 text-purple-400" />
                      <span>0</span>
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
              <div className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 sm:p-12 shadow-2xl border-t border-gray-100 dark:border-gray-800">
                
                {/* Article Body */}
                <div 
                  className="article-content prose prose-lg dark:prose-invert max-w-none font-serif text-gray-800 dark:text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: editorMode === 'markdown' ? marked.parse(formData.content) as string : formData.content || '<p className="text-gray-400">Babu abun ciki tukunna...</p>' }}
                />

                {/* Tags */}
                {formData.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span key={tag} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio Box */}
                {formData.authorId && (
                   (() => {
                      const author = authors.find(a => a.$id === formData.authorId);
                      if (author?.bio) {
                        return (
                          <div className="mt-16 p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                            <img 
                              src={author.avatar || `https://ui-avatars.com/api/?name=${author.name}`} 
                              alt={author.name}
                              className="w-20 h-20 rounded-full ring-4 ring-white dark:ring-gray-700 shadow-md"
                            />
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Game da {author.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {author.bio}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                   })()
                )}

              </div>
            </div>

          </article>
        </div>
      )}
    </div>
  );
}
