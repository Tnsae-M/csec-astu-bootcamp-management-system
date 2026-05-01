import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { StatCard } from '../../components/common/StatCard';
import { Layout, Users, Layers, Calendar, CheckSquare, MessageSquare, TrendingUp } from 'lucide-react';
import { fetchDivisions } from '../../store/divisionSlice';
import { fetchUsers } from '../../store/userSlice';
import { fetchNotifications } from '../../store/notificationSlice';
import { fetchBootcamps } from '../../store/bootcampSlice';
import { fetchAllSessions } from '../../store/sessionSlice';

import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { enrollmentService, progressService } from '../../services/all_others.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



export const OverviewPage = () => {
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const { items: divisions = [] } = useSelector((state: RootState) => state.divisions);
  const { users = [] } = useSelector((state: RootState) => state.users);
  const { items: bootcamps = [] } = useSelector((state: RootState) => state.bootcamps);
  const { items: sessions = [] } = useSelector((state: RootState) => state.sessions);
  const dispatch = useDispatch<AppDispatch>();

  const [studentProgress, setStudentProgress] = React.useState<any>(null);

  useEffect(() => {
    dispatch(fetchDivisions());
    dispatch(fetchUsers({}));
    dispatch(fetchNotifications());
    dispatch(fetchBootcamps());
    dispatch(fetchAllSessions());

    if (activeRole === 'student') {
      enrollmentService.getMyEnrollments().then(res => {
        const enrolls = Array.isArray(res) ? res : (res as any).data || [];
        if (enrolls.length > 0) {
          progressService.getMyProgress(enrolls[0].bootcampId || enrolls[0].bootcamp).then(prog => {
            setStudentProgress(prog.data || prog);
          }).catch(console.error);
        }
      }).catch(console.error);
    }
  }, [dispatch, activeRole]);

  const sessionChartData = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);
    sessions.forEach(s => {
      if (s.startTime) {
        const day = new Date(s.startTime).getDay();
        counts[day]++;
      }
    });
    return days.map((day, i) => ({ name: day, sessions: counts[i] }));
  }, [sessions]);

  const handleGenerateReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Compiling system data...',
        success: 'Report generated successfully. Check your email.',
        error: 'Failed to generate report.',
      }
    );
  };

  const isAdmin = activeRole === 'admin' || activeRole === 'super admin';
  const isInstructor = activeRole === 'instructor';
  const isStudent = activeRole === 'student';

  return (
    <div className="space-y-8">
      <section className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-text-muted">
            Management Console
          </p>
          <h1 className="text-3xl font-black tracking-tight uppercase text-text-main">
            System Overview
          </h1>
        </div>
        {!isStudent && (
          <Button className="hidden md:flex" onClick={handleGenerateReport}>
            Generate Report
          </Button>
        )}
      </section>

      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6",
        isStudent ? "lg:grid-cols-3" : "lg:grid-cols-4"
      )}>
        {isAdmin && (
          <>
            <StatCard label="Total Users" value={users.length} icon={Users} trend="12%" trendUp color="accent" />
            <StatCard label="Active Divisions" value={divisions.length} icon={Layers} color="secondary" />
            <StatCard label="Live Bootcamps" value={bootcamps.length} icon={Layout} trend="2" trendUp color="success" />
            <StatCard label="Total Sessions" value={sessions.length} icon={Calendar} color="warning" />
          </>
        )}
        {isInstructor && (
          <>
            <StatCard label="My Sessions" value={sessions.filter(s => (s.instructor as any)?._id === user?._id || s.instructor === user?._id).length} icon={Calendar} trend="3" trendUp color="accent" />
            <StatCard label="Pending Tasks" value="12" icon={CheckSquare} color="warning" />
            <StatCard label="Feedback Rating" value="4.8" icon={MessageSquare} trend="0.2" trendUp color="success" />
            <StatCard label="My Groups" value="2" icon={Users} color="secondary" />
          </>
        )}
        {isStudent && (
          <>
            <StatCard label="My Attendance" value={`${studentProgress?.attendanceRate ?? 0}%`} icon={Calendar} trendUp color="success" />
            <StatCard label="Task Completion" value={`${studentProgress?.taskCompletionRate ?? 0}%`} icon={CheckSquare} color="accent" />
            <StatCard label="Overall Grade" value={`${studentProgress?.avgScore ?? 0}%`} icon={TrendingUp} color="secondary" />
          </>
        )}
      </div>

      {(isAdmin || isStudent) && (
        <Card className="geo-card p-6">
           <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Curriculum Velocity</h3>
                <p className="text-sm text-text-muted font-medium">Weekly session frequency across the program.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary rounded-lg border border-brand-border">
                <Calendar size={14} className="text-brand-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Live Tracking</span>
              </div>
           </div>
           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--text-muted)' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--text-muted)' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="var(--brand-accent)" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: 'var(--brand-accent)', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </Card>
      )}
    </div>
  );
};
