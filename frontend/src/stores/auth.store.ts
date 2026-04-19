import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "../services/auth.service";
import { getStoredRefreshToken } from "../lib/auth-storage";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,
      login: async (email: string, password: string) => {
        set({ error: null });
        const result = await authService.login(email, password);
        set({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, error: null });
      },
      refreshTokens: async () => {
        const refreshToken = get().refreshToken || getStoredRefreshToken();
        if (!refreshToken) {
          throw new Error("Refresh token is missing.");
        }
        const result = await authService.refreshAuthToken(refreshToken);
        set({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
      },
    }),
    {
      name: "bms-auth-storage",
      partialize: (state) =>
        ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }) as AuthState,
    },
  ),
);