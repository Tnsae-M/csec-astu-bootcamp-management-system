import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { useLocation } from 'react-router-dom';
import { FileUp, Link as LinkIcon, Send, CheckCircle2, ChevronRight, File } from 'lucide-react';
import { Button } from '../../components/ui';
import { cn } from '../../lib/utils';
import { tasksService } from '../../services/tasks.service';
import { submissionsService } from '../../services/submissions.service';
import { 
  fetchMySubmissions, 
  fetchTasksByBootcamp, 
  submitTask 
} from '../../features/tasks/taskSlice';
import { toast } from 'sonner';

interface SubmissionFormPageProps {
  bootcampId?: string;
  sessionId?: string;
}

export default function SubmissionFormPage({ bootcampId, sessionId }: SubmissionFormPageProps) {

  const dispatch = useDispatch() as any;
  const { submissions } = useSelector((state: RootState) => state.tasks);


  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const [submissionType, setSubmissionType] = useState<'link' | 'text' | 'file' | 'both'>('link');
  const [linkValue, setLinkValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [fileValue, setFileValue] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileValue(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingTasks(true);
      try {
        // Get parameters from URL as fallback
        const urlParams = new URLSearchParams(location.search);
        const urlTaskId = urlParams.get('taskId');
        const urlBootcampId = urlParams.get('bootcampId') || bootcampId;
        const urlSessionId = urlParams.get('sessionId') || sessionId;
        
        if (urlBootcampId) {
          const result = await dispatch(fetchTasksByBootcamp(urlBootcampId));
          if (fetchTasksByBootcamp.fulfilled.match(result)) {
              const list = result.payload || [];
              const filtered = urlSessionId ? list.filter((t: any) => (t.sessionId?._id || t.sessionId) === urlSessionId) : list;
              setTasks(filtered);
              
              // Auto-select the task if taskId is in URL
              if (urlTaskId && filtered.some((t: any) => (t._id || t.id) === urlTaskId)) {
                setSelectedTask(urlTaskId);
              }
          }
        }
        dispatch(fetchMySubmissions());
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchInitialData();
  }, [bootcampId, sessionId, dispatch, location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return toast.error('Please choose a task.');

    try {
      setSubmitting(true);
      let submissionData: any;

      if (submissionType === 'file') {
        if (!fileValue) return toast.error('Please select a file to upload.');
        const form = new FormData();
        form.append('taskId', selectedTask);
        form.append('type', 'file');
        form.append('file', fileValue);
        if (sessionId) form.append('sessionId', sessionId);
        submissionData = form;
      } else if (submissionType === 'link') {
        if (!linkValue) return toast.error('Please enter a link.');
        submissionData = { taskId: selectedTask, type: 'link', link: linkValue, sessionId };
      } else if (submissionType === 'text') {
        if (!textValue) return toast.error('Please enter your text submission.');
        submissionData = { taskId: selectedTask, type: 'text', text: textValue, sessionId };
      } else if (submissionType === 'both') {
        if (!linkValue) return toast.error('Please enter a link for the submission.');
        const form = new FormData();
        form.append('taskId', selectedTask);
        form.append('type', 'both');
        form.append('link', linkValue);
        if (fileValue) form.append('file', fileValue);
        if (sessionId) form.append('sessionId', sessionId);
        submissionData = form;
      }

      const result = await dispatch(submitTask(submissionData));
      if (submitTask.fulfilled.match(result)) {
          setIsSubmitted(true);
          toast.success('Work submitted successfully');
      } else {
          toast.error((result.payload as string) || 'Submission failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };


  const resetForm = () => {
    setIsSubmitted(false);
    setSelectedTask(null);
    setLinkValue('');
    setTextValue('');
    setFileValue(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  if (isSubmitted) {
    return (
      <div className="h-[80vh] flex items-center justify-center selection:bg-brand-accent selection:text-white">
        <div className="geo-card p-12 text-center max-w-lg space-y-8 relative overflow-hidden">
           <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={48} />
           </div>
           <div className="space-y-4">
             <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter">Receipt Confirmed</h2>
             <p className="text-text-muted font-medium text-sm leading-relaxed uppercase tracking-widest">
               Your submission was received. Faculty review pending.
             </p>
           </div>
           <Button onClick={resetForm} variant="secondary" className="px-10 bg-brand-primary border border-brand-border text-brand-accent font-black uppercase tracking-widest text-[11px] hover:bg-brand-accent hover:text-white transition-colors">
             Submit Another Artefact
           </Button>
           
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  // Filter tasks to only show those without a successful/approved submission
  const pendingTasks = tasks.filter(t => !submissions.some(sub => sub.taskId === (t._id || t.id) && sub.status !== 'RETURNED'));

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
                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-2">
                  {loadingTasks ? (
                    <div className="text-sm text-text-muted uppercase">Loading tasks...</div>
                  ) : pendingTasks.length === 0 ? (
                    <div className="text-center py-10 text-[10px] bg-brand-primary/50 rounded-xl border border-brand-border border-dashed font-black uppercase tracking-widest text-text-muted">
                      No pending tasks available for submission.
                    </div>
                  ) : (
                    pendingTasks.map((task) => (
                      <div 
                        key={task._id || task.id}
                        onClick={() => setSelectedTask(task._id || task.id)}
                        className={cn(
                          "p-5 rounded-2xl border transition-all cursor-pointer group flex justify-between items-center",
                          (selectedTask === (task._id || task.id)) 
                            ? "bg-brand-accent/[0.05] border-brand-accent shadow-sm" 
                            : "bg-white border-brand-border hover:border-brand-accent/30"
                        )}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                            selectedTask === (task._id || task.id) ? "bg-brand-accent text-white" : "bg-white border border-brand-border text-brand-accent group-hover:bg-brand-accent group-hover:text-white group-hover:border-transparent"
                          )}>
                            <File size={20} />
                          </div>
                          <div>
                            <div className={cn("text-sm font-black uppercase tracking-tight", selectedTask === (task._id || task.id) ? "text-brand-accent" : "text-text-main group-hover:text-brand-accent")}>{task.title}</div>
                            <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">Due: {task.dueDate || task.deadline ? new Date(task.dueDate || task.deadline).toLocaleDateString() : 'TBD'}</div>
                          </div>
                        </div>
                        <ChevronRight size={16} className={cn("transition-all", selectedTask === (task._id || task.id) ? "text-brand-accent opacity-100" : "text-brand-border opacity-0 group-hover:opacity-100")} />
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-brand-border space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Submission Format</label>
                <div className="flex space-x-3">
                  <Button type="button" variant={submissionType === 'link' ? 'default' : 'outline'} onClick={() => setSubmissionType('link')}>Link</Button>
                  <Button type="button" variant={submissionType === 'text' ? 'default' : 'outline'} onClick={() => setSubmissionType('text')}>Text</Button>
                  <Button type="button" variant={submissionType === 'file' ? 'default' : 'outline'} onClick={() => setSubmissionType('file')}>PDF</Button>
                  <Button type="button" variant={submissionType === 'both' ? 'default' : 'outline'} onClick={() => setSubmissionType('both')}>Both</Button>
                </div>

                {submissionType === 'link' && (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Repository / Resource Link</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                        <LinkIcon size={14} />
                      </div>
                      <input
                        required
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        type="url"
                        placeholder="https://github.com/..."
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all font-medium"
                      />
                    </div>
                  </div>
                )}

                {submissionType === 'text' && (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Text Submission</label>
                    <textarea value={textValue} onChange={(e) => setTextValue(e.target.value)} rows={6} className="w-full p-4 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:outline-none" />
                  </div>
                )}

                {submissionType === 'file' && (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Upload PDF</label>
                    <div className="relative group">
                      <input ref={fileRef} accept="application/pdf" onChange={handleFileSelect} type="file" className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="w-full flex items-center justify-center p-4 py-4 rounded-xl border-2 border-dashed border-brand-border bg-brand-primary/20 hover:bg-brand-accent/5 hover:border-brand-accent/40 cursor-pointer transition-all">
                        <FileUp size={16} className="mr-2 text-brand-accent" />
                        <span className="text-xs font-black uppercase tracking-widest text-text-muted group-hover:text-brand-accent">{fileValue ? fileValue.name : 'Select PDF Artifact'}</span>
                      </label>
                    </div>
                  </div>
                )}
                {submissionType === 'both' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Repository / Resource Link</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                          <LinkIcon size={14} />
                        </div>
                        <input
                          required
                          value={linkValue}
                          onChange={(e) => setLinkValue(e.target.value)}
                          type="url"
                          placeholder="https://github.com/..."
                          className="w-full pl-10 pr-4 py-4 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Upload PDF (optional)</label>
                      <div className="relative group">
                        <input ref={fileRef} accept="application/pdf" onChange={handleFileSelect} type="file" className="hidden" id="file-upload-both" />
                        <label htmlFor="file-upload-both" className="w-full flex items-center justify-center p-4 py-4 rounded-xl border-2 border-dashed border-brand-border bg-brand-primary/20 hover:bg-brand-accent/5 hover:border-brand-accent/40 cursor-pointer transition-all">
                          <FileUp size={16} className="mr-2 text-brand-accent" />
                          <span className="text-xs font-black uppercase tracking-widest text-text-muted group-hover:text-brand-accent">{fileValue ? fileValue.name : 'Select Optional PDF Artifact'}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8">
                <Button type="submit" disabled={!selectedTask || submitting} className="w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-brand-accent/20">
                  <Send size={16} className="mr-3" /> {submitting ? 'Submitting…' : 'Execute Submission'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="geo-card p-8">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6">Recent Activity</h3>
             <div className="space-y-6">
                {submissions.slice(0, 4).map((sub: any) => {
                  const tData = tasks.find(t => (t._id || t.id) === sub.taskId);
                  return (
                  <div key={sub._id || sub.id} className="flex justify-between items-center opacity-80">
                     <div>
                        <div className="text-[11px] font-black uppercase tracking-tight text-text-main truncate max-w-[150px]">{tData?.title || 'Unknown Task'}</div>
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">{new Date(sub.createdAt || new Date()).toLocaleDateString()}</div>
                        {sub.feedback && (
                           <div className="text-[8px] text-text-muted italic mt-1 truncate max-w-[150px]">{sub.feedback}</div>
                        )}
                     </div>
                     <div className="text-right">
                        {sub.score !== null && sub.score !== undefined && (
                           <div className="text-[10px] font-black text-brand-accent mb-1">
                              {sub.score}/{tData?.maxScore || 100}
                           </div>
                        )}
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shadow-sm",
                          sub.status === 'GRADED' ? "bg-green-50 border-green-100 text-green-600" : 
                          sub.status === 'RETURNED' ? "bg-red-50 border-red-100 text-red-600" :
                          "bg-yellow-50 border-yellow-100 text-yellow-600"
                        )}>{sub.status || 'PENDING'}</span>
                     </div>
                  </div>
                )})}
                {submissions.length === 0 && (
                   <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">No activity found.</div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
