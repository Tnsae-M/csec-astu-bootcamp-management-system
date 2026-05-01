import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationsService } from '../../services/notifications.service';

export interface Notification {
  _id?: string;
  id?: string | number;
  type: 'SYSTEM' | 'ACADEMIC' | 'GENERAL';
  title: string;
  text: string;
  time?: string;
  createdAt?: string;
  isRead: boolean;
  user?: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await notificationsService.getUserNotifications(userId);
      return response.notification || response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string | number, { rejectWithValue }) => {
    try {
      await notificationsService.markAsRead(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Optimistic fallback or local only
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => (n._id || n.id) === action.payload);
        if (notification) {
          notification.isRead = true;
        }
      });
  },
});

export const { markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
