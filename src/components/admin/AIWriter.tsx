
import { useState } from 'react';
import { FiCpu, FiFileText, FiSliders, FiSave, FiEdit3, FiLoader } from 'react-icons/fi';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

export default function AIWriter() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'preview'>('input');
  
  // Input State
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'Informative',
    length: 2000,
    language: 'Hausa',
    provider: 'gemini',
    useSearch: true,
    sourceUrl: '',
    model: 'gpt-4o',
  });

  const GITHUB_MODELS = [
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Mafi kyau (Best)', group: 'OpenAI' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Sauri da arha', group: 'OpenAI' },
    { id: 'Mistral-large-2407', name: 'Mistral Large', description: 'Babban model', group: 'Mistral' },
    { id: 'Mistral-Nemo', name: 'Mistral Nemo', description: 'Matsakaici', group: 'Mistral' },
    { id: 'Meta-Llama-3.1-405B-Instruct', name: 'Llama 3.1 405B', description: 'Mafi girma', group: 'Meta' },
    { id: 'Meta-Llama-3.1-70B-Instruct', name: 'Llama 3.1 70B', description: 'Babban model', group: 'Meta' },
    { id: 'Meta-Llama-3.1-8B-Instruct', name: 'Llama 3.1 8B', description: 'Sauri', group: 'Meta' },
    { id: 'Meta-Llama-3-70B-Instruct', name: 'Llama 3 70B', description: 'Tsohon gwaninta', group: 'Meta' },
    { id: 'Meta-Llama-3-8B-Instruct', name: 'Llama 3 8B', description: 'Karami', group: 'Meta' },
    { id: 'AI21-Jamba-Instruct', name: 'Jamba Instruct', description: 'AI21 Labs', group: 'AI21' },
  ];

  // Generated Data State
  const [result, setResult] = useState<{
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    seoTitle: string;
    seoDescription: string;
    imagePrompt: string;
  } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setStep('preview');
        showSuccessToast('An samar da daftarin labarin!');
      } else {
        showErrorToast('Kuskure: ' + data.error);
      }
    } catch (error) {
      console.error('Generation error:', error);
      showErrorToast('An samu matsala wajen samar da labarin');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToEditor = () => {
    if (!result) return;

    // Save to session storage to be picked up by ArticleEditor
    sessionStorage.setItem('ai_draft_article', JSON.stringify({
      title: result.title,
      content: result.content, // Markdown content
      excerpt: result.excerpt,
      tags: result.tags || [],
      // We can also store the image prompt to help user generate an image later
      imagePrompt: result.imagePrompt
    }));

    // Redirect to new article page
    // We check if we are admin or author to direct to correct route
    const currentPath = window.location.pathname;
    const isAuthor = currentPath.includes('/author');
    
    window.location.href = isAuthor ? '/author/articles/new' : '/admin/articles/new';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
          <FiCpu className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Writer
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Samar da labarai masu inganci da taimakon AI
          </p>
        </div>
      </div>

      {step === 'input' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 animate-fade-in">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Topic */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Menene kake son rubutawa akai? (Topic)
              </label>
              <textarea
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Misali: Tasirin AI a rayuwar yau da kullum a Najeriya..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[100px]"
                required
              />
            </div>

            {/* Web Search Toggle */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl">🌍</span>
                  Binciken Yanar Gizo (Web Search)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Nemo sabbin bayanai daga intanet kafin rubuta labarin (Yana da amfani ga labaran yau da kullum).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.useSearch}
                  onChange={(e) => setFormData({ ...formData, useSearch: e.target.checked })}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Source URL / Specific Search Query */}
            {formData.useSearch && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Source URL ko Abun Bincike (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  placeholder="Misali: https://example.com/news-article ko 'latest iphone 16 release date'"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Idan ka bar wannan fanko, AI zata yi amfani da "Topic" don bincike. Idan ka sa URL, za a ziyarci shafin kai tsaye.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yanayin Rubutu (Tone)
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Informative">Mai Bayani (Informative)</option>
                  <option value="Casual">Na Yau da Kullum (Casual)</option>
                  <option value="Professional">Kwararru (Professional)</option>
                  <option value="Persuasive">Mai Gamsarwa (Persuasive)</option>
                  <option value="Humorous">Mai Ban Dariya (Humorous)</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Harshe
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Hausa">Hausa</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            {/* Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tsawon Labari (Kalmomi)
                </label>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  ~{formData.length} words
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Gajere (500)</span>
                <span>Doguwa (3000)</span>
              </div>
            </div>

            {/* Provider Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AI Provider
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, provider: 'gemini' })}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.provider === 'gemini'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  Google Gemini
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, provider: 'openrouter' })}
                  disabled
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 text-sm font-medium opacity-50 cursor-not-allowed"
                  title="Coming Soon"
                >
                  OpenRouter
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, provider: 'github', model: 'gpt-4o' })}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.provider === 'github'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  GitHub Copilot
                </button>
              </div>
            </div>

            {formData.provider === 'github' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Zaɓi Model (Select Model)
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {['OpenAI', 'Mistral', 'Meta', 'AI21'].map(group => (
                    <optgroup key={group} label={group}>
                      {GITHUB_MODELS.filter(m => m.group === group).map(model => (
                        <option key={model.id} value={model.id}>
                          {model.name} - {model.description}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    <span>Ana Rubutawa... (Yana iya ɗaukar daƙiƙa 30)</span>
                  </>
                ) : (
                  <>
                    <FiCpu className="w-5 h-5" />
                    <span>Rubuta Daftari (Generate Draft)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'preview' && result && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Actions Bar */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-4 z-10 shadow-lg">
             <button
                onClick={() => setStep('input')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm flex items-center gap-2"
             >
                ← Koma Baya
             </button>
             
             <button
                onClick={handleTransferToEditor}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-all active:scale-95"
             >
                <FiEdit3 className="w-5 h-5" />
                <span>Buɗe a Edita (Open in Editor)</span>
             </button>
          </div>

          {/* Result Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Title & SEO */}
              <div className="grid gap-6 border-b border-gray-100 dark:border-gray-700 pb-6">
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{result.title}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                       {result.tags && Array.isArray(result.tags) && result.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                             #{tag}
                          </span>
                       ))}
                    </div>
                 </div>
                 
                 <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">SEO Title</p>
                    <p className="text-gray-900 dark:text-white font-medium mb-3">{result.seoTitle}</p>
                    
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Meta Description</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{result.seoDescription}</p>
                 </div>
              </div>

              {/* Excerpt */}
              <div className="italic text-lg text-gray-600 dark:text-gray-300 border-l-4 border-purple-500 pl-4 py-1">
                 {result.excerpt}
              </div>

              {/* Body Content Preview */}
              <div>
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Content Preview (Markdown)</p>
                 <div className="prose prose-lg dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900 p-6 rounded-lg max-h-[500px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{result.content}</pre>
                 </div>
              </div>

              {/* Image Prompt */}
              {result.imagePrompt && (
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">AI Image Prompt Suggestion</p>
                    <p className="text-blue-900 dark:text-blue-100 text-sm font-medium">{result.imagePrompt}</p>
                 </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
