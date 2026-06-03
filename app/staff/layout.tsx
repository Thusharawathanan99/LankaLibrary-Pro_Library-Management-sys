import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,74,198,0.04) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <Sidebar role="staff" />
      <div className="ml-64 flex flex-col min-h-screen relative z-10">
        <Navbar placeholder="Search books, members..." role="staff" userName="Staff Portal" />
        <main className="flex-1 p-8">{children}</main>
        <footer className="border-t border-[#c3c6d7]/20 py-4 px-8 flex flex-col md:flex-row justify-between items-center gap-2 bg-[#f2f4f6]/50">
          <p className="text-xs text-[#434655]/60">© 2026 National Heritage Library of Sri Lanka.</p>
        </footer>
      </div>
    </div>
  );
}
