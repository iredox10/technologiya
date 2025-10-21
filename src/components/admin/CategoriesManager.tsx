import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiPlus, FiEdit, FiTrash2, FiFolder, FiX, FiSave, FiLoader } from 'react-icons/fi';
import { categoryService } from '../../lib/appwriteServices';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toast';
import type { Category } from '../../types';

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6',
    icon: 'folder',
  });

  useEffect(() => {
    setIsMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const result = await categoryService.getCategories();
      
      if (result.success && result.data) {
        const categoriesData = result.data.documents as unknown as Category[];
        setCategories(categoriesData);
      } else {
        console.error('Failed to fetch categories:', result.error);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        color: category.color || '#3B82F6',
        icon: category.icon || 'folder',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        color: '#3B82F6',
        icon: 'folder',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      showErrorToast('Da fatan za a cika dukkan filayen masu mahimmanci');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        // Update existing category
        const result = await categoryService.updateCategory(editingCategory.$id, formData);
        
        if (result.success) {
          await fetchCategories();
          handleCloseModal();
          showSuccessToast('An sabunta kalmar cikin nasara!');
        } else {
          showErrorToast('An samu kuskure wajen sabunta kalmar: ' + result.error);
        }
      } else {
        // Add new category
        const result = await categoryService.createCategory({
          ...formData,
          articleCount: 0,
        });
        
        if (result.success) {
          await fetchCategories();
          handleCloseModal();
          showSuccessToast('An ƙara sabuwar kalma cikin nasara!');
        } else {
          showErrorToast('An samu kuskure wajen ƙara kalmar: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      showErrorToast('An samu kuskure wajen adana kalmar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    const category = categories.find((cat) => cat.$id === id);
    if (category && category.articleCount && category.articleCount > 0) {
      showWarningToast(`Ba za a iya share wannan kalma ba saboda yana da labarai ${category.articleCount}`);
      return;
    }

    if (category) {
      setCategoryToDelete(category);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const result = await categoryService.deleteCategory(categoryToDelete.$id);
      
      if (result.success) {
        await fetchCategories();
        showSuccessToast('An share kalmar cikin nasara!');
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
      } else {
        showErrorToast('An samu kuskure wajen share kalmar: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showErrorToast('An samu kuskure wajen share kalmar');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kalmomi
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {categories.length} kalma
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Ƙara Sabuwar Kalma</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.$id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color || '#3B82F6'}20` }}
                  >
                    <FiFolder className="w-6 h-6" style={{ color: category.color || '#3B82F6' }} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      title="Gyara"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.$id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Share"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {category.description || 'Babu bayani'}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-mono">
                    /{category.slug}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-semibold">
                    {category.articleCount || 0} labari
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {categories.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <FiFolder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Babu kalmomi a halin yanzu. Danna "Ƙara Sabuwar Kalma" don farawa.
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isMounted && isModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto bg-gray-900 bg-opacity-75"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}
          onClick={handleCloseModal}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            {/* Modal Panel */}
            <div 
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {editingCategory ? 'Gyara Kalma' : 'Ƙara Sabuwar Kalma'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suna *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Sunan kalmar..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="kalmar-slug"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bayani
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Bayani game da kalmar..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Launi
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Soke
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Ana aiki...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      <span>{editingCategory ? 'Sabunta' : 'Ƙara'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {isMounted && isDeleteModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto bg-gray-900 bg-opacity-75"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}
          onClick={cancelDelete}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div 
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Tabbatar da Share
                  </h3>
                  <button
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <FiTrash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
                      Shin kana tabbatar da share wannan kalma?
                    </p>
                    {categoryToDelete && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {categoryToDelete.name}
                        </p>
                        {categoryToDelete.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {categoryToDelete.description}
                          </p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Ba za a iya mayar da wannan aikin ba. Wannan zai share kalmar daga tsarin gudanarwa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Soke
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Ana sharewa...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      <span>Tabbatar da Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
