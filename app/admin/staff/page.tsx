import { UserCheck, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';

const staffMembers = [
  { id: 'STF-001', name: 'Kasuni Mendis', email: 'k.mendis@archive.lk', phone: '+94 77 123 4567', dept: 'Circulation', role: 'Senior Librarian', status: 'Active', joined: 'Mar 2021', initials: 'KM', color: '#2563eb' },
  { id: 'STF-002', name: 'Chamara Bandara', email: 'chamara.b@archive.lk', phone: '+94 71 234 5678', dept: 'Heritage Archive', role: 'Archivist', status: 'Active', joined: 'Aug 2022', initials: 'CB', color: '#0891b2' },
  { id: 'STF-003', name: 'Nirosha Silva', email: 'n.silva@archive.lk', phone: '+94 76 345 6789', dept: 'Digital Services', role: 'IT Specialist', status: 'Active', joined: 'Jan 2023', initials: 'NS', color: '#10b981' },
  { id: 'STF-004', name: 'Prasanna Wijeratne', email: 'p.wijeratne@archive.lk', phone: '+94 72 456 7890', dept: 'Circulation', role: 'Librarian', status: 'On Leave', joined: 'Jun 2022', initials: 'PW', color: '#fea619' },
  { id: 'STF-005', name: 'Dilini Perera', email: 'd.perera@archive.lk', phone: '+94 75 567 8901', dept: 'Research Support', role: 'Research Librarian', status: 'Active', joined: 'Apr 2023', initials: 'DP', color: '#943700' },
  { id: 'STF-006', name: 'Saman Rathnayake', email: 's.rathnayake@archive.lk', phone: '+94 77 678 9012', dept: 'Acquisitions', role: 'Acquisitions Officer', status: 'Active', joined: 'Nov 2021', initials: 'SR', color: '#004ac6' },
];

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#004ac6]">Staff Management</h2>
          <p className="text-sm text-[#434655] mt-1">{staffMembers.length} staff members across all departments.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004ac6] text-white text-sm font-semibold hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-500/20 w-fit">
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="rounded-2xl p-5 group transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            style={{
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px 0 rgba(37,99,235,0.08)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md"
                  style={{ background: staff.color }}
                >
                  {staff.initials}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#191c1e] group-hover:text-[#004ac6] transition-colors">
                    {staff.name}
                  </h3>
                  <p className="text-xs text-[#434655]/70">{staff.role}</p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  staff.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-[#684000]'
                }`}
              >
                {staff.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-[#434655]">
                <Mail className="w-3.5 h-3.5 text-[#434655]/50" />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#434655]">
                <Phone className="w-3.5 h-3.5 text-[#434655]/50" />
                <span>{staff.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#c3c6d7]/20">
              <div>
                <p className="text-xs text-[#434655]/60 uppercase tracking-wider font-medium">Department</p>
                <p className="text-xs font-semibold text-[#191c1e]">{staff.dept}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-[#004ac6] transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-[#ba1a1a] transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
