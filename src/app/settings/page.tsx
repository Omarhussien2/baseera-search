'use client';
import { motion } from 'framer-motion';
import { Settings, Hash, Users, Camera, Globe, BrainCircuit, Key, CheckCircle2, Link2, MessageSquare, Briefcase, ExternalLink, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PlatformConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  authUrl: string;
}

const platforms: PlatformConfig[] = [
  { id: 'twitter', name: 'تويتر (X)', icon: Hash, color: 'text-gray-900 dark:text-gray-100', authUrl: 'https://x.com/i/flow/login' },
  { id: 'facebook', name: 'فيسبوك', icon: Users, color: 'text-blue-600', authUrl: 'https://www.facebook.com/login' },
  { id: 'instagram', name: 'إنستجرام', icon: Camera, color: 'text-pink-600', authUrl: 'https://www.instagram.com/accounts/login/' },
  { id: 'linkedin', name: 'لينكد إن', icon: Briefcase, color: 'text-blue-700', authUrl: 'https://www.linkedin.com/login' },
  { id: 'reddit', name: 'ريديت', icon: MessageSquare, color: 'text-orange-500', authUrl: 'https://www.reddit.com/login' },
];

export default function SettingsPage() {
  const [aiProvider, setAiProvider] = useState('heuristic');
  const [apiKey, setApiKey] = useState('');
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(['linkedin']);

  useEffect(() => {
    const savedProvider = localStorage.getItem('aiProvider');
    const savedKey = localStorage.getItem('apiKey');
    const savedPlatforms = localStorage.getItem('connectedPlatforms');

    if (savedProvider) setAiProvider(savedProvider);
    if (savedKey) setApiKey(savedKey);
    if (savedPlatforms) {
      try {
        setConnectedPlatforms(JSON.parse(savedPlatforms));
      } catch (e) {
        // Fallback default
      }
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('aiProvider', aiProvider);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('connectedPlatforms', JSON.stringify(connectedPlatforms));
    alert('تم حفظ الإعدادات بنجاح! 💾');
  };

  const handleConnect = async (platform: PlatformConfig) => {
    setConnecting(platform.id);

    // 1. Open the platform's real login page in a popup window for the user
    try {
      const popup = window.open(
        platform.authUrl,
        `connect_${platform.id}`,
        'width=650,height=750,menubar=no,status=no'
      );
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // In case popup was blocked by browser
        window.open(platform.authUrl, '_blank');
      }
    } catch (e) {
      console.warn('Could not open popup window:', e);
    }

    // 2. Notify backend to activate connector
    try {
      const res = await fetch('/api/auth/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: platform.id })
      });
      const data = await res.json();

      if (data.success) {
        const updated = Array.from(new Set([...connectedPlatforms, platform.id]));
        setConnectedPlatforms(updated);
        localStorage.setItem('connectedPlatforms', JSON.stringify(updated));
        alert(`تم فتح نافذة تسجيل الدخول وتفعيل موصل ${platform.name} بنجاح! ✅`);
      } else {
        alert(`فشل الربط: ${data.error || 'خطأ غير معروف'}`);
      }
    } catch (e) {
      alert('حدث خطأ أثناء الاتصال، برجاء المحاولة مرة أخرى.');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = (id: string, name: string) => {
    const updated = connectedPlatforms.filter(p => p !== id);
    setConnectedPlatforms(updated);
    localStorage.setItem('connectedPlatforms', JSON.stringify(updated));
    alert(`تم فصل حساب ${name} بنجاح.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
        <div className="p-4 bg-gray-100 text-gray-700 rounded-2xl dark:bg-gray-800 dark:text-gray-300">
          <Settings className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">ظبّط دنيتك ⚙️</h1>
          <p className="text-gray-500 font-medium mt-1">اربط حساباتك وفعّل الذكاء الاصطناعي عشان منصتك تشتغل بأقصى طاقة.</p>
        </div>
      </motion.div>

      {/* 1. Account Connections */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-brand-500" />
          ربط المنصات (Connectors)
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {platforms.map((platform) => {
              const isConnected = connectedPlatforms.includes(platform.id);

              return (
                <div key={platform.id} className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gray-50 dark:bg-gray-800 rounded-xl ${platform.color}`}>
                      <platform.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {platform.name}
                        {isConnected && (
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">
                        {isConnected ? 'الحساب متصل وجاهز للرصد الحي' : 'الحساب مش متصل، اضغط لفتح نافذة تسجيل الدخول'}
                      </p>
                    </div>
                  </div>
                  
                  {isConnected ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-xl font-bold text-sm border border-green-200 dark:border-green-900/30">
                        <CheckCircle2 className="h-4 w-4" />
                        متصل ✅
                      </span>
                      <button
                        onClick={() => handleDisconnect(platform.id, platform.name)}
                        title="فصل الحساب"
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleConnect(platform)}
                      disabled={connecting === platform.id}
                      className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-70 shadow-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {connecting === platform.id ? 'بيفتح المتصفح... ⏳' : 'اربط حسابك 🔗'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 2. AI Settings */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-purple-500" />
          محرك الذكاء الاصطناعي (لتحليل المشاعر)
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          
          {/* Select dropdown for AI Providers */}
          <div className="space-y-2">
            <label htmlFor="ai-provider-select" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
              اختر المزود (AI Providers)
            </label>
            <select
              id="ai-provider-select"
              aria-label="AI Providers"
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="w-full md:w-auto px-4 py-2.5 border-2 border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 font-medium text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
            >
              <option value="heuristic">قاموس الكلمات (أساسي)</option>
              <option value="gemini">Google Gemini API</option>
              <option value="tokenrouter">TokenRouter (Free GLM Models)</option>
              <option value="ollama">Local AI (Ollama)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${aiProvider === 'heuristic' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'}`}>
              <input type="radio" name="ai" value="heuristic" checked={aiProvider === 'heuristic'} onChange={() => setAiProvider('heuristic')} className="sr-only" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">قاموس الكلمات (أساسي)</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">سريع ومجاني، بيعتمد على قاموس مدمج بس دقته متوسطة</p>
            </label>

            <label className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${aiProvider === 'gemini' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'}`}>
              <input type="radio" name="ai" value="gemini" checked={aiProvider === 'gemini'} onChange={() => setAiProvider('gemini')} className="sr-only" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Google Gemini API</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">دقة ممتازة وبيدعم اللهجات العربية، بيحتاج مفتاح API</p>
            </label>

            <label className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${aiProvider === 'tokenrouter' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'}`}>
              <input type="radio" name="ai" value="tokenrouter" checked={aiProvider === 'tokenrouter'} onChange={() => setAiProvider('tokenrouter')} className="sr-only" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">TokenRouter (Free GLM Models)</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">نماذج GLM مجانية وسريعة عبر واجهة TokenRouter</p>
            </label>

            <label className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${aiProvider === 'ollama' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'}`}>
              <input type="radio" name="ai" value="ollama" checked={aiProvider === 'ollama'} onChange={() => setAiProvider('ollama')} className="sr-only" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Local AI (Ollama)</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">مجاني بالكامل وبيشتغل على جهازك، بيحتاج موارد عالية</p>
            </label>
          </div>

          {aiProvider !== 'heuristic' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">مفتاح الربط (API Key / Local URL)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={aiProvider === 'gemini' ? "AIzaSy..." : aiProvider === 'tokenrouter' ? "sk-..." : "http://localhost:11434"} 
                  className="block w-full pl-4 pr-12 py-3.5 border-2 border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 focus:ring-0 focus:border-brand-500 font-medium text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </motion.div>
          )}

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSaveSettings}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity"
            >
              حفظ الإعدادات 💾
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
