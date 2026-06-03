'use client';

import { Bell, Settings, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavbarProps {
  placeholder?: string;
  role?: 'admin' | 'staff' | 'user';
  userName?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Navbar({ placeholder = 'Search...', role = 'admin', userName = 'Admin Portal' }: NavbarProps) {
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const notifHref = role === 'admin' ? '/admin/notifications' : role === 'staff' ? '/staff/dashboard' : '/user/dashboard';
  const settingsHref = role === 'admin' ? '/admin/settings' : role === 'staff' ? '/staff/dashboard' : '/user/dashboard';

  return (
    <header
      className="flex items-center justify-between px-8 h-16 w-full sticky top-0 z-40 border-b border-amber-100/30"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 1px 12px 0 rgba(37,99,235,0.05)',
      }}
    >
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <span className="hidden md:block text-sm text-[#434655]/70 whitespace-nowrap">{greeting},</span>
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/40 group-focus-within:text-[#004ac6] transition-colors" />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-[#f2f4f6] border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-6">
        <Link
          href={notifHref}
          className="relative p-2 rounded-full hover:bg-[#eceef0] transition-colors"
        >
          <Bell className="w-5 h-5 text-[#434655]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full" />
        </Link>
        <Link href={settingsHref} className="p-2 rounded-full hover:bg-[#eceef0] transition-colors">
          <Settings className="w-5 h-5 text-[#434655]" />
        </Link>
        <div className="h-6 w-px bg-[#c3c6d7]/40 mx-1" />
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#004ac6] flex items-center justify-center text-white text-xs font-bold border-2 border-[#dbe1ff]">
            {initials}
          </div>
          <span className="hidden lg:block text-sm font-medium text-[#191c1e]">{userName}</span>
        </div>
      </div>
    </header>
  );
}
