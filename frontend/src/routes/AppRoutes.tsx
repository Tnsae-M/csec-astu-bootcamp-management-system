<<<<<<< HEAD
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { AuthSuccessPage } from "../pages/AuthSuccessPage";
import { LoginPage } from "../pages/LoginPage";
import UsersPage from "../pages/UsersPage";
import BootcampsPage from "../pages/BootcampsPage";
import DivisionsPage from "../pages/DivisionsPage";

export default function AppRoutes() {
  const user = useAuthStore((state) => state.user);

  const isAdmin =
    user &&
    (Array.isArray(user.role)
      ? user.role.includes("admin")
      : user.role === "admin");
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth-success" element={<AuthSuccessPage />} />
      <Route
        path="/users"
        element={user ? <UsersPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/bootcamps"
        element={user ? <BootcampsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/divisions"
        element={
          user ? (
            isAdmin ? (
              <DivisionsPage />
            ) : (
              <Navigate to="/auth-success" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/auth-success" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
=======
import { Routes, Route } from "react-router-dom";
import Sessions from "../pages/Sessions";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/sessions" element={<Sessions />} />
        </Routes>
    );
};

export default AppRoutes;
>>>>>>> origin/session-feature
