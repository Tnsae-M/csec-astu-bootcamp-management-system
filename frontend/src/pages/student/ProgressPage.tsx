import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { TrendingUp, Award, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ProgressPage() {
  const { reports } = useSelector((state: RootState) => state.progress);
  const { user } = useSelector((state: RootState) => state.auth);

  const studentReports = reports.filter(r => r.studentId === user?.id);

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div>
        <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Performance Metrics</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Evolution Tracking & Milestone Success</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="geo-card p-8">
          <TrendingUp className="text-brand-accent mb-4" size={24} />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Mean Score Aggregate</p>
          <h3 className="text-3xl font-black text-text-main tracking-tighter">88.5%</h3>
        </div>
        <div className="geo-card p-8 border-brand-accent/20 bg-brand-accent/5">
          <Award className="text-brand-accent mb-4" size={24} />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Milestones Completed</p>
          <h3 className="text-3xl font-black text-brand-accent tracking-tighter">02 / 12</h3>
        </div>
        <div className="geo-card p-8">
          <Zap className="text-brand-accent mb-4" size={24} />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Engagement Vector</p>
          <h3 className="text-3xl font-black text-text-main tracking-tighter">High</h3>
        </div>
      </div>

      <div className="geo-card overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-brand-primary/50 border-b border-brand-border">
               <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Timeline Sector</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Performance Metric</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">System Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Registry Remarks</th>
               </tr>
            </thead>
            <tbody>
               {studentReports.map((r) => (
                 <tr key={r.id} className="border-b border-brand-border hover:bg-brand-primary/30 transition-colors last:border-0 grow">
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-text-main uppercase tracking-widest">PHASE {String(r.week).padStart(2, '0')}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-brand-accent tracking-tighter">{r.score}.00%</span>
                          <div className="w-32 h-1.5 bg-brand-primary rounded-full mt-2 overflow-hidden border border-brand-border shadow-inner">
                             <div className="h-full bg-brand-accent" style={{ width: `${r.score}%` }} />
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className={cn(
                         "inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                         r.status === 'PASSED' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                       )}>
                          <CheckCircle2 size={10} />
                          <span>{r.status}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs text-text-muted max-w-sm italic">{r.remarks}</p>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
