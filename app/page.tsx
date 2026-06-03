import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Archive,
  ChevronRight,
  Globe,
  Mail,
  Share2,
  Library,
  BookMarked,
  Users,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] font-sans text-[#191c1e]">
      {/* Background motif */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#f6f3ee]" />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-[#f6f3ee]/80 border-b border-[#e3d5c6] h-16 flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          <span className="text-lg font-display font-semibold text-[#0f2f49]">Ceylon Digital Library</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#4b4f55]">
          {[
            { label: 'Catalog', href: '#catalog' },
            { label: 'Features', href: '#catalog' },
            { label: 'Membership', href: '#membership' },
            { label: 'Support', href: '#support' },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition-colors ${i === 0 ? 'text-[#0f2f49]' : 'hover:text-[#0f2f49]'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className="bg-[#0f2f49] text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-[#0f2f49]/20 transition-all active:scale-95"
        >
          Sign In
        </Link>
      </nav>

      <main className="relative z-10 pt-20">
        {/* Hero */}
        <section className="pt-12 pb-12 px-4 md:px-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="space-y-6">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#fff1dc] text-[#6b4a1f] rounded-full text-xs font-semibold uppercase tracking-[0.2em]"
              >
                National Digital Heritage
              </span>
              <h1
                className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight"
              >
                <span className="block text-[#1b2b34]">Ceylon Digital Library</span>
                <span className="block text-[#0f2f49]">National Digital Archives</span>
              </h1>
              <p
                className="text-lg text-[#4b4f55] max-w-2xl"
              >
                Access Sri Lanka's historical manuscripts, literary works, and archival collections through our official digital repository.
              </p>
              <div
                className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2"
              >
                <Link
                  href="/admin/dashboard"
                  className="group flex items-center gap-3 bg-[#0f2f49] text-white px-8 py-4 rounded-full text-base font-semibold hover:shadow-xl hover:shadow-[#0f2f49]/25 transition-all"
                >
                  Explore the Catalog
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 backdrop-blur-md bg-white/70 border border-white/60 px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-all shadow-lg"
                >
                  Become a Member
                </Link>
              </div>
              <div
                className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#6c6154]"
              >
                <span>Digitized Manuscripts</span>
                <span>Island Archives</span>
                <span>Open Access Research</span>
              </div>
            </div>

            <div className="relative">
              <div
                className="rounded-[2rem] p-6 md:p-8 border border-white/60 bg-white/75 backdrop-blur-md shadow-2xl"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[#6b4a1f]">
                  <span>Featured Collection</span>
                  <span>Archive Room 3</span>
                </div>
                <h3 className="font-display text-2xl text-[#1b2b34] mt-4">Palm Leaf Manuscripts</h3>
                <p className="text-sm text-[#4b4f55] mt-2 leading-relaxed">
                  A rotating cabinet of rare texts, digitized in high detail and annotated by
                  the national preservation team.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { value: '1,284', label: 'Cataloged Pieces' },
                    { value: '48', label: 'New This Month' },
                    { value: '12', label: 'Languages' },
                    { value: '24/7', label: 'Remote Access' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-white/70 border border-white/70 p-3">
                      <p className="text-lg font-semibold text-[#0f2f49]">{item.value}</p>
                      <p className="text-xs text-[#6c6154] uppercase tracking-[0.2em]">{item.label}</p>
                    </div>
                  ))}
                </div>
            <Image
                  src="https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Archive shelves"
              width={800}
              height={400}
                  className="mt-6 rounded-2xl h-44 w-full object-cover"
              priority
                />
              </div>
              <div
                className="absolute -bottom-8 -left-6 rounded-2xl px-4 py-3 border border-white/70 bg-white/80 text-xs text-[#4b4f55] shadow-lg"
              >
                Updated daily by the national preservation unit
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
            {[
              { value: '50k+', label: 'Digital Volumes', color: 'text-[#0f2f49]' },
              { value: '10k+', label: 'Active Members', color: 'text-[#6b4a1f]' },
              { value: '24/7', label: 'Global Access', color: 'text-[#5c3a1a]' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="backdrop-blur-md bg-white/70 border border-white/60 p-6 rounded-2xl flex flex-col items-center gap-1 shadow-lg"
              >
                <span className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</span>
                <span className="text-[11px] font-semibold text-[#6c6154] uppercase tracking-[0.25em]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="catalog" className="py-16 px-4 md:px-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b4a1f] mb-3">Collections</p>
              <h2 className="font-display text-3xl text-[#1b2b34]">Digital Collections & Resources</h2>
              <p className="text-sm text-[#4b4f55] max-w-2xl mt-3">
                Providing researchers, students, and the public with verified access to the national cultural record.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-[#6c6154]">
              <span>Open Access</span>
              <span>Verified Sources</span>
              <span>Long Term Preservation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div
              className="md:col-span-7 group relative overflow-hidden rounded-2xl min-h-[400px] bg-white/80 backdrop-blur-md border border-white/60 shadow-xl"
            >
          <Image
                src="https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Library archive"
            fill
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f6f3ee] via-[#f6f3ee]/50 to-transparent" />
              <div className="relative h-full p-8 flex flex-col justify-end">
                <div className="w-14 h-14 bg-[#0f2f49]/15 rounded-xl flex items-center justify-center mb-4 backdrop-blur-xl border border-[#0f2f49]/20">
                  <Archive className="w-7 h-7 text-[#0f2f49]" />
                </div>
                <h3 className="font-display text-2xl text-[#1b2b34] mb-2">Digital Archiving</h3>
                <p className="text-[#4b4f55] max-w-md leading-relaxed">
                  High-resolution digitization of palm leaf manuscripts and rare editions, ensuring long-term preservation and global accessibility.
                </p>
              </div>
            </div>

            <div
              className="md:col-span-5 rounded-2xl p-8 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-md border border-white/60 shadow-xl"
            >
              <div>
                <div className="w-14 h-14 bg-[#b9832f]/20 rounded-xl flex items-center justify-center mb-4 border border-[#b9832f]/30">
                  <BookMarked className="w-6 h-6 text-[#6b4a1f]" />
                </div>
                <h3 className="font-display text-xl text-[#1b2b34] mb-2">Academic Resources</h3>
                <p className="text-[#4b4f55] leading-relaxed">
                  Access subject-specific collections organized by our archival staff, available for registered members and affiliated institutions.
                </p>
              </div>
          <Image
                src="https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Study materials"
            width={400}
            height={300}
                className="rounded-xl h-40 w-full object-cover mt-4 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <div
              className="md:col-span-12 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 group bg-white/80 backdrop-blur-md border border-white/60 shadow-xl"
            >
              <div className="md:w-1/3">
                <div className="w-14 h-14 bg-[#c4571c]/20 rounded-xl flex items-center justify-center mb-4 border border-[#c4571c]/30">
                  <Users className="w-6 h-6 text-[#5c3a1a]" />
                </div>
                <h3 className="font-display text-xl text-[#1b2b34] mb-2">Cultural Hub</h3>
                <p className="text-[#4b4f55] mb-4 leading-relaxed">
                  Collaborative research spaces for historians, scholars, and university students to access primary source materials.
                </p>
                <Link
                  href="#institutions"
                  className="text-[#0f2f49] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Learn about initiatives <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="md:w-2/3 flex gap-4 overflow-hidden">
            <Image
                  src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500"
                  alt="Research collaboration"
              width={500}
              height={300}
                  className="rounded-xl h-56 flex-1 object-cover hover:flex-[2] transition-all duration-500"
                />
            <Image
                  src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=500"
                  alt="Archive equipment"
              width={500}
              height={300}
                  className="hidden md:block rounded-xl h-56 flex-1 object-cover hover:flex-[2] transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="membership" className="py-24 px-4">
          <div
            className="max-w-3xl mx-auto text-center backdrop-blur-md bg-white/75 p-12 md:p-20 rounded-[2.5rem] border border-white/70 shadow-2xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#6b4a1f] mb-3">Membership</p>
            <h2 className="font-display text-4xl text-[#0f2f49] mb-4">Access the Digital Archive</h2>
            <p className="text-lg text-[#4b4f55] mb-8 max-w-xl mx-auto">
              Register for a library membership to access restricted collections and request physical viewing appointments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-[#0f2f49] text-white px-10 py-4 rounded-full font-semibold shadow-xl shadow-[#0f2f49]/20 hover:scale-105 active:scale-95 transition-all"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="bg-white text-[#0f2f49] border border-[#d7c9b8] px-10 py-4 rounded-full font-semibold hover:bg-[#f8f2e9] transition-all"
              >
                Speak with a Librarian
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="bg-[#f1ece6] border-t border-[#e3d5c6] py-12 px-6 md:px-10 relative z-10"
        id="support"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#0f2f49] uppercase tracking-[0.25em]">
                Ceylon Digital Library
              </span>
            </div>
            <p className="text-[#4b4f55] text-sm leading-relaxed">
              Preserving the cultural and intellectual heritage of Sri Lanka through careful archival
              stewardship.
            </p>
            <div className="flex gap-3">
              {[Globe, Share2, Mail].map((Icon, i) => (
                <Link key={i} href="/" className="text-[#4b4f55] hover:text-[#0f2f49] transition-colors">
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            {[
              { title: 'Resources', links: ['Archival Standards', 'Digital Collections', 'Institutional Access'] },
              { title: 'Institution', links: ['About Us', 'Privacy Policy', 'Contact Support'] },
              { title: 'Legal', links: ['Terms of Use', 'Copyright Info', 'Accessibility'] },
            ].map((col) => (
              <div key={col.title} className="space-y-3">
                <h4 className="text-sm font-semibold text-[#0f2f49] uppercase tracking-[0.2em]">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="/" className="text-xs text-[#4b4f55] hover:text-[#0f2f49] transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#e3d5c6] text-center">
          <p className="text-xs text-[#6c6154]">(c) 2026 National Heritage Library of Sri Lanka. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
