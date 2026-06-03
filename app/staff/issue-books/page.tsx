'use client';

import { useState } from 'react';
import { Search, BookMarked, User, CheckCircle } from 'lucide-react';

const availableBooks = [
  { id: 'BK004', title: 'Buddhist Art of Sri Lanka', author: 'Nimal de Silva', available: 4 },
  { id: 'BK005', title: 'Kandyan Kingdom: A Visual History', author: 'Roland Silva', available: 5 },
  { id: 'BK007', title: 'Sinhalese Literature — Anthology', author: 'E. Sarachchandra', available: 7 },
  { id: 'BK009', title: 'Marine Heritage of Sri Lanka', author: 'C.H.B. Reynolds', available: 3 },
  { id: 'BK010', title: 'Ayurvedic Medicine', author: 'Laksiri Jayasuriya', available: 6 },
];

export default function IssueBooksPage() {
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [issued, setIssued] = useState(false);

  const handleIssue = () => {
    if (memberSearch && selectedBook) {
      setIssued(true);
      setTimeout(() => { setIssued(false); setMemberSearch(''); setSelectedBook(''); setBookSearch(''); }, 3000);
    }
  };

  const filteredBooks = availableBooks.filter(b =>
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.id.includes(bookSearch)
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold text-[#004ac6]">Issue a Book</h2>
        <p className="text-sm text-[#434655] mt-1">Check out a book to a registered member.</p>
      </div>

      {issued && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-sm font-semibold text-emerald-700">Book issued successfully! Due date set for 14 days.</p>
        </div>
      )}

      <div className="rounded-2xl p-6 space-y-5" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)' }}>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Member Search
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/40" />
            <input
              value={memberSearch}
              onChange={e => setMemberSearch(e.target.value)}
              placeholder="Enter member ID or name..."
              className="w-full pl-10 pr-4 py-3 bg-[#f2f4f6] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
            />
          </div>
          {memberSearch.length > 2 && (
            <div className="border border-[#c3c6d7]/30 rounded-xl overflow-hidden bg-white">
              {[{ id: 'LIB-005', name: 'Thilina Rajapaksa', email: 'thilina.r@university.ac.lk' }, { id: 'LIB-004', name: 'Dilani Fernando', email: 'dilani.f88@outlook.com' }].map(m => (
                <button key={m.id} onClick={() => setMemberSearch(`${m.id} — ${m.name}`)} className="w-full text-left px-4 py-3 hover:bg-[#f2f4f6] transition-colors border-b border-[#c3c6d7]/10 last:border-0">
                  <p className="text-sm font-semibold text-[#191c1e]">{m.name}</p>
                  <p className="text-xs text-[#434655]/60">{m.id} · {m.email}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider flex items-center gap-2">
            <BookMarked className="w-4 h-4" /> Select Book
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/40" />
            <input
              value={bookSearch}
              onChange={e => setBookSearch(e.target.value)}
              placeholder="Search by title or book ID..."
              className="w-full pl-10 pr-4 py-3 bg-[#f2f4f6] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
            />
          </div>
          <div className="space-y-2 mt-2">
            {filteredBooks.map(book => (
              <button
                key={book.id}
                onClick={() => { setSelectedBook(book.id); setBookSearch(book.title); }}
                className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-all ${selectedBook === book.id ? 'border-[#004ac6] bg-blue-50' : 'border-[#c3c6d7]/30 hover:border-[#004ac6]/40 hover:bg-[#f2f4f6]'}`}
              >
                <div>
                  <p className="text-sm font-semibold text-[#191c1e]">{book.title}</p>
                  <p className="text-xs text-[#434655]/60">{book.id} · {book.author}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full shrink-0">
                  {book.available} avail.
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#434655]">Issue Date</label>
            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2.5 bg-[#f2f4f6] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#434655]">Due Date</label>
            <input type="date" defaultValue={new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]} className="w-full px-3 py-2.5 bg-[#f2f4f6] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none" />
          </div>
        </div>

        <button
          onClick={handleIssue}
          disabled={!memberSearch || !selectedBook}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#004ac6] text-white text-sm font-semibold hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BookMarked className="w-4 h-4" />
          Issue Book to Member
        </button>
      </div>
    </div>
  );
}
