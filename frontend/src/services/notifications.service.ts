import api from '../api/axios';

export const notificationsService = {
  getUserNotifications: async (userId: string) => {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
  },

  markAsRead: async (notificationId: string | number) => {
    const response = await api.patch(`/notifications/${notificationId}`);
    return response.data;
  },

  createNotification: async (data: any) => {
    const response = await api.post('/notifications', data);
    return response.data;
  }
};
