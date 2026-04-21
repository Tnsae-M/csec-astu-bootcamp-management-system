import React from 'react';
import { Card, Button } from '@/src/components/ui';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  BookOpen,
  ArrowRight,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export default function InstructorDashboard() {
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const sessionItems = [
    { id: 'SES-01', title: 'Modular Backend Design', division: 'Software Development', status: 'LIVE' },
    { id: 'SES-02', title: 'React Hooks Deep Dive', division: 'Software Development', status: 'UPCOMING' },
    { id: 'SES-03', title: 'Advanced SQL Patterns', division: 'Data Science', status: 'COMPLETED' },
  ];

  const tasks = [
    { id: 'TASK-01', title: 'Environment Config', submissions: 12 },
    { id: 'TASK-02', title: 'Unit Testing Suite', submissions: 8 },
    { id: 'TASK-03', title: 'API Integration', submissions: 15 },
  ];

  const filteredSessions = sessionItems.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 selection:bg-brand-accent selection:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-accent uppercase leading-none mb-2">
            Faculty Dashboard
          </h1>
          <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest leading-none">Curriculum Governance & Academic Evaluation</p>
        </div>
        <div className="flex space-x-3">
          <Button size="md" className="text-[10px] font-black uppercase tracking-widest px-8 shadow-lg shadow-brand-accent/20">Provision Session</Button>
          <Button variant="secondary" size="md" className="text-[10px] font-black uppercase tracking-widest px-8 bg-brand-primary border border-brand-border text-brand-accent">Upload Resources</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 geo-card p-8">
          <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-8">Active Teaching Schedule</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Session Title</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Division</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Session Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr key={session.id} className="border-b border-brand-border grow last:border-0 hover:bg-brand-primary/50 transition-colors">
                  <td className="py-5">
                    <p className="font-bold text-sm text-text-main uppercase tracking-tight">{session.title}</p>
                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1">Ref ID: {session.id}</p>
                  </td>
                  <td className="py-5 text-xs font-bold text-text-muted uppercase tracking-widest">{session.division}</td>
                  <td className="py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm",
                      session.status === 'LIVE' ? "bg-green-100 text-green-700" :
                      session.status === 'UPCOMING' ? "bg-blue-100 text-blue-700" :
                      "bg-brand-primary text-text-muted"
                    )}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="geo-card p-8">
             <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-6">Evaluation Queue</h3>
             <div className="space-y-4">
               {filteredTasks.slice(0, 3).map((task) => (
                 <div key={task.id} className="flex items-center justify-between p-4 bg-brand-primary border border-brand-border rounded-xl hover:border-brand-accent/30 transition-all group cursor-pointer shadow-sm">
                    <div>
                      <div className="font-black text-[11px] text-brand-accent uppercase tracking-widest">Assignment Code: {task.id}</div>
                      <div className="text-[9px] text-text-muted uppercase font-bold tracking-widest mt-1">Pending Submission Review</div>
                    </div>
                    <ArrowRight size={14} className="text-brand-accent opacity-0 group-hover:opacity-100 transition-all" />
                 </div>
               ))}
             </div>
          </div>
          
          <div className="p-8 bg-brand-accent rounded-2xl text-white shadow-xl shadow-brand-accent/20 relative overflow-hidden group">
             <h4 className="font-black uppercase tracking-tighter text-lg mb-4">Faculty Analytics</h4>
             <p className="text-[11px] font-bold uppercase tracking-widest opacity-80 leading-relaxed">
               Module evaluations for the current cycle are trending 15% higher than previous cohorts. System data integrity remains stable.
             </p>
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 group-hover:opacity-20 transition-all duration-500">
                <Activity size={120} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
