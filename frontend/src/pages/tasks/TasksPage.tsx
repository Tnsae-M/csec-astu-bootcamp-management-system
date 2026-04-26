import React, { useEffect } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { tasksService } from '../../services/tasks.service';
import { setTasksStart, setTasksSuccess, setTasksFailure } from '../../features/tasks/taskSlice';
import { Button } from '../../components/ui';

interface TasksPageProps {
  sessionId?: string;
  bootcampId?: string;
}

export default function TasksPage({ sessionId, bootcampId }: TasksPageProps) {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    // Note: Backend currently has /tasks/bootcamp/:bootcampId
    // If we only have sessionId, we might need a different endpoint or fetch bootcampId first.
    // For now, assuming bootcampId is either passed or we fetch tasks.
    const fetchTasks = async () => {
      if (!bootcampId) {
        dispatch(setTasksSuccess([]));
        return;
      }
      
      dispatch(setTasksStart());
      try {
        const response = await tasksService.getTasksByBootcamp(bootcampId);
        dispatch(setTasksSuccess(response.data || []));
      } catch (error: any) {
        dispatch(setTasksFailure(error.message));
      }
    };

    fetchTasks();
  }, [dispatch, bootcampId]);

  const filteredTasks = tasks.filter((t) => 
    t.title.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (t.division && t.division.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (t.instructor && t.instructor.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  if (loading) {
    return <div className="text-center py-10 font-bold uppercase text-text-muted">Loading Tasks...</div>;
  }

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent tracking-tighter uppercase">Curriculum Tasks</h1>
          <p className="text-text-muted mt-2 font-bold text-[10px] uppercase tracking-widest leading-none">Task Registry & Delivery Protocol</p>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-brand-primary/50 border border-dashed border-brand-border rounded-2xl">
          <p className="text-text-muted font-black uppercase tracking-widest text-xs">No tasks yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTasks.map((task) => (
            <div key={task._id || task.id} className="geo-card p-8 group hover:border-brand-accent transition-all relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div className="w-12 h-12 bg-brand-primary border border-brand-border text-brand-accent rounded-lg flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-all shadow-sm">
                  <BookOpen size={24} />
                </div>
                <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-text-muted">
                  <Clock size={12} className="text-brand-accent" />
                  <span>DUE: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'TBD'}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-2 leading-none group-hover:text-brand-accent transition-colors">{task.title}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-8">{task.division || 'General'} Sector</p>
              
              <div className="flex justify-between items-end border-t border-brand-border pt-6 mt-10">
                <div>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Assigned Instructor</p>
                    <p className="text-xs font-black text-text-main uppercase tracking-tighter">{task.instructor || 'Unassigned'}</p>
                </div>
                <Button size="sm" variant="primary" className="text-[10px] font-black uppercase tracking-widest px-6 shadow-md">
                  Initialize
                </Button>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
