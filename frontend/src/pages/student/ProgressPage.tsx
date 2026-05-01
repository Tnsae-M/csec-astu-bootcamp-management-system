import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { TrendingUp, Award, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchMyProgress } from '../../features/progress/progressSlice';
import { fetchMyEnrollments } from '../../features/enrollments/enrollmentsSlice';

export default function ProgressPage() {
  const dispatch: any = useDispatch();
  const { reports, loading, error } = useSelector((state: RootState) => state.progress);
  const { user } = useSelector((state: RootState) => state.auth);
  const { myEnrollments } = useSelector((state: RootState) => state.enrollments);

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  useEffect(() => {
    if (myEnrollments.length > 0) {
      const firstBootcampId = myEnrollments[0].bootcamp?._id || myEnrollments[0].bootcamp;
      if (firstBootcampId) {
        dispatch(fetchMyProgress(firstBootcampId));
      }
    }
  }, [myEnrollments, dispatch]);

  const stats = reports[0] || {};
  const meanScore = stats.avgScore || 0;
  const milestones = `${stats.taskCompletionRate > 0 ? Math.round((stats.taskCompletionRate / 100) * 12) : 0} / 12`;
  const engagement = stats.attendanceRate > 80 ? 'High' : stats.attendanceRate > 50 ? 'Medium' : 'Low';

  // Mocking timeline sectors based on real stats for the table
  const timelineSectors = [
    { phase: '01', metric: stats.attendanceRate || 0, status: (stats.attendanceRate || 0) > 75 ? 'PASSED' : 'WATCH', remarks: 'Session attendance consistency' },
    { phase: '02', metric: stats.taskCompletionRate || 0, status: (stats.taskCompletionRate || 0) > 60 ? 'PASSED' : 'WATCH', remarks: 'Project milestones & task registry' },
    { phase: '03', metric: stats.avgScore || 0, status: (stats.avgScore || 0) > 70 ? 'PASSED' : 'WATCH', remarks: 'Submission quality and peer review' },
  ];

  if (loading && myEnrollments.length > 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Performance Metrics</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Evolution Tracking & Milestone Success</p>
        </div>
        {myEnrollments[0]?.bootcamp?.name && (
          <div className="text-right">
            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Active Track</span>
            <p className="text-sm font-black text-text-main uppercase">{myEnrollments[0].bootcamp.name}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="geo-card p-8 group hover:border-brand-accent/30 transition-all">
          <TrendingUp className="text-brand-accent mb-4 group-hover:scale-110 transition-transform" size={24} />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Mean Score Aggregate</p>
          <h3 className="text-3xl font-black text-text-main tracking-tighter">{meanScore}%</h3>
        </div>
        <div className="geo-card p-8 border-brand-accent/20 bg-brand-accent/5 group hover:bg-brand-accent/10 transition-all">
          <Award className="text-brand-accent mb-4 group-hover:scale-110 transition-transform" size={24} />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Milestones Completed</p>
          <h3 className="text-3xl font-black text-brand-accent tracking-tighter">{milestones}</h3>
        </div>
        <div className="geo-card p-8 group hover:border-brand-accent/30 transition-all">
          <Zap className="text-brand-accent mb-4 group-hover:scale-110 transition-transform" size={24} />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Engagement Vector</p>
          <h3 className="text-3xl font-black text-text-main tracking-tighter">{engagement}</h3>
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
               {timelineSectors.map((r, idx) => (
                 <tr key={idx} className="border-b border-brand-border hover:bg-brand-primary/30 transition-colors last:border-0">
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-text-main uppercase tracking-widest">SECTOR {r.phase}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-brand-accent tracking-tighter">{r.metric}%</span>
                          <div className="w-32 h-1.5 bg-brand-primary rounded-full mt-2 overflow-hidden border border-brand-border shadow-inner">
                             <div className="h-full bg-brand-accent transition-all duration-1000" style={{ width: `${r.metric}%` }} />
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className={cn(
                         "inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                         r.status === 'PASSED' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                       )}>
                          <CheckCircle2 size={10} />
                          <span>{r.status}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs text-text-muted max-w-sm italic font-medium">{r.remarks}</p>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
