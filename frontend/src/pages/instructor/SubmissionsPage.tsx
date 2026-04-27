import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { FileText, CheckCircle2, AlertCircle, Filter, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button, Modal, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui';
import { tasksService } from '../../services/tasks.service';
import { submissionsService } from '../../services/submissions.service';

interface SubmissionsPageProps {
  sessionId?: string;
  bootcampId?: string;
}

export default function SubmissionsPage({ sessionId, bootcampId }: SubmissionsPageProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<any>(null);
  const [gradeData, setGradeData] = useState({ grade: 0, feedback: '', status: 'GRADED' });

  const isStandalone = !sessionId || !bootcampId;

  // Standalone logic: load tasks and select the first one
  useEffect(() => {
    if (isStandalone) {
      tasksService.getTasks().then(res => {
        const allTasks = res.data || [];
        setTasks(allTasks);
        if (allTasks.length > 0) {
          setSelectedTaskId(allTasks[0]._id || allTasks[0].id);
        }
      });
    }
  }, [isStandalone]);

  // Standalone logic: fetch submissions when task changes
  useEffect(() => {
    if (isStandalone && selectedTaskId) {
      setLoading(true);
      submissionsService.getSubmissionsByTask(selectedTaskId)
        .then(res => setSubmissions(res.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [selectedTaskId, isStandalone]);

  // Embedded logic: load specific session's tasks and flatten all submissions
  useEffect(() => {
    const fetchData = async () => {
      if (isStandalone) return;
      setLoading(true);
      try {
        const tasksRes = await tasksService.getTasksByBootcamp(bootcampId!);
        const allTasks = tasksRes.data || [];
        
        const sessionTasks = allTasks.filter((t: any) => 
          (t.sessionId?._id || t.sessionId) === sessionId
        );

        const submissionsPromises = sessionTasks.map((t: any) => 
          submissionsService.getSubmissionsByTask(t._id || t.id)
        );
        
        const submissionsResults = await Promise.all(submissionsPromises);
        const allSubmissions = submissionsResults.flatMap(res => res.data || []);
        setSubmissions(allSubmissions);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, bootcampId, isStandalone]);

  const filteredSubmissions = submissions.filter((s) =>
    (typeof s.studentId === 'object' && s.studentId?.name?.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    s.taskId?.title?.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    s._id?.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    s.id?.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleOpenGrade = (sub: any) => {
    setActiveSubmission(sub);
    setGradeData({
      grade: sub.grade || 0,
      feedback: sub.feedback || '',
      status: sub.status === 'PENDING' ? 'GRADED' : sub.status
    });
    setIsGradeModalOpen(true);
  };

  const submitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;
    try {
      await submissionsService.gradeSubmission(activeSubmission._id || activeSubmission.id, gradeData);
      setIsGradeModalOpen(false);
      
      // Reload submissions
      if (isStandalone) {
        const res = await submissionsService.getSubmissionsByTask(selectedTaskId);
        setSubmissions(res.data || []);
      } else {
        // Update local state directly for embedded mode to avoid heavy refetch
        setSubmissions(prev => prev.map(s => 
          (s._id || s.id) === (activeSubmission._id || activeSubmission.id) 
            ? { ...s, status: gradeData.status, grade: gradeData.grade, feedback: gradeData.feedback } 
            : s
        ));
      }
    } catch (err: any) {
       alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Submission Review</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Evaluation Pipeline & Academic Peer Review</p>
        </div>
        {isStandalone && (
          <div className="flex items-center space-x-3 bg-brand-primary p-2 rounded-xl border border-brand-border">
            <BookOpen size={14} className="text-brand-accent ml-2" />
            <select 
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-text-main outline-none focus:ring-0 mr-2"
            >
              {tasks.map(t => (
                 <option key={t._id || t.id} value={t._id || t.id}>{t.title}</option>
              ))}
              {tasks.length === 0 && <option value="" disabled>No Tasks Available</option>}
            </select>
          </div>
        )}
      </div>

      <div className="geo-card overflow-hidden">
        <div className="p-6 border-b border-brand-border bg-brand-primary/30 flex justify-between items-center">
           {isStandalone && (
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent flex items-center">
                Active Task: {tasks.find(t => (t._id || t.id) === selectedTaskId)?.title || '...'}
             </div>
           )}
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Lifecycle Queue: {filteredSubmissions.length} Entities</span>
        </div>
        
        {loading ? (
             <div className="text-center text-text-muted font-bold uppercase py-10 animate-pulse tracking-[0.2em]">Aggregating Submission Data...</div>
        ) : (
        <Table className="w-full text-left">
          <TableHeader className="bg-brand-primary/50">
            <TableRow>
              <TableHead className="px-8 py-5">Entity / Student</TableHead>
              <TableHead className="px-8 py-5">Task / Source</TableHead>
              <TableHead className="px-8 py-5">Metrics</TableHead>
              <TableHead className="px-8 py-5">Status</TableHead>
              <TableHead className="px-8 py-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.map((sub) => {
              const studentName = typeof sub.studentId === 'object' ? sub.studentId?.name : 'Unknown Student';
              return (
              <TableRow key={sub._id || sub.id}>
                <TableCell className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-text-main uppercase tracking-tight">{studentName}</span>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-0.5">{sub._id || sub.id}</span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-text-main uppercase tracking-widest">{sub.taskId?.title || 'Unknown Task'}</span>
                    <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-brand-accent hover:underline mt-1">
                      <FileText size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Source Code</span>
                    </a>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <span className="text-xs font-black text-text-muted uppercase tracking-widest leading-none">
                     {sub.status === 'GRADED' ? `${sub.grade} / 100 PTS` : 'Awaiting'}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className={cn(
                    "inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm",
                    sub.status === 'GRADED' ? "bg-green-100 text-green-700 border border-green-200" :
                    sub.status === 'RETURNED' ? "bg-red-100 text-red-700 border border-red-200" :
                    "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  )}>
                    {sub.status === 'GRADED' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                    <span>{sub.status}</span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-right">
                  <Button onClick={() => handleOpenGrade(sub)} size="sm" variant="outline" className="text-[10px] font-black uppercase tracking-widest border-brand-border text-brand-accent px-4 py-1 hover:bg-brand-accent hover:text-white transition-all">
                    Evaluate
                  </Button>
                </TableCell>
              </TableRow>
            )})}
            {filteredSubmissions.length === 0 && (
              <TableRow>
                 <TableCell colSpan={5} className="text-center py-10 text-text-muted font-black text-[10px] uppercase tracking-[0.2em]">No submissions delivered yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        )}
      </div>

      <Modal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} title="Peer Review & Evaluation">
         <form onSubmit={submitGrade} className="space-y-4">
            <div className="p-4 bg-brand-primary border border-brand-border rounded-xl">
               <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Evaluating Student</p>
               <p className="text-sm font-black text-brand-accent uppercase">{typeof activeSubmission?.studentId === 'object' ? activeSubmission?.studentId?.name : '...'}</p>
               <a href={activeSubmission?.githubUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline break-all mt-2 block">{activeSubmission?.githubUrl}</a>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Assign Grade Form</label>
                 <input 
                   required 
                   type="number" 
                   min="0"
                   max="100"
                   value={gradeData.grade} 
                   onChange={e => setGradeData({...gradeData, grade: Number(e.target.value)})}
                   className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none" 
                 />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Final Status</label>
                  <select 
                    value={gradeData.status} 
                    onChange={e => setGradeData({...gradeData, status: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium uppercase outline-none focus:border-brand-accent"
                  >
                    <option value="GRADED">Graded / Approved</option>
                    <option value="RETURNED">Returned / Requires Fix</option>
                    <option value="PENDING">Pending (Reset)</option>
                  </select>
               </div>
            </div>
            <div>
               <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Qualitative Feedback</label>
               <textarea 
                 rows={4}
                 value={gradeData.feedback} 
                 onChange={e => setGradeData({...gradeData, feedback: e.target.value})}
                 className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none resize-none" 
                 placeholder="Provide actionable code review details..." 
               />
            </div>
            <div className="pt-6 mt-6 border-t border-brand-border flex justify-end gap-3">
               <button type="button" onClick={() => setIsGradeModalOpen(false)} className="px-6 py-3 text-[10px] font-black uppercase text-text-muted hover:text-white transition-colors">Abort</button>
               <Button type="submit" className="px-6 py-3 shadow-lg shadow-brand-accent/20">Commit Evaluation</Button>
            </div>
         </form>
      </Modal>

