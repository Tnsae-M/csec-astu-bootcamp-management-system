import React, { useState } from 'react';
import { FileUp, Link as LinkIcon, Send, CheckCircle2, ChevronRight, File } from 'lucide-react';
import { Button } from '@/src/components/ui';
import { cn } from '../../lib/utils';

export default function SubmissionFormPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTask, setSelectedTask] = useState('TASK-01');

  const tasks = [
    { id: 'TASK-01', title: 'Modular Architecture Design', division: 'Software Development', deadline: '2026-04-25' },
    { id: 'TASK-02', title: 'React Performance Audit', division: 'Software Development', deadline: '2026-04-28' },
    { id: 'TASK-03', title: 'Database Normalization', division: 'Data Science', deadline: '2026-05-01' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="geo-card p-12 text-center max-w-lg space-y-8 relative overflow-hidden">
           <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={48} />
           </div>
           <div className="space-y-4">
             <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter">Receipt Confirmed</h2>
             <p className="text-text-muted font-medium text-sm leading-relaxed uppercase tracking-widest">
               Your technical artifacts have been successfully uploaded to the central registry. Faculty review pending.
             </p>
           </div>
           <Button onClick={() => setIsSubmitted(false)} variant="secondary" className="px-10 bg-brand-primary border border-brand-border text-brand-accent font-black uppercase tracking-widest text-[11px]">
             Submit Another Artefact
           </Button>
           
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 selection:bg-brand-accent selection:text-white">
      <div>
        <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Work Submission</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Technical Artifact Upload & Peer Review Entry</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="geo-card p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Target Objective / Task</label>
                <div className="grid grid-cols-1 gap-3">
                  {tasks.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => setSelectedTask(task.id)}
                      className={cn(
                        "p-5 rounded-2xl border-2 transition-all cursor-pointer group flex justify-between items-center",
                        selectedTask === task.id 
                          ? "bg-brand-accent/[0.03] border-brand-accent shadow-sm" 
                          : "bg-white border-brand-border hover:border-brand-accent/30"
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          selectedTask === task.id ? "bg-brand-accent text-white" : "bg-brand-primary text-text-muted group-hover:text-brand-accent"
                        )}>
                          <File size={20} />
                        </div>
                        <div>
                          <div className={cn("text-sm font-black uppercase tracking-tight", selectedTask === task.id ? "text-brand-accent" : "text-text-main")}>{task.title}</div>
                          <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">{task.id} • Deadline: {task.deadline}</div>
                        </div>
                      </div>
                      <ChevronRight size={16} className={cn("transition-all", selectedTask === task.id ? "text-brand-accent opacity-100" : "text-brand-border opacity-0 group-hover:opacity-100")} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-brand-border">
                <div className="space-y-4">
                   <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Technical Repository Link</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                        <LinkIcon size={14} />
                      </div>
                      <input 
                        type="url"
                        placeholder="https://github.com/..."
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all font-medium"
                      />
                   </div>
                </div>
                <div className="space-y-4">
                   <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Documentation Upload (PDF)</label>
                   <div className="relative group">
                      <input type="file" className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="w-full flex items-center justify-center p-4 py-4 rounded-xl border-2 border-dashed border-brand-border bg-brand-primary/20 hover:bg-brand-accent/5 hover:border-brand-accent/40 cursor-pointer transition-all">
                        <FileUp size={16} className="mr-2 text-brand-accent" />
                        <span className="text-xs font-black uppercase tracking-widest text-text-muted group-hover:text-brand-accent">Select Artifact</span>
                      </label>
                   </div>
                </div>
              </div>

              <div className="pt-8">
                <Button type="submit" className="w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-brand-accent/20">
                  <Send size={16} className="mr-3" /> Execute Submission
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="geo-card p-8 bg-brand-accent text-white shadow-xl shadow-brand-accent/20 relative overflow-hidden group">
            <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Integrity Protocol</h3>
            <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-80 mb-6">
              All submissions are automatically scanned for plagiarism and structural validity. Ensure your repository is set to private if containing sensitive departmental data.
            </p>
            <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest">
               <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-white/50" /> Clean Code Principles</li>
               <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-white/50" /> Modular Architecture</li>
               <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-white/50" /> Comprehensive Docs</li>
            </ul>
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-125 transition-all duration-700">
               <FileUp size={160} />
            </div>
          </div>
          
          <div className="geo-card p-8">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6">Recent Activity</h3>
             <div className="space-y-6">
                {[
                  { title: 'Environment Config', status: 'GRADED', date: '3 days ago' },
                  { title: 'Unit Testing Suite', status: 'LATE', date: '5 days ago' }
                ].map((act, i) => (
                  <div key={i} className="flex justify-between items-center opacity-80">
                     <div>
                        <div className="text-[11px] font-black uppercase tracking-tight text-text-main">{act.title}</div>
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">{act.date}</div>
                     </div>
                     <span className={cn(
                       "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shadow-sm",
                       act.status === 'GRADED' ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-600"
                     )}>{act.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
