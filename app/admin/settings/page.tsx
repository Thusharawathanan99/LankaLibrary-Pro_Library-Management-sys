'use client';

import { useState } from 'react';
import { Save, Settings, DollarSign, Calendar, Shield, Database, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [finePerDay, setFinePerDay] = useState('50');
  const [maxDays, setMaxDays] = useState('14');
  const [renewals, setRenewals] = useState('2');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold text-[#004ac6]">System Settings</h2>
        <p className="text-sm text-[#434655] mt-1">Configure library rules, policies and system preferences.</p>
      </div>

      {/* Borrowing Policy */}
      <div
        className="rounded-2xl p-6"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Calendar className="w-4.5 h-4.5 text-[#004ac6]" />
          </div>
          <h3 className="text-base font-semibold text-[#191c1e]">Borrowing Policy</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Maximum Borrow Days', value: maxDays, set: setMaxDays, suffix: 'days', help: 'Maximum days a member can keep a book' },
            { label: 'Fine Per Day', value: finePerDay, set: setFinePerDay, suffix: 'LKR', help: 'Daily fine for overdue books' },
            { label: 'Max Renewals', value: renewals, set: setRenewals, suffix: 'times', help: 'Number of times a book can be renewed' },
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-xs font-medium text-[#434655]">{f.label}</label>
              <div className="relative">
                <input
                  type="number"
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full pr-12 pl-3 py-2.5 bg-[#f2f4f6] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#434655]/60 font-medium">
                  {f.suffix}
                </span>
              </div>
              <p className="text-xs text-[#434655]/50">{f.help}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fine Policy */}
      <div
        className="rounded-2xl p-6"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <DollarSign className="w-4.5 h-4.5 text-[#855300]" />
          </div>
          <h3 className="text-base font-semibold text-[#191c1e]">Fine Policy</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Apply fines automatically on overdue', defaultChecked: true },
            { label: 'Send email reminder before due date (3 days)', defaultChecked: true },
            { label: 'Suspend member account after 30+ days overdue', defaultChecked: false },
            { label: 'Allow self-service renewal via member portal', defaultChecked: true },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked={opt.defaultChecked}
                className="w-4 h-4 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20"
              />
              <span className="text-sm text-[#434655] group-hover:text-[#191c1e] transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div
        className="rounded-2xl p-6"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-emerald-700" />
          </div>
          <h3 className="text-base font-semibold text-[#191c1e]">Security</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#434655]">Session Timeout</label>
            <select className="w-full bg-[#f2f4f6] border-none rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
              <option>8 hours</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#434655]">Password Policy</label>
            <select className="w-full bg-[#f2f4f6] border-none rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none">
              <option>Strong (8+ chars, symbols)</option>
              <option>Medium (8+ chars)</option>
              <option>Basic (6+ chars)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backup */}
      <div
        className="rounded-2xl p-6"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-sky-500/10 rounded-xl flex items-center justify-center">
            <Database className="w-4.5 h-4.5 text-sky-700" />
          </div>
          <h3 className="text-base font-semibold text-[#191c1e]">Backup &amp; Restore</h3>
        </div>
        <div className="flex items-center justify-between p-4 bg-[#f2f4f6] rounded-xl mb-3">
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">Last backup</p>
            <p className="text-xs text-[#434655]/70">Today, 03:00 AM — 2.4 GB</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
            Successful
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004ac6] text-white text-sm font-semibold hover:bg-[#2563eb] transition-all shadow-sm">
            <Database className="w-4 h-4" />
            Create Backup
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#c3c6d7]/50 text-sm font-medium text-[#434655] hover:bg-[#eceef0] transition-colors">
            <RefreshCw className="w-4 h-4" />
            Restore
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-2">
        <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#434655] hover:bg-[#eceef0] transition-colors">
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg ${
            saved ? 'bg-emerald-600 text-white' : 'bg-[#004ac6] text-white hover:bg-[#2563eb] shadow-blue-500/20'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
