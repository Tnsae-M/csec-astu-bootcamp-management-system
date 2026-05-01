import { Bell, Search, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DropdownMenu, DropdownMenuItem } from '../ui/DropdownMenu';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { logout, setActiveRole } from '../../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchNotifications, markAsRead } from '../../store/notificationSlice';
import { format } from 'date-fns';
import { AppDispatch } from '../../app/store';

export const Navbar = () => {
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const { items: notifications = [] } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-2">
        {user?.role && user.role.length > 1 && user.role.map((r: string) => (
          <button
            key={r}
            onClick={() => dispatch(setActiveRole(r))}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border transition-all ${
              activeRole === r 
                ? 'bg-brand-accent text-white border-brand-accent' 
                : 'bg-white text-text-muted border-brand-border hover:border-brand-accent hover:text-brand-accent'
            }`}
          >
            {r.replace('_', ' ')}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu
          trigger={
            <button className="relative p-2 rounded-full hover:bg-black/5 transition-colors text-text-main">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>}
            </button>
          }
        >
          <div className="w-80 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-brand-border sticky top-0 bg-white z-10 flex justify-between items-center">
              <span className="font-bold text-sm">Notifications</span>
              {unreadCount > 0 && <span className="text-xs bg-brand-accent text-white px-2 py-0.5 rounded-full">{unreadCount}</span>}
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-text-muted">No notifications</div>
            ) : (
              notifications.map((n: any) => (
                <div 
                  key={n._id} 
                  className={`p-3 border-b border-brand-border last:border-0 hover:bg-black/5 cursor-pointer ${!n.is_read ? 'bg-brand-accent/5' : ''}`}
                  onClick={() => { if (!n.is_read) dispatch(markAsRead(n._id)); }}
                >
                  <p className="text-xs font-bold truncate">{n.title}</p>
                  <p className="text-[10px] text-text-muted mt-1 line-clamp-2">{n.message}</p>
                  <p className="text-[9px] text-text-muted mt-1 uppercase opacity-70">
                    {format(new Date(n.createdAt), 'MMM d, h:mm a')}
                  </p>
                </div>
              ))
            )}
          </div>
        </DropdownMenu>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <DropdownMenu
          trigger={
            <button className="w-10 h-10 rounded-full bg-brand-accent border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm uppercase transition-transform active:scale-95">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
          }
        >
          <div className="px-3 py-2 border-b border-brand-border min-w-[160px]">
            <p className="text-xs font-black text-text-main truncate">{user?.name}</p>
            <p className="text-[10px] opacity-50 uppercase tracking-tighter">{activeRole?.replace('_', ' ')}</p>
          </div>

          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut size={14} className="mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
};
