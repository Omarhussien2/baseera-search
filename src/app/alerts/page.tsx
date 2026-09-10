'use client';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function AlertsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl dark:bg-orange-900/30 dark:text-orange-400">
            <Bell className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">تنبيهاتك السريعة 🔔</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">مفيش حاجة تفوتك، أول ما يظهر جديد هنقولك هنا.</p>
          </div>
        </div>
        <button className="text-sm text-brand-600 hover:text-brand-700 font-bold bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-xl">قريت كله ✔️</button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-5 opacity-80" />
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">كله مقروء وزي الفل!</h3>
        <p className="text-gray-500 font-medium mt-2">روح اشرب قهوتك وانت مطمن، مفيش أي طوارئ دلوقتي.</p>
      </motion.div>
    </motion.div>
  );
}
