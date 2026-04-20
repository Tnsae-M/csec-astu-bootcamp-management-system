import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Building2, UserCircle, Users, Activity } from 'lucide-react';

export default function DivisionsPage() {
  const { divisions } = useSelector((state: RootState) => state.divisions);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const filteredDivisions = divisions.filter((d) => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div>
        <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Academic Divisions</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Departmental Framework & Oversight</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDivisions.map((d) => (
          <div key={d.id} className="geo-card p-8 group hover:border-brand-accent/40 transition-all">
            <div className="flex justify-between items-start mb-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-accent text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Building2 size={28} />
              </div>
              <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-200">
                <Activity size={10} /> {d.status}
              </div>
            </div>

            <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-2 group-hover:text-brand-accent transition-colors">{d.name}</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-text-muted">
                <UserCircle size={14} className="mr-2 text-brand-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Head of Department: </span>
                <span className="text-xs font-black text-text-main ml-2 uppercase tracking-tighter">{d.head}</span>
              </div>
              <div className="flex items-center text-text-muted">
                <Users size={14} className="mr-2 text-brand-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Enrolled Learners: </span>
                <span className="text-xs font-black text-text-main ml-2 uppercase tracking-tighter">{d.studentsCount} Students</span>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-border flex gap-3">
              <button className="flex-1 bg-brand-primary border border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white transition-all py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                View Analytics
              </button>
              <button className="flex-1 bg-brand-primary border border-brand-border text-text-main hover:bg-brand-primary/50 transition-all py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                Manage Unit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
