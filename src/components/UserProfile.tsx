import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiEdit2, FiSave, FiMessageCircle, FiHeart, FiClock, FiLoader, FiCamera } from 'react-icons/fi';
import { authService, commentService, articleService } from '../lib/appwriteServices';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import type { Comment, Article } from '../types';

interface User {
  name: string;
  email: string;
  id: string;
  avatar?: string;
  bio?: string;
  joinedDate?: string;
}

interface UserComment extends Comment {
  articleTitle?: string;
  articleSlug?: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'comments'>('profile');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // Get current user from Appwrite
      const result = await authService.getCurrentUser();
      
      if (!result.success || !result.data) {
        // Redirect to login if not logged in
        window.location.href = '/user-login';
        return;
      }

      const appwriteUser = result.data;
      
      // Map Appwrite user to our User interface
      const userData: User = {
        id: appwriteUser.$id,
        name: appwriteUser.name,
        email: appwriteUser.email,
        avatar: appwriteUser.prefs?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${appwriteUser.name}`,
        bio: appwriteUser.prefs?.bio || '',
        joinedDate: appwriteUser.$createdAt
      };

      setUser(userData);
      setName(userData.name);
      setBio(userData.bio || '');
      setAvatar(userData.avatar || '');
      
      // Load user comments (TODO: implement when comment system is ready)
      loadUserComments(userData.id);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      showErrorToast('An sami kuskure wajen loda bayanan mai amfani');
      // Redirect to login on error
      setTimeout(() => {
        window.location.href = '/user-login';
      }, 2000);
    }
  };

  const loadUserComments = async (userId: string) => {
    try {
      // Fetch user comments from Appwrite
      const result = await commentService.getUserComments(userId);
      
      if (!result.success || !result.data) {
        setComments([]);
        return;
      }

      const userComments = result.data.documents as unknown as Comment[];
      
      // Enrich comments with article data
      const enrichedComments = await Promise.all(
        userComments.map(async (comment) => {
          try {
            // Fetch the article to get title and slug
            const articlesResult = await articleService.getArticles(1, 100);
            
            if (articlesResult.success && articlesResult.data) {
              const articles = articlesResult.data.documents as unknown as Article[];
              const article = articles.find(a => a.$id === comment.articleId);
              
              return {
                ...comment,
                articleTitle: article?.title || 'Unknown Article',
                articleSlug: article?.slug || '#'
              } as UserComment;
            }
            
            return {
              ...comment,
              articleTitle: 'Unknown Article',
              articleSlug: '#'
            } as UserComment;
          } catch (error) {
            console.error('Error fetching article for comment:', error);
            return {
              ...comment,
              articleTitle: 'Unknown Article',
              articleSlug: '#'
            } as UserComment;
          }
        })
      );
      
      setComments(enrichedComments);
    } catch (error) {
      console.error('Failed to load user comments:', error);
      setComments([]);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      // Update user preferences in Appwrite
      const result = await authService.updatePreferences({
        avatar: avatar || user.avatar,
        bio: bio
      });

      if (result.success) {
        // Update local user state
        const updatedUser = {
          ...user,
          name,
          bio,
          avatar: avatar || user.avatar
        };

        setUser(updatedUser);
        setIsEditing(false);
        showSuccessToast('An sabunta bayanan mai amfani cikin nasara');
      } else {
        showErrorToast('An sami kuskure wajen sabunta bayanan');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showErrorToast('An sami kuskure wajen sabunta bayanan');
    }
  };

  const generateAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}-${Date.now()}`;
    setAvatar(newAvatar);
    setAvatarError(false); // Reset error state when generating new avatar
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Yau';
    if (diffDays === 1) return 'Jiya';
    if (diffDays < 7) return `${diffDays} kwana da suka gabata`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} mako da suka gabata`;
    return `${Math.floor(diffDays / 30)} wata da suka gabata`;
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Ana loda bayanan mai amfani...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {!avatarError && (avatar || user.avatar) ? (
                <img
                  src={avatar || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-100 dark:border-blue-900 object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FiUser className="w-12 h-12 text-white" />
                </div>
              )}
              {isEditing && (
                <button
                  onClick={generateAvatar}
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                  title="Generate new avatar"
                >
                  <FiCamera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Suna
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bayani
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Rubuta wani bayani game da kanka..."
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                    <FiMail className="w-4 h-4" />
                    {user.email}
                  </p>
                  {user.bio && (
                    <p className="text-gray-700 dark:text-gray-300 mt-3">
                      {user.bio}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <FiClock className="w-4 h-4" />
                    <span>
                      Ya shiga {user.joinedDate ? formatDate(user.joinedDate) : 'kwanan nan'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Edit Button */}
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FiSave className="w-4 h-4" />
                    Ajiye
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name);
                      setBio(user.bio || '');
                      setAvatar(user.avatar || '');
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Soke
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Gyara
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {comments.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Sharhi
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {comments.reduce((acc, c) => acc + c.upvotes, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Upvotes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                0
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Abubuwan da aka soya
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Bayani
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'comments'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Sharhi Na
          </button>
        </div>

        {/* Content */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.$id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <a
                      href={`/articles/${comment.articleSlug}`}
                      className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {comment.articleTitle}
                    </a>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(comment.$createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiHeart className="w-4 h-4" />
                      <span>{comment.upvotes} upvotes</span>
                    </div>
                    <div className="px-2 py-1 rounded text-xs font-medium" style={{
                      backgroundColor: comment.status === 'approved' ? '#10b98120' : comment.status === 'pending' ? '#f59e0b20' : '#ef444420',
                      color: comment.status === 'approved' ? '#10b981' : comment.status === 'pending' ? '#f59e0b' : '#ef4444'
                    }}>
                      {comment.status === 'approved' ? 'An amince' : comment.status === 'pending' ? 'Ana jira' : 'An ƙi'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <FiMessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Ba ka da sharhi tukuna
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
