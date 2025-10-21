import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiPlus, FiEdit, FiTrash2, FiUser, FiMail, FiFileText, FiX, FiSave, FiLoader, FiUpload } from 'react-icons/fi';
import { authorService, authService, storageService } from '../../lib/appwriteServices';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toast';
import type { Author } from '../../types';

export default function AuthorsManager() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    password: '', // For creating new auth user
    bio: '',
    avatar: '',
    avatarFile: null as File | null,
    role: 'author' as 'admin' | 'author',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    setIsMounted(true);
    fetchAuthors();
  }, []);

  useEffect(() => {
    console.log('Modal state changed:', isModalOpen);
  }, [isModalOpen]);

  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const result = await authorService.getAuthors();
      
      if (result.success && result.data) {
        // Extract documents array from Appwrite DocumentList
        const authorsData = Array.isArray(result.data) ? result.data : result.data.documents || [];
        setAuthors(authorsData as Author[]);
      } else {
        console.error('Failed to fetch authors:', result.error);
        setAuthors([]);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      setAuthors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (author?: Author) => {
    console.log('handleOpenModal called', author ? 'editing' : 'new author');
    if (author) {
      setEditingAuthor(author);
      setFormData({
        userId: author.userId || '',
        name: author.name,
        email: author.email,
        password: '',
        bio: author.bio || '',
        avatar: author.avatar || '',
        avatarFile: null,
        role: author.role || 'author',
        status: author.status || 'active',
      });
    } else {
      setEditingAuthor(null);
      setFormData({
        userId: '',
        name: '',
        email: '',
        password: '',
        bio: '',
        avatar: '',
        avatarFile: null,
        role: 'author',
        status: 'active',
      });
    }
    console.log('Setting isModalOpen to true');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
  };

  const generateAvatar = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`;
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      avatar: formData.avatar || generateAvatar(name),
    });
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showErrorToast('Da fatan za a zaɓi hoton kawai');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast('Hoton ya yi girma da yawa. Matsakaicin girman shine 5MB');
        return;
      }

      setFormData({
        ...formData,
        avatarFile: file,
        avatar: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      showErrorToast('Da fatan za a cika dukkan filayen masu mahimmanci');
      return;
    }

    // For new authors, password is required
    if (!editingAuthor && !formData.password) {
      showErrorToast('Da fatan za a shigar da kalmar sirri');
      return;
    }

    setIsSaving(true);
    try {
      let avatarUrl = formData.avatar;
      
      // Upload avatar file if provided
      if (formData.avatarFile) {
        const bucketId = import.meta.env.PUBLIC_APPWRITE_BUCKET_AUTHOR_AVATARS;
        const uploadResult = await storageService.uploadFile(bucketId, formData.avatarFile);
        
        if (uploadResult.success && uploadResult.data) {
          // Get the file preview URL (returns string URL)
          avatarUrl = storageService.getFilePreview(bucketId, uploadResult.data.$id, 200, 200);
        } else {
          console.error('Failed to upload avatar:', uploadResult.error);
          // Continue with generated avatar if upload fails
        }
      }

      if (editingAuthor) {
        // Update existing author
        const result = await authorService.updateAuthor(editingAuthor.$id, {
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          avatar: avatarUrl,
          role: formData.role,
          status: formData.status,
        });
        
        if (result.success) {
          await fetchAuthors();
          handleCloseModal();
          showSuccessToast('An sabunta marubucin cikin nasara!');
        } else {
          showErrorToast('An samu kuskure wajen sabunta marubucin: ' + result.error);
        }
      } else {
        // Create new auth user first
        const authResult = await authService.register(
          formData.email,
          formData.password,
          formData.name
        );
        
        if (!authResult.success || !authResult.data) {
          showErrorToast('An samu kuskure wajen ƙirƙirar asusu: ' + authResult.error);
          setIsSaving(false);
          return;
        }

        const userId = authResult.data.$id;
        
        // Now create the author document
        const result = await authorService.createAuthor({
          userId: userId,
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          avatar: avatarUrl || generateAvatar(formData.name),
          role: formData.role,
          status: formData.status,
          articleCount: 0,
        });
        
        if (result.success) {
          await fetchAuthors();
          handleCloseModal();
          showSuccessToast('✅ An ƙirƙira marubucin cikin nasara! Email: ' + formData.email);
        } else {
          showErrorToast('An samu kuskure wajen ƙara marubucin: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Error saving author:', error);
      showErrorToast('An samu kuskure wajen adana marubucin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    const author = authors.find((a) => a.$id === id);
    if (author && author.articleCount && author.articleCount > 0) {
      showWarningToast(`Ba za a iya share wannan marubucin ba saboda yana da labarai ${author.articleCount}`);
      return;
    }

    if (author) {
      setAuthorToDelete(author);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!authorToDelete) return;

    setIsDeleting(true);
    try {
      const result = await authorService.deleteAuthor(authorToDelete.$id);
      
      if (result.success) {
        await fetchAuthors();
        showSuccessToast('An share marubucin cikin nasara!');
        setIsDeleteModalOpen(false);
        setAuthorToDelete(null);
      } else {
        showErrorToast('An samu kuskure wajen share marubucin: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      showErrorToast('An samu kuskure wajen share marubucin');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAuthorToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Marubuta
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {authors.length} marubucin
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Ƙara Sabon Marubucin</span>
        </button>
      </div>

      {/* Debug indicator */}
      {isModalOpen && (
        <div className="bg-red-500 text-white p-4 rounded">
          Modal should be open! isModalOpen = {isModalOpen.toString()}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <div
                key={author.$id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={author.avatar || generateAvatar(author.name)}
                    alt={author.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(author)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      title="Gyara"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(author.$id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Share"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {author.name}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    author.role === 'admin' 
                      ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  }`}>
                    {author.role === 'admin' ? 'Admin' : 'Marubucin'}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    author.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
                  }`}>
                    {author.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {author.bio || 'Babu bayani'}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <FiMail className="w-4 h-4" />
                    <span className="truncate">{author.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <FiFileText className="w-4 h-4" />
                    <span>{author.articleCount || 0} labari</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {authors.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Babu marubuta a halin yanzu. Danna "Ƙara Sabon Marubucin" don farawa.
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
                    {editingAuthor ? 'Gyara Marubucin' : 'Ƙara Sabon Marubucin'}
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
                    placeholder="Sunan marubucin..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imel *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    disabled={!!editingAuthor}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {editingAuthor && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Ba za a iya canza imel ba
                    </p>
                  )}
                </div>

                {/* Password (only for new authors) */}
                {!editingAuthor && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kalmar Sirri *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Aƙalla haruffa 8"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Kalmar sirri don shiga cikin tsarin
                    </p>
                  </div>
                )}

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Matsayi
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'author' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="author">Marubucin</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bayani
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Bayani game da marubucin..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Avatar File Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hoton Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={formData.avatar || generateAvatar(formData.name || 'User')}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                        <FiUpload className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formData.avatarFile ? formData.avatarFile.name : 'Zaɓi Hoton'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG ko GIF (Matsakaicin 5MB)
                      </p>
                    </div>
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
                      <span>{editingAuthor ? 'Sabunta' : 'Ƙara'}</span>
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
                      Shin kana tabbatar da share wannan marubucin?
                    </p>
                    {authorToDelete && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                        <div className="flex items-center space-x-3">
                          {authorToDelete.avatar && (
                            <img
                              src={authorToDelete.avatar}
                              alt={authorToDelete.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {authorToDelete.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {authorToDelete.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Ba za a iya mayar da wannan aikin ba. Wannan zai share marubucin daga tsarin gudanarwa.
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
