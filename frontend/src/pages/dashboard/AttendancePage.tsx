import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { sessionService } from '../../services/all_others.service';
import { Session } from '../../types';
import { 
  CheckSquare, 
  Calendar, 
  Clock, 
  Users,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const AttendancePage = () => {
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const isInstructor = activeRole === 'instructor';

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        setLoading(true);
        const res = await sessionService.getSessions();
        // For instructors, show sessions they are assigned to
        const mySessions = isInstructor 
          ? res.data.filter((s: any) => s.instructor === user?._id || (s.instructor as any)?._id === user?._id)
          : res.data;
        setSessions(mySessions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMySessions();
  }, [user?._id, activeRole, isInstructor]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Attendance Register</h1>
        <p className="text-text-muted font-medium mt-2">Mark student presence for live sessions and track persistence.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-brand-card animate-pulse border border-brand-border rounded-xl" />)}
        </div>
      ) : sessions.length === 0 ? (
        <Card className="border-dashed py-16 text-center">
          <CheckSquare className="mx-auto text-text-muted mb-4 opacity-20" size={48} />
          <h3 className="text-lg font-bold">No Sessions to Mark</h3>
          <p className="text-sm text-text-muted">You have no upcoming or recent sessions assigned for attendance marking.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map(session => (
            <Card key={session._id} className="bg-brand-card hover:border-brand-accent transition-all group border-l-4 border-l-brand-accent">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-brand-accent/5 text-brand-accent border border-brand-accent/10">
                    <span className="text-[10px] font-black uppercase tracking-tighter">Day</span>
                    <span className="text-xl font-black">{format(new Date(session.startTime), 'dd')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">{session.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase">
                        <Clock size={12} className="text-brand-accent" />
                        {format(new Date(session.startTime), 'p')} - {format(new Date(session.endTime), 'p')}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase">
                        <Users size={12} className="text-brand-accent" />
                        85 Students
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right mr-4">
                    <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Status</p>
                    <Badge variant="outline" className="text-[8px] bg-brand-accent/10 border-brand-accent/20 text-brand-accent mt-1">
                      Ready to Mark
                    </Badge>
                  </div>
                  <Link to={`/dashboard/divisions/d1/bootcamps/${typeof session.bootcamp === 'string' ? session.bootcamp : session.bootcamp._id}/sessions/${session._id}`}>
                    <Button className="bg-brand-accent font-black uppercase tracking-widest text-[10px] h-10 px-6 group-hover:scale-105 transition-transform">
                      Mark Now
                      <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="bg-brand-accent/5 p-6 rounded-2xl border border-brand-accent/10 flex items-start gap-4">
        <AlertCircle size={20} className="text-brand-accent shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold uppercase tracking-tight">Business Rule Alert</h4>
          <p className="text-xs text-text-muted font-medium leading-relaxed">
            Attendance records are editable within a 24-hour window from the session end time. Students arriving after 10 minutes of start time must be marked as "Late" as per SRS Section 4.4.
          </p>
        </div>
      </div>
    </div>
  );
};
