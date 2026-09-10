'use client';
import { motion } from 'framer-motion';
import { Activity, Globe, ExternalLink, Hash } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FeedPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/monitor/feed')
      .then(res => res.json())
      .then(data => {
        if(data && data.items) setItems(data.items);
        else if (Array.isArray(data)) setItems(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
        <div className="p-4 bg-brand-100 text-brand-600 rounded-2xl dark:bg-brand-900/40"><Activity className="h-7 w-7" /></div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">الرصد الحي 📡</h1>
          <p className="text-gray-500 font-medium mt-1">دي النتائج الحقيقية اللي سحبناها من النت دلوقتي!</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-brand-600">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <Activity className="h-10 w-10" />
          </motion.div>
          <p className="mt-4 font-bold text-gray-500">جاري تحميل الداتا...</p>
        </div>
      ) : items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold dark:text-white">مفيش داتا لسه!</h3>
          <p className="text-gray-500 mt-2 font-medium">ارجع لصفحة البحث ودوّر على حاجة الأول.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                    {item.platform === 'web' ? <Globe className="h-4 w-4 text-brand-500"/> : <Hash className="h-4 w-4 text-brand-500"/>}
                    <span className="font-bold text-xs text-gray-600 dark:text-gray-300 capitalize">{item.platform}</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${item.sentiment === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : item.sentiment === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                    {item.sentiment === 'positive' ? 'إيجابي 🟢' : item.sentiment === 'negative' ? 'سلبي 🔴' : 'محايد ⚪'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 line-clamp-2">{item.title || 'بدون عنوان'}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">{item.content}</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-4 mt-4">
                <span className="text-xs text-gray-400 font-medium">سُحب الآن</span>
                <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 transition-colors bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-lg">
                  <span>زور المصدر</span> <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
