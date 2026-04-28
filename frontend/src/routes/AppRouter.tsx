import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { setUser, logout, setInitializing } from '../features/auth/authSlice';
import { authService } from '../services/auth.service';

// Pages - Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Dashboards
import AdminDashboard from '../pages/admin/Dashboard';
import InstructorDashboard from '../pages/instructor/Dashboard';
import StudentDashboard from '../pages/student/Dashboard';

// Shared Pages
import LandingPage from '../pages/LandingPage';
import AttendancePage from '../pages/shared/AttendancePage';
import SessionPage from '../pages/sessions/SessionPage';
import TasksPage from '../pages/tasks/TasksPage';

// Admin Pages
import UsersPage from '../pages/admin/UsersPage';
import ReportsPage from '../pages/admin/ReportsPage';
import SettingsPage from '../pages/admin/SettingsPage';

// Shared Modular Pages
import DivisionsPage from '../pages/shared/DivisionsPage';
import BootcampsPage from '../pages/shared/BootcampsPage';
import GlobalBootcampsPage from '../pages/shared/GlobalBootcampsPage';
import BootcampDetailPage from '../pages/shared/BootcampDetailPage';
import GroupsPage from '../pages/shared/GroupsPage';
import FeedbackPage from '../pages/shared/FeedbackPage';
import NotificationsPage from '../pages/shared/NotificationsPage';
import ResourcesPage from '../pages/shared/ResourcesPage';

// Student / Instructor Pages
import ProgressPage from '../pages/student/ProgressPage';
import SubmissionsPage from '../pages/instructor/SubmissionsPage';
import SubmissionFormPage from '../pages/student/SubmissionFormPage';
import SessionDetailPage from '../pages/sessions/SessionDetailPage';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { isAuthenticated, user, isInitializing } = useSelector((state: RootState) => state.auth);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-primary text-brand-accent font-black tracking-widest text-sm uppercase">
        Loading Profile...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (role) {
    const hasRole =
      user?.roles?.includes(role) ||
      (role === 'ADMIN' && user?.roles?.includes('SUPER ADMIN'));

    if (!hasRole) return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const RoleBasedHome = () => {
  const { user, isInitializing } = useSelector((state: RootState) => state.auth);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-primary text-brand-accent font-black tracking-widest text-sm uppercase">
        Loading Session...
      </div>
    );
  }

  const roles = user?.roles || [];

  if (roles.includes('SUPER ADMIN') || roles.includes('ADMIN'))
    return <Navigate to="/dashboard/admin/dashboard" />;

  if (roles.includes('INSTRUCTOR'))
    return <Navigate to="/dashboard/instructor/dashboard" />;

  if (roles.includes('STUDENT'))
    return <Navigate to="/dashboard/student/dashboard" />;

  return <Navigate to="/login" />;
};

export default function AppRouter() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    if (token && !user) {
      authService
        .getCurrentUser()
        .then(response => {
          const backendResponse = response.data || response;
          const fetchedUser = backendResponse.data || backendResponse;

          dispatch(
            setUser({
              id: fetchedUser._id || fetchedUser.id,
              name: fetchedUser.name,
              email: fetchedUser.email,
              roles: fetchedUser.roles
                ? fetchedUser.roles.map((r: string) => r.toUpperCase())
                : fetchedUser.role
                  ? [fetchedUser.role.toUpperCase()]
                  : ['STUDENT'],
              groupId: fetchedUser.groupId || fetchedUser.group || undefined,
            })
          );
        })
        .catch(() => {
          dispatch(logout());
        })
        .finally(() => {
          dispatch(setInitializing(false));
        });
    } else if (!token) {
      dispatch(setInitializing(false));
    }
  }, [token, user, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<RoleBasedHome />} />

          {/* Admin */}
          <Route path="admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute role="ADMIN"><UsersPage /></ProtectedRoute>} />
          <Route path="admin/divisions" element={<ProtectedRoute role="ADMIN"><DivisionsPage /></ProtectedRoute>} />
          <Route path="admin/bootcamps" element={<ProtectedRoute role="ADMIN"><BootcampsPage /></ProtectedRoute>} />
          <Route path="admin/groups" element={<ProtectedRoute role="ADMIN"><GroupsPage /></ProtectedRoute>} />
          <Route path="admin/sessions" element={<ProtectedRoute role="ADMIN"><SessionPage /></ProtectedRoute>} />
          <Route path="admin/reports" element={<ProtectedRoute role="ADMIN"><ReportsPage /></ProtectedRoute>} />
          <Route path="admin/feedback" element={<ProtectedRoute role="ADMIN"><FeedbackPage /></ProtectedRoute>} />
          <Route path="admin/notifications" element={<ProtectedRoute role="ADMIN"><NotificationsPage /></ProtectedRoute>} />
          <Route path="admin/settings" element={<ProtectedRoute role="ADMIN"><SettingsPage /></ProtectedRoute>} />

          {/* Instructor */}
          <Route path="instructor/dashboard" element={<ProtectedRoute role="INSTRUCTOR"><InstructorDashboard /></ProtectedRoute>} />
          <Route path="instructor/divisions" element={<ProtectedRoute role="INSTRUCTOR"><DivisionsPage /></ProtectedRoute>} />
          <Route path="instructor/bootcamps" element={<ProtectedRoute role="INSTRUCTOR"><GlobalBootcampsPage /></ProtectedRoute>} />
          <Route path="instructor/groups" element={<ProtectedRoute role="INSTRUCTOR"><GroupsPage /></ProtectedRoute>} />
          <Route path="instructor/sessions" element={<ProtectedRoute role="INSTRUCTOR"><SessionPage /></ProtectedRoute>} />
          <Route path="instructor/attendance" element={<ProtectedRoute role="INSTRUCTOR"><AttendancePage /></ProtectedRoute>} />
          <Route path="instructor/resources" element={<ProtectedRoute role="INSTRUCTOR"><ResourcesPage /></ProtectedRoute>} />
          <Route path="instructor/tasks" element={<ProtectedRoute role="INSTRUCTOR"><TasksPage /></ProtectedRoute>} />
          <Route path="instructor/submissions" element={<ProtectedRoute role="INSTRUCTOR"><SubmissionsPage /></ProtectedRoute>} />
          <Route path="instructor/feedback" element={<ProtectedRoute role="INSTRUCTOR"><FeedbackPage /></ProtectedRoute>} />
          <Route path="instructor/notifications" element={<ProtectedRoute role="INSTRUCTOR"><NotificationsPage /></ProtectedRoute>} />

          {/* Student */}
          <Route path="student/dashboard" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
          <Route path="student/bootcamps" element={<ProtectedRoute role="STUDENT"><GlobalBootcampsPage /></ProtectedRoute>} />
          <Route path="student/divisions" element={<ProtectedRoute role="STUDENT"><DivisionsPage /></ProtectedRoute>} />
          <Route path="student/sessions" element={<ProtectedRoute role="STUDENT"><SessionPage /></ProtectedRoute>} />
          <Route path="student/attendance" element={<ProtectedRoute role="STUDENT"><AttendancePage /></ProtectedRoute>} />
          <Route path="student/resources" element={<ProtectedRoute role="STUDENT"><ResourcesPage /></ProtectedRoute>} />
          <Route path="student/tasks" element={<ProtectedRoute role="STUDENT"><TasksPage /></ProtectedRoute>} />
          <Route path="student/submit" element={<ProtectedRoute role="STUDENT"><SubmissionFormPage /></ProtectedRoute>} />
          <Route path="student/feedback" element={<ProtectedRoute role="STUDENT"><FeedbackPage /></ProtectedRoute>} />
          <Route path="student/group" element={<ProtectedRoute role="STUDENT"><GroupsPage /></ProtectedRoute>} />
          <Route path="groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
          <Route path="student/progress" element={<ProtectedRoute role="STUDENT"><ProgressPage /></ProtectedRoute>} />
          <Route path="student/notifications" element={<ProtectedRoute role="STUDENT"><NotificationsPage /></ProtectedRoute>} />

          {/* Drill-down & Breadcrumb Catchers */}
          <Route path="student" element={<Navigate to="/dashboard/student/dashboard" replace />} />
          <Route path="admin" element={<Navigate to="/dashboard/admin/dashboard" replace />} />
          <Route path="instructor" element={<Navigate to="/dashboard/instructor/dashboard" replace />} />
          
          <Route path=":role/divisions/:divisionId" element={<Navigate to="bootcamps" replace />} />
          <Route path=":role/divisions/:divisionId/bootcamps" element={<ProtectedRoute><BootcampsPage /></ProtectedRoute>} />
          <Route path=":role/divisions/:divisionId/bootcamps/:bootcampId" element={<ProtectedRoute><BootcampDetailPage /></ProtectedRoute>} />
          <Route path=":role/divisions/:divisionId/bootcamps/:bootcampId/sessions" element={<Navigate to=".." replace />} />
          <Route path=":role/divisions/:divisionId/bootcamps/:bootcampId/sessions/:sessionId" element={<ProtectedRoute><SessionDetailPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
