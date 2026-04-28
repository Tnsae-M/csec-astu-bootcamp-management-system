import React, { useState } from 'react';
import { Button, Modal } from '@/src/components/ui';
import { Calendar, Filter, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import FeedbackForm from '@/src/components/feedback/FeedbackForm';
import { sessionsService } from '../../services/sessions.service';

export default function SessionPage() {
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const [sessions, setSessions] = useState<any[]>([
    { id: 1, title: 'Introduction to Data Science', division: 'Data Science', date: '2026-04-20', time: '10:00 AM', status: 'UPCOMING', instructorId: 'instructor1', bootcampId: 'boot1' },
    { id: 2, title: 'React State Management', division: 'Full Stack', date: '2026-04-21', time: '02:00 PM', status: 'UPCOMING', instructorId: 'instructor2', bootcampId: 'boot2' },
    { id: 3, title: 'Network Security Basics', division: 'Cybersecurity', date: '2026-04-19', time: '09:00 AM', status: 'ONGOING', instructorId: 'instructor3', bootcampId: 'boot3' },
  ]);

  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionTime, setNewSessionTime] = useState('');

  const filteredSessions = sessions.filter((s) => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
        <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Academic Sessions</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Manage and view bootcamp schedules</p>
        </div>
          {user?.role === 'INSTRUCTOR' && (
            <>
              <Button onClick={() => setShowCreateModal(true)} className="font-black uppercase tracking-[0.2em] text-[11px] px-8 py-4 shadow-lg shadow-brand-accent/20 flex items-center gap-2">
                <Plus className="mr-2 h-4 w-4" /> Add Session
              </Button>

              <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Session" subtitle="Your name is auto-filled as the instructor">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setCreating(true);
                  try {
                    const payload: any = {
                      title: newSessionTitle || `Session ${Date.now()}`,
                      date: newSessionDate || new Date().toISOString().slice(0,10),
                      startTime: newSessionTime || '10:00',
                      instructor: user?.id || undefined,
                      instructorName: user?.name || undefined,
                      place: 'TBD',
                      duration: '1h',
                      bootcampId: 'general'
                    };
                    // try backend, fallback to local state
                    try {
                      const res = await sessionsService.createSession(payload);
                      const created = res.data ?? res;
                      setSessions(prev => [created, ...prev]);
                    } catch (err) {
                      const id = sessions.length ? Math.max(...sessions.map(s=>s.id)) + 1 : 1;
                      const created = { id, title: payload.title, division: 'General', date: payload.date, time: payload.startTime, status: 'UPCOMING', instructorId: payload.instructor, bootcampId: payload.bootcampId };
                      setSessions([created, ...sessions]);
                    }
                    setNewSessionTitle(''); setNewSessionDate(''); setNewSessionTime(''); setShowCreateModal(false);
                  } finally { setCreating(false); }
                }}>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-text-muted mb-2">Instructor</label>
                      <input value={user?.name || ''} readOnly className="w-full px-4 py-3 rounded-xl bg-brand-primary/20 border border-brand-border text-text-main text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-text-muted mb-2">Session Title</label>
                      <input value={newSessionTitle} onChange={(e)=>setNewSessionTitle(e.target.value)} placeholder="Session Title" className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="date" value={newSessionDate} onChange={(e)=>setNewSessionDate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border" />
                      <input type="time" value={newSessionTime} onChange={(e)=>setNewSessionTime(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
                  </div>
                </form>
              </Modal>
            </>
          )}
      </div>

      <div className="geo-card p-10 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" className="font-black uppercase tracking-widest flex items-center bg-brand-primary border border-brand-border text-brand-accent px-4">
              <Filter className="mr-2 h-3 w-3" /> Filter Schedule
            </Button>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Live Curriculum Update</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {filteredSessions.map((session) => (
            <div key={session.id} className="p-8 rounded-2xl bg-brand-primary border border-brand-border hover:border-brand-accent/30 transition-all group shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-white border border-brand-border text-brand-accent rounded-xl flex items-center justify-center shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-all">
                  <Calendar size={24} />
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm",
                  session.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                )}>
                  {session.status}
                </span>
              </div>
              <h3 className="text-xl font-black text-text-main mb-2 uppercase tracking-tight group-hover:text-brand-accent transition-colors">{session.title}</h3>
              <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-6">{session.division}</p>
              <div className="flex justify-between items-center pt-6 border-t border-brand-border">
                <div className="text-xs font-black text-text-muted uppercase tracking-tighter">
                  {session.date} <span className="mx-1 text-brand-border">|</span> {session.time}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="font-black text-[10px] px-6 uppercase tracking-widest border-brand-border text-text-muted hover:text-brand-accent hover:border-brand-accent transition-all">Details</Button>
                  {(user?.role === 'STUDENT' || user?.role === 'student') && (
                    <Button size="sm" onClick={() => { setSelectedSession(session); setModalOpen(true); }} className="font-black text-[10px] px-4 uppercase tracking-widest">Give Feedback</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <FeedbackForm
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          sessionId={selectedSession?.id}
          instructorId={selectedSession?.instructorId}
          bootcampId={selectedSession?.bootcampId}
        />

        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      </div>
    </div>
  );
}
