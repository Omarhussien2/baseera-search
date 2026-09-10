'use client';
import { motion } from 'framer-motion';
import { Activity, Globe, ExternalLink, Hash, PlaySquare, Users, Camera, MessageSquare, Briefcase, RefreshCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FeedPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastQuery, setLastQuery] = useState<string>('');

  useEffect(() => {
    // 1. First read immediate cached search results from localStorage
    const cachedItems = localStorage.getItem('feedItems');
    const query = localStorage.getItem('lastQuery');
    if (query) setLastQuery(query);

    if (cachedItems) {
      try {
        const parsed = JSON.parse(cachedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          setLoading(false);
        }
      } catch (e) {
        // continue to fetch
      }
    }

    // 2. Fetch from background API
    fetch('/api/monitor/feed')
      .then(res => res.json())
      .then(data => {
        const apiItems = data && data.items ? data.items : Array.isArray(data) ? data : [];
        if (apiItems.length > 0) {
          setItems(prev => {
            const ids = new Set(prev.map(p => p.id));
            const fresh = apiItems.filter((i: any) => !ids.has(i.id));
            return [...prev, ...fresh];
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <PlaySquare className="h-4 w-4 text-red-500" />;
      case 'twitter':
        return <Hash className="h-4 w-4 text-gray-900 dark:text-gray-100" />;
      case 'facebook':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'instagram':
        return <Camera className="h-4 w-4 text-pink-500" />;
      case 'reddit':
        return <MessageSquare className="h-4 w-4 text-orange-500" />;
      case 'linkedin':
        return <Briefcase className="h-4 w-4 text-blue-700" />;
      default:
        return <Globe className="h-4 w-4 text-brand-500" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'يوتيوب';
      case 'twitter': return 'تويتر (X)';
      case 'facebook': return 'فيسبوك';
      case 'instagram': return 'إنستجرام';
      case 'reddit': return 'ريديت';
      case 'linkedin': return 'لينكد إن';
      default: return 'المواقع';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-brand-100 text-brand-600 rounded-2xl dark:bg-brand-900/40">
            <Activity className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">الرصد الحي 📡</h1>
            <p className="text-gray-500 font-medium mt-1">
              {lastQuery ? `نتائج حقيقية لكلمة البحث: "${lastQuery}"` : 'دي النتائج الحقيقية اللي سحبناها من النت دلوقتي!'}
            </p>
          </div>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm self-start sm:self-auto"
        >
          <Search className="h-4 w-4" />
          <span>بحث جديد</span>
        </Link>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-brand-600">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <Activity className="h-10 w-10" />
          </motion.div>
          <p className="mt-4 font-bold text-gray-500">جاري تجميع الداتا الحية من المنصات...</p>
        </div>
      ) : items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl">
            📡
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">مفيش داتا لسه!</h3>
          <p className="text-gray-500 font-medium max-w-md mx-auto">
            ارجع لصفحة البحث ودوّر على أي موضوع (مثلاً: هداية ثون، أو الذكاء الاصطناعي) وشوف سحب الأخبار الحقيقي فوراً.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
          >
            <Search className="h-4 w-4" />
            <span>ابدأ بحثك الآن</span>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-bold text-gray-500 px-1">
            <span>تم العثور على {items.length} نتيجة حية</span>
            <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-800">
              ● تحديث مباشر
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <motion.div 
                key={item.id || idx} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.04 }} 
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                      {getPlatformIcon(item.platform)}
                      <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                        {getPlatformName(item.platform)}
                      </span>
                    </div>

                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      item.sentiment === 'positive' 
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                        : item.sentiment === 'negative' 
                        ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' 
                        : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                    }`}>
                      {item.sentiment === 'positive' ? 'إيجابي 🟢' : item.sentiment === 'negative' ? 'سلبي 🔴' : 'محايد ⚪'}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                    {item.title || 'منشور على ' + getPlatformName(item.platform)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-4 mt-2">
                  <span className="text-xs text-gray-400 font-medium">
                    {item.author ? `بواسطة: ${item.author}` : 'سُحب الآن'}
                  </span>
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 transition-colors bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-lg border border-brand-100 dark:border-brand-900/30"
                    >
                      <span>عرض المنشور</span> 
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
