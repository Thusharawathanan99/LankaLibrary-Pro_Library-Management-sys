import Link from 'next/link';
import { BookMarked, ArrowLeftRight, Users, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const pendingReturns = [
  { id: 'BK001', title: 'Mahavamsa — The Great Chronicle', borrower: 'Thilina Rajapaksa', due: '2024-12-10', status: 'Due soon' },
  { id: 'BK002', title: 'Epochs of Ceylon History', borrower: 'LIB-9921', due: '2024-11-25', status: 'Overdue' },
  { id: 'BK003', title: 'Island of Lanka', borrower: 'Dilani Fernando', due: '2024-12-15', status: 'On time' },
];

export default function StaffDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#004ac6]">Staff Dashboard</h2>
        <p className="text-sm text-[#434655] mt-1">Welcome — manage today&apos;s circulation and member services.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Issues Today', value: '23', icon: BookMarked, color: 'bg-blue-500/10 text-[#004ac6]' },
          { label: 'Returns Today', value: '18', icon: ArrowLeftRight, color: 'bg-emerald-500/10 text-emerald-700' },
          { label: 'Active Members', value: '1,024', icon: Users, color: 'bg-amber-500/10 text-[#855300]' },
          { label: 'Overdue Items', value: '47', icon: AlertTriangle, color: 'bg-red-500/10 text-[#ba1a1a]' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl p-5" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)' }}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-bold text-[#191c1e]">{stat.value}</p>
              <p className="text-xs text-[#434655]/70 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/staff/issue-books" className="rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-1 transition-all cursor-pointer" style={{ background: '#004ac6', boxShadow: '0 12px 32px rgba(0,74,198,0.25)' }}>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><BookMarked className="w-5 h-5 text-white" /></div>
          <h3 className="text-xl font-bold text-white">Issue a Book</h3>
          <p className="text-white/70 text-sm">Check out books to registered members with due date tracking.</p>
        </Link>
        <Link href="/staff/return-books" className="rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-1 transition-all cursor-pointer" style={{ background: '#fea619', boxShadow: '0 12px 32px rgba(254,166,25,0.25)' }}>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><ArrowLeftRight className="w-5 h-5 text-[#684000]" /></div>
          <h3 className="text-xl font-bold text-[#684000]">Return a Book</h3>
          <p className="text-[#684000]/70 text-sm">Process book returns and calculate any applicable fines.</p>
        </Link>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c3c6d7]/20">
          <h3 className="font-semibold text-[#191c1e] flex items-center gap-2"><Clock className="w-4 h-4 text-[#004ac6]" /> Pending Returns</h3>
          <Link href="/admin/reports" className="text-xs text-[#004ac6] hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-[#c3c6d7]/10">
          {pendingReturns.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#f2f4f6]/50 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#191c1e]">{item.title}</p>
                <p className="text-xs text-[#434655]/60">{item.borrower} · Due: {item.due}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.status === 'Overdue' ? 'bg-red-100 text-[#ba1a1a]' : item.status === 'Due soon' ? 'bg-amber-100 text-[#684000]' : 'bg-emerald-100 text-emerald-700'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
