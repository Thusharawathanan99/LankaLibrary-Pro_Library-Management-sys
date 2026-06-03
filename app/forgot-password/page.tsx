'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f6f3ee]"
    >
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] p-8" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,219,205,0.3)', boxShadow: '0 8px 32px 0 rgba(37,99,235,0.08)' }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-[#191c1e]">Reset Password</h2>
            <p className="text-sm text-[#434655] mt-1">Enter your email to receive reset instructions</p>
          </div>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-[#191c1e]">Reset email sent!</p>
              <p className="text-xs text-[#434655]">Check your inbox for password reset instructions.</p>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm text-white bg-[#0f2f49] px-6 py-2.5 rounded-xl font-semibold hover:bg-[#14405f] transition-all mt-2">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#434655]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/40" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full pl-11 pr-4 py-3 bg-white/50 border border-[#c3c6d7] rounded-xl text-sm focus:ring-2 focus:ring-[#004ac6]/20 focus:border-[#004ac6] outline-none transition-all" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#0f2f49] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#14405f] transition-all">
                Send Reset Link
              </button>
            </form>
          )}
          {!sent && (
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-[#434655] hover:text-[#004ac6] transition-colors mt-6">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
