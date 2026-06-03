'use client';

import { useState } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, BookOpen, Users, DollarSign, AlertTriangle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const weeklyData = [
  { day: 'Mon', issued: 48, returned: 32, available: 1200 },
  { day: 'Tue', issued: 35, returned: 45, available: 1210 },
  { day: 'Wed', issued: 62, returned: 28, available: 1176 },
  { day: 'Thu', issued: 44, returned: 51, available: 1183 },
  { day: 'Fri', issued: 57, returned: 38, available: 1164 },
  { day: 'Sat', issued: 28, returned: 60, available: 1196 },
];

const fineData = [
  { week: 'Week 1', amount: 8200 },
  { week: 'Week 2', amount: 11500 },
  { week: 'Week 3', amount: 9800 },
  { week: 'Week 4', amount: 13000 },
];

const overdueByCategory = [
  { name: 'History', value: 40, color: '#004ac6' },
  { name: 'Fiction', value: 25, color: '#fea619' },
  { name: 'Literature', value: 20, color: '#943700' },
  { name: 'Science', value: 15, color: '#10b981' },
];

const topBorrowers = [
  { name: 'Thilina Rajapaksa', borrows: 218, overdue: 0, fines: 0 },
  { name: 'Anura Senanayake', borrows: 142, overdue: 1, fines: 350 },
  { name: 'Kasuni Mendis', borrows: 92, overdue: 0, fines: 0 },
  { name: 'Dilani Fernando', borrows: 56, overdue: 2, fines: 700 },
  { name: 'Chamara Bandara', borrows: 45, overdue: 0, fines: 0 },
];

const overdueBooks = [
  { id: 'BK002', title: 'Epochs of Ceylon History', borrower: 'LIB-0021', dueDate: '2024-11-15', daysOverdue: 18, fine: 900 },
  { id: 'BK006', title: 'Ancient Scripts of Lanka', borrower: 'LIB-0034', dueDate: '2024-11-20', daysOverdue: 13, fine: 650 },
  { id: 'BK001', title: 'Mahavamsa — Great Chronicle', borrower: 'LIB-9921', dueDate: '2024-11-22', daysOverdue: 11, fine: 550 },
  { id: 'BK008', title: 'Cinnamon Gardens', borrower: 'LIB-0045', dueDate: '2024-11-25', daysOverdue: 8, fine: 400 },
];

export default function ReportsPage() {
  const [range, setRange] = useState('Last 30 Days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#004ac6]">Reports &amp; Insights</h2>
          <p className="text-sm text-[#434655] mt-1">
            Real-time overview of library circulation and heritage archival growth.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#c3c6d7]/30 rounded-xl px-3 py-2 gap-2 shadow-sm">
            <Calendar className="w-4 h-4 text-[#434655]/60" />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none text-[#191c1e]"
            >
              {['Last 30 Days', 'Last Quarter', 'Last 12 Months', 'Custom Range'].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#c3c6d7]/30 text-sm font-medium text-[#434655] hover:bg-[#f2f4f6] transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004ac6] text-white text-sm font-semibold hover:bg-[#2563eb] transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Borrows', value: '2,847', delta: '+14%', up: true, icon: BookOpen, color: 'bg-blue-500/10 text-[#004ac6]' },
          { label: 'Active Members', value: '1,024', delta: '+8%', up: true, icon: Users, color: 'bg-amber-500/10 text-[#855300]' },
          { label: 'Fine Collected', value: 'LKR 42.5k', delta: '+12%', up: true, icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-700' },
          { label: 'Overdue Items', value: '184', delta: '+3%', up: false, icon: AlertTriangle, color: 'bg-red-500/10 text-[#ba1a1a]' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl p-5"
              style={{
                backdropFilter: 'blur(12px)',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span
                  className={`text-xs font-semibold flex items-center gap-0.5 ${
                    kpi.up ? 'text-emerald-600' : 'text-[#ba1a1a]'
                  }`}
                >
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.delta}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#191c1e]">{kpi.value}</p>
              <p className="text-xs text-[#434655]/70 mt-0.5">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar chart */}
        <div
          className="lg:col-span-8 rounded-2xl p-6"
          style={{
            backdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#191c1e]">Resource Availability</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#2563eb]" />
                <span className="text-xs text-[#434655]">Issued</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#fea619]" />
                <span className="text-xs text-[#434655]">Returned</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e5" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#434655' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#434655' }} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e0e3e5', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                cursor={{ fill: 'rgba(0,74,198,0.04)' }}
              />
              <Bar dataKey="issued" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="returned" fill="#fea619" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div
          className="lg:col-span-4 rounded-2xl p-6"
          style={{
            backdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
          }}
        >
          <h3 className="text-lg font-semibold text-[#191c1e] mb-4">Overdue Breakdown</h3>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={overdueByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {overdueByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #e0e3e5', borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-2">
              {overdueByCategory.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-[#434655]">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#191c1e]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Area chart + traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area chart */}
        <div
          className="lg:col-span-8 rounded-2xl p-6"
          style={{
            backdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#191c1e]">Fine Collection Revenue</h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#004ac6]">LKR 42,500</p>
              <p className="text-xs text-emerald-600 font-medium">+12% from last month</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={fineData}>
              <defs>
                <linearGradient id="fineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e5" vertical={false} />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#434655' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#434655' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e0e3e5', borderRadius: 12 }}
                formatter={(v: any) => [`LKR ${Number(v).toLocaleString()}`, 'Amount']}
              />
              <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fill="url(#fineGradient)" dot={{ fill: '#2563eb', strokeWidth: 0, r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footfall traffic */}
        <div
          className="lg:col-span-4 rounded-2xl p-6"
          style={{
            backdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
          }}
        >
          <h3 className="text-lg font-semibold text-[#191c1e] mb-4">Footfall Traffic</h3>
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-4xl font-bold text-[#191c1e]">1,280</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 5.4%
            </span>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Morning Peak', pct: 75, color: '#2563eb' },
              { label: 'Afternoon Steady', pct: 45, color: '#fea619' },
              { label: 'Evening Rush', pct: 90, color: '#bc4800' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-[#434655] uppercase tracking-wider">{item.label}</span>
                  <span className="text-xs font-semibold text-[#191c1e]">{item.pct}%</span>
                </div>
                <div className="h-2 bg-[#eceef0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.pct}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c3c6d7]/20">
          <h3 className="text-base font-semibold text-[#191c1e]">Overdue Books Report</h3>
          <button className="text-xs text-[#004ac6] hover:underline font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#c3c6d7]/10">
                {['Book ID', 'Title', 'Borrower', 'Due Date', 'Days Overdue', 'Fine (LKR)'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#434655] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c6d7]/10">
              {overdueBooks.map((row) => (
                <tr key={row.id} className="hover:bg-[#f2f4f6]/50 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono text-[#004ac6] font-semibold">{row.id}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-[#191c1e]">{row.title}</td>
                  <td className="px-5 py-3.5 text-xs font-mono text-[#434655]">{row.borrower}</td>
                  <td className="px-5 py-3.5 text-sm text-[#434655]">{row.dueDate}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-[#ba1a1a] rounded-full">
                      {row.daysOverdue} days
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-[#ba1a1a]">{row.fine.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top borrowers */}
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
          <h3 className="text-base font-semibold text-[#191c1e]">Top Borrowers</h3>
        </div>
        <div className="space-y-3">
          {topBorrowers.map((b, i) => (
            <div key={b.name} className="flex items-center gap-4">
              <span className="text-sm font-bold text-[#434655]/40 w-5">{i + 1}</span>
              <div className="w-8 h-8 rounded-xl bg-[#004ac6] flex items-center justify-center text-white text-xs font-bold">
                {b.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#191c1e]">{b.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex-1 h-1.5 bg-[#eceef0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#004ac6] rounded-full" style={{ width: `${(b.borrows / 250) * 100}%` }} />
                  </div>
                  <span className="text-xs text-[#434655]/60">{b.borrows} borrows</span>
                </div>
              </div>
              <div className="text-right">
                {b.overdue > 0 ? (
                  <span className="text-xs font-semibold text-[#ba1a1a]">{b.overdue} overdue</span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600">Good standing</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
