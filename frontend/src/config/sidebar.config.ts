export const sidebarConfig: Record<string, { name: string; path: string }[]> = {
  Admin: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Users", path: "/users" },
    { name: "Divisions", path: "/divisions" },
    { name: "Groups", path: "/groups" },
    { name: "Sessions", path: "/sessions" },
    { name: "Reports", path: "/reports" },
    { name: "Announcements", path: "/announcements" },
  ],

  Instructor: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Sessions", path: "/sessions" },
    { name: "Attendance", path: "/attendance" },
    { name: "Resources", path: "/resources" },
    { name: "Tasks", path: "/tasks" },
    { name: "Submissions", path: "/submissions" },
    { name: "Feedback", path: "/feedback" },
  ],

  Student: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Sessions", path: "/sessions" },
    { name: "Attendance", path: "/attendance" },
    { name: "Tasks", path: "/tasks" },
    { name: "Submissions", path: "/submissions" },
    { name: "Feedback", path: "/feedback" },
    { name: "My Group", path: "/group" },
    { name: "Weekly Progress", path: "/progress" },
  ],
};
