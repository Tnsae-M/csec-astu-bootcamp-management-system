import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { User, Mail, Shield, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function UsersPage() {
  const { users } = useSelector((state: RootState) => state.users);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.division?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">User Directory</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Active Directory & Access Control Systems</p>
        </div>
        <button className="bg-brand-accent text-white px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-accent/20 active:translate-y-[1px]">
          Provision New User
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((u) => (
          <div key={u.id} className="geo-card p-6 flex flex-col md:flex-row md:items-center justify-between group hover:border-brand-accent/30 transition-all">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 rounded-xl bg-brand-primary border border-brand-border flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all shadow-sm">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-text-main font-bold uppercase tracking-tight text-lg group-hover:text-brand-accent transition-colors">{u.name}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <Mail size={10} className="mr-1 text-brand-accent" /> {u.email}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-border">•</span>
                  <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-accent">
                    <Shield size={10} className="mr-1" /> {u.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8 mt-6 md:mt-0">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Division Assignment</p>
                  <p className="text-xs font-black text-text-main uppercase tracking-tighter">{u.division}</p>
               </div>
               <div className={cn(
                 "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                 u.status === 'ACTIVE' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
               )}>
                 {u.status}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
