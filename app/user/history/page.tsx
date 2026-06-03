import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const history = [
  { id: 'ISS-012', title: 'Mahavamsa — The Great Chronicle', author: 'Mahanama Thero', issued: '2024-10-01', returned: '2024-10-14', status: 'Returned', fine: 0 },
  { id: 'ISS-011', title: 'Buddhist Art of Sri Lanka', author: 'Nimal de Silva', issued: '2024-09-15', returned: '2024-09-28', status: 'Returned', fine: 0 },
  { id: 'ISS-010', title: 'Cinnamon Gardens', author: 'Shyam Selvadurai', issued: '2024-08-20', returned: '2024-09-05', status: 'Returned', fine: 200 },
  { id: 'ISS-009', title: 'Kandyan Kingdom: A Visual History', author: 'Roland Silva', issued: '2024-07-10', returned: '2024-07-23', status: 'Returned', fine: 0 },
  { id: 'ISS-001', title: 'Epochs of Ceylon History', author: 'P.E. Pieris', issued: '2024-11-20', returned: '—', status: 'Active', fine: 0 },
  { id: 'ISS-002', title: 'Sinhalese Literature — Anthology', author: 'E. Sarachchandra', issued: '2024-11-25', returned: '—', status: 'Active', fine: 0 },
];

const statusConfig = {
  Returned: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  Active: { icon: Clock, color: 'text-[#004ac6]', bg: 'bg-blue-100' },
  Overdue: { icon: AlertTriangle, color: 'text-[#ba1a1a]', bg: 'bg-red-100' },
};

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#004ac6]">Borrowing History</h2>
        <p className="text-sm text-[#434655] mt-1">Complete record of your borrowed books — {history.length} transactions.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Borrowed', value: '24', color: 'text-[#004ac6]' },
          { label: 'Currently Active', value: '2', color: 'text-[#004ac6]' },
          { label: 'Total Fines Paid', value: 'LKR 200', color: 'text-[#ba1a1a]' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 text-center" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)' }}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#434655]/70 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px 0 rgba(37,99,235,0.06)' }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#c3c6d7]/20">
              {['Issue ID', 'Book', 'Issued', 'Returned', 'Status', 'Fine'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#434655] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c6d7]/10">
            {history.map(item => {
              const cfg = statusConfig[item.status as keyof typeof statusConfig];
              const Icon = cfg.icon;
              return (
                <tr key={item.id} className="hover:bg-[#f2f4f6]/50 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono text-[#004ac6] font-semibold">{item.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-[#191c1e] truncate max-w-[180px]">{item.title}</p>
                    <p className="text-xs text-[#434655]/60">{item.author}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#434655]">{item.issued}</td>
                  <td className="px-5 py-3.5 text-sm text-[#434655]">{item.returned}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-3 h-3" />{item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {item.fine > 0 ? (
                      <span className="text-sm font-bold text-[#ba1a1a]">LKR {item.fine}</span>
                    ) : (
                      <span className="text-sm text-emerald-600 font-medium">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
