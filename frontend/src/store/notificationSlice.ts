import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Notification } from '../types';
import api from '../api/axios';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
    const res = await api.get('/notification');
    return res.data.data;
});

export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id: string) => {
    const res = await api.patch(`/notification/${id}`);
    return res.data.data;
});

const notificationSlice = createSlice({ 
  name: 'notifications', 
  initialState: { items: [] as Notification[], loading: false }, 
  reducers: {}, 
  extraReducers: (b) => {
    b.addCase(fetchNotifications.pending, (s) => { s.loading = true; });
    b.addCase(fetchNotifications.fulfilled, (s, a) => { 
      s.items = a.payload; 
      s.loading = false;
    });
    b.addCase(fetchNotifications.rejected, (s) => { s.loading = false; });
    b.addCase(markAsRead.fulfilled, (s, a) => {
      const index = s.items.findIndex(n => n._id === a.payload._id);
      if (index !== -1) {
        s.items[index] = a.payload;
      }
    });
  } 
});
export default notificationSlice.reducer;
