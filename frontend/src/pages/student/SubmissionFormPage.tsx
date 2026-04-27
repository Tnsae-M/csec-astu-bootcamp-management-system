import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { FileUp, Link as LinkIcon, Send, CheckCircle2, ChevronRight, File } from 'lucide-react';
import { Button } from '../../components/ui';
import { cn } from '../../lib/utils';
import { tasksService } from '@/src/services/tasks.service';
import { submissionsService } from '@/src/services/submissions.service';
import { setSubmissionsStart, setSubmissionsSuccess, setSubmissionsFailure } from '../../features/tasks/taskSlice';

export default function SubmissionFormPage() {
  const dispatch = useDispatch();
  const { submissions } = useSelector((state: RootState) => state.tasks);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    taskId: '',
    githubUrl: '',
    fileUrl: ''
  });

  useEffect(() => {
    // Fetch all available tasks 
    // Ideally this filters by bootcamp enrollment, but for now we fetch all tasks or tasks relevant to student
    tasksService.getTasks().then(res => {
      setTasks(res.data || []);
    });

    // Fetch student's past submissions
    fetchMySubmissions();
  }, []);

  const fetchMySubmissions = () => {
    dispatch(setSubmissionsStart());
    submissionsService.getStudentSubmissions()
      .then(res => dispatch(setSubmissionsSuccess(res.data || [])))
      .catch(err => dispatch(setSubmissionsFailure(err.message)));
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTask(taskId);
    setFormData(prev => ({ ...prev, taskId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.taskId || !formData.githubUrl) {
      alert("Please select a task and provide at least a Github URL.");
      return;
    }
    
    try {
      await submissionsService.submitTask(formData);
      setIsSubmitted(true);
      fetchMySubmissions();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSelectedTask('');
    setFormData({ taskId: '', githubUrl: '', fileUrl: '' });
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
               Your technical artifacts have been successfully uploaded to the central registry. Faculty review pending.
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
  const pendingTasks = tasks.filter(t => !submissions.some(sub => sub.taskId === t._id && sub.status !== 'RETURNED'));

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
                  {pendingTasks.map((task) => (
                    <div 
                      key={task._id}
                      onClick={() => handleSelectTask(task._id)}
                      className={cn(
                        "p-5 rounded-2xl border transition-all cursor-pointer group flex justify-between items-center",
                        selectedTask === task._id 
                          ? "bg-brand-accent/[0.05] border-brand-accent shadow-sm" 
                          : "bg-brand-primary/50 border-brand-border hover:border-brand-accent/30"
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                          selectedTask === task._id ? "bg-brand-accent text-white" : "bg-white border border-brand-border text-brand-accent group-hover:bg-brand-accent group-hover:text-white group-hover:border-transparent"
                        )}>
                          <File size={18} />
                        </div>
                        <div>
                          <div className={cn("text-sm font-black uppercase tracking-tighter", selectedTask === task._id ? "text-brand-accent" : "text-text-main group-hover:text-brand-accent")}>{task.title}</div>
                          <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <ChevronRight size={16} className={cn("transition-all", selectedTask === task._id ? "text-brand-accent opacity-100" : "text-brand-border opacity-0 group-hover:opacity-100")} />
                    </div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <div className="text-center py-10 text-[10px] bg-brand-primary/50 rounded-xl border border-brand-border border-dashed font-black uppercase tracking-widest text-text-muted">
                      No pending tasks available for submission.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-brand-border">
                <div className="space-y-4">
                   <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Technical Repository Link</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                        <LinkIcon size={14} />
                      </div>
                      <input 
                        required
                        type="url"
                        value={formData.githubUrl}
                        onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                        placeholder="https://github.com/..."
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all font-medium"
                      />
                   </div>
                </div>
                <div className="space-y-4">
                   <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Documentation / Hosted URL <span className="lowercase normal-case opacity-50">(Optional)</span></label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                        <LinkIcon size={14} />
                      </div>
                      <input 
                        type="url"
                        value={formData.fileUrl}
                        onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                        placeholder="https://app.vercel.com/..."
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all font-medium"
                      />
                   </div>
                </div>
              </div>

              <div className="pt-8">
                <Button disabled={!selectedTask || !formData.githubUrl} type="submit" className="w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-brand-accent/20">
                  <Send size={16} className="mr-3" /> Execute Submission
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="geo-card p-8 bg-brand-accent text-white shadow-xl shadow-brand-accent/20 relative overflow-hidden group">
            <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Integrity Protocol</h3>
            <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-80 mb-6">
              All submissions are automatically scanned for plagiarism and structural validity. Ensure your repository is active.
            </p>
            <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest">
               <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-white/50" /> Clean Code Principles</li>
               <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-white/50" /> Modular Architecture</li>
               <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-white/50" /> Working Build Link</li>
            </ul>
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-125 transition-all duration-700 pointer-events-none">
               <FileUp size={160} />
            </div>
          </div>
          
          <div className="geo-card p-8">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6">Recent Activity</h3>
             <div className="space-y-6">
                {submissions.slice(0, 4).map((sub: any) => {
                  const tData = tasks.find(t => t._id === sub.taskId);
                  return (
                  <div key={sub._id} className="flex justify-between items-center opacity-80">
                     <div>
                        <div className="text-[11px] font-black uppercase tracking-tight text-text-main truncate max-w-[150px]">{tData?.title || 'Unknown Task'}</div>
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">{new Date(sub.createdAt).toLocaleDateString()}</div>
                     </div>
                     <span className={cn(
                       "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shadow-sm",
                       sub.status === 'GRADED' ? "bg-green-50 border-green-100 text-green-600" : 
                       sub.status === 'RETURNED' ? "bg-red-50 border-red-100 text-red-600" :
                       "bg-yellow-50 border-yellow-100 text-yellow-600"
                     )}>{sub.status}</span>
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
