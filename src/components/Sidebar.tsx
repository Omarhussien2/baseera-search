'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Activity, BarChart2, Bell, Settings, Menu, X, Eye } from 'lucide-react';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/search', label: 'دوّر هنا', icon: Search },
  { href: '/feed', label: 'الرصد الحي', icon: Activity },
  { href: '/reports', label: 'تقاريرك', icon: BarChart2 },
  { href: '/alerts', label: 'التنبيهات', icon: Bell },
  { href: '/settings', label: 'ظبّط دنيتك', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 right-4 z-50 rounded-2xl bg-brand-600 p-3 text-white shadow-lg lg:hidden">
        {isOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
      </button>

      {isOpen && <div className="fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar-nav fixed top-0 right-0 z-40 flex h-full w-72 flex-col bg-white dark:bg-gray-950 transition-transform duration-300 ease-in-out lg:translate-x-0 border-l border-gray-100 dark:border-gray-800 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-24 items-center gap-4 px-8 border-b border-gray-100 dark:border-gray-800">
          <div className="bg-brand-600 p-2.5 rounded-2xl shadow-sm">
            <Eye className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">بصيرة</h1>
            <p className="text-sm text-brand-600 dark:text-brand-400 font-bold">عينك على النت كله</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-5 py-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="block relative group">
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800/50" initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <div className={`relative flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-bold transition-all ${isActive ? 'text-brand-700 dark:text-brand-300' : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-200 group-hover:bg-gray-50 dark:group-hover:bg-gray-900/50'}`}>
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-brand-600 dark:text-brand-400' : ''}`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 dark:border-gray-800 p-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 text-center border border-gray-100 dark:border-gray-800">
            <p className="text-sm font-black text-gray-900 dark:text-gray-100">بصيرة v0.1</p>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-bold mt-1">عاش يا بطل! 🚀</p>
          </div>
        </div>
      </aside>
    </>
  );
}
