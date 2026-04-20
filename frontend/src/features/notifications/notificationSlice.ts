import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: number;
  type: 'SYSTEM' | 'ACADEMIC' | 'GENERAL';
  title: string;
  text: string;
  time: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [
    { id: 1, type: 'SYSTEM', title: 'Security Protocol Updated', text: 'Multi-factor authentication required for all Division Heads.', time: '2h ago', isRead: false },
    { id: 2, type: 'ACADEMIC', title: 'Task Deadline approaching', text: 'Module 3: Modular Architecture due in 24 hours.', time: '5h ago', isRead: false },
    { id: 3, type: 'GENERAL', title: 'New Resources Uploaded', text: 'Check the Library for "Advanced TypeScript Patterns".', time: '1d ago', isRead: true },
  ],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.isRead = true;
      });
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'isRead'>>) => {
      const newId = state.notifications.length > 0 ? Math.max(...state.notifications.map(n => n.id)) + 1 : 1;
      state.notifications.unshift({
        ...action.payload,
        id: newId,
        isRead: false,
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { markAsRead, markAllAsRead, addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
