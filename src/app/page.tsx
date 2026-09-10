const statCards = [
  { label: 'مواد اليوم', value: '0', icon: '📄', color: 'text-blue-600' },
  { label: 'مواد الأسبوع', value: '0', icon: '📅', color: 'text-green-600' },
  { label: 'ملفات رصد نشطة', value: '0', icon: '📡', color: 'text-purple-600' },
  { label: 'تنبيهات جديدة', value: '0', icon: '🔔', color: 'text-orange-600' },
];

const connectors = [
  { name: 'المواقع الإلكترونية', platform: 'web', status: true, icon: '🌐' },
  { name: 'RSS', platform: 'rss', status: true, icon: '📰' },
  { name: 'تويتر / X', platform: 'twitter', status: false, icon: '🐦' },
  { name: 'يوتيوب', platform: 'youtube', status: false, icon: '📺' },
  { name: 'فيسبوك', platform: 'facebook', status: false, icon: '📘' },
  { name: 'إنستاغرام', platform: 'instagram', status: false, icon: '📷' },
  { name: 'ريديت', platform: 'reddit', status: false, icon: '💬' },
  { name: 'لينكدإن', platform: 'linkedin', status: false, icon: '💼' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-900 dark:text-brand-200">
          بصيرة
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          منصة البحث والرصد الإعلامي على الإنترنت
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className={`mt-1 text-3xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Connectors Status */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
          حالة الموصلات
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {connectors.map((c) => (
            <div
              key={c.platform}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <span className="text-2xl">{c.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {c.name}
                </p>
                <p className={`text-xs ${c.status ? 'text-green-600' : 'text-gray-400'}`}>
                  {c.status ? '✅ متصل' : '⬚ غير مهيأ'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
          إجراءات سريعة
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/search"
            className="rounded-lg bg-brand-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-800"
          >
            🔍 بحث جديد
          </a>
          <a
            href="/feed"
            className="rounded-lg border border-brand-900 px-6 py-3 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400"
          >
            📡 الرصد الحي
          </a>
          <a
            href="/reports"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300"
          >
            📊 التقارير
          </a>
        </div>
      </div>
    </div>
  );
}
