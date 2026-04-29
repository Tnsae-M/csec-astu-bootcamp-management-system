import React, { useEffect } from "react";
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
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from 'react-router-dom';
import { fetchSessions } from "../../features/sessions/sessionSlice";
import { fetchMyEnrollments } from "../../features/enrollments/enrollmentsSlice";

export default function StudentDashboard() {
  const dispatch = useDispatch() as any;
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const { items: sessions, loading: sessionsLoading } = useSelector((state: RootState) => state.sessions);
  const { myEnrollments, myLoading: enrollmentsLoading } = useSelector((state: RootState) => state.enrollments);

  useEffect(() => {
    dispatch(fetchSessions());
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeEnrollments = Array.isArray(myEnrollments) ? myEnrollments : [];

  // Show only the 4 most recent/upcoming sessions
  const upcomingSessions = safeSessions.slice(0, 4);

  // Derive enrolled bootcamp count
  const enrolledCount = safeEnrollments.length;

  const loading = sessionsLoading || enrollmentsLoading;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">My Learning Portal</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">
            Welcome back, {user?.name || 'Student'} — here's your progress at a glance.
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/student/tasks')} className="shadow-lg shadow-brand-accent/20">
          View All Assignments
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* ENROLLED BOOTCAMPS SUMMARY */}
          <Card className="border-none bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-brand-primary text-brand-accent">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-text-main uppercase">My Bootcamps</h3>
                <p className="text-xs text-text-muted font-bold tracking-widest uppercase">Enrolled Tracks</p>
              </div>
            </div>

            {enrollmentsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            ) : safeEnrollments.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <BookOpen className="h-10 w-10 text-brand-accent/30 mb-3" />
                <p className="text-text-muted font-bold text-sm">You are not enrolled in any bootcamp yet.</p>
                <Button
                  variant="outline"
                  className="mt-4 text-xs font-black uppercase tracking-widest"
                  onClick={() => navigate('/dashboard/student/bootcamps')}
                >
                  Browse Bootcamps
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {safeEnrollments.slice(0, 3).map((enrollment: any) => {
                  const bootcamp = typeof enrollment.bootcamp === 'object'
                    ? enrollment.bootcamp
                    : { name: 'Bootcamp', _id: enrollment.bootcamp || enrollment.bootcampId };
                  return (
                    <div
                      key={enrollment._id}
                      className="flex items-center justify-between bg-brand-primary/30 p-4 rounded-2xl border border-transparent hover:border-brand-accent/10 transition-all group cursor-pointer"
                      onClick={() => navigate('/dashboard/student/bootcamps')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-colors">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-text-main text-sm group-hover:text-brand-accent transition-colors">
                            {bootcamp?.name || 'Bootcamp'}
                          </h4>
                          {bootcamp?.division && (
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                              {typeof bootcamp.division === 'object' ? bootcamp.division?.name : bootcamp.division}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={`uppercase tracking-widest text-[9px] px-3 ${
                        enrollment.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-200' :
                        enrollment.status === 'PENDING'  ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        enrollment.status === 'COMPLETED'? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {enrollment.status}
                      </Badge>
                    </div>
                  );
                })}
                {safeEnrollments.length > 3 && (
                  <Button variant="ghost" className="w-full text-xs font-bold text-brand-accent" onClick={() => navigate('/dashboard/student/bootcamps')}>
                    View all {safeEnrollments.length} bootcamps
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </Card>

          {/* UPCOMING SESSIONS */}
          <Card className="border-none bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-brand-primary text-brand-accent">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-text-main uppercase">Class Schedule</h3>
                <p className="text-xs text-text-muted font-bold tracking-widest uppercase">Upcoming Sessions</p>
              </div>
            </div>

            {sessionsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Calendar className="h-10 w-10 text-brand-accent/30 mb-3" />
                <p className="text-text-muted font-bold text-sm">No sessions scheduled yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingSessions.map((s: any) => {
                  const bcName = typeof s.bootcamp === 'object' ? s.bootcamp?.name : (s.bootcamp || '');
                  return (
                    <div key={s._id || s.id} className="p-5 bg-brand-primary/30 rounded-2xl border border-transparent hover:border-brand-accent/20 transition-all flex flex-col justify-between group">
                      <div>
                        <h4 className="font-bold text-text-main group-hover:text-brand-accent transition-colors">{s.title}</h4>
                        {bcName && (
                          <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mt-1">{bcName}</p>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-text-muted font-bold uppercase tracking-wider mt-3">
                          <Clock className="h-3.5 w-3.5" />
                          {s.startTime || s.date?.substring(11, 16) || 'TBD'}
                          {s.location && (
                            <>
                              <span className="text-brand-border mx-1">•</span>
                              <Activity className="h-3.5 w-3.5" />
                              {s.location}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                          s.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                          s.status === 'ONGOING'  ? 'bg-green-100 text-green-700' :
                          s.status === 'COMPLETED'? 'bg-gray-100 text-gray-600' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {s.status || 'UPCOMING'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* SIDEBAR STATS */}
        <div className="space-y-6">
          <StatCard
            label="Enrolled Bootcamps"
            value={enrolledCount}
            icon={<BookOpen />}
            trend={{ value: enrolledCount, isPositive: true }}
          />

          <StatCard
            label="Total Sessions"
            value={safeSessions.length}
            icon={<Calendar />}
            trend={{ value: safeSessions.length, isPositive: true }}
          />

          <Card className="border-none bg-brand-accent text-white p-6 shadow-xl shadow-brand-accent/20">
            <Trophy className="h-8 w-8 mb-4 opacity-50" />
            <h4 className="font-black text-lg uppercase leading-tight">Keep It Up!</h4>
            <p className="text-sm text-white/70 mt-2">
              You have {enrolledCount} active bootcamp{enrolledCount !== 1 ? 's' : ''} and {safeSessions.length} session{safeSessions.length !== 1 ? 's' : ''} available.
            </p>
            <Button
              variant="ghost"
              className="mt-4 w-full text-white border border-white/30 hover:bg-white/10 text-xs font-black uppercase tracking-widest"
              onClick={() => navigate('/dashboard/student/sessions')}
            >
              View Sessions
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
