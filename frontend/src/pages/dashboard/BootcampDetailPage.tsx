import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchBootcamp } from '../../store/bootcampSlice';
import { fetchBootcampSessions } from '../../store/sessionSlice';
import { fetchUsers } from '../../store/userSlice';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { 
  Calendar, 
  Users2, 
  Target, 
  Plus, 
  ChevronRight, 
  Clock, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { createSession } from '../../store/sessionSlice';

export const BootcampDetailPage = () => {
  const { divisionId, bootcampId } = useParams<{ divisionId: string; bootcampId: string }>();
  const { currentBootcamp, loading: bootcampLoading } = useSelector((state: RootState) => state.bootcamps);
  const { items: sessions, loading: sessionsLoading } = useSelector((state: RootState) => state.sessions);
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const { users = [] } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'sessions' | 'groups' | 'projects'>('sessions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    duration: 60,
    location: '',
    onlineLink: '',
    status: 'scheduled',
    description: '',
    instructor: ''
  });

  useEffect(() => {
    if (bootcampId) {
      dispatch(fetchBootcamp(bootcampId));
      dispatch(fetchBootcampSessions(bootcampId));
    }
    dispatch(fetchUsers({}));
  }, [dispatch, bootcampId]);

  const isManagementRole = activeRole === 'admin' || activeRole === 'super admin' || activeRole === 'instructor';
  const isAdmin = activeRole === 'admin' || activeRole === 'super admin';

  const handleCreateSession = async () => {
    if (!bootcampId) return;
    if (formData.duration < 30) {
      toast.error('Session duration must be at least 30 minutes.');
      return;
    }
    try {
      const payload = {
        ...formData,
        bootcamp: bootcampId,
        date: formData.startTime.split('T')[0],
        startTime: formData.startTime.split('T')[1],
        durationH: formData.duration / 60
      };
      await dispatch(createSession(payload)).unwrap();
      toast.success('Session scheduled successfully');
      setIsModalOpen(false);
      setFormData({ title: '', startTime: '', duration: 60, location: '', onlineLink: '', status: 'scheduled', description: '', instructor: '' });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to create session';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase text-text-muted hover:text-brand-accent cursor-pointer" onClick={() => navigate('/dashboard/divisions')}>Divisions</span>
            <span className="text-[10px] font-black uppercase text-text-muted">/</span>
            <span className="text-[10px] font-black uppercase text-text-muted hover:text-brand-accent cursor-pointer" onClick={() => navigate(`/dashboard/divisions/${divisionId}/bootcamps`)}>Bootcamps</span>
            <span className="text-[10px] font-black uppercase text-text-muted">/</span>
            <span className="text-[10px] font-black uppercase text-brand-accent">{currentBootcamp?.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black uppercase tracking-tight text-text-main">
              {currentBootcamp?.name}
            </h1>
            <Badge variant={currentBootcamp?.status === 'active' ? 'success' : 'secondary'}>
              {currentBootcamp?.status}
            </Badge>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm text-text-muted font-medium">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-brand-accent" />
              <span>{currentBootcamp && format(new Date(currentBootcamp.startDate), 'MMM d, yyyy')} — {currentBootcamp && format(new Date(currentBootcamp.endDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users2 size={16} className="text-brand-secondary" />
              <span>{currentBootcamp?.instructors?.length || 0} Instructors</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-brand-border">
        {[
          { id: 'sessions', label: 'Sessions', icon: Calendar },
          { id: 'groups', label: 'Groups', icon: Users2 },
          { id: 'projects', label: 'Projects', icon: Target }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 border-b-2 transition-all text-xs font-black uppercase tracking-widest",
              activeTab === tab.id 
                ? "border-brand-accent text-brand-accent" 
                : "border-transparent text-text-muted hover:text-text-main"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight text-text-main">Curriculum Sessions</h2>
              {isManagementRole && (
                <Button 
                  size="sm" 
                  className="gap-2 font-black uppercase tracking-widest text-[10px]"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={16} />
                  Add Session
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-brand-border rounded-2xl bg-brand-primary/10">
                  <Calendar size={48} className="mx-auto text-text-muted/20 mb-4" />
                  <p className="text-text-muted font-black uppercase tracking-widest text-xs">No sessions scheduled for this program.</p>
                </div>
              ) : sessions.map((session) => (
                <Card 
                  key={session._id} 
                  className="group hover:border-brand-accent transition-all cursor-pointer overflow-hidden flex flex-col"
                  onClick={() => navigate(`/dashboard/divisions/${divisionId}/bootcamps/${bootcampId}/sessions/${session._id}`)}
                >
                  <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-primary group-hover:bg-brand-accent/5 transition-colors">
                    <Badge variant={session.status === 'completed' ? 'success' : session.status === 'cancelled' ? 'destructive' : 'secondary'}>
                      {session.status}
                    </Badge>
                    <Clock size={16} className="text-text-muted" />
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-black uppercase tracking-tight mb-4 group-hover:text-brand-accent transition-colors">{session.title}</h3>
                    <div className="space-y-3 text-xs font-medium text-text-muted mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-brand-accent" />
                        <span>{session.startTime ? format(new Date(session.startTime), 'EEEE, MMM d — p') : 'TBA'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={14} className="text-brand-secondary" />
                        <span>{session.location || 'Online Session'}</span>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full mt-auto justify-between group-hover:bg-brand-accent group-hover:text-white border border-brand-border h-12">
                      <span className="uppercase font-black tracking-widest text-[10px]">View Details</span>
                      <ChevronRight size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Schedule Session"
          subtitle="Add a new live or recorded session"
          icon={Calendar}
        >
          <div className="space-y-6">
            <FormField label="Session Title">
              <Input 
                placeholder="Software Engineering Ethics" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date & Time">
                <Input 
                  type="datetime-local" 
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </FormField>
              <FormField label="Duration (min)">
                <Input 
                  type="number" 
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Location">
                <Input 
                  placeholder="e.g. ASTU Lab II" 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </FormField>
              <FormField label="Online Link">
                <Input 
                  placeholder="https://zoom.us/..." 
                  value={formData.onlineLink}
                  onChange={(e) => setFormData({ ...formData, onlineLink: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="Status">
              <select 
                className="w-full h-12 rounded-xl border border-brand-border bg-brand-primary/50 px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </FormField>
            <FormField label="Instructor">
              <select 
                className="w-full h-12 rounded-xl border border-brand-border bg-brand-primary/50 px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              >
                <option value="">-- Select Instructor --</option>
                {users.filter((u: any) => u.role.includes('instructor')).map((u: any) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </FormField>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleCreateSession}>Schedule</Button>
            </div>
          </div>
        </Modal>

        {activeTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <Card className="flex flex-col items-center justify-center p-12 text-center bg-brand-primary/20 border-dashed border-2">
                <Users2 size={40} className="text-text-muted mb-4" />
                <h3 className="text-lg font-black uppercase tracking-tight text-text-main">No Groups Yet</h3>
                <p className="text-sm text-text-muted max-w-xs mt-2 font-medium">Bootcamp groups will appear here once created by instructors.</p>
                {isAdmin && <Button className="mt-6" variant="outline">Create Initial Group</Button>}
             </Card>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="flex flex-col items-center justify-center p-24 text-center bg-brand-primary/20 border-dashed border-2 rounded-2xl">
            <Target size={48} className="text-text-muted mb-4 opacity-20" />
            <h3 className="text-xl font-black uppercase tracking-tight text-text-main opacity-20">Capstone Projects</h3>
            <p className="text-sm text-text-muted max-w-xs mt-2 font-medium opacity-20">Project tracking will be enabled in the final phase of the bootcamp.</p>
          </div>
        )}
      </div>
    </div>
  );
};
