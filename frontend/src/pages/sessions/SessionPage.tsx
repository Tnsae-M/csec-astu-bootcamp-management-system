import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import { Calendar, Filter, Plus, Edit, Trash2, BookOpen, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { sessionsService } from '../../services/sessions.service';
import { bootcampsService } from '../../services/bootcamps.service';
import { usersService } from '../../services/users.service';
import { fetchSessions, createSessionAsync, updateSessionAsync } from '../../features/sessions/sessionSlice';
import { Button, Modal, Card, CardHeader, CardTitle, CardFooter } from '../../components/ui';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import { toast } from 'sonner';

export default function SessionPage() {

  const dispatch = useDispatch() as any;
  const navigate = useNavigate();
  const { items: sessions, loading } = useSelector((state: RootState) => state.sessions);
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const userRoles = (user?.roles || (user?.role ? [user.role] : [])).map(r => r.toUpperCase());
  const isStudent = userRoles.includes('STUDENT');
  const isAdminOrInstructor = userRoles.some(r => ['ADMIN', 'INSTRUCTOR'].includes(r));

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bootcamp: '',
    instructor: '',
    date: '',
    startTime: '10:00',
    durationH: 2,
    location: '',
    status: 'UPCOMING'
  });

  const fetchSessionsList = () => {
    dispatch(fetchSessions());
  };

  useEffect(() => {
    fetchSessionsList();
    bootcampsService.getBootcamps().then(res => setBootcamps(res.data || []));
    usersService.getUsers().then(res => {
      const allInts = (res.data || []).filter((u: any) => {
       const uRoles = (u.roles || [u.role]).map((r: string) => r.toUpperCase()); 
       return uRoles.includes('INSTRUCTOR') || uRoles.includes('ADMIN');
      });
      setInstructors(allInts);
    });
  }, [dispatch]);

  const filteredInstructors = instructors.filter((inst: any) => {
    if (!formData.bootcamp) return true;
    const instBootcamps = (inst.bootcamps || []).map((bc: any) => bc.bootcampId?._id || bc.bootcampId || bc);
    return instBootcamps.includes(formData.bootcamp);
  });

  useEffect(() => {
    if (formData.bootcamp && formData.instructor) {
      const isStillValid = filteredInstructors.some(i => i._id === formData.instructor);
      if (!isStillValid && filteredInstructors.length > 0) {
        // Only reset if we are creating, or if it's clearly invalid
        // Actually, better to just let the user change it if they want.
        // But for "un assign" cases, we should probably reset.
      }
    }
  }, [formData.bootcamp, instructors]);

  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const filteredSessions = safeSessions.filter((s: any) => {
    const title = (s?.title || '').toString().toLowerCase();
    const term = (searchTerm || '').toString().toLowerCase();
    const bcTitle = typeof s?.bootcamp === 'object' ? (s.bootcamp?.name || '').toString().toLowerCase() : '';
    return title.includes(term) || bcTitle.includes(term);
  });

  const isInstructorOnly = userRoles.includes('INSTRUCTOR') && !userRoles.includes('ADMIN') && !userRoles.includes('SUPER ADMIN');

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ 
      title: '', description: '', 
      bootcamp: bootcamps[0]?._id || '', 
      instructor: isInstructorOnly ? (user?._id || user?.id) : (instructors[0]?._id || ''), 
      date: new Date().toISOString().split('T')[0], 
      startTime: '10:00', durationH: 2, location: 'Virtual', status: 'UPCOMING' 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (session: any) => {
    setEditingId(session._id || session.id);
    const instId = typeof session.instructor === 'object' ? session.instructor._id : session.instructor;
    setFormData({ 
      title: session.title, 
      description: session.description || '', 
      bootcamp: typeof session.bootcamp === 'object' ? session.bootcamp._id : session.bootcamp,
      instructor: instId,
      date: session.date ? session.date.substring(0, 10) : '',
      startTime: session.startTime || '10:00', 
      durationH: session.durationH || 2, 
      location: session.location || '', 
      status: session.status || 'UPCOMING'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete session: ${title}?`)) {
      try {
         await sessionsService.deleteSession(id);
         toast.success('Session deleted');
         fetchSessionsList();
      } catch (err: any) {
         toast.error(err.response?.data?.message || err.message);
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (editingId) {
        result = await dispatch(updateSessionAsync({ id: editingId, data: formData }));
      } else {
        result = await dispatch(createSessionAsync(formData));
      }
      
      if (updateSessionAsync.fulfilled.match(result) || createSessionAsync.fulfilled.match(result)) {
          setIsModalOpen(false);
          toast.success('Schedule updated successfully');
      } else {
          toast.error((result.payload as string) || 'Operation failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    }
  };


  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
        <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Academic Sessions</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Manage and view bootcamp schedules</p>
        </div>
          {/* {isAdminOrInstructor && (
            <button 
              onClick={handleOpenCreate}
              className="bg-brand-accent text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/20"
            >
              <Plus size={16} className="mr-2" /> Add Session
            </button>
          )} */}
      </div>

      <div className="geo-card p-10 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10 relative z-10">
          {/* <div className="flex space-x-2">
            <Button variant="secondary" className="font-black uppercase tracking-widest flex items-center bg-brand-primary border border-brand-border text-brand-accent px-4 py-2 text-xs">
              <Filter size={12} className="mr-2" /> Filter Schedule
            </Button>
          </div> */}
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Live Curriculum Update</div>
        </div>

        {loading ? (
             <div className="text-center text-text-muted font-bold uppercase py-10">Loading Schedule...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {filteredSessions.map((session) => {
            const bcId = typeof session.bootcamp === 'object' ? session.bootcamp?._id : session.bootcamp;
            const bcName = typeof session.bootcamp === 'object' ? session.bootcamp?.name : (bootcamps.find(b => b._id === session.bootcamp)?.name || 'Unknown Bootcamp');
            const instName = typeof session.instructor === 'object' ? session.instructor?.name : (instructors.find(i => i._id === session.instructor)?.name || 'Unknown Instructor');
            
            let primaryRolePath = (activeRole || userRoles[0] || 'student').toLowerCase().replace(' ', '');
            if (primaryRolePath === 'superadmin') primaryRolePath = 'admin';

            return (
              <Card
                key={session._id || session.id}
                className="flex flex-col h-full hover:border-brand-accent transition-colors shadow-sm bg-brand-primary"
              >
                <CardHeader className="flex flex-col space-y-1.5 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdminOrInstructor && (
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenEdit(session)} className="text-text-muted hover:text-brand-accent p-1"><Edit size={14} /></button>
                          <button onClick={() => handleDelete(session._id, session.title)} className="text-text-muted hover:text-red-500 p-1"><Trash2 size={14} /></button>
                        </div>
                      )}
                      <div className={cn(
                        "text-[10px] font-semibold px-2 py-1 rounded border",
                        session.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                        session.status === 'ONGOING' ? 'bg-green-100 text-green-700 border-green-200' :
                        session.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-brand-primary text-text-muted border-brand-border'
                      )}>
                        {session.status || "SCHEDULED"}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold uppercase tracking-tight">
                    {session.title || "Untitled Session"}
                  </CardTitle>
                  <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">{bcName}</p>
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Inst: {instName}</p>
                  
                  <div className="flex items-center space-x-2 text-xs text-text-muted mt-2 font-bold uppercase tracking-tighter">
                    <Calendar size={12} />
                    <span>{session.date ? session.date.substring(0, 10) : "TBD"}</span>
                    <Clock size={12} className="ml-2" />
                    <span>{session.startTime || "--:--"} ({session.durationH}H)</span>
                  </div>
                </CardHeader>
                <CardFooter className="mt-auto pt-4 flex gap-2 border-t border-brand-border">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/dashboard/${primaryRolePath}/sessions/${session._id || session.id}${bcId ? `?bootcampId=${bcId}` : ''}`)}
                      className="w-full text-xs h-9 bg-transparent border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white font-black uppercase tracking-widest"
                    >
                      Details Hub
                    </Button>
                    {isStudent && (
                      <Button
                        size="sm"
                        onClick={() => { setSelectedSession(session); setFeedbackModalOpen(true); }}
                        className="w-full text-xs h-9 bg-brand-accent text-white hover:bg-brand-accent/90 font-black uppercase tracking-widest"
                      >
                        Give Feedback
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        )}

        <FeedbackForm
          open={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          sessionId={selectedSession?._id || selectedSession?.id}
          instructorId={typeof selectedSession?.instructor === 'object' ? selectedSession?.instructor?._id : selectedSession?.instructor}
          bootcampId={typeof selectedSession?.bootcamp === 'object' ? selectedSession?.bootcamp?._id : selectedSession?.bootcamp}
        />

        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Update Session Log" : "Schedule New Session"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Session Title</label>
            <input 
              required 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
              placeholder="e.g. Intro to MongoDB" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Parent Bootcamp</label>
              <select 
                required
                value={formData.bootcamp} 
                onChange={e => setFormData({...formData, bootcamp: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium uppercase outline-none focus:border-brand-accent transition-colors"
              >
                <option value="" disabled>Select Bootcamp</option>
                {bootcamps.map(b => (
                   <option key={b._id} value={b._id}>{b.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Assign Instructor</label>
              <select 
                required
                value={formData.instructor} 
                onChange={e => setFormData({...formData, instructor: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium uppercase outline-none focus:border-brand-accent transition-colors"
                disabled={isInstructorOnly}
              >
                <option value="" disabled>Select Lecturer</option>
                {filteredInstructors.map(i => (
                   <option key={i._id} value={i._id}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Date</label>
                <input 
                  required 
                  type="date" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
                />
             </div>
             <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Start Timing</label>
                <input 
                  required 
                  type="time" 
                  value={formData.startTime} 
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
                />
             </div>
             <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Length (Hours)</label>
                <input 
                  required 
                  type="number" 
                  step="0.5"
                  value={formData.durationH} 
                  onChange={e => setFormData({...formData, durationH: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Campus Location</label>
              <input 
                required 
                type="text" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
                placeholder="e.g. Block 508 Room 2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Event Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium uppercase outline-none focus:border-brand-accent transition-colors"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Live / Ongoing</option>
                <option value="COMPLETED">Finished</option>
                <option value="CANCELLED">Void / Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-brand-border flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl border border-brand-border text-text-muted text-[10px] font-black uppercase tracking-widest hover:text-text-main hover:bg-brand-primary/80 transition-colors"
            >
              Cancel Lock
            </button>
            <Button 
              type="submit"
              className="px-6 py-3 shadow-lg shadow-brand-accent/20 flex items-center"
            >
              {editingId ? "Sync Updates" : "Pin Schedule"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
