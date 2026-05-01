import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { logout, fetchCurrentUser } from '../features/auth/authSlice';

// Lazy Loaded Pages - Auth
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// Layout
const DashboardLayout = lazy(() => import('../components/layout/DashboardLayout'));

// Dashboards
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const InstructorDashboard = lazy(() => import('../pages/instructor/Dashboard'));
const StudentDashboard = lazy(() => import('../pages/student/Dashboard'));

// Shared Pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const AttendancePage = lazy(() => import('../pages/shared/AttendancePage'));
const SessionPage = lazy(() => import('../pages/sessions/SessionPage'));
const TasksPage = lazy(() => import('../pages/tasks/TasksPage'));

// Admin Pages
const UsersPage = lazy(() => import('../pages/admin/UsersPage'));
const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'));
const AuditPage = lazy(() => import('../pages/admin/AuditPage'));

// Shared Modular Pages
const DivisionsPage = lazy(() => import('../pages/shared/DivisionsPage'));
const BootcampsPage = lazy(() => import('../pages/shared/BootcampsPage'));
const GlobalBootcampsPage = lazy(() => import('../pages/shared/GlobalBootcampsPage'));
const BootcampDetailPage = lazy(() => import('../pages/shared/BootcampDetailPage'));
const GroupsPage = lazy(() => import('../pages/shared/GroupsPage'));
const FeedbackPage = lazy(() => import('../pages/shared/FeedbackPage'));
const NotificationsPage = lazy(() => import('../pages/shared/NotificationsPage'));
const ResourcesPage = lazy(() => import('../pages/shared/ResourcesPage'));
const ProfilePage = lazy(() => import('../pages/shared/ProfilePage'));

// Student / Instructor Pages
const ProgressPage = lazy(() => import('../pages/student/ProgressPage'));
const SubmissionsPage = lazy(() => import('../pages/instructor/SubmissionsPage'));
const SubmissionFormPage = lazy(() => import('../pages/student/SubmissionFormPage'));
const SessionDetailPage = lazy(() => import('../pages/sessions/SessionDetailPage'));

const Logout = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(logout());
  }, [dispatch]);
  return <Navigate to="/login" replace />;
};

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
    const userRoles = (user?.roles || (user?.role ? [user.role] : [])).map(r => r.toUpperCase());
    const targetRole = role.toUpperCase();
    
    const hasRole =
      userRoles.includes(targetRole) ||
      (targetRole === 'ADMIN' && userRoles.includes('SUPER ADMIN'));

    if (!hasRole) return <Navigate to="/dashboard" replace />;
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

  const roles = (user?.roles || (user?.role ? [user.role] : [])).map(r => r.toUpperCase());

  if (roles.includes('SUPER ADMIN') || roles.includes('ADMIN'))
    return <Navigate to="/dashboard/admin/dashboard" replace />;

  if (roles.includes('INSTRUCTOR'))
    return <Navigate to="/dashboard/instructor/dashboard" replace />;

  if (roles.includes('STUDENT') || roles.length > 0)
    return <Navigate to="/dashboard/student/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-primary text-brand-accent font-black tracking-widest text-sm uppercase">
    Loading Module...
  </div>
);

export default function AppRouter() {
  const dispatch = useDispatch() as any;
  const { token, user } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<RoleBasedHome />} />

            {/* Admin */}
            <Route path="admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/users" element={<ProtectedRoute role="ADMIN"><UsersPage /></ProtectedRoute>} />
            <Route path="admin/divisions" element={<ProtectedRoute role="ADMIN"><DivisionsPage /></ProtectedRoute>} />
            <Route path="admin/bootcamps" element={<ProtectedRoute role="ADMIN"><BootcampsPage /></ProtectedRoute>} />
            <Route path="admin/groups" element={<ProtectedRoute role="ADMIN"><GroupsPage /></ProtectedRoute>} />
            <Route path="admin/sessions" element={<ProtectedRoute role="ADMIN"><SessionPage /></ProtectedRoute>} />
            <Route path="admin/sessions/:sessionId" element={<ProtectedRoute role="ADMIN"><SessionDetailPage /></ProtectedRoute>} />
            <Route path="admin/reports" element={<ProtectedRoute role="ADMIN"><ReportsPage /></ProtectedRoute>} />
            <Route path="admin/feedback" element={<ProtectedRoute role="ADMIN"><FeedbackPage /></ProtectedRoute>} />
            <Route path="admin/notifications" element={<ProtectedRoute role="ADMIN"><NotificationsPage /></ProtectedRoute>} />
            <Route path="admin/tasks" element={<ProtectedRoute role="ADMIN"><TasksPage /></ProtectedRoute>} />
            <Route path="admin/audit" element={<ProtectedRoute role="ADMIN"><AuditPage /></ProtectedRoute>} />

            {/* Instructor */}
            <Route path="instructor/dashboard" element={<ProtectedRoute role="INSTRUCTOR"><InstructorDashboard /></ProtectedRoute>} />
            <Route path="instructor/divisions" element={<ProtectedRoute role="INSTRUCTOR"><DivisionsPage /></ProtectedRoute>} />
            <Route path="instructor/bootcamps" element={<ProtectedRoute role="INSTRUCTOR"><GlobalBootcampsPage /></ProtectedRoute>} />
            <Route path="instructor/groups" element={<ProtectedRoute role="INSTRUCTOR"><GroupsPage /></ProtectedRoute>} />
            <Route path="instructor/sessions" element={<ProtectedRoute role="INSTRUCTOR"><SessionPage /></ProtectedRoute>} />
            <Route path="instructor/sessions/:sessionId" element={<ProtectedRoute role="INSTRUCTOR"><SessionDetailPage /></ProtectedRoute>} />
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
            <Route path="student/sessions/:sessionId" element={<ProtectedRoute role="STUDENT"><SessionDetailPage /></ProtectedRoute>} />
            <Route path="student/attendance" element={<ProtectedRoute role="STUDENT"><AttendancePage /></ProtectedRoute>} />
            <Route path="student/resources" element={<ProtectedRoute role="STUDENT"><ResourcesPage /></ProtectedRoute>} />
            <Route path="student/tasks" element={<ProtectedRoute role="STUDENT"><TasksPage /></ProtectedRoute>} />
            <Route path="student/submit" element={<ProtectedRoute role="STUDENT"><SubmissionFormPage /></ProtectedRoute>} />
            <Route path="student/feedback" element={<ProtectedRoute role="STUDENT"><FeedbackPage /></ProtectedRoute>} />
            <Route path="student/group" element={<ProtectedRoute role="STUDENT"><GroupsPage /></ProtectedRoute>} />
            <Route path="groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
            <Route path="student/progress" element={<ProtectedRoute role="STUDENT"><ProgressPage /></ProtectedRoute>} />
            <Route path="student/notifications" element={<ProtectedRoute role="STUDENT"><NotificationsPage /></ProtectedRoute>} />
            
            {/* Global Shared Routes within Dashboard */}
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

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
      </Suspense>
    </BrowserRouter>
  );
}
