import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '@/src/components/ui';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export default function SubmissionsPage() {
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const submissions = [
    { id: 'SUB-001', student: 'Henok Tadesse', task: 'Modular Architecture', status: 'PENDING', date: '2026-04-19' },
    { id: 'SUB-002', student: 'Biniam Yosef', task: 'React State Hooks', status: 'GRADED', date: '2026-04-18' },
    { id: 'SUB-003', student: 'Selamawit Kebede', task: 'Modular Architecture', status: 'PENDING', date: '2026-04-19' },
    { id: 'SUB-004', student: 'Dawit Mekonnen', task: 'Database Schema Design', status: 'GRADED', date: '2026-04-17' },
  ];

  const filteredSubmissions = submissions.filter((s) =>
    s.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Submission Review</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Evaluation Pipeline & Academic Peer Review</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" className="bg-brand-primary border border-brand-border text-brand-accent px-6">
            <Filter size={14} className="mr-2" /> Filter Batch
          </Button>
        </div>
      </div>

      <div className="geo-card overflow-hidden">
        <div className="p-6 border-b border-brand-border bg-brand-primary/30 flex justify-end items-center">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Lifecycle Queue: {filteredSubmissions.length} Entities</span>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-brand-primary/50 border-b border-brand-border">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Entity / Student</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Academic Task</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Submission Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((sub) => (
              <tr key={sub.id} className="border-b border-brand-border hover:bg-brand-primary/30 transition-colors last:border-0 grow">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-text-main uppercase tracking-tight">{sub.student}</span>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-0.5">{sub.id}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <FileText size={14} className="text-brand-accent" />
                    <span className="text-xs font-bold text-text-main uppercase tracking-widest">{sub.task}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-medium text-text-muted">{sub.date}</span>
                </td>
                <td className="px-8 py-6">
                  <div className={cn(
                    "inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm",
                    sub.status === 'GRADED' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {sub.status === 'GRADED' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                    <span>{sub.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Button size="sm" variant="outline" className="text-[10px] font-black uppercase tracking-widest border-brand-border text-brand-accent px-4 hover:bg-brand-accent hover:text-white transition-all">Review</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
