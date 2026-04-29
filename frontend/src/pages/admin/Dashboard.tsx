import React, { useMemo, useState, useEffect } from "react";
import { 
  Button, 
  Modal, 
  StatCard, 
  Card, 
  FormField, 
  Input, 
  Skeleton 
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Briefcase, 
  Plus, 
  UserPlus, 
  BarChart3, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  Shield,
  Target
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import { usersService } from "@/services/users.service";
import { divisionsService } from "@/services/divisions.service";
import { sessionsService } from "@/services/sessions.service";
import { bootcampsService } from "@/services/bootcamps.service";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { fetchUsers } from "@/features/users/usersSlice";
import { fetchDivisions } from "@/features/divisions/divisionsSlice";
import { fetchSessions } from "@/features/sessions/sessionSlice";
import { fetchBootcamps } from "@/features/bootcamps/bootcampsSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch() as any;

  const { user } = useSelector((state: RootState) => state.auth);
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.users);
  const { divisions, loading: divLoading } = useSelector((state: RootState) => state.divisions);
  const { items: sessions, loading: sessLoading } = useSelector((state: RootState) => state.sessions);
  const { bootcamps, loading: bcLoading } = useSelector((state: RootState) => state.bootcamps);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("sessions");
  const [showAddBootcamp, setShowAddBootcamp] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [bootcampForm, setBootcampForm] = useState({ divisionId: "", name: "", startDate: "", endDate: "" });
  const [sessionForm, setSessionForm] = useState({ title: '', bootcamp: '', date: '', startTime: '', durationH: 1, instructor: '', location: 'TBD' });

  useEffect(() => {
    dispatch(fetchUsers(undefined));
    dispatch(fetchDivisions(undefined));
    dispatch(fetchSessions());
    dispatch(fetchBootcamps());
  }, [dispatch]);

  const usersList = Array.isArray(users) ? users : [];
  const instructorsList = usersList.filter((u: any) => u.roles?.includes('INSTRUCTOR') || u.role === 'INSTRUCTOR');
  
  const divArr = Array.isArray(divisions) ? divisions : [];
  const sessArr = Array.isArray(sessions) ? sessions : [];
  const activeSessions = sessArr.length;

  const bcArr = Array.isArray(bootcamps) ? bootcamps : [];
  const totalBootcamps = bcArr.length;
  
  const avgAttendance = 92;

  const bootcampsPerDivision: Record<string, number> = {};
  divArr.forEach((d: any) => {
    bootcampsPerDivision[d.name] = bcArr.filter((b: any) => (b.divisionId?._id || b.divisionId || b.division) === (d._id || d.id)).length;
  });

  const loading = bcLoading || sessLoading || usersLoading || divLoading;

  const chartData = useMemo(() => {
    const data: { name: string, value: number }[] = [];
    
    if (activeTab === 'sessions') {
      const sessMap: Record<string, number> = {};
      divArr.forEach(d => sessMap[d.name] = 0);
      sessArr.forEach((s: any) => {
        const bootcampObj = s.bootcamp || s.bootcampId;
        const divId = bootcampObj?.divisionId?._id || bootcampObj?.divisionId || bootcampObj?.division;
        const div = divArr.find((d: any) => (d._id || d.id) === divId);
        if (div) sessMap[div.name]++;
      });
      return Object.entries(sessMap).map(([name, value]) => ({ name, value }));
    }

    if (activeTab === 'bootcamps') {
      return Object.entries(bootcampsPerDivision).map(([name, value]) => ({ name, value }));
    }

    if (activeTab === 'users') {
      const userMap: Record<string, number> = {};
      divArr.forEach(d => userMap[d.name] = 0);
      usersList.forEach((u: any) => {
        const div = divArr.find((d: any) => (d._id || d.id) === (u.division || u.divisionId));
        if (div) userMap[div.name]++;
      });
      return Object.entries(userMap).map(([name, value]) => ({ name, value }));
    }

    return data;
  }, [activeTab, divArr, sessArr, usersList, bootcampsPerDivision]);

  const handleCreateBootcamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bootcampForm.divisionId || !bootcampForm.name) return;
    setSubmitting(true);
    try {
      await bootcampsService.createBootcamp(bootcampForm.divisionId, {
        name: bootcampForm.name,
        startDate: bootcampForm.startDate,
        endDate: bootcampForm.endDate,
      });
      toast.success("Bootcamp established successfully");
      setShowAddBootcamp(false);
      dispatch(fetchBootcamps());
    } catch (err) {
      toast.error("Failed to create bootcamp");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sessionsService.createSession(sessionForm);
      toast.success("Session scheduled");
      setShowAddSession(false);
      dispatch(fetchSessions());
    } catch (err) {
      toast.error("Failed to schedule session");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">System Overview</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Administrative control center and global metrics</p>
        </div>

        <div className="flex items-center gap-3">
          {user?.roles?.includes('SUPER ADMIN') && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/admin/users?createAdmin=true')}
              className="border-brand-accent/20 text-brand-accent hover:bg-brand-accent hover:text-white"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Provision Admin
            </Button>
          )}
          <Button onClick={() => setShowAddBootcamp(true)} className="shadow-lg shadow-brand-accent/20">
            <Plus className="mr-2 h-4 w-4" /> New Bootcamp
          </Button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Divisions" value={divArr.length} trend={{ value: 0, isPositive: true }} icon={<Shield />} />
        <StatCard label="Total Students" value={usersList.filter((u: any) => u.roles?.includes('STUDENT') || u.role === 'STUDENT').length} trend={{ value: 12, isPositive: true }} icon={<Users />} />
        <StatCard label="Active Instructors" value={instructorsList.length} trend={{ value: 2, isPositive: true }} icon={<Target />} />
        <StatCard label="Scheduled Sessions" value={activeSessions || 0} icon={<Calendar />} />
      </div>

      {/* CHARTS SECTION */}
      <Card className="overflow-visible border-none bg-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-primary text-brand-accent">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-main uppercase">Engagement Analytics</h3>
              <p className="text-xs text-text-muted font-bold tracking-widest uppercase">Cross-Division Distribution</p>
            </div>
          </div>

          <div className="flex p-1 bg-brand-primary/50 rounded-xl">
            {['sessions', 'bootcamps', 'users'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === t ? "bg-white text-brand-accent shadow-sm" : "text-text-muted hover:text-text-main"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[350px] w-full">
          {loading ? (
            <Skeleton className="w-full h-full rounded-2xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <ChartTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1e40af' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* CREATE BOOTCAMP MODAL */}
      <Modal isOpen={showAddBootcamp} onClose={() => setShowAddBootcamp(false)} title="New Bootcamp" subtitle="Initialize a new curriculum unit." icon={<Plus />}>
        <form onSubmit={handleCreateBootcamp} className="space-y-5">
          <FormField label="Target Division" required>
            <select 
              value={bootcampForm.divisionId} 
              onChange={(e) => setBootcampForm({...bootcampForm, divisionId: e.target.value})} 
              className="w-full px-4 py-2.5 bg-brand-primary/40 border border-transparent rounded-lg text-sm font-medium outline-none focus:border-brand-accent appearance-none"
            >
              <option value="">Select Division Unit</option>
              {divisions.map((d: any) => (
                <option key={d._id || d.id} value={d._id || d.id}>{d.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Bootcamp Name" required>
            <Input 
              value={bootcampForm.name} 
              onChange={(e) => setBootcampForm({...bootcampForm, name: e.target.value})} 
              placeholder="e.g. Advanced Cybersecurity"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Launch Date" required>
              <Input type="date" value={bootcampForm.startDate} onChange={(e) => setBootcampForm({...bootcampForm, startDate: e.target.value})} />
            </FormField>
            <FormField label="Conclusion Date" required>
              <Input type="date" value={bootcampForm.endDate} onChange={(e) => setBootcampForm({...bootcampForm, endDate: e.target.value})} />
            </FormField>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddBootcamp(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={submitting}>{submitting ? 'Processing...' : 'Establish Bootcamp'}</Button>
          </div>
        </form>
      </Modal>

      {/* CREATE SESSION MODAL */}
      <Modal isOpen={showAddSession} onClose={() => setShowAddSession(false)} title="Schedule Session" icon={<Clock />}>
        <form onSubmit={handleCreateSession} className="space-y-4">
          <FormField label="Session Title" required>
            <Input value={sessionForm.title} onChange={(e)=>setSessionForm({...sessionForm, title: e.target.value})} placeholder="e.g. Introduction to Malware Analysis" />
          </FormField>
          
          <FormField label="Parent Bootcamp" required>
            <select value={sessionForm.bootcamp} onChange={(e)=>setSessionForm({...sessionForm, bootcamp: e.target.value})} className="w-full px-4 py-2.5 bg-brand-primary/40 border border-transparent rounded-lg text-sm font-medium outline-none focus:border-brand-accent">
              <option value="">Select Target Bootcamp</option>
              {bcArr.map((b: any) => (<option key={b._id||b.id} value={b._id||b.id}>{b.title||b.name}</option>))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date" required>
              <Input type="date" value={sessionForm.date} onChange={(e)=>setSessionForm({...sessionForm, date: e.target.value})} />
            </FormField>
            <FormField label="Start Time" required>
              <Input type="time" value={sessionForm.startTime} onChange={(e)=>setSessionForm({...sessionForm, startTime: e.target.value})} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Duration (hours)">
              <Input type="number" min={0.5} step={0.5} value={sessionForm.durationH} onChange={(e)=>setSessionForm({...sessionForm, durationH: parseFloat(e.target.value) || 1})} />
            </FormField>
            <FormField label="Location">
              <Input value={sessionForm.location} onChange={(e)=>setSessionForm({...sessionForm, location: e.target.value})} placeholder="e.g. Room 301 or Online" />
            </FormField>
          </div>

          <FormField label="Lead Instructor">
            <select value={sessionForm.instructor} onChange={(e)=>{
              setSessionForm({...sessionForm, instructor: e.target.value});
            }} className="w-full px-4 py-2.5 bg-brand-primary/40 border border-transparent rounded-lg text-sm font-medium outline-none focus:border-brand-accent">
              <option value="">Auto-Assign Later</option>
              {instructorsList.map((ins:any)=>(<option key={ins._id||ins.id} value={ins._id||ins.id}>{ins.name || ins.email}</option>))}
            </select>
          </FormField>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={()=>setShowAddSession(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={submitting}>{submitting ? 'Scheduling...' : 'Confirm Session'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
