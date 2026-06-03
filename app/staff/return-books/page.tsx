'use client';

import { useState } from 'react';
import { Search, ArrowLeftRight, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

const issuedBooks = [
  { issueId: 'ISS-001', bookId: 'BK002', title: 'Epochs of Ceylon History', borrower: 'LIB-9921', borrowerName: 'Thilina Rajapaksa', issueDate: '2024-11-15', dueDate: '2024-11-29', daysOverdue: 4, fine: 200 },
  { issueId: 'ISS-002', bookId: 'BK006', title: 'Ancient Scripts of Lanka', borrower: 'LIB-0034', borrowerName: 'Ruwan Perera', issueDate: '2024-11-20', dueDate: '2024-12-04', daysOverdue: 0, fine: 0 },
  { issueId: 'ISS-003', bookId: 'BK001', title: 'Mahavamsa', borrower: 'LIB-0045', borrowerName: 'Dilani Fernando', issueDate: '2024-11-25', dueDate: '2024-12-09', daysOverdue: 0, fine: 0 },
];

export default function ReturnBooksPage() {
  const [search, setSearch] = useState('');
  const [returnedIds, setReturnedIds] = useState<string[]>([]);

  const filtered = issuedBooks.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.borrower.toLowerCase().includes(search.toLowerCase()) ||
    b.borrowerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleReturn = (id: string) => setReturnedIds(prev => [...prev, id]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold text-[#004ac6]">Return Books</h2>
        <p className="text-sm text-[#434655] mt-1">Process book returns and collect any applicable fines.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/40" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by book title, member ID, or name..."
          className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-md border border-white/30 rounded-full text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
          style={{ boxShadow: '0 4px 16px rgba(37,99,235,0.06)' }}
        />
      </div>

      <div className="space-y-3">
        {filtered.map(item => {
          const returned = returnedIds.includes(item.issueId);
          return (
            <div
              key={item.issueId}
              className="rounded-2xl p-5"
              style={{
                backdropFilter: 'blur(12px)',
                background: returned ? 'rgba(236,253,245,0.7)' : 'rgba(255,255,255,0.7)',
                border: returned ? '1px solid rgba(16,185,129,0.2)' : item.daysOverdue > 0 ? '1px solid rgba(186,26,26,0.15)' : '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-[#004ac6] font-semibold">{item.issueId}</span>
                    {item.daysOverdue > 0 && !returned && (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-[#ba1a1a] rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {item.daysOverdue} days overdue
                      </span>
                    )}
                    {returned && (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Returned
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#191c1e]">{item.title}</h3>
                  <p className="text-xs text-[#434655]/70 mt-0.5">{item.borrowerName} ({item.borrower})</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-[#434655]/60">Issued: {item.issueDate}</span>
                    <span className="text-xs text-[#434655]/60">Due: {item.dueDate}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {item.fine > 0 && !returned && (
                    <div className="flex items-center gap-1.5 text-[#ba1a1a]">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-bold">LKR {item.fine}</span>
                    </div>
                  )}
                  {!returned && (
                    <button
                      onClick={() => handleReturn(item.issueId)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004ac6] text-white text-xs font-semibold hover:bg-[#2563eb] transition-all shadow-sm"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      Process Return
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
