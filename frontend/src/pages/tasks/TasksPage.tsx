import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { BookOpen, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { tasksService } from '../../services/tasks.service';
import { bootcampsService } from '../../services/bootcamps.service';
import { sessionsService } from '../../services/sessions.service';
import { setTasksStart, setTasksSuccess, setTasksFailure } from '../../features/tasks/taskSlice';
import { Button, Modal } from '../../components/ui';

interface TasksPageProps {
  sessionId?: string;
  bootcampId?: string;
}

export default function TasksPage({ sessionId, bootcampId }: TasksPageProps) {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bootcampId: '',
    sessionId: '',
    dueDate: '',
    maxScore: 100,
  });

  const fetchTasks = async () => {
    dispatch(setTasksStart());
    try {
      let res;
      if (bootcampId) {
        res = await tasksService.getTasksByBootcamp(bootcampId);
      } else {
        res = await tasksService.getTasks();
      }
      dispatch(setTasksSuccess(res.data || []));
    } catch (error: any) {
      dispatch(setTasksFailure(error.message));
    }
  };

  useEffect(() => {
    fetchTasks();
    bootcampsService.getBootcamps().then(res => setBootcamps(res.data || []));
    sessionsService.getSessions().then(res => setSessions(res.data || []));
  }, [dispatch, bootcampId]);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (typeof t.bootcampId === 'object' && t.bootcampId?.title?.toLowerCase().includes((searchTerm || '').toLowerCase()));
      
    const matchesSession = sessionId ? (t.sessionId?._id === sessionId || t.sessionId === sessionId) : true;
    
    return matchesSearch && matchesSession;
  });

  const roles = user?.roles || [];
  const isFaculty = roles.includes('ADMIN') || roles.includes('SUPER ADMIN') || roles.includes('INSTRUCTOR');

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ 
      title: '', description: '', 
      bootcampId: bootcamps[0]?._id || '', 
      sessionId: '', 
      dueDate: new Date().toISOString().split('T')[0], 
      maxScore: 100 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: any) => {
    setEditingId(task._id);
    setFormData({ 
      title: task.title, 
      description: task.description || '', 
      bootcampId: typeof task.bootcampId === 'object' ? task.bootcampId._id : task.bootcampId,
      sessionId: typeof task.sessionId === 'object' ? task.sessionId?._id : (task.sessionId || ''),
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
      maxScore: task.maxScore || 100
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete task: ${title}?`)) {
      try {
         await tasksService.deleteTask(id);
         fetchTasks();
      } catch (err: any) {
         alert(err.response?.data?.message || err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        createdBy: user?.id,
      };
      if (!payload.sessionId) delete (payload as any).sessionId;

      if (editingId) {
        await tasksService.updateTask(editingId, payload);
      } else {
        await tasksService.createTask(payload);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const isDueSoon = (date: string) => {
    const timeDiff = new Date(date).getTime() - new Date().getTime();
    return timeDiff > 0 && timeDiff < 48 * 60 * 60 * 1000;
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Curriculum Tasks</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Task Registry & Delivery Protocol</p>
        </div>
        {isFaculty && (
          <button 
            onClick={handleOpenCreate}
            className="bg-brand-accent text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/20"
          >
            <Plus size={16} className="mr-2" /> Assign Task
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-text-muted font-bold uppercase py-10">Loading Tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-brand-primary/50 border border-dashed border-brand-border rounded-2xl">
          <p className="text-text-muted font-black uppercase tracking-widest text-xs">No tasks yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTasks.map((task) => {
            const bcName = typeof task.bootcampId === 'object' ? task.bootcampId?.title : (bootcamps.find(b => b._id === task.bootcampId)?.title || 'Unknown Bootcamp');
            const author = typeof task.createdBy === 'object' ? task.createdBy?.name : 'Faculty';
            const displayDate = task.dueDate || task.deadline;

            return (
            <div key={task._id || task.id} className="geo-card p-8 group hover:border-brand-accent transition-all relative overflow-hidden flex flex-col justify-between">
              <div>
              <div className="flex justify-between items-center mb-10">
                <div className="w-12 h-12 bg-brand-primary border border-brand-border text-brand-accent rounded-lg flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-all shadow-sm">
                  <BookOpen size={24} />
                </div>
                <div className="flex space-x-2 items-center">
                  {isFaculty && (
                    <>
                      <button 
                        onClick={() => handleOpenEdit(task)}
                        className="text-text-muted hover:text-brand-accent p-1"
                      >
                         <Edit size={14} />
                      </button>
                      <button 
                         onClick={() => handleDelete(task._id || task.id, task.title)}
                         className="text-text-muted hover:text-red-500 p-1"
                      >
                         <Trash2 size={14} />
                      </button>
                    </>
                  )}
                  <div className={cn(
                    "flex items-center space-x-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                    isDueSoon(displayDate) ? "text-orange-500 bg-orange-500/10" : "text-text-muted bg-brand-primary border border-brand-border"
                  )}>
                    <Clock size={10} />
                    <span>{displayDate ? new Date(displayDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-2 leading-none group-hover:text-brand-accent transition-colors">{task.title}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-8">{bcName}</p>
            </div>
            
            <div className="flex justify-between items-end border-t border-brand-border pt-6 mt-10">
               <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Max Score: {task.maxScore || 100}</p>
                  <p className="text-[10px] font-black text-text-main uppercase tracking-tighter">By: {author}</p>
               </div>
               {!isFaculty ? (
                 <Button size="sm" className="text-[10px] font-black uppercase tracking-widest px-6 shadow-md border border-brand-accent bg-brand-accent text-white">
                   Submit
                 </Button>
               ) : (
                 <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest px-6 shadow-none bg-transparent">
                   Submissions
                 </Button>
               )}
            </div>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        )})}
      </div>
      )}
                <div className="flex space-x-2 items-center">
                  {isFaculty && (
                    <>
                      <button 
                        onClick={() => handleOpenEdit(task)}
                        className="text-text-muted hover:text-brand-accent p-1"
                      >
                         <Edit size={14} />
                      </button>
                      <button 
                         onClick={() => handleDelete(task._id, task.title)}
                         className="text-text-muted hover:text-red-500 p-1"
                      >
                         <Trash2 size={14} />
                      </button>
                    </>
                  )}
                  <div className={cn(
                    "flex items-center space-x-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                    isDueSoon(task.dueDate) ? "text-orange-500 bg-orange-500/10" : "text-text-muted bg-brand-primary border border-brand-border"
                  )}>
                    <Clock size={10} />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-2 leading-none group-hover:text-brand-accent transition-colors">{task.title}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-8">{bcName}</p>
            </div>
            
            <div className="flex justify-between items-end border-t border-brand-border pt-6 mt-10">
               <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Max Score: {task.maxScore}</p>
                  <p className="text-[10px] font-black text-text-main uppercase tracking-tighter">By: {author}</p>
               </div>
               {!isFaculty ? (
                 <Button size="sm" className="text-[10px] font-black uppercase tracking-widest px-6 shadow-md border border-brand-accent">
                   Submit
                 </Button>
               ) : (
                 <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest px-6 shadow-none bg-transparent">
                   Submissions
                 </Button>
               )}
            </div>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        )})}
      </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Modify Task Directives" : "Assign Curriculum Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Task Title</label>
            <input 
              required 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
              placeholder="e.g. Build API Endpoints" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Target Bootcamp</label>
              <select 
                required
                value={formData.bootcampId} 
                onChange={e => setFormData({...formData, bootcampId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium uppercase outline-none focus:border-brand-accent transition-colors"
              >
                <option value="" disabled>Select Bootcamp</option>
                {bootcamps.map(b => (
                   <option key={b._id} value={b._id}>{b.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Link Session <span className="lowercase normal-case text-brand-border">(Optional)</span></label>
              <select 
                value={formData.sessionId} 
                onChange={e => setFormData({...formData, sessionId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium uppercase outline-none focus:border-brand-accent transition-colors"
              >
                <option value="">None</option>
                {sessions.filter(s => typeof s.bootcamp === 'object' ? s.bootcamp._id === formData.bootcampId : s.bootcamp === formData.bootcampId).map(s => (
                   <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Task Instructions</label>
            <textarea 
              rows={3}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors resize-none" 
              placeholder="Provide repository links or requirements..." 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Deadline</label>
                <input 
                  required 
                  type="date" 
                  value={formData.dueDate} 
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
                />
             </div>
             <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Maximum Points</label>
                <input 
                  required 
                  type="number" 
                  min="1"
                  value={formData.maxScore} 
                  onChange={e => setFormData({...formData, maxScore: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
                />
             </div>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-border flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl border border-brand-border text-text-muted text-[10px] font-black uppercase tracking-widest hover:text-text-main hover:bg-brand-primary/80 transition-colors"
            >
              Cancel
            </button>
            <Button 
              type="submit"
              className="px-6 py-3 shadow-lg shadow-brand-accent/20 flex items-center"
            >
              {editingId ? "Update Parameters" : "Publish Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
