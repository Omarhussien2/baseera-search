'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'لوحة التحكم', icon: '🏠' },
  { href: '/search', label: 'البحث', icon: '🔍' },
  { href: '/feed', label: 'الرصد الحي', icon: '📡' },
  { href: '/reports', label: 'التقارير', icon: '📊' },
  { href: '/alerts', label: 'التنبيهات', icon: '🔔' },
  { href: '/settings', label: 'الإعدادات', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 rounded-lg bg-brand-900 p-2 text-white shadow-lg lg:hidden"
        aria-label="تبديل القائمة"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-nav fixed top-0 right-0 z-40 flex h-full w-64 flex-col border-l border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-950 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-800">
          <span className="text-2xl">🔎</span>
          <div>
            <h1 className="text-lg font-bold text-brand-900 dark:text-brand-200">بصيرة</h1>
            <p className="text-xs text-gray-500">بحث ورصد إعلامي</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-900 dark:bg-brand-900/20 dark:text-brand-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <p className="text-xs text-gray-400">بصيرة v0.1.0</p>
          <p className="text-xs text-gray-400">Powered by Agent-Reach</p>
        </div>
      </aside>
    </>
  );
}
