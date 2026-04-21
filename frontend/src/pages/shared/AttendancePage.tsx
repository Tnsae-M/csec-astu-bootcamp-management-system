import React from 'react';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export default function AttendancePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const attendanceRecord = [
    { id: 1, date: '2026-04-15', session: 'System Architecture', status: 'PRESENT', time: '10:00 AM' },
    { id: 2, date: '2026-04-16', session: 'Database Design', status: 'PRESENT', time: '10:05 AM' },
    { id: 3, date: '2026-04-17', session: 'API Development', status: 'ABSENT', time: '-' },
    { id: 4, date: '2026-04-18', session: 'Security Fundamentals', status: 'PRESENT', time: '09:55 AM' },
  ];

  const filteredRecord = attendanceRecord.filter((r) =>
    r.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div>
        <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">
          {user?.role === 'INSTRUCTOR' ? 'Attendance Governance' : 'My Attendance Record'}
        </h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Verified Presence & Participation Registry</p>
      </div>

      <div className="geo-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-primary/50 border-b border-brand-border">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Lifecycle Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Operational Session</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Timestamp</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Verification Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecord.map((record) => (
              <tr key={record.id} className="border-b border-brand-border hover:bg-brand-primary/30 transition-colors last:border-0 grow">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <Calendar size={14} className="text-brand-accent" />
                    <span className="text-xs font-black text-text-main uppercase tracking-widest">{record.date}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-text-main uppercase tracking-tight">{record.session}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2 text-text-muted">
                    <Clock size={12} />
                    <span className="text-xs font-medium">{record.time}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={cn(
                    "inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm",
                    record.status === 'PRESENT' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {record.status === 'PRESENT' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                    <span>{record.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
