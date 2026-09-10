'use client';
import { motion } from 'framer-motion';
import { Search, Globe, Hash, PlaySquare, Users, Camera, MessageSquare, Briefcase, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const platforms = [
  { id: 'web', name: 'المواقع الإلكترونية', icon: Globe },
  { id: 'twitter', name: 'تويتر (X)', icon: Hash },
  { id: 'youtube', name: 'يوتيوب', icon: PlaySquare },
  { id: 'facebook', name: 'فيسبوك', icon: Users },
  { id: 'instagram', name: 'إنستجرام', icon: Camera },
  { id: 'reddit', name: 'ريديت', icon: MessageSquare },
  { id: 'linkedin', name: 'لينكد إن', icon: Briefcase },
];

export default function SearchPage() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['web']);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(['web', 'linkedin']);

  useEffect(() => {
    const saved = localStorage.getItem('connectedPlatforms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConnectedPlatforms(['web', ...parsed]);
      } catch (e) {
        // keep default
      }
    }
  }, []);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords.trim()) return;
    
    setIsSearching(true);
    
    try {
      const keywordList = keywords.split(' ').filter(k => k.trim() !== '');
      const aiProvider = localStorage.getItem('aiProvider') || 'heuristic';
      const apiKey = localStorage.getItem('apiKey') || '';
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: keywordList,
          platforms: selectedPlatforms,
          date_range: startDate && endDate ? { from: startDate, to: endDate } : undefined,
          aiSettings: { provider: aiProvider, apiKey: apiKey }
        })
      });
      
      const data = await response.json();
      
      if (data && data.items) {
        localStorage.setItem('feedItems', JSON.stringify(data.items));
        localStorage.setItem('lastQuery', keywords);
        localStorage.setItem('lastSearchStats', JSON.stringify({
          total: data.total_count || data.items.length,
          platforms: data.platforms_searched || selectedPlatforms,
          duration: data.query_duration_ms || 0
        }));
      }

      router.push('/feed');
    } catch (error) {
      console.error(error);
      setIsSearching(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">عايز تدور على إيه؟ 🔍</h1>
        <p className="text-gray-500 font-medium">بحث وسحب بيانات حقيقي من الإنترنت وتحليل المشاعر بالذكاء الاصطناعي فوراً!</p>
      </div>

      <motion.form onSubmit={handleSearch} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">كلمات البحث (افصل بينهم بمسافة)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500" />
            </div>
            <input 
              type="text" 
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="مثال: هداية ثون هاكاثون هداية Hidayathon" 
              className="block w-full pl-4 pr-12 py-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 focus:ring-0 focus:border-brand-500 font-medium"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">من تاريخ</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="block w-full px-4 py-3 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 font-medium" />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">إلى تاريخ</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="block w-full px-4 py-3 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 font-medium" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">دوّر فين بالظبط؟</label>
            <span className="text-xs text-gray-400 font-medium">المنصات المتصلة عليها علامة خضراء 🟢</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {platforms.map((p) => {
              const isConnected = p.id === 'web' || connectedPlatforms.includes(p.id);

              return (
                <label 
                  key={p.id} 
                  className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    selectedPlatforms.includes(p.id)
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' 
                      : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={selectedPlatforms.includes(p.id)} 
                      onChange={() => togglePlatform(p.id)} 
                      className="rounded text-brand-600 focus:ring-brand-500 h-5 w-5 border-gray-300" 
                    />
                    <p.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{p.name}</span>
                  </div>

                  {isConnected ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-xs font-bold border border-green-200 dark:border-green-800">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      متصل 🟢
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 rounded-lg text-xs font-medium">
                      يحتاج ربط ⚠️
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSearching} 
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-4 rounded-2xl mt-4 transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 text-base"
        >
          {isSearching ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>جاري السحب الحقيقي من الإنترنت والتحليل... ⏳</span>
            </>
          ) : (
            <span>يلا دوّر 🚀</span>
          )}
        </button>
      </motion.form>
    </motion.div>
  );
}
