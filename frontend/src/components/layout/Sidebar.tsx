import { 
  Home, 
  Layers, 
  Users, 
  BarChart3, 
  Settings, 
  MessageSquare,
  BookOpen,
  CheckSquare,
  Calendar,
  Users2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const role = activeRole;

  const adminLinks = [
    { label: 'Overview', icon: Home, path: '/dashboard', end: true },
    { label: 'Divisions', icon: Layers, path: '/dashboard/divisions' },
    { label: 'Users', icon: Users, path: '/dashboard/users' },
    { label: 'Reports', icon: BarChart3, path: '/dashboard/reports' },
  ];

  const adminQuick: { label: string, path: string, shortcut: string }[] = [];

  const instructorLinks = [
    { label: 'Overview', icon: Home, path: '/dashboard', end: true },
    { label: 'Divisions', icon: Layers, path: '/dashboard/divisions' },
    { label: 'Attendance', icon: CheckSquare, path: '/dashboard/attendance' },
    { label: 'Groups', icon: Users2, path: '/dashboard/groups' },
  ];

  const instructorQuick = [
    { label: 'Weekly Reports', path: '/dashboard/weekly-progress', shortcut: 'WR' },
  ];

  const studentLinks = [
    { label: 'Overview', icon: Home, path: '/dashboard', end: true },
    { label: 'Divisions', icon: Layers, path: '/dashboard/divisions' },
    { label: 'My Progress', icon: TrendingUp, path: '/dashboard/progress' },
    { label: 'Sessions', icon: Calendar, path: '/dashboard/sessions' },
  ];

  const studentQuick = [
    { label: 'My Group', path: '/dashboard/groups', shortcut: 'GP' },
  ];

  const getLinks = () => {
    if (role === 'admin' || role === 'super admin') return { main: adminLinks, quick: adminQuick };
    if (role === 'instructor') return { main: instructorLinks, quick: instructorQuick };
    return { main: studentLinks, quick: studentQuick };
  };

  const { main, quick } = getLinks();

  return (
    <aside className="w-60 flex-shrink-0 h-full flex flex-col bg-brand-sidebar text-white shadow-xl z-20">
      <div className="p-6 flex items-center gap-2 border-b border-white/10">
        <div className="w-8 h-8 rounded bg-brand-accent flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rotate-45"></div>
        </div>
        <span className="font-black text-lg tracking-tighter">CSEC-ASTU</span>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-8 overflow-y-auto">
        <div className="px-4">
          <p className="sidebar-label opacity-50 mb-4 px-2 tracking-widest uppercase font-black text-[10px]">Main Flow</p>
          <nav className="space-y-1">
            {main.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive 
                    ? "bg-brand-accent text-white border-l-4 border-white shadow-lg shadow-brand-accent/30 font-semibold text-sm" 
                    : "opacity-70 hover:opacity-100 hover:bg-white/5 text-sm font-semibold"
                )}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="px-4">
          <p className="sidebar-label opacity-50 mb-4 px-2 tracking-widest uppercase font-black text-[10px]">Quick Access</p>
          <nav className="space-y-1">
            {quick.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-white/10 text-white font-medium text-xs" 
                    : "opacity-70 hover:opacity-100 hover:bg-white/5 text-xs font-medium"
                )}
              >
                <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[10px]">
                  {link.shortcut}
                </div>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] opacity-50 uppercase tracking-tighter">{activeRole?.replace('_', ' ') || 'Member'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
