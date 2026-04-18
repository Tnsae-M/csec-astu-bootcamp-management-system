import { NavLink } from "react-router-dom";
import { sidebarConfig } from "../../config/sidebar.config";
import { useAuthStore } from "../../stores/auth.store";

function Icon({ name }: { name: string }) {
  switch (name) {
    case "Dashboard":
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8V3h-8zM3 21h8v-4H3v4z" fill="currentColor" />
        </svg>
      );
    case "Users":
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
        </svg>
      );
    case "Divisions":
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor" />
        </svg>
      );
    case "Bootcamps":
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13L5 12.18v4.64L12 21l7-4.18v-4.64L12 16z" fill="currentColor" />
        </svg>
      );
    case "Groups":
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" fill="currentColor" />
        </svg>
      );
    case "Sessions":
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 3H3v18h18V3zM8 19H5v-2h3v2zm0-4H5v-2h3v2zm0-4H5V9h3v2zm6 8h-4v-6h4v6zm6 0h-4v-4h4v4z" fill="currentColor" />
        </svg>
      );
    case "Reports":
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 17h2v-6H7v6zm4 0h2v-10h-2v10zm4 0h2v-4h-2v4z" fill="currentColor" />
        </svg>
      );
    case "Announcements":
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L2 9v6c0 1.1.9 2 2 2h7v-9l7-3V3z" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
        </svg>
      );
  }
}

export function Sidebar() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const roleKey = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student";

  const items = sidebarConfig[roleKey] || [];

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-md bg-linear-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-bold shadow-md">
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{user.name}</div>
          <div className="text-xs text-slate-500 capitalize">{roleKey}</div>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex-1 flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium shadow pl-3 border-l-4 border-primary"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
            end
          >
            <span className="w-6 h-6 text-current">
              <Icon name={item.name} />
            </span>
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <div className="text-xs text-slate-500">Logged in as</div>
        <div className="text-sm text-slate-800 font-medium">{user.email}</div>
      </div>
    </aside>
  );
}
