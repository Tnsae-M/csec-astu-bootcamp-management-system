import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { sessionService } from '../../services/all_others.service';
import { Session } from '../../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export const SessionsPage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchAllSessions = async () => {
      try {
        setLoading(true);
        const res = await sessionService.getSessions();
        setSessions(res.data);
      } catch (err) {
        toast.error('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchAllSessions();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Academic Calendar</h1>
          <p className="text-text-muted font-medium mt-2">Manage and monitor all scheduled bootcamp sessions and workshops.</p>
        </div>
        

      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-brand-card animate-pulse border border-brand-border rounded-2xl" />)}
        </div>
      ) : sessions.length === 0 ? (
        <Card className="border-dashed py-20 text-center">
          <Calendar className="mx-auto text-text-muted mb-4 opacity-20" size={64} />
          <h3 className="text-xl font-bold">No Sessions Scheduled</h3>
          <p className="text-text-muted">The calendar is currently empty.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session._id} className="group bg-brand-card hover:border-brand-accent transition-all overflow-hidden border-2 border-transparent">
              <CardHeader className="relative pb-4">
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5",
                    session.status === 'scheduled' ? "bg-brand-accent" :
                    session.status === 'completed' ? "bg-brand-success" : "bg-brand-danger"
                  )}>
                    {session.status}
                  </Badge>
                </div>
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4">
                  <Calendar size={20} />
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tight line-clamp-1">{session.title}</CardTitle>
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted mt-1 uppercase tracking-widest">
                  <Clock size={12} className="text-brand-accent" />
                  {format(new Date(session.startTime), 'MMM d, h:mm a')}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-text-muted line-clamp-2 font-medium">
                  {session.description || 'No description available for this session.'}
                </p>

                <div className="flex items-center gap-2 text-xs font-bold bg-brand-bg p-3 rounded-xl border border-brand-border group-hover:border-brand-accent/20 transition-colors">
                  {session.location?.toLowerCase().includes('zoom') || session.location?.toLowerCase().includes('meet') ? (
                    <Video size={16} className="text-brand-accent" />
                  ) : (
                    <MapPin size={16} className="text-brand-accent" />
                  )}
                  <span className="truncate">{session.location || 'Location TBD'}</span>
                </div>

                <Link 
                  to={`/dashboard/divisions/d1/bootcamps/${typeof session.bootcamp === 'string' ? session.bootcamp : session.bootcamp._id}/sessions/${session._id}`}
                  className="w-full"
                >
                  <Button className="w-full bg-brand-card border-2 border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white transition-all font-black uppercase tracking-widest text-[10px] h-10 group/btn">
                    Session Analytics
                    <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const cn = (...args: any[]) => args.filter(Boolean).join(' ');
