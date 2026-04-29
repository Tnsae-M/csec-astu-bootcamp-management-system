import api from '../api/axios';

export const attendanceService = {
  markAttendance: async (data: any) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  getSessionAttendance: async (sessionId: string) => {
    const response = await api.get(`/attendance/session/${sessionId}`);
    return response.data;
  },

  getMyAttendance: async () => {
    const response = await api.get('/attendance/me');
    return response.data;
  },
};
