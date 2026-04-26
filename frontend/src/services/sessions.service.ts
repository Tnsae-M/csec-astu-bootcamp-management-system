import api from '../api/axios';

export const sessionsService = {
  getSessions: async () => {
    const response = await api.get('/sessions');
    return response.data; // { success, message, data }
  },

  getSessionsByBootcamp: async (bootcampId: string) => {
    const response = await api.get(`/sessions/bootcamp/${bootcampId}`);
    return response.data;
  },

  createSession: async (payload: any) => {
    const response = await api.post('/sessions', payload);
    return response.data;
  }
};