import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchBootcamp } from '../../store/bootcampSlice';
import { fetchBootcampSessions } from '../../store/sessionSlice';
import { fetchSessionAttendance } from '../../store/attendanceSlice';
import { fetchBootcampTasks } from '../../store/taskSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '../../components/ui/Table';
import { 
  CheckSquare, 
  Users, 
  FileText, 
  FolderOpen, 
  MessageSquare,
  Clock,
  MapPin,
  Calendar,
  Plus,
  Download,
  Star,
  Send,
  ExternalLink,
  Trash2,
  Edit2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { attendanceService, feedbackService, resourceService, submissionService, taskService } from '../../services/all_others.service';
import { sessionService } from '../../services/all_others.service';
import { toast } from 'sonner';

export const SessionDetailPage = () => {
  const { divisionId, bootcampId, sessionId } = useParams<{ divisionId: string; bootcampId: string; sessionId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentBootcamp } = useSelector((state: RootState) => state.bootcamps);
  const { items: sessions = [] } = useSelector((state: RootState) => state.sessions);
  const { users = [] } = useSelector((state: RootState) => state.users);
  const { records: attendanceRecords = [] } = useSelector((state: RootState) => state.attendance);
  const { tasks = [] } = useSelector((state: RootState) => state.tasks);
  const { user, activeRole } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<'attendance' | 'tasks' | 'submissions' | 'resources' | 'feedback'>('attendance');
  const [session, setSession] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskSubmissions, setTaskSubmissions] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  const sessionChartData = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);
    sessions.forEach(s => {
      if (s.startTime) {
        const day = new Date(s.startTime).getDay();
        counts[day]++;
      }
    });
    return days.map((day, i) => ({ name: day, sessions: counts[i] }));
  }, [sessions]);

  // Form states
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', maxScore: 100 });
  const [submitForm, setSubmitForm] = useState({ content: '', file: null as File | null });
  const [gradeForm, setGradeForm] = useState({ score: 0, feedback: '', submissionId: '' });
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', type: 'document', url: '', file: null as File | null });
  const [editSessionForm, setEditSessionForm] = useState({ title: '', startTime: '', duration: 60, location: '', onlineLink: '', status: '', description: '', instructor: '' });

  const isManagementRole = activeRole === 'admin' || activeRole === 'super admin' || activeRole === 'instructor';
  const isAdmin = activeRole === 'admin' || activeRole === 'super admin';
  const isStudent = activeRole === 'student';

  useEffect(() => {
    if (bootcampId) dispatch(fetchBootcamp(bootcampId));
    if (sessionId) {
      dispatch(fetchSessionAttendance(sessionId));
      sessionService.getSessions().then(res => {
         const found = res.data.find((s: any) => s._id === sessionId);
         setSession(found);
      });
    }
    if (bootcampId) {
      dispatch(fetchBootcampTasks(bootcampId));
      dispatch(fetchBootcampSessions(bootcampId));
      resourceService.getResources(bootcampId).then(res => {
        // Filter resources by this session or bootcamp-wide (no sessionId)
        const all = res.data || [];
        setResources(all.filter((r: any) => !r.sessionId || String(r.sessionId) === sessionId));
      });
    }
    if (sessionId) {
      feedbackService.getSessionFeedback(sessionId).then((res: any) => {
        setFeedbackList(res.data || []);
      }).catch(() => {});
    }
    if (isStudent) {
      submissionService.getMySubmissions().then(res => {
        setMySubmissions(Array.isArray(res) ? res : (res as any).data || []);
      }).catch(console.error);
    }
    if (isManagementRole) {
      import('../../store/userSlice').then(({ fetchUsers }) => {
        dispatch(fetchUsers({}));
      });
    }
  }, [dispatch, bootcampId, sessionId, isManagementRole, isStudent]);

  useEffect(() => {
    if (selectedTask && isManagementRole) {
      submissionService.getTaskSubmissions(selectedTask._id).then(res => {
        setTaskSubmissions(res.data);
      });
    }
  }, [selectedTask, isManagementRole]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskService.createTask({ ...taskForm, sessionId, bootcampId });
      toast.success('Task created successfully');
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', description: '', dueDate: '', maxScore: 100 });
      dispatch(fetchBootcampTasks(bootcampId!));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create task';
      toast.error(msg);
    }
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', submitForm.content);
      formData.append('taskId', selectedTask._id);
      if (user?._id) formData.append('studentId', user._id);
      if (submitForm.file) formData.append('file', submitForm.file);

      await submissionService.submitTask(formData);
      toast.success('Task submitted successfully');
      setIsSubmitModalOpen(false);
      setSubmitForm({ content: '', file: null });
    } catch (err) {
      toast.error('Failed to submit task');
    }
  };

  const handleEditSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    try {
      const res = await sessionService.updateSession(sessionId, editSessionForm);
      setSession(res.data);
      toast.success('Session updated successfully');
      setIsEditSessionModalOpen(false);
      dispatch(fetchBootcampSessions(bootcampId!));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update session');
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submissionService.gradeSubmission(gradeForm.submissionId, {
        score: gradeForm.score,
        feedback: gradeForm.feedback,
        gradedBy: user?._id
      });
      toast.success('Submission graded');
      setIsGradeModalOpen(false);
      // Refresh submissions
      const res = await submissionService.getTaskSubmissions(selectedTask._id);
      setTaskSubmissions(res.data);
    } catch (err) {
      toast.error('Failed to grade submission');
    }
  };

  const handleMarkAttendance = async (userId: string, status: 'present' | 'absent' | 'late') => {
    if (!session) return;
    
    // Rule: Editable within 24 hours
    const endTime = new Date(session.endTime || session.startTime).getTime();
    const now = Date.now();
    const hoursSinceEnd = (now - endTime) / (1000 * 60 * 60);

    if (hoursSinceEnd > 24) {
      toast.error('Attendance window closed. Records are only editable within 24 hours of session completion.');
      return;
    }

    try {
      await attendanceService.markAttendance({ userId, sessionId, bootcampId, status, markedBy: user?._id });
      toast.success('Attendance updated');
      dispatch(fetchSessionAttendance(sessionId!));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to mark attendance';
      toast.error(msg);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await feedbackService.submitFeedback({
        studentId: user?._id,
        bootcampId,
        sessionId,
        rating,
        comment,
        isAnonymous: true
      });
      toast.success('Feedback submitted! Thank you.');
      setIsFeedbackModalOpen(false);
      setComment('');
    } catch (err) {
      toast.error('Failed to submit feedback');
    }
  };

  const handleDeleteSession = async () => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await sessionService.deleteSession(sessionId!);
      toast.success('Session deleted successfully');
      navigate(`/dashboard/divisions/${divisionId}/bootcamps/${bootcampId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete session');
    }
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', resourceForm.title);
      formData.append('description', resourceForm.description);
      formData.append('type', resourceForm.type);
      if (resourceForm.url) formData.append('url', resourceForm.url);
      formData.append('bootcampId', bootcampId!);
      if (sessionId) formData.append('sessionId', sessionId);
      if (resourceForm.file) formData.append('file', resourceForm.file);
      
      await resourceService.uploadResource(formData);
      toast.success('Resource uploaded successfully');
      setIsResourceModalOpen(false);
      setResourceForm({ title: '', description: '', type: 'document', url: '', file: null });
      
      const res = await resourceService.getResources(bootcampId!);
      setResources(res.data);
    } catch (err) {
      toast.error('Failed to upload resource');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await resourceService.deleteResource(id);
      toast.success('Resource deleted');
      setResources(resources.filter(r => r._id !== id));
    } catch(err) {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <div className="space-y-8">
      {/* Session Header */}
      <header className="geo-card bg-white text-brand-sidebar p-8 overflow-hidden relative border-t-4 border-t-brand-accent">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Calendar size={200} strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <nav className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase text-text-muted hover:text-brand-accent cursor-pointer" onClick={() => navigate(`/dashboard/divisions/${divisionId}/bootcamps/${bootcampId}`)}>{currentBootcamp?.name}</span>
            <span className="text-[10px] font-black uppercase text-text-muted/20">/</span>
            <span className="text-[10px] font-black uppercase text-brand-accent">Session Details</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-black uppercase tracking-tight">{session?.title}</h1>
                <Badge variant={session?.status === 'completed' ? 'success' : 'secondary'}>{session?.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-text-muted">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-accent" />
                  <span>{session && format(new Date(session.startTime), 'EEEE, MMM d, p')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-secondary" />
                  <span>{session?.location || 'Digital Classroom'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-success" />
                  <span>Instructor: {session?.instructor?.name || 'TBA'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {isManagementRole && (
                <Button 
                  onClick={() => {
                    setEditSessionForm({
                      title: session?.title || '',
                      startTime: session?.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : '',
                      duration: session?.duration || 60,
                      location: session?.location || '',
                      onlineLink: session?.onlineLink || '',
                      status: session?.status || 'scheduled',
                      description: session?.description || '',
                      instructor: session?.instructor?._id || session?.instructor || ''
                    });
                    setIsEditSessionModalOpen(true);
                  }}
                  variant="outline" 
                  className="gap-2 border-brand-border text-brand-sidebar hover:bg-brand-primary"
                >
                  <Plus size={18} className="rotate-45" /> {/* Use plus as edit placeholder or import Edit2 */}
                  Edit Session
                </Button>
              )}
              {session?.onlineLink && (
                <Button onClick={() => window.open(session.onlineLink, '_blank')} className="gap-2 bg-brand-accent text-white hover:bg-brand-accent/90">
                  <ExternalLink size={18} />
                  Join Session
                </Button>
              )}
              {isManagementRole && (
                <Button 
                   variant="outline" 
                   className="gap-2 border-danger/20 text-danger hover:bg-danger/5"
                   onClick={handleDeleteSession}
                >
                   <Trash2 size={18} />
                   Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-brand-border scrollbar-hide">
        {[
          { id: 'attendance', label: 'Attendance', icon: Users },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare },
          { id: 'submissions', label: 'Submissions', icon: FileText },
          { id: 'resources', label: 'Resources', icon: FolderOpen },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 border-b-2 transition-all text-xs font-black uppercase tracking-widest whitespace-nowrap",
              activeTab === tab.id 
                ? "border-brand-accent text-brand-accent bg-brand-accent/5" 
                : "border-transparent text-text-muted hover:text-text-main hover:bg-brand-primary"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            {/* Student: read-only self-view */}
            {activeRole === 'student' && (() => {
              const myRecord = attendanceRecords.find((r: any) => 
                (r.userId?._id || r.userId) === user?._id
              );
              return myRecord ? (
                <div className="geo-card p-6 flex items-center gap-6">
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase text-text-muted tracking-widest mb-2">Your Attendance Status</p>
                    <Badge variant={myRecord.status === 'present' ? 'success' : myRecord.status === 'absent' ? 'destructive' : 'warning'} className="text-sm px-4 py-1">
                      {myRecord.status}
                    </Badge>
                  </div>
                  {myRecord.markedBy && (
                    <p className="text-xs text-text-muted font-medium">Marked by: {(myRecord.markedBy as any)?.name || myRecord.markedBy}</p>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-text-muted uppercase font-black text-xs">
                  No attendance record for you in this session yet.
                </div>
              );
            })()}

            {/* Admin/Instructor: Table View */}
            {isManagementRole && (
              <div className="space-y-6">
              <Card className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Marked By</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-12 text-text-muted font-medium text-xs uppercase tracking-widest">No attendance records found for this session.</TableCell></TableRow>
                    ) : attendanceRecords.map((record: any) => (
                      <TableRow key={record._id}>
                        <TableCell className="font-bold">{record.userId?.name}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === 'present' ? 'success' : record.status === 'absent' ? 'destructive' : 'warning'}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-text-muted text-xs font-medium">{record.markedBy?.name}</TableCell>
                        <TableCell className="text-right">
                          <select 
                            className="bg-brand-primary border-brand-border rounded-lg text-[10px] font-black uppercase p-1 outline-none focus:border-brand-accent"
                            onChange={(e) => handleMarkAttendance(record.userId._id, e.target.value as any)}
                            value={record.status}
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.filter(t => String(t.sessionId) === sessionId).map(task => (
              <Card key={task._id} className="flex flex-col group border-brand-border hover:border-brand-accent transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{task.maxScore} PTS</Badge>
                    <Clock size={16} className="text-text-muted" />
                  </div>
                  <CardTitle className="text-lg uppercase font-black">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-text-muted font-medium line-clamp-3 mb-6 flex-1">
                    {task.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-[10px] font-black uppercase text-text-muted">
                      Due: {format(new Date(task.dueDate), 'MMM d, p')}
                    </div>
                    {isStudent && (
                      <Button 
                        size="sm" 
                        className="font-black uppercase text-[10px]"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsSubmitModalOpen(true);
                        }}
                      >
                        Submit Task
                      </Button>
                    )}
                    {isManagementRole && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="font-black uppercase text-[10px]" 
                        onClick={() => {
                          setSelectedTask(task);
                          setActiveTab('submissions');
                        }}
                      >
                        Submissions
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {isManagementRole && (
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="geo-card border-dashed border-2 flex flex-col items-center justify-center p-8 text-text-muted hover:text-brand-accent hover:border-brand-accent transition-all group min-h-[200px]"
              >
                <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-black uppercase tracking-widest text-[10px]">Create Session Task</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
           <div className="space-y-6">
              {isStudent ? (
                <div className="grid gap-6">
                   {tasks.filter(t => String(t.sessionId) === sessionId).map(task => {
                     const mySub = mySubmissions.find(s => (s.taskId?._id || s.taskId) === task._id);
                     return (
                       <Card key={task._id} className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                             <div className="space-y-4">
                                <div>
                                   <h3 className="text-lg font-black uppercase tracking-tight">{task.title}</h3>
                                   <p className="text-xs text-text-muted font-medium uppercase tracking-widest">Submission Status</p>
                                </div>
                                {mySub ? (
                                  <div className="space-y-4">
                                     <div className="flex items-center gap-4">
                                        <Badge variant={mySub.status === 'graded' ? 'success' : 'secondary'} className="uppercase font-black px-4">
                                           {mySub.status}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-text-muted uppercase">Submitted: {format(new Date(mySub.createdAt), 'MMM d, h:mm a')}</span>
                                     </div>
                                     {mySub.status === 'graded' && (
                                       <div className="geo-card p-4 bg-brand-primary/30 border-l-4 border-l-success">
                                          <div className="flex justify-between items-start mb-2">
                                             <p className="text-[10px] font-black uppercase text-success tracking-widest">Instructor Feedback</p>
                                             <p className="text-xl font-black text-text-main">{mySub.score} <span className="text-xs text-text-muted">/ {task.maxScore}</span></p>
                                          </div>
                                          <p className="text-sm font-medium italic text-text-main">"{mySub.feedback || 'No written feedback provided.'}"</p>
                                       </div>
                                     )}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-4 text-text-muted">
                                     <AlertCircle size={18} />
                                     <span className="text-xs font-bold uppercase tracking-widest">Not Submitted Yet</span>
                                     <Button size="sm" variant="outline" onClick={() => { setSelectedTask(task); setIsSubmitModalOpen(true); }} className="text-[10px] font-black uppercase">Submit Now</Button>
                                  </div>
                                )}
                             </div>
                          </div>
                       </Card>
                     );
                   })}
                </div>
              ) : !selectedTask ? (
                <Card className="flex flex-col items-center justify-center p-24 text-center border-dashed">
                  <FileText size={48} className="text-text-muted mb-4 opacity-20" />
                  <h3 className="text-lg font-black uppercase tracking-tight text-text-main opacity-40">Submission Portal</h3>
                  <p className="text-sm text-text-muted max-w-sm mt-2 font-medium">Select a task from the Tasks tab to manage specific submissions.</p>
                </Card>
              ) : (
                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-brand-border pb-4">
                      <div>
                        <h2 className="text-xl font-black uppercase text-text-main">Submissions for: {selectedTask.title}</h2>
                        <p className="text-xs text-text-muted font-medium mt-1 uppercase tracking-widest">{taskSubmissions.length} Students submitted</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedTask(null)}>Back to Tasks</Button>
                   </div>

                   <div className="grid gap-4">
                      {taskSubmissions.length === 0 ? (
                        <div className="py-12 text-center text-text-muted uppercase font-black text-xs">No one has submitted yet.</div>
                      ) : taskSubmissions.map(sub => (
                        <Card key={sub._id} className="p-4 border-brand-border hover:shadow-md transition-all">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center font-black text-brand-accent">
                                {sub.studentId?.name?.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-black uppercase tracking-tight text-text-main">{sub.studentId?.name}</h4>
                                <p className="text-[10px] font-medium text-text-muted uppercase">Submitted: {format(new Date(sub.submittedAt), 'MMM d, h:mm a')}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                               {sub.status === 'graded' ? (
                                 <div className="text-right">
                                    <p className="text-lg font-black text-success">{sub.score} / {selectedTask.maxScore}</p>
                                    <p className="text-[10px] font-black uppercase text-text-muted">Graded result</p>
                                 </div>
                               ) : (
                                 <Badge variant="secondary">Pending Review</Badge>
                               )}
                               <Button variant="ghost" className="h-10 text-brand-accent font-black uppercase text-[10px]" onClick={() => {
                                 setGradeForm({ 
                                    submissionId: sub._id, 
                                    score: sub.score || 0, 
                                    feedback: sub.feedback || '' 
                                 });
                                 setIsGradeModalOpen(true);
                               }}>
                                 {sub.status === 'graded' ? 'Re-grade' : 'Grade Now'}
                               </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                   </div>
                </div>
              )}
           </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center pb-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-text-muted">Shared Learning Materials</h2>
                {isManagementRole && <Button onClick={() => setIsResourceModalOpen(true)} size="sm" variant="outline" className="text-[10px] font-black uppercase"><Plus size={14} className="mr-2" /> Upload</Button>}
             </div>
             <div className="grid gap-4">
                {resources.length === 0 ? (
                  <div className="py-12 text-center text-text-muted uppercase font-black text-xs">No resources available.</div>
                ) : resources.map(resource => (
                  <div key={resource._id} className="geo-card p-4 flex items-center justify-between group hover:border-brand-accent transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-text-muted group-hover:text-brand-accent group-hover:bg-brand-accent/5">
                        <FolderOpen size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-text-main">{resource.title}</h4>
                        <p className="text-[10px] font-medium text-text-muted uppercase">{resource.type} • Uploaded by {resource.createdBy?.name || 'Admin'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-text-muted hover:text-brand-accent hover:bg-brand-primary"
                        onClick={() => window.open(resource.fileUrl ? `http://localhost:5000${resource.fileUrl}` : resource.url, '_blank')}
                      >
                        <Download size={18} />
                      </Button>
                      {isManagementRole && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-text-muted hover:text-danger hover:bg-danger/10"
                          onClick={() => handleDeleteResource(resource._id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-widest text-text-muted">Student Feedback</h2>
              {isStudent && (
                <Button onClick={() => setIsFeedbackModalOpen(true)} className="gap-2 text-[10px] font-black uppercase">
                  <Send size={14} />
                  Give Feedback
                </Button>
              )}
            </div>

            {feedbackList.length === 0 ? (
              <div className="py-12 text-center text-text-muted uppercase font-black text-xs">No feedback yet for this session.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feedbackList.map((fb: any) => (
                  <Card key={fb._id}>
                    <CardHeader className="flex flex-row items-center justify-between p-6">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} className={cn(star <= fb.rating ? "text-warning fill-warning" : "text-text-muted")} />
                        ))}
                      </div>
                      <span className="text-[10px] font-black uppercase text-text-muted">
                        {fb.isAnonymous ? 'Anonymous Student' : fb.studentId?.name || 'Student'}
                      </span>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0">
                      <p className="text-sm text-text-main font-medium italic border-l-4 border-brand-accent/20 pl-4 py-2">
                        "{fb.comment}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Share Your Feedback"
        subtitle="Your input helps us improve future sessions"
        icon={MessageSquare}
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-6">
          <FormField label="Rating (1-5)">
            <div className="flex gap-4">
              {[1,2,3,4,5].map(s => (
                <button 
                  key={s} 
                  type="button"
                  onClick={() => setRating(s)}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    rating >= s ? "bg-warning/10 text-warning" : "bg-brand-primary text-text-muted"
                  )}
                >
                  <Star size={24} fill={rating >= s ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </FormField>
          <FormField label="Comments">
            <Textarea 
              placeholder="What did you like? What can we do better?" 
              className="h-32"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </FormField>
          <p className="text-[10px] font-black uppercase text-text-muted px-1">Note: All feedback is submitted anonymously by default.</p>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsFeedbackModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Submit Feedback</Button>
          </div>
        </form>
      </Modal>

      {/* Task Creation Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
        subtitle="Assign work for this session"
        icon={Plus}
      >
        <form onSubmit={handleCreateTask} className="space-y-6">
          <FormField label="Task Title">
            <Input 
              placeholder="Implementing Redux Logic" 
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required
            />
          </FormField>
          <FormField label="Instructions">
            <Textarea 
              placeholder="Provide detailed instructions for the students..." 
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Due Date">
              <Input 
                type="datetime-local" 
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Max Score">
              <Input 
                type="number" 
                value={taskForm.maxScore}
                onChange={(e) => setTaskForm({ ...taskForm, maxScore: parseInt(e.target.value) })}
                required
              />
            </FormField>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Create Task</Button>
          </div>
        </form>
      </Modal>

      {/* Task Submission Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Task"
        subtitle={selectedTask?.title}
        icon={Send}
      >
        <form onSubmit={handleSubmitTask} className="space-y-6">
          <FormField label="Submission Content">
            <Textarea 
              placeholder="Paste your solution or link to repository..." 
              className="h-32"
              value={submitForm.content}
              onChange={(e) => setSubmitForm({ ...submitForm, content: e.target.value })}
              required
            />
          </FormField>
          <FormField label="Attachment (File)">
            <Input 
              type="file" 
              onChange={(e) => setSubmitForm({ ...submitForm, file: e.target.files?.[0] || null })}
            />
          </FormField>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Submit Work</Button>
          </div>
        </form>
      </Modal>

      {/* Grading Modal */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title="Grade Submission"
        subtitle="Review and provide feedback"
        icon={Star}
      >
        <form onSubmit={handleGradeSubmission} className="space-y-6">
          <FormField label={`Score (Max: ${selectedTask?.maxScore || 100})`}>
            <Input 
              type="number" 
              max={selectedTask?.maxScore}
              value={gradeForm.score}
              onChange={(e) => setGradeForm({ ...gradeForm, score: parseInt(e.target.value) })}
              required
            />
          </FormField>
          <FormField label="Feedback">
            <Textarea 
              placeholder="What did the student do well? What can be improved?" 
              className="h-32"
              value={gradeForm.feedback}
              onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
            />
          </FormField>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsGradeModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Submit Grade</Button>
          </div>
        </form>
      </Modal>

      {/* Resource Upload Modal */}
      <Modal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        title="Upload Resource"
        subtitle="Share materials with students"
        icon={FolderOpen}
      >
        <form onSubmit={handleUploadResource} className="space-y-6">
          <FormField label="Title">
            <Input 
              placeholder="e.g. Week 2 Lecture Slides" 
              value={resourceForm.title}
              onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
              required
            />
          </FormField>
          <FormField label="Type">
            <select 
              className="w-full bg-brand-primary border border-brand-border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none"
              value={resourceForm.type}
              onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
            >
              <option value="document">Document (File)</option>
              <option value="link">External Link</option>
              <option value="other">Other</option>
            </select>
          </FormField>
          {resourceForm.type === 'document' ? (
             <FormField label="File">
               <Input 
                 type="file" 
                 onChange={(e) => setResourceForm({ ...resourceForm, file: e.target.files?.[0] || null })}
                 required
               />
             </FormField>
          ) : (
             <FormField label="URL">
               <Input 
                 placeholder="https://..." 
                 value={resourceForm.url}
                 onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                 required
               />
             </FormField>
          )}
          <FormField label="Description">
            <Textarea 
              placeholder="Optional description..." 
              value={resourceForm.description}
              onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
            />
          </FormField>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsResourceModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Upload</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        isOpen={isEditSessionModalOpen}
        onClose={() => setIsEditSessionModalOpen(false)}
        title="Edit Session"
        subtitle="Update session details"
        icon={Edit2}
      >
        <div className="space-y-4">
          <FormField label="Title">
            <Input value={editSessionForm.title} onChange={(e) => setEditSessionForm({ ...editSessionForm, title: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Time">
              <Input type="datetime-local" value={editSessionForm.startTime} onChange={(e) => setEditSessionForm({ ...editSessionForm, startTime: e.target.value })} />
            </FormField>
            <FormField label="Duration (min)">
              <Input type="number" value={editSessionForm.duration} onChange={(e) => setEditSessionForm({ ...editSessionForm, duration: parseInt(e.target.value) })} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Location">
              <Input value={editSessionForm.location} onChange={(e) => setEditSessionForm({ ...editSessionForm, location: e.target.value })} />
            </FormField>
            <FormField label="Online Link">
              <Input value={editSessionForm.onlineLink} onChange={(e) => setEditSessionForm({ ...editSessionForm, onlineLink: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Status">
            <select 
              className="w-full h-12 rounded-xl border border-brand-border bg-brand-primary/50 px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
              value={editSessionForm.status}
              onChange={(e) => setEditSessionForm({ ...editSessionForm, status: e.target.value })}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </FormField>
          <FormField label="Instructor">
            <select 
              className="w-full h-12 rounded-xl border border-brand-border bg-brand-primary/50 px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
              value={editSessionForm.instructor}
              onChange={(e) => setEditSessionForm({ ...editSessionForm, instructor: e.target.value })}
            >
              <option value="">-- Select Instructor --</option>
              {users.filter((u: any) => u.role.includes('instructor')).map((u: any) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </FormField>
          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditSessionModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleEditSession}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
