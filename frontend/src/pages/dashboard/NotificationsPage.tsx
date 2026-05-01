import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { fetchNotifications, markAsRead } from '../../store/notificationSlice';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Info, 
  AlertTriangle,
  MailOpen,
  Calendar,
  Layers,
  CheckCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

export const NotificationsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: notifications, loading } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.is_read) dispatch(markAsRead(n._id));
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'session_update': return <Calendar className="w-4 h-4" />;
      case 'submission_graded': return <CheckCircle2 className="w-4 h-4" />;
      case 'task_assigned': return <Layers className="w-4 h-4" />;
      case 'system': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'session_update': return 'bg-blue-50 text-blue-500';
      case 'submission_graded': return 'bg-emerald-50 text-emerald-500';
      case 'task_assigned': return 'bg-purple-50 text-purple-500';
      case 'system': return 'bg-amber-50 text-amber-500';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-text-muted">
            Communication Center
          </p>
          <h1 className="text-3xl font-black tracking-tight uppercase text-text-main">
            Notifications
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2">
          <CheckCheck size={14} />
          Mark all as read
        </Button>
      </section>

      <div className="max-w-3xl mx-auto space-y-4">
        {loading && notifications.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-brand-primary/50 rounded-xl animate-pulse" />
          ))
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card 
              key={notification._id} 
              className={cn(
                "transition-all duration-200 hover:shadow-md border-brand-border",
                !notification.is_read && "border-l-4 border-l-brand-accent bg-brand-accent/5"
              )}
            >
              <CardContent className="p-5 flex gap-4">
                <div className={cn("w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center", getBgColor(notification.type))}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-text-main leading-tight">{notification.title}</p>
                    <div className="flex items-center gap-2">
                      {!notification.is_read && <Badge variant="success">New</Badge>}
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/50 flex items-center gap-1">
                        <Clock size={10} />
                        {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted font-medium pr-8">{notification.message}</p>
                  
                  {!notification.is_read && (
                    <button 
                      onClick={() => dispatch(markAsRead(notification._id))}
                      className="text-[10px] font-black uppercase tracking-widest text-brand-accent hover:underline mt-2 flex items-center gap-1"
                    >
                      <MailOpen size={10} />
                      Mark as read
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary/50 text-text-muted rounded-full flex items-center justify-center mx-auto">
              <Bell size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-text-main">All Clear!</p>
              <p className="text-xs text-text-muted font-medium mt-1">You're caught up with all notifications.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
