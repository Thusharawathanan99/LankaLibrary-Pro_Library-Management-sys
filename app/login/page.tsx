'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, HelpCircle, ArrowLeft } from 'lucide-react';

// Define roles and their corresponding dashboard paths
type Role = 'Admin' | 'Staff' | 'Member';
const ROLES: Role[] = ['Admin', 'Staff', 'Member'];

const DASHBOARD_PATHS: Record<Role, string> = {
  Admin: '/admin/dashboard',
  Staff: '/staff/dashboard',
  Member: '/user/dashboard',
};

const EMAIL_PLACEHOLDERS: Record<Role, string> = {
  Admin: 'admin@ceylondigitallibrary.lk',
  Staff: 'staff@ceylondigitallibrary.lk',
  Member: 'member@gmail.com',
};

const LEFT_PANEL_STATS = [
  { v: '1,200+', l: 'Collections' },
  { v: '50k+', l: 'Volumes' },
  { v: '24/7', l: 'Access' },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_role', data.role);

      router.push(DASHBOARD_PATHS[role as Role]);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-10 bg-[#f6f3ee]"
    >
      {/* Working Back Button */}
      <button 
        onClick={() => router.push('/')} 
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-sm font-semibold text-[#434655] hover:text-[#0f2f49] transition-colors z-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="w-full max-w-4xl">
        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[580px] bg-white/80 backdrop-blur-md border border-white/70 shadow-2xl"
        >
          {/* Left panel */}
          <div className="hidden md:flex md:w-[45%] bg-[#0f2f49] relative overflow-hidden items-center justify-center p-10">
            <div className="relative z-10 text-center">
              <h1 className="font-display text-2xl font-semibold text-white mb-3 tracking-tight">
                Ceylon Digital Library
              </h1>
              <p className="text-white/80 text-sm max-w-xs mx-auto leading-relaxed">
                Official portal for the National Heritage Library of Sri Lanka. Authorized access only.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {LEFT_PANEL_STATS.map((s) => (
                  <div key={s.l} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                    <div className="text-xl font-bold text-white">{s.v}</div>
                    <div className="text-xs text-white/70">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-48">
              <Image
                src="https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Library books"
                width={600}
                height={300}
                className="w-full h-48 object-cover opacity-30 rounded-t-3xl"
                priority
              />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 p-8 md:p-14 flex flex-col justify-center">
            {/* Mobile logo */}
            <div className="flex md:hidden items-center gap-2 mb-6">
              <span className="font-display font-semibold text-[#0f2f49]">Ceylon Digital Library</span>
            </div>

            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-[#1b2b34] mb-1">Welcome back</h2>
              <p className="text-sm text-[#434655]">Access your library account</p>
            </div>

            {/* Role tabs */}
            <div className="flex gap-6 mb-6 border-b border-[#d7c9b8]/40">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`pb-3 text-sm font-medium transition-all relative ${
                    role === r
                      ? 'text-[#0f2f49]'
                      : 'text-[#434655] hover:text-[#0f2f49]'
                  }`}
                >
                  {r}
                  {role === r && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#0f2f49] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#434655]">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/50 group-focus-within:text-[#0f2f49] transition-colors pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={EMAIL_PLACEHOLDERS[role]}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/70 border border-[#d7c9b8] rounded-xl text-sm focus:ring-2 focus:ring-[#0f2f49]/20 focus:border-[#0f2f49] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium text-[#434655]">Password</label>
                  <Link href="/forgot-password" className="text-xs text-[#0f2f49] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]/50 group-focus-within:text-[#0f2f49] transition-colors pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3 bg-white/70 border border-[#d7c9b8] rounded-xl text-sm focus:ring-2 focus:ring-[#0f2f49]/20 focus:border-[#0f2f49] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#434655]/50 hover:text-[#434655] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[#c3c6d7] text-[#0f2f49] focus:ring-2 focus:ring-[#0f2f49]/20"
                />
                <label htmlFor="remember" className="text-sm text-[#434655] cursor-pointer">
                  Keep me signed in
                </label>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-[#0f2f49] text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-[#0f2f49]/20 hover:bg-[#14405f] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-[#c3c6d7]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6b4a1f]" />
                <span className="text-xs text-[#434655]">Secure institutional access</span>
              </div>
              <Link href="/#support" className="text-xs text-[#434655] hover:text-[#0f2f49] flex items-center gap-1">
                Help <HelpCircle className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#434655]/60 mt-6">
          © 2026 National Heritage Library of Sri Lanka. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
