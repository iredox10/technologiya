import { useState } from 'react';
import { FiUser, FiMail, FiCamera, FiSave } from 'react-icons/fi';

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  role: string;
  joinedAt: string;
}

export default function AuthorProfile() {
  // Mock profile data - will be replaced with Appwrite
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Musa Ibrahim',
    email: 'musa@technologiya.com',
    bio: 'Marubucin labaran fasaha mai son rubutu game da AI, wayoyi, da kimiyyar kwamfuta. Ina da shekaru 5 cikin aikin rubutu.',
    avatar: 'https://ui-avatars.com/api/?name=Musa+Ibrahim&background=3B82F6&color=fff',
    role: 'Marubucin',
    joinedAt: '2020-05-15',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // TODO: Implement Appwrite update
    console.log('Updating profile:', profileData);

    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleAvatarChange = () => {
    const url = prompt('Sanya URL ɗin hoton ka:', profileData.avatar);
    if (url) {
      setProfileData({ ...profileData, avatar: url });
    }
  };

  const generateAvatar = () => {
    const name = profileData.name.replace(/\s+/g, '+');
    const avatar = `https://ui-avatars.com/api/?name=${name}&background=10B981&color=fff&size=200`;
    setProfileData({ ...profileData, avatar });
  };

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
              onClick={handleAvatarChange}
              className="absolute bottom-0 right-0 p-2 bg-white text-green-600 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title="Canza hoto"
            >
              <FiCamera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{profileData.name}</h2>
            <p className="text-green-100 mb-2">{profileData.role}</p>
            <p className="text-sm text-green-100">
              Membro tun {new Date(profileData.joinedAt).toLocaleDateString('ha-NG', { year: 'numeric', month: 'long' })}
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
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={4}
              placeholder="Rubuta bayani game da kai..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {profileData.bio.length}/500 haruffa
            </p>
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
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">25</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Labarai</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">45.8K</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kallonin</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">3</p>
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
