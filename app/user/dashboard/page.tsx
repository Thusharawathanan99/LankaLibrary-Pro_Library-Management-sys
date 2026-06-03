'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f6f3ee] p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with working Back Button */}
        <header className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/user/catalog')} 
            className="p-2 bg-white/60 hover:bg-white border border-[#d7c9b8] rounded-full transition-colors shadow-sm"
            aria-label="Go to catalog"
          >
            <ArrowLeft className="w-5 h-5 text-[#0f2f49]" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-semibold text-[#0f2f49]">Settings</h1>
            <p className="text-[#434655] text-sm mt-1">Manage your account preferences and library configuration.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Details Settings Block */}
          <div className="col-span-1 md:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-[#d7c9b8] shadow-sm">
            <h2 className="text-lg font-semibold text-[#1b2b34] mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0f2f49]" /> Profile Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#434655]">Full Name</label>
                <input type="text" defaultValue="John Doe" className="w-full mt-1 px-4 py-2 border border-[#d7c9b8] rounded-xl bg-white focus:ring-2 focus:ring-[#0f2f49]/20 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#434655]">Email Address</label>
                <input type="email" defaultValue="user@example.com" disabled className="w-full mt-1 px-4 py-2 border border-[#d7c9b8] rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed outline-none" />
              </div>
              <div className="pt-2">
                <button className="bg-[#0f2f49] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#154266] transition-all shadow-md">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          
          {/* You can add more settings blocks like security/notifications here */}
        </div>
      </div>
    </div>
  );
}