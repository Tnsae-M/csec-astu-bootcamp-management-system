import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { setSearchTerm } from "../../features/ui/uiSlice";
import { Bell, Search, X, Repeat, Check } from "lucide-react";
import { setActiveRole } from "../../features/auth/authSlice";
import { markAsRead, markAllAsRead } from "../../features/notifications/notificationSlice";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  Button
} from "@/components/ui";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector(
    (state: RootState) => state.notifications,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [localSearch, setLocalSearch] = useState("");
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAll = () => {
    dispatch(markAllAsRead());
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-brand-border bg-white shadow-sm shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted group-focus-within:text-brand-accent transition-colors" />
          </div>
          <input
            className="w-[280px] pl-9 pr-4 py-1.5 bg-brand-primary/40 border border-transparent rounded-lg text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-accent/10 transition-all focus:bg-white focus:border-brand-accent/30 placeholder:text-text-muted/60"
            placeholder="Search dashboard..."
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-text-muted hover:text-brand-accent transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] p-0 overflow-hidden">
            <DropdownMenuLabel className="px-4 py-3 border-b border-brand-border bg-brand-primary/30 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAll} className="text-[10px] font-bold text-brand-accent hover:underline">
                  Mark all as read
                </button>
              )}
            </DropdownMenuLabel>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-text-muted text-xs">No new notifications</div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem 
                    key={n.id} 
                    className="px-4 py-3 border-b border-brand-border last:border-0 focus:bg-brand-primary/10 flex flex-col items-start gap-1 cursor-pointer"
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    <div className={cn("font-bold text-sm", !n.isRead && "text-brand-accent")}>{n.title}</div>
                    <div className="text-xs text-text-muted line-clamp-2">{n.text}</div>
                    <div className="text-[10px] text-text-muted/60 mt-1">{n.time}</div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-px bg-brand-border mx-1" />

        {/* User & Role Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-1 flex items-center gap-3 hover:bg-brand-primary/20 rounded-lg transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-main leading-none mb-1">
                  {user?.name}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  {user?.role === "ADMIN" ? "Administrator" : user?.role}
                </p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-brand-primary shadow-sm">
                <AvatarImage src="" />
                <AvatarFallback className="bg-brand-accent text-white font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {Array.isArray(user?.roles) && user.roles.length > 1 && (
              <>
                <DropdownMenuLabel className="text-[10px] font-bold text-text-muted uppercase tracking-widest pt-2">
                  Switch Role
                </DropdownMenuLabel>
                {user.roles.map((r) => (
                  <DropdownMenuItem 
                    key={r} 
                    onClick={() => dispatch(setActiveRole(r))}
                    className="flex items-center justify-between"
                  >
                    {r}
                    {user.role === r && <Check className="h-4 w-4 text-brand-accent" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => navigate("/logout")}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
