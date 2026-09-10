'use client';
import { motion } from 'framer-motion';
import { Search, Globe, Hash, PlaySquare, Users, Camera, MessageSquare, Briefcase, Rss } from 'lucide-react';
import { useState } from 'react';

const platforms = [
  { id: 'web', name: 'المواقع', icon: Globe },
  { id: 'twitter', name: 'تويتر (X)', icon: Hash },
  { id: 'youtube', name: 'يوتيوب', icon: PlaySquare },
  { id: 'facebook', name: 'فيسبوك', icon: Users },
  { id: 'instagram', name: 'إنستجرام', icon: Camera },
  { id: 'reddit', name: 'ريديت', icon: MessageSquare },
  { id: 'linkedin', name: 'لينكد إن', icon: Briefcase },
  { id: 'rss', name: 'RSS', icon: Rss },
];

export default function SearchPage() {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">عايز تدور على إيه؟ 🔍</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">اكتب الكلمات اللي في بالك، واختار المنصات.. وإحنا هنجيبلك الخلاصة من على النت كله!</p>
      </div>

      <motion.form 
        onSubmit={handleSearch}
        className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">كلمات البحث (افصل بينهم بمسافة)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="مثال: الذكاء الاصطناعي، تسويق، Baseera..." 
              className="block w-full pl-4 pr-12 py-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-0 focus:border-brand-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">دوّر فين بالظبط؟</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {platforms.map((p) => (
              <motion.label 
                key={p.id} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl cursor-pointer hover:bg-brand-50 hover:border-brand-200 dark:hover:bg-brand-900/30 transition-colors"
              >
                <input type="checkbox" defaultChecked={p.id === 'web' || p.id === 'twitter'} className="rounded text-brand-600 focus:ring-brand-500 h-5 w-5 border-gray-300" />
                <p.icon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{p.name}</span>
              </motion.label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSearching}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-4 rounded-2xl shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-4"
        >
          {isSearching ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Search className="h-5 w-5" />
            </motion.div>
          ) : 'يلا دوّر 🚀'}
        </button>
      </motion.form>
    </motion.div>
  );
}
