import { useState } from 'react';
import { FiGlobe, FiUser, FiSearch, FiMail, FiShield, FiDatabase } from 'react-icons/fi';

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  language: string;
  timezone: string;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  twitterHandle: string;
}

interface UserSettings {
  enableRegistration: boolean;
  requireEmailVerification: boolean;
  allowComments: boolean;
  moderateComments: boolean;
}

export default function SettingsPanel() {
  const [activeSection, setActiveSection] = useState('site');
  const [saved, setSaved] = useState(false);

  const sections: SettingsSection[] = [
    { id: 'site', name: 'Saitunan Gaba ɗaya', icon: FiGlobe },
    { id: 'seo', name: 'SEO', icon: FiSearch },
    { id: 'users', name: 'Masu Amfani', icon: FiUser },
    { id: 'email', name: 'Imel', icon: FiMail },
    { id: 'security', name: 'Tsaro', icon: FiShield },
    { id: 'database', name: 'Database', icon: FiDatabase },
  ];

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'Technologiya',
    siteDescription: 'Labarun Fasaha da Kimiyya cikin Hausa',
    siteUrl: 'https://technologiya.com',
    contactEmail: 'contact@technologiya.com',
    language: 'ha',
    timezone: 'Africa/Lagos',
  });

  // SEO Settings
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    metaTitle: 'Technologiya - Labarun Fasaha da Kimiyya cikin Hausa',
    metaDescription: 'Karanta sabbin labarai game da fasaha, kimiyya, da cigaba a cikin harshen Hausa.',
    metaKeywords: 'fasaha, kimiyya, hausa, labarai, technology',
    ogImage: '/og-image.jpg',
    twitterHandle: '@technologiya',
  });

  // User Settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    enableRegistration: true,
    requireEmailVerification: true,
    allowComments: true,
    moderateComments: true,
  });

  const handleSave = () => {
    // TODO: Save to Appwrite database
    console.log('Saving settings...', { siteSettings, seoSettings, userSettings });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>
          Saitunan
        </h2>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{section.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Site Settings */}
        {activeSection === 'site' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Saitunan Gaba ɗaya
            </h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sunan Shafin
                </label>
                <input
                  type="text"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bayanin Shafin
                </label>
                <textarea
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL ɗin Shafin
                </label>
                <input
                  type="url"
                  value={siteSettings.siteUrl}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Imel ɗin Tuntuɓa
                </label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Harshe
                  </label>
                  <select
                    value={siteSettings.language}
                    onChange={(e) => setSiteSettings({ ...siteSettings, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ha">Hausa</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yankin Lokaci
                  </label>
                  <select
                    value={siteSettings.timezone}
                    onChange={(e) => setSiteSettings({ ...siteSettings, timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="Africa/Kano">Africa/Kano (WAT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Settings */}
        {activeSection === 'seo' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Saitunan SEO
            </h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {seoSettings.metaTitle.length}/60 haruffa
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {seoSettings.metaDescription.length}/160 haruffa
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={seoSettings.metaKeywords}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaKeywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Raba da koma (,)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Open Graph Image
                </label>
                <input
                  type="url"
                  value={seoSettings.ogImage}
                  onChange={(e) => setSeoSettings({ ...seoSettings, ogImage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Girman da aka ba da shawara: 1200x630px
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter Handle
                </label>
                <input
                  type="text"
                  value={seoSettings.twitterHandle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, twitterHandle: e.target.value })}
                  placeholder="@technologiya"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* User Settings */}
        {activeSection === 'users' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Saitunan Masu Amfani
            </h1>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Rijista Sabon Asusu
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Barin masu amfani su yi rajista
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.enableRegistration}
                    onChange={(e) => setUserSettings({ ...userSettings, enableRegistration: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Tabbatar da Imel
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Buƙaci tabbatar da imel kafin shiga
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.requireEmailVerification}
                    onChange={(e) => setUserSettings({ ...userSettings, requireEmailVerification: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Barin Sharhi
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Barin masu amfani su yi sharhi kan labarai
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.allowComments}
                    onChange={(e) => setUserSettings({ ...userSettings, allowComments: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Duba Sharhi
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duba sharhi kafin a buga
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.moderateComments}
                    onChange={(e) => setUserSettings({ ...userSettings, moderateComments: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeSection === 'email' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Saitunan Imel
            </h1>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300">
                Saitunan imel za a haɗa su da Appwrite bayan an gama haɗawa.
              </p>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeSection === 'security' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Saitunan Tsaro
            </h1>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300">
                Saitunan tsaro za a haɗa su da Appwrite bayan an gama haɗawa.
              </p>
            </div>
          </div>
        )}

        {/* Database Settings */}
        {activeSection === 'database' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Saitunan Database
            </h1>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300">
                Saitunan database za a haɗa su da Appwrite bayan an gama haɗawa.
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Ajiye Canje-canje
            </button>
            {saved && (
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                ✓ An ajiye saitunan
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
