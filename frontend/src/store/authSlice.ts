import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../services/auth.service';
import { User } from '../types';

interface AuthState {
  user: User | null;
  activeRole: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const parsedUser = storedUser ? JSON.parse(storedUser) : null;
const storedActiveRole = localStorage.getItem('activeRole');

const initialState: AuthState = {
  user: parsedUser,
  activeRole: storedActiveRole || (parsedUser?.role?.[0] || null),
  token: storedToken || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getMe();
      return data.data;
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
      state.activeRole = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('activeRole');
    },
    setActiveRole: (state, action: PayloadAction<string>) => {
      state.activeRole = action.payload;
      localStorage.setItem('activeRole', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.activeRole = action.payload.user.role[0];
        localStorage.setItem('activeRole', action.payload.user.role[0]);
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, setActiveRole } = authSlice.actions;
export default authSlice.reducer;
