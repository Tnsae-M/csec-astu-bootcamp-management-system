import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { OverviewPage } from '../pages/dashboard/OverviewPage';
import { DivisionsPage } from '../pages/dashboard/DivisionsPage';
import { BootcampsPage } from '../pages/dashboard/BootcampsPage';
import { BootcampDetailPage } from '../pages/dashboard/BootcampDetailPage';
import { SessionDetailPage } from '../pages/dashboard/SessionDetailPage';
import { SessionsPage } from '../pages/dashboard/SessionsPage';
import { AttendancePage } from '../pages/dashboard/AttendancePage';
import { GroupsPage } from '../pages/dashboard/GroupsPage';
import { WeeklyProgressPage } from '../pages/dashboard/WeeklyProgressPage';
import { UsersPage } from '../pages/dashboard/UsersPage';
import { ReportsPage } from '../pages/dashboard/ReportsPage';
import { NotificationsPage } from '../pages/dashboard/NotificationsPage';
import { ProgressPage } from '../pages/dashboard/ProgressPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout><OverviewPage /></DashboardLayout>} />
          <Route path="/dashboard/divisions" element={<DashboardLayout><DivisionsPage /></DashboardLayout>} />
          <Route path="/dashboard/divisions/:divisionId/bootcamps" element={<DashboardLayout><BootcampsPage /></DashboardLayout>} />
          <Route path="/dashboard/divisions/:divisionId/bootcamps/:bootcampId" element={<DashboardLayout><BootcampDetailPage /></DashboardLayout>} />
          <Route path="/dashboard/divisions/:divisionId/bootcamps/:bootcampId/sessions/:sessionId" element={<DashboardLayout><SessionDetailPage /></DashboardLayout>} />
          
          <Route path="/dashboard/sessions" element={<DashboardLayout><SessionsPage /></DashboardLayout>} />
          <Route path="/dashboard/attendance" element={<DashboardLayout><AttendancePage /></DashboardLayout>} />
          <Route path="/dashboard/groups" element={<DashboardLayout><GroupsPage /></DashboardLayout>} />
          <Route path="/dashboard/weekly-progress" element={<DashboardLayout><WeeklyProgressPage /></DashboardLayout>} />

          <Route element={<ProtectedRoute allowedRoles={['admin', 'super admin']} />}>
            <Route path="/dashboard/users" element={<DashboardLayout><UsersPage /></DashboardLayout>} />
            <Route path="/dashboard/reports" element={<DashboardLayout><ReportsPage /></DashboardLayout>} />
          </Route>

          <Route path="/dashboard/notifications" element={<DashboardLayout><NotificationsPage /></DashboardLayout>} />
          <Route path="/dashboard/progress" element={<DashboardLayout><ProgressPage /></DashboardLayout>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
