import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui';
import { Users2, Clock, Calendar, BookOpen } from 'lucide-react';
import { groupsService } from '../../services/groups.service';
import { sessionsService } from '../../services/sessions.service';
import { setGroupsStart, setGroupsSuccess, setGroupsFailure } from '../../features/groups/groupsSlice';
import { setSessionsStart, setSessionsSuccess, setSessionsFailure } from '../../features/sessions/sessionSlice';

export default function BootcampDetailPage() {
  const { role, divisionId, bootcampId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState<'groups' | 'sessions'>('sessions');

  const { groups, loading: groupsLoading } = useSelector((state: RootState) => state.groups);
  const { items: sessions, loading: sessionsLoading } = useSelector((state: RootState) => state.sessions);

  useEffect(() => {
    if (!bootcampId) return;

    dispatch(setGroupsStart());
    groupsService.getGroupsByBootcamp(bootcampId)
      .then(res => dispatch(setGroupsSuccess(res.data || [])))
      .catch(err => dispatch(setGroupsFailure(err.message)));

    dispatch(setSessionsStart());
    sessionsService.getSessionsByBootcamp(bootcampId)
      .then(res => dispatch(setSessionsSuccess(res.data || [])))
      .catch(err => dispatch(setSessionsFailure(err.message)));
  }, [bootcampId, dispatch]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreate = async () => {
    alert(`Creation logic for ${activeTab} would trigger here. Ready for module expansion.`);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white relative">
      <div className="flex justify-between items-center pr-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Bootcamp Hub</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Manage Groups & Sessions</p>
        </div>
        {(role === 'admin' || role === 'instructor') && (
          <div className="flex gap-4">
            <Button 
              onClick={() => { setActiveTab('groups'); setShowCreateModal(true); }}
              className="bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest px-6 h-10 hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/20"
            >
              Add Group
            </Button>
            <Button 
              onClick={() => { setActiveTab('sessions'); setShowCreateModal(true); }}
              className="bg-brand-primary border border-brand-accent text-brand-accent text-[10px] font-black uppercase tracking-widest px-6 h-10 hover:bg-brand-accent/5"
            >
              Add Session
            </Button>
          </div>
        )}
      </div>

      {/* Creation Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-brand-primary/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <Card className="w-full max-w-md border-brand-accent shadow-2xl shadow-brand-accent/20">
            <CardHeader>
              <CardTitle className="uppercase tracking-tighter font-black text-brand-accent">Initialize New {activeTab === 'groups' ? 'Group' : 'Session'}</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Provide the metadata for this deployment.</CardDescription>
            </CardHeader>
            <div className="p-6 space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Entity Title</label>
                 <input type="text" className="w-full bg-brand-primary border border-brand-border rounded px-3 py-2 text-xs focus:border-brand-accent outline-none" placeholder={`New ${activeTab.slice(0, -1)} name...`} />
               </div>
               {activeTab === 'sessions' && (
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Date</label>
                      <input type="date" className="w-full bg-brand-primary border border-brand-border rounded px-3 py-2 text-xs focus:border-brand-accent outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Time</label>
                      <input type="time" className="w-full bg-brand-primary border border-brand-border rounded px-3 py-2 text-xs focus:border-brand-accent outline-none" />
                    </div>
                 </div>
               )}
            </div>
            <CardFooter className="flex gap-4">
               <Button onClick={() => setShowCreateModal(false)} variant="outline" className="flex-1 text-[10px] font-black uppercase tracking-widest">Cancel</Button>
               <Button onClick={handleCreate} className="flex-1 bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest">Confirm Creation</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-brand-border space-x-8">
        <button
          onClick={() => setActiveTab('groups')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${
            activeTab === 'groups' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-text-muted hover:text-text-main'
          }`}
        >
        Groups
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${
            activeTab === 'sessions' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-text-muted hover:text-text-main'
          }`}
        >
        Sessions
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === 'groups' && (
          <div>
            {groupsLoading ? (
              <div className="text-center text-text-muted font-bold uppercase py-10">Loading Groups...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((g) => (
                  <Card key={g._id || g.id} className="flex flex-col h-full hover:border-brand-accent transition-colors shadow-sm">
                    <CardHeader className="flex flex-col space-y-1.5 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-10 h-10 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                          <Users2 size={20} />
                        </div>
                        <div className="text-[10px] font-bold uppercase text-text-muted bg-brand-primary border border-brand-border px-2 py-1 rounded">
                          {g.members?.length || 0} Members
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {g.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 text-text-muted">
                        Mentor: {g.mentor?.name || 'Unassigned'}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-4 flex gap-2">
                       {/* Placeholder for group actions like Manage Group if needed */}
                       <Button variant="outline" className="w-full text-xs h-9 bg-transparent border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white">
                         View Details
                       </Button>
                    </CardFooter>
                  </Card>
                ))}
                {groups.length === 0 && (
                  <div className="col-span-full text-center py-10 text-text-muted font-black uppercase tracking-widest text-xs">
                    No groups registered.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div>
             {sessionsLoading ? (
                <div className="text-center text-text-muted font-bold uppercase py-10">Loading Sessions...</div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.map((s) => (
                    <Card key={s._id || s.id} className="flex flex-col h-full hover:border-brand-accent transition-colors shadow-sm">
                      <CardHeader className="flex flex-col space-y-1.5 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="w-10 h-10 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                            <BookOpen size={20} />
                          </div>
                          <div className="text-[10px] font-semibold text-brand-accent bg-brand-primary border border-brand-border px-2 py-1 rounded">
                            {s.status || 'SCHEDULED'}
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold">
                          {s.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-xs text-text-muted mt-2">
                           <Calendar size={12} />
                           <span>{s.date ? new Date(s.date).toLocaleDateString() : 'TBD'}</span>
                           <Clock size={12} className="ml-2" />
                           <span>{s.startTime || '--:--'}</span>
                        </div>
                      </CardHeader>
                      <CardFooter className="mt-auto pt-4 flex gap-2">
                         <Button 
                           variant="outline" 
                           onClick={() => navigate(`/dashboard/${role}/divisions/${divisionId}/bootcamps/${bootcampId}/sessions/${s._id || s.id}`)}
                           className="w-full text-xs h-9 bg-transparent border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white"
                         >
                           Enter Session Hub
                         </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  {sessions.length === 0 && (
                    <div className="col-span-full text-center py-10 text-text-muted font-black uppercase tracking-widest text-xs">
                      No sessions scheduled.
                    </div>
                  )}
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
