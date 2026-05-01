import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { Bell, X, Repeat, Check } from "lucide-react";
import { setActiveRole } from "../../features/auth/authSlice";
import { markNotificationAsRead, markAllAsRead } from "../../features/notifications/notificationSlice";
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
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector(
    (state: RootState) => state.notifications,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string | number) => {
    dispatch(markNotificationAsRead(id as number) as any);
  };

  const handleMarkAll = () => {
    dispatch(markAllAsRead());
  };

  const roles = user?.roles || [];
  const displayRole = activeRole || (roles[0] || "STUDENT");

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-brand-border bg-white shadow-sm shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-6">
      </div>

      <div className="flex items-center gap-4">
        {/* Role Switcher Icon (Only if multi-role) */}
        {roles.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex gap-2 border-brand-border hover:border-brand-accent hover:bg-brand-primary/20 transition-all text-[10px] font-black uppercase tracking-widest px-3">
                <Repeat className="h-3.5 w-3.5 text-brand-accent" />
                Switch: {displayRole}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted px-2 py-1.5">Available Roles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((r) => (
                <DropdownMenuItem 
                  key={r} 
                  onClick={() => {
                    dispatch(setActiveRole(r));
                    // Optional: Navigate to base dashboard of that role
                    const path = r.toLowerCase().replace(' ', '');
                    navigate(`/dashboard/${path}`);
                  }}
                  className="flex items-center justify-between font-bold text-xs uppercase tracking-wider py-2"
                >
                  {r}
                  {displayRole === r && <Check className="h-3.5 w-3.5 text-brand-accent" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notifications Dropdown
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
        </DropdownMenu> */}

        <div className="h-8 w-px bg-brand-border mx-1" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-1 flex items-center gap-3 hover:bg-brand-primary/20 rounded-lg transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-text-main leading-none mb-1">
                  {user?.name}
                </p>
                <p className="text-[9px] text-brand-accent uppercase tracking-[0.2em] font-black">
                  {displayRole === "SUPER ADMIN" ? "Global Admin" : displayRole}
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
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="py-2.5 font-bold text-xs uppercase" onClick={() => navigate("/dashboard/profile")}>
              My Identity
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5 font-bold text-xs uppercase" onClick={() => navigate("/logout")}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
