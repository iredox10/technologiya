import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCamera, FiSave, FiUpload } from 'react-icons/fi';
import { authService, authorService, articleService, storageService } from '../../lib/appwriteServices';
import type { Author } from '../../types';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../utils/toast';

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  role: string;
  joinedAt: string;
}

export default function AuthorProfile() {
  const [loading, setLoading] = useState(true);
  const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Author | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    draftArticles: 0,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      // Get current user
      const userResult = await authService.getCurrentUser();
      if (!userResult.success || !userResult.data) {
        showErrorToast('Please login first');
        window.location.href = '/author/login';
        return;
      }

      // Get author profile
      const authorResult = await authorService.getAuthorByUserId(userResult.data.$id);
      if (!authorResult.success || !authorResult.data) {
        showErrorToast('Author profile not found');
        return;
      }

      const author = authorResult.data;
      setCurrentAuthorId(author.$id);
      setProfileData(author as unknown as Author);

      // Load statistics
      const articlesResult = await articleService.getArticlesByAuthor(author.$id, 1, 1000); // Get all articles
      if (articlesResult.success && articlesResult.data) {
        const articles = articlesResult.data.documents as any[];
        setStats({
          totalArticles: articles.length,
          totalViews: articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0),
          draftArticles: articles.filter((a: any) => a.status === 'draft').length,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showErrorToast('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData || !currentAuthorId) {
      showErrorToast('Profile data not loaded');
      return;
    }

    setIsSaving(true);

    try {
      const result = await authorService.updateAuthor(currentAuthorId, {
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        avatar: profileData.avatar,
      });

      if (result.success) {
        showSuccessToast('An ajiye bayanan!');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        showErrorToast('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorToast('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileData) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showErrorToast('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showErrorToast('File size must be less than 2MB');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      showInfoToast('Uploading avatar...');

      // Upload to Appwrite Storage
      const uploadResult = await storageService.uploadFile('author-avatars', file);
      
      if (uploadResult.success && uploadResult.data) {
        const fileId = uploadResult.data.$id;
        const avatarUrl = storageService.getFileView('author-avatars', fileId).toString();
        
        setProfileData({ ...profileData, avatar: avatarUrl });
        showSuccessToast('Avatar uploaded successfully!');
      } else {
        showErrorToast('Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showErrorToast('Error uploading avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarURLChange = () => {
    if (!profileData) return;
    const url = prompt('Sanya URL ɗin hoton ka:', profileData.avatar);
    if (url) {
      setProfileData({ ...profileData, avatar: url });
    }
  };

  const generateAvatar = () => {
    if (!profileData) return;
    const name = profileData.name.replace(/\s+/g, '+');
    const avatar = `https://ui-avatars.com/api/?name=${name}&background=10B981&color=fff&size=200`;
    setProfileData({ ...profileData, avatar });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <button
              onClick={handleAvatarURLChange}
              className="absolute bottom-0 right-0 p-2 bg-white text-green-600 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title="Canza hoto"
            >
              <FiCamera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{profileData.name}</h2>
            <p className="text-green-100 mb-2">{profileData.role === 'admin' ? 'Admin' : 'Marubucin'}</p>
            <p className="text-sm text-green-100">
              Membro tun {new Date(profileData.$createdAt || '').toLocaleDateString('ha-NG', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Gyara Bayani Na
        </h3>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4" />
                <span>Suna</span>
              </div>
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>Imel</span>
              </div>
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bayani Game da Kai
            </label>
            <textarea
              value={profileData.bio || ''}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={4}
              placeholder="Rubuta bayani game da kai..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {(profileData.bio || '').length}/500 haruffa
            </p>
          </div>

          {/* Avatar File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Hoton
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                disabled={isUploadingAvatar}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className={`inline-flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-colors cursor-pointer ${
                  isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiUpload className="w-4 h-4" />
                <span>{isUploadingAvatar ? 'Ana uploading...' : 'Zabi Hoto'}</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG ko GIF (max 2MB)
              </p>
            </div>
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL ɗin Hoton
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                placeholder="https://..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={generateAvatar}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Ƙirƙira
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Sanya URL ɗin hoton ko danna "Ƙirƙira" don samar da hoto kai tsaye
            </p>
          </div>

          {/* Avatar Preview */}
          {profileData.avatar && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kallon Hoto
              </label>
              <img
                src={profileData.avatar}
                alt="Preview"
                className="w-32 h-32 rounded-full border-4 border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{isSaving ? 'Ana adanawa...' : 'Ajiye Canje-canje'}</span>
            </button>
            {saved && (
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                ✓ An ajiye bayanan
              </span>
            )}
          </div>
        </div>
      </form>

      {/* Statistics Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Ƙididdigar Aiki
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalArticles}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Labarai</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalViews > 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : stats.totalViews}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kallonin</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.draftArticles}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Daftari</p>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Canja Kalmar Sirri
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Don canja kalmar sirri, za a haɗa wannan da Appwrite bayan an gama haɗawa.
        </p>
        <button
          type="button"
          disabled
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-lg cursor-not-allowed"
        >
          Canja Kalmar Sirri
        </button>
      </div>
    </div>
  );
}
