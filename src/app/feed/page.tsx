'use client';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function FeedPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
        <div className="p-4 bg-brand-100 text-brand-600 rounded-2xl dark:bg-brand-900/40 dark:text-brand-400">
          <Activity className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">الرصد الحي 📡</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">كل اللي بيتقال بيسمّع هنا لحظة بلحظة يا بطل!</p>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        <motion.div variants={item} className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="mx-auto w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-5">
            <Activity className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">مفيش داتا لسه!</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">الدنيا هادية خالص.. جرب تعمل بحث جديد عشان نصطاد لك الأخبار.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
