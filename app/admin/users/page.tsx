'use client';

import { useState } from 'react';
import { Search, Plus, Download, Edit, Trash2, ChevronLeft, ChevronRight, Users } from 'lucide-react';

type UserRole = 'Admin' | 'Staff' | 'Member';
type UserStatus = 'Active' | 'Suspended' | 'Inactive';

interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  borrows: number;
  joined: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
}

const members: Member[] = [
  { id: 'LIB-001', name: 'Anura Senanayake', email: 'anura.s@ceylondigitallibrary.lk', role: 'Admin', status: 'Active', borrows: 142, joined: 'Jan 2022', initials: 'AS', gradientFrom: '#2563eb', gradientTo: '#fea619' },
  { id: 'LIB-002', name: 'Kasuni Mendis', email: 'k.mendis@archive.lk', role: 'Staff', status: 'Active', borrows: 56, joined: 'Mar 2023', initials: 'KM', gradientFrom: '#bc4800', gradientTo: '#ffb596' },
  { id: 'LIB-003', name: 'Ruwan Perera', email: 'r.perera@gmail.com', role: 'Member', status: 'Suspended', borrows: 8, joined: 'Nov 2023', initials: 'RP', gradientFrom: '#10b981', gradientTo: '#059669' },
  { id: 'LIB-004', name: 'Dilani Fernando', email: 'dilani.f88@outlook.com', role: 'Member', status: 'Active', borrows: 24, joined: 'Dec 2023', initials: 'DF', gradientFrom: '#fea619', gradientTo: '#bc4800' },
  { id: 'LIB-005', name: 'Thilina Rajapaksa', email: 'thilina.r@university.ac.lk', role: 'Member', status: 'Active', borrows: 218, joined: 'Jun 2021', initials: 'TR', gradientFrom: '#004ac6', gradientTo: '#b4c5ff' },
  { id: 'LIB-006', name: 'Nimalka Wijesinghe', email: 'nimalka@schools.lk', role: 'Member', status: 'Active', borrows: 45, joined: 'Feb 2024', initials: 'NW', gradientFrom: '#4f46e5', gradientTo: '#7c3aed' },
  { id: 'LIB-007', name: 'Chamara Bandara', email: 'chamara.b@research.lk', role: 'Staff', status: 'Active', borrows: 92, joined: 'Aug 2022', initials: 'CB', gradientFrom: '#0891b2', gradientTo: '#06b6d4' },
  { id: 'LIB-008', name: 'Sulochana Dias', email: 's.dias@heritage.lk', role: 'Member', status: 'Inactive', borrows: 12, joined: 'Oct 2023', initials: 'SD', gradientFrom: '#9f1239', gradientTo: '#e11d48' },
];

const roleFilters = ['All', 'Admin', 'Staff', 'Member'];

const roleBadge: Record<UserRole, string> = {
  Admin: 'bg-blue-100 text-[#004ac6] border border-blue-200',
  Staff: 'bg-amber-100 text-[#855300] border border-amber-200',
  Member: 'bg-[#e0e3e5] text-[#434655] border border-[#c3c6d7]',
};

const statusBadge: Record<UserStatus, string> = {
  Active: 'text-emerald-600',
  Suspended: 'text-[#ba1a1a]',
  Inactive: 'text-[#434655]/50',
};

const statusDot: Record<UserStatus, string> = {
  Active: 'bg-emerald-500 animate-pulse',
  Suspended: 'bg-[#ba1a1a]',
  Inactive: 'bg-[#434655]/30',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = members.filter(
    (m) =>
      (roleFilter === 'All' || m.role === roleFilter) &&
      (m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#004ac6]">Member Management</h2>
          <p className="text-sm text-[#434655] mt-1">
            Directory of all registered library users and institutional partners.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#c3c6d7]/50 hover:bg-[#eceef0] text-sm font-medium text-[#434655] transition-colors">
            <Download className="w-4 h-4" />
            Export Directory
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004ac6] text-white text-sm font-semibold hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            Register Member
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div
        className="rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-start md:items-center"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
        }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name or ID..."
            className="w-full pl-9 pr-4 py-2 bg-[#f2f4f6] border-none rounded-full text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {roleFilters.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                roleFilter === r
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-[#eceef0] text-[#434655] hover:bg-[#e0e3e5]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs transition-colors ${viewMode === 'grid' ? 'bg-[#004ac6] text-white' : 'text-[#434655] hover:bg-[#eceef0]'}`}
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
              <rect x="0" y="0" width="7" height="7" rx="1.5" /><rect x="9" y="0" width="7" height="7" rx="1.5" />
              <rect x="0" y="9" width="7" height="7" rx="1.5" /><rect x="9" y="9" width="7" height="7" rx="1.5" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs transition-colors ${viewMode === 'table' ? 'bg-[#004ac6] text-white' : 'text-[#434655] hover:bg-[#eceef0]'}`}
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
              <rect x="0" y="0" width="16" height="3" rx="1.5" /><rect x="0" y="5" width="16" height="3" rx="1.5" />
              <rect x="0" y="10" width="16" height="3" rx="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="relative p-5 rounded-2xl flex flex-col gap-4 group cursor-pointer transition-all duration-300 hover:-translate-y-2"
              style={{
                backdropFilter: 'blur(12px)',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.08)',
              }}
            >
              <div className="flex justify-between items-start">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})` }}
                >
                  {member.initials}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${roleBadge[member.role]}`}>
                    {member.role}
                  </span>
                  <div className={`flex items-center gap-1 text-xs ${statusBadge[member.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[member.status]}`} />
                    {member.status}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#191c1e] group-hover:text-[#004ac6] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-[#434655]/70 truncate">{member.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#c3c6d7]/20">
                <div>
                  <p className="text-xs text-[#434655]/60 uppercase tracking-wider font-medium">Borrows</p>
                  <p className="text-xl font-bold text-[#004ac6]">{member.borrows}</p>
                </div>
                <div>
                  <p className="text-xs text-[#434655]/60 uppercase tracking-wider font-medium">Joined</p>
                  <p className="text-sm font-medium text-[#191c1e]">{member.joined}</p>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button className="p-1.5 rounded-lg bg-[#eceef0] hover:bg-blue-50 hover:text-[#004ac6] transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <div className="border-2 border-dashed border-[#c3c6d7]/50 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#004ac6] transition-colors cursor-pointer group min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-[#eceef0] flex items-center justify-center group-hover:bg-blue-50 group-hover:text-[#004ac6] transition-all">
              <Plus className="w-5 h-5 text-[#434655] group-hover:text-[#004ac6]" />
            </div>
            <p className="text-sm font-medium text-[#434655] group-hover:text-[#004ac6]">
              Register New Member
            </p>
          </div>
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
          }}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#c3c6d7]/20">
                {['Member', 'ID', 'Role', 'Status', 'Borrows', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#434655] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c6d7]/10">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-[#f2f4f6]/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})` }}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#191c1e]">{member.name}</p>
                        <p className="text-xs text-[#434655]/60">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono text-[#004ac6] font-semibold">{member.id}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleBadge[member.role]}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs ${statusBadge[member.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[member.status]}`} />
                      {member.status}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-[#004ac6]">{member.borrows}</td>
                  <td className="px-5 py-3.5 text-sm text-[#434655]">{member.joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-[#004ac6] transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-[#ba1a1a] transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#c3c6d7]/20">
            <p className="text-xs text-[#434655]/60">Showing {filtered.length} of {members.length} members</p>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-[#eceef0] transition-colors">
                <ChevronLeft className="w-4 h-4 text-[#434655]" />
              </button>
              {[1, 2].map((p) => (
                <button key={p} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${p === 1 ? 'bg-[#004ac6] text-white' : 'text-[#434655] hover:bg-[#eceef0]'}`}>{p}</button>
              ))}
              <button className="p-1.5 rounded-lg hover:bg-[#eceef0] transition-colors">
                <ChevronRight className="w-4 h-4 text-[#434655]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
