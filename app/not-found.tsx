import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center"
    >
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#004ac6] mb-4">404</h1>
        <p className="text-xl font-semibold text-[#191c1e] mb-2">Page Not Found</p>
        <p className="text-sm text-[#434655] mb-8">The page you are looking for does not exist in our archive.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#004ac6] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
