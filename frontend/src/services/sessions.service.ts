import api from '../api/axios';

export const sessionsService = {
  getSessions: async () => {
    const response = await api.get('/sessions');
    return response; // return full axios response so callers can use `res.data`
  },

  getSessionsByBootcamp: async (bootcampId: string) => {
    const response = await api.get(`/sessions/bootcamp/${bootcampId}`);
    return response;
  },

  createSession: async (payload: any) => {
    const response = await api.post('/sessions', payload);
    return response;
  }
  ,
  updateSession: async (id: string, payload: any) => {
    const response = await api.put(`/sessions/${id}`, payload);
    return response;
  },
  deleteSession: async (id: string) => {
    const response = await api.delete(`/sessions/${id}`);
    return response;
  }
};