import api from '../api/axios';

export const bootcampsService = {
  getBootcamps: async () => {
    const response = await api.get('/bootcamps');
    return response.data; // { success, data }
  },

  getBootcampsByDivision: async (divisionId: string) => {
    const response = await api.get(`/divisions/${divisionId}/bootcamps`);
    return response.data;
  },

  createBootcamp: async (divisionId: string, payload: any) => {
    const response = await api.post(`/divisions/${divisionId}/bootcamps`, payload);
    return response.data;
  },

  getBootcamp: async (id: string) => {
    const response = await api.get(`/bootcamps/${id}`);
    return response.data;
  }
};