'use client';
import { motion } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';

export default function ReportsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl dark:bg-purple-900/30 dark:text-purple-400">
            <FileText className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">تقاريرك التمام 📊</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">هنا هتلاقي كل الخلاصة والإحصائيات متجمعة في مكان واحد.</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-bold shadow-sm transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>تقرير جديد</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-8 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
        >
          <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">لسه مفيش تقارير</h3>
          <p className="text-sm text-gray-500 font-medium mt-2">دوس هنا عشان تظبط أول تقرير ليك.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
