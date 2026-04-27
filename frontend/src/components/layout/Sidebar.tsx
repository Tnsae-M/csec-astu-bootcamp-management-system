import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  BookOpen,
  PieChart,
  UserCheck,
  Building2,
  Users2,
  Bell,
  BarChart3,
  FileText,
  Activity,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  ClipboardList,
} from "lucide-react";
import Logo from "../common/Logo";
import { RootState } from "../../app/store";
import { logout, UserRole } from "../../features/auth/authSlice";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

const menuConfig: Record<UserRole, any[]> = {
  ADMIN: [
    { type: 'separator', label: 'Operations' },
    { to: "/dashboard/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/dashboard/admin/divisions", icon: Building2, label: "Divisions" },
    { to: "/dashboard/admin/users", icon: UserCheck, label: "User Directory" },
    { type: 'separator', label: 'Analytics' },
    { to: "/dashboard/admin/reports", icon: BarChart3, label: "System Reports" }
  ],
  "SUPER ADMIN": [
    { type: 'separator', label: 'Global Governance' },
    { to: "/dashboard/admin/dashboard", icon: LayoutDashboard, label: "Master Dashboard" },
    { to: "/dashboard/admin/divisions", icon: Building2, label: "Division Control" },
    { to: "/dashboard/admin/users", icon: UserCheck, label: "Access Management" },
    { type: 'separator', label: 'Insights' },
    { to: "/dashboard/admin/reports", icon: BarChart3, label: "Global Analytics" },
  ],
  INSTRUCTOR: [
    { type: 'separator', label: 'Shortcuts' },
    { to: "/dashboard/instructor/dashboard", icon: Activity, label: "Active Pulse" },
    { type: 'separator', label: 'Daily Activity' },
    { to: "/dashboard/instructor/divisions", icon: Building2, label: "My Divisions" },
    { to: "/dashboard/instructor/sessions", icon: Calendar, label: "Session Hub" },
    { to: "/dashboard/instructor/tasks", icon: CheckSquare, label: "Task Registry" },
    { to: "/dashboard/instructor/groups", icon: Users2, label: "Group Management" },
  ],
  STUDENT: [
    { type: 'separator', label: 'Shortcuts' },
    { to: "/dashboard/student/dashboard", icon: LayoutDashboard, label: "Learning Portal" },
    { type: 'separator', label: 'Daily Activity' },
    { to: "/dashboard/student/divisions", icon: Building2, label: "Enrollments" },
    { to: "/dashboard/student/group", icon: Users, label: "My Squad" },
    { to: "/dashboard/student/sessions", icon: Calendar, label: "Session Feed" },
    { to: "/dashboard/student/tasks", icon: CheckSquare, label: "My Assignments" },
    { type: 'separator', label: 'Milestones' },
    { to: "/dashboard/student/progress", icon: PieChart, label: "Progress DNA" },
  ],
};

export default function Sidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const role = user?.role || "STUDENT";
  const links = menuConfig[role];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          "flex items-center mb-10 transition-all duration-300",
          isCollapsed ? "justify-center" : "px-2",
        )}
      >
        <Logo showText={!isCollapsed} size={isCollapsed ? "sm" : "md"} />
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar">
        <ul className="flex flex-col gap-1.5">
          {links.map((link, idx) => {
            if (link.type === 'separator') {
              return (
                <li key={`sep-${idx}`} className={cn("mt-6 mb-2 px-4", isCollapsed && "px-0 flex justify-center")}>
                   {!isCollapsed ? (
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-accent/60 block">
                       {link.label}
                     </span>
                   ) : (
                     <div className="w-6 h-px bg-brand-border" />
                   )}
                </li>
              );
            }

            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-3 rounded-md transition-all duration-200 group relative",
                      isActive
                        ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20"
                        : "text-text-muted hover:bg-brand-accent/5 hover:text-brand-accent",
                      isCollapsed && "justify-center px-0",
                    )
                  }
                >
                  <link.icon
                    className={cn(
                      "shrink-0",
                      isCollapsed ? "h-5 w-5" : "mr-3 h-4 w-4",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="text-[11px] font-bold uppercase tracking-widest truncate">
                      {link.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-brand-primary">
                      {link.label}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-brand-border">
        <div className="flex flex-col gap-4">
          {/* {!isCollapsed && (
            <div className="px-4 py-3 bg-brand-accent/5 rounded-lg border border-brand-border">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 truncate">
                {user?.name}
              </p>
              <p className="text-[9px] font-black text-brand-accent uppercase tracking-tighter">
                {role}
              </p>
            </div>
          )} */}

          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded text-red-400 hover:bg-red-500/10 transition-colors group relative",
              isCollapsed && "justify-center px-0",
            )}
          >
            <LogOut
              className={cn(
                "shrink-0",
                isCollapsed ? "h-5 w-5" : "mr-3 h-4 w-4",
              )}
            />
            {!isCollapsed && (
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Logout System
              </span>
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                Terminate Session
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-[60] w-12 h-12 bg-brand-accent text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-brand-primary"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-brand-accent/80 backdrop-blur-sm z-[55]"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar (Desktop & Mobile) */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-[56] transition-all duration-300 ease-in-out border-r border-brand-border bg-brand-sidebar flex flex-col p-0 shadow-xl lg:shadow-none h-full h-screen",
          isCollapsed ? "w-[80px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute top-10 -right-4 w-8 h-8 bg-brand-accent text-white rounded-full items-center justify-center border-4 border-brand-primary z-50 transition-all active:scale-95 shadow-xl hover:scale-110"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="flex flex-col h-full py-8 px-4">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
