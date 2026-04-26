import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Users2, BadgeCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';

export default function GroupsPage() {
  const { groups } = useSelector((state: RootState) => state.groups);
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (g.mentor?.name && g.mentor.name.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div>
        <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Academic Groups</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Collaboration Units & Faculty Mentorship</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((g) => (
          <Card key={g._id || g.id} className="flex flex-col h-full hover:border-brand-accent transition-colors shadow-sm">
            <CardHeader className="flex flex-col space-y-1.5 pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                  <Users2 size={20} />
                </div>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] bg-brand-primary border border-brand-border px-3 py-1 rounded-lg">
                  ID: {g._id || g.id}
                </span>
              </div>
              <CardTitle className="text-xl font-bold">
                {g.name}
              </CardTitle>
              <div className="space-y-1 mt-2">
                 <div className="flex justify-between items-center text-xs text-text-muted">
                    <span>Mentor:</span>
                    <span className="font-semibold text-text-main">{g.mentor?.name || 'Unassigned'}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-text-muted">
                    <span>Members:</span>
                    <span className="font-semibold text-text-main">{g.members?.length || 0} Learners</span>
                 </div>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto pt-4 flex gap-2 border-t border-brand-border">
               <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  <BadgeCheck size={12} className="text-green-600" />
                  <span>University Registry</span>
               </div>
            </CardFooter>
          </Card>
        ))}
        
        {user?.role === 'ADMIN' && (
          <div className="border border-brand-accent/20 border-dashed rounded-2xl bg-brand-accent/[0.02] flex flex-col items-center justify-center p-8 hover:bg-brand-accent/5 hover:border-brand-accent/40 transition-all text-text-main cursor-pointer group shadow-sm min-h-[200px]">
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
