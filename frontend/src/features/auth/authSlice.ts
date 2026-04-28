import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'SUPER ADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  role?: string; // primary/active role (derived from roles or chosen by user)
  division?: string;
  groupId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isInitializing: boolean;
}

const rawToken = localStorage.getItem('token');
const token = (rawToken && rawToken !== 'null' && rawToken !== 'undefined') ? rawToken : null;

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
  isInitializing: !!token, // Wait for user fetch if token exists
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      // Ensure a primary `role` is present for compatibility with older code
      const user = action.payload.user;
      if ((!user as any).role && Array.isArray(user.roles) && user.roles.length > 0) {
        (user as any).role = user.roles[0];
      }
      state.user = user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      localStorage.removeItem('token');
    },
    setUser: (state, action: PayloadAction<User>) => {
      const user = action.payload;
      if ((!user as any).role && Array.isArray(user.roles) && user.roles.length > 0) {
        (user as any).role = user.roles[0];
      }
      state.user = user;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    // Allow switching the active role for multi-role users (UI only)
    setActiveRole: (state, action: PayloadAction<string>) => {
      if (state.user) {
        (state.user as any).role = action.payload;
      }
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, setActiveRole, setInitializing } = authSlice.actions;
export default authSlice.reducer;
