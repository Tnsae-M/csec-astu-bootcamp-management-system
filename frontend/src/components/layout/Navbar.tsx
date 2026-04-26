import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { setSearchTerm } from "../../features/ui/uiSlice";
import { Bell, User, Search, X } from "lucide-react";
import { markAsRead, markAllAsRead } from "../../features/notifications/notificationSlice";
import Logo from "../common/Logo";

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector(
    (state: RootState) => state.notifications,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [localSearch, setLocalSearch] = useState("");

  // Debounce search term update
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [showNotifications, setShowNotifications] = useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleNotificationClick = () => {
    // toggle inline dropdown instead of navigating to a page
    setShowNotifications((s) => !s);
  };

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsRead(id));
  };
  const handleMarkAll = () => {
    dispatch(markAllAsRead());
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-brand-border bg-brand-header shadow-sm shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-10">
        {/* <Logo size="sm" className="hidden lg:flex" /> */}
        {/* <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted group-focus-within:text-brand-accent transition-colors" />
          </div>
          <input
            className="w-[300px] pl-10 pr-4 py-2.5 bg-brand-primary/50 border border-brand-border rounded-xl text-[13px] text-text-main focus:outline-none focus:ring-4 focus:ring-brand-accent/5 transition-all focus:border-brand-accent font-medium shadow-inner"
            placeholder="Search students or resources..."
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div> */}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={containerRef}>
          <button
            onClick={handleNotificationClick}
            className="text-text-muted hover:text-brand-accent transition-colors relative"
            aria-expanded={showNotifications}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-header">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[320px] bg-white rounded-xl shadow-2xl border border-brand-border z-50 overflow-hidden text-sm text-text-main">
              <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-primary">
                <div className="font-black uppercase tracking-wider">System Notifications</div>
                <button onClick={() => setShowNotifications(false)} className="p-1 text-text-muted hover:text-red-600">
                  <X />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="p-4 text-center text-text-muted">No notifications</div>
                )}
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 border-b border-brand-border last:border-0 hover:bg-gray-50 cursor-pointer" onClick={() => handleMarkAsRead(n.id)}>
                    <div className="font-bold">{n.title}</div>
                    <div className="text-[13px] text-text-muted mt-1">{n.text}</div>
                    <div className="text-[11px] text-text-muted mt-2">{n.time}</div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 text-center">
                <button onClick={handleMarkAll} className="text-sm font-black text-brand-accent">MARK ALL AS READ</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-text-main leading-none mb-1">
              {user?.name}
            </p>
            <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium">
              {user?.role === "ADMIN" ? "Admin" : user?.role}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-accent text-white font-black text-sm shadow-md flex items-center justify-center border-2 border-brand-header">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
