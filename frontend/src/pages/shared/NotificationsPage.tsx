import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, ShieldAlert, Zap, CheckCircle2 } from 'lucide-react';
import { RootState } from '../../app/store';
import { markAsRead, markAllAsRead } from '../../features/notifications/notificationSlice';
import { cn } from '../../lib/utils';

export default function NotificationsPage() {
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  const filteredNotifications = notifications.filter((n) => 
    n.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">System Notifications</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Centralized Registry & Academic Communication</p>
        </div>
        <button 
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-brand-primary border border-brand-border text-text-main text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-brand-accent hover:text-white transition-all shadow-sm flex items-center gap-2"
        >
          <CheckCircle2 size={14} />
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="geo-card p-12 flex flex-col items-center justify-center text-center">
            <Bell size={48} className="text-text-muted/20 mb-4" />
            <p className="text-text-muted font-bold uppercase tracking-widest text-sm">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((a) => (
            <div 
              key={a.id} 
              className={cn(
                "geo-card p-6 flex items-start space-x-6 group transition-all relative overflow-hidden",
                !a.isRead ? "border-l-4 border-l-brand-accent bg-brand-accent/5" : "hover:border-brand-accent/30"
              )}
            >
               {!a.isRead && (
                 <div className="absolute top-0 right-0 w-20 h-20 bg-brand-accent/5 -rotate-45 translate-x-10 -translate-y-10 group-hover:bg-brand-accent transition-colors" />
               )}
               
               <div className={cn(
                 "w-12 h-12 rounded-xl border flex items-center justify-center transition-all shadow-sm relative z-10",
                 !a.isRead 
                   ? "bg-brand-accent text-white border-brand-accent" 
                   : "bg-brand-primary border-brand-border text-brand-accent group-hover:bg-brand-accent/10"
               )}>
                  {a.type === 'SYSTEM' ? <ShieldAlert size={20} /> : a.type === 'ACADEMIC' ? <Zap size={20} /> : <Bell size={20} />}
               </div>

               <div className="flex-1 relative z-10">
                  <div className="flex justify-between items-start">
                     <div>
                       <h3 className={cn(
                         "font-bold uppercase tracking-tight text-lg transition-colors",
                         !a.isRead ? "text-brand-accent" : "text-text-main group-hover:text-brand-accent"
                       )}>
                         {a.title}
                       </h3>
                       <div className="flex items-center space-x-2 mt-1">
                         <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-brand-primary border border-brand-border text-brand-accent rounded shadow-sm">
                           {a.type}
                         </span>
                         <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                           {a.time}
                         </span>
                       </div>
                     </div>
                     
                     {!a.isRead && (
                       <button 
                         onClick={() => handleMarkAsRead(a.id)}
                         className="text-[10px] font-black text-brand-accent uppercase tracking-widest hover:underline"
                       >
                         Mark as read
                       </button>
                     )}
                  </div>
                  <p className="text-text-muted text-sm mt-3 font-medium leading-relaxed max-w-2xl">{a.text}</p>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
