import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import sessionReducer from '../features/sessions/sessionSlice';
import taskReducer from '../features/tasks/taskSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import usersReducer from '../features/users/usersSlice';
import divisionsReducer from '../features/divisions/divisionsSlice';
import bootcampsReducer from '../features/bootcamps/bootcampsSlice';
import groupsReducer from '../features/groups/groupsSlice';
import enrollmentsReducer from '../features/enrollments/enrollmentsSlice';
import progressReducer from '../features/progress/progressSlice';
import feedbackReducer from '../features/feedback/feedbackSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import uiReducer from '../features/ui/uiSlice';
import bootcampsReducer from '../features/bootcamps/bootcampsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sessions: sessionReducer,
    tasks: taskReducer,
    attendance: attendanceReducer,
    users: usersReducer,
    divisions: divisionsReducer,
    bootcamps: bootcampsReducer,
    groups: groupsReducer,
    enrollments: enrollmentsReducer,
    progress: progressReducer,
    feedback: feedbackReducer,
    notifications: notificationReducer,
    ui: uiReducer,
    bootcamps: bootcampsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
