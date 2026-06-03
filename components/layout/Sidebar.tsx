'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  ArrowLeftRight,
  Users,
  Archive,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Plus,
  BookMarked,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: 'admin' | 'staff' | 'user';
}

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { href: '/admin/books', label: 'Book Catalog', icon: <BookOpen className="w-5 h-5" /> },
  { href: '/admin/users', label: 'Member Management', icon: <Users className="w-5 h-5" /> },
  { href: '/admin/staff', label: 'Staff Management', icon: <UserCheck className="w-5 h-5" /> },
  { href: '/admin/reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { href: '/admin/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { href: '/admin/settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
];

const staffNav: NavItem[] = [
  { href: '/staff/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { href: '/staff/issue-books', label: 'Issue Books', icon: <BookMarked className="w-5 h-5" /> },
  { href: '/staff/return-books', label: 'Return Books', icon: <ArrowLeftRight className="w-5 h-5" /> },
  { href: '/admin/books', label: 'Book Catalog', icon: <BookOpen className="w-5 h-5" /> },
  { href: '/admin/users', label: 'Members', icon: <Users className="w-5 h-5" /> },
  { href: '/admin/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
];

const userNav: NavItem[] = [
  { href: '/user/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { href: '/user/catalog', label: 'Browse Catalog', icon: <BookOpen className="w-5 h-5" /> },
  { href: '/user/history', label: 'Borrow History', icon: <Archive className="w-5 h-5" /> },
];

const navMap = { admin: adminNav, staff: staffNav, user: userNav };
const dashboardPaths = ['/admin/dashboard', '/staff/dashboard', '/user/dashboard'];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = navMap[role];

  const newEntryHref = role === 'admin' ? '/admin/books' : role === 'staff' ? '/staff/issue-books' : '/user/catalog';

  return (
    <aside className="flex flex-col h-screen py-6 w-64 fixed left-0 top-0 z-50 border-r border-amber-100/20"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px 0 rgba(37,99,235,0.08)',
      }}
    >
      {/* Header */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-base font-bold text-[#004ac6] leading-none">Ceylon Library</h1>
            <p className="text-xs text-[#434655]/70 mt-0.5">Management Portal</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isDashboard = dashboardPaths.includes(item.href);
          const isActive = isDashboard
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                isActive
                  ? 'text-[#004ac6] font-semibold bg-[#eceef0]/50 border-r-[3px] border-[#fea619]'
                  : 'text-[#434655] hover:text-[#004ac6] hover:bg-[#e0e3e5]/30'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pt-4 border-t border-[#c3c6d7]/20 space-y-0.5">
        <button
          onClick={() => router.push(newEntryHref)}
          className="w-full mb-3 flex items-center justify-center gap-2 bg-[#004ac6] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            router.push('/login');
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#434655] hover:text-[#004ac6] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Version */}
      <div className="px-5 pt-3 pb-1">
        <p className="text-[10px] text-[#434655]/30 font-mono">v2.1.0 — build 2026.06</p>
      </div>
    </aside>
  );
}
