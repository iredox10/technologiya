import { useState, useEffect } from 'react';
import { settingsService } from '../../lib/appwriteServices';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../utils/toast';
import { FiGlobe, FiUser, FiSearch, FiMail, FiShield, FiDatabase, FiLoader, FiCheck, FiSave } from 'react-icons/fi';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sections: SettingsSection[] = [
    { id: 'site', name: 'Gaba ɗaya', icon: FiGlobe },
    { id: 'seo', name: 'SEO', icon: FiSearch },
    { id: 'users', name: 'Masu Amfani', icon: FiUser },
    { id: 'email', name: 'Imel', icon: FiMail },
    { id: 'security', name: 'Tsaro', icon: FiShield },
    { id: 'database', name: 'Database', icon: FiDatabase },
  ];

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'Technologiya',
    siteDescription: 'Labarun Fasaha da Kimiyya cikin Hausa',
    siteUrl: 'https://technologiyaa.netlify.app',
    contactEmail: 'contact@technologiya.com',
    language: 'ha',
    timezone: 'Africa/Lagos',
  });

  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    metaTitle: 'Technologiya - Labarun Fasaha da Kimiyya cikin Hausa',
    metaDescription: 'Karanta sabbin labarai game da fasaha, kimiyya, da cigaba a cikin harshen Hausa.',
    metaKeywords: 'fasaha, kimiyya, hausa, labarai, technology',
    ogImage: '/og-image.jpg',
    twitterHandle: '@technologiya',
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    enableRegistration: true,
    requireEmailVerification: true,
    allowComments: true,
    moderateComments: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await settingsService.getAllSettings();
      
      if (result.success && result.data) {
        const settingsMap: { [key: string]: string } = {};
        result.data.forEach((setting: any) => {
          settingsMap[setting.settingKey] = setting.settingValue;
        });

        if (settingsMap['siteName']) {
          setSiteSettings({
            siteName: settingsMap['siteName'] || 'Technologiya',
            siteDescription: settingsMap['siteDescription'] || '',
            siteUrl: settingsMap['siteUrl'] || '',
            contactEmail: settingsMap['contactEmail'] || '',
            language: settingsMap['language'] || 'ha',
            timezone: settingsMap['timezone'] || 'Africa/Lagos',
          });
        }

        if (settingsMap['metaTitle']) {
          setSeoSettings({
            metaTitle: settingsMap['metaTitle'] || '',
            metaDescription: settingsMap['metaDescription'] || '',
            metaKeywords: settingsMap['metaKeywords'] || '',
            ogImage: settingsMap['ogImage'] || '',
            twitterHandle: settingsMap['twitterHandle'] || '',
          });
        }

        if (settingsMap['enableRegistration']) {
          setUserSettings({
            enableRegistration: settingsMap['enableRegistration'] === 'true',
            requireEmailVerification: settingsMap['requireEmailVerification'] === 'true',
            allowComments: settingsMap['allowComments'] === 'true',
            moderateComments: settingsMap['moderateComments'] === 'true',
          });
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const allSettings = [
        { settingKey: 'siteName', settingValue: siteSettings.siteName, category: 'site' },
        { settingKey: 'siteDescription', settingValue: siteSettings.siteDescription, category: 'site' },
        { settingKey: 'siteUrl', settingValue: siteSettings.siteUrl, category: 'site' },
        { settingKey: 'contactEmail', settingValue: siteSettings.contactEmail, category: 'site' },
        { settingKey: 'language', settingValue: siteSettings.language, category: 'site' },
        { settingKey: 'timezone', settingValue: siteSettings.timezone, category: 'site' },
        { settingKey: 'metaTitle', settingValue: seoSettings.metaTitle, category: 'seo' },
        { settingKey: 'metaDescription', settingValue: seoSettings.metaDescription, category: 'seo' },
        { settingKey: 'metaKeywords', settingValue: seoSettings.metaKeywords, category: 'seo' },
        { settingKey: 'ogImage', settingValue: seoSettings.ogImage, category: 'seo' },
        { settingKey: 'twitterHandle', settingValue: seoSettings.twitterHandle, category: 'seo' },
        { settingKey: 'enableRegistration', settingValue: String(userSettings.enableRegistration), category: 'users' },
        { settingKey: 'requireEmailVerification', settingValue: String(userSettings.requireEmailVerification), category: 'users' },
        { settingKey: 'allowComments', settingValue: String(userSettings.allowComments), category: 'users' },
        { settingKey: 'moderateComments', settingValue: String(userSettings.moderateComments), category: 'users' },
      ];

      const result = await settingsService.batchUpdateSettings(allSettings);
      if (result.success) {
        showSuccessToast('An ajiye saitunan!');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        showErrorToast('An samu kuskure wajen ajiye saituna');
      }
    } catch (error) {
      showErrorToast('An samu kuskure');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Sidebar / Tabs */}
      <aside className="w-full lg:w-64 bg-gray-50 dark:bg-[#0f172a] border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 lg:p-6">
          <h2 className="hidden lg:block text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 italic">Saituna</h2>
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar gap-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 lg:shrink ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="whitespace-nowrap">{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Ana ɗauko bayanai...</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto lg:mx-0">
            {/* Site Settings */}
            {activeSection === 'site' && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Gaba ɗaya</h1>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Sunan Shafin</label>
                    <input type="text" value={siteSettings.siteName} onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Bayanin Shafin</label>
                    <textarea value={siteSettings.siteDescription} onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">URL ɗin Shafin</label>
                    <input type="url" value={siteSettings.siteUrl} onChange={(e) => setSiteSettings({ ...siteSettings, siteUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeSection === 'seo' && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Search Engine Optimization</h1>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Meta Title</label>
                    <input type="text" value={seoSettings.metaTitle} onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Twitter Handle</label>
                    <input type="text" value={seoSettings.twitterHandle} onChange={(e) => setSeoSettings({ ...seoSettings, twitterHandle: e.target.value })} placeholder="@technologiya" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* User Settings */}
            {activeSection === 'users' && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Masu Amfani</h1>
                <div className="space-y-4">
                  {[
                    { label: 'Rijista Sabon Asusu', state: userSettings.enableRegistration, key: 'enableRegistration' },
                    { label: 'Tabbatar da Imel', state: userSettings.requireEmailVerification, key: 'requireEmailVerification' },
                    { label: 'Barin Sharhi', state: userSettings.allowComments, key: 'allowComments' },
                    { label: 'Duba Sharhi Kafin Buga Shi', state: userSettings.moderateComments, key: 'moderateComments' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                      <button 
                        onClick={() => setUserSettings({ ...userSettings, [item.key]: !item.state })}
                        className={`w-12 h-6 rounded-full transition-all relative ${item.state ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.state ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other categories placeholder */}
            {['email', 'security', 'database'].includes(activeSection) && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-4 text-2xl"><FiDatabase /></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Ana Kan Aiki</h3>
                <p className="text-sm text-gray-500">Wannan sashin zai fara aiki ba da jimawa ba.</p>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs italic active:scale-95"
              >
                {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                <span>{saving ? 'Ana Ajiyewa...' : 'Ajiye Canje-canje'}</span>
              </button>
              {saved && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm animate-fade-in">
                  <FiCheck className="w-5 h-5" />
                  <span>An ajiye!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
