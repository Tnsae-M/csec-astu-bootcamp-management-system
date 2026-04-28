import React, { useEffect, useState } from "react";
import { 
  Card, 
  Button, 
  Modal, 
  StatCard, 
  Badge, 
  Skeleton,
  FormField,
  Input
} from "@/components/ui";
import {
  Users,
  Calendar,
  CheckCircle2,
  Plus,
  BookOpen,
  ArrowRight,
  Activity,
  Clock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { sessionsService } from '../../services/sessions.service';
import { bootcampsService } from '../../services/bootcamps.service';
import { toast } from "sonner";

export default function InstructorDashboard() {
  const navigate = useNavigate();

  const [totalSessions, setTotalSessions] = useState<number | null>(null);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [engagementScore, setEngagementScore] = useState<number>(88);
  const [todaysSessions, setTodaysSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', bootcampId: '', date: '', time: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessRes, bcRes] = await Promise.all([
        sessionsService.getSessions(),
        bootcampsService.getBootcamps()
      ]);

      const sessArr = Array.isArray(sessRes.data) ? sessRes.data : sessRes.data?.data ?? [];
      setTotalSessions(sessArr.length);
      setTodaysSessions(sessArr.slice(0, 3));

      const bcArr = Array.isArray(bcRes.data) ? bcRes.data : bcRes.data?.data ?? [];
      setBootcamps(bcArr);
      
      // Mock student count for now
      setTotalStudents(124);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load instructor metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sessionsService.createSession(form);
      toast.success("Session scheduled successfully");
      setShowCreate(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to schedule session");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">Instructor Portal</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Monitor teaching schedule and student growth</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shadow-lg shadow-brand-accent/20">
          <Plus className="mr-2 h-4 w-4" /> Schedule Session
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          label="Total Sessions" 
          value={totalSessions || 0} 
          icon={<Calendar />} 
        />
        <StatCard 
          label="Active Students" 
          value={totalStudents || 0} 
          icon={<Users />} 
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          label="Engagement Score" 
          value={engagementScore} 
          suffix="%"
          icon={<Activity />} 
        />
      </div>

      {/* TODAY'S SCHEDULE */}
      <Card className="border-none bg-white p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-brand-primary text-brand-accent">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-text-main uppercase">Today's Schedule</h3>
            <p className="text-xs text-text-muted font-bold tracking-widest uppercase">Upcoming interactions</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : todaysSessions.length === 0 ? (
          <div className="text-center py-10 text-text-muted italic text-sm border-2 border-dashed border-brand-border rounded-2xl">
            No sessions scheduled for today.
          </div>
        ) : (
          <div className="space-y-4">
            {todaysSessions.map(s => (
              <div key={s._id || s.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-brand-primary/30 p-4 rounded-2xl border border-transparent hover:border-brand-accent/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-white px-3 py-2 rounded-xl text-center shadow-sm min-w-[70px]">
                    <div className="text-[10px] font-black text-brand-accent uppercase tracking-tighter">
                      {s.date ? new Date(s.date).toLocaleDateString(undefined, { month: 'short' }) : 'Date'}
                    </div>
                    <div className="text-xl font-black text-text-main leading-none mt-0.5">
                      {s.date ? new Date(s.date).getDate() : '--'}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main group-hover:text-brand-accent transition-colors">
                      {s.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-text-muted font-bold uppercase tracking-wider mt-1">
                      <Clock className="h-3 w-3" /> {s.time || 'TBD'}
                      <span className="text-brand-border">•</span>
                      <BookOpen className="h-3 w-3" /> {s.bootcampId?.name || s.bootcampId?.title || 'Bootcamp'}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 sm:mt-0 text-brand-accent hover:bg-brand-accent hover:text-white"
                  onClick={() => navigate(`/dashboard/instructor/sessions`)}
                >
                  Manage Session
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* CREATE SESSION MODAL */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Session" icon={<Plus />}>
        <form onSubmit={handleCreateSession} className="space-y-5">
          <FormField label="Session Title" required>
            <Input 
              required 
              value={form.title} 
              onChange={e=>setForm({...form, title: e.target.value})} 
              placeholder="e.g. Logic Programming Basics" 
            />
          </FormField>
          
          <FormField label="Parent Bootcamp" required>
            <select 
              required 
              value={form.bootcampId} 
              onChange={e=>setForm({...form, bootcampId: e.target.value})} 
              className="w-full px-4 py-2.5 bg-brand-primary/40 border border-transparent rounded-lg text-sm font-medium outline-none focus:border-brand-accent"
            >
              <option value="">Select Target Bootcamp</option>
              {bootcamps.map(b=>(<option key={b._id||b.id} value={b._id||b.id}>{b.title||b.name}</option>))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date" required>
              <Input required type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} />
            </FormField>
            <FormField label="Time" required>
              <Input required type="time" value={form.time} onChange={e=>setForm({...form, time: e.target.value})} />
            </FormField>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={()=>setShowCreate(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-brand-accent/20">Create Session</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
