import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Background motif */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(0,74,198,0.04) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-500/3 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/3 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <Sidebar role="admin" />
      <div className="ml-64 flex flex-col min-h-screen relative z-10">
        <Navbar placeholder="Search books, members, reports..." role="admin" userName="Admin Portal" />
        <main className="flex-1 p-8">{children}</main>
        <footer className="border-t border-[#c3c6d7]/20 py-4 px-8 flex flex-col md:flex-row justify-between items-center gap-2 bg-[#f2f4f6]/50">
          <p className="text-xs text-[#434655]/60">
            © 2026 National Heritage Library of Sri Lanka. All Rights Reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Institutional Access', 'Archival Standards', 'Contact Support'].map((l) => (
              <a key={l} href="#" className="text-xs text-[#434655]/60 hover:text-[#004ac6] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
