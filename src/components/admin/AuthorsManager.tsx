import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiUser, FiMail, FiFileText, FiX, FiSave } from 'react-icons/fi';

interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  role: string;
  articleCount: number;
  joinedAt: string;
}

export default function AuthorsManager() {
  const [authors, setAuthors] = useState<Author[]>([
    {
      id: '1',
      name: 'Musa Ibrahim',
      email: 'musa@technologiya.com',
      bio: 'Mai rubuce-rubuce na fasaha da kwararre a fannin AI da Machine Learning.',
      avatar: 'https://ui-avatars.com/api/?name=Musa+Ibrahim&background=3B82F6&color=fff',
      role: 'Babban Marubucin',
      articleCount: 25,
      joinedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Aisha Mohammed',
      email: 'aisha@technologiya.com',
      bio: 'Masaniya a fannin hanyoyin sadarwa da intanet.',
      avatar: 'https://ui-avatars.com/api/?name=Aisha+Mohammed&background=8B5CF6&color=fff',
      role: 'Marubuciya',
      articleCount: 18,
      joinedAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Ibrahim Yusuf',
      email: 'ibrahim@technologiya.com',
      bio: 'Kwararre a rubuta labaran wayoyi da na\'urorin hannu.',
      avatar: 'https://ui-avatars.com/api/?name=Ibrahim+Yusuf&background=10B981&color=fff',
      role: 'Marubucin',
      articleCount: 15,
      joinedAt: '2024-03-10',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    role: 'Marubucin',
  });

  const handleOpenModal = (author?: Author) => {
    if (author) {
      setEditingAuthor(author);
      setFormData({
        name: author.name,
        email: author.email,
        bio: author.bio,
        avatar: author.avatar,
        role: author.role,
      });
    } else {
      setEditingAuthor(null);
      setFormData({
        name: '',
        email: '',
        bio: '',
        avatar: '',
        role: 'Marubucin',
      });
    }
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

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert('Da fatan za a cika dukkan filayen masu mahimmanci');
      return;
    }

    if (editingAuthor) {
      // Update existing author
      setAuthors(
        authors.map((author) =>
          author.id === editingAuthor.id
            ? { ...author, ...formData }
            : author
        )
      );
    } else {
      // Add new author
      const newAuthor: Author = {
        id: Date.now().toString(),
        ...formData,
        articleCount: 0,
        joinedAt: new Date().toISOString().split('T')[0],
      };
      setAuthors([...authors, newAuthor]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const author = authors.find((a) => a.id === id);
    if (author && author.articleCount > 0) {
      alert(`Ba za a iya share wannan marubucin ba saboda yana da labarai ${author.articleCount}`);
      return;
    }

    if (confirm('Shin kana tabbatar da share wannan marubucin?')) {
      setAuthors(authors.filter((author) => author.id !== id));
    }
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

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div
            key={author.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <img
                src={author.avatar}
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
                  onClick={() => handleDelete(author.id)}
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
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
              {author.role}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {author.bio}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <FiMail className="w-4 h-4" />
                <span className="truncate">{author.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <FiFileText className="w-4 h-4" />
                <span>{author.articleCount} labari</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
              onClick={handleCloseModal}
            />

            {/* Modal Panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Matsayi
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Marubucin">Marubucin</option>
                    <option value="Marubuciya">Marubuciya</option>
                    <option value="Babban Marubucin">Babban Marubucin</option>
                    <option value="Editor">Editor</option>
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

                {/* Avatar URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.avatar && (
                    <div className="mt-2">
                      <img
                        src={formData.avatar}
                        alt="Preview"
                        className="w-16 h-16 rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Soke
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors space-x-2"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{editingAuthor ? 'Sabunta' : 'Ƙara'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
