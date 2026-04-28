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
import { useNavigate } from 'react-router-dom';

interface TasksPageProps {
  sessionId?: string;
  bootcampId?: string;
}

export default function TasksPage({ sessionId, bootcampId }: TasksPageProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    sessionsService.getSessions().then(res => {
      const payload = res.data ?? res;
      const list = Array.isArray(payload) ? payload : payload?.data ?? [];
      setSessions(list);
    }).catch(() => setSessions([]));
  }, [dispatch, bootcampId]);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes((searchTerm || '').toLowerCase());

    const matchesSession = sessionId
      ? (t.sessionId?._id === sessionId || t.sessionId === sessionId)
      : true;

    return matchesSearch && matchesSession;
  });

  const roles = user?.roles || [];
  const isFaculty =
    roles.includes('ADMIN') ||
    roles.includes('SUPER ADMIN') ||
    roles.includes('INSTRUCTOR');

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      bootcampId: bootcamps[0]?._id || '',
      sessionId: '',
      dueDate: new Date().toISOString().split('T')[0],
      maxScore: 100,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: any) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description || '',
      bootcampId:
        typeof task.bootcampId === 'object'
          ? task.bootcampId._id
          : task.bootcampId,
      sessionId:
        typeof task.sessionId === 'object'
          ? task.sessionId?._id
          : task.sessionId || '',
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
      maxScore: task.maxScore || 100,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this task?')) {
      await tasksService.deleteTask(id);
      fetchTasks();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, createdBy: user?.id };

    if (editingId) {
      await tasksService.updateTask(editingId, payload);
    } else {
      await tasksService.createTask(payload);
    }

    setIsModalOpen(false);
    fetchTasks();
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>

        {isFaculty && (
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2" /> Create Task
          </Button>
        )}
      </div>

      {/* TASK LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => {
            const bcName =
              typeof task.bootcampId === 'object'
                ? task.bootcampId.title
                : 'Bootcamp';

            return (
              <div key={task._id} className="p-6 border rounded-xl">
                <div className="flex justify-between mb-4">
                  <BookOpen />
                  {isFaculty && (
                    <div className="flex gap-2">
                      <Edit onClick={() => handleOpenEdit(task)} />
                      <Trash2 onClick={() => handleDelete(task._id)} />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-sm text-gray-500">{bcName}</p>

                <div className="flex justify-between mt-4">
                  <span>
                    <Clock />{' '}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : 'No deadline'}
                  </span>

                  {!isFaculty ? (
                    <Button size="sm" onClick={() => {
                      // navigate student to submission form, preselect the task
                      const base = `/dashboard/student/submit`;
                      const params = new URLSearchParams();
                      params.set('taskId', task._id || task.id);
                      if (task.sessionId) params.set('sessionId', (task.sessionId._id || task.sessionId));
                      if (task.bootcampId) params.set('bootcampId', (task.bootcampId._id || task.bootcampId));
                      navigate(`${base}?${params.toString()}`);
                    }}>Submit</Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      Submissions
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Task' : 'Create Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border p-2"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border p-2"
          />

          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            className="w-full border p-2"
          />

          <Button type="submit">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}