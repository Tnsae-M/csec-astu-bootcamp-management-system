import api from '../api/axios';

export const resourcesService = {
  getResourcesBySession: async (sessionId: string) => {
    const response = await api.get(`/resources/session/${sessionId}`);
    return response.data; // expected { success, data: [...] }
  },

  uploadResource: async (sessionId: string, formData: FormData) => {
    const response = await api.post(`/resources/session/${sessionId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  downloadResource: async (id: string) => {
    const response = await api.get(`/resources/${id}/download`, { responseType: 'blob' });
    return response.data;
  }
};
