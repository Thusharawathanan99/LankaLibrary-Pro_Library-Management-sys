'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type BookStatus = 'Available' | 'All Issued' | 'Low Stock';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  quantity: number;
  available: number;
  status: BookStatus;
  year: number;
}

const books: Book[] = [
  { id: 'BK001', title: 'Mahavamsa — The Great Chronicle', author: 'Mahanama Thero', isbn: '978-9556710001', category: 'History', publisher: 'National Heritage Press', quantity: 8, available: 3, status: 'Low Stock', year: 2010 },
  { id: 'BK002', title: 'Epochs of Ceylon History', author: 'P.E. Pieris', isbn: '978-9556710002', category: 'History', publisher: 'Colombo Apothecaries', quantity: 5, available: 0, status: 'All Issued', year: 2005 },
  { id: 'BK003', title: 'Island of Lanka — Heritage Guide', author: 'Senaka Weeraratna', isbn: '978-9556710003', category: 'Culture', publisher: 'Ceylon Heritage', quantity: 6, available: 2, status: 'Low Stock', year: 2018 },
  { id: 'BK004', title: 'Buddhist Art of Sri Lanka', author: 'Nimal de Silva', isbn: '978-9556710004', category: 'Art', publisher: 'Academic Press', quantity: 4, available: 4, status: 'Available', year: 2015 },
  { id: 'BK005', title: 'Kandyan Kingdom: A Visual History', author: 'Roland Silva', isbn: '978-9556710005', category: 'History', publisher: 'University Press', quantity: 7, available: 5, status: 'Available', year: 2012 },
  { id: 'BK006', title: 'Ancient Scripts of Lanka', author: 'Ranawella Gnanasiha', isbn: '978-9556710006', category: 'Linguistics', publisher: 'National Museum', quantity: 3, available: 0, status: 'All Issued', year: 2009 },
  { id: 'BK007', title: 'Sinhalese Literature — Anthology', author: 'Ediriweera Sarachchandra', isbn: '978-9556710007', category: 'Literature', publisher: 'State Literary Board', quantity: 10, available: 7, status: 'Available', year: 2020 },
  { id: 'BK008', title: 'Cinnamon Gardens: Colonial Ceylon', author: 'Shyam Selvadurai', isbn: '978-9556710008', category: 'Fiction', publisher: 'Penguin', quantity: 6, available: 1, status: 'Low Stock', year: 2014 },
  { id: 'BK009', title: 'Marine Heritage of Sri Lanka', author: 'C.H.B. Reynolds', isbn: '978-9556710009', category: 'Science', publisher: 'University of Peradeniya', quantity: 5, available: 3, status: 'Available', year: 2016 },
  { id: 'BK010', title: 'Ayurvedic Medicine — Traditional Knowledge', author: 'Laksiri Jayasuriya', isbn: '978-9556710010', category: 'Medicine', publisher: 'Dept. of Ayurveda', quantity: 8, available: 6, status: 'Available', year: 2019 },
];

const categories = ['All', 'History', 'Culture', 'Art', 'Literature', 'Fiction', 'Science', 'Medicine', 'Linguistics'];

const statusColor: Record<BookStatus, string> = {
  Available: 'bg-emerald-100 text-emerald-700',
  'All Issued': 'bg-red-100 text-[#ba1a1a]',
  'Low Stock': 'bg-amber-100 text-[#684000]',
};

export default function BooksPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = books.filter(
    (b) =>
      (category === 'All' || b.category === category) &&
      (b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#004ac6]">Book Catalog</h2>
          <p className="text-sm text-[#434655] mt-1">
            Manage the library&apos;s collection — {books.length} titles in the system.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#c3c6d7]/50 hover:bg-[#eceef0] text-sm font-medium text-[#434655] transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004ac6] text-white text-sm font-semibold hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Book
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-4 flex flex-col md:flex-row gap-3"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author or ISBN..."
            className="w-full pl-9 pr-4 py-2 bg-[#f2f4f6] border-none rounded-full text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-[#004ac6] text-white shadow-sm'
                  : 'bg-[#eceef0] text-[#434655] hover:bg-[#e0e3e5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#c3c6d7]/20">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#434655] uppercase tracking-wider">
                  Book ID
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#434655] uppercase tracking-wider">
                  Title & Author
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#434655] uppercase tracking-wider">
                  ISBN
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#434655] uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#434655] uppercase tracking-wider">
                  Qty
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#434655] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#434655] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c6d7]/10">
              {filtered.map((book) => (
                <tr
                  key={book.id}
                  className="hover:bg-[#f2f4f6]/50 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-[#004ac6] font-semibold">{book.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#191c1e] truncate max-w-[200px]">
                      {book.title}
                    </p>
                    <p className="text-xs text-[#434655]/70">{book.author}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-[#434655]">{book.isbn}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-1 bg-[#eceef0] text-[#434655] rounded-full font-medium">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-[#191c1e]">{book.available}</span>
                      <span className="text-xs text-[#434655]/50">/ {book.quantity}</span>
                    </div>
                    <div className="w-16 h-1 bg-[#eceef0] rounded-full mt-1">
                      <div
                        className="h-full bg-[#004ac6] rounded-full"
                        style={{
                          width: `${(book.available / book.quantity) * 100}%`,
                          background:
                            book.available === 0
                              ? '#ba1a1a'
                              : book.available <= 2
                              ? '#fea619'
                              : '#004ac6',
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColor[book.status]}`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#c3c6d7]/20">
          <p className="text-xs text-[#434655]/60">
            Showing {filtered.length} of {books.length} books
          </p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-[#eceef0] transition-colors">
              <ChevronLeft className="w-4 h-4 text-[#434655]" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                  p === 1 ? 'bg-[#004ac6] text-white' : 'text-[#434655] hover:bg-[#eceef0]'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="p-1.5 rounded-lg hover:bg-[#eceef0] transition-colors">
              <ChevronRight className="w-4 h-4 text-[#434655]" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl p-6"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 64px 0 rgba(37,99,235,0.15)',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#004ac6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#191c1e]">Add New Book</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#eceef0] transition-colors text-[#434655]"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Title', placeholder: 'Book title' },
                { label: 'Author', placeholder: 'Author name' },
                { label: 'ISBN', placeholder: '978-...' },
                { label: 'Publisher', placeholder: 'Publisher name' },
                { label: 'Quantity', placeholder: '1', type: 'number' },
                { label: 'Year', placeholder: '2024', type: 'number' },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <label className="text-xs font-medium text-[#434655]">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 bg-[#f2f4f6] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
                  />
                </div>
              ))}
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-medium text-[#434655]">Category</label>
                <select className="w-full px-3 py-2 bg-[#f2f4f6] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none">
                  {categories.slice(1).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#434655] hover:bg-[#eceef0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#004ac6] text-white hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20"
              >
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
