import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  BookOpen,
  Clock,
  Plus,
  Edit,
  Trash2,
  CalendarDays,
  Trophy,
  ArrowRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tasksService } from "@/services/tasks.service";
import { bootcampsService } from "@/services/bootcamps.service";
import { sessionsService } from "@/services/sessions.service";
import {
  fetchTasksByBootcamp,
  setTasksStart,
  setTasksSuccess,
  setTasksFailure,
} from "@/features/tasks/taskSlice";
import {
  Button,
  Modal,
  Card,
  Badge,
  EmptyState,
  FormField,
  Input,
  Textarea,
  Skeleton,
} from "@/components/ui";
import { useNavigate } from "react-router-dom";

interface TasksPageProps {
  sessionId?: string;
  bootcampId?: string;
}

export default function TasksPage({ sessionId, bootcampId }: TasksPageProps) {
  const dispatch = useDispatch() as any;
  const navigate = useNavigate();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bootcampId: "",
    sessionId: "",
    dueDate: "",
    maxScore: 100,
  });

  const fetchTasks = async () => {
    if (bootcampId) {
      dispatch(fetchTasksByBootcamp(bootcampId));
    } else {
      dispatch(setTasksStart());
      try {
        // Fallback for general tasks if needed
        const res = await tasksService.getTasksByBootcamp("general");
        dispatch(setTasksSuccess(res.data || []));
      } catch (error: any) {
        dispatch(setTasksFailure(error.message));
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    bootcampsService.getBootcamps().then((res) => setBootcamps(res.data || []));
    sessionsService.getSessions().then((res) => setAllSessions(res.data.data || []));
  }, [dispatch, bootcampId]);



  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = (t.title || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase());
    const matchesSession = sessionId
      ? t.sessionId?._id === sessionId || t.sessionId === sessionId
      : true;
    return matchesSearch && matchesSession;
  });

  const roles = user?.roles || [];
  const isFaculty =
    roles.includes("ADMIN") ||
    roles.includes("SUPER ADMIN") ||
    roles.includes("INSTRUCTOR");

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      bootcampId: bootcampId || bootcamps[0]?._id || "",
      sessionId: sessionId || "",
      dueDate: new Date().toISOString().split("T")[0],
      maxScore: 100,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: any) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description || "",
      bootcampId:
        typeof task.bootcampId === "object"
          ? task.bootcampId._id
          : task.bootcampId,
      sessionId:
        typeof task.sessionId === "object"
          ? task.sessionId?._id
          : task.sessionId || "",
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
      maxScore: task.maxScore || 100,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksService.deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error("Failed to delete task", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, createdBy: user?.id };
    try {
      if (editingId) {
        await tasksService.updateTask(editingId, payload);
      } else {
        await tasksService.createTask(payload);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Failed to save task", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-main uppercase">
            Task Registry
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">
            Manage assignments, deadlines and grading
          </p>
        </div>

        {isFaculty && (
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg shadow-brand-accent/20"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Assignment
          </Button>
        )}
      </div>

      {/* STATS PREVIEW (OPTIONAL) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 border-none bg-brand-primary/30">
          <div className="p-3 rounded-xl bg-white text-brand-accent shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Total Tasks
            </p>
            <p className="text-xl font-black text-text-main">{tasks.length}</p>
          </div>
        </Card>
      </div>

      {/* TASK LIST */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title="No Tasks Found"
          description="There are currently no assignments matching your criteria. Create one to get started."
          icon={<BookOpen />}
          action={
            isFaculty
              ? { label: "Create First Task", onClick: handleOpenCreate }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const bcName =
              typeof task.bootcampId === "object" && task.bootcampId !== null
                ? (task.bootcampId.name || task.bootcampId.title || "General Bootcamp")
                : "General Bootcamp";
            const isOverdue =
              task.dueDate && new Date(task.dueDate) < new Date();

            return (
              <Card key={task._id} className="group overflow-visible">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <Badge
                      variant={isOverdue ? "destructive" : "secondary"}
                      className="uppercase text-[9px] tracking-widest px-2"
                    >
                      {isOverdue ? "Past Due" : "Active"}
                    </Badge>

                    {isFaculty && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-text-muted hover:text-brand-accent"
                          onClick={() => handleOpenEdit(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-text-muted hover:text-red-500"
                          onClick={() => handleDelete(task._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-text-main leading-tight mb-1 group-hover:text-brand-accent transition-colors">
                    {task.title}
                  </h3>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Filter className="h-3 w-3" /> {bcName}
                  </p>

                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-text-muted font-medium bg-brand-primary/40 p-2 rounded-lg">
                      <CalendarDays className="h-3.5 w-3.5 text-brand-accent" />
                      <span>
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "No deadline"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-text-muted font-medium bg-brand-primary/40 p-2 rounded-lg">
                      <Trophy className="h-3.5 w-3.5 text-brand-accent" />
                      <span>Max Score: {task.maxScore || 100} Points</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between">
                    {!isFaculty ? (
                      <Button
                        className="w-full justify-between group/btn"
                        onClick={() => {
                          const base = `/dashboard/student/submit`;
                          const params = new URLSearchParams();
                          params.set(
                            "taskId",
                            (task._id || task.id || "") as string,
                          );
                          if (task.sessionId)
                            params.set(
                              "sessionId",
                              task.sessionId._id || task.sessionId,
                            );
                          if (task.bootcampId)
                            params.set(
                              "bootcampId",
                              task.bootcampId._id || task.bootcampId,
                            );
                          navigate(`${base}?${params.toString()}`);
                        }}
                      >
                        Submit Assignment
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full hover:bg-brand-accent hover:text-white transition-colors"
                        onClick={() =>
                          navigate(
                            `/dashboard/instructor/submissions?taskId=${task._id ?? ""}`,
                          )
                        }
                      >
                        View Submissions
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TASK MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Assignment" : "Create New Assignment"}
        subtitle="Specify task details, deadline, and scoring criteria."
        icon={<BookOpen />}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Task Title" required>
            <Input
              placeholder="e.g. React Fundamentals Quiz"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Parent Bootcamp" required>
               <select 
                 className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium outline-none focus:border-brand-accent transition-colors"
                 value={formData.bootcampId}
                 onChange={e => setFormData({...formData, bootcampId: e.target.value})}
                 required
               >
                 <option value="">Select Bootcamp</option>
                 {bootcamps.map(b => (
                   <option key={b._id} value={b._id}>{b.name || b.title}</option>
                 ))}
               </select>
            </FormField>

            <FormField label="Related Session">
               <select 
                 className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium outline-none focus:border-brand-accent transition-colors"
                 value={formData.sessionId}
                 onChange={e => setFormData({...formData, sessionId: e.target.value})}
               >
                 <option value="">None / General</option>
                 {allSessions.filter(s => (s.bootcamp && typeof s.bootcamp === 'object' ? s.bootcamp._id : s.bootcamp) === formData.bootcampId).map(s => (
                   <option key={s._id} value={s._id}>{s.title}</option>
                 ))}
               </select>
            </FormField>
          </div>

          <FormField label="Description">

            <Textarea
              placeholder="Detail the requirements for this assignment..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Due Date" required>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </FormField>

            <FormField label="Max Score" required>
              <Input
                type="number"
                value={formData.maxScore}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxScore: parseInt(e.target.value),
                  })
                }
                required
              />
            </FormField>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingId ? "Update Assignment" : "Publish Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
