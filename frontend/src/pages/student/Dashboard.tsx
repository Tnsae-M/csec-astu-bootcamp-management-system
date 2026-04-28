import React, { useEffect, useState } from "react";
import { 
  Button, 
  Card, 
  StatCard, 
  Badge, 
  Avatar, 
  AvatarFallback, 
  Skeleton 
} from "@/components/ui";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Trophy, 
  Users, 
  Activity,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios";
import fetchWithFallback from "../../lib/fetchWithFallback";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const upcomingMock = [
    { id: 'S1', title: 'React Hooks Deep Dive', time: '10:00 AM', mode: 'Online', date: '2024-05-15' },
    { id: 'S2', title: 'Express Middleware', time: '14:00', mode: 'In-Person', date: '2024-05-16' },
  ];

  const [upcoming, setUpcoming] = useState(upcomingMock);
  const [attendance, setAttendance] = useState<number>(0);
  const [myGroup, setMyGroup] = useState({ name: '—', lead: '—' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      // Sessions
      const sessionsRes = await fetchWithFallback(() => api.get('/sessions/mine'), upcomingMock);
      if (mounted && sessionsRes?.data) {
        setUpcoming(Array.isArray(sessionsRes.data) ? sessionsRes.data : upcomingMock);
      }

      // Attendance
      const attRes = await fetchWithFallback(() => api.get('/attendance/me'), { percent: 85 });
      if (mounted) setAttendance(attRes?.data?.percent ?? 85);

      // Group
      const grpRes = await fetchWithFallback(() => api.get('/groups/my'), { name: 'Alpha Squad', lead: 'Sarah Connor' });
      if (mounted && grpRes?.data) setMyGroup({ name: grpRes.data.name ?? '—', lead: grpRes.data.lead ?? '—' });
      
      setLoading(false);
    })();

    return () => { mounted = false; };
  }, []);

  const ongoingTask = { title: 'Custom Hook Lab', due: 'Sep 25, 2024', status: 'PENDING' };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">My Learning Portal</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Monitor your academic trajectory and milestones</p>
        </div>
        <Button onClick={() => navigate('/dashboard/student/tasks')} className="shadow-lg shadow-brand-accent/20">
          View All Assignments
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* ONGOING TASKS */}
          <Card className="border-none bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-brand-primary text-brand-accent">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-text-main uppercase">Ongoing Assignment</h3>
                <p className="text-xs text-text-muted font-bold tracking-widest uppercase">Immediate Priority</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-brand-primary/30 p-5 rounded-2xl border border-transparent hover:border-brand-accent/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-text-main group-hover:text-brand-accent transition-colors">
                    {ongoingTask.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-text-muted font-bold mt-1 uppercase tracking-wider">
                    <Clock className="h-3 w-3" /> Due: {ongoingTask.due}
                  </div>
                </div>
              </div>
              <Badge className="mt-4 sm:mt-0 bg-amber-100 text-amber-700 border-amber-200 uppercase tracking-widest text-[9px] px-3">
                {ongoingTask.status}
              </Badge>
            </div>
          </Card>

          {/* UPCOMING SESSIONS */}
          <Card className="border-none bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-brand-primary text-brand-accent">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-text-main uppercase">Class Schedule</h3>
                <p className="text-xs text-text-muted font-bold tracking-widest uppercase">Next 48 Hours</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((s: any) => (
                <div key={s.id} className="p-5 bg-brand-primary/30 rounded-2xl border border-transparent hover:border-brand-accent/20 transition-all flex flex-col justify-between group">
                  <div>
                    <h4 className="font-bold text-text-main group-hover:text-brand-accent transition-colors">{s.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-text-muted font-bold uppercase tracking-wider mt-3">
                      <Clock className="h-3.5 w-3.5" /> {s.time}
                      <span className="text-brand-border mx-1">•</span>
                      <Activity className="h-3.5 w-3.5" /> {s.mode}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* SIDEBAR STATS */}
        <div className="space-y-6">
          <StatCard 
            label="Attendance Rate" 
            value={attendance} 
            suffix="%"
            icon={<CheckCircle2 />} 
            trend={{ value: 5, isPositive: true }}
          />

          <Card className="border-none bg-white p-6">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">My Squad</p>
            <div className="flex items-center gap-4 bg-brand-primary/40 p-4 rounded-2xl">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-brand-accent text-white font-black text-lg">
                  {myGroup.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-bold text-text-main leading-none mb-1">{myGroup.name}</h4>
                <p className="text-[11px] text-brand-accent font-black uppercase tracking-tighter">Lead: {myGroup.lead}</p>
              </div>
            </div>
            
            <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-brand-accent group" onClick={() => navigate('/dashboard/student/group')}>
              View Squad Details
              <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          <Card className="border-none bg-brand-accent text-white p-6 shadow-xl shadow-brand-accent/20">
            <Trophy className="h-8 w-8 mb-4 opacity-50" />
            <h4 className="font-black text-lg uppercase leading-tight">Achievement Unlocked</h4>
            <p className="text-sm text-white/70 mt-2">You've maintained a 90% completion rate this week. Keep it up!</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
