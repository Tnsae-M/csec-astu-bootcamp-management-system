import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Users2, ShieldAlert, BadgeCheck } from 'lucide-react';

export default function GroupsPage() {
  const { groups } = useSelector((state: RootState) => state.groups);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div>
        <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Academic Groups</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Collaboration Units & Faculty Mentorship</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((g) => (
          <div key={g.id} className="geo-card p-6 group hover:border-brand-accent/50 transition-all">
            <div className="flex justify-between items-center mb-6">
              <div className="w-10 h-10 bg-brand-primary border border-brand-border rounded-lg flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all shadow-sm">
                <Users2 size={20} />
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] bg-brand-primary border border-brand-border px-3 py-1 rounded-lg">ID: {g.id}</span>
            </div>

            <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-4 group-hover:text-brand-accent transition-colors">{g.name}</h3>
            
            <div className="space-y-3 mb-8">
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  <span>Assigned Mentor</span>
                  <span className="text-text-main">{g.mentor}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  <span>Member Count</span>
                  <span className="text-text-main">{g.membersCount} Learners</span>
               </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest py-3 border-t border-brand-border opacity-80">
               <BadgeCheck size={12} className="text-green-600" />
               <span className="text-text-muted">Official University Registry</span>
            </div>
          </div>
        ))}
        
        {user?.role === 'ADMIN' && (
          <div className="border border-brand-accent/20 border-dashed rounded-2xl bg-brand-accent/[0.02] flex flex-col items-center justify-center p-8 hover:bg-brand-accent/5 hover:border-brand-accent/40 transition-all text-text-main cursor-pointer group shadow-sm">
             <div className="w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users2 size={24} className="text-brand-accent" />
             </div>
             <p className="text-[11px] font-black uppercase tracking-widest text-brand-accent">Create New Group</p>
          </div>
        )}
      </div>
    </div>
  );
}
