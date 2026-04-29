import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { Button, Modal } from "../../components/ui";
import { Users2, Clock, Calendar, BookOpen } from "lucide-react";
import { usersService } from "../../services/users.service";
import { groupsService } from "../../services/groups.service";
import { sessionsService } from "../../services/sessions.service";
import { projectsService } from "../../services/projects.service";
import {
  setGroupsStart,
  setGroupsSuccess,
  setGroupsFailure,
} from "../../features/groups/groupsSlice";
import {
  setSessionsStart,
  setSessionsSuccess,
  setSessionsFailure,
} from "../../features/sessions/sessionSlice";

export default function BootcampDetailPage() {
  const { role, divisionId, bootcampId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<
    "groups" | "sessions" | "projects"
  >("sessions");

  const { groups, loading: groupsLoading } = useSelector(
    (state: RootState) => state.groups,
  );
  const { items: sessions, loading: sessionsLoading } = useSelector(
    (state: RootState) => state.sessions,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const isStudent = (user?.roles || []).includes("STUDENT");

  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    if (!bootcampId) return;

    dispatch(setGroupsStart());
    groupsService
      .getGroupsByBootcamp(bootcampId)
      .then((res) => dispatch(setGroupsSuccess(res.data || [])))
      .catch((err) => dispatch(setGroupsFailure(err.message)));

    dispatch(setSessionsStart());
    sessionsService
      .getSessionsByBootcamp(bootcampId)
      .then((res) => {
        const payload = res.data ?? res;
        const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
        dispatch(setSessionsSuccess(list));
      })
      .catch((err) => dispatch(setSessionsFailure(err.message)));

    // load projects for this bootcamp
    setProjectsLoading(true);
    projectsService
      .getProjectsByBootcamp(bootcampId)
      .then((res) => {
        const payload = res.data ?? res;
        const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
        setProjects(list);
      })
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoading(false));
  }, [bootcampId, dispatch]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formState, setFormState] = useState<any>({
    // group
    groupName: "",
    mentorId: "",
    // session
    title: "",
    instructorId: "",
    place: "",
    duration: "",
    date: "",
    time: "",
  });
  const [instructors, setInstructors] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    repo: "",
    dueDate: "",
  });

  const handleCreate = async () => {
    if (!bootcampId) return;
    setCreating(true);
    try {
      if (activeTab === "groups") {
        await groupsService.createGroup({
          name: formState.groupName,
          bootcampId,
          mentor: formState.mentorId || undefined,
        });
        dispatch(setGroupsStart());
        groupsService
          .getGroupsByBootcamp(bootcampId)
          .then((res) => dispatch(setGroupsSuccess(res.data || [])))
          .catch((err) => dispatch(setGroupsFailure(err.message)));
      } else {
        // sessions
        await sessionsService.createSession({
          title: formState.title,
          bootcampId,
          instructor: formState.instructorId || undefined,
          place: formState.place,
          duration: formState.duration,
          date: formState.date,
          startTime: formState.time,
        });
        dispatch(setSessionsStart());
        sessionsService
          .getSessionsByBootcamp(bootcampId)
          .then((res) => dispatch(setSessionsSuccess(res.data || [])))
          .catch((err) => dispatch(setSessionsFailure(err.message)));
      }
      if (activeTab === "projects") {
        // create project
        await projectsService.createProject(bootcampId, projectForm);
        // refresh
        setProjectsLoading(true);
        projectsService
          .getProjectsByBootcamp(bootcampId)
          .then((res) => {
            const payload = res.data ?? res;
            const list = Array.isArray(payload)
              ? payload
              : (payload?.data ?? []);
            setProjects(list);
          })
          .catch(() => setProjects([]))
          .finally(() => setProjectsLoading(false));
        setProjectForm({ title: "", description: "", repo: "", dueDate: "" });
      }
      setShowCreateModal(false);
      // reset form
      setFormState({
        groupName: "",
        mentorId: "",
        title: "",
        instructorId: "",
        place: "",
        duration: "",
        date: "",
        time: "",
      });
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Create failed");
    } finally {
      setCreating(false);
      toast.success(
        activeTab === "groups"
          ? "Group created!"
          : activeTab === "projects"
            ? "Project created!"
            : "Session scheduled!",
      );
    }
  };

  useEffect(() => {
    // load instructors for selects
    usersService
      .getUsers("INSTRUCTOR")
      .then((res) => {
        const payload = res.data ?? res;
        const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
        setInstructors(list);
      })
      .catch(() => setInstructors([]));
  }, []);

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white relative">
      <div className="flex justify-between items-center pr-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">
            Bootcamp Hub
          </h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">
            Manage Groups & Sessions
          </p>
        </div>
        {((user?.roles || []).includes("ADMIN") ||
          (user?.roles || []).includes("INSTRUCTOR")) && (
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setActiveTab("groups");
                setShowCreateModal(true);
              }}
              className="bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest px-6 h-10 hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/20"
            >
              Add Group
            </Button>
            <Button
              onClick={() => {
                setActiveTab("sessions");
                setShowCreateModal(true);
              }}
              className="bg-brand-primary border border-brand-accent text-brand-accent text-[10px] font-black uppercase tracking-widest px-6 h-10 hover:bg-brand-accent/5"
            >
              Add Session
            </Button>
            <Button
              onClick={() => {
                setActiveTab("projects");
                setShowCreateModal(true);
              }}
              className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-6 h-10 hover:bg-blue-700 shadow-lg"
            >
              Create Project
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={
          activeTab === "groups"
            ? "Create Group"
            : activeTab === "projects"
              ? "Create Project"
              : "Schedule Session"
        }
        subtitle={
          activeTab === "groups"
            ? "Define a cohort and assign a mentor."
            : activeTab === "projects"
              ? "Create the final project for this bootcamp."
              : "Schedule a session and assign an instructor."
        }
        icon={
          activeTab === "groups" ? (
            <Users2 />
          ) : activeTab === "projects" ? (
            <BookOpen />
          ) : (
            <Calendar />
          )
        }
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          {activeTab === "groups" ? (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                  Group Name
                </label>
                <input
                  required
                  value={formState.groupName}
                  onChange={(e) =>
                    setFormState({ ...formState, groupName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                  placeholder="e.g. Alpha Cohort"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                  Mentor (Instructor)
                </label>
                <select
                  value={formState.mentorId}
                  onChange={(e) =>
                    setFormState({ ...formState, mentorId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                >
                  <option value="">Unassigned</option>
                  {instructors.map((i) => (
                    <option key={i._id || i.id} value={i._id || i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </>
          ) : activeTab === "projects" ? (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                  Project Title
                </label>
                <input
                  required
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                  placeholder="e.g. Final Capstone Project"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                  Repository Link (optional)
                </label>
                <input
                  value={projectForm.repo}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, repo: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                  Short Description
                </label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                  placeholder="Describe project goals and deliverables"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={projectForm.dueDate}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                  Session Title
                </label>
                <input
                  required
                  value={formState.title}
                  onChange={(e) =>
                    setFormState({ ...formState, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                  placeholder="e.g. React Hooks Deep Dive"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                    Instructor
                  </label>
                  <select
                    value={formState.instructorId}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        instructorId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                  >
                    <option value="">Unassigned</option>
                    {instructors.map((i) => (
                      <option key={i._id || i.id} value={i._id || i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                    Place
                  </label>
                  <input
                    value={formState.place}
                    onChange={(e) =>
                      setFormState({ ...formState, place: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                    placeholder="e.g. Room 204 / Zoom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formState.date}
                    onChange={(e) =>
                      setFormState({ ...formState, date: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formState.time}
                    onChange={(e) =>
                      setFormState({ ...formState, time: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-text-muted mb-2">
                    Duration
                  </label>
                  <input
                    value={formState.duration}
                    onChange={(e) =>
                      setFormState({ ...formState, duration: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"
                    placeholder="e.g. 1h 30m"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Scheduling..." : "Create Session"}
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* Tabs */}
      <div className="flex border-b border-brand-border space-x-8">
        <button
          onClick={() => setActiveTab("groups")}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${
            activeTab === "groups"
              ? "border-b-2 border-brand-accent text-brand-accent"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          Groups
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${
            activeTab === "sessions"
              ? "border-b-2 border-brand-accent text-brand-accent"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          Sessions
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${
            activeTab === "projects"
              ? "border-b-2 border-brand-accent text-brand-accent"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          Projects
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === "groups" && (
          <div>
            {groupsLoading ? (
              <div className="text-center text-text-muted font-bold uppercase py-10">
                Loading Groups...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((g) => (
                  <Card
                    key={g._id || g.id}
                    className="flex flex-col h-full hover:border-brand-accent transition-colors shadow-sm"
                  >
                    <CardHeader className="flex flex-col space-y-1.5 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-10 h-10 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                          <Users2 size={20} />
                        </div>
                        <div className="text-[10px] font-bold uppercase text-text-muted bg-brand-primary border border-brand-border px-2 py-1 rounded">
                          {g.members?.length || 0} Members
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {g.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 text-text-muted">
                        Mentor: {g.mentor?.name || "Unassigned"}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-4 flex gap-2">
                      {/* Placeholder for group actions like Manage Group if needed */}
                      <Button
                        variant="outline"
                        className="w-full text-xs h-9 bg-transparent border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                {groups.length === 0 && (
                  <div className="col-span-full text-center py-10 text-text-muted font-black uppercase tracking-widest text-xs">
                    No groups registered.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            {projectsLoading ? (
              <div className="text-center text-text-muted font-bold uppercase py-10">
                Loading Projects...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <Card
                    key={p._id || p.id}
                    className="flex flex-col h-full hover:border-brand-accent transition-colors shadow-sm"
                  >
                    <CardHeader className="flex flex-col space-y-1.5 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-10 h-10 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                          <BookOpen size={20} />
                        </div>
                        <div className="text-[10px] font-semibold text-brand-accent bg-brand-primary border border-brand-border px-2 py-1 rounded">
                          Project
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {p.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 text-text-muted">
                        {p.description || "No description provided."}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-4 flex gap-2">
                      <Button
                        variant="outline"
                        className="w-full text-xs h-9 bg-transparent border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white"
                      >
                        View Project
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                {projects.length === 0 && (
                  <div className="col-span-full text-center py-10 text-text-muted font-black uppercase tracking-widest text-xs">
                    No projects defined.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "sessions" && (
          <div>
            {sessionsLoading ? (
              <div className="text-center text-text-muted font-bold uppercase py-10">
                Loading Sessions...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(sessions) ? sessions : []).map((s) => (
                  <Card
                    key={s._id || s.id}
                    className="flex flex-col h-full hover:border-brand-accent transition-colors shadow-sm"
                  >
                    <CardHeader className="flex flex-col space-y-1.5 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-10 h-10 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                          <BookOpen size={20} />
                        </div>
                        <div className="text-[10px] font-semibold text-brand-accent bg-brand-primary border border-brand-border px-2 py-1 rounded">
                          {s.status || "SCHEDULED"}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {s?.title || "Untitled Session"}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-xs text-text-muted mt-2">
                        <Calendar size={12} />
                        <span>
                          {s.date
                            ? new Date(s.date).toLocaleDateString()
                            : "TBD"}
                        </span>
                        <Clock size={12} className="ml-2" />
                        <span>{s.startTime || "--:--"}</span>
                      </div>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-4 flex gap-2">
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/dashboard/${role}/divisions/${divisionId}/bootcamps/${bootcampId}/sessions/${s._id || s.id}`,
                            )
                          }
                          className="w-full text-xs h-9 bg-transparent border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white"
                        >
                          Enter Session Hub
                        </Button>
                        {isStudent && (
                          <Button
                            onClick={() =>
                              navigate(
                                `/dashboard/${role}/divisions/${divisionId}/bootcamps/${bootcampId}/sessions/${s._id || s.id}?openFeedback=1`,
                              )
                            }
                            className="w-full text-xs h-9 bg-brand-accent text-white hover:bg-brand-accent/90"
                          >
                            Give Feedback
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
                {sessions.length === 0 && (
                  <div className="col-span-full text-center py-10 text-text-muted font-black uppercase tracking-widest text-xs">
                    No sessions scheduled.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
