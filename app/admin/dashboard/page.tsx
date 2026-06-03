import {
  BookOpen,
  Users,
  ArrowLeftRight,
  AlertTriangle,
  TrendingUp,
  BookMarked,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    label: 'Total Books',
    value: '12,847',
    delta: '+124 this month',
    icon: BookOpen,
    color: 'bg-blue-500/10 text-[#004ac6]',
    href: '/admin/books',
  },
  {
    label: 'Total Members',
    value: '3,291',
    delta: '+47 this week',
    icon: Users,
    color: 'bg-amber-500/10 text-[#855300]',
    href: '/admin/users',
  },
  {
    label: 'Total Staff',
    value: '28',
    delta: '4 departments',
    icon: UserCheck,
    color: 'bg-orange-500/10 text-[#943700]',
    href: '/admin/staff',
  },
  {
    label: 'Issued Today',
    value: '143',
    delta: '+12% vs yesterday',
    icon: BookMarked,
    color: 'bg-emerald-500/10 text-emerald-700',
    href: '/admin/books',
  },
  {
    label: 'Returned Today',
    value: '89',
    delta: 'on schedule',
    icon: ArrowLeftRight,
    color: 'bg-sky-500/10 text-sky-700',
    href: '/admin/books',
  },
  {
    label: 'Overdue Books',
    value: '184',
    delta: '+8 from last week',
    icon: AlertTriangle,
    color: 'bg-red-500/10 text-[#ba1a1a]',
    href: '/admin/reports',
  },
  {
    label: 'Fine Collection',
    value: 'LKR 42,500',
    delta: '+12% this month',
    icon: DollarSign,
    color: 'bg-violet-500/10 text-violet-700',
    href: '/admin/reports',
  },
  {
    label: 'Active Borrowers',
    value: '1,024',
    delta: 'unique members',
    icon: TrendingUp,
    color: 'bg-teal-500/10 text-teal-700',
    href: '/admin/users',
  },
];

const recentActivity = [
  { user: 'Anura Senanayake', action: 'Borrowed "Epochs of Ceylon History"', time: '2 min ago', type: 'borrow' },
  { user: 'Kasuni Mendis', action: 'Returned "Island of Lanka"', time: '18 min ago', type: 'return' },
  { user: 'Dilani Fernando', action: 'Registered as new member', time: '1 hr ago', type: 'register' },
  { user: 'Thilina Rajapaksa', action: 'Fine paid — LKR 350', time: '2 hr ago', type: 'fine' },
  { user: 'Ruwan Perera', action: 'Overdue alert sent for "Mahavamsa"', time: '3 hr ago', type: 'alert' },
  { user: 'Admin', action: 'Added 12 new heritage manuscripts', time: 'Yesterday', type: 'catalog' },
];

const activityColors: Record<string, string> = {
  borrow: 'bg-blue-500/10 text-[#004ac6]',
  return: 'bg-emerald-500/10 text-emerald-700',
  register: 'bg-amber-500/10 text-[#855300]',
  fine: 'bg-red-500/10 text-[#ba1a1a]',
  alert: 'bg-orange-500/10 text-[#943700]',
  catalog: 'bg-sky-500/10 text-sky-700',
};

const topBooks = [
  { title: 'Mahavamsa — The Great Chronicle', borrows: 234, available: 3, total: 8 },
  { title: 'Epochs of Ceylon History', borrows: 189, available: 0, total: 5 },
  { title: 'Island of Lanka — Heritage Guide', borrows: 156, available: 2, total: 6 },
  { title: 'Ancient Buddhist Manuscripts Vol. I', borrows: 142, available: 1, total: 4 },
  { title: 'Kandyan Kingdom: A Visual History', borrows: 128, available: 5, total: 7 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#004ac6]">Admin Dashboard</h2>
          <p className="text-sm text-[#434655] mt-1">
            Welcome back — here is today&apos;s library at a glance.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/reports"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#c3c6d7]/50 hover:bg-[#eceef0] text-sm font-medium text-[#434655] transition-colors"
          >
            View Reports
          </Link>
          <Link
            href="/admin/books"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#004ac6] text-white text-sm font-semibold hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20"
          >
            Add New Book
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              style={{
                backdropFilter: 'blur(12px)',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#191c1e]">{stat.value}</p>
                <p className="text-xs text-[#434655]/70 mt-0.5">{stat.label}</p>
              </div>
              <p className="text-xs text-[#004ac6] font-medium">{stat.delta}</p>
            </Link>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            backdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-[#191c1e]">Recent Activity</h3>
            <Link
              href="/admin/notifications"
              className="text-xs text-[#004ac6] hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f2f4f6]/50 transition-colors cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${activityColors[item.type]}`}
                >
                  {item.user.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#191c1e] truncate">{item.user}</p>
                  <p className="text-xs text-[#434655] truncate">{item.action}</p>
                </div>
                <span className="text-xs text-[#434655]/50 whitespace-nowrap shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top books */}
        <div
          className="rounded-2xl p-6"
          style={{
            backdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-[#191c1e]">Top Borrowed</h3>
            <Link href="/admin/books" className="text-xs text-[#004ac6] hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {topBooks.map((book, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[#191c1e] leading-tight flex-1 truncate">
                    {book.title}
                  </p>
                  <span
                    className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      book.available === 0
                        ? 'bg-red-100 text-[#ba1a1a]'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {book.available}/{book.total}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#eceef0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#004ac6] rounded-full"
                      style={{ width: `${(book.borrows / 250) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#434655]/60">{book.borrows}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Issue a Book', href: '/staff/issue-books', color: 'bg-[#004ac6] text-white' },
          { label: 'Register Member', href: '/admin/users', color: 'bg-[#fea619] text-[#684000]' },
          { label: 'View Overdues', href: '/admin/reports', color: 'bg-[#ffdad6] text-[#93000a]' },
          { label: 'Generate Report', href: '/admin/reports', color: 'bg-[#eceef0] text-[#191c1e]' },
        ].map((q) => (
          <Link
            key={q.label}
            href={q.href}
            className={`${q.color} px-5 py-3.5 rounded-2xl text-sm font-semibold text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm`}
          >
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
