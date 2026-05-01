import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';

export type UserRole = 'SUPER ADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  role?: string; 
  division?: string;
  groupId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  activeRole: string | null;
  isInitializing: boolean;
}

const rawToken = localStorage.getItem('token');
const token = (rawToken && rawToken !== 'null' && rawToken !== 'undefined') ? rawToken : null;
const activeRole = localStorage.getItem('activeRole');

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
  activeRole: activeRole,
  isInitializing: !!token, 
};

// ===== THUNKS =====

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // authService.login returns response.data = { success, message, data: { accessToken, refreshToken, user } }
      // .data here accesses the inner data envelope, giving { accessToken, refreshToken, user }
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.activeRole = null;
      localStorage.removeItem('token');
      localStorage.removeItem('activeRole');
    },
    setActiveRole: (state, action: PayloadAction<string>) => {
      state.activeRole = action.payload.toUpperCase();
      localStorage.setItem('activeRole', action.payload.toUpperCase());
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns: { success, message, data: { accessToken, refreshToken, user } }
        // authService returns response.data, thunk returns response.data (the inner data object)
        // So action.payload = { accessToken, refreshToken, user }
        const rawPayload = action.payload;
        const token = rawPayload.accessToken || rawPayload.token;
        const user = rawPayload.user;
        
        if (token && user) {
          state.isAuthenticated = true;
          state.user = user;
          state.token = token;
          localStorage.setItem('token', token);
          
          // Backend sanitizeUser returns role (singular string), not roles array
          // Normalize to roles array for frontend consistency
          if (state.user && !Array.isArray(state.user.roles)) {
            const legacyRole = state.user.role;
            const rolesArr = Array.isArray(legacyRole) ? legacyRole : [legacyRole || 'STUDENT'];
            state.user.roles = rolesArr.map(r => String(r).toUpperCase());
          }
          
          if (!state.activeRole && state.user?.roles?.[0]) {
            state.activeRole = state.user.roles[0].toUpperCase();
          }
        } else {
          state.isAuthenticated = false;
          state.error = 'Invalid authentication response structure';
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // register may not return a token (email verification required)
        const rawPayload = action.payload;
        const token = rawPayload.accessToken || rawPayload.token;
        const user = rawPayload.user;
        
        if (token && user) {
          state.isAuthenticated = true;
          state.user = user;
          state.token = token;
          localStorage.setItem('token', token);
          if (state.user && !Array.isArray(state.user.roles)) {
            const legacyRole = state.user.role;
            const rolesArr = Array.isArray(legacyRole) ? legacyRole : [legacyRole || 'STUDENT'];
            state.user.roles = rolesArr.map(r => String(r).toUpperCase());
          }
          if (!state.activeRole && state.user?.roles?.[0]) {
            state.activeRole = state.user.roles[0].toUpperCase();
          }
        }
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitializing = false;
        // Backend /auth/me returns { message, data: sanitizedUser }
        // authService returns response.data, thunk returns response.data
        // So action.payload = { message, data: { id, name, email, role, status } }
        const rawPayload = action.payload;
        const user = rawPayload.data || rawPayload;
        
        if (user && user.id) {
          if (!Array.isArray(user.roles)) {
            const legacyRole = user.role;
            const rolesArr = Array.isArray(legacyRole) ? legacyRole : [legacyRole || 'STUDENT'];
            user.roles = rolesArr.map((r: any) => String(r).toUpperCase());
          }
          state.user = user;
          state.isAuthenticated = true;
          if (!state.activeRole && user.roles[0]) {
            state.activeRole = user.roles[0].toUpperCase();
          }
        } else {
          state.isInitializing = false;
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isInitializing = false;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, setActiveRole, clearError } = authSlice.actions;
export default authSlice.reducer;

