import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import uiReducer from '../store/uiSlice';
import divisionsReducer from '../store/divisionSlice';
import bootcampReducer from '../store/bootcampSlice';
import sessionReducer from '../store/sessionSlice';
import attendanceReducer from '../store/attendanceSlice';
import taskReducer from '../store/taskSlice';
import groupReducer from '../store/groupSlice';
import enrollmentReducer from '../store/enrollmentSlice';
import feedbackReducer from '../store/feedbackSlice';
import progressReducer from '../store/progressSlice';
import notificationReducer from '../store/notificationSlice';
import userReducer from '../store/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    divisions: divisionsReducer,
    bootcamps: bootcampReducer,
    sessions: sessionReducer,
    attendance: attendanceReducer,
    tasks: taskReducer,
    groups: groupReducer,
    enrollments: enrollmentReducer,
    feedback: feedbackReducer,
    progress: progressReducer,
    notifications: notificationReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
