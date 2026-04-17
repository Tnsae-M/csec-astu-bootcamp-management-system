import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { AuthSuccessPage } from "../pages/AuthSuccessPage";
import { LoginPage } from "../pages/LoginPage";
import UsersPage from "../pages/UsersPage";

export default function AppRoutes() {
  const user = useAuthStore((state) => state.user);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/auth-success"
        element={
            <AuthSuccessPage />
        }
      />
      <Route
        path="/users"
        element={user ? <UsersPage /> : <Navigate to="/login" replace />}
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