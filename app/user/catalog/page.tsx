'use client';

import { useState } from 'react';
import { Search, Filter, BookOpen, Heart } from 'lucide-react';

const allBooks = [
  { id: 'BK001', title: 'Mahavamsa — The Great Chronicle', author: 'Mahanama Thero', category: 'History', available: 3, total: 8, year: 2010, cover: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'BK004', title: 'Buddhist Art of Sri Lanka', author: 'Nimal de Silva', category: 'Art', available: 4, total: 4, year: 2015, cover: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'BK005', title: 'Kandyan Kingdom: A Visual History', author: 'Roland Silva', category: 'History', available: 5, total: 7, year: 2012, cover: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'BK007', title: 'Sinhalese Literature — Anthology', author: 'E. Sarachchandra', category: 'Literature', available: 7, total: 10, year: 2020, cover: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'BK009', title: 'Marine Heritage of Sri Lanka', author: 'C.H.B. Reynolds', category: 'Science', available: 3, total: 5, year: 2016, cover: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'BK010', title: 'Ayurvedic Medicine — Traditional Knowledge', author: 'Laksiri Jayasuriya', category: 'Medicine', available: 6, total: 8, year: 2019, cover: 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'BK002', title: 'Epochs of Ceylon History', author: 'P.E. Pieris', category: 'History', available: 0, total: 5, year: 2005, cover: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: 'BK008', title: 'Cinnamon Gardens', author: 'Shyam Selvadurai', category: 'Fiction', available: 1, total: 6, year: 2014, cover: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

const categories = ['All', 'History', 'Literature', 'Art', 'Fiction', 'Science', 'Medicine'];

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filtered = allBooks.filter(b =>
    (category === 'All' || b.category === category) &&
    (b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#004ac6]">Book Catalog</h2>
        <p className="text-sm text-[#434655] mt-1">Browse {allBooks.length} titles in the digital collection.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)', borderRadius: '1rem', padding: '1rem' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, author..." className="w-full pl-10 pr-4 py-2.5 bg-[#f2f4f6] border-none rounded-full text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${category === cat ? 'bg-[#004ac6] text-white' : 'bg-[#eceef0] text-[#434655] hover:bg-[#e0e3e5]'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map(book => (
          <div key={book.id} className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px 0 rgba(37,99,235,0.08)' }}>
            <div className="relative h-44 overflow-hidden">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <button
                onClick={() => setWishlist(w => w.includes(book.id) ? w.filter(id => id !== book.id) : [...w, book.id])}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center"
              >
                <Heart className={`w-4 h-4 transition-colors ${wishlist.includes(book.id) ? 'fill-[#ba1a1a] text-[#ba1a1a]' : 'text-[#434655]'}`} />
              </button>
              <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 bg-white/80 backdrop-blur-sm text-[#434655] rounded-full">{book.category}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-[#191c1e] group-hover:text-[#004ac6] transition-colors line-clamp-2 leading-tight">{book.title}</h3>
              <p className="text-xs text-[#434655]/70 mt-0.5">{book.author} · {book.year}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs font-semibold ${book.available === 0 ? 'text-[#ba1a1a]' : 'text-emerald-600'}`}>
                  {book.available === 0 ? 'All Issued' : `${book.available}/${book.total} available`}
                </span>
                <button disabled={book.available === 0} className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${book.available === 0 ? 'bg-[#eceef0] text-[#434655]/40 cursor-not-allowed' : 'bg-[#004ac6] text-white hover:bg-[#2563eb] shadow-sm'}`}>
                  {book.available === 0 ? 'Waitlist' : 'Borrow'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
