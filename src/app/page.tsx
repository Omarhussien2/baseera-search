'use client';
import { motion } from 'framer-motion';
import { FileText, Calendar, Radio, Bell, Search, Activity } from 'lucide-react';
import Link from 'next/link';

const statCards = [
  { label: 'مواد لقطناها النهاردة', value: '0', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { label: 'حصيلة الأسبوع ده', value: '0', icon: Calendar, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { label: 'ملفات رصد شغالة', value: '0', icon: Radio, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { label: 'تنبيهات بتنادي عليك', value: '0', icon: Bell, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">يا هلا بيك في بصيرة! 👋</h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 font-medium">إيه الأخبار النهاردة؟ دي لفة سريعة على كل اللي بيحصل حواليك.</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <motion.div key={idx} variants={item} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-shadow hover:shadow-md cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="mt-2 text-4xl font-black text-gray-900 dark:text-white">{card.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${card.bg}`}>
                <card.icon className={`h-7 w-7 ${card.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">إنجز حالك بسرعة ⚡</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/search" className="rounded-2xl bg-brand-600 px-8 py-4 text-base font-bold text-white shadow-sm hover:bg-brand-700 transition-all hover:shadow-md hover:-translate-y-1 flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>دوّر على حاجة</span>
          </Link>
          <Link href="/feed" className="rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-4 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:-translate-y-1 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <span>شوف الرصد الحي</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
