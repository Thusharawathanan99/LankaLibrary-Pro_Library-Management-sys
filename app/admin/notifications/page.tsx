'use client';

import { useState } from 'react';
import { Bell, BellOff, Send, User, Settings, AlertTriangle, Info, CheckCircle } from 'lucide-react';

type NotifType = 'user' | 'system' | 'overdue' | 'member' | 'info';

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  { id: 1, type: 'user', title: 'New Member Registration: Anura Bandara', body: 'A new archival access request has been submitted for the palm-leaf manuscript section.', time: '2 mins ago', read: false },
  { id: 2, type: 'system', title: 'Database Optimization Complete', body: 'Maintenance cycle 42-B was successful. Search indexing performance increased by 15%.', time: '1 hour ago', read: false },
  { id: 3, type: 'overdue', title: 'Book Return Overdue: "Epochs of Ceylon History"', body: 'Borrower ID: LIB-9921 has exceeded the renewal limit. Automatic fine initiated.', time: 'Yesterday', read: true },
  { id: 4, type: 'member', title: 'Institutional Access Renewed: University of Peradeniya', body: 'Annual subscription for the Digital Library has been processed and extended until 2025.', time: '2 days ago', read: true },
  { id: 5, type: 'info', title: 'Heritage Archive Update: Kandyan Period Manuscripts', body: 'New batch of 24 manuscripts digitized and indexed in the archival collection.', time: '3 days ago', read: true },
  { id: 6, type: 'overdue', title: 'Multiple Overdue Alerts Sent', body: '18 members have been notified about overdue books. Automatic fine calculation applied.', time: '4 days ago', read: true },
];

const typeConfig: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  user: { icon: User, color: 'text-[#004ac6]', bg: 'bg-blue-500/10' },
  system: { icon: Settings, color: 'text-[#855300]', bg: 'bg-amber-500/10' },
  overdue: { icon: AlertTriangle, color: 'text-[#943700]', bg: 'bg-orange-500/10' },
  member: { icon: User, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  info: { icon: Info, color: 'text-sky-600', bg: 'bg-sky-500/10' },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifications);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [urgency, setUrgency] = useState<'Normal' | 'High' | 'Critical'>('Normal');
  const [recipient, setRecipient] = useState('All Active Members');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleSend = async () => {
    if (!msgTitle || !msgBody) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setMsgTitle('');
    setMsgBody('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#004ac6]">Notifications</h2>
        <p className="text-sm text-[#434655] mt-1">System alerts, member updates, and broadcast center.</p>
      </div>

      {/* Announcement banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#fea619] p-5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[#684000]">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Global Announcement</h3>
            <p className="text-sm opacity-90">The Kandy Esala Perahera digital collection is now available for archival review.</p>
          </div>
        </div>
        <button className="shrink-0 px-4 py-2 bg-[#684000] text-white text-sm font-semibold rounded-full hover:scale-105 transition-transform active:scale-95">
          View Archive
        </button>
        <div className="absolute -right-6 -bottom-6 opacity-10">
          <Bell className="w-24 h-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#004ac6] flex items-center gap-2">
              Recent Activity
              {unread > 0 && (
                <span className="text-xs bg-[#004ac6]/10 text-[#004ac6] px-2 py-0.5 rounded-full font-bold">
                  {unread} Unread
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={markAllRead}
                className="text-xs text-[#434655] hover:text-[#004ac6] px-3 py-1.5 rounded-lg hover:bg-[#eceef0] transition-colors"
              >
                Mark all read
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {notifs.map((n) => {
              const cfg = typeConfig[n.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                  className={`relative rounded-2xl p-4 flex gap-3 cursor-pointer transition-all hover:-translate-y-0.5 ${
                    !n.read ? 'border-l-4 border-[#004ac6]' : ''
                  }`}
                  style={{
                    backdropFilter: 'blur(12px)',
                    background: n.read ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.85)',
                    border: n.read ? '1px solid rgba(255,255,255,0.3)' : `1px solid rgba(0,74,198,0.15)`,
                    borderLeft: !n.read ? '4px solid #004ac6' : undefined,
                    boxShadow: '0 4px 16px 0 rgba(37,99,235,0.06)',
                  }}
                >
                  {!n.read && (
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#004ac6]" />
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-4.5 h-4.5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-xs font-bold ${cfg.color}`}>
                        {n.type.charAt(0).toUpperCase() + n.type.slice(1)} Update
                      </span>
                      <span className="text-xs text-[#434655]/50 shrink-0">{n.time}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#191c1e] leading-tight">{n.title}</h4>
                    <p className="text-xs text-[#434655] mt-1 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Broadcast form */}
          <div
            className="rounded-2xl p-6 mt-2"
            style={{
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
            }}
          >
            <h3 className="text-lg font-semibold text-[#004ac6] mb-4 flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Bulk Notification
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#434655]">Recipient Group</label>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-white/50 border border-[#c3c6d7]/30 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
                  >
                    {['All Active Members', 'Academic Scholars', 'Student Researchers', 'Institutional Partners', 'All Staff'].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#434655]">Urgency Level</label>
                  <div className="flex gap-1.5 p-1 bg-[#eceef0] rounded-xl">
                    {(['Normal', 'High', 'Critical'] as const).map((u) => (
                      <button
                        key={u}
                        onClick={() => setUrgency(u)}
                        className={`flex-1 py-1.5 text-xs rounded-lg transition-all font-semibold ${
                          urgency === u
                            ? u === 'Critical'
                              ? 'bg-[#ba1a1a] text-white shadow-sm'
                              : u === 'High'
                              ? 'bg-[#fea619] text-[#684000] shadow-sm'
                              : 'bg-white shadow-sm text-[#004ac6]'
                            : 'text-[#434655] hover:bg-white/50'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#434655]">Message Title</label>
                <input
                  value={msgTitle}
                  onChange={(e) => setMsgTitle(e.target.value)}
                  placeholder="Summary of the update..."
                  className="w-full bg-white/50 border border-[#c3c6d7]/30 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#434655]">Content Body</label>
                <textarea
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  rows={3}
                  placeholder="Write your detailed announcement here..."
                  className="w-full bg-white/50 border border-[#c3c6d7]/30 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#004ac6]/20 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSend}
                  disabled={sending || !msgTitle || !msgBody}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg ${
                    sent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#004ac6] text-white hover:bg-[#2563eb] shadow-blue-500/20 disabled:opacity-50'
                  }`}
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Transmitting...
                    </>
                  ) : sent ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Message Broadcasted
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Broadcast Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings panel */}
        <div className="space-y-5">
          <div
            className="rounded-2xl p-6"
            style={{
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
            }}
          >
            <h3 className="text-lg font-semibold text-[#004ac6] mb-5">Notification Settings</h3>
            <div className="space-y-5">
              {[
                { label: 'Email Notifications', desc: 'Weekly digest and urgent alerts', icon: Bell, enabled: emailEnabled, set: setEmailEnabled, color: 'bg-blue-500/10 text-[#004ac6]' },
                { label: 'SMS Alerts', desc: 'Critical system and security info', icon: BellOff, enabled: smsEnabled, set: setSmsEnabled, color: 'bg-amber-500/10 text-[#855300]' },
                { label: 'Push Notifications', desc: 'Real-time browser activity', icon: Bell, enabled: pushEnabled, set: setPushEnabled, color: 'bg-orange-500/10 text-[#943700]' },
              ].map((setting) => {
                const Icon = setting.icon;
                return (
                  <div key={setting.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${setting.color}`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#191c1e]">{setting.label}</p>
                        <p className="text-xs text-[#434655]/60">{setting.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setting.set(!setting.enabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-[#004ac6]' : 'bg-[#e0e3e5]'}`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${setting.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 p-3 rounded-xl bg-[#f2f4f6] border border-[#c3c6d7]/20">
              <p className="text-xs text-[#434655] italic">
                &ldquo;Notifications are synchronized across all library terminals and the mobile management portal.&rdquo;
              </p>
            </div>
          </div>

          {/* Preservation alert */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)',
            }}
          >
            <img
              src="https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Archive manuscripts"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h4 className="text-sm font-bold text-[#004ac6] mb-1">Preservation Alert</h4>
              <p className="text-xs text-[#434655]">
                Humidity levels in Archival Vault 03 have deviated. Automatic stabilization initiated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
